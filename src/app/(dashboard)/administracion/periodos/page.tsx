// src/app/(dashboard)/administracion/periodos/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { PeriodoModal } from "@/components/admin/PeriodoModal";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import { formatDatePeru } from "@/lib/utils/date";

interface Periodo {
    id: number;
    semestre: string;
    anio: number;
    tipo: string;
    descripcion: string | null;
    fecha_inicio: string;
    fecha_fin: string;
    activo: boolean;
    creado_por?: {
        id: number;
        nombres: string;
        apellido_paterno: string;
        apellido_materno: string;
    };
}

export default function PeriodosPage() {
    const [periodos, setPeriodos] = useState<Periodo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPeriodo, setSelectedPeriodo] = useState<Periodo | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [periodoToDelete, setPeriodoToDelete] = useState<Periodo | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchPeriodos = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/admin/periodos");
            if (!response.ok) {
                throw new Error("Error al cargar períodos");
            }
            const data = await response.json();
            setPeriodos(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPeriodos();
    }, []);

    const handleCreate = () => {
        setSelectedPeriodo(null);
        setModalOpen(true);
    };

    const handleEdit = (periodo: Periodo) => {
        setSelectedPeriodo(periodo);
        setModalOpen(true);
    };

    const handleDelete = (periodo: Periodo) => {
        setPeriodoToDelete(periodo);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!periodoToDelete) return;
        setIsSaving(true);
        try {
            const response = await fetch(`/api/admin/periodos/${periodoToDelete.id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Error al eliminar");
            }
            await fetchPeriodos();
            setDeleteModalOpen(false);
            setPeriodoToDelete(null);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Error al eliminar");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSave = async (data: any) => {
        setIsSaving(true);
        try {
            const url = selectedPeriodo
                ? `/api/admin/periodos/${selectedPeriodo.id}`
                : "/api/admin/periodos";
            const method = selectedPeriodo ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al guardar");
            }

            await fetchPeriodos();
            setModalOpen(false);
            setSelectedPeriodo(null);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Error al guardar");
        } finally {
            setIsSaving(false);
        }
    };

    const getSemestreLabel = (semestre: string) => {
        const labels: Record<string, string> = {
            I: "I",
            II: "II",
            EXT: "Verano",
        };
        return labels[semestre] || semestre;
    };

    const getTipoLabel = (tipo: string) => {
        const labels: Record<string, string> = {
            REGULAR: "Regular",
            VERANO: "Verano",
        };
        return labels[tipo] || tipo;
    };

    const getStatusBadge = (activo: boolean) => {
        if (activo) {
            return (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                    <Check className="w-3 h-3" /> Activo
                </span>
            );
        }
        return (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-400 border border-gray-500/30">
                <X className="w-3 h-3" /> Inactivo
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white/70">Cargando períodos...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Períodos Académicos</h1>
                    <p className="text-white/50">Período ficticio de la demostración. Edición deshabilitada.</p>
                </div>
            </div>

            <div className="bg-[#1d2430] border border-[#353943] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#121723] border-b border-[#353943]">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                                    Período
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                                    Fechas
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                                    Creado por
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-white/50 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#353943]">
                            {periodos.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-white/40">
                                        No hay períodos registrados
                                    </td>
                                </tr>
                            ) : (
                                periodos.map((periodo) => (
                                    <tr key={periodo.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3">
                                            <div>
                                                <span className="text-white font-medium">
                                                    {getSemestreLabel(periodo.semestre)} - {periodo.anio}
                                                </span>
                                                <p className="text-xs text-white/40">
                                                    {periodo.descripcion || "Sin descripción"}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-white/70">
                                                {getTipoLabel(periodo.tipo)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm text-white/70">
                                                <div>{formatDatePeru(periodo.fecha_inicio)}</div>
                                                <div className="text-xs text-white/40">
                                                    al {formatDatePeru(periodo.fecha_fin)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {getStatusBadge(periodo.activo)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-white/50">
                                                {periodo.creado_por
                                                    ? `${periodo.creado_por.nombres} ${periodo.creado_por.apellido_paterno}`
                                                    : "Sistema"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="text-xs text-white/40">Solo lectura</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <PeriodoModal
                isOpen={modalOpen}
                periodo={selectedPeriodo}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedPeriodo(null);
                }}
                onSave={handleSave}
                isLoading={isSaving}
            />

            <ConfirmDeleteModal
                isOpen={deleteModalOpen}
                title="Eliminar Período"
                message={`¿Estás seguro de eliminar el período ${periodoToDelete ? getSemestreLabel(periodoToDelete.semestre) + '-' + periodoToDelete.anio : ''}? Esta acción no se puede deshacer.`}
                onConfirm={confirmDelete}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setPeriodoToDelete(null);
                }}
                isLoading={isSaving}
            />
        </div>
    );
}
