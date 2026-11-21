// src/app/(dashboard)/estudiante/prematricula/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormularioInicial } from "@/components/prematricula/FormularioInicial";
import { MallaCurricular } from "@/components/prematricula/MallaCurricular";
import { ResumenCursos } from "@/components/prematricula/ResumenCursos";
import { ConfirmacionModal } from "@/components/prematricula/ConfirmacionModal";
import { Loader2, AlertCircle, X } from "lucide-react";

interface Periodo {
    id: number;
    semestre: string;
    anio: number;
    tipo: string;
    descripcion: string | null;
    fecha_inicio: string;
    fecha_fin: string;
    activo: boolean;
    label: string;
}

interface Curso {
    codigo: number;
    nombre: string;
    ciclo: number;
    tipo: string;
    creditos: number;
    hrs_teoria: number;
    hrs_practica: number;
    hrs_lab: number;
    departamento?: string;
    isSelectable: boolean;
    prereqCodes: number[];
    sucesores: number[];
}

interface TipoMatricula {
    id: number;
    nombre: string;
    creditos_max: number;
    creditos_min: number;
}

export default function PrematriculaPage() {
    const { data: session } = useSession();
    const router = useRouter();

    // Estados del formulario inicial
    const [periodos, setPeriodos] = useState<Periodo[]>([]);
    const [periodoActivo, setPeriodoActivo] = useState<Periodo | null>(null);
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>("");
    const [promedio, setPromedio] = useState<string>("");
    const [tipoMatriculaId, setTipoMatriculaId] = useState<string>("");
    const [tiposMatricula, setTiposMatricula] = useState<TipoMatricula[]>([]);
    const [cargandoPeriodos, setCargandoPeriodos] = useState(true);

    // Estados de la malla
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [cursosSeleccionados, setCursosSeleccionados] = useState<
        Array<{ curso: Curso; numero_vez: number }>
    >([]);
    const [view, setView] = useState<"form" | "malla" | "resumen">("form");
    const [cargandoMalla, setCargandoMalla] = useState(false);

    // Estados de confirmación
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Estado para el tipo de matrícula seleccionado
    const [tipoMatriculaSeleccionado, setTipoMatriculaSeleccionado] = useState<TipoMatricula | null>(null);

    const [showPrematriculaExistenteModal, setShowPrematriculaExistenteModal] = useState(false);
    const [prematriculaExistenteData, setPrematriculaExistenteData] = useState<any>(null);

    // Detectar si es mobile
    const [isMobile, setIsMobile] = useState(false);

    const esPeriodoVerano = periodoActivo?.semestre === "EXT";

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Cargar períodos al inicio
    useEffect(() => {
        const fetchPeriodos = async () => {
            try {
                const response = await fetch("/api/estudiante/periodos");
                if (!response.ok) throw new Error("Error al cargar períodos");
                const data = await response.json();
                setPeriodos(data.periodos);
                setPeriodoActivo(data.periodo_activo);

                // Guardar información de prematrícula existente
                if (data.tiene_prematricula && data.prematricula_existente) {
                    setPrematriculaExistenteData(data.prematricula_existente);
                }

                if (data.periodo_activo) {
                    setPeriodoSeleccionado(String(data.periodo_activo.id));
                }

                const tiposResponse = await fetch("/api/estudiante/tipos-matricula");
                if (tiposResponse.ok) {
                    const tiposData = await tiposResponse.json();
                    setTiposMatricula(tiposData);
                }
            } catch (error) {
                console.error("Error:", error);
                setError("Error al cargar los datos iniciales");
            } finally {
                setCargandoPeriodos(false);
            }
        };

        fetchPeriodos();
    }, []);

    // Actualizar tipo de matrícula seleccionado cuando cambia el ID
    useEffect(() => {
        if (tipoMatriculaId) {
            const tipo = tiposMatricula.find((t) => t.id === parseInt(tipoMatriculaId));
            setTipoMatriculaSeleccionado(tipo || null);
        } else {
            setTipoMatriculaSeleccionado(null);
        }
    }, [tipoMatriculaId, tiposMatricula]);

    // Manejar envío del formulario inicial
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!periodoSeleccionado || !promedio || !tipoMatriculaId) {
            setError("Completa todos los campos del formulario");
            return;
        }

        // Verificar si ya tiene prematrícula en el período seleccionado
        if (prematriculaExistenteData) {
            setShowPrematriculaExistenteModal(true);
            return;
        }

        setCargandoMalla(true);

        try {
            const response = await fetch(
                `/api/estudiante/malla?periodo_id=${periodoSeleccionado}`
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al cargar la malla");
            }
            const data = await response.json();
            setCursos(data);
            setView("malla");
        } catch (error) {
            setError(error instanceof Error ? error.message : "Error al cargar la malla");
        } finally {
            setCargandoMalla(false);
        }
    };

    // Manejar selección de cursos
    const handleSeleccionarCurso = (
        curso: Curso,
        numero_vez: number = 1
    ) => {
        if (cursosSeleccionados.some((c) => c.curso.codigo === curso.codigo)) {
            return;
        }

        setCursosSeleccionados((prev) => [...prev, { curso, numero_vez }]);
    };

    // Manejar eliminación de curso
    const handleEliminarCurso = (codigo: number) => {
        setCursosSeleccionados((prev) =>
            prev.filter((c) => c.curso.codigo !== codigo)
        );
    };

    // Manejar cambio de número de vez
    const handleCambiarNumeroVez = (codigo: number, numero_vez: number) => {
        setCursosSeleccionados((prev) =>
            prev.map((c) =>
                c.curso.codigo === codigo ? { ...c, numero_vez } : c
            )
        );
    };

    // Manejar confirmación final
    const handleConfirmar = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch("/api/estudiante/prematricula", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    periodo_id: parseInt(periodoSeleccionado),
                    tipo_matricula_id: parseInt(tipoMatriculaId),
                    promedio: parseFloat(promedio),
                    cursos: cursosSeleccionados.map((c) => ({
                        curso_codigo: c.curso.codigo,
                        numero_vez: c.numero_vez,
                    })),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al guardar la prematrícula");
            }

            setSuccess(true);
            setShowConfirmModal(false);
            setView("resumen");

            setTimeout(() => {
                router.push("/estudiante/inicio");
            }, 3000);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Error al guardar");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Volver al formulario
    const handleVolverFormulario = () => {
        setView("form");
        setCursosSeleccionados([]);
    };

    // Función para determinar si un curso es de repetición
    const esRepeticion = (curso: Curso) => {
        if (esPeriodoVerano) return false;
        const ciclosPermitidos = periodoActivo?.semestre === "I" ? [1, 3, 5, 7, 9] : [2, 4, 6, 8, 10];
        return !ciclosPermitidos.includes(curso.ciclo);
    };

    // Cursos con estado de repetición para el resumen
    const cursosConEstado = cursosSeleccionados.map(item => ({
        ...item,
        esRepeticion: esRepeticion(item.curso)
    }));

    // Modal de prematrícula existente
    const PrematriculaExistenteModal = () => {
        if (!showPrematriculaExistenteModal || !prematriculaExistenteData) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                <div className="bg-[#1d2430] border border-[#353943] rounded-2xl max-w-lg w-full p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-yellow-500/20">
                                <AlertCircle className="w-6 h-6 text-yellow-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white">
                                Ya tienes una prematrícula registrada
                            </h3>
                        </div>
                        <button
                            onClick={() => setShowPrematriculaExistenteModal(false)}
                            className="text-white/50 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <p className="text-white/70 text-sm">
                            Ya has registrado una prematrícula para el período <span className="text-white font-medium">
                                {periodoActivo ? `${periodoActivo.semestre}-${periodoActivo.anio}` : "actual"}
                            </span>.
                            No puedes realizar otra prematrícula en el mismo período.
                        </p>

                        <div className="bg-[#121723] rounded-lg p-4 space-y-2">
                            <p className="text-sm text-white/50">
                                <span className="text-white/70">Tipo de matrícula:</span>{" "}
                                <span className="text-white">{prematriculaExistenteData.tipo_matricula}</span>
                            </p>
                            <p className="text-sm text-white/50">
                                <span className="text-white/70">Cursos seleccionados:</span>{" "}
                                <span className="text-white">{prematriculaExistenteData.cursos.length}</span>
                            </p>
                            <p className="text-sm text-white/50">
                                <span className="text-white/70">Total créditos:</span>{" "}
                                <span className="text-white">{prematriculaExistenteData.total_creditos}</span>
                            </p>
                        </div>

                        <p className="text-xs text-white/30">
                            Si deseas modificar tu prematrícula, consulta con la Secretaría de Escuela.
                        </p>
                    </div>

                    <div className="flex justify-end mt-6 pt-4 border-t border-[#353943]">
                        <button
                            onClick={() => setShowPrematriculaExistenteModal(false)}
                            className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (cargandoPeriodos) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="ml-2 text-white/70">Cargando datos...</span>
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">¡Prematrícula Exitosa!</h2>
                <p className="text-white/50 mt-2">Tu prematrícula ha sido registrada correctamente.</p>
                <p className="text-white/30 text-sm mt-1">Redirigiendo al panel principal...</p>
            </div>
        );
    }

    if (error && view === "form") {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <p className="text-red-400">{error}</p>
                <button
                    onClick={() => setError(null)}
                    className="mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    // Obtener el nombre del tipo de matrícula para mostrar
    const nombreTipoMatricula = tipoMatriculaSeleccionado?.nombre || "";
    const maxCreditos = tipoMatriculaSeleccionado?.creditos_max || 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Prematrícula</h1>
                <p className="text-white/50">
                    {view === "form" && "Completa el formulario para iniciar tu prematrícula"}
                    {view === "malla" && "Selecciona los cursos que deseas llevar"}
                    {view === "resumen" && "Resumen de tu prematrícula"}
                </p>
            </div>

            {view === "form" && (
                <FormularioInicial
                    periodos={periodos}
                    periodoActivo={periodoActivo}
                    periodoSeleccionado={periodoSeleccionado}
                    setPeriodoSeleccionado={setPeriodoSeleccionado}
                    promedio={promedio}
                    setPromedio={setPromedio}
                    tipoMatricula={tipoMatriculaId}
                    setTipoMatricula={setTipoMatriculaId}
                    tiposMatricula={tiposMatricula}
                    onSubmit={handleFormSubmit}
                    isLoading={cargandoMalla}
                    error={error}
                    tienePrematriculaExistente={!!prematriculaExistenteData}
                />
            )}

            {view === "malla" && (
                <div>
                    <MallaCurricular
                        cursos={cursos}
                        cursosSeleccionados={cursosSeleccionados}
                        onSeleccionarCurso={handleSeleccionarCurso}
                        onEliminarCurso={handleEliminarCurso}
                        onCambiarNumeroVez={handleCambiarNumeroVez}
                        onConfirmar={() => setShowConfirmModal(true)}
                        onVolver={handleVolverFormulario}
                        periodoId={parseInt(periodoSeleccionado)}
                        tipoMatricula={nombreTipoMatricula}
                        maxCreditos={maxCreditos}
                        isMobile={isMobile}
                        esPeriodoVerano={esPeriodoVerano}
                        semestre={periodoActivo?.semestre || "I"} 
                    />
                </div>
            )}

            {view === "resumen" && (
                <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">
                        Resumen de tu Prematrícula
                    </h2>
                    <ResumenCursos
                        cursos={cursosConEstado}
                        onEliminar={handleEliminarCurso}
                        totalCreditos={cursosSeleccionados.reduce(
                            (sum, c) => sum + c.curso.creditos,
                            0
                        )}
                        maxCreditos={maxCreditos}
                    />
                    <div className="mt-4 flex gap-3">
                        <button
                            onClick={() => router.push("/estudiante/inicio")}
                            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                        >
                            Ir al Panel
                        </button>
                    </div>
                </div>
            )}

            <ConfirmacionModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmar}
                cursos={cursosSeleccionados}
                isLoading={isSubmitting}
                error={error}
            />

            <PrematriculaExistenteModal />
        </div>
    );
}