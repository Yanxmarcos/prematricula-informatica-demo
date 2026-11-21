// src/components/prematricula/ListaCursos.tsx
"use client";

import { useState } from "react";
import { ArrowLeft, Grid, Check, X, Trash2, ChevronDown, RotateCcw, AlertCircle } from "lucide-react";

interface Curso {
    codigo: number;
    nombre: string;
    ciclo: number;
    tipo: string;
    creditos: number;
    hrs_teoria: number;
    hrs_practica: number;
    hrs_lab: number;
    isSelectable: boolean;
}

interface ListaCursosProps {
    cursos: Curso[];
    cursosSeleccionados: Array<{ curso: Curso; numero_vez: number }>;
    onSeleccionarCurso: (curso: Curso, numero_vez?: number) => void;
    onEliminarCurso: (codigo: number) => void;
    onCambiarNumeroVez: (codigo: number, numero_vez: number) => void;
    onVolver: () => void;
    onConfirmar: () => void;
    onCambiarVista: () => void;
    totalCreditos: number;
    maxCreditos: number;
    tipoMatricula: string;
    isMobile: boolean;
    isExcedido: boolean;
    isExacto: boolean;
    esPeriodoVerano: boolean;
}

export function ListaCursos({
    cursos,
    cursosSeleccionados,
    onSeleccionarCurso,
    onEliminarCurso,
    onCambiarNumeroVez,
    onVolver,
    onConfirmar,
    onCambiarVista,
    totalCreditos,
    maxCreditos,
    tipoMatricula,
    isMobile,
    isExcedido,
    isExacto,
    esPeriodoVerano,
}: ListaCursosProps) {
    const [expandedCiclo, setExpandedCiclo] = useState<number | null>(null);
    const [showNumeroVez, setShowNumeroVez] = useState<number | null>(null);
    const [numeroVezTemp, setNumeroVezTemp] = useState<number>(1);
    const [showRepetir, setShowRepetir] = useState<number | null>(null);
    const [showCreditLimitModal, setShowCreditLimitModal] = useState(false);

    const cursosPorCiclo = cursos.reduce((acc, curso) => {
        if (!acc[curso.ciclo]) acc[curso.ciclo] = [];
        acc[curso.ciclo].push(curso);
        return acc;
    }, {} as Record<number, Curso[]>);

    const isEnrolled = (codigo: number) => {
        return cursosSeleccionados.some((c) => c.curso.codigo === codigo);
    };

    const getNumeroVez = (codigo: number) => {
        const found = cursosSeleccionados.find((c) => c.curso.codigo === codigo);
        return found?.numero_vez || 1;
    };

    const handleSeleccionar = (curso: Curso) => {
        if (isEnrolled(curso.codigo)) return;
        if (isExcedido || isExacto) {
            setShowCreditLimitModal(true);
            return;
        }
        if (!curso.isSelectable) {
            setShowRepetir(curso.codigo);
            setNumeroVezTemp(2);
            return;
        }
        setShowNumeroVez(curso.codigo);
        setNumeroVezTemp(1);
    };

    const handleConfirmarNumeroVez = (curso: Curso) => {
        onSeleccionarCurso(curso, numeroVezTemp);
        setShowNumeroVez(null);
        setShowRepetir(null);
    };

    const handleRepetir = (curso: Curso) => {
        onSeleccionarCurso(curso, 2);
        setShowRepetir(null);
    };

    const getTipoColor = (tipo: string) => {
        const colors: Record<string, string> = {
            EG: "bg-emerald-500/20 text-emerald-400",
            EE: "bg-orange-500/20 text-orange-400",
            ES: "bg-sky-500/20 text-sky-400",
        };
        return colors[tipo] || "bg-gray-500/20 text-gray-400";
    };

    const creditosRestantes = maxCreditos - totalCreditos;

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onVolver}
                        className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-semibold text-white">
                        {isMobile ? "Selección de Cursos" : "Lista de Cursos"}
                    </h2>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#121723] rounded-lg border border-[#353943]">
                        <span className="text-xs text-white/50">Tipo:</span>
                        <span className="text-xs font-medium text-white">{tipoMatricula}</span>
                        <span className="text-white/20">|</span>
                        <span className="text-xs text-white/50">Créditos:</span>
                        <span
                            className={`text-xs font-bold ${isExcedido
                                    ? "text-red-400"
                                    : isExacto
                                        ? "text-green-400"
                                        : "text-white"
                                }`}
                        >
                            {totalCreditos} / {maxCreditos}
                        </span>
                        {isExcedido && (
                            <span className="text-[10px] text-red-400 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Excedido
                            </span>
                        )}
                        {isExacto && totalCreditos > 0 && (
                            <span className="text-[10px] text-green-400 flex items-center gap-1">
                                {/* <Check className="w-3 h-3" /> */}
                                Límite alcanzado
                            </span>
                        )}
                    </div>

                    {!isMobile && (
                        <button
                            onClick={onCambiarVista}
                            className="flex items-center gap-2 px-3 py-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <Grid className="w-4 h-4" />
                            <span className="text-sm hidden sm:inline">Vista Malla</span>
                        </button>
                    )}

                    <button
                        onClick={onConfirmar}
                        disabled={cursosSeleccionados.length === 0 || isExcedido}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${cursosSeleccionados.length === 0 || isExcedido
                                ? "bg-gray-500/20 text-white/30 cursor-not-allowed"
                                : "bg-primary hover:bg-primary/90 text-white"
                            }`}
                    >
                        Confirmar Prematrícula
                    </button>
                </div>
            </div>

            {/* Modal de límite de créditos */}
            {showCreditLimitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="bg-[#1d2430] border border-[#353943] rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="w-6 h-6 text-yellow-500" />
                            <h3 className="text-lg font-semibold text-white">
                                Límite de Créditos Alcanzado
                            </h3>
                        </div>
                        <p className="text-white/70 text-sm mb-2">
                            {isExcedido
                                ? `Has superado el límite de ${maxCreditos} créditos. Total actual: ${totalCreditos} créditos.`
                                : `Has alcanzado el límite de ${maxCreditos} créditos.`}
                        </p>
                        <p className="text-white/50 text-xs mb-4">
                            {isExcedido
                                ? "Elimina algunos cursos para poder seleccionar más."
                                : "No puedes seleccionar más cursos."}
                        </p>
                        <button
                            onClick={() => setShowCreditLimitModal(false)}
                            className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-[#1d2430] border border-[#353943] rounded-lg overflow-hidden">
                {Object.keys(cursosPorCiclo)
                    .sort((a, b) => Number(a) - Number(b))
                    .map((ciclo) => {
                        const cicloNum = Number(ciclo);
                        const cursosDelCiclo = cursosPorCiclo[cicloNum];
                        const isExpanded = expandedCiclo === cicloNum;

                        return (
                            <div key={ciclo} className="border-b border-[#353943] last:border-b-0">
                                <button
                                    onClick={() =>
                                        setExpandedCiclo(isExpanded ? null : cicloNum)
                                    }
                                    className="w-full px-4 py-3 flex items-center justify-between bg-[#121723] hover:bg-[#1a2030] transition-colors"
                                >
                                    <span className="text-white font-medium">
                                        Ciclo {ciclo} ({cursosDelCiclo.length} cursos)
                                    </span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-white/50 transition-transform ${isExpanded ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {isExpanded && (
                                    <div className="p-2 space-y-1">
                                        {cursosDelCiclo.map((curso) => {
                                            const enrolled = isEnrolled(curso.codigo);
                                            const showSelector = showNumeroVez === curso.codigo;
                                            const showRepetirOption = showRepetir === curso.codigo;
                                            const isBlocked = (isExcedido || isExacto) && !enrolled;

                                            return (
                                                <div
                                                    key={curso.codigo}
                                                    className={`p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${enrolled
                                                            ? "bg-yellow-500/10 border border-yellow-500/30"
                                                            : isBlocked
                                                                ? "opacity-40 border border-gray-500/20"
                                                                : curso.isSelectable
                                                                    ? "hover:bg-white/5 border border-transparent"
                                                                    : "opacity-60 border border-transparent hover:border-red-500/20"
                                                        }`}
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 flex-1 min-w-0">
                                                        {/* Fila 1: código + nombre */}
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <span className="text-sm font-mono text-white/50">
                                                                {curso.codigo}
                                                            </span>
                                                            <span className="text-sm text-white truncate">
                                                                {curso.nombre}
                                                            </span>
                                                        </div>

                                                        {/* Fila 2 en mobile: badges, se envuelven si no caben */}
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span
                                                                className={`px-2 py-0.5 rounded text-xs font-medium ${getTipoColor(
                                                                    curso.tipo
                                                                )}`}
                                                            >
                                                                {curso.tipo}
                                                            </span>
                                                            <span className="text-xs text-white/30">
                                                                {curso.creditos} créditos
                                                            </span>
                                                            {!curso.isSelectable && !enrolled && !isBlocked && !esPeriodoVerano && (
                                                                <span className="text-[10px] text-gray-400/60 flex items-center gap-1">
                                                                    <RotateCcw className="w-3 h-3" />
                                                                    Repetición
                                                                </span>
                                                            )}
                                                            {isBlocked && (
                                                                <span className="text-[10px] text-yellow-500/60 flex items-center gap-1">
                                                                    <AlertCircle className="w-3 h-3" />
                                                                    Bloqueado
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        {enrolled ? (
                                                            <>
                                                                <span className="text-xs text-white/50">
                                                                    {getNumeroVez(curso.codigo) === 1
                                                                        ? "1era"
                                                                        : getNumeroVez(curso.codigo) === 2
                                                                            ? "2da"
                                                                            : getNumeroVez(curso.codigo) === 3
                                                                                ? "3ra"
                                                                                : "4ta"}
                                                                </span>
                                                                <button
                                                                    onClick={() => onEliminarCurso(curso.codigo)}
                                                                    className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        ) : showRepetirOption ? (
                                                            <div className="flex items-center gap-2">
                                                                <select
                                                                    value={numeroVezTemp}
                                                                    onChange={(e) =>
                                                                        setNumeroVezTemp(Number(e.target.value))
                                                                    }
                                                                    className="px-2 py-1 rounded border border-[#353943] bg-[#121723] text-white text-xs focus:outline-none focus:border-primary"
                                                                >
                                                                    <option value={1}>1era</option>
                                                                    <option value={2}>2da</option>
                                                                    <option value={3}>3ra</option>
                                                                    <option value={4}>4ta</option>
                                                                </select>
                                                                <button
                                                                    onClick={() =>
                                                                        handleConfirmarNumeroVez(curso)
                                                                    }
                                                                    className="px-3 py-1 bg-primary hover:bg-primary/90 text-white text-xs rounded transition-colors"
                                                                >
                                                                    {/* <Check className="w-3 h-3" />  */}
                                                                    Confirmar
                                                                </button>
                                                                <button
                                                                    onClick={() => setShowRepetir(null)}
                                                                    className="px-3 py-1 text-white/50 hover:text-white hover:bg-white/5 rounded transition-colors"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        ) : showSelector ? (
                                                            <div className="flex items-center gap-2">
                                                                <select
                                                                    value={numeroVezTemp}
                                                                    onChange={(e) =>
                                                                        setNumeroVezTemp(Number(e.target.value))
                                                                    }
                                                                    className="px-2 py-1 rounded border border-[#353943] bg-[#121723] text-white text-xs focus:outline-none focus:border-primary"
                                                                >
                                                                    <option value={1}>1era</option>
                                                                    <option value={2}>2da</option>
                                                                    <option value={3}>3ra</option>
                                                                    <option value={4}>4ta</option>
                                                                </select>
                                                                <button
                                                                    onClick={() =>
                                                                        handleConfirmarNumeroVez(curso)
                                                                    }
                                                                    className="px-3 py-1 bg-primary hover:bg-primary/90 text-white text-xs rounded transition-colors"
                                                                >
                                                                    {/* <Check className="w-3 h-3" />  */}
                                                                    Confirmar
                                                                </button>
                                                                <button
                                                                    onClick={() => setShowNumeroVez(null)}
                                                                    className="px-3 py-1 text-white/50 hover:text-white hover:bg-white/5 rounded transition-colors"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        ) : curso.isSelectable ? (
                                                            <button
                                                                onClick={() => handleSeleccionar(curso)}
                                                                disabled={isBlocked}
                                                                className={`px-3 py-1 text-xs rounded transition-colors ${isBlocked
                                                                        ? "bg-gray-500/20 text-white/30 cursor-not-allowed"
                                                                        : "bg-primary hover:bg-primary/80 text-white"
                                                                    }`}
                                                            >
                                                                Seleccionar
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleSeleccionar(curso)}
                                                                disabled={isBlocked}
                                                                className={`px-3 py-1 text-xs rounded transition-colors flex items-center gap-1 ${isBlocked
                                                                        ? "bg-gray-500/20 text-white/30 cursor-not-allowed"
                                                                        : "bg-gray-500/20 hover:bg-gray-500/30 text-gray-400"
                                                                    }`}
                                                            >
                                                                <RotateCcw className="w-3 h-3" />
                                                                Repetición
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
            </div>

            <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <span className="text-sm text-white/50">Total de créditos:</span>
                    <span
                        className={`ml-2 text-lg font-bold ${isExcedido ? "text-red-400" : isExacto ? "text-green-400" : "text-white"
                            }`}
                    >
                        {totalCreditos}
                    </span>
                    <span className="text-sm text-white/30"> / {maxCreditos} máx</span>
                    {isExcedido && (
                        <span className="ml-2 text-xs text-red-400">
                            (Excedido por {totalCreditos - maxCreditos} créditos)
                        </span>
                    )}
                </div>
                <div>
                    <span className="text-sm text-white/50">
                        Cursos seleccionados:{" "}
                        <span className="text-white font-medium">
                            {cursosSeleccionados.length}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
}