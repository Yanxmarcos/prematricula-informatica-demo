// src/components/prematricula/ResumenCursos.tsx
"use client";
import { useState } from "react";
import { Trash2, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";

interface CursoSeleccionado {
    curso: {
        codigo: number;
        nombre: string;
        ciclo: number;
        tipo: string;
        creditos: number;
        hrs_teoria: number;
        hrs_practica: number;
        hrs_lab: number;
    };
    numero_vez: number;
    esRepeticion?: boolean; // <-- NUEVO
}

interface ResumenCursosProps {
    cursos: CursoSeleccionado[];
    onEliminar?: (codigo: number) => void;
    totalCreditos?: number;
    maxCreditos?: number;
}

export function ResumenCursos({
    cursos,
    onEliminar,
    totalCreditos,
    maxCreditos,
}: ResumenCursosProps) {
    const [expandido, setExpandido] = useState(true);

    if (cursos.length === 0) {
        return (
            <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-4 text-center">
                <p className="text-white/40">No has seleccionado ningún curso aún</p>
            </div>
        );
    }

    const getNumeroVezLabel = (num: number) => {
        const labels: Record<number, string> = {
            1: "1era",
            2: "2da",
            3: "3ra",
            4: "4ta",
        };
        return labels[num] || `${num}era`;
    };

    const getTipoColor = (tipo: string) => {
        const colors: Record<string, string> = {
            EG: "bg-emerald-500/20 text-emerald-400",
            EE: "bg-orange-500/20 text-orange-400",
            ES: "bg-sky-500/20 text-sky-400",
        };
        return colors[tipo] || "bg-gray-500/20 text-gray-400";
    };

    const getNumeroVezColor = (num: number) => {
        const colors: Record<number, string> = {
            1: "bg-green-500/20 text-green-400",
            2: "bg-yellow-500/20 text-yellow-400",
            3: "bg-orange-500/20 text-orange-400",
            4: "bg-red-500/20 text-red-400",
        };
        return colors[num] || "bg-gray-500/20 text-gray-400";
    };

    const creds = totalCreditos || cursos.reduce((sum, c) => sum + c.curso.creditos, 0);
    const max = maxCreditos || 22;

    return (
        <div className="bg-[#1d2430] border border-[#353943] rounded-lg overflow-hidden">
            <button
                onClick={() => setExpandido(!expandido)}
                className="w-full px-4 py-3 flex items-center justify-between bg-[#121723] hover:bg-[#1a2030] transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-white font-medium">
                        Cursos Seleccionados ({cursos.length})
                    </span>
                    <span
                        className={`text-sm font-bold ${creds > max ? "text-red-400" : "text-white"
                            }`}
                    >
                        {creds} / {max} créditos
                    </span>
                </div>
                {expandido ? (
                    <ChevronUp className="w-5 h-5 text-white/50" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-white/50" />
                )}
            </button>

            {expandido && (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#121723] border-b border-[#353943]">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-white/50">
                                    Código
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-white/50">
                                    Curso
                                </th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-white/50">
                                    Ciclo
                                </th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-white/50">
                                    Tipo
                                </th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-white/50">
                                    Créditos
                                </th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-white/50">
                                    N° Vez
                                </th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-white/50">
                                    Horas
                                </th>
                                {/* <th className="px-4 py-2 text-center text-xs font-medium text-white/50">
                                    Estado
                                </th> */}
                                {onEliminar && (
                                    <th className="px-4 py-2 text-center text-xs font-medium text-white/50">
                                        Acción
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#353943]">
                            {cursos.map((item) => (
                                <tr key={item.curso.codigo} className="hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-2">
                                        <span className="text-sm font-mono text-white/70">
                                            {item.curso.codigo}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-white">{item.curso.nombre}</span>
                                            {item.esRepeticion && (
                                                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30 whitespace-nowrap">
                                                    <RotateCcw className="w-3 h-3" />
                                                    Repetición
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <span className="text-sm text-white/50">{item.curso.ciclo}</span>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <span
                                            className={`px-2 py-0.5 rounded text-xs font-medium ${getTipoColor(
                                                item.curso.tipo
                                            )}`}
                                        >
                                            {item.curso.tipo}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <span className="text-sm text-white font-medium">
                                            {item.curso.creditos}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <span
                                            className={`px-2 py-0.5 rounded text-xs font-medium ${getNumeroVezColor(
                                                item.numero_vez
                                            )}`}
                                        >
                                            {getNumeroVezLabel(item.numero_vez)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <span className="text-xs text-white/40">
                                            T:{item.curso.hrs_teoria} P:{item.curso.hrs_practica} L:
                                            {item.curso.hrs_lab}
                                        </span>
                                    </td>
                                    {/* <td className="px-4 py-2 text-center">
                                        {item.esRepeticion ? (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/20 text-red-400 border border-red-500/30 whitespace-nowrap">
                                                Repetición
                                            </span>
                                        ) : (
                                            <span className="text-xs text-white/30">-</span>
                                        )}
                                    </td> */}
                                    {onEliminar && (
                                        <td className="px-4 py-2 text-center">
                                            <button
                                                onClick={() => onEliminar(item.curso.codigo)}
                                                className="p-1 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                                title="Eliminar curso"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-[#121723] border-t border-[#353943]">
                            <tr>
                                <td colSpan={4} className="px-4 py-3 text-right text-sm text-white/70">
                                    Total de créditos:
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span
                                        className={`text-lg font-bold ${creds > max ? "text-red-400" : "text-white"
                                            }`}
                                    >
                                        {creds}
                                    </span>
                                </td>
                                <td colSpan={4}></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
}