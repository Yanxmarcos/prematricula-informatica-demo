// src/components/prematricula/MallaCurricular.tsx
"use client";

import { useState, useEffect, useRef, useMemo, useLayoutEffect } from "react";
import { ArrowLeft, Grid, List, AlertCircle, Check, Info, RotateCcw } from "lucide-react";
import { CursoNode } from "./CursoNode";
import { ListaCursos } from "./ListaCursos";
import { ResumenCursos } from "./ResumenCursos";

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
    prereqCodes: number[];
    sucesores: number[];
}

interface MallaCurricularProps {
    cursos: Curso[];
    cursosSeleccionados: Array<{ curso: Curso; numero_vez: number }>;
    onSeleccionarCurso: (curso: Curso, numero_vez?: number) => void;
    onEliminarCurso: (codigo: number) => void;
    onCambiarNumeroVez: (codigo: number, numero_vez: number) => void;
    onConfirmar: () => void;
    onVolver: () => void;
    periodoId: number;
    tipoMatricula: string;
    maxCreditos: number;
    isMobile: boolean;
    esPeriodoVerano: boolean;
    semestre: string;
}

const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

const codeToColMap: Record<number, number> = {
    13024: 1, 13029: 2, 13027: 3, 13021: 4, 13023: 5, 13028: 6, 13031: 7,
    13040: 1, 13043: 2, 13036: 3, 13039: 4, 13038: 5, 13034: 6, 13046: 7,
    13629: 1, 13630: 3, 13631: 4, 13632: 5, 13633: 6, 13634: 7,
    13635: 1, 13636: 2, 13637: 4, 13638: 5, 13639: 6, 13640: 7,
    13641: 2, 13642: 3, 13643: 4, 13644: 5, 13645: 6, 13646: 7,
    14068: 1, 14069: 2, 14070: 3, 14071: 4, 14072: 5, 14073: 6,
    14074: 2, 14075: 3, 14076: 4, 14077: 5, 14078: 6, 14079: 7,
    14080: 4, 14081: 5, 14082: 6, 14083: 7,
    14084: 1, 14085: 2, 13400: 3, 14087: 4, 14088: 5, 14089: 7,
    14090: 1, 14091: 3, 14092: 4, 14093: 5, 14094: 6, 14300: 7,
};

