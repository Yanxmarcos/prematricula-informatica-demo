// src/components/footer/SupportModal.tsx
"use client";

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SupportModal({
    isOpen,
    onClose,
}: SupportModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-lg rounded-lg border border-[#353943] bg-[#1d2430] p-6">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">
                        Desarrollo
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white text-2xl"
                    >
                        ×
                    </button>
                </div>

                <p className="mb-6 text-sm text-white/70">
                    Proyecto académico adaptado para portafolio. Los usuarios y registros son ficticios; esta demo no es un servicio institucional activo.
                </p>

                <div className="space-y-5">

                    <div className="rounded-lg border border-[#353943] p-4">
                        <h3 className="font-semibold text-white">
                            Yanxmarcos Chan Vásquez
                        </h3>

                        <a
                            href="mailto:yanxmarcoschan@outlook.com"
                            className="mt-2 inline-block text-body-color-dark hover:text-primary"
                        >
                            yanxmarcoschan@outlook.com
                        </a>
                    </div>

                    <div className="rounded-lg border border-[#353943] p-4">
                        <h3 className="font-semibold text-white">
                            Eliaser Isai Avila Zamudio
                        </h3>

                        <a
                            href="mailto:avila.zamudio.bas@gmail.com"
                            className="mt-2 inline-block text-body-color-dark hover:text-primary"
                        >
                            avila.zamudio.bas@gmail.com
                        </a>
                    </div>

                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-primary px-5 py-2 text-white hover:opacity-90"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
