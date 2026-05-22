import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomLogo } from '@/components/custom/CustomLogo';
import { Link, useNavigate } from 'react-router';
import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Field, FieldLabel } from '@/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { ProfileData } from '@/auth/interfaces/profile.dto';
import { useAuthStore } from '@/auth/store/auth.store';
import { Upload, X } from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [gender, setGender] = useState<string>("")
  const [pfpPreview, setPfpPreview] = useState<string | null>(null)
  const [pfpBase64, setPfpBase64] = useState<string | null>(null); // base64 puro — lo que se envía
  const [isPosting, setIsPosting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)


  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPosting(true);

    const formData = new FormData(event.target as HTMLFormElement)
    const name = formData.get('name') as string;
    const paternalSurname = formData.get('paternalSurname') as string;
    const maternalSurname = formData.get('maternalSurname') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('valores:');
    const profileData: ProfileData = {
      nombre: name,
      apellido_paterno: paternalSurname,
      apellido_materno: maternalSurname,
      email: email,
      fecha_nacimiento: date?.toISOString() ?? '01',
      genero: gender === 'Masculino' ? 'M' : gender === 'Femenino' ? 'F' : undefined,
      telefono: formData.get('phone') ? Number(formData.get('phone')) : undefined,
      foto: pfpBase64 ?? undefined,
    }

    console.log(profileData, { password });

    const isValid = await register(profileData, password);

    if (isValid) {
      toast.message('Ahora inicia sesion');
      navigate('/auth/login');
      return;
    }

    toast.error('Nombre, correo o/y contraseña no validos');
    setIsPosting(false);
  }

  function handleRemovePfp() {
    if (pfpPreview) URL.revokeObjectURL(pfpPreview);
    setPfpPreview(null);
    setPfpBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Preview — URL temporal solo para el <img>
    if (pfpPreview) URL.revokeObjectURL(pfpPreview);
    setPfpPreview(URL.createObjectURL(file));

    // Convertir a base64 puro para enviar a Tomcat
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Quitar prefijo "data:image/jpeg;base64," — Jackson solo acepta base64 puro
      setPfpBase64(result.split(',')[1]);
    };
    reader.readAsDataURL(file);
  };


  return (
    <div className={'flex flex-col gap-6'}>
      <Card className="overflow-hidden p-0  ">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleRegister} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <CustomLogo />

                <p className="text-balance text-muted-foreground">
                  Crea una nueva cuenta
                </p>
              </div>
              {/* NOMBRE */}
              <div className='gap-2 flex flex-col'>
                <div className="flex items-end gap-3 w-full">
                  {/* El div del nombre ahora ocupa todo el ancho disponible gracias a flex-1 */}
                  <div className="grid gap-2 flex-1">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Nombre completo"
                      required
                    />
                  </div>

                  {/* Si hay foto, se renderiza al lado derecho compartiendo la línea base del input */}
                  {pfpPreview && (
                    <Avatar className="h-10 w-10 shrink-0 border p-1 rounded-full">
                      <AvatarImage
                        src={pfpPreview}
                        alt="Profile picture"
                        className="h-full w-full rounded-full object-cover"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  )}
                </div>

                <div className='gap-2 flex'>
                  <div className='gap-2 grid'>
                    <Label htmlFor="paternalSurname">Apellido paterno</Label>
                    <Input
                      id="paternalSurname"
                      type="text"
                      name='paternalSurname'
                      placeholder="Apellido paterno"
                      required
                    />
                  </div>
                  <div className='gap-2 grid'>
                    <Label htmlFor="maternalSurname">Apellido materno</Label>
                    <Input
                      id="maternalSurname"
                      type="text"
                      name='maternalSurname'
                      placeholder="Apellido materno"
                    />
                  </div>
                </div>
              </div>

              {/* EXTRA DATA */}
              <div className='flex flex-col gap-2'>
                <div className='gap-2 flex'>
                  {/* DATE PICKER */}
                  <Field className="grid gap-2">
                    <FieldLabel htmlFor="date">Fecha de Nacimiento</FieldLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date"
                          className="justify-start font-normal"
                        >
                          {date ? date.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }) : "Selecciona una fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          defaultMonth={date}
                          captionLayout="dropdown"
                          required
                          onSelect={(date) => {
                            setDate(date)
                            setOpen(false)
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                  <div className='gap-2 grid'>
                    <Label>Genero</Label>
                    <Combobox
                      value={gender}
                      onValueChange={(value) => setGender(value ?? "")}
                    >
                      <ComboboxInput placeholder="Genero" />
                      <ComboboxContent>
                        <ComboboxList>
                          {genders.map((item) => (
                            <ComboboxItem key={item} value={item}>
                              {item}
                            </ComboboxItem>
                          ))}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-2'>
                  <div className='gap-2 grid'>
                    <Label htmlFor="phone">Telefono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      name='phone'
                      placeholder="55 12 3456 79"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Foto de perfil</Label>
                    <div className="flex gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="default"
                        className="flex-1 gap-1.5 text-xs"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="size-3.5" />
                        {pfpPreview ? "Cambiar" : "Subir"}
                      </Button>
                      {pfpPreview && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={handleRemovePfp}
                          className="shrink-0"
                        >
                          <X />
                        </Button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>


              <div className="grid gap-2">
                <Label htmlFor="email">Correo</Label>
                <Input
                  id="email"
                  type="email"
                  name='email'
                  placeholder="mail@google.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  name='password'
                  required
                  placeholder="Contraseña"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isPosting}>
                Crear cuenta
              </Button>
              <div className="text-center text-sm">
                ¿Ya tienes cuenta?{' '}
                <Link to="/auth/login" className="underline underline-offset-4">
                  Ingresa ahora
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


const genders: string[] = [
  "Masculino",
  "Femenino"
]