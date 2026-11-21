// src/components/usuarios/PasswordResetModal.tsx
"use client";

import { useState } from "react";
import { X, Copy, Check, AlertCircle } from "lucide-react";

interface PasswordResetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
    newPassword?: string | null;
    usuarioNombre?: string;
}

export function PasswordResetModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
    newPassword = null,
    usuarioNombre = "",
}: PasswordResetModalProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        if (newPassword) {
            navigator.clipboard.writeText(newPassword);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[#1d2430] border border-[#353943] rounded-lg max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                        Resetear Contraseña
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-white/50 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {newPassword ? (
                    <>
                        <p className="text-white/70 text-sm mb-4">
                            La contraseña de <span className="text-white font-medium">{usuarioNombre}</span> ha sido reseteada.
                        </p>

                        <div className="bg-[#121723] border border-[#353943] rounded-lg p-4 mb-4">
                            <p className="text-xs text-white/50 mb-1">Nueva Contraseña:</p>
                            <div className="flex items-center justify-between">
                                <code className="text-lg font-mono text-primary font-bold">
                                    {newPassword}
                                </code>
                                <button
                                    onClick={handleCopy}
                                    className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                    title="Copiar contraseña"
                                >
                                    {copied ? (
                                        <Check className="w-5 h-5 text-green-400" />
                                    ) : (
                                        <Copy className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {copied && (
                                <p className="text-xs text-green-400 mt-1">¡Copiado!</p>
                            )}
                        </div>

                        <p className="text-xs text-white/30">
                            Recomienda al usuario cambiar su contraseña en su próximo inicio de sesión.
                        </p>

                        <div className="flex justify-end mt-4 pt-4 border-t border-[#353943]">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-white/70 text-sm mb-4">
                            ¿Estás seguro de resetear la contraseña de <span className="text-white font-medium">{usuarioNombre}</span>?
                        </p>
                        <p className="text-xs text-white/30 mb-4">
                            La nueva contraseña será el código de estudiante del usuario.
                        </p>

                        <div className="flex justify-end gap-3 pt-4 border-t border-[#353943]">
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="px-4 py-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Reseteando..." : "Resetear"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}