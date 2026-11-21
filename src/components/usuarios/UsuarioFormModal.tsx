// src/components/usuarios/UsuarioFormModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";

interface Usuario {
    id: number;
    codigo_estudiante: string;
    correo_inst: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string | null;
    activo: boolean;
    rol: string;
}

interface UsuarioFormModalProps {
    isOpen: boolean;
    usuario?: Usuario | null;
    onClose: () => void;
    onSave: (data: any) => void;
    isLoading?: boolean;
    userRol: string; // Rol del usuario que está haciendo la acción
    isEditing?: boolean;
}

// Campos de texto que deben guardarse siempre en mayúsculas
const CAMPOS_MAYUSCULAS = ["nombres", "apellido_paterno", "apellido_materno"];

export function UsuarioFormModal({
    isOpen,
    usuario,
    onClose,
    onSave,
    isLoading = false,
    userRol,
    isEditing = false,
}: UsuarioFormModalProps) {
    const [formData, setFormData] = useState({
        codigo_estudiante: "",
        correo_inst: "",
        nombres: "",
        apellido_paterno: "",
        apellido_materno: "",
        rol: "estudiante",
        activo: true,
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Opciones de roles según el rol del usuario autenticado
    const getRolOptions = () => {
        if (userRol === "administrador") {
            return [
                { value: "estudiante", label: "Estudiante" },
                { value: "secretaria", label: "Secretaria" },
                { value: "director", label: "Director" },
                { value: "administrador", label: "Administrador" },
            ];
        }
        return [
            { value: "estudiante", label: "Estudiante" },
        ];
    };

    const rolOptions = getRolOptions();

    useEffect(() => {
        if (usuario && isEditing) {
            setFormData({
                codigo_estudiante: usuario.codigo_estudiante || "",
                correo_inst: usuario.correo_inst || "",
                nombres: (usuario.nombres || "").toUpperCase(),
                apellido_paterno: (usuario.apellido_paterno || "").toUpperCase(),
                apellido_materno: (usuario.apellido_materno || "").toUpperCase(),
                rol: usuario.rol || "estudiante",
                activo: usuario.activo !== undefined ? usuario.activo : true,
                password: "",
                confirmPassword: "",
            });
        } else {
            setFormData({
                codigo_estudiante: "",
                correo_inst: "",
                nombres: "",
                apellido_paterno: "",
                apellido_materno: "",
                rol: "estudiante",
                activo: true,
                password: "",
                confirmPassword: "",
            });
        }
        setError(null);
    }, [usuario, isEditing, isOpen]);

    if (!isOpen) return null;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        let value = e.target.value;

        // Solo para el código institucional
        if (name === "codigo_estudiante") {
            value = value.replace(/\D/g, "").slice(0, 10);
        }

        // Nombres y apellidos siempre en mayúsculas
        if (CAMPOS_MAYUSCULAS.includes(name)) {
            value = value.toUpperCase();
        }

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        setError(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validaciones
        if (!formData.codigo_estudiante.trim()) {
            setError("El código de estudiante es requerido");
            return;
        }

        if (!formData.correo_inst.trim()) {
            setError("El correo institucional es requerido");
            return;
        }

        if (!formData.correo_inst.includes("@unitru.edu.pe")) {
            setError("El correo debe ser institucional (@unitru.edu.pe)");
            return;
        }

        if (!formData.nombres.trim()) {
            setError("Los nombres son requeridos");
            return;
        }

        if (!formData.apellido_paterno.trim()) {
            setError("El apellido paterno es requerido");
            return;
        }

        // Validar contraseña solo en creación o si se está cambiando
        if (!isEditing || formData.password) {
            if (!formData.password || formData.password.length < 6) {
                setError("La contraseña debe tener al menos 6 caracteres");
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError("Las contraseñas no coinciden");
                return;
            }
        }

        const dataToSend: any = {
            codigo_estudiante: formData.codigo_estudiante.trim(),
            correo_inst: formData.correo_inst.trim(),
            nombres: formData.nombres.trim(),
            apellido_paterno: formData.apellido_paterno.trim(),
            apellido_materno: formData.apellido_materno.trim() || undefined,
            rol: formData.rol,
            activo: formData.activo,
        };

        if (!isEditing || formData.password) {
            dataToSend.password = formData.password;
        }

        onSave(dataToSend);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[#1d2430] border border-[#353943] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#353943] sticky top-0 bg-[#1d2430] z-10">
                    <h3 className="text-xl font-bold text-white">
                        {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-white/50 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {error && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Código de Estudiante */}
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-1">
                                    Código de Estudiante *
                                </label>
                                <input
                                    type="text"
                                    name="codigo_estudiante"
                                    inputMode="numeric"
                                    maxLength={10}
                                    pattern="[0-9]{10}"
                                    autoComplete="off"
                                    value={formData.codigo_estudiante}
                                    onChange={handleChange}
                                    placeholder="Ej: 0000000003"
                                    className="w-full px-4 py-2.5 rounded-lg border border-[#353943] bg-[#121723] text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Correo Institucional */}
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-1">
                                    Correo Institucional *
                                </label>
                                <input
                                    type="email"
                                    name="correo_inst"
                                    value={formData.correo_inst}
                                    onChange={handleChange}
                                    placeholder="correo@unitru.edu.pe"
                                    className="w-full px-4 py-2.5 rounded-lg border border-[#353943] bg-[#121723] text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
                                    required
                                    autoComplete="off"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Nombres */}
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-1">
                                    Nombres *
                                </label>
                                <input
                                    type="text"
                                    name="nombres"
                                    value={formData.nombres}
                                    onChange={handleChange}
                                    placeholder="Ingresa los nombres"
                                    className="w-full px-4 py-2.5 rounded-lg border border-[#353943] bg-[#121723] text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
                                    required
                                    autoComplete="off"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Apellido Paterno */}
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-1">
                                    Apellido Paterno *
                                </label>
                                <input
                                    type="text"
                                    name="apellido_paterno"
                                    value={formData.apellido_paterno}
                                    onChange={handleChange}
                                    placeholder="Ingresa el apellido paterno"
                                    className="w-full px-4 py-2.5 rounded-lg border border-[#353943] bg-[#121723] text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
                                    required
                                    autoComplete="off"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Apellido Materno */}
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-1">
                                    Apellido Materno *
                                </label>
                                <input
                                    type="text"
                                    name="apellido_materno"
                                    value={formData.apellido_materno}
                                    onChange={handleChange}
                                    placeholder="Ingresa el apellido materno"
                                    className="w-full px-4 py-2.5 rounded-lg border border-[#353943] bg-[#121723] text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
                                    required
                                    autoComplete="off"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Rol */}
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-1">
                                    Rol *
                                </label>
                                <select
                                    name="rol"
                                    value={formData.rol}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-[#353943] bg-[#121723] text-white focus:outline-none focus:border-primary transition-colors"
                                    disabled={isLoading || (isEditing && userRol !== "administrador")}
                                >
                                    {rolOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {isEditing && userRol !== "administrador" && (
                                    <p className="text-xs text-white/30 mt-1">
                                        No puedes cambiar el rol de un usuario
                                    </p>
                                )}
                            </div>

                            {/* Contraseña */}
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-1">
                                    {isEditing ? "Nueva Contraseña (opcional)" : "Contraseña *"}
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="off"
                                    placeholder={isEditing ? "Dejar vacío para mantener" : "Mínimo 6 caracteres"}
                                    className="w-full px-4 py-2.5 rounded-lg border border-[#353943] bg-[#121723] text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
                                    required={!isEditing}
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Confirmar Contraseña */}
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-1">
                                    Confirmar Contraseña {!isEditing && "*"}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirma la contraseña"
                                        autoComplete="off"
                                        className="w-full px-4 py-2.5 rounded-lg border border-[#353943] bg-[#121723] text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
                                        required={!isEditing}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/50 transition-colors"
                                    >
                                        {showPassword ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                            </div>

                            {/* Estado Activo (solo en edición) */}
                            {isEditing && (
                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        name="activo"
                                        checked={formData.activo}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-[#353943] bg-[#121723] text-primary focus:ring-primary"
                                        disabled={isLoading}
                                    />
                                    <label className="text-sm text-white/70">
                                        Usuario activo
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-[#353943]">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="px-4 py-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
