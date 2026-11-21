// PrematriculaFilters.tsx
"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

interface PrematriculaFiltersProps {
    filters: {
        search: string;
        periodo_id: string;
        tipo_matricula_id: string;
    };
    onFilter: (filters: any) => void;
    repeticion: string;
    onRepeticionChange: (value: string) => void;
    periodos: Array<{ id: number; semestre: string; anio: number }>;
    tiposMatricula: Array<{ id: number; nombre: string }>;
    isLoading?: boolean;
}

export function PrematriculaFilters({
    filters,
    onFilter,
    repeticion,
    onRepeticionChange,
    periodos,
    tiposMatricula,
    isLoading = false,
}: PrematriculaFiltersProps) {
    const [searchInput, setSearchInput] = useState(filters.search);

    useEffect(() => {
        setSearchInput(filters.search);
    }, [filters.search]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFilter({ ...filters, search: searchInput });
    };

    const handleReset = () => {
        setSearchInput("");
        onFilter({ search: "", periodo_id: "", tipo_matricula_id: "" });
        onRepeticionChange("");
    };

    const hasActiveFilters =
        filters.search || filters.periodo_id || filters.tipo_matricula_id || repeticion;

    return (
        <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-4">
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Búsqueda: solo filtra al enviar (va a la API) */}
                <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Buscar por código o nombre del estudiante..."
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#353943] bg-[#121723] text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 shrink-0"
                    >
                        Buscar
                    </button>
                </form>

                {/* Período: filtra en vivo (va a la API) */}
                <div className="sm:w-48">
                    <select
                        value={filters.periodo_id}
                        onChange={(e) => onFilter({ ...filters, periodo_id: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-[#353943] bg-[#121723] text-white focus:outline-none focus:border-primary transition-colors"
                        disabled={isLoading}
                    >
                        <option value="">Todos los períodos</option>
                        {periodos.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.semestre}-{p.anio}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tipo de Matrícula: filtra en vivo (va a la API) */}
                <div className="sm:w-48">
                    <select
                        value={filters.tipo_matricula_id}
                        onChange={(e) => onFilter({ ...filters, tipo_matricula_id: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-[#353943] bg-[#121723] text-white focus:outline-none focus:border-primary transition-colors"
                        disabled={isLoading}
                    >
                        <option value="">Todos los tipos</option>
                        {tiposMatricula.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Repetición: filtra en vivo, pero SOLO en memoria (no dispara fetch) */}
                <div className="sm:w-40">
                    <select
                        value={repeticion}
                        onChange={(e) => onRepeticionChange(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-[#353943] bg-[#121723] text-white focus:outline-none focus:border-primary transition-colors"
                        disabled={isLoading}
                    >
                        <option value="">Todos</option>
                        <option value="si">Con repetición</option>
                        <option value="no">Sin repetición</option>
                    </select>
                </div>

                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={isLoading}
                        className="px-4 py-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
                        title="Limpiar filtros"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}