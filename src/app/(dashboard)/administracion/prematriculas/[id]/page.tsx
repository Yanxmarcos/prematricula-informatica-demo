// src/app/(dashboard)/administracion/prematriculas/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, BookOpen, Calendar, Award, Trash2, RotateCcw } from "lucide-react";
import { formatDatePeru } from "@/lib/utils/date";

interface PrematriculaDetail {
    id: number;
    usuario: {
        id: number;
        codigo_estudiante: string | null;
        nombres: string | null;
        apellido_paterno: string | null;
        apellido_materno: string | null;
        correo_inst: string;
    };
    tipo_matricula: {
        id: number;
        nombre: string;
        creditos_max: number;
        creditos_min: number;
    };
    periodo: {
        id: number;
        semestre: string;
        anio: number;
        tipo: string;
        descripcion: string | null;
    };
    promedio: number | null;
    creado_en: string;
    cursos: Array<{
        id: number;
        curso_codigo: number;
        numero_vez: number;
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
    }>;
}

export default function PrematriculaDetallePage() {
    const params = useParams();
    const router = useRouter();
    const [prematricula, setPrematricula] = useState<PrematriculaDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchPrematricula = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/admin/prematriculas/${params.id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Prematrícula no encontrada");
                }
                throw new Error("Error al cargar prematrícula");
            }
            const data = await response.json();
            setPrematricula(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params.id) {
            fetchPrematricula();
        }
    }, [params.id]);

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de eliminar esta prematrícula?")) return;
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/admin/prematriculas/${params.id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Error al eliminar");
            }
            router.push("/administracion/prematriculas");
        } catch (err) {
            alert(err instanceof Error ? err.message : "Error al eliminar");
        } finally {
            setIsDeleting(false);
        }
    };

    const getNombreCompleto = () => {
        if (!prematricula) return "";
        const partes = [
            prematricula.usuario.nombres || "",
            prematricula.usuario.apellido_paterno || "",
            prematricula.usuario.apellido_materno || "",
        ];
        return partes.filter(Boolean).join(" ") || "Sin nombre";
    };

    const getTotalCreditos = () => {
        if (!prematricula) return 0;
        return prematricula.cursos.reduce((sum, c) => sum + (c.curso?.creditos || 0), 0);
    };

    const getNumeroVezLabel = (numero: number) => {
        const labels: Record<number, string> = {
            1: "1era",
            2: "2da",
            3: "3ra",
            4: "4ta",
        };
        return labels[numero] || `${numero}era`;
    };

    // Función para determinar si un curso es de repetición
    const esCursoRepeticion = (ciclo: number) => {
        if (!prematricula) return false;
        const semestre = prematricula.periodo.semestre;
        if (semestre === "EXT") return false;
        const ciclosPermitidos = semestre === "I" ? [1, 3, 5, 7, 9] : [2, 4, 6, 8, 10];
        return !ciclosPermitidos.includes(ciclo);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white/70">Cargando prematrícula...</div>
            </div>
        );
    }

    if (error || !prematricula) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <p className="text-red-400">{error || "Prematrícula no encontrada"}</p>
                <button
                    onClick={() => router.push("/administracion/prematriculas")}
                    className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al listado
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push("/administracion/prematriculas")}
                        className="text-white/50 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Detalle de Prematrícula</h1>
                        <p className="text-white/50">
                            {getNombreCompleto()} - {prematricula.usuario.codigo_estudiante || "Sin código"}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                    <Trash2 className="w-4 h-4" />
                    {isDeleting ? "Eliminando..." : "Eliminar Prematrícula"}
                </button>
            </div>

            {/* Información del Estudiante */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-white/40">Estudiante</p>
                            <p className="text-sm text-white font-medium">{getNombreCompleto()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-white/40">Código</p>
                            <p className="text-sm text-white font-medium font-mono">
                                {prematricula.usuario.codigo_estudiante || "N/A"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                            <Award className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-white/40">Promedio</p>
                            <p className="text-sm text-white font-medium">
                                {prematricula.promedio || "N/A"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-white/40">Fecha de Registro</p>
                            <p className="text-sm text-white font-medium">
                                {formatDatePeru(prematricula.creado_en)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-4">
                    <p className="text-xs text-white/40">Período</p>
                    <p className="text-lg font-bold text-white">
                        {prematricula.periodo.semestre}-{prematricula.periodo.anio}
                    </p>
                    <p className="text-xs text-white/30">{prematricula.periodo.descripcion || "Sin descripción"}</p>
                </div>

                <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-4">
                    <p className="text-xs text-white/40">Tipo de Matrícula</p>
                    <p className={`text-lg font-bold ${prematricula.tipo_matricula.nombre === "Regular"
                            ? "text-green-400"
                            : prematricula.tipo_matricula.nombre === "Especial"
                                ? "text-yellow-400"
                                : "text-purple-400"
                        }`}>
                        {prematricula.tipo_matricula.nombre}
                    </p>
                    <p className="text-xs text-white/30">
                        {prematricula.tipo_matricula.creditos_min} - {prematricula.tipo_matricula.creditos_max} créditos
                    </p>
                </div>

                <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-4">
                    <p className="text-xs text-white/40">Total de Créditos</p>
                    <p className="text-lg font-bold text-white">{getTotalCreditos()}</p>
                    <p className="text-xs text-white/30">{prematricula.cursos.length} cursos seleccionados</p>
                </div>
            </div>

            {/* Lista de Cursos */}
            <div className="bg-[#1d2430] border border-[#353943] rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-[#353943]">
                    <h3 className="text-sm font-semibold text-white">Cursos Seleccionados</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#121723] border-b border-[#353943]">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-white/50">Código</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-white/50">Curso</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-white/50">Ciclo</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-white/50">Tipo</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-white/50">Créditos</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-white/50">N° Vez</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-white/50">Horas</th>
                                {/* <th className="px-4 py-2 text-center text-xs font-medium text-white/50">Estado</th> */}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#353943]">
                            {prematricula.cursos.map((c) => {
                                const esRepeticion = esCursoRepeticion(c.curso.ciclo);
                                return (
                                    <tr key={c.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-2">
                                            <span className="text-sm text-white/70 font-mono">{c.curso.codigo}</span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-white">{c.curso.nombre}</span>
                                                {esRepeticion && (
                                                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30 whitespace-nowrap">
                                                        <RotateCcw className="w-3 h-3" />
                                                        Repetición
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <span className="text-sm text-white/50">{c.curso.ciclo}</span>
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.curso.tipo === "EG" ? "bg-emerald-500/20 text-emerald-400" :
                                                    c.curso.tipo === "EE" ? "bg-orange-500/20 text-orange-400" :
                                                        "bg-sky-500/20 text-sky-400"
                                                }`}>
                                                {c.curso.tipo}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <span className="text-sm text-white font-medium">{c.curso.creditos}</span>
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.numero_vez === 1 ? "bg-green-500/20 text-green-400" :
                                                    c.numero_vez === 2 ? "bg-yellow-500/20 text-yellow-400" :
                                                        c.numero_vez === 3 ? "bg-orange-500/20 text-orange-400" :
                                                            "bg-red-500/20 text-red-400"
                                                }`}>
                                                {getNumeroVezLabel(c.numero_vez)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <span className="text-xs text-white/40">
                                                T:{c.curso.hrs_teoria} P:{c.curso.hrs_practica} L:{c.curso.hrs_lab}
                                            </span>
                                        </td>
                                        {/* <td className="px-4 py-2 text-center">
                                            {esRepeticion ? (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/20 text-red-400 border border-red-500/30 whitespace-nowrap">
                                                    Repetición
                                                </span>
                                            ) : (
                                                <span className="text-xs text-white/30">-</span>
                                            )}
                                        </td> */}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}