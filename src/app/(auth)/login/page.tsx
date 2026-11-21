// src/app/(auth)/login/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import Image from "next/image";

function LoginContent() {
    const [codigo, setCodigo] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();

    // Validación para habilitar el botón
    const isFormValid = codigo.length === 10 && password.length >= 1;

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            router.push(session.user.rol === "estudiante" ? "/estudiante/inicio" : "/administracion/inicio");
        }
    }, [status, session, router, searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                codigo,
                password: password,
                redirect: false,
                callbackUrl: "/estudiante/inicio",
            });

            if (result?.error) {
                setError("Credenciales inválidas. Verifica tu código y contraseña.");
                setIsLoading(false);
                return;
            }

            if (result?.ok) {
                router.push(codigo === "0000000002" ? "/administracion/inicio" : "/estudiante/inicio");
            }
        } catch (error) {
            console.error("Error en login:", error);
            setError("Error al iniciar sesión. Intente nuevamente.");
            setIsLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <div className="text-xl text-[#e8edf5]">Cargando...</div>
            </div>
        );
    }

    return (
        <section className="relative z-10 overflow-hidden min-h-screen flex items-center justify-center bg-[#0a0e1a] py-16 md:py-20 lg:py-28">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="flex flex-wrap justify-center -mx-2 sm:-mx-4">
                    <div className="w-full px-2 sm:px-4">
                        <div className="shadow-three mx-auto max-w-[500px] rounded-lg bg-[#111827] px-4 sm:px-6 py-8 sm:py-10 md:p-[60px] border border-[#1e293b]">
                            {/* Logo y título */}
                            <div className="flex justify-center mb-4 sm:mb-6">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-primary/20 shadow-lg shadow-primary/20 relative">
                                    <Image
                                        src="/Informatica-Logo-Grande.jpg"
                                        alt="Logo informática UNT"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            <h3 className="mb-1 sm:mb-2 text-center text-xl sm:text-2xl md:text-3xl font-bold text-[#e8edf5]">
                                Prematrículas
                            </h3>
                            <p className="text-[#94a3b8] mb-4 sm:mb-6 text-center text-sm sm:text-base font-medium">
                                Escuela Profesional de Ingeniería Informática
                            </p>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-3 sm:mb-4 text-xs sm:text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="bg-primary/10 border-primary p-3 sm:p-4 mb-4 sm:mb-6 rounded-lg">
                                <p className="text-xs sm:text-sm text-white font-medium text-center">
                                    Demo de portafolio con datos ficticios. Elige un perfil para explorar.
                                </p>
                                <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs text-white">
                                    <button type="button" onClick={() => { setCodigo("0000000001"); setPassword("demo2026"); }} className="rounded bg-primary/30 px-3 py-2 hover:bg-primary/50">Estudiante: 0000000001</button>
                                    <button type="button" onClick={() => { setCodigo("0000000002"); setPassword("demo2026"); }} className="rounded bg-primary/30 px-3 py-2 hover:bg-primary/50">Administración: 0000000002</button>
                                </div>
                                <p className="mt-2 text-center text-xs text-white/70">Contraseña de ambos perfiles: demo2026</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4 sm:mb-6">
                                    <label
                                        htmlFor="codigo"
                                        className="text-[#e8edf5] mb-2 sm:mb-3 block text-xs sm:text-sm font-medium"
                                    >
                                        Código Institucional
                                    </label>
                                    <input
                                        type="text"
                                        id="codigo"
                                        name="codigo"
                                        inputMode="numeric"
                                        maxLength={10}
                                        pattern="[0-9]{10}"
                                        value={codigo}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                                            setCodigo(value);
                                        }}
                                        placeholder="Ingresa tu código institucional"
                                        className="w-full rounded-lg border border-[#1e293b] bg-[#0a0e1a] px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-[#e8edf5] outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        required
                                        disabled={isLoading}
                                    />
                                    {/* Indicador de caracteres */}
                                    <div className="flex justify-end mt-1">
                                        <span className={`text-xs ${codigo.length === 10 ? 'text-blue-400' : 'text-white/30'}`}>
                                            {codigo.length}/10
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-4 sm:mb-6">
                                    <label
                                        htmlFor="password"
                                        className="text-[#e8edf5] mb-2 sm:mb-3 block text-xs sm:text-sm font-medium"
                                    >
                                        Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Ingresa tu contraseña"
                                        className="w-full rounded-lg border border-[#1e293b] bg-[#0a0e1a] px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-[#e8edf5] outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="mb-4 sm:mb-6">
                                    <button
                                        type="submit"
                                        disabled={!isFormValid || isLoading}
                                        className={`w-full rounded-lg px-6 sm:px-9 py-3 sm:py-4 text-sm sm:text-base font-medium text-white transition-all duration-300 transform hover:scale-[1.02] ${
                                            isFormValid && !isLoading
                                                ? 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 cursor-pointer'
                                                : 'bg-gray-600/50 cursor-not-allowed opacity-50'
                                        }`}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span className="text-xs sm:text-sm">Iniciando sesión...</span>
                                            </span>
                                        ) : (
                                            "Iniciar Sesión"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute top-0 left-0 z-[-1]">
                <svg width="1440" height="969" viewBox="0 0 1440 969" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_95:1005" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="1440" height="969">
                        <rect width="1440" height="969" fill="#0a0e1a" />
                    </mask>
                    <g mask="url(#mask0_95:1005)">
                        <path opacity="0.1" d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z" fill="url(#paint0_linear_95:1005)" />
                        <path opacity="0.1" d="M1324.5 755.5L1450 687V886.5L1324.5 967.5L-10 288L1324.5 755.5Z" fill="url(#paint1_linear_95:1005)" />
                    </g>
                    <defs>
                        <linearGradient id="paint0_linear_95:1005" x1="1178.4" y1="151.853" x2="780.959" y2="453.581" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#2563eb" />
                            <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="paint1_linear_95:1005" x1="160.5" y1="220" x2="1099.45" y2="1192.04" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#2563eb" />
                            <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </section>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <div className="text-xl text-[#e8edf5]">Cargando...</div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
