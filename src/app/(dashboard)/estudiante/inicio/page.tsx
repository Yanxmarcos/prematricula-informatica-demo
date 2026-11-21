// src/app/(dashboard)/estudiante/inicio/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    Calendar,
    BookOpen,
    Clock,
    Award,
    ChevronRight,
    AlertCircle,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { StatsCard } from "@/components/admin/StatsCard";
import { formatDatePeru } from "@/lib/utils/date";

interface DashboardData {
    periodo_activo: {
        id: number;
        semestre: string;
        anio: number;
        descripcion: string | null;
        fecha_inicio: string;
        fecha_fin: string;
        activo: boolean;
    } | null;
    tiene_prematricula: boolean;
    prematricula_actual?: {
        id: number;
        tipo_matricula: string;
        total_creditos: number;
        total_cursos: number;
        creado_en: string;
    };
    historial: Array<{
        id: number;
        periodo: string;
        tipo_matricula: string;
        total_creditos: number;
        total_cursos: number;
        creado_en: string;
    }>;
    configuracion: {
        prematricula_abierta: boolean;
        prematricula_editable: boolean;
        creditos_max_regular: number;
    };
}

export default function EstudianteInicioPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboard = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/estudiante/dashboard");
            if (!response.ok) {
                throw new Error("Error al cargar datos");
            }
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const getPeriodoLabel = (semestre: string, anio: number) => {
        const semestreLabels: Record<string, string> = {
            I: "I",
            II: "II",
            EXT: "Verano",
        };
        return `${semestreLabels[semestre] || semestre} - ${anio}`;
    };

    const getEstadoPrematricula = () => {
        if (!data) return { label: "No disponible", color: "text-gray-400", icon: null };

        if (!data.periodo_activo) {
            return {
                label: "Sin período activo",
                color: "text-yellow-400",
                icon: <AlertCircle className="w-5 h-5" />,
            };
        }

        if (!data.configuracion.prematricula_abierta) {
            return {
                label: "Prematrícula cerrada",
                color: "text-red-400",
                icon: <XCircle className="w-5 h-5" />,
            };
        }

        if (data.tiene_prematricula) {
            return {
                label: "Prematrícula registrada",
                color: "text-green-400",
                icon: <CheckCircle className="w-5 h-5" />,
            };
        }

        return {
            label: "Prematrícula abierta",
            color: "text-blue-400",
            icon: <Clock className="w-5 h-5" />,
        };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white/70">Cargando panel...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-400">{error}</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white/40">No hay datos disponibles</div>
            </div>
        );
    }

    const estado = getEstadoPrematricula();

    return (
        <div className="space-y-6">
            {/* Bienvenida */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        ¡Bienvenido, {session?.user?.name || "Estudiante"}!
                    </h1>
                    <p className="text-white/50">
                        Panel de control
                    </p>
                </div>
                {data.periodo_activo && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#1d2430] border border-[#353943] rounded-lg">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm text-white/70">
                            {getPeriodoLabel(
                                data.periodo_activo.semestre,
                                data.periodo_activo.anio
                            )}
                        </span>
                    </div>
                )}
            </div>

            {/* Tarjetas de estado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Estado de Prematrícula"
                    value={estado.label}
                    icon={estado.icon || <AlertCircle className="w-5 h-5" />}
                    subtitle={data.periodo_activo ? "Período activo" : "Sin período"}
                    color={estado.color === "text-green-400" ? "green"
                            : estado.color === "text-blue-400"
                                ? "blue"
                                : estado.color === "text-yellow-400"
                                    ? "gray"
                                    : "red"
                    }
                />

                <StatsCard
                    title="Cursos Seleccionados"
                    value={data.tiene_prematricula ? data.prematricula_actual?.total_cursos || 0 : 0}
                    icon={<BookOpen className="w-5 h-5" />}
                    subtitle={data.tiene_prematricula ? "Prematrícula actual" : "Sin prematrícula"}
                    color={data.tiene_prematricula ? "blue" : "gray"}
                />

                <StatsCard
                    title="Créditos"
                    value={data.tiene_prematricula ? data.prematricula_actual?.total_creditos || 0 : 0}
                    icon={<Award className="w-5 h-5" />}
                    subtitle={
                        data.tiene_prematricula
                            ? `Máx: ${data.configuracion.creditos_max_regular} créditos`
                            : "Sin prematrícula"
                    }
                    color={data.tiene_prematricula ? "blue" : "gray"}
                />

                <StatsCard
                    title="Tipo de Matrícula"
                    value={data.tiene_prematricula ? data.prematricula_actual?.tipo_matricula || "N/A" : "Sin tipo"}
                    icon={<Award className="w-5 h-5" />}
                    subtitle={data.tiene_prematricula ? "Actual" : "Sin registro"}
                    color={data.tiene_prematricula ? "blue" : "gray"}
                />
            </div>

            {/* Sección de acción principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Card de acción - Prematrícula */}
                <div className="lg:col-span-2 bg-[#1d2430] border border-[#353943] rounded-lg p-6 hover:border-primary/30 transition-all duration-300">
                    <h3 className="text-lg font-semibold text-white mb-2">
                        {data.tiene_prematricula
                            ? "Tu Prematrícula Actual"
                            : "Realizar Prematrícula"}
                    </h3>
                    <p className="text-sm text-white/50 mb-4">
                        {data.tiene_prematricula
                            ? `Registrada el ${formatDatePeru(data.prematricula_actual?.creado_en)}`
                            : data.configuracion.prematricula_abierta && data.periodo_activo
                                ? "El proceso de prematrícula está abierto. Selecciona tus cursos."
                                : "El proceso de prematrícula no está disponible en este momento."}
                    </p>

                    {data.configuracion.prematricula_abierta && data.periodo_activo ? (
                        <button
                            onClick={() => router.push("/estudiante/prematricula")}
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
                        >
                            {data.tiene_prematricula ? "Ver Prematrícula" : "Iniciar Prematrícula"}
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            disabled
                            className="flex items-center gap-2 px-6 py-2.5 bg-gray-500/20 text-white/40 font-medium rounded-lg cursor-not-allowed"
                        >
                            {!data.periodo_activo
                                ? "Sin período activo"
                                : "Prematrícula cerrada"}
                        </button>
                    )}
                </div>

                {/* Card de información - Período activo */}
                <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                        Período Activo
                    </h3>
                    {data.periodo_activo ? (
                        <>
                            <p className="text-2xl font-bold text-primary">
                                {getPeriodoLabel(
                                    data.periodo_activo.semestre,
                                    data.periodo_activo.anio
                                )}
                            </p>
                            <p className="text-sm text-white/50 mt-2">
                                {data.periodo_activo.descripcion || "Período académico"}
                            </p>
                            <div className="mt-4 pt-4 border-t border-[#353943]">
                                <p className="text-xs text-white/40">
                                    Inicio: {formatDatePeru(data.periodo_activo.fecha_inicio)}
                                </p>
                                <p className="text-xs text-white/40">
                                    Fin: {formatDatePeru(data.periodo_activo.fecha_fin)}
                                </p>
                            </div>
                        </>
                    ) : (
                        <p className="text-white/40">No hay período activo</p>
                    )}
                </div>
            </div>

            {/* Historial reciente */}
            {data.historial.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Historial Reciente</h3>
                        {data.historial.length > 3 && (
                            <button
                                onClick={() => router.push("/estudiante/historial")}
                                className="text-sm text-primary hover:text-primary/80 transition-colors"
                            >
                                Ver todos
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {data.historial.slice(0, 3).map((item) => (
                            <div
                                key={item.id}
                                className="bg-[#1d2430] border border-[#353943] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-primary/30 transition-all duration-300"
                            >
                                <div>
                                    <span className="text-white font-medium">
                                        {item.periodo}
                                    </span>
                                    <span className="ml-3 text-sm text-white/50">
                                        {item.tipo_matricula}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-white/50">
                                        {item.total_cursos} cursos
                                    </span>
                                    <span className="text-white/50">
                                        {item.total_creditos} créditos
                                    </span>
                                    <span className="text-white/30 text-xs">
                                        {formatDatePeru(item.creado_en)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}