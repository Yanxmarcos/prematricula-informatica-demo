// src/components/admin/ReportCard.tsx
"use client";

import { Download, FileSpreadsheet, FileText } from "lucide-react";

interface ReportCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onExportExcel: () => void;
    onExportPDF: () => void;
    isLoading?: boolean;
}

export function ReportCard({
    title,
    description,
    icon,
    onExportExcel,
    onExportPDF,
    isLoading = false,
}: ReportCardProps) {
    return (
        <div className="bg-[#1d2430] border border-[#353943] rounded-lg p-6 hover:border-primary/30 transition-all duration-300">
            <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <p className="text-sm text-white/50 mt-1">{description}</p>
                </div>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-[#353943]">
                <button
                    onClick={onExportExcel}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-500/30 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span className="text-sm font-medium">Excel</span>
                    <span className="text-xs text-green-300">.xlsx</span>
                </button>
                <button
                    onClick={onExportPDF}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-500/30 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-medium">PDF</span>
                    <span className="text-xs text-red-300">.pdf</span>
                </button>
            </div>
            {isLoading && (
                <div className="mt-2 text-xs text-white/30 animate-pulse">
                    Generando archivo...
                </div>
            )}
        </div>
    );
}