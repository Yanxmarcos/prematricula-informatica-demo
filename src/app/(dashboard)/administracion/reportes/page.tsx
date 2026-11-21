// src/app/(dashboard)/administracion/reportes/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
    Users,
    BookOpen,
    Award,
    TrendingUp,
    TrendingDown,
    BarChart3,
    FileBarChart,
    RefreshCw,
} from "lucide-react";
import { ReportCard } from "@/components/admin/ReportCard";

interface Periodo {
    id: number;
    semestre: string;
    anio: number;
    activo?: boolean;
}

export default function ReportesPage() {
    const [periodos, setPeriodos] = useState<Periodo[]>([]);
    const [selectedPeriodo, setSelectedPeriodo] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    const fetchPeriodos = async () => {
        try {
            const response = await fetch("/api/admin/periodos");
            if (response.ok) {
                const data = await response.json();
                setPeriodos(data);
                if (data.length > 0) {
                    // Seleccionar el período activo o el más reciente
                    const active = data.find((p: any) => p.activo);
                    setSelectedPeriodo(active ? String(active.id) : String(data[0].id));
                }
            }
        } catch (error) {
            console.error("Error fetching periodos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPeriodos();
    }, []);

    const handleExport = async (tipo: string, reporte: string) => {
        setExporting(true);
        try {
            const params = new URLSearchParams();
            if (selectedPeriodo) params.append("periodo_id", selectedPeriodo);
            params.append("reporte", reporte);
            params.append("tipo", tipo);

            const response = await fetch(`/api/admin/reportes?${params}`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Error al generar reporte");
            }

            const blob = await response.blob();
            const extension = tipo === "excel" ? "csv" : "pdf";
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${reporte}_${new Date().toISOString().split("T")[0]}.${extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error exporting:", error);
            alert(error instanceof Error ? error.message : "Error al generar el reporte");
        } finally {
            setExporting(false);
        }
    };

    const reports = [
        {
            id: "por-ciclo",
            title: "Prematriculados por Ciclo",
            description: "Distribución de estudiantes prematriculados por ciclo académico",
            icon: <Users className="w-5 h-5" />,
        },
        {
            id: "por-periodo",
            title: "Prematriculados por Período",
            description: "Comparativa de prematriculados entre períodos académicos",
            icon: <BarChart3 className="w-5 h-5" />,
        },
        {
            id: "por-tipo-matricula",
            title: "Prematriculados por Tipo de Matrícula",
            description: "Distribución por tipo de matrícula (Regular, Especial, Excepcional)",
            icon: <Award className="w-5 h-5" />,
        },
        {
            id: "cursos-mayor-demanda",
            title: "Cursos con Mayor Demanda",
            description: "Top 10 cursos más solicitados por los estudiantes",
            icon: <TrendingUp className="w-5 h-5" />,
        },
        {
            id: "cursos-menor-demanda",
            title: "Cursos con Menor Demanda",
            description: "Top 10 cursos menos solicitados por los estudiantes",
            icon: <TrendingDown className="w-5 h-5" />,
        },
        {
            id: "cursos-sin-demanda",
            title: "Cursos sin Demanda",
            description: "Listado de cursos que no fueron solicitados por ningún estudiante",
            icon: <FileBarChart className="w-5 h-5" />,
        },
        {
            id: "matriculas-especiales",
            title: "Matrículas Especiales",
            description: "Listado de estudiantes con matrícula Especial o Excepcional",
            icon: <Award className="w-5 h-5" />,
        },
        {
            id: "matriculas-repetidas",
            title: "Matrículas Repetidas",
            description: "Estudiantes que cursan materias por tercera o cuarta vez",
            icon: <BookOpen className="w-5 h-5" />,
        },
        {
            id: "resumen-general",
            title: "Resumen General",
            description: "Resumen ejecutivo con todas las estadísticas del período",
            icon: <FileBarChart className="w-5 h-5" />,
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white/70">Cargando reportes...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Reportes</h1>
                    <p className="text-white/50">Genera y exporta reportes del sistema</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={selectedPeriodo}
                        onChange={(e) => setSelectedPeriodo(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-[#353943] bg-[#121723] text-white focus:outline-none focus:border-primary transition-colors"
                    >
                        {periodos.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.semestre}-{p.anio} {p.activo ? "(Activo)" : ""}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={fetchPeriodos}
                        className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Grid de Reportes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.map((report) => (
                    <ReportCard
                        key={report.id}
                        title={report.title}
                        description={report.description}
                        icon={report.icon}
                        onExportExcel={() => handleExport("excel", report.id)}
                        onExportPDF={() => handleExport("pdf", report.id)}
                        isLoading={exporting}
                    />
                ))}
            </div>

            {/* Nota */}
            <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-4">
                <p className="text-sm text-white/40">
                    Los reportes se generan con los datos del período seleccionado.
                    La exportación a Excel y PDF incluye toda la información filtrada.
                </p>
            </div>
        </div>
    );
}
