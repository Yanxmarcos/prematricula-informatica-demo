"use client";
import Link from "next/link";
import { useState } from "react";
import SupportModal from "./SupportModal";

export default function Footer() {
  const [openSupport, setOpenSupport] = useState(false);
  return <footer className="relative z-10 border-t border-[#353943] bg-[#121723] px-4 py-10 text-white/60">
    <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
      <p>Demo de prematrícula académica · Proyecto de portafolio · Datos ficticios</p>
      <div className="flex gap-5"><Link href="/login" className="hover:text-white">Explorar demo</Link><button onClick={() => setOpenSupport(true)} className="hover:text-white">Créditos y alcance</button></div>
    </div>
    <SupportModal isOpen={openSupport} onClose={() => setOpenSupport(false)} />
  </footer>;
}
