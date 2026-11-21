// src/components/usuarios/UsuariosList.tsx
"use client";

import { useState } from "react";
import { Pencil, Trash2, Key, RefreshCw, Search, Plus, Filter, X } from "lucide-react";
import { formatDateTimePeru } from "@/lib/utils/date";

interface Usuario {
    id: number;
    codigo_estudiante: string;
    correo_inst: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string | null;
    activo: boolean;
    creado_en: string;
    ultimo_acesso: string | null;
    rol: string;
}

interface UsuariosListProps {
    usuarios: Usuario[];
    loading: boolean;
    onEdit: (usuario: Usuario) => void;
    onDelete: (id: number) => void;
    onResetPassword: (id: number) => void;
    onRefresh: () => void;
    onFilter: (filters: any) => void;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canResetPassword: boolean;
    userRol: string;
    onCrear: () => void;
    filters: {
        search?: string;
        rol?: string;
        activo?: boolean;
    };
}

export function UsuariosList({
    usuarios,
    loading,
    onEdit,
    onDelete,
    onResetPassword,
    onRefresh,
    onFilter,
    canCreate,
    canEdit,
    canDelete,
    canResetPassword,
    userRol,
    onCrear,
    filters,
}: UsuariosListProps) {
    const [search, setSearch] = useState(filters.search || "");
    const [rolFilter, setRolFilter] = useState(filters.rol || "");
    const [activoFilter, setActivoFilter] = useState(
        filters.activo !== undefined ? String(filters.activo) : ""
    );
    const [showFilters, setShowFilters] = useState(false);

    const getRolLabel = (rol: string) => {
        const labels: Record<string, string> = {
            estudiante: "Estudiante",
            secretaria: "Secretaria",
            director: "Director",
            administrador: "Administrador",
        };
        return labels[rol] || rol;
    };

    const getRolColor = (rol: string) => {
        const colors: Record<string, string> = {
            estudiante: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
            secretaria: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
            director: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
            administrador: "bg-red-500/20 text-red-400 border border-red-500/30",
        };
        return colors[rol] || "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    };

    const getNombreCompleto = (usuario: Usuario) => {
        const partes = [
            usuario.nombres || "",
            usuario.apellido_paterno || "",
            usuario.apellido_materno || "",
        ];
        return partes.filter(Boolean).join(" ") || "Sin nombre";
    };

    const handleFilter = () => {
        onFilter({
            search: search || undefined,
            rol: rolFilter || undefined,
            activo: activoFilter !== "" ? activoFilter === "true" : undefined,
        });
    };

    const handleReset = () => {
        setSearch("");
        setRolFilter("");
        setActivoFilter("");
        onFilter({});
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleFilter();
        }
    };

    // Contar filtros activos
    const activeFiltersCount = [
        filters.search,
        filters.rol,
        filters.activo !== undefined,
    ].filter(Boolean).length;

    // Opciones de roles según el rol del usuario
    const getRolOptions = () => {
        if (userRol === "administrador") {
            return [
                { value: "", label: "Todos los roles" },
                { value: "estudiante", label: "Estudiante" },
                { value: "secretaria", label: "Secretaria" },
                { value: "director", label: "Director" },
                { value: "administrador", label: "Administrador" },
            ];
        }
        return [
            { value: "", label: "Todos los roles" },
            { value: "estudiante", label: "Estudiante" },
        ];
    };

    const rolOptions = getRolOptions();

    // Total de registros
    const totalRegistros = usuarios.length;
    const activos = usuarios.filter((u) => u.activo).length;
    const inactivos = usuarios.filter((u) => !u.activo).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white/70">Cargando usuarios...</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Barra de búsqueda y acciones - Mobile First */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Buscar por nombre, código o correo..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#353943] bg-[#121723] text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors text-sm"
                    />
                </div>

                <div className="flex items-center gap-2">
                    {/* Botón de filtros (mobile) */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-2.5 rounded-lg border transition-colors sm:hidden ${
                            activeFiltersCount > 0
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-[#353943] text-white/50 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        <Filter className="w-5 h-5" />
                        {activeFiltersCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] font-bold bg-primary rounded-full flex items-center justify-center text-white">
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>

                    {/* Filtros desktop */}
                    <div className="hidden sm:flex items-center gap-2">
                        <select
                            value={rolFilter}
                            onChange={(e) => setRolFilter(e.target.value)}
                            className="px-4 py-2.5 rounded-lg border border-[#353943] bg-[#121723] text-white focus:outline-none focus:border-primary transition-colors text-sm min-w-[140px]"
                        >
                            {rolOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={activoFilter}
                            onChange={(e) => setActivoFilter(e.target.value)}
                            className="px-4 py-2.5 rounded-lg border border-[#353943] bg-[#121723] text-white focus:outline-none focus:border-primary transition-colors text-sm min-w-[120px]"
                        >
                            <option value="">Todos</option>
                            <option value="true">Activos</option>
                            <option value="false">Inactivos</option>
                        </select>

                        <button
                            onClick={handleFilter}
                            className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                            Filtrar
                        </button>

                        {activeFiltersCount > 0 && (
                            <button
                                onClick={handleReset}
                                className="p-2.5 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                title="Limpiar filtros"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={onRefresh}
                        className="p-2.5 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        title="Actualizar"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>

                    {canCreate && (
                        <button
                            onClick={onCrear}
                            className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Nuevo</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Filtros expandibles (mobile) */}
            {showFilters && (
                <div className="sm:hidden bg-[#1d2430] border border-[#353943] rounded-lg p-4 space-y-3">
                    <div>
                        <label className="text-xs text-white/50 mb-1 block">Rol</label>
                        <select
                            value={rolFilter}
                            onChange={(e) => setRolFilter(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-[#353943] bg-[#121723] text-white focus:outline-none focus:border-primary transition-colors text-sm"
                        >
                            {rolOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-white/50 mb-1 block">Estado</label>
                        <select
                            value={activoFilter}
                            onChange={(e) => setActivoFilter(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-[#353943] bg-[#121723] text-white focus:outline-none focus:border-primary transition-colors text-sm"
                        >
                            <option value="">Todos</option>
                            <option value="true">Activos</option>
                            <option value="false">Inactivos</option>
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleFilter}
                            className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                            Filtrar
                        </button>
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={handleReset}
                                className="flex-1 px-4 py-2.5 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm"
                            >
                                Limpiar
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Contador de registros y estadísticas */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-[#1d2430] border border-[#353943] rounded-lg px-4 py-3">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-white/50">Total:</span>
                        <span className="text-sm font-bold text-white">{totalRegistros}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                        <span className="text-sm text-white/50">Activos:</span>
                        <span className="text-sm font-medium text-green-400">{activos}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                        <span className="text-sm text-white/50">Inactivos:</span>
                        <span className="text-sm font-medium text-gray-400">{inactivos}</span>
                    </div>
                    {activeFiltersCount > 0 && (
                        <div className="flex items-center gap-2 px-2 py-1 bg-primary/10 border border-primary/20 rounded-full">
                            <Filter className="w-3 h-3 text-primary" />
                            <span className="text-xs text-primary font-medium">
                                {activeFiltersCount} filtro{activeFiltersCount > 1 ? "s" : ""} activo
                                {activeFiltersCount > 1 ? "s" : ""}
                            </span>
                        </div>
                    )}
                </div>
                <div className="text-xs text-white/30">
                    Mostrando {totalRegistros} registro{totalRegistros !== 1 ? "s" : ""}
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-[#1d2430] border border-[#353943] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#121723] border-b border-[#353943]">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                                    Código
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider hidden sm:table-cell">
                                    Nombre
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider hidden md:table-cell">
                                    Correo
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                                    Rol
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-white/50 uppercase tracking-wider hidden sm:table-cell">
                                    Estado
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider hidden lg:table-cell">
                                    Último Acceso
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-white/50 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#353943]">
                            {usuarios.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-white/40">
                                        {activeFiltersCount > 0
                                            ? "No hay usuarios que coincidan con los filtros aplicados"
                                            : "No hay usuarios registrados"}
                                    </td>
                                </tr>
                            ) : (
                                usuarios.map((usuario) => (
                                    <tr key={usuario.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-mono text-white/70">
                                                {usuario.codigo_estudiante || "N/A"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 hidden sm:table-cell">
                                            <span className="text-sm text-white truncate max-w-[300px] block">
                                                {getNombreCompleto(usuario)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <span className="text-sm text-white/50 truncate max-w-[100px] block">
                                                {usuario.correo_inst}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRolColor(
                                                    usuario.rol
                                                )} whitespace-nowrap`}
                                            >
                                                {getRolLabel(usuario.rol)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center hidden sm:table-cell">
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    usuario.activo
                                                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                                        : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                                                }`}
                                            >
                                                {usuario.activo ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <span className="text-sm text-white/30">
                                                {usuario.ultimo_acesso
                                                    ? formatDateTimePeru(usuario.ultimo_acesso)
                                                    : "Nunca"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1 sm:gap-2">
                                                {canEdit && (
                                                    <button
                                                        onClick={() => onEdit(usuario)}
                                                        className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {canResetPassword && (
                                                    <button
                                                        onClick={() => onResetPassword(usuario.id)}
                                                        className="p-1.5 rounded-lg text-yellow-400/40 hover:text-yellow-400 hover:bg-yellow-500/10 transition-colors"
                                                        title="Resetear contraseña"
                                                    >
                                                        <Key className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {canDelete && (
                                                    <button
                                                        onClick={() => onDelete(usuario.id)}
                                                        className="p-1.5 rounded-lg text-red-400/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                        title="Desactivar"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pie de tabla con más estadísticas */}
                {usuarios.length > 0 && (
                    <div className="px-4 py-3 border-t border-[#353943] bg-[#121723] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="text-xs text-white/30">
                            Mostrando <span className="text-white/50">{usuarios.length}</span> de{" "}
                            <span className="text-white/50">{totalRegistros}</span> registros
                        </div>
                        <div className="flex items-center gap-4 text-xs text-white/30">
                            <span>{totalRegistros} usuarios</span> |
                            <span>{activos} activos</span> |
                            <span>{inactivos} inactivos</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}