import { useState } from "react"
import { Pencil, Trash2, Mail, Phone, Calendar, User, Venus, Mars, CircleUser } from "lucide-react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Link, useNavigate } from "react-router"
import { useAuthStore } from "@/auth/store/auth.store"
import { toast } from "sonner"

function getInitials(name: string, paternalSurname: string): string {
    return `${name.charAt(0)}${paternalSurname.charAt(0)}`.toUpperCase()
}

function formatDate(dateStr: string): string {
    if (!dateStr) return "—"
    const d = new Date(dateStr)
    return d.toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })
}

function GenderIcon({ gender }: { gender?: string }) {
    if (!gender) return <CircleUser className="size-4 text-muted-foreground" />
    const g = gender.toLowerCase()
    if (g === "masculino" || g === "male") return <Mars className="size-4 text-blue-500" />
    if (g === "femenino" || g === "female") return <Venus className="size-4 text-pink-500" />
    return <CircleUser className="size-4 text-muted-foreground" />
}

export function ProfilePage() {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const navigate = useNavigate();

    const { user: profile, deleteProfile } = useAuthStore();
    if (!profile) {
        navigate('/')
        return (<></>)
    }

    const onDeleteProfileClick = async () => {
        const success = await deleteProfile()
        if (success) {
            navigate('/')
            return
        }

        toast.error('No se pudo borrar la cuenta!')

    }

    const fullName = [profile.nombre, profile.apellido_paterno, profile.apellido_materno]
        .filter(Boolean)
        .join(" ")

    return (
        <div className="flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                <Card className="overflow-hidden">
                    {/* Header banner */}
                    <div className="h-28 bg-gradient-to-br from-muted to-accent relative">
                        <div className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage: "radial-gradient(circle at 20% 50%, var(--color-primary) 0%, transparent 60%), radial-gradient(circle at 80% 20%, var(--color-ring) 0%, transparent 50%)"
                            }}
                        />
                    </div>

                    <CardHeader className="pt-0 px-6 pb-4 z-1">
                        {/* Avatar sitting on the banner edge */}
                        <div className="-mt-12 flex items-end justify-between">
                            <Avatar size="lg" className="size-20 border-4 border-background shadow-md ring-2 ring-border bg-white">
                                {profile.foto && <AvatarImage src={`data:image/jpeg;base64,${profile.foto}`} alt={fullName} />}
                                <AvatarFallback className="text-xl font-semibold bg-muted text-muted-foreground">
                                    {getInitials(profile.nombre, profile.apellido_paterno)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex gap-2 pb-1">
                                <Link to='/profile/edit'>
                                    <Button variant="outline" size="sm" className="gap-1.5">
                                        <Pencil />
                                        Editar
                                    </Button>
                                </Link>
                                <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm" className="gap-1.5">
                                            <Trash2 />
                                            Eliminar
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent size="sm">
                                        <AlertDialogHeader>
                                            <AlertDialogMedia>
                                                <Trash2 />
                                            </AlertDialogMedia>
                                            <AlertDialogTitle>¿Eliminar perfil?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esta acción no se puede deshacer. Se eliminará permanentemente tu cuenta y todos tus datos.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction variant="destructive" onClick={onDeleteProfileClick} >
                                                Eliminar
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>

                        {/* Name & gender badge */}
                        <div className="mt-3 flex flex-col gap-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-xl font-semibold leading-none tracking-tight">{fullName}</h2>
                                {profile.genero && (
                                    <Badge variant="secondary" className="gap-1 text-xs">
                                        <GenderIcon gender={profile.genero} />
                                        {profile.genero}
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">{profile.email}</p>
                        </div>
                    </CardHeader>

                    <Separator />

                    <CardContent className="px-6 py-5">
                        <div className="grid gap-4">
                            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Información de contacto
                            </h3>

                            <div className="grid gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                                        <Mail className="size-4 text-muted-foreground" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">Correo electrónico</p>
                                        <p className="text-sm font-medium truncate">{profile.email}</p>
                                    </div>
                                </div>

                                {profile.telefono && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                                            <Phone className="size-4 text-muted-foreground" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-muted-foreground">Teléfono</p>
                                            <p className="text-sm font-medium">{profile.telefono}</p>
                                        </div>
                                    </div>
                                )}

                                {profile.fecha_nacimiento && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                                            <Calendar className="size-4 text-muted-foreground" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-muted-foreground">Fecha de nacimiento</p>
                                            <p className="text-sm font-medium">{formatDate(profile.fecha_nacimiento)}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                                        <User className="size-4 text-muted-foreground" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">Nombre completo</p>
                                        <p className="text-sm font-medium">{fullName}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
