// src/components/historial/DetallePrematriculaModal.tsx
"use client";

import { X, Calendar, Award, BookOpen, User, RotateCcw } from "lucide-react";
import { formatDatePeru } from "@/lib/utils/date";

interface CursoDetalle {
    codigo: number;
    nombre: string;
    numero_vez: number;
    creditos: number;
    tipo: string;
    ciclo: number;
}

interface DetallePrematriculaModalProps {
    isOpen: boolean;
    onClose: () => void;
    prematricula: {
        id: number;
        periodo: string;
        tipo_matricula: string;
        total_creditos: number;
        total_cursos: number;
        creado_en: string;
        promedio?: number;
        cursos: CursoDetalle[];
    } | null;
    esPeriodoVerano?: boolean;
}

export function DetallePrematriculaModal({
    isOpen,
    onClose,
    prematricula,
    esPeriodoVerano = false,
}: DetallePrematriculaModalProps) {
    if (!isOpen || !prematricula) return null;

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
            Regular: "text-green-400",
            Especial: "text-yellow-400",
            Excepcional: "text-purple-400",
        };
        return colors[tipo] || "text-gray-400";
    };

    const esCursoRepeticion = (ciclo: number) => {
        if (esPeriodoVerano) return false;
        const semestre = prematricula.periodo.split("-")[1];
        const ciclosPermitidos = semestre === "I" ? [1, 3, 5, 7, 9] : [2, 4, 6, 8, 10];
        return !ciclosPermitidos.includes(ciclo);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[#1d2430] border border-[#353943] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-[#353943] sticky top-0 bg-[#1d2430] z-10">
                    <div>
                        <h3 className="text-xl font-bold text-white">Detalle de Prematrícula</h3>
                        <p className="text-sm text-white/50">{prematricula.periodo} - {formatDatePeru(prematricula.creado_en)}</p>
                    </div>
                    <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-[#121723] rounded-lg p-3">
                            <p className="text-xs text-white/40">Período</p>
                            <p className="text-sm font-medium text-white">{prematricula.periodo}</p>
                        </div>
                        <div className="bg-[#121723] rounded-lg p-3">
                            <p className="text-xs text-white/40">Tipo</p>
                            <p className={`text-sm font-medium ${getTipoColor(prematricula.tipo_matricula)}`}>
                                {prematricula.tipo_matricula}
                            </p>
                        </div>
                        <div className="bg-[#121723] rounded-lg p-3">
                            <p className="text-xs text-white/40">Cursos</p>
                            <p className="text-sm font-medium text-white">{prematricula.total_cursos}</p>
                        </div>
                        <div className="bg-[#121723] rounded-lg p-3">
                            <p className="text-xs text-white/40">Créditos</p>
                            <p className="text-sm font-medium text-white">{prematricula.total_creditos}</p>
                        </div>
                    </div>

                    {prematricula.promedio && (
                        <div className="bg-[#121723] rounded-lg p-3">
                            <p className="text-xs text-white/40">Promedio Ponderado</p>
                            <p className="text-sm font-medium text-white">{prematricula.promedio}</p>
                        </div>
                    )}

                    <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Cursos Seleccionados</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#121723] border-b border-[#353943]">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-white/50">Código</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-white/50">Curso</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-white/50">Ciclo</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-white/50">Tipo</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-white/50">N° Vez</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-white/50">Créditos</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-white/50">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#353943]">
                                    {prematricula.cursos.map((curso) => {
                                        const esRepeticion = esCursoRepeticion(curso.ciclo);
                                        return (
                                            <tr key={curso.codigo} className="hover:bg-white/5 transition-colors">
                                                <td className="px-3 py-2 text-sm font-mono text-white/50">{curso.codigo}</td>
                                                <td className="px-3 py-2 text-sm text-white">{curso.nombre}</td>
                                                <td className="px-3 py-2 text-center text-sm text-white/50">{curso.ciclo}</td>
                                                <td className="px-3 py-2 text-center">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${curso.tipo === "EG" ? "bg-emerald-500/20 text-emerald-400" :
                                                        curso.tipo === "EE" ? "bg-orange-500/20 text-orange-400" :
                                                        "bg-sky-500/20 text-sky-400"
                                                    }`}>
                                                        {curso.tipo}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 text-center text-sm text-white/50">{getNumeroVezLabel(curso.numero_vez)}</td>
                                                <td className="px-3 py-2 text-center text-sm text-white font-medium">{curso.creditos}</td>
                                                <td className="px-3 py-2 text-center">
                                                    {esRepeticion ? (
                                                        <span className="flex items-center justify-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30 whitespace-nowrap">
                                                            <RotateCcw className="w-3 h-3" /> Repetición
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-white/30">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot className="border-t border-[#353943] bg-[#121723]">
                                    <tr>
                                        <td colSpan={5} className="px-3 py-2 text-right text-sm text-white/50">Total:</td>
                                        <td className="px-3 py-2 text-center text-sm font-bold text-white">{prematricula.total_creditos}</td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end p-6 border-t border-[#353943]">
                    <button onClick={onClose} className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}