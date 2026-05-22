import { useState, useRef } from "react"
import { ArrowLeft, Calendar as CalendarIcon, Upload, X } from "lucide-react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import type { ProfileData } from "@/auth/interfaces/profile.dto"
import { Link, useNavigate } from "react-router"
import { useAuthStore } from "@/auth/store/auth.store"
import { updateProfileAction } from "@/auth/actions/updateProfile.action"
import { toast } from "sonner"

const GENDERS = ["M", "F"]

function getInitials(name: string, paternalSurname: string): string {
    return `${name.charAt(0)}${paternalSurname.charAt(0)}`.toUpperCase()
}

interface FormData extends ProfileData {
    password?: string;
}

export function ProfileEditPage() {

    const { user } = useAuthStore();
    const navigate = useNavigate()
    const profile = user!

    const [form, setForm] = useState<FormData>({ ...profile, password: "" })
    const [date, setDate] = useState<Date | undefined>(
        profile?.fecha_nacimiento ? new Date(profile.fecha_nacimiento) : undefined
    )
    const [calendarOpen, setCalendarOpen] = useState(false)
    const [pfpPreview, setPfpPreview] = useState<string | undefined>(profile.foto)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isPosting, setIsPosting] = useState(false)

    function handleChange(field: keyof FormData, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onloadend = () => {
            const result = reader.result as string
            setPfpPreview(result)
            setForm((prev) => ({ ...prev, pfp: result }))
        }
        reader.readAsDataURL(file)
    }

    function handleRemovePfp() {
        setPfpPreview(undefined)
        setForm((prev) => ({ ...prev, pfp: undefined }))
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    function handleDateSelect(selected: Date | undefined) {
        setDate(selected)
        if (selected) {
            setForm((prev) => ({ ...prev, date: selected.toISOString().split("T")[0] }))
        }
        setCalendarOpen(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsPosting(true)

        const ok = await updateProfileAction({
            nombre: form.nombre,
            apellido_paterno: form.apellido_paterno,
            apellido_materno: form.apellido_materno || null,
            email: form.email,
            fecha_nacimiento: form.fecha_nacimiento,
            telefono: form.telefono ? Number(form.telefono) : null,
            genero: form.genero || null,
            foto: form.foto,
            password: form.password || undefined,
        })

        if (ok) {
            toast.success('Perfil actualizado')
            navigate('/profile')
        } else {
            toast.error('No se pudo actualizar el perfil')
            setIsPosting(false)
        }

    }

    const initials = getInitials(
        form.nombre || profile.nombre,
        form.apellido_paterno || profile.apellido_paterno
    )

    return (
        <div className="flex items-center justify-center">
            <div className="w-full max-w-2xl">
                <div className="flex items-center gap-2">
                    <Link to='/profile'>
                        <Button variant="ghost" className="shrink-0">
                            <ArrowLeft />
                        </Button>
                    </Link>
                    <span className="text-sm text-muted-foreground">Volver al perfil</span>
                </div>

                <Card className="overflow-hidden p-0">
                    <CardContent className="grid p-0 md:grid-cols-2">
                        {/* Form column */}
                        <form onSubmit={handleSubmit} className="p-6 md:p-8">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <CardTitle className="text-xl">Editar perfil</CardTitle>
                                    <CardDescription>Actualiza tu información personal</CardDescription>
                                </div>

                                {/* Avatar + Name row */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-end gap-3 w-full">
                                        <div className="grid gap-2 flex-1">
                                            <Label htmlFor="nombre">Nombre</Label>
                                            <Input
                                                id="nombre"
                                                value={form.nombre}
                                                onChange={(e) => handleChange("nombre", e.target.value)}
                                                placeholder="Nombre"
                                                required
                                            />
                                        </div>
                                        {pfpPreview && (
                                            <Avatar className="size-10 shrink-0 border">
                                                <AvatarImage src={`data:image/jpeg;base64,${profile.foto}`} alt="Vista previa" />
                                                <AvatarFallback>{initials}</AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="apellido_paterno">Apellido paterno</Label>
                                            <Input
                                                id="apellido_paterno"
                                                value={form.apellido_paterno}
                                                onChange={(e) => handleChange("apellido_paterno", e.target.value)}
                                                placeholder="Apellido paterno"
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="apellido_materno">Apellido materno</Label>
                                            <Input
                                                id="apellido_materno"
                                                value={form.apellido_materno ?? ""}
                                                onChange={(e) => handleChange("apellido_materno", e.target.value)}
                                                placeholder="Apellido materno"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Date + Gender */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="grid gap-2">
                                        <Label>Fecha de nacimiento</Label>
                                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="w-full justify-start gap-2 font-normal"
                                                >
                                                    <CalendarIcon className="size-4 text-muted-foreground" />
                                                    {date
                                                        ? date.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" })
                                                        : <span className="text-muted-foreground">Selecciona</span>
                                                    }
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    defaultMonth={date}
                                                    captionLayout="dropdown"
                                                    onSelect={handleDateSelect}
                                                    required
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Género</Label>
                                        <Select value={form.genero ?? ""} onValueChange={(v: string) => handleChange("genero", v)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecciona" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {GENDERS.map((g) => (
                                                    <SelectItem key={g} value={g}>{g}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Phone + Photo */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="telefono">Teléfono</Label>
                                        <Input
                                            id="telefono"
                                            type="tel"
                                            value={form.telefono ?? ""}
                                            onChange={(e) => handleChange("telefono", e.target.value)}
                                            placeholder="55 1234 5678"
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

                                <Separator />

                                {/* Email */}
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Correo electrónico</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                        placeholder="correo@ejemplo.com"
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={form.password}
                                        onChange={(e) => handleChange("password", e.target.value)}
                                        placeholder="Nueva contraseña"
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Link to='/profile' className="flex-1">
                                        <Button type="button" variant="outline" >
                                            Cancelar
                                        </Button>
                                    </Link>
                                    <Button type="submit" className="flex-1" disabled={isPosting}>
                                        Guardar cambios
                                    </Button>
                                </div>
                            </div>
                        </form>

                        {/* Visual panel */}
                        <div className="relative hidden bg-muted md:flex flex-col items-center justify-center gap-6 p-8">
                            <div className="absolute inset-0 opacity-10"
                                style={{
                                    backgroundImage: "radial-gradient(circle at 30% 40%, var(--color-primary) 0%, transparent 55%), radial-gradient(circle at 70% 70%, var(--color-ring) 0%, transparent 50%)"
                                }}
                            />
                            <div className="relative flex flex-col items-center gap-4 text-center">
                                <Avatar className="size-24 border-4 border-background shadow-lg ring-2 ring-border">
                                    {pfpPreview && <AvatarImage src={`data:image/jpeg;base64,${profile.foto}`} alt="Vista previa" />}
                                    <AvatarFallback className="text-3xl font-bold text-muted-foreground">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <p className="font-semibold text-foreground">
                                        {[form.nombre, form.apellido_paterno, form.apellido_materno].filter(Boolean).join(" ") || "Tu nombre"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{form.email || "correo@ejemplo.com"}</p>
                                    {form.genero && (
                                        <p className="text-xs text-muted-foreground">{form.genero}</p>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground max-w-[180px] text-balance">
                                    Vista previa de tu perfil actualizado
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
