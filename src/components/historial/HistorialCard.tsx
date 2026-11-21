// src/components/historial/HistorialCard.tsx
"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Eye, Calendar, Award, BookOpen, RotateCcw, FileDown } from "lucide-react";
import { formatDatePeru } from "@/lib/utils/date";
import { generarPDFPrematricula } from "@/lib/utils/prematricula-pdf";

interface HistorialCardProps {
    prematricula: {
        id: number;
        periodo: string;
        tipo_matricula: string;
        total_creditos: number;
        total_cursos: number;
        creado_en: string;
        cursos: Array<{
            codigo: number;
            nombre: string;
            numero_vez: number;
            creditos: number;
            tipo: string;
            ciclo: number;
        }>;
        usuario?: {
            nombres: string | null;
            apellido_paterno: string | null;
            apellido_materno: string | null;
            codigo_estudiante: string | null;
        };
        promedio?: number | null;
    };
    onVerDetalle?: (id: number) => void;
    esPeriodoVerano?: boolean;
}

export function HistorialCard({ prematricula, onVerDetalle, esPeriodoVerano = false }: HistorialCardProps) {
    const [expandido, setExpandido] = useState(false);

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
            Regular: "bg-green-500/20 text-green-400 border border-green-500/30",
            Especial: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
            Excepcional: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
        };
        return colors[tipo] || "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    };

    const esCursoRepeticion = (ciclo: number) => {
        if (esPeriodoVerano) return false;
        const semestre = prematricula.periodo.split("-")[0].trim().toUpperCase();
        if (semestre === "EXT") return false;
        const ciclosPermitidos =
            semestre === "I"
                ? [1, 3, 5, 7, 9]
                : [2, 4, 6, 8, 10];
        return !ciclosPermitidos.includes(ciclo);
    };

    const cursosRepeticion = prematricula.cursos.filter(c => esCursoRepeticion(c.ciclo));

    const handleExportPDF = () => {
        // Obtener nombre completo del estudiante
        const nombreCompleto = prematricula.usuario
            ? [prematricula.usuario.nombres, prematricula.usuario.apellido_paterno, prematricula.usuario.apellido_materno]
                .filter(Boolean)
                .join(" ")
            : "Estudiante";

        const data = {
            estudiante: nombreCompleto,
            codigo: prematricula.usuario?.codigo_estudiante || "N/A",
            tipo_matricula: prematricula.tipo_matricula,
            promedio: prematricula.promedio || null,
            periodo: prematricula.periodo,
            total_creditos: prematricula.total_creditos,
            creado_en: prematricula.creado_en,
            cursos: prematricula.cursos.map(c => ({
                codigo: c.codigo,
                nombre: c.nombre,
                ciclo: c.ciclo,
                creditos: c.creditos,
                numero_vez: c.numero_vez,
                tipo: c.tipo,
            })),
        };

        generarPDFPrematricula(data);
    };

    return (
        <div className="bg-[#1d2430] border border-[#353943] rounded-lg overflow-hidden hover:border-primary/30 transition-all duration-300">
            {/* Header - siempre visible */}
            <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#121723]">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-white">
                        {prematricula.periodo}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTipoColor(prematricula.tipo_matricula)}`}>
                        {prematricula.tipo_matricula}
                    </span>
                    {cursosRepeticion.length > 0 && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
                            <RotateCcw className="w-3 h-3" />
                            {cursosRepeticion.length} repetición(es)
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-4 text-sm">
                    <span className="text-white/50">
                        <BookOpen className="w-3.5 h-3.5 inline mr-1" />
                        {prematricula.total_cursos} cursos
                    </span>
                    <span className="text-white/50">
                        <Award className="w-3.5 h-3.5 inline mr-1" />
                        {prematricula.total_creditos} créditos
                    </span>
                    <span className="text-white/30 text-xs">
                        <Calendar className="w-3.5 h-3.5 inline mr-1" />
                        {formatDatePeru(prematricula.creado_en)}
                    </span>
                    <button
                        onClick={() => setExpandido(!expandido)}
                        className="text-white/50 hover:text-white transition-colors"
                    >
                        {expandido ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    
                    {/* BOTÓN EXPORTAR PDF */}
                    <button
                        onClick={handleExportPDF}
                        className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors"
                        title="Exportar a PDF"
                    >
                        <FileDown className="w-3.5 h-3.5" />
                        PDF
                    </button>
                    
                    {onVerDetalle && (
                        <button
                            onClick={() => onVerDetalle(prematricula.id)}
                            className="px-3 py-1 bg-primary hover:bg-primary/80 text-white text-xs rounded transition-colors flex items-center gap-1"
                        >
                            <Eye className="w-3 h-3" />
                            Detalle
                        </button>
                    )}
                </div>
            </div>

            {/* Body - expandible */}
            {expandido && (
                <div className="p-4 border-t border-[#353943]">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs text-white/40">
                                    <th className="px-2 py-1">Código</th>
                                    <th className="px-2 py-1">Curso</th>
                                    <th className="px-2 py-1 text-center">Ciclo</th>
                                    <th className="px-2 py-1 text-center">N° Vez</th>
                                    <th className="px-2 py-1 text-center">Créditos</th>
                                    <th className="px-2 py-1 text-center">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#353943]">
                                {prematricula.cursos.map((curso) => {
                                    const esRepeticion = esCursoRepeticion(curso.ciclo);
                                    return (
                                        <tr key={curso.codigo} className="text-sm">
                                            <td className="px-2 py-1.5 text-white/50 font-mono">
                                                {curso.codigo}
                                            </td>
                                            <td className="px-2 py-1.5 text-white">
                                                {curso.nombre}
                                            </td>
                                            <td className="px-2 py-1.5 text-center text-white/50">
                                                {curso.ciclo}
                                            </td>
                                            <td className="px-2 py-1.5 text-center text-white/50">
                                                {getNumeroVezLabel(curso.numero_vez)}
                                            </td>
                                            <td className="px-2 py-1.5 text-center text-white/50">
                                                {curso.creditos}
                                            </td>
                                            <td className="px-2 py-1.5 text-center">
                                                {esRepeticion ? (
                                                    <span className="flex items-center justify-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30 whitespace-nowrap">
                                                        <RotateCcw className="w-3 h-3" />
                                                        Repetición
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-white/30">En línea</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="border-t border-[#353943]">
                                <tr>
                                    <td colSpan={3} className="px-2 py-2 text-right text-sm text-white/50">
                                        Total:
                                    </td>
                                    <td className="px-2 py-2 text-center text-sm font-bold text-white">
                                        {prematricula.total_creditos}
                                    </td>
                                    <td colSpan={2}></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}