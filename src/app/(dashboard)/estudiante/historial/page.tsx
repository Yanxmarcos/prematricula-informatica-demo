// src/app/(dashboard)/estudiante/historial/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Search, Filter, RefreshCw, AlertCircle, FileText } from "lucide-react";
import { HistorialCard } from "@/components/historial/HistorialCard";
import { DetallePrematriculaModal } from "@/components/historial/DetallePrematriculaModal";

interface CursoHistorial {
    codigo: number;
    nombre: string;
    numero_vez: number;
    creditos: number;
    tipo: string;
    ciclo: number;
}

interface PrematriculaHistorial {
    id: number;
    periodo: string;
    tipo_matricula: string;
    total_creditos: number;
    total_cursos: number;
    creado_en: string;
    usuario?: {
        nombres: string | null;
        apellido_paterno: string | null;
        apellido_materno: string | null;
        codigo_estudiante: string | null;
    };
    promedio?: number | null;
    cursos: Array<{
        codigo: number;
        nombre: string;
        numero_vez: number;
        creditos: number;
        tipo: string;
        ciclo: number;
    }>;
}

export default function HistorialPage() {
    const router = useRouter();
    const [historial, setHistorial] = useState<PrematriculaHistorial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [detalleModalOpen, setDetalleModalOpen] = useState(false);
    const [prematriculaSeleccionada, setPrematriculaSeleccionada] = useState<PrematriculaHistorial | null>(null);
    const [esPeriodoVerano, setEsPeriodoVerano] = useState(false);

    const fetchHistorial = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/estudiante/historial");
            if (!response.ok) {
                throw new Error("Error al cargar el historial");
            }
            const data = await response.json();
            setHistorial(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistorial();
    }, []);

    const handleVerDetalle = (id: number) => {
        const prematricula = historial.find((p) => p.id === id);
        if (prematricula) {
            setPrematriculaSeleccionada(prematricula);
            setDetalleModalOpen(true);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white/70">Cargando historial...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
                <button onClick={fetchHistorial} className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Historial de Prematrículas</h1>
                    <p className="text-white/50">Consulta todas tus prematrículas registradas</p>
                </div>
                <button onClick={fetchHistorial} className="flex items-center gap-2 px-4 py-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <RefreshCw className="w-4 h-4" /> Actualizar
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-4">
                    <p className="text-xs text-white/40">Total de Prematrículas</p>
                    <p className="text-2xl font-bold text-white">{historial.length}</p>
                </div>
                <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-4">
                    <p className="text-xs text-white/40">Cursos Registrados</p>
                    <p className="text-2xl font-bold text-white">{historial.reduce((sum, p) => sum + p.total_cursos, 0)}</p>
                </div>
                <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-4">
                    <p className="text-xs text-white/40">Créditos Totales</p>
                    <p className="text-2xl font-bold text-white">{historial.reduce((sum, p) => sum + p.total_creditos, 0)}</p>
                </div>
            </div>

            {historial.length === 0 ? (
                <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-12 text-center">
                    <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white/40">No tienes prematrículas registradas</h3>
                    <p className="text-sm text-white/30 mt-2">Realiza tu primera prematrícula desde el módulo de Prematrícula</p>
                    <button onClick={() => router.push("/estudiante/prematricula")} className="mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors">
                        Ir a Prematrícula
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {historial.map((item) => (
                        <HistorialCard
                            key={item.id}
                            prematricula={item}
                            onVerDetalle={handleVerDetalle}
                            esPeriodoVerano={esPeriodoVerano}
                        />
                    ))}
                </div>
            )}

            <DetallePrematriculaModal
                isOpen={detalleModalOpen}
                onClose={() => {
                    setDetalleModalOpen(false);
                    setPrematriculaSeleccionada(null);
                }}
                prematricula={prematriculaSeleccionada}
                esPeriodoVerano={esPeriodoVerano}
            />
        </div>
    );
}