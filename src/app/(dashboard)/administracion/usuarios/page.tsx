// src/app/(dashboard)/administracion/usuarios/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UsuariosList } from "@/components/usuarios/UsuariosList";
import { UsuarioFormModal } from "@/components/usuarios/UsuarioFormModal";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import { PasswordResetModal } from "@/components/usuarios/PasswordResetModal";
import { AlertCircle, Loader2 } from "lucide-react";

interface Usuario {
    id: number;
    codigo_estudiante: string;
    correo_inst: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string | null;
    activo: boolean;
    creado_en: string;
    ultimo_acesso: string | null;
    rol: string;
}

export default function UsuariosPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<Record<string, any>>({});

    // Estados para modales
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [usuarioToDelete, setUsuarioToDelete] = useState<number | null>(null);

    const [resetModalOpen, setResetModalOpen] = useState(false);
    const [usuarioToReset, setUsuarioToReset] = useState<number | null>(null);
    const [newPassword, setNewPassword] = useState<string | null>(null);
    const [usuarioNombre, setUsuarioNombre] = useState("");

    const [isSaving, setIsSaving] = useState(false);

    const userRol = session?.user?.rol || "estudiante";

    // Permisos según rol
    const canCreate = false;
    const canEdit = false;
    const canDelete = false;
    const canResetPassword = false;

    const fetchUsuarios = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append("search", filters.search);
            if (filters.rol) params.append("rol", filters.rol);
            if (filters.activo !== undefined) params.append("activo", String(filters.activo));

            const response = await fetch(`/api/admin/usuarios?${params}`);
            if (!response.ok) {
                throw new Error("Error al cargar usuarios");
            }
            const data = await response.json();
            setUsuarios(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, [filters]);

    const handleFilter = (newFilters: any) => {
        setFilters(newFilters);
    };

    const handleCrear = () => {
        setSelectedUsuario(null);
        setIsEditing(false);
        setModalOpen(true);
    };

    const handleEditar = (usuario: Usuario) => {
        setSelectedUsuario(usuario);
        setIsEditing(true);
        setModalOpen(true);
    };

    const handleGuardar = async (data: any) => {
        setIsSaving(true);
        try {
            const url = isEditing ? `/api/admin/usuarios/${selectedUsuario?.id}` : "/api/admin/usuarios";
            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al guardar");
            }

            await fetchUsuarios();
            setModalOpen(false);
            setSelectedUsuario(null);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Error al guardar");
        } finally {
            setIsSaving(false);
        }
    };

    const handleEliminar = (id: number) => {
        setUsuarioToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!usuarioToDelete) return;
        setIsSaving(true);
        try {
            const response = await fetch(`/api/admin/usuarios/${usuarioToDelete}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al eliminar");
            }
            await fetchUsuarios();
            setDeleteModalOpen(false);
            setUsuarioToDelete(null);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Error al eliminar");
        } finally {
            setIsSaving(false);
        }
    };

    const handleResetPassword = (id: number) => {
        const usuario = usuarios.find((u) => u.id === id);
        if (usuario) {
            setUsuarioToReset(id);
            setUsuarioNombre(getNombreCompleto(usuario));
            setNewPassword(null);
            setResetModalOpen(true);
        }
    };

    const confirmResetPassword = async () => {
        if (!usuarioToReset) return;
        setIsSaving(true);
        try {
            const response = await fetch(`/api/admin/usuarios/${usuarioToReset}/reset-password`, {
                method: "POST",
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al resetear");
            }
            const data = await response.json();
            setNewPassword(data.new_password);
            await fetchUsuarios();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Error al resetear");
            setResetModalOpen(false);
        } finally {
            setIsSaving(false);
        }
    };

    const getNombreCompleto = (usuario: Usuario) => {
        const partes = [
            usuario.nombres || "",
            usuario.apellido_paterno || "",
            usuario.apellido_materno || "",
        ];
        return partes.filter(Boolean).join(" ") || "Sin nombre";
    };

    // Redirigir si no tiene permisos
    if (userRol !== "administrador" && userRol !== "director" && userRol !== "secretaria") {
        router.push("/estudiante/inicio");
        return null;
    }

    if (loading && usuarios.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="ml-2 text-white/70">Cargando usuarios...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
                <p className="text-white/50">
                    Usuarios ficticios de la demostración. Su gestión está deshabilitada.
                </p>
            </div>

            {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            <UsuariosList
                usuarios={usuarios}
                loading={loading}
                onEdit={handleEditar}
                onDelete={handleEliminar}
                onResetPassword={handleResetPassword}
                onRefresh={fetchUsuarios}
                onFilter={handleFilter}
                canCreate={canCreate}
                canEdit={canEdit}
                canDelete={canDelete}
                canResetPassword={canResetPassword}
                userRol={userRol}
                onCrear={handleCrear}
                filters={filters}
            />

            {/* Modal de Crear/Editar */}
            <UsuarioFormModal
                isOpen={modalOpen}
                usuario={selectedUsuario}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedUsuario(null);
                }}
                onSave={handleGuardar}
                isLoading={isSaving}
                userRol={userRol}
                isEditing={isEditing}
            />

            {/* Modal de Confirmación para Eliminar */}
            <ConfirmDeleteModal
                isOpen={deleteModalOpen}
                title="Desactivar Usuario"
                message="¿Estás seguro de desactivar este usuario? Podrá ser reactivado más tarde."
                onConfirm={confirmDelete}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setUsuarioToDelete(null);
                }}
                isLoading={isSaving}
            />

            {/* Modal de Resetear Contraseña */}
            <PasswordResetModal
                isOpen={resetModalOpen}
                onClose={() => {
                    setResetModalOpen(false);
                    setUsuarioToReset(null);
                    setNewPassword(null);
                }}
                onConfirm={confirmResetPassword}
                isLoading={isSaving}
                newPassword={newPassword}
                usuarioNombre={usuarioNombre}
            />
        </div>
    );
}
