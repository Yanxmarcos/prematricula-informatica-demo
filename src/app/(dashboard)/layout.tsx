// src/app/(dashboard)/layout.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { trackSession } from "@/lib/utils/session-track";

interface SidebarItem {
    id: string;
    label: string;
    path: string;
    icon: React.ReactNode;
    roles: string[];
}

const sidebarItems: SidebarItem[] = [
    // ADMINISTRACIÓN
    {
        id: "admin-inicio",
        label: "Inicio",
        path: "/administracion/inicio",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1m-2 0h2" />
            </svg>
        ),
        roles: ["secretaria", "director", "administrador"],
    },
    {
        id: "admin-periodos",
        label: "Períodos Académicos",
        path: "/administracion/periodos",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        roles: ["secretaria", "director", "administrador"],
    },
    {
        id: "admin-prematriculas",
        label: "Prematrículas",
        path: "/administracion/prematriculas",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        roles: ["secretaria", "director", "administrador"],
    },
    {
        id: "admin-oferta",
        label: "Oferta Académica",
        path: "/administracion/oferta-academica",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        roles: ["secretaria", "director", "administrador"],
    },
    {
        id: "admin-reportes",
        label: "Reportes",
        path: "/administracion/reportes",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2zm0 0v-2a2 2 0 012-2h8a2 2 0 012 2v2m-6 4h6v2h-6v-2zm-4 0h2v2H8v-2z" />
            </svg>
        ),
        roles: ["secretaria", "director", "administrador"],
    },
    {
        id: "admin-configuracion",
        label: "Configuración",
        path: "/administracion/configuracion",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        roles: ["secretaria", "director", "administrador"],
    },
    {
        id: "admin-usuarios",
        label: "Gestión de Usuarios",
        path: "/administracion/usuarios",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        roles: ["secretaria", "director", "administrador"],
    },
    {
        id: "admin-sesiones",
        label: "Sesiones Activas",
        path: "/administracion/sesiones",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        ),
        roles: ["administrador"],
    },
    {
        id: "admin-perfil",
        label: "Mi Perfil",
        path: "/administracion/perfil",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
        roles: ["secretaria", "director", "administrador"],
    },

    // ESTUDIANTES
    {
        id: "est-inicio",
        label: "Inicio",
        path: "/estudiante/inicio",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1m-2 0h2" />
            </svg>
        ),
        roles: ["estudiante"],
    },
    {
        id: "est-prematricula",
        label: "Prematrícula",
        path: "/estudiante/prematricula",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        roles: ["estudiante"],
    },
    {
        id: "est-historial",
        label: "Historial",
        path: "/estudiante/historial",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2zm0 0v-2a2 2 0 012-2h8a2 2 0 012 2v2m-6 4h6v2h-6v-2zm-4 0h2v2H8v-2z" />
            </svg>
        ),
        roles: ["estudiante"],
    },
    {
        id: "est-perfil",
        label: "Mi Perfil",
        path: "/estudiante/perfil",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
        roles: ["estudiante"],
    },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname(); 

    const [sidebarOpen, setSidebarOpen] = useState(() =>
        typeof window !== "undefined" ? window.innerWidth >= 768 : true
    );
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== "undefined" ? window.innerWidth < 768 : false
    );

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            trackSession();
        }
    }, [status, session]);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setSidebarOpen(!mobile);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        document.body.style.overflow = isMobile && sidebarOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobile, sidebarOpen]);

    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileMenuRef.current &&
                !profileMenuRef.current.contains(event.target as Node)
            ) {
                setProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#121723]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <div className="text-xl text-white">Cargando...</div>
            </div>
        );
    }

    if (!session) return null;

    const userRole = session.user?.rol || "estudiante";

    // Función para determinar si un item está activo
    const isItemActive = (itemPath: string) => {
        // Para "Inicio" - coincidencia exacta
        if (itemPath === "/administracion/inicio" || itemPath === "/estudiante/inicio") {
            return pathname === itemPath;
        }
        // Para las demás rutas - coincidencia parcial (startsWith)
        return pathname.startsWith(itemPath);
    };

    const filteredItems = sidebarItems.filter((item) => item.roles.includes(userRole));

    return (
        <div className="min-h-screen bg-[#121723] text-white">
            <aside
                className={`fixed inset-y-0 left-0 z-50 h-screen w-64 bg-[#1d2430] border-r border-[#353943] transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0`}
            >
                <div className="flex items-center justify-between h-16 px-4 border-b border-[#353943]">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/web-app-manifest-512x512.png"
                            alt="Logo"
                            width={32}
                            height={32}
                            className="h-8 w-8"
                        />
                        <span className="text-lg font-bold text-white">
                            Prematrícula
                        </span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden text-white/70 hover:text-white"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {filteredItems.map((item) => {
                        const isActive = isItemActive(item.path);
                        return (
                            <Link
                                key={item.id}
                                href={item.path}
                                onClick={() => isMobile && setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                                    isActive
                                        ? "bg-primary text-white"
                                        : "text-white/70 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <span className={isActive ? "text-white" : "text-primary/60 group-hover:text-primary/80"}>
                                    {item.icon}
                                </span>
                                <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#353943]">
                    <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {session.user?.name || "Usuario"}
                            </p>
                            <p className="text-xs text-white/50 capitalize">{userRole}</p>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="text-white/50 hover:text-red-400 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </aside>

            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex flex-col min-h-screen md:ml-64">
                <header className="sticky top-0 z-30 bg-[#1d2430] border-b border-[#353943] px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="md:hidden text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-lg font-semibold text-white">Panel de Control <span className="text-xs text-primary">DEMO</span></h1>
                    </div>

                    <div className="flex items-center gap-3 relative" ref={profileMenuRef}>
                        <button
                            onClick={() => setProfileMenuOpen((prev) => !prev)}
                            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:ring-2 hover:ring-primary/40 transition-all"
                        >
                            <span className="text-sm font-bold text-white">
                                {session.user?.name?.charAt(0) || "U"}
                            </span>
                        </button>

                        {profileMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-[#1d2430] border border-[#353943] rounded-lg shadow-lg py-2 z-50">
                                <div className="px-4 py-2 border-b border-[#353943]">
                                    <p className="text-sm font-medium text-white truncate">
                                        {session.user?.name || "Usuario"}
                                    </p>
                                    <p className="text-xs text-white/50 capitalize">{userRole}</p>
                                </div>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-red-400 hover:bg-white/5 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-primary/20 bg-primary/10 px-4 py-2 text-xs text-white/80">
                    <span>Datos ficticios de portafolio. No se realizan matrículas institucionales.{userRole === "administrador" ? " La gestión de usuarios y períodos es solo de lectura." : ""}</span>
                    <button className="underline hover:text-white" onClick={async () => {
                        await fetch("/api/auth/session-track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reset: true }) });
                        window.location.reload();
                    }}>Restablecer demo</button>
                </div>
                <main className="flex-1 p-4 md:p-6">{children}</main>
            </div>
        </div>
    );
}
