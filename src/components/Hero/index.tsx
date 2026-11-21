// src/components/Hero/index.tsx
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
	return (
		<section
			id="home"
			className="relative z-10 overflow-hidden bg-[#121723] pb-16 pt-[120px] md:pb-[80px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px]"
		>
			<div className="container">
				<div className="-mx-4 flex flex-wrap">
					<div className="w-full px-4">
						<div className="mx-auto max-w-[800px] text-center">
							<h1 className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
								Prematrículas para la Escuela Profesional de Ingeniería Informática
							</h1>
							<p className="mb-12 text-base leading-relaxed! text-body-color dark:text-body-color-dark sm:text-lg md:text-xl">
								Explora una demostración del sistema de prematrícula académica. Todos los usuarios y registros son ficticios; esta web no recibe solicitudes reales.
							</p>
							<div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
								<Link
									href="/login"
									className="rounded-xs bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
								>
									Explorar demo
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="mt-16 flex justify-center opacity-30 lg:opacity-100">
				<svg width="540" height="300" viewBox="0 0 640 300" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="100" cy="50" r="2" fill="#D8DBE3" fillOpacity="0.4" />
					<circle cx="140" cy="35" r="1.5" fill="#D8DBE3" fillOpacity="0.3" />
					<circle cx="80" cy="90" r="1" fill="#C98A4B" fillOpacity="0.55" />
					<circle cx="160" cy="75" r="1" fill="#D8DBE3" fillOpacity="0.25" />
					<circle cx="540" cy="50" r="2" fill="#D8DBE3" fillOpacity="0.4" />
					<circle cx="500" cy="35" r="1.5" fill="#D8DBE3" fillOpacity="0.3" />
					<circle cx="560" cy="90" r="1" fill="#C98A4B" fillOpacity="0.55" />
					<circle cx="480" cy="75" r="1" fill="#D8DBE3" fillOpacity="0.25" />

					<path d="M430 20L442 30L442 172L430 162Z" fill="#141A28" stroke="#D8DBE3" strokeOpacity="0.5" strokeWidth="1" />
					<rect x="210" y="20" width="220" height="150" rx="8" fill="#171D2C" stroke="#D8DBE3" strokeWidth="2" />

					<circle cx="222" cy="30" r="2" fill="#D8DBE3" fillOpacity="0.35" />
					<circle cx="232" cy="30" r="2" fill="#D8DBE3" fillOpacity="0.35" />
					<circle cx="242" cy="30" r="2" fill="#D8DBE3" fillOpacity="0.35" />

					<line x1="234" y1="34" x2="234" y2="158" stroke="#D8DBE3" strokeOpacity="0.25" strokeWidth="1" />
					<rect x="244" y="40" width="90" height="3" rx="1.5" fill="#D8DBE3" fillOpacity="0.5" />
					<rect x="258" y="56" width="60" height="3" rx="1.5" fill="#D8DBE3" fillOpacity="0.5" />
					<rect x="272" y="72" width="40" height="3" rx="1.5" fill="#C98A4B" fillOpacity="0.9" />
					<rect x="258" y="88" width="70" height="3" rx="1.5" fill="#D8DBE3" fillOpacity="0.5" />
					<rect x="244" y="104" width="50" height="3" rx="1.5" fill="#D8DBE3" fillOpacity="0.5" />
					<rect x="244" y="120" width="85" height="3" rx="1.5" fill="#D8DBE3" fillOpacity="0.5" />
					<rect x="258" y="136" width="35" height="3" rx="1.5" fill="#C98A4B" fillOpacity="0.9" />
					<rect x="296" y="134" width="2" height="8" fill="#C98A4B" fillOpacity="0.9" />

					<rect x="206" y="170" width="228" height="16" rx="4" fill="#171D2C" stroke="#D8DBE3" strokeWidth="1.5" />
					<circle cx="320" cy="178" r="8" fill="#C98A4B" fillOpacity="0.25" />
					<circle cx="320" cy="178" r="3" fill="#C98A4B" />

					<rect x="308" y="186" width="24" height="32" fill="#171D2C" stroke="#D8DBE3" strokeWidth="1.5" />
					<ellipse cx="320" cy="220" rx="48" ry="9" fill="#171D2C" stroke="#D8DBE3" strokeWidth="1.5" />

					<text x="320" y="240" textAnchor="middle" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="9" letterSpacing="1" fill="#D8DBE3" fillOpacity="0.4">
						INGENIERÍA INFORMÁTICA
					</text>

					<path d="M230 250L410 250L430 292L210 292Z" fill="#141A28" stroke="#D8DBE3" strokeOpacity="0.5" strokeWidth="1" />
					<line x1="225" y1="262" x2="415" y2="262" stroke="#D8DBE3" strokeOpacity="0.2" strokeWidth="1" />
					<line x1="222" y1="274" x2="418" y2="274" stroke="#D8DBE3" strokeOpacity="0.2" strokeWidth="1" />
					<line x1="219" y1="286" x2="421" y2="286" stroke="#D8DBE3" strokeOpacity="0.2" strokeWidth="1" />

					<rect x="432" y="260" width="18" height="28" rx="9" fill="#141A28" stroke="#D8DBE3" strokeOpacity="0.5" strokeWidth="1" />
				</svg>
			</div>
		</section>
	);
};

export default Hero;