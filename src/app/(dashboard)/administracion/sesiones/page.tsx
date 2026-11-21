// src/app/(dashboard)/administracion/sesiones/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Shield } from "lucide-react";
import { SesionesList } from "@/components/admin/SesionesList";

interface Sesion {
    id: string;
    usuario: {
        id: number;
        nombres: string | null;
        apellido_paterno: string | null;
        apellido_materno: string | null;
        correo_inst: string | null;
        codigo_estudiante: string;
        rol: {
            nombre: string;
        };
    };
    ip_address: string | null;
    user_agent: string | null;
    creado_en: Date;
    expires: Date;
    activa: boolean;
    device_info: {
        browser: string;
        os: string;
        device: string;
    };
}

export default function SesionesPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [sesiones, setSesiones] = useState<Sesion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const userRol = session?.user?.rol || "";

    useEffect(() => {
        if (session && userRol !== "administrador") {
            router.push("/administracion/inicio");
        }
    }, [session, userRol, router]);

    const fetchSesiones = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/admin/sesiones");
            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error("No tienes permisos para ver sesiones");
                }
                throw new Error("Error al cargar sesiones");
            }
            const data = await response.json();
            setSesiones(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSesiones();
    }, []);

    const handleRevoke = async (sessionId: string) => {
        try {
            const response = await fetch(`/api/admin/sesiones/${sessionId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Error al revocar sesión");
            }
            await fetchSesiones();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Error al revocar sesión");
        }
    };

    if (session && userRol !== "administrador") {
        return null;
    }

    if (loading && sesiones.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="ml-2 text-white/70">Cargando sesiones...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Shield className="w-6 h-6 text-primary" />
                        Sesiones Activas
                    </h1>
                    <p className="text-white/50">
                        Monitorea y gestiona las sesiones activas de los usuarios
                    </p>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            <button
                onClick={async () => {
                    const response = await fetch("/api/admin/clean-sessions", {
                        method: "POST",
                    });
                    const data = await response.json();
                    alert(data.message);
                    fetchSesiones(); // Recargar lista
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-end"
            >
                Limpiar Sesiones Expiradas
            </button>

            <SesionesList
                sesiones={sesiones}
                loading={loading}
                onRefresh={fetchSesiones}
                onRevoke={handleRevoke}
            />

        </div>
    );
}