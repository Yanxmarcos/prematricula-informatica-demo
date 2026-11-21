// src/components/prematricula/ConfirmacionModal.tsx
"use client";

import { X, AlertTriangle, Check } from "lucide-react";

interface CursoSeleccionado {
    curso: {
        codigo: number;
        nombre: string;
        creditos: number;
    };
    numero_vez: number;
}

interface ConfirmacionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    cursos: CursoSeleccionado[];
    isLoading: boolean;
    error?: string | null;
}

export function ConfirmacionModal({
    isOpen,
    onClose,
    onConfirm,
    cursos,
    isLoading,
    error,
}: ConfirmacionModalProps) {
    if (!isOpen) return null;

    const totalCreditos = cursos.reduce((sum, c) => sum + c.curso.creditos, 0);

    const getNumeroVezLabel = (num: number) => {
        const labels: Record<number, string> = {
            1: "1era",
            2: "2da",
            3: "3ra",
            4: "4ta",
        };
        return labels[num] || `${num}era`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70  p-4">
            <div className="bg-[#1d2430] border border-[#353943] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#353943]">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-blue-500" />
                        <h3 className="text-xl font-bold text-white">
                            Confirmar Prematrícula
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-white/50 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-white/70 mb-4">
                        ¿Estás seguro de realizar la prematrícula con los siguientes cursos?
                    </p>

                    <div className="bg-[#121723] rounded-lg p-4 max-h-48 overflow-y-auto">
                        {cursos.map((item) => (
                            <div
                                key={item.curso.codigo}
                                className="flex justify-between items-center py-2 border-b border-[#353943] last:border-b-0"
                            >
                                <div>
                                    <span className="text-white">{item.curso.nombre}</span>
                                    <span className="ml-2 text-xs text-white/40">
                                        ({item.curso.codigo})
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="text-white/50">
                                        {item.curso.creditos} créditos
                                    </span>
                                    <span
                                        className={`px-2 py-0.5 rounded text-xs font-medium ${item.numero_vez === 1
                                                ? "bg-green-500/20 text-green-400"
                                                : item.numero_vez === 2
                                                    ? "bg-yellow-500/20 text-yellow-400"
                                                    : item.numero_vez === 3
                                                        ? "bg-orange-500/20 text-orange-400"
                                                        : "bg-red-500/20 text-red-400"
                                            }`}
                                    >
                                        {getNumeroVezLabel(item.numero_vez)} vez
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 flex justify-between items-center bg-[#121723] rounded-lg p-3">
                        <span className="text-white/70">Total de créditos</span>
                        <span className="text-xl font-bold text-white">{totalCreditos}</span>
                    </div>

                    {error && (
                        <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <p className="mt-4 text-xs text-white/30">
                        Esta acción no se puede deshacer. La prematrícula quedará registrada
                        para el período seleccionado.
                    </p>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-[#353943]">
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
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <span className="animate-spin">◌</span>
                                Guardando...
                            </>
                        ) : (
                            <>
                                {/* <Check className="w-5 h-5" /> */}
                                Confirmar Prematrícula
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}