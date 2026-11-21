// src/components/admin/PeriodoModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { formatDateInputPeru } from "@/lib/utils/date";

interface Periodo {
    id?: number;
    semestre: string;
    anio: number;
    tipo: string;
    descripcion: string;
    fecha_inicio: string;
    fecha_fin: string;
    activo: boolean;
}

interface PeriodoModalProps {
    isOpen: boolean;
    periodo?: Periodo | null;
    onClose: () => void;
    onSave: (data: any) => void;
    isLoading?: boolean;
}

export function PeriodoModal({
    isOpen,
    periodo,
    onClose,
    onSave,
    isLoading = false,
}: PeriodoModalProps) {
    const [formData, setFormData] = useState<Periodo>({
        semestre: "I",
        anio: new Date().getFullYear(),
        tipo: "REGULAR",
        descripcion: "",
        fecha_inicio: "",
        fecha_fin: "",
        activo: false,
    });

    useEffect(() => {
        if (periodo) {
            setFormData({
                semestre: periodo.semestre,
                anio: periodo.anio,
                tipo: periodo.tipo,
                descripcion: periodo.descripcion || "",
                fecha_inicio: formatDateInputPeru(periodo.fecha_inicio),
                fecha_fin: formatDateInputPeru(periodo.fecha_fin),
                activo: periodo.activo || false,
            });
        } else {
            const currentYear = new Date().getFullYear();
            setFormData({
                semestre: "I",
                anio: currentYear,
                tipo: "REGULAR",
                descripcion: "",
                fecha_inicio: "",
                fecha_fin: "",
                activo: false,
            });
        }
    }, [periodo, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const dataToSend = {
            semestre: formData.semestre,
            anio: formData.anio,
            tipo: formData.tipo,
            descripcion: formData.descripcion,
            fecha_inicio: formData.fecha_inicio,
            fecha_fin: formData.fecha_fin,
            activo: formData.activo,
        };

        onSave(dataToSend);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-[#1d2430] border border-[#353943] rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-[#353943]">
                    <h3 className="text-lg font-semibold text-white">
                        {periodo ? "Editar Período" : "Nuevo Período"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-white/50 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-1">
                                Semestre
                            </label>
                            <select
                                value={formData.semestre}
                                onChange={(e) =>
                                    setFormData({ ...formData, semestre: e.target.value })
                                }
                                className="w-full rounded-lg border border-[#353943] bg-[#121723] px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                                required
                            >
                                <option value="I">I</option>
                                <option value="II">II</option>
                                <option value="EXT">EXT (Verano)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-1">
                                Año
                            </label>
                            <input
                                type="number"
                                value={formData.anio}
                                onChange={(e) =>
                                    setFormData({ ...formData, anio: parseInt(e.target.value) })
                                }
                                className="w-full rounded-lg border border-[#353943] bg-[#121723] px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                                min={2020}
                                max={2030}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">
                            Tipo
                        </label>
                        <select
                            value={formData.tipo}
                            onChange={(e) =>
                                setFormData({ ...formData, tipo: e.target.value })
                            }
                            className="w-full rounded-lg border border-[#353943] bg-[#121723] px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                            required
                        >
                            <option value="REGULAR">Regular</option>
                            <option value="VERANO">Verano</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">
                            Descripción (opcional)
                        </label>
                        <input
                            type="text"
                            value={formData.descripcion}
                            onChange={(e) =>
                                setFormData({ ...formData, descripcion: e.target.value })
                            }
                            className="w-full rounded-lg border border-[#353943] bg-[#121723] px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="Ej: Período Académico 2026-I"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-1">
                                Fecha Inicio
                            </label>
                            <input
                                type="date"
                                value={formData.fecha_inicio}
                                onChange={(e) =>
                                    setFormData({ ...formData, fecha_inicio: e.target.value })
                                }
                                className="w-full rounded-lg border border-[#353943] bg-[#121723] px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-1">
                                Fecha Fin
                            </label>
                            <input
                                type="date"
                                value={formData.fecha_fin}
                                onChange={(e) =>
                                    setFormData({ ...formData, fecha_fin: e.target.value })
                                }
                                className="w-full rounded-lg border border-[#353943] bg-[#121723] px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="activo"
                            checked={formData.activo}
                            onChange={(e) =>
                                setFormData({ ...formData, activo: e.target.checked })
                            }
                            className="w-4 h-4 rounded border-[#353943] bg-[#121723] text-primary focus:ring-primary"
                        />
                        <label htmlFor="activo" className="text-sm text-white/70">
                            Activar este período (solo puede haber uno activo a la vez)
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-[#353943]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Guardando..." : periodo ? "Actualizar" : "Crear"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}