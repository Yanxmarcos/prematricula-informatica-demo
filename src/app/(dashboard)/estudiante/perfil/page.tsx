// src/app/(dashboard)/estudiante/perfil/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, Key, Loader2, AlertCircle } from "lucide-react";
import { PerfilForm } from "@/components/perfil/PerfilForm";
import { CambiarPasswordForm } from "@/components/perfil/CambiarPasswordForm";

export default function PerfilPage() {
    const { data: session } = useSession();
    const [usuario, setUsuario] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSavingPerfil, setIsSavingPerfil] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [activeTab, setActiveTab] = useState<"perfil" | "password">("perfil");

    const fetchPerfil = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/estudiante/perfil");
            if (!response.ok) {
                throw new Error("Error al cargar el perfil");
            }
            const data = await response.json();
            setUsuario(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPerfil();
    }, []);

    const handleSavePerfil = async (data: any) => {
        setIsSavingPerfil(true);
        try {
            const response = await fetch("/api/estudiante/perfil", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombres: data.nombres,
                    apellido_paterno: data.apellido_paterno,
                    apellido_materno: data.apellido_materno || "",
                    correo_inst: data.correo_inst || "",
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al actualizar");
            }

            await fetchPerfil();
        } catch (err) {
            throw err;
        } finally {
            setIsSavingPerfil(false);
        }
    };

    const handleChangePassword = async (data: { password_actual: string; password_nueva: string }) => {
        setIsSavingPassword(true);
        try {
            const response = await fetch("/api/estudiante/cambiar-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    password_actual: data.password_actual,
                    password_nueva: data.password_nueva,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al cambiar la contraseña");
            }
        } catch (err) {
            throw err;
        } finally {
            setIsSavingPassword(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="ml-2 text-white/70">Cargando perfil...</span>
            </div>
        );
    }

    if (error || !usuario) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    {error || "Usuario no encontrado"}
                </div>
                <button
                    onClick={fetchPerfil}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
                <p className="text-white/50">
                    Gestiona tu información personal y seguridad
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-[#1d2430] border border-[#353943] rounded-lg p-1">
                <button
                    onClick={() => setActiveTab("perfil")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "perfil"
                        ? "bg-primary text-white"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                        }`}
                >
                    <User className="w-4 h-4" />
                    Datos Personales
                </button>
                <button
                    onClick={() => setActiveTab("password")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "password"
                        ? "bg-primary text-white"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                        }`}
                >
                    <Key className="w-4 h-4" />
                    Cambiar Contraseña
                </button>
            </div>

            {/* Contenido */}
            <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-6">
                {activeTab === "perfil" ? (
                    <PerfilForm
                        usuario={usuario}
                        onSave={handleSavePerfil}
                        isLoading={isSavingPerfil}
                    />
                ) : (
                    <CambiarPasswordForm
                        onSave={handleChangePassword}
                        isLoading={isSavingPassword}
                    />
                )}
            </div>
        </div>
    );
}