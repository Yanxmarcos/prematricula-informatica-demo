// src/components/admin/DashboardCharts.tsx
"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

interface ChartData {
    por_ciclo: Array<{ ciclo: number; total: number }>;
    por_tipo_matricula: Array<{ tipo: string; total: number }>;
    top_cursos: Array<{ codigo: number; nombre: string; total: number }>;
    bottom_cursos: Array<{ codigo: number; nombre: string; total: number }>;
}

const COLORS = ["#4A6CF7", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#06B6D4", "#EC4899"];

export function DashboardCharts({ data }: { data: ChartData }) {
    const cicloData = data.por_ciclo.map((item) => ({
        name: `Ciclo ${item.ciclo}`,
        value: item.total,
    }));

    const tipoData = data.por_tipo_matricula.map((item) => ({
        name: item.tipo,
        value: item.total,
    }));

    const topCursosData = data.top_cursos.map((item) => ({
        name: item.nombre.length > 20 ? item.nombre.substring(0, 20) + "..." : item.nombre,
        value: item.total,
    }));

    const bottomCursosData = data.bottom_cursos.map((item) => ({
        name: item.nombre.length > 20 ? item.nombre.substring(0, 20) + "..." : item.nombre,
        value: item.total,
    }));

    const hasCicloData = cicloData.length > 0;
    const hasTipoData = tipoData.length > 0;
    const hasTopCursosData = topCursosData.length > 0;
    const hasBottomCursosData = bottomCursosData.length > 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribución por Ciclo */}
            {hasCicloData && (
                <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-4">
                    <h3 className="text-sm font-medium text-white/70 mb-4">
                        Distribución por Ciclo
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={cicloData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#353943" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                            <YAxis stroke="#94a3b8" fontSize={11} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1d2430",
                                    borderColor: "#353943",
                                    color: "#e8edf5",
                                }}
                                labelStyle={{ color: "#e8edf5" }}
                                itemStyle={{ color: "#e8edf5" }}
                            />
                            <Bar dataKey="value" fill="#4A6CF7" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Distribución por Tipo de Matrícula */}
            {hasTipoData && (
                <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-4">
                    <h3 className="text-sm font-medium text-white/70 mb-4">
                        Distribución por Tipo de Matrícula
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={tipoData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="value"
                                label={({ name, percent }) =>
                                    `${name}: ${(percent * 100).toFixed(0)}%`
                                }
                                labelLine={true}
                            >
                                {tipoData.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1d2430",
                                    borderColor: "#353943",
                                    color: "#e8edf5",
                                }}
                                labelStyle={{ color: "#e8edf5" }}
                                itemStyle={{ color: "#e8edf5" }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Top 10 Cursos */}
            {hasTopCursosData && (
                <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-4">
                    <h3 className="text-sm font-medium text-green-400 mb-4">
                        Top 10 Cursos más Solicitados
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={topCursosData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#353943" />
                            <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                            <YAxis
                                type="category"
                                dataKey="name"
                                stroke="#94a3b8"
                                fontSize={10}
                                width={80}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1d2430",
                                    borderColor: "#353943",
                                    color: "#e8edf5",
                                }}
                                labelStyle={{ color: "#e8edf5" }}
                                itemStyle={{ color: "#e8edf5" }}
                            />
                            <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Bottom 10 Cursos */}
            {hasBottomCursosData && (
                <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-4">
                    <h3 className="text-sm font-medium text-red-400 mb-4">
                        Top 10 Cursos menos Solicitados
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={bottomCursosData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#353943" />
                            <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                            <YAxis
                                type="category"
                                dataKey="name"
                                stroke="#94a3b8"
                                fontSize={10}
                                width={80}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1d2430",
                                    borderColor: "#353943",
                                    color: "#e8edf5",
                                }}
                                labelStyle={{ color: "#e8edf5" }}
                                itemStyle={{ color: "#e8edf5" }}
                            />
                            <Bar dataKey="value" fill="#EF4444" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}