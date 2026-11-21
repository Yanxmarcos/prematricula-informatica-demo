// src/components/perfil-admin/PerfilForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Save, User, Mail, Hash, AlertCircle, Check } from "lucide-react";

interface PerfilFormProps {
    usuario: {
        id: number;
        correo_inst: string;
        codigo_estudiante: string;
        nombres: string;
        apellido_paterno: string;
        apellido_materno: string | null;
        rol: {
            nombre: string
        }
    };
    onSave: (data: any) => Promise<void>;
    isLoading?: boolean;
}

export function PerfilFormAdmin({ usuario, onSave, isLoading = false }: PerfilFormProps) {
    const [formData, setFormData] = useState({
        nombres: usuario.nombres || "",
        apellido_paterno: usuario.apellido_paterno || "",
        apellido_materno: usuario.apellido_materno || "",
        correo_inst: usuario.correo_inst || "",
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!success && usuario) {
            setFormData({
                nombres: usuario.nombres || "",
                apellido_paterno: usuario.apellido_paterno || "",
                apellido_materno: usuario.apellido_materno || "",
                correo_inst: usuario.correo_inst || "",
            });
        }
    }, [usuario]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Validaciones por campo
        if (name === "correo_inst") {
            // Validación básica de email
            setFormData((prev) => ({ ...prev, [name]: value }));
        } else if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value) || value === "") {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        // Limpiar mensajes al editar
        setError(null);
        setSuccess(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsSaving(true);

        if (!formData.nombres.trim() || !formData.apellido_paterno.trim()) {
            setError("Nombres y apellido paterno son requeridos");
            setIsSaving(false);
            return;
        }

        // Validar email si se está actualizando
        if (formData.correo_inst && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo_inst)) {
            setError("Correo institucional inválido");
            setIsSaving(false);
            return;
        }

        try {
            await onSave(formData);
            setSuccess("Datos actualizados correctamente");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al guardar");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {success && (
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm">
                    <Check className="w-5 h-5" />
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    {/* <label className="block text-sm font-medium text-white/70 mb-1">
                        Nombres
                    </label>
                    <input
                        type="text"
                        name="nombres"
                        value={formData.nombres}
                        onChange={handleChange}
                        placeholder="Ingresa tus nombres"
                        className="w-full px-4 py-2.5 rounded-lg border border-[#353943] bg-[#121723] text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
                        required
                        readOnly
                        disabled={isSaving || isLoading}
                    /> */}
                    <label className="block text-sm font-medium text-white/70 mb-1">
                        Nombres
                    </label>
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#353943] bg-[#121723]/50 text-white/50 cursor-not-allowed">
                        <span>{formData.nombres || "-"}</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">
                        Apellido Paterno
                    </label>
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#353943] bg-[#121723]/50 text-white/50 cursor-not-allowed">
                        <span>{formData.apellido_paterno || "-"}</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">
                        Apellido Materno
                    </label>
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#353943] bg-[#121723]/50 text-white/50 cursor-not-allowed">
                        <span>{formData.apellido_materno || "-"}</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">
                        Correo Institucional
                    </label>
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#353943] bg-[#121723]/50 text-white/50 cursor-not-allowed">
                        <span>{formData.correo_inst || "-"}</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">
                        Código de Ingreso
                    </label>
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#353943] bg-[#121723]/50 text-white/50 cursor-not-allowed">
                        <Hash className="w-4 h-4 text-white/30" />
                        <span>{usuario.codigo_estudiante || "N/A"}</span>
                    </div>
                    {/* <p className="text-xs text-white/30 mt-1">No se puede modificar</p> */}
                </div>
                <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">
                        Rol en el sistema
                    </label>
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#353943] bg-[#121723]/50 text-white/50 cursor-not-allowed">
                        <span>{usuario.rol.nombre ? usuario.rol.nombre.charAt(0).toUpperCase() + usuario.rol.nombre.slice(1).toLowerCase() : "N/A"}</span>
                    </div>
                    {/* <p className="text-xs text-white/30 mt-1">No se puede modificar</p> */}
                </div>
            </div>

            {/* <div className="flex justify-end pt-4 border-t border-[#353943]">
                <button
                    type="submit"
                    disabled={isSaving || isLoading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Guardando..." : "Guardar Cambios"}
                </button>
            </div> */}
        </form>
    );
}