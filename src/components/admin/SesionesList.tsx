// src/components/admin/SesionesList.tsx
"use client";

import { useState } from "react";
import { RefreshCw, X, Monitor, Smartphone, Tablet, Globe, User, Shield } from "lucide-react";
import { formatDateTimePeru } from "@/lib/utils/date";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

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

interface SesionesListProps {
    sesiones: Sesion[];
    loading: boolean;
    onRefresh: () => void;
    onRevoke: (id: string) => void;
}

export function SesionesList({ sesiones, loading, onRefresh, onRevoke }: SesionesListProps) {
    const [revokeModalOpen, setRevokeModalOpen] = useState(false);
    const [sessionToRevoke, setSessionToRevoke] = useState<string | null>(null);

    const getDeviceIcon = (device: string) => {
        if (device === 'Mobile') return <Smartphone className="w-4 h-4" />;
        if (device === 'Tablet') return <Tablet className="w-4 h-4" />;
        return <Monitor className="w-4 h-4" />;
    };

    const getRolColor = (rol: string) => {
        const colors: Record<string, string> = {
            estudiante: "text-blue-400",
            secretaria: "text-yellow-400",
            director: "text-purple-400",
            administrador: "text-red-400",
        };
        return colors[rol] || "text-gray-400";
    };

    const getRolLabel = (rol: string) => {
        const labels: Record<string, string> = {
            estudiante: "Estudiante",
            secretaria: "Secretaria",
            director: "Director",
            administrador: "Administrador",
        };
        return labels[rol] || rol;
    };

    const getNombreCompleto = (usuario: Sesion['usuario']) => {
        const partes = [
            usuario.nombres || "",
            usuario.apellido_paterno || "",
            usuario.apellido_materno || "",
        ];
        return partes.filter(Boolean).join(" ") || "Sin nombre";
    };

    const handleRevoke = (id: string) => {
        setSessionToRevoke(id);
        setRevokeModalOpen(true);
    };

    const confirmRevoke = () => {
        if (sessionToRevoke) {
            onRevoke(sessionToRevoke);
            setRevokeModalOpen(false);
            setSessionToRevoke(null);
        }
    };

    const totalSesiones = sesiones.length;
    const usuariosUnicos = new Set(sesiones.map((s) => s.usuario.id)).size;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white/70">Cargando sesiones...</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header con estadísticas */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 bg-[#1d2430] border border-[#353943] rounded-lg px-4 py-2">
                        <Globe className="w-4 h-4 text-primary" />
                        <span className="text-sm text-white/70">Sesiones activas:</span>
                        <span className="text-sm font-bold text-white">{totalSesiones}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#1d2430] border border-[#353943] rounded-lg px-4 py-2">
                        <User className="w-4 h-4 text-primary" />
                        <span className="text-sm text-white/70">Usuarios conectados:</span>
                        <span className="text-sm font-bold text-white">{usuariosUnicos}</span>
                    </div>
                </div>
                <button
                    onClick={onRefresh}
                    className="p-2.5 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            {/* Tabla */}
            <div className="bg-[#1d2430] border border-[#353943] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#121723] border-b border-[#353943]">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                                    Usuario
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider hidden sm:table-cell">
                                    Rol
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider hidden md:table-cell">
                                    Dispositivo
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider hidden lg:table-cell">
                                    IP
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider hidden lg:table-cell">
                                    Conectado desde
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-white/50 uppercase tracking-wider">
                                    Acción
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#353943]">
                            {sesiones.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-white/40">
                                        No hay sesiones activas
                                    </td>
                                </tr>
                            ) : (
                                sesiones.map((sesion) => (
                                    <tr key={sesion.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-xs font-bold text-primary">
                                                        {getNombreCompleto(sesion.usuario).charAt(0) || "U"}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-white truncate max-w-[120px] sm:max-w-[200px]">
                                                        {getNombreCompleto(sesion.usuario)}
                                                    </p>
                                                    <p className="text-xs text-white/30 truncate max-w-[120px] sm:max-w-[200px]">
                                                        {sesion.usuario.correo_inst || sesion.usuario.codigo_estudiante}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 hidden sm:table-cell">
                                            <span className={`text-xs font-medium ${getRolColor(sesion.usuario.rol.nombre)}`}>
                                                {getRolLabel(sesion.usuario.rol.nombre)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <div className="flex items-center gap-2">
                                                {getDeviceIcon(sesion.device_info.device)}
                                                <div>
                                                    <p className="text-xs text-white/70">
                                                        {sesion.device_info.browser}
                                                    </p>
                                                    <p className="text-xs text-white/30">
                                                        {sesion.device_info.os}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <span className="text-xs font-mono text-white/50">
                                                {sesion.ip_address || "N/A"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <span className="text-xs text-white/50">
                                                {formatDateTimePeru(sesion.creado_en)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => handleRevoke(sesion.id)}
                                                className="p-1.5 rounded-lg text-red-400/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                title="Revocar sesión"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pie de tabla */}
                {sesiones.length > 0 && (
                    <div className="px-4 py-3 border-t border-[#353943] bg-[#121723] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="text-xs text-white/30">
                            Mostrando <span className="text-white/50">{sesiones.length}</span> sesiones activas
                        </div>
                        <div className="flex items-center gap-4 text-xs text-white/30">
                            <span>🟢 {sesiones.length} activas</span>
                            <span>👤 {usuariosUnicos} usuarios</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de confirmación para revocar */}
            <ConfirmDeleteModal
                isOpen={revokeModalOpen}
                title="Revocar Sesión"
                message="¿Estás seguro de revocar esta sesión? El usuario será desconectado inmediatamente."
                onConfirm={confirmRevoke}
                onCancel={() => {
                    setRevokeModalOpen(false);
                    setSessionToRevoke(null);
                }}
                isLoading={false}
            />
        </div>
    );
}