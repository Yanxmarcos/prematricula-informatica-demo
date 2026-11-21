// src/components/perfil-admin/CambiarPasswordForm.tsx
"use client";

import { useState } from "react";
import { Key, AlertCircle, Check, Eye, EyeOff } from "lucide-react";

interface CambiarPasswordFormProps {
    onSave: (data: { password_actual: string; password_nueva: string }) => Promise<void>;
    isLoading?: boolean;
}

export function CambiarPasswordForm({ onSave, isLoading = false }: CambiarPasswordFormProps) {
    const [formData, setFormData] = useState({
        password_actual: "",
        password_nueva: "",
        password_confirmar: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showActual, setShowActual] = useState(false);
    const [showNueva, setShowNueva] = useState(false);
    const [showConfirmar, setShowConfirmar] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!formData.password_actual) {
            setError("Ingresa tu contraseña actual");
            return;
        }

        if (formData.password_nueva.length < 6) {
            setError("La nueva contraseña debe tener al menos 6 caracteres");
            return;
        }

        if (formData.password_nueva !== formData.password_confirmar) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {
            await onSave({
                password_actual: formData.password_actual,
                password_nueva: formData.password_nueva,
            });
            setSuccess("Contraseña actualizada correctamente");
            setFormData({
                password_actual: "",
                password_nueva: "",
                password_confirmar: "",
            });
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cambiar la contraseña");
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
                    {/* <Check className="w-5 h-5" /> */}
                    {success}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-white/70 mb-1">
                    Contraseña Actual
                </label>
                <div className="relative">
                    <input
                        type={showActual ? "text" : "password"}
                        name="password_actual"
                        value={formData.password_actual}
                        onChange={handleChange}
                        placeholder="Ingresa tu contraseña actual"
                        className="w-full px-4 py-2.5 rounded-lg border border-[#353943] bg-[#121723] text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors pr-10"
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        onClick={() => setShowActual(!showActual)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/50 transition-colors"
                    >
                        {showActual ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-white/70 mb-1">
                    Nueva Contraseña
                </label>
                <div className="relative">
                    <input
                        type={showNueva ? "text" : "password"}
                        name="password_nueva"
                        value={formData.password_nueva}
                        onChange={handleChange}
                        placeholder="Ingresa tu nueva contraseña (mínimo 6 caracteres)"
                        className="w-full px-4 py-2.5 rounded-lg border border-[#353943] bg-[#121723] text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors pr-10"
                        autoComplete="new-password"
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        onClick={() => setShowNueva(!showNueva)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/50 transition-colors"
                    >
                        {showNueva ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-white/70 mb-1">
                    Confirmar Nueva Contraseña
                </label>
                <div className="relative">
                    <input
                        type={showConfirmar ? "text" : "password"}
                        name="password_confirmar"
                        value={formData.password_confirmar}
                        onChange={handleChange}
                        placeholder="Confirma tu nueva contraseña"
                        className="w-full px-4 py-2.5 rounded-lg border border-[#353943] bg-[#121723] text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors pr-10"
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmar(!showConfirmar)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/50 transition-colors"
                    >
                        {showConfirmar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#353943]">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Key className="w-4 h-4" />
                    {isLoading ? "Cambiando..." : "Cambiar Contraseña"}
                </button>
            </div>
        </form>
    );
}