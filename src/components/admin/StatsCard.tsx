// src/components/admin/StatsCard.tsx
interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    subtitle?: string;
    color?: "blue" | "green" | "yellow" | "purple" | "red" | "gray";
}

const colorClasses = {
    blue: "bg-blue-700 border-blue-900 text-blue-400",
    green: "bg-green-700 border-green-900 text-green-400",
    yellow: "bg-yellow-700 border-yellow-900 text-yellow-400",
    purple: "bg-purple-700 border-purple-900 text-purple-400",
    red: "bg-red-700 border-red-900 text-red-400",
    gray: "bg-gray-700 border-gray-900 text-gray-400",
};

export function StatsCard({ title, value, icon, subtitle, color = "blue" }: StatsCardProps) {
    return (
        <div className={`rounded-lg border p-6 ${colorClasses[color]}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-white/90">{title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-white/90 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`p-3 rounded-lg bg-white/5`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}