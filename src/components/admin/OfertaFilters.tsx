// src/components/admin/OfertaFilters.tsx
"use client";
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface OfertaFiltersProps {
    filters: {
        search: string;
        periodo_id: string;
        ciclo: string;
        tipo: string;
    };
    onFilter: (filters: any) => void;
    periodos: Array<{ id: number; semestre: string; anio: number }>;
    isLoading?: boolean;
}

export function OfertaFilters({
    onFilter,
    periodos,
    isLoading = false,
    filters
}: OfertaFiltersProps) {
    // Estado local solo para el texto de búsqueda: no se propaga al padre
    // hasta que se envía el formulario (botón o Enter).
    const [searchInput, setSearchInput] = useState(filters.search);

    // Si el filtro cambia desde afuera (p. ej. al hacer "Limpiar"), sincroniza el input.
    useEffect(() => {
        setSearchInput(filters.search);
    }, [filters.search]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFilter({ ...filters, search: searchInput });
    };

    const handleReset = () => {
        setSearchInput("");
        onFilter({ search: "", periodo_id: "", ciclo: "", tipo: "" });
    };

    const hasActiveFilters =
        filters.search || filters.periodo_id || filters.ciclo || filters.tipo;

    return (
        <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-4">
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Búsqueda: solo filtra al enviar */}
                <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Buscar curso..."
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

                {/* Período: sigue filtrando en vivo, es una sola elección */}
                <div className="sm:w-50">
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

                {/* Ciclo */}
                <div className="sm:w-42">
                    <select
                        value={filters.ciclo}
                        onChange={(e) => onFilter({ ...filters, ciclo: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-[#353943] bg-[#121723] text-white focus:outline-none focus:border-primary transition-colors"
                        disabled={isLoading}
                    >
                        <option value="">Todos los ciclos</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
                            <option key={c} value={c}>Ciclo {c}</option>
                        ))}
                    </select>
                </div>

                {/* Tipo */}
                <div className="sm:w-40">
                    <select
                        value={filters.tipo}
                        onChange={(e) => onFilter({ ...filters, tipo: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-[#353943] bg-[#121723] text-white focus:outline-none focus:border-primary transition-colors"
                        disabled={isLoading}
                    >
                        <option value="">Todos los tipos</option>
                        <option value="EG">EG</option>
                        <option value="EE">EE</option>
                        <option value="ES">ES</option>
                    </select>
                </div>

                {/* Limpiar */}
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