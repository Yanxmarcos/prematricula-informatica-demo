// src/components/admin/ConfigCard.tsx
"use client";

import { useState } from "react";
import { Save, X, Check } from "lucide-react";

interface ConfigCardProps {
    title: string;
    description: string;
    configs: Array<{
        clave: string;
        valor: string;
        tipo: string;
        descripcion: string;
        options?: string[];
    }>;
    onSave: (data: any) => void;
    isLoading?: boolean;
}

export function ConfigCard({
    title,
    description,
    configs,
    onSave,
    isLoading = false,
}: ConfigCardProps) {
    const [values, setValues] = useState<Record<string, string>>(
        configs.reduce((acc, c) => ({ ...acc, [c.clave]: c.valor }), {})
    );
    const [saved, setSaved] = useState(false);

    const handleChange = (clave: string, valor: string) => {
        setValues((prev) => ({ ...prev, [clave]: valor }));
        setSaved(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = configs.map((c) => ({
            clave: c.clave,
            valor: values[c.clave] || "",
        }));
        onSave(data);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleReset = () => {
        setValues(configs.reduce((acc, c) => ({ ...acc, [c.clave]: c.valor }), {}));
    };

    return (
        <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="text-sm text-white/50 mt-1">{description}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {configs.map((config) => (
                    <div key={config.clave} className="space-y-1">
                        <label className="block text-sm font-medium text-white/70">
                            {config.descripcion}
                        </label>
                        {config.tipo === "boolean" ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={values[config.clave] === "true"}
                                    onChange={(e) =>
                                        handleChange(config.clave, String(e.target.checked))
                                    }
                                    className="w-4 h-4 rounded border-[#353943] bg-[#121723] text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-white/50">
                                    {values[config.clave] === "true" ? "Habilitado" : "Deshabilitado"}
                                </span>
                            </div>
                        ) : config.options ? (
                            <select
                                value={values[config.clave] || ""}
                                onChange={(e) => handleChange(config.clave, e.target.value)}
                                className="w-full max-w-xs px-4 py-2 rounded-lg border border-[#353943] bg-[#121723] text-white focus:outline-none focus:border-primary transition-colors"
                            >
                                {config.options.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={config.tipo === "number" ? "number" : "text"}
                                value={values[config.clave] || ""}
                                onChange={(e) => handleChange(config.clave, e.target.value)}
                                className="w-full max-w-xs px-4 py-2 rounded-lg border border-[#353943] bg-[#121723] text-white focus:outline-none focus:border-primary transition-colors"
                                min={config.tipo === "number" ? 0 : undefined}
                                step={config.tipo === "number" ? 1 : undefined}
                            />
                        )}
                        <p className="text-xs text-white/30">
                            Clave: <span className="font-mono">{config.clave}</span>
                        </p>
                    </div>
                ))}

                <div className="flex gap-3 pt-4 border-t border-[#353943]">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {isLoading ? "Guardando..." : "Guardar"}
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                        Restablecer
                    </button>
                    {saved && (
                        <span className="flex items-center gap-1 text-green-400 text-sm">
                            <Check className="w-4 h-4" />
                            Guardado
                        </span>
                    )}
                </div>
            </form>
        </div>
    );
}