export function MallaCurricular({
    cursos,
    cursosSeleccionados,
    onSeleccionarCurso,
    onEliminarCurso,
    onCambiarNumeroVez,
    onConfirmar,
    onVolver,
    periodoId,
    tipoMatricula,
    maxCreditos,
    isMobile,
    esPeriodoVerano,
    semestre,
}: MallaCurricularProps) {
    const [viewMode, setViewMode] = useState<"malla" | "lista">(
        isMobile ? "lista" : "malla"
    );
    const [selectedCourse, setSelectedCourse] = useState<Curso | null>(null);
    const [showNumeroVezSelector, setShowNumeroVezSelector] = useState(false);
    const [numeroVezTemp, setNumeroVezTemp] = useState(1);
    const [cursoSeleccionando, setCursoSeleccionando] = useState<Curso | null>(null);
    const [lines, setLines] = useState<any[]>([]);
    const [showCreditLimitModal, setShowCreditLimitModal] = useState(false);
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        curso: Curso | null;
    }>({ visible: false, x: 0, y: 0, curso: null });

    const gridRef = useRef<HTMLDivElement>(null);
    const courseRefs = useRef<Record<number, HTMLDivElement>>({});
    const svgRef = useRef<SVGSVGElement>(null);

    const totalCreditos = useMemo(() => {
        return cursosSeleccionados.reduce((sum, c) => sum + c.curso.creditos, 0);
    }, [cursosSeleccionados]);

    const creditosRestantes = maxCreditos - totalCreditos;
    const isExacto = totalCreditos === maxCreditos;
    const isExcedido = totalCreditos > maxCreditos;

    const relationships = useMemo(() => {
        if (!selectedCourse) return { prerequisites: [], successors: [] };
        return {
            prerequisites: selectedCourse.prereqCodes || [],
            successors: cursos
                .filter((c) => c.prereqCodes.includes(selectedCourse.codigo))
                .map((c) => c.codigo),
        };
    }, [selectedCourse, cursos]);

    // Calcular líneas para las flechas
    useLayoutEffect(() => {
        if (cursos.length === 0) return;

        const calculateLines = () => {
            const newLines: any[] = [];
            const gridRect = gridRef.current?.getBoundingClientRect();
            if (!gridRect) return;

            cursos.forEach((course) => {
                if (course.prereqCodes && course.prereqCodes.length > 0) {
                    course.prereqCodes.forEach((prereqCode) => {
                        const fromNode = courseRefs.current[prereqCode];
                        const toNode = courseRefs.current[course.codigo];

                        if (fromNode && toNode) {
                            const fromRect = fromNode.getBoundingClientRect();
                            const toRect = toNode.getBoundingClientRect();

                            newLines.push({
                                id: `${prereqCode}-${course.codigo}`,
                                x1: fromRect.left + fromRect.width / 2 - gridRect.left,
                                y1: fromRect.top + fromRect.height - gridRect.top,
                                x2: toRect.left + toRect.width / 2 - gridRect.left,
                                y2: toRect.top - gridRect.top,
                                isPrereqHighlighted:
                                    selectedCourse &&
                                    (selectedCourse.codigo === course.codigo &&
                                        selectedCourse.prereqCodes?.includes(prereqCode)),
                                isSuccessorHighlighted:
                                    selectedCourse && prereqCode === selectedCourse.codigo,
                                isVisible:
                                    !selectedCourse ||
                                    (selectedCourse.codigo === course.codigo &&
                                        selectedCourse.prereqCodes?.includes(prereqCode)) ||
                                    prereqCode === selectedCourse.codigo,
                            });
                        }
                    });
                }
            });
            setLines(newLines);
        };

        const timer = setTimeout(calculateLines, 150);
        window.addEventListener("resize", calculateLines);
        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", calculateLines);
        };
    }, [selectedCourse, cursos]);

    const handleCourseClick = (curso: Curso) => {
        // Verificar límite de créditos
        if (isExcedido || isExacto) {
            setShowCreditLimitModal(true);
            return;
        }

        // Si ya está seleccionado, confirmar selección
        if (selectedCourse?.codigo === curso.codigo) {
            setCursoSeleccionando(curso);
            setNumeroVezTemp(1);
            setShowNumeroVezSelector(true);
            return;
        }

        // Si el curso ya está inscrito, no hacer nada
        if (cursosSeleccionados.some((c) => c.curso.codigo === curso.codigo)) {
            return;
        }

        // Si no es seleccionable, no hacer nada
        if (!curso.isSelectable) {
            return;
        }

        // Seleccionar curso para mostrar relaciones
        setSelectedCourse(curso);
    };

    const handleRightClick = (e: React.MouseEvent, curso: Curso) => {
        e.preventDefault();

        // === VALIDACIÓN 1: PERÍODO VERANO ===
        // En Verano NO hay repetición, todos los cursos son seleccionables
        if (esPeriodoVerano) {
            return;
        }

        // === VALIDACIÓN 2: CURSO SELECCIONABLE ===
        // Si el curso es selectable normalmente, NO mostrar menú de repetición
        if (curso.isSelectable) {
            return;
        }

        // === VALIDACIÓN 3: LÍMITE DE CRÉDITOS ===
        if (isExcedido || isExacto) {
            setShowCreditLimitModal(true);
            return;
        }

        // === VALIDACIÓN 4: CURSO YA INSCRITO ===
        if (cursosSeleccionados.some((c) => c.curso.codigo === curso.codigo)) {
            return;
        }

        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            curso: curso,
        });
    };

    const handleRepeticionClick = () => {
        if (contextMenu.curso) {
            // Verificar límite de créditos nuevamente
            if (isExcedido || isExacto) {
                setShowCreditLimitModal(true);
                setContextMenu({ visible: false, x: 0, y: 0, curso: null });
                return;
            }
            setCursoSeleccionando(contextMenu.curso);
            setNumeroVezTemp(2);
            setShowNumeroVezSelector(true);
            setContextMenu({ visible: false, x: 0, y: 0, curso: null });
        }
    };

    const handleConfirmarNumeroVez = () => {
        if (cursoSeleccionando) {
            onSeleccionarCurso(cursoSeleccionando, numeroVezTemp);
            setShowNumeroVezSelector(false);
            setCursoSeleccionando(null);
            setSelectedCourse(null);
        }
    };

    const handleCancelarSeleccion = () => {
        setShowNumeroVezSelector(false);
        setCursoSeleccionando(null);
        setSelectedCourse(null);
    };

    const isEnrolled = (codigo: number) => {
        return cursosSeleccionados.some((c) => c.curso.codigo === codigo);
    };

    const getNumeroVez = (codigo: number) => {
        const found = cursosSeleccionados.find((c) => c.curso.codigo === codigo);
        return found?.numero_vez || 1;
    };

    // Cerrar menú contextual al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = () => {
            setContextMenu({ visible: false, x: 0, y: 0, curso: null });
        };
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);

    // Si es mobile, forzar vista de lista
    useEffect(() => {
        if (isMobile) {
            setViewMode("lista");
        }
    }, [isMobile]);

    // Si la vista es lista, mostrar el componente de lista
    if (viewMode === "lista" || isMobile) {
        return (
            <ListaCursos
                cursos={cursos}
                cursosSeleccionados={cursosSeleccionados}
                onSeleccionarCurso={onSeleccionarCurso}
                onEliminarCurso={onEliminarCurso}
                onCambiarNumeroVez={onCambiarNumeroVez}
                onVolver={onVolver}
                onConfirmar={onConfirmar}
                onCambiarVista={() => setViewMode("malla")}
                totalCreditos={totalCreditos}
                maxCreditos={maxCreditos}
                tipoMatricula={tipoMatricula}
                isMobile={isMobile}
                isExcedido={isExcedido}
                isExacto={isExacto}
                esPeriodoVerano={esPeriodoVerano}
            />
        );
    }

    return (
        <div className="space-y-4">
            {/* Toolbar con créditos */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onVolver}
                        className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-semibold text-white">Malla Curricular</h2>
                </div>

                <div className="flex items-center gap-4">
                    {/* Tipo de matrícula y créditos */}
                    <div className="flex items-center gap-3 px-3 py-1.5 bg-[#121723] rounded-lg border border-[#353943]">
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
                                Límite alcanzado
                            </span>
                        )}
                    </div>

                    <button
                        onClick={() => setViewMode("lista")}
                        className="flex items-center gap-2 px-3 py-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <List className="w-4 h-4" />
                        <span className="text-sm hidden sm:inline">Vista Lista</span>
                    </button>

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

            {/* Selector de número de vez */}
            {showNumeroVezSelector && cursoSeleccionando && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="bg-[#1d2430] border border-[#353943] rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-white mb-1">
                            {cursoSeleccionando.nombre}
                        </h3>
                        <p className="text-xs text-white/50 mb-4">
                            Código: {cursoSeleccionando.codigo} | Ciclo: {cursoSeleccionando.ciclo} | Créditos: {cursoSeleccionando.creditos}
                        </p>
                        <p className="text-sm text-white/70 mb-4">
                            Selecciona el número de vez que llevarás este curso
                        </p>

                        <div className="grid grid-cols-4 gap-3 mb-6">
                            {[1, 2, 3, 4].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setNumeroVezTemp(num)}
                                    className={`px-4 py-3 rounded-lg font-medium transition-all ${numeroVezTemp === num
                                            ? "bg-primary text-white"
                                            : "bg-[#121723] border border-[#353943] text-white/70 hover:text-white hover:border-primary/50"
                                        }`}
                                >
                                    {num === 1 ? "1era" : num === 2 ? "2da" : num === 3 ? "3ra" : "4ta"}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleConfirmarNumeroVez}
                                className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
                            >
                                Confirmar
                            </button>
                            <button
                                onClick={handleCancelarSeleccion}
                                className="px-4 py-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Menú contextual para repetición */}
            {contextMenu.visible && (
                <div
                    className="fixed z-50 bg-[#1d2430] border border-[#353943] rounded-lg shadow-xl min-w-[200px] overflow-hidden"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <div className="px-4 py-2 border-b border-[#353943] bg-[#121723]">
                        <span className="text-xs font-medium text-white/50">
                            {contextMenu.curso?.nombre || "Curso"}
                        </span>
                    </div>
                    <button
                        onClick={handleRepeticionClick}
                        className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4 text-primary" />
                        Curso de Repetición
                    </button>
                    <button
                        onClick={() => setContextMenu({ visible: false, x: 0, y: 0, curso: null })}
                        className="w-full px-4 py-3 text-left text-sm text-white/50 hover:bg-white/5 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            )}

            {/* Grid de la malla con scroll horizontal */}
            <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-4 overflow-x-auto">
                <div
                    ref={gridRef}
                    className="relative"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "auto repeat(7, 126px)",
                        gridTemplateRows: `repeat(${romanNumerals.length}, 112px)`,
                        gap: "32px 32px",
                        minWidth: "fit-content",
                    }}
                >
                    {/* Ciclos */}
                    {romanNumerals.map((numeral, index) => {
                        const cycleNumber = index + 1;
                        const isSelectableCycle = cursos.some(
                            (c) => c.ciclo === cycleNumber && c.isSelectable
                        );

                        return (
                            <div
                                key={`cycle-${cycleNumber}`}
                                className="sticky left-0 z-20 flex items-center justify-center"
                                style={{
                                    gridRowStart: cycleNumber,
                                    gridColumnStart: 1,
                                    height: "112px",
                                    width: "45px",
                                }}
                            >
                                <div
                                    className={`flex flex-col items-center justify-center rounded-lg border h-full w-full ${isSelectableCycle
                                            ? "border-gray-500/30 bg-gray-500/10"
                                            : "border-gray-600/30 bg-gray-800/30"
                                        }`}
                                >
                                    <span
                                        className={`text-[10px] ${isSelectableCycle ? "text-white" : "text-gray-500"
                                            }`}
                                    >
                                        Ciclo
                                    </span>
                                    <span
                                        className={`text-lg font-bold ${isSelectableCycle ? "text-white" : "text-gray-500"
                                            }`}
                                    >
                                        {numeral}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {/* Capa SVG para flechas */}
                    <svg
                        ref={svgRef}
                        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
                        style={{ gridRowStart: 1, gridColumnStart: 1 }}
                    >
                        <defs>
                            <marker
                                id="arrowhead"
                                markerWidth="8"
                                markerHeight="5"
                                refX="0"
                                refY="2.5"
                                orient="auto"
                            >
                                <polygon
                                    points="0 0, 8 2.5, 0 5"
                                    className="fill-current text-gray-500/20"
                                />
                            </marker>
                            <marker
                                id="arrowhead-highlighted"
                                markerWidth="8"
                                markerHeight="5"
                                refX="0"
                                refY="2.5"
                                orient="auto"
                            >
                                <polygon
                                    points="0 0, 8 2.5, 0 5"
                                    className="fill-current text-red-700"
                                />
                            </marker>
                            <marker
                                id="arrowhead-successor"
                                markerWidth="8"
                                markerHeight="5"
                                refX="0"
                                refY="2.5"
                                orient="auto"
                            >
                                <polygon
                                    points="0 0, 8 2.5, 0 5"
                                    className="fill-current text-green-500"
                                />
                            </marker>
                        </defs>

                        {lines.map((line) => {
                            let lineColor = "text-gray-500/20";
                            let strokeW = 1.5;
                            let marker = "url(#arrowhead)";
                            let opacity = 0.4;

                            if (line.isPrereqHighlighted) {
                                lineColor = "text-red-700";
                                strokeW = 3;
                                marker = "url(#arrowhead-highlighted)";
                                opacity = 1;
                            } else if (line.isSuccessorHighlighted) {
                                lineColor = "text-green-500";
                                strokeW = 3;
                                marker = "url(#arrowhead-successor)";
                                opacity = 1;
                            } else if (line.isVisible) {
                                opacity = 0.6;
                            }

                            return (
                                <path
                                    key={line.id}
                                    d={`M ${line.x1} ${line.y1} C ${line.x1} ${line.y1 + 40}, ${line.x2} ${line.y2 - 40}, ${line.x2} ${line.y2 - 8}`}
                                    stroke="currentColor"
                                    strokeWidth={strokeW}
                                    fill="none"
                                    className={`transition-all duration-300 ${lineColor}`}
                                    markerEnd={marker}
                                    opacity={opacity}
                                />
                            );
                        })}
                    </svg>

                    {/* Nodos de cursos */}
                    {cursos.map((curso) => {
                        const colIndex = codeToColMap[curso.codigo] || 1;
                        const isEnrolledCourse = isEnrolled(curso.codigo);
                        const isSelected = selectedCourse?.codigo === curso.codigo;
                        const isPrerequisite = selectedCourse
                            ? relationships.prerequisites.includes(curso.codigo)
                            : false;
                        const isSuccessor = selectedCourse
                            ? relationships.successors.includes(curso.codigo)
                            : false;

                        return (
                            <CursoNode
                                key={curso.codigo}
                                ref={(el) => {
                                    if (el) {
                                        courseRefs.current[curso.codigo] = el;
                                    }
                                }}
                                curso={curso}
                                isSelectable={curso.isSelectable}
                                isEnrolled={isEnrolledCourse}
                                isSelected={isSelected}
                                isPrerequisite={isPrerequisite}
                                isSuccessor={isSuccessor}
                                numeroVez={isEnrolledCourse ? getNumeroVez(curso.codigo) : undefined}
                                onClick={handleCourseClick}
                                onRightClick={handleRightClick}
                                onRemove={onEliminarCurso}
                                rowStart={curso.ciclo}
                                colStart={colIndex + 1}
                                isCreditLimitReached={isExcedido || isExacto}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Resumen de cursos seleccionados */}
            <ResumenCursos
                cursos={cursosSeleccionados.map(item => {
                    let esRepeticion = false;
                    if (!esPeriodoVerano && semestre) {
                        const ciclosPermitidos = semestre === "I" ? [1, 3, 5, 7, 9] : [2, 4, 6, 8, 10];
                        esRepeticion = !ciclosPermitidos.includes(item.curso.ciclo);
                    }
                    return { ...item, esRepeticion };
                })}
                onEliminar={onEliminarCurso}
                totalCreditos={totalCreditos}
                maxCreditos={maxCreditos}
            />
        </div>
    );
}