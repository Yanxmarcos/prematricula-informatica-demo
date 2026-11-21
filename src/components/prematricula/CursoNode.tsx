// src/components/prematricula/CursoNode.tsx
"use client";

import { forwardRef, useState } from "react";
import { BookOpen, Zap, Star, BadgeCent, RotateCcw, X, Lock } from "lucide-react";

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

interface CursoNodeProps {
    curso: Curso;
    isSelectable: boolean;
    isEnrolled: boolean;
    isSelected: boolean;
    isPrerequisite: boolean;
    isSuccessor: boolean;
    numeroVez?: number;
    onClick: (curso: Curso) => void;
    onRightClick: (e: React.MouseEvent, curso: Curso) => void;
    onRemove: (codigo: number) => void;
    rowStart: number;
    colStart: number;
    isCreditLimitReached?: boolean;
}

const typeToColor = {
    EG: "emerald",
    EE: "orange",
    ES: "sky",
};

const typeIcons = {
    EG: BookOpen,
    EE: Zap,
    ES: Star,
};

const colorMap: Record<
    string,
    { bg: string; hover: string; border: string }
> = {
    emerald: {
        // bg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
        bg: "bg-green-700",
        // hover: "hover:from-emerald-400 hover:to-emerald-500",
        hover: "bg-green-600",
        border: "border-emerald-400",
    },
    orange: {
        // bg: "bg-gradient-to-br from-orange-500 to-orange-600",
        bg: "bg-orange-700",
        // hover: "hover:from-orange-400 hover:to-orange-500",
        hover: "bg-orange-600",
        border: "border-orange-400",
    },
    sky: {
        // bg: "bg-gradient-to-br from-sky-500 to-sky-600",
        bg: "bg-blue-800",
        // hover: "hover:from-sky-400 hover:to-sky-500",
        hover: "bg-blue-700",
        border: "border-sky-400",
    },
};

