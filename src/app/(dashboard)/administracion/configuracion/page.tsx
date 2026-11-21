// src/app/(dashboard)/administracion/configuracion/page.tsx
"use client";

import { useState, useEffect } from "react";
import { RefreshCw, AlertCircle, Shield, ShieldOff } from "lucide-react";
import { ConfigCard } from "@/components/admin/ConfigCard";
import { Loader2 } from "lucide-react";

interface ConfigItem {
    clave: string;
    valor: string;
    tipo: string;
    descripcion: string;
}

export default function ConfiguracionPage() {
    const [configs, setConfigs] = useState<ConfigItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Estados para modo mantenimiento
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [maintenanceIps, setMaintenanceIps] = useState("");
    const [loadingMaintenance, setLoadingMaintenance] = useState(false);

    const fetchConfigs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/admin/configuracion");
            if (!response.ok) {
                throw new Error("Error al cargar configuración");
            }
            const data = await response.json();
            setConfigs(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setLoading(false);
        }
    };

    // const fetchMaintenanceStatus = async () => {
    //     try {
    //         const response = await fetch("/api/admin/maintenance");
    //         if (response.ok) {
    //             const data = await response.json();
    //             setMaintenanceMode(data.maintenance_mode);
    //             setMaintenanceIps(data.maintenance_ips || "");
    //         }
    //     } catch (error) {
    //         console.error("Error al obtener estado de mantenimiento:", error);
    //     }
    // };

    useEffect(() => {
        fetchConfigs();
        // fetchMaintenanceStatus();
    }, []);

    const handleSave = async (data: any[]) => {
        setSaving(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await fetch("/api/admin/configuracion", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al guardar configuración");
            }

            setSuccess("Configuración guardada correctamente");
            await fetchConfigs();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al guardar");
        } finally {
            setSaving(false);
        }
    };

    const handleToggleMaintenance = async () => {
        setLoadingMaintenance(true);
        setError(null);
        try {
            const response = await fetch("/api/admin/maintenance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    maintenance_mode: !maintenanceMode,
                    maintenance_ips: maintenanceIps,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al cambiar modo mantenimiento");
            }

            setMaintenanceMode(!maintenanceMode);
            setSuccess(
                !maintenanceMode
                    ? "Modo mantenimiento activado"
                    : "Modo mantenimiento desactivado"
            );
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cambiar modo mantenimiento");
        } finally {
            setLoadingMaintenance(false);
        }
    };

    // Agrupar configuraciones por categoría
    const grupos: Record<string, ConfigItem[]> = {
        "Límites de Créditos": configs.filter(c =>
            c.clave.startsWith("CREDITOS_MAX_")
        ),
        "Promedios": configs.filter(c =>
            c.clave === "PROMEDIO_MINIMO_EXCEPCIONAL"
        ),
        "Estado del Sistema": configs.filter(c =>
            c.clave.startsWith("PREMATRICULA_")
        ),
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="ml-2 text-white/70">Cargando configuración...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Configuración del Sistema</h1>
                    <p className="text-white/50">
                        Administra las reglas y parámetros del proceso de prematrícula
                    </p>
                </div>
                <button
                    onClick={fetchConfigs}
                    className="flex items-center gap-2 px-4 py-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Actualizar
                </button>
            </div>

            {/* Mensajes */}
            {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {success && (
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    {success}
                </div>
            )}

            {/* Nota informativa */}
            <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-4">
                <p className="text-sm text-white/40">
                    Los cambios solo afectan esta demostración en tu navegador. Puedes revertirlos con «Restablecer demo».
                </p>
            </div>

            {/* Cards de Configuración */}
            <div className="grid grid-cols-1 gap-6">
                {Object.entries(grupos).map(([categoria, items]) => {
                    if (items.length === 0) return null;

                    const itemsWithOptions = items.map(item => {
                        if (item.clave === "TIPO_MATRICULA_DEFAULT") {
                            return { ...item, options: ["Regular", "Especial", "Excepcional"] };
                        }
                        return item;
                    });

                    return (
                        <ConfigCard
                            key={categoria}
                            title={categoria}
                            description={`Configuración de ${categoria.toLowerCase()}`}
                            configs={itemsWithOptions}
                            onSave={handleSave}
                            isLoading={saving}
                        />
                    );
                })}
            </div>

            {/* ============================================ */}
            {/* MÓDULO: MODO MANTENIMIENTO */}
            {/* ============================================ */}
            {/* <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                    {maintenanceMode ? (
                        <Shield className="w-6 h-6 text-yellow-400" />
                    ) : (
                        <ShieldOff className="w-6 h-6 text-green-400" />
                    )}
                    <h3 className="text-lg font-semibold text-white">Modo Mantenimiento</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ml-2 ${
                        maintenanceMode
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            : "bg-green-500/20 text-green-400 border border-green-500/30"
                    }`}>
                        {maintenanceMode ? "ACTIVADO" : "DESACTIVADO"}
                    </span>
                </div>

                <p className="text-sm text-white/50 mb-4">
                    Activa el modo mantenimiento para inhabilitar el acceso al sistema.
                    Los usuarios verán una página de mantenimiento profesional.
                    Solo las IPs configuradas podrán acceder al sistema.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 bg-[#121723] rounded-lg p-4 border border-[#353943]">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={maintenanceMode}
                                onChange={handleToggleMaintenance}
                                disabled={loadingMaintenance}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            <span className="ml-3 text-sm text-white/70">
                                {loadingMaintenance ? "Cargando..." : maintenanceMode ? "Activo" : "Inactivo"}
                            </span>
                        </label>
                    </div>

                    <div className="bg-[#121723] rounded-lg p-4 border border-[#353943]">
                        <label className="block text-sm font-medium text-white/70 mb-1">
                            IPs permitidas (separadas por coma)
                        </label>
                        <input
                            type="text"
                            value={maintenanceIps}
                            onChange={(e) => setMaintenanceIps(e.target.value)}
                            placeholder="Ej: 127.0.0.1, 192.168.1.100"
                            className="w-full px-4 py-2 rounded-lg border border-[#353943] bg-[#121723] text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors text-sm"
                            disabled={loadingMaintenance}
                        />
                        <p className="text-xs text-white/30 mt-1">
                            Estas IPs podrán acceder al sistema en modo mantenimiento
                        </p>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#353943] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-white/50">Estado:</span>
                        <span className={maintenanceMode ? "text-yellow-400" : "text-green-400"}>
                            {maintenanceMode ? "🟡 Sistema en mantenimiento" : "🟢 Sistema operativo"}
                        </span>
                    </div>
                    <div className="text-xs text-white/30">
                        {maintenanceMode
                            ? "Los usuarios verán la página de mantenimiento"
                            : "Todos los usuarios pueden acceder normalmente"}
                    </div>
                </div>
            </div> */}
            {/* ============================================ */}

            {/* Si no hay configuraciones agrupadas */}
            {Object.values(grupos).every(g => g.length === 0) && (
                <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-8 text-center">
                    <p className="text-white/40">No hay configuraciones disponibles</p>
                </div>
            )}
        </div>
    );
}
