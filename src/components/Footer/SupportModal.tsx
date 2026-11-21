"use client";

export default function SupportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-label="Acerca de esta demo">
    <div className="w-full max-w-lg rounded-lg border border-[#353943] bg-[#1d2430] p-6 text-white">
      <h2 className="text-xl font-semibold">Acerca de esta demo</h2>
      <p className="mt-4 text-white/70">Proyecto académico de prematrícula adaptado como demostración de portafolio. Todos los estudiantes y registros mostrados son ficticios. Esta página no registra matrículas reales ni representa un servicio institucional activo.</p>
      <p className="mt-3 text-white/70">Desarrollado originalmente por Yanxmarcos Chan Vásquez y Eliaser Isai Ávila Zamudio.</p>
      <button onClick={onClose} className="mt-6 rounded-lg bg-primary px-5 py-2">Cerrar</button>
    </div>
  </div>;
}
