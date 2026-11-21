// src/app/(dashboard)/administracion/prematriculas/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2, RefreshCw, FileDown, RotateCcw } from "lucide-react";
import { PrematriculaFilters } from "@/components/admin/PrematriculaFilters";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import { formatDatePeru } from "@/lib/utils/date";

interface Prematricula {
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
    };
    periodo: {
        id: number;
        semestre: string;
        anio: number;
    };
    promedio: number | null;
    creado_en: string;
    cursos: Array<{
        curso_codigo: number;
        numero_vez: number;
        curso: {
            nombre: string;
            creditos: number;
            ciclo: number;
        };
    }>;
}

interface Periodo {
    id: number;
    semestre: string;
    anio: number;
}

interface TipoMatricula {
    id: number;
    nombre: string;
}

export default function PrematriculasPage() {
    const router = useRouter();
    const [prematriculas, setPrematriculas] = useState<Prematricula[]>([]);
    const [periodos, setPeriodos] = useState<Periodo[]>([]);
    const [tiposMatricula, setTiposMatricula] = useState<TipoMatricula[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        search: "",
        periodo_id: "",
        tipo_matricula_id: "",
    });
    const [repeticionFilter, setRepeticionFilter] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [prematriculaToDelete, setPrematriculaToDelete] = useState<Prematricula | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const fetchTiposMatricula = async () => {
        try {
            const response = await fetch("/api/admin/tipos-matricula");
            if (response.ok) {
                const data = await response.json();
                setTiposMatricula(data);
            }
        } catch (error) {
            console.error("Error fetching tipos matricula:", error);
        }
    };

    const fetchPrematriculas = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append("search", filters.search);
            if (filters.periodo_id) params.append("periodo_id", filters.periodo_id);
            if (filters.tipo_matricula_id) params.append("tipo_matricula_id", filters.tipo_matricula_id);
            params.append("activo", "true");

            const response = await fetch(`/api/admin/prematriculas?${params}`);
            if (!response.ok) {
                throw new Error("Error al cargar prematrículas");
            }
            const data = await response.json();
            setPrematriculas(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPeriodos();
        fetchTiposMatricula();
    }, []);

    useEffect(() => {
        fetchPrematriculas();
    }, [filters]);

    const handleFilter = (newFilters: any) => {
        setFilters(newFilters);
    };

    const handleDelete = (prematricula: Prematricula) => {
        setPrematriculaToDelete(prematricula);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!prematriculaToDelete) return;
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/admin/prematriculas/${prematriculaToDelete.id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Error al eliminar");
            }
            await fetchPrematriculas();
            setDeleteModalOpen(false);
            setPrematriculaToDelete(null);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Error al eliminar");
        } finally {
            setIsDeleting(false);
        }
    };

    const getNombreCompleto = (usuario: Prematricula["usuario"]) => {
        const partes = [
            usuario.nombres || "",
            usuario.apellido_paterno || "",
            usuario.apellido_materno || "",
        ];
        return partes.filter(Boolean).join(" ") || "Sin nombre";
    };

    const getTotalCreditos = (cursos: Prematricula["cursos"]) => {
        return cursos.reduce((sum, c) => sum + (c.curso?.creditos || 0), 0);
    };

    // Determinar si un curso es de repetición según el período y el ciclo del curso
    const esCursoRepeticion = (ciclo: number, semestre: string) => {
        if (!semestre) return false;
        const ciclosPermitidos = semestre === "I" ? [1, 3, 5, 7, 9] : [2, 4, 6, 8, 10];
        return !ciclosPermitidos.includes(ciclo);
    };

    // Verificar si el estudiante tiene algún curso de repetición
    const tieneRepeticion = (cursos: Prematricula["cursos"], semestre: string) => {
        return cursos.some(c => {
            if (!c.curso?.ciclo) return false;
            return esCursoRepeticion(c.curso.ciclo, semestre);
        });
    };

    const prematriculasFiltradas = !repeticionFilter
    ? prematriculas
    : prematriculas.filter((p) => {
          const tieneRep = tieneRepeticion(p.cursos, p.periodo.semestre);
          return repeticionFilter === "si" ? tieneRep : !tieneRep;
      });

    if (loading && prematriculas.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white/70">Cargando prematrículas...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Prematrículas</h1>
                    <p className="text-white/50">Visualiza y gestiona todas las prematrículas registradas</p>
                </div>
                <button
                    onClick={fetchPrematriculas}
                    className="flex items-center gap-2 px-4 py-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Actualizar
                </button>
            </div>

            {/* Filtros */}
            <PrematriculaFilters
                filters={filters}
                onFilter={setFilters}
                repeticion={repeticionFilter}
                onRepeticionChange={setRepeticionFilter}
                periodos={periodos}
                tiposMatricula={tiposMatricula}
                isLoading={loading}
            />

            {/* Tabla */}
            <div className="bg-[#1d2430] border border-[#353943] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#121723] border-b border-[#353943]">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                                    Estudiante
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                                    Código
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                                    Período
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                                    Tipo Matrícula
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-white/50 uppercase tracking-wider">
                                    Créditos
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-white/50 uppercase tracking-wider">
                                    Repetición
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-white/50 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#353943]">
                            {prematriculasFiltradas.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-white/40">
                                        No hay prematrículas registradas
                                    </td>
                                </tr>
                            ) : (
                                prematriculasFiltradas.map((p) => {
                                    const tieneRep = tieneRepeticion(p.cursos, p.periodo.semestre);
                                    return (
                                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3">
                                                <div>
                                                    <span className="text-white font-medium">
                                                        {getNombreCompleto(p.usuario)}
                                                    </span>
                                                    <p className="text-xs text-white/40">{p.usuario.correo_inst}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-white/70 font-mono">
                                                    {p.usuario.codigo_estudiante || "N/A"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-white/70">
                                                    {p.periodo.semestre}-{p.periodo.anio}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    p.tipo_matricula.nombre === "Regular"
                                                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                                        : p.tipo_matricula.nombre === "Especial"
                                                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                                        : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                                }`}>
                                                    {p.tipo_matricula.nombre}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="text-sm text-white font-medium">
                                                    {getTotalCreditos(p.cursos)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {tieneRep ? (
                                                    <span className="flex items-center justify-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30 whitespace-nowrap">
                                                        <RotateCcw className="w-3 h-3" />
                                                        Sí
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-white/30">No</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-white/50">
                                                    {formatDatePeru(p.creado_en)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => router.push(`/administracion/prematriculas/${p.id}`)}
                                                        className="p-1.5 rounded-lg text-blue-400/40 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                                                        title="Ver detalle"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(p)}
                                                        className="p-1.5 rounded-lg text-red-400/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmDeleteModal
                isOpen={deleteModalOpen}
                title="Eliminar Prematrícula"
                message={`¿Estás seguro de eliminar la prematrícula de ${prematriculaToDelete ? getNombreCompleto(prematriculaToDelete.usuario) : ''}? Esta acción no se puede deshacer.`}
                onConfirm={confirmDelete}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setPrematriculaToDelete(null);
                }}
                isLoading={isDeleting}
            />
        </div>
    );
}