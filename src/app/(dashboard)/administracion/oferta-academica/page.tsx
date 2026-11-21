// src/app/(dashboard)/administracion/oferta-academica/page.tsx
"use client";

import { useState, useEffect } from "react";
import { RefreshCw, TrendingUp, TrendingDown, Minus, Download, RotateCcw } from "lucide-react";
import { OfertaFilters } from "@/components/admin/OfertaFilters";
import { formatDatePeru } from "@/lib/utils/date";

interface CursoDemanda {
    codigo: number;
    nombre: string;
    ciclo: number;
    tipo: string;
    creditos: number;
    total_estudiantes: number;
    porcentaje: number;
    repeticiones: number; // <-- NUEVO
    porcentaje_repeticion: number; // <-- NUEVO
}

interface Periodo {
    id: number;
    semestre: string;
    anio: number;
}

export default function OfertaAcademicaPage() {
    const [cursos, setCursos] = useState<CursoDemanda[]>([]);
    const [periodos, setPeriodos] = useState<Periodo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        search: "",
        periodo_id: "",
        ciclo: "",
        tipo: "",
    });
    const [sortBy, setSortBy] = useState<"demanda" | "codigo" | "ciclo" | "nombre" | "repeticiones">("demanda");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const fetchPeriodos = async () => {
        try {
            const response = await fetch("/api/admin/periodos");
            if (response.ok) {
                const data = await response.json();
                setPeriodos(data);
            }
        } catch (error) {
            console.error("Error fetching periodos:", error);
        }
    };

    const fetchOferta = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append("search", filters.search);
            if (filters.periodo_id) params.append("periodo_id", filters.periodo_id);
            if (filters.ciclo) params.append("ciclo", filters.ciclo);
            if (filters.tipo) params.append("tipo", filters.tipo);

            const response = await fetch(`/api/admin/oferta?${params}`);
            if (!response.ok) {
                throw new Error("Error al cargar oferta académica");
            }
            const data = await response.json();
            setCursos(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPeriodos();
    }, []);

    useEffect(() => {
        fetchOferta();
    }, [filters]);

    const handleFilter = (newFilters: any) => {
        setFilters(newFilters);
    };

    const handleSort = (field: "demanda" | "codigo" | "ciclo" | "nombre" | "repeticiones") => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("desc");
        }
    };

    const getSortedCursos = () => {
        const sorted = [...cursos];
        switch (sortBy) {
            case "demanda":
                sorted.sort((a, b) => sortOrder === "asc"
                    ? a.total_estudiantes - b.total_estudiantes
                    : b.total_estudiantes - a.total_estudiantes
                );
                break;
            case "codigo":
                sorted.sort((a, b) => sortOrder === "asc"
                    ? a.codigo - b.codigo
                    : b.codigo - a.codigo
                );
                break;
            case "ciclo":
                sorted.sort((a, b) => sortOrder === "asc"
                    ? a.ciclo - b.ciclo
                    : b.ciclo - a.ciclo
                );
                break;
            case "nombre":
                sorted.sort((a, b) => sortOrder === "asc"
                    ? a.nombre.localeCompare(b.nombre)
                    : b.nombre.localeCompare(a.nombre)
                );
                break;
            case "repeticiones":
                sorted.sort((a, b) => sortOrder === "asc"
                    ? a.repeticiones - b.repeticiones
                    : b.repeticiones - a.repeticiones
                );
                break;
        }
        return sorted;
    };

    const getDemandaIcon = (total: number, max: number) => {
        if (total === 0) return <Minus className="w-4 h-4 text-gray-500" />;
        const ratio = total / max;
        if (ratio > 0.7) return <TrendingUp className="w-4 h-4 text-green-400" />;
        if (ratio > 0.3) return <TrendingUp className="w-4 h-4 text-yellow-400" />;
        return <TrendingDown className="w-4 h-4 text-red-400" />;
    };

    const getDemandaColor = (total: number, max: number) => {
        if (total === 0) return "bg-gray-500/20";
        const ratio = total / max;
        if (ratio > 0.7) return "bg-green-500/20";
        if (ratio > 0.3) return "bg-yellow-500/20";
        return "bg-red-500/20";
    };

    const getDemandaBarColor = (total: number, max: number) => {
        if (total === 0) return "bg-gray-500";
        const ratio = total / max;
        if (ratio > 0.7) return "bg-green-500";
        if (ratio > 0.3) return "bg-yellow-500";
        return "bg-red-500";
    };

    const getRepeticionColor = (repeticiones: number, total: number) => {
        if (repeticiones === 0) return "text-gray-400";
        const ratio = total > 0 ? repeticiones / total : 0;
        if (ratio > 0.5) return "text-red-400";
        if (ratio > 0.2) return "text-yellow-400";
        return "text-blue-400";
    };

    const maxDemanda = cursos.length > 0 ? Math.max(...cursos.map(c => c.total_estudiantes)) : 1;
    const maxRepeticiones = cursos.length > 0 ? Math.max(...cursos.map(c => c.repeticiones)) : 1;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white/70">Cargando oferta académica...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Oferta Académica</h1>
                    <p className="text-white/50">Demanda de cursos por período académico</p>
                </div>
                <button
                    onClick={fetchOferta}
                    className="flex items-center gap-2 px-4 py-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Actualizar
                </button>
            </div>

            {/* Filtros */}
            <OfertaFilters
                filters={filters}
                onFilter={handleFilter}
                periodos={periodos}
                isLoading={loading}
            />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-4">
                    <p className="text-xs text-white/40">Total de Cursos</p>
                    <p className="text-2xl font-bold text-white">{cursos.length}</p>
                </div>
                <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-4">
                    <p className="text-xs text-white/40">Cursos con Demanda</p>
                    <p className="text-2xl font-bold text-white">
                        {cursos.filter(c => c.total_estudiantes > 0).length}
                    </p>
                </div>
                <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-4">
                    <p className="text-xs text-white/40">Cursos sin Demanda</p>
                    <p className="text-2xl font-bold text-white">
                        {cursos.filter(c => c.total_estudiantes === 0).length}
                    </p>
                </div>
                <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-4">
                    <p className="text-xs text-white/40">Total de Estudiantes</p>
                    <p className="text-2xl font-bold text-white">
                        {cursos.reduce((sum, c) => sum + c.total_estudiantes, 0)}
                    </p>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-[#1d2430] border border-[#353943] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#121723] border-b border-[#353943]">
                            <tr>
                                <th
                                    className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider cursor-pointer hover:text-white/80 transition-colors"
                                    onClick={() => handleSort("codigo")}
                                >
                                    <div className="flex items-center gap-1">
                                        Código
                                        {sortBy === "codigo" && (sortOrder === "asc" ? "↑" : "↓")}
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider cursor-pointer hover:text-white/80 transition-colors"
                                    onClick={() => handleSort("nombre")}
                                >
                                    <div className="flex items-center gap-1">
                                        Curso
                                        {sortBy === "nombre" && (sortOrder === "asc" ? "↑" : "↓")}
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-3 text-center text-xs font-medium text-white/50 uppercase tracking-wider cursor-pointer hover:text-white/80 transition-colors"
                                    onClick={() => handleSort("ciclo")}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        Ciclo
                                        {sortBy === "ciclo" && (sortOrder === "asc" ? "↑" : "↓")}
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-white/50 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-white/50 uppercase tracking-wider">
                                    Créditos
                                </th>
                                <th
                                    className="px-4 py-3 text-center text-xs font-medium text-white/50 uppercase tracking-wider cursor-pointer hover:text-white/80 transition-colors"
                                    onClick={() => handleSort("demanda")}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        Demanda
                                        {sortBy === "demanda" && (sortOrder === "asc" ? "↑" : "↓")}
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-3 text-center text-xs font-medium text-white/50 uppercase tracking-wider cursor-pointer hover:text-white/80 transition-colors"
                                    onClick={() => handleSort("repeticiones")}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        <RotateCcw className="w-3 h-3" />
                                        Repeticiones
                                        {sortBy === "repeticiones" && (sortOrder === "asc" ? "↑" : "↓")}
                                    </div>
                                </th>
                                {/* <th className="px-4 py-3 text-center text-xs font-medium text-white/50 uppercase tracking-wider">
                                    % Repetición
                                </th> */}
                                <th className="px-4 py-3 text-center text-xs font-medium text-white/50 uppercase tracking-wider">
                                    Porcentaje
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#353943]">
                            {getSortedCursos().length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-4 py-8 text-center text-white/40">
                                        No hay cursos disponibles para los filtros seleccionados
                                    </td>
                                </tr>
                            ) : (
                                getSortedCursos().map((curso) => (
                                    <tr key={curso.codigo} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-white/70 font-mono">{curso.codigo}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-white">{curso.nombre}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-sm text-white/50">{curso.ciclo}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${curso.tipo === "EG" ? "bg-emerald-500/20 text-emerald-400" :
                                                    curso.tipo === "EE" ? "bg-orange-500/20 text-orange-400" :
                                                        "bg-sky-500/20 text-sky-400"
                                                }`}>
                                                {curso.tipo}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-sm text-white font-medium">{curso.creditos}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="text-sm font-medium text-white">
                                                    {curso.total_estudiantes}
                                                </span>
                                                {getDemandaIcon(curso.total_estudiantes, maxDemanda)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {curso.repeticiones > 0 ? (
                                                <span className={`text-sm font-medium ${getRepeticionColor(curso.repeticiones, curso.total_estudiantes)}`}>
                                                    {curso.repeticiones}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-white/30">-</span>
                                            )}
                                        </td>
                                        {/* <td className="px-4 py-3 text-center">
                                            {curso.repeticiones > 0 ? (
                                                <span className={`text-xs font-medium ${getRepeticionColor(curso.repeticiones, curso.total_estudiantes)}`}>
                                                    {Math.round(curso.porcentaje_repeticion)}%
                                                </span>
                                            ) : (
                                                <span className="text-xs text-white/30">-</span>
                                            )}
                                        </td> */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`flex-1 h-1.5 rounded-full ${getDemandaColor(curso.total_estudiantes, maxDemanda)} overflow-hidden`}>
                                                    <div
                                                        className={`h-full ${getDemandaBarColor(curso.total_estudiantes, maxDemanda)} rounded-full transition-all duration-500`}
                                                        style={{ width: `${maxDemanda > 0 ? (curso.total_estudiantes / maxDemanda) * 100 : 0}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-white/40 w-12 text-right">
                                                    {maxDemanda > 0 ? Math.round((curso.total_estudiantes / maxDemanda) * 100) : 0}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}