export const CursoNode = forwardRef<HTMLDivElement, CursoNodeProps>(
    (
        {
            curso,
            isSelectable,
            isEnrolled,
            isSelected,
            isPrerequisite,
            isSuccessor,
            numeroVez,
            onClick,
            onRightClick,
            onRemove,
            rowStart,
            colStart,
            isCreditLimitReached = false,
        },
        ref
    ) => {
        const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
        const colorTheme = colorMap[typeToColor[curso.tipo] || "sky"];
        const TypeIcon = typeIcons[curso.tipo] || BookOpen;

        const baseClasses = "w-[126px] h-[112px] p-2 rounded-xl backdrop-blur-sm border relative overflow-hidden group mx-auto";

        let bgClasses = colorTheme.bg;
        let stateClasses = "border-2 border-white/20";
        let shadowClasses = "shadow-lg";
        let cursorClass = "cursor-default";
        let opacityClass = "opacity-100";

        // Determinar si el nodo debe estar bloqueado por límite de créditos
        const isBlocked = isCreditLimitReached && !isEnrolled && isSelectable;

        if (isEnrolled) {
            bgClasses = "bg-gradient-to-br from-yellow-400 to-yellow-500";
            stateClasses = "ring-4 ring-yellow-400/80 ring-offset-4 ring-offset-[#1d2430] border-2 border-yellow-400";
            shadowClasses = "shadow-2xl shadow-yellow-400/50";
            cursorClass = "cursor-pointer";
        } else if (isSelected) {
            stateClasses = "ring-4 ring-yellow-400/80 ring-offset-4 ring-offset-[#1d2430] scale-[1.02] border-2 border-primary";
            shadowClasses = "shadow-2xl shadow-primary/50";
            cursorClass = "cursor-pointer";
        } else if (isPrerequisite) {
            stateClasses = "ring-3 ring-red-700/80 scale-[1.02] border-2 border-red-400";
            shadowClasses = "shadow-xl shadow-red-700/40";
            cursorClass = "cursor-pointer";
        } else if (isSuccessor) {
            stateClasses = "ring-3 ring-green-400/80 scale-[1.02] border-2 border-green-400";
            shadowClasses = "shadow-xl shadow-green-400/40";
            cursorClass = "cursor-pointer";
        } else if (isBlocked) {
            bgClasses = "bg-gradient-to-br from-gray-700 to-gray-800";
            stateClasses = "border-2 border-gray-500/20 opacity-50";
            shadowClasses = "shadow-lg shadow-gray-900/20";
            cursorClass = "cursor-not-allowed";
        } else if (!isSelectable) {
            bgClasses = "bg-gradient-to-br from-gray-600 to-gray-700";
            stateClasses = "border-2 border-gray-500/30 opacity-60";
            shadowClasses = "shadow-lg shadow-gray-900/20";
            cursorClass = "cursor-default";
        } else {
            cursorClass = "cursor-pointer";
        }

        const handleClick = () => {
            if (isEnrolled) {
                setShowRemoveConfirm(!showRemoveConfirm);
                return;
            }
            if (isBlocked) {
                return;
            }
            if (isSelected || isSelectable) {
                onClick(curso);
            }
        };

        const handleContextMenu = (e: React.MouseEvent) => {
            e.preventDefault();
            if (isBlocked) {
                return;
            }
            onRightClick(e, curso);
        };

        const handleRemove = () => {
            onRemove(curso.codigo);
            setShowRemoveConfirm(false);
        };

        const getNumeroVezLabel = (num: number) => {
            const labels: Record<number, string> = {
                1: "1era",
                2: "2da",
                3: "3ra",
                4: "4ta",
            };
            return labels[num] || `${num}era`;
        };

        return (
            <div
                ref={ref}
                className="absolute"
                style={{
                    gridRowStart: rowStart,
                    gridColumnStart: colStart,
                    width: "156px",
                    height: "112px",
                }}
            >
                <div
                    onClick={handleClick}
                    onContextMenu={handleContextMenu}
                    className={`${baseClasses} ${cursorClass} ${opacityClass}
            transition-all duration-300 transform ${!isBlocked && isSelectable && !isEnrolled && !isSelected ? "hover:scale-[1.02]" : ""}
            ${bgClasses} ${stateClasses} ${shadowClasses}
          `}
                >
                    {/* Overlay de hover para cursos seleccionables */}
                    {!isBlocked && isSelectable && !isEnrolled && !isSelected && (
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                    )}

                    {/* Bloqueo por créditos */}
                    {isBlocked && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 rounded-xl">
                            <div className="flex flex-col items-center gap-1">
                                <Lock className="w-6 h-6 text-white/30" />
                                <span className="text-[8px] text-white/30">Límite alcanzado</span>
                            </div>
                        </div>
                    )}

                    {/* Badge de "Solo por repetición" */}
                    {!isSelectable && !isEnrolled && !isBlocked && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50 rounded-xl pointer-events-none">
                            <div className="bg-gray-500 text-white text-[8px] px-2 py-1 rounded-full font-bold flex items-center gap-1 shadow-lg">
                                <RotateCcw className="w-3 h-3" />
                                Solo por Repetición
                            </div>
                        </div>
                    )}

                    {/* Badge de curso seleccionado */}
                    {isEnrolled && (
                        <div className="absolute top-1.5 right-1.5 z-20">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowRemoveConfirm(!showRemoveConfirm);
                                }}
                                className="w-5 h-5 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
                            >
                                <X className="w-2.5 h-2.5" />
                            </button>
                        </div>
                    )}

                    {/* Badge de número de vez */}
                    {isEnrolled && numeroVez && (
                        <div className="absolute top-1.5 left-1.5 z-20">
                            <span
                                className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold ${numeroVez === 1
                                        ? "bg-green-500 text-white"
                                        : numeroVez === 2
                                            ? "bg-yellow-500 text-black"
                                            : numeroVez === 3
                                                ? "bg-orange-500 text-white"
                                                : "bg-red-500 text-white"
                                    }`}
                            >
                                {getNumeroVezLabel(numeroVez)}
                            </span>
                        </div>
                    )}

                    {/* Contenido principal */}
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="flex-1 flex items-start min-h-0">
                            <h3 className="text-white text-xs leading-tight line-clamp-2 pr-1 font-medium w-full">
                                {curso.nombre}
                            </h3>
                        </div>

                        <div className="space-y-1 mt-1">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-1 bg-black/30 px-1.5 py-0.5 rounded backdrop-blur-sm">
                                    <span className="text-white/90 text-[10px] font-medium">
                                        {curso.codigo}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-1 bg-white/20 px-1.5 py-0.5 rounded backdrop-blur-sm">
                                    {/* <TypeIcon className="w-2.5 h-2.5 text-white" /> */}
                                    <span className="text-white text-[8px] font-semibold">
                                        {curso.tipo}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-[8px]">
                                <div className="flex items-center space-x-1 bg-amber-900/60 px-1.5 py-0.5 rounded-md">
                                    {/* <BadgeCent className="w-2.5 h-2.5 text-yellow-300" /> */}
                                    <span className="text-white font-medium">{curso.creditos}</span>
                                </div>
                                <div className="flex items-center space-x-0.5">
                                    <span className="bg-[#1D293D]/50 px-1 py-0.5 rounded text-white font-medium border border-blue-400/30 text-[7px]">
                                        T:{curso.hrs_teoria}
                                    </span>
                                    <span className="bg-[#364153]/50 px-1 py-0.5 rounded text-white font-medium border border-green-400/30 text-[7px]">
                                        P:{curso.hrs_practica}
                                    </span>
                                    <span className="bg-[#3F3F46]/50 px-1 py-0.5 rounded text-white font-medium border border-purple-400/30 text-[7px]">
                                        L:{curso.hrs_lab}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Indicadores de relaciones */}
                    {(isPrerequisite || isSuccessor) && (
                        <div className="absolute top-1.5 right-1.5 z-10">
                            <div
                                className={`w-2 h-2 rounded-full ${isPrerequisite ? "bg-red-700" : "bg-green-400"
                                    } animate-pulse shadow-lg`}
                            />
                        </div>
                    )}

                    {/* Modal de confirmación de eliminación */}
                    {showRemoveConfirm && (
                        <div
                            className="absolute inset-0 z-30 bg-black/60 rounded-xl flex items-center justify-center p-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-2 max-w-[160px]">
                                <p className="text-white text-[10px] text-center mb-1.5">
                                    ¿Eliminar este curso?
                                </p>
                                <div className="flex gap-1.5">
                                    <button
                                        onClick={handleRemove}
                                        className="flex-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-[10px] rounded transition-colors"
                                    >
                                        Sí
                                    </button>
                                    <button
                                        onClick={() => setShowRemoveConfirm(false)}
                                        className="flex-1 px-2 py-1 bg-gray-500/30 hover:bg-gray-500/50 text-white text-[10px] rounded transition-colors"
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

CursoNode.displayName = "CursoNode";