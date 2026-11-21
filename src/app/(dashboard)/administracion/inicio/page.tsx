// src/app/(dashboard)/administracion/inicio/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
    Users,
    BookOpen,
    Award,
    TrendingUp,
    RefreshCw,
    Loader2
} from "lucide-react";
import { StatsCard } from "@/components/admin/StatsCard";
import { DashboardCharts } from "@/components/admin/DashboardCharts";

interface DashboardStats {
    periodo_activo: {
        id: number;
        semestre: string;
        anio: number;
        tipo: string;
        descripcion: string | null;
        fecha_inicio: string;
        fecha_fin: string;
    } | null;
    total_estudiantes: number;
    total_cursos: number;
    total_creditos: number;
    promedio_creditos: number;
    por_ciclo: Array<{ ciclo: number; total: number }>;
    por_tipo_matricula: Array<{ tipo: string; total: number }>;
    top_cursos: Array<{ codigo: number; nombre: string; total: number }>;
    bottom_cursos: Array<{ codigo: number; nombre: string; total: number }>;
}

export default function AdministracionInicioPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/admin/dashboard");
            if (!response.ok) {
                throw new Error("Error al cargar estadísticas");
            }
            const data = await response.json();
            setStats(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
            console.error("Error fetching dashboard stats:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <div className="text-white/70">Cargando estadísticas...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <p className="text-red-400">{error}</p>
                <button
                    onClick={fetchStats}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Reintentar
                </button>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-white/70">No hay datos disponibles</p>
            </div>
        );
    }

    const periodoLabel = stats.periodo_activo
        ? `${stats.periodo_activo.semestre}-${stats.periodo_activo.anio}`
        : "Sin período activo";

    return (
        <div className="space-y-6">
            {/* Bienvenida */}
            <div>
                <h1 className="text-2xl font-bold text-white">
                    Panel de Administración
                </h1>
                <p className="text-white/50">
                    Bienvenido, {session?.user?.name || "Administrador"}
                </p>
                {stats.periodo_activo && (
                    <p className="text-sm text-primary mt-1">
                        Período activo: {periodoLabel} - {stats.periodo_activo.descripcion}
                    </p>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Estudiantes"
                    value={stats.total_estudiantes}
                    icon={<Users className="w-5 h-5" />}
                    subtitle={`${stats.total_estudiantes} prematriculados`}
                    color="blue"
                />
                <StatsCard
                    title="Cursos Solicitados"
                    value={stats.total_cursos}
                    icon={<BookOpen className="w-5 h-5" />}
                    subtitle="Total de cursos registrados"
                    color="green"
                />
                <StatsCard
                    title="Créditos"
                    value={stats.total_creditos}
                    icon={<Award className="w-5 h-5" />}
                    subtitle={`Promedio: ${stats.promedio_creditos.toFixed(1)} créditos`}
                    color="yellow"
                />
                <StatsCard
                    title="Período"
                    value={periodoLabel}
                    icon={<TrendingUp className="w-5 h-5" />}
                    subtitle={stats.periodo_activo?.tipo || "Sin período"}
                    color="purple"
                />
            </div>

            <DashboardCharts
                data={{
                    por_ciclo: stats.por_ciclo,
                    por_tipo_matricula: stats.por_tipo_matricula,
                    top_cursos: stats.top_cursos,
                    bottom_cursos: stats.bottom_cursos,
                }}
            />
        </div>
    );
}