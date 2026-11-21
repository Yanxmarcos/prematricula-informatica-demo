// src/app/page.tsx
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Restrictions from "@/components/Restrictions";
import Tipos_matricula from "@/components/Tipos_matricula";

export default function HomePage() {
	return (
		<>
			<Header />
			<Hero />
			<Tipos_matricula />
			<Restrictions />
			<Footer />
		</>
	);
}