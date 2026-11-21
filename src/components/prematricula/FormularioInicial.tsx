// src/components/prematricula/FormularioInicial.tsx
"use client";

import { useState, useEffect } from "react";
import { Info, AlertCircle } from "lucide-react";

interface Periodo {
    id: number;
    semestre: string;
    anio: number;
    label: string;
    activo: boolean;
}

interface FormularioInicialProps {
    periodos: Periodo[];
    periodoActivo: Periodo | null;
    periodoSeleccionado: string;
    setPeriodoSeleccionado: (value: string) => void;
    promedio: string;
    setPromedio: (value: string) => void;
    tipoMatricula: string;
    setTipoMatricula: (value: string) => void;
    tiposMatricula: any[];
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    error: string | null;
    tienePrematriculaExistente?: boolean; // <-- NUEVO
}

export function FormularioInicial({
    periodos,
    periodoActivo,
    periodoSeleccionado,
    setPeriodoSeleccionado,
    promedio,
    setPromedio,
    tipoMatricula,
    setTipoMatricula,
    tiposMatricula,
    onSubmit,
    isLoading,
    error,
    tienePrematriculaExistente = false, // <-- NUEVO con valor por defecto
}: FormularioInicialProps) {
    const [tiposDisponibles, setTiposDisponibles] = useState<any[]>([]);

    // Calcular tipos de matrícula disponibles según promedio
    useEffect(() => {
        const promedioNum = parseFloat(promedio);
        if (isNaN(promedioNum)) {
            setTiposDisponibles(tiposMatricula);
            return;
        }

        const disponibles = tiposMatricula.filter((tipo) => {
            if (tipo.nombre === "Excepcional" && promedioNum < 16) {
                return false;
            }
            return true;
        });

        setTiposDisponibles(disponibles);
    }, [promedio, tiposMatricula]);

    const InfoTooltip = ({ text }: { text: string }) => (
        <div className="group relative inline-flex ml-1">
            <Info className="w-4 h-4 text-white/30 hover:text-white/60 cursor-help transition-colors" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[#1d2430] border border-[#353943] rounded-lg text-xs text-white/70 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {text}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1d2430]"></div>
            </div>
        </div>
    );

    const handlePromedioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        // Permitir vacío para poder borrar el campo
        if (value === "") {
            setPromedio("");
            return;
        }
        // Solo números con hasta 5 decimales
        if (!/^\d{0,2}(\.\d{0,5})?$/.test(value)) {
            return;
        }
        const numero = Number(value);
        // No permitir valores mayores a 20
        if (numero > 20) {
            return;
        }
        setPromedio(value);
    };

    return (
        <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-6 md:p-8">
            <form onSubmit={onSubmit} className="space-y-6">
                {error && (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {/* Alerta de prematrícula existente */}
                {tienePrematriculaExistente && (
                    <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-4 py-3 rounded-lg">
                        <AlertCircle className="w-5 h-5" />
                        Ya tienes una prematrícula registrada para este período activo.
                    </div>
                )}

                {/* Período */}
                <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                        Período Académico
                        <InfoTooltip text="Solo puedes prematricularte en un período activo" />
                    </label>
                    <select
                        value={periodoSeleccionado}
                        onChange={(e) => setPeriodoSeleccionado(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-[#353943] bg-[#121723] text-white focus:outline-none focus:border-primary transition-colors"
                        required
                        disabled={isLoading || tienePrematriculaExistente}
                    >
                        <option value="">Selecciona un período</option>

                        {periodos
                            .filter((p) => p.activo)
                            .map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.label} (activo)
                                </option>
                            ))}
                    </select>
                    {periodoActivo && !periodoSeleccionado && (
                        <p className="text-xs text-primary mt-1">
                            Período activo: {periodoActivo.label}
                        </p>
                    )}
                </div>

                {/* Promedio */}
                <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                        Promedio Ponderado
                        <InfoTooltip text="El promedio determina los tipos de matrícula disponibles" />
                    </label>
                    <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        max={20}
                        step="0.00001"
                        value={promedio}
                        onChange={handlePromedioChange}
                        onKeyDown={(e) => {
                            if (["e", "E", "+", "-"].includes(e.key)) {
                                e.preventDefault();
                            }
                        }}
                        placeholder="Ej: 13.50000"
                        className="w-full px-4 py-3 rounded-lg border border-[#353943] bg-[#121723] text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
                        required
                        disabled={isLoading || tienePrematriculaExistente}
                    />
                    {promedio && (
                        <p className="text-xs text-white/40 mt-1">
                            {parseFloat(promedio) >= 16
                                ? "Puedes acceder a matrícula Excepcional"
                                : "Promedio menor a 16: Solo Regular o Especial"}
                        </p>
                    )}
                </div>

                {/* Tipo de Matrícula */}
                <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                        Tipo de Matrícula
                        <InfoTooltip text="Según tu promedio, algunos tipos pueden no estar disponibles" />
                    </label>
                    <select
                        value={tipoMatricula}
                        onChange={(e) => setTipoMatricula(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-[#353943] bg-[#121723] text-white focus:outline-none focus:border-primary transition-colors"
                        required
                        disabled={isLoading || tiposDisponibles.length === 0 || tienePrematriculaExistente}
                    >
                        <option value="">Selecciona un tipo</option>
                        {tiposDisponibles.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>
                                {tipo.nombre} ({tipo.creditos_max} créditos)
                            </option>
                        ))}
                    </select>
                    {tiposDisponibles.length === 0 && promedio && (
                        <p className="text-xs text-red-400 mt-1">
                            No hay tipos de matrícula disponibles para tu promedio
                        </p>
                    )}
                </div>

                {/* Botón */}
                <button
                    type="submit"
                    disabled={
                        isLoading ||
                        !periodoSeleccionado ||
                        !promedio ||
                        !tipoMatricula ||
                        tiposDisponibles.length === 0 ||
                        tienePrematriculaExistente
                    }
                    className={`w-full py-3 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${isLoading ||
                            !periodoSeleccionado ||
                            !promedio ||
                            !tipoMatricula ||
                            tiposDisponibles.length === 0 ||
                            tienePrematriculaExistente
                            ? "bg-gray-500/20 text-white/30 cursor-not-allowed"
                            : "bg-primary hover:bg-primary/90 text-white"
                        }`}
                >
                    {isLoading ? (
                        <>
                            <span className="animate-spin">◌</span>
                            Cargando malla...
                        </>
                    ) : tienePrematriculaExistente ? (
                        "Ya tienes una prematrícula"
                    ) : (
                        "Elegir Cursos"
                    )}
                </button>
            </form>
        </div>
    );
}