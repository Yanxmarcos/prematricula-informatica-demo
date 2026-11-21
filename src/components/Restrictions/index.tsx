// src/components/Restrictions/index.tsx
"use client";

import { AlertCircle, Shield, User, BookOpen, Calendar, CheckCircle, XCircle, Info } from "lucide-react";

interface RestrictionItem {
    icon: React.ReactNode;
    title: string;
    description: string;
    type: "info" | "warning" | "success" | "error";
}

const restrictionsData: RestrictionItem[] = [
    { icon: <User className="w-6 h-6" />, title: "Acceso de prueba", description: "Selecciona el perfil de estudiante o administración en el inicio de sesión. Ambos utilizan identidades ficticias.", type: "info" },
    { icon: <Shield className="w-6 h-6" />, title: "Datos de demostración", description: "Los cambios de la demo se guardan en una cookie de este navegador y pueden restablecerse desde el panel.", type: "warning" },
    { icon: <Calendar className="w-6 h-6" />, title: "Selección académica", description: "Explora una malla curricular de ejemplo y simula la selección de cursos según el semestre.", type: "info" },
    { icon: <AlertCircle className="w-6 h-6" />, title: "Proyecto de portafolio", description: "Esta demostración no gestiona prematrículas reales ni representa un servicio institucional activo.", type: "info" },
];

export default function Restrictions() {
    const getTypeStyles = (type: RestrictionItem["type"]) => {
        const styles = {
            info: {
                border: "border-blue-500/20",
                bg: "bg-blue-500/5",
                iconBg: "bg-blue-500/10",
                iconColor: "text-blue-400",
            },
            warning: {
                border: "border-yellow-500/20",
                bg: "bg-yellow-500/5",
                iconBg: "bg-yellow-500/10",
                iconColor: "text-yellow-400",
            },
            success: {
                border: "border-green-500/20",
                bg: "bg-green-500/5",
                iconBg: "bg-green-500/10",
                iconColor: "text-green-400",
            },
            error: {
                border: "border-red-500/20",
                bg: "bg-red-500/5",
                iconBg: "bg-red-500/10",
                iconColor: "text-red-400",
            },
        };
        return styles[type];
    };

    return (
        <section id="importante" className="relative z-10 mb-10 py-16 md:py-20 lg:py-28 bg-[#121723]">
            <div className="container">
                {/* Encabezado */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Acerca del Sistema
                    </h2>
                    <p className="text-lg text-white/50 max-w-3xl mx-auto">
                        Restricciones y consideraciones del sistema de prematrícula antes de iniciar tu proceso.
                    </p>
                </div>

                {/* Grid de Restricciones */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restrictionsData.map((item, index) => {
                        const styles = getTypeStyles(item.type);
                        return (
                            <div
                                key={index}
                                className={`group relative p-6 rounded-xl border ${styles.border} ${styles.bg} hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/5`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${styles.iconBg} flex-shrink-0`}>
                                        <div className={`${styles.iconColor}`}>
                                            {item.icon}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-white/60 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Contacto de emergencia */}
                <div className="mt-12 p-6 bg-[#1d2430] border border-[#353943] rounded-xl text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <span className="text-white font-semibold">¿Problemas con tu acceso?</span>
                    </div>
                    <p className="text-sm text-white/50">
                        Comunícate con la Secretaría o Director de Escuela,{' '}
                        <span className="text-white font-medium">Dr. Edwin Raúl Mendoza Torres</span>, para resolver cualquier inconveniente.
                    </p>
                </div>
            </div>
        </section>
    );
}