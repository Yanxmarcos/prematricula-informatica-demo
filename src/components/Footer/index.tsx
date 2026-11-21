// src/components/Footer/index.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import SupportModal from "./SupportModal";

const Footer = () => {
	const [openSupport, setOpenSupport] = useState(false);
	return (
		<footer className="relative z-10 bg-[#121723] pt-16 dark:bg-gray-dark md:pt-20 lg:pt-24 border-t border-[#353943]">
			<div className="container">
				<div className="-mx-4 flex flex-wrap">
					<div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-4/12">
						<div className="mb-12 max-w-[360px] lg:mb-16">
							<Link href="/" className="mb-8 inline-block">
								<Image
									src="/infOscuro.svg"
									alt="Logo UNT Informática"
									width={50}
									height={50}
									className="w-auto h-12"
								/>
							</Link>
							<p className="mb-9 text-base leading-relaxed text-body-color-dark">
								Sistema de Prematrícula para la Escuela Profesional de Ingeniería Informática - UNT. Versión de portafolio con datos ficticios; no registra prematrículas reales.
							</p>
							<div className="flex items-center">
								<a
									href="https://www.facebook.com/profile.php?id=61569647381199"
									target="_blank"
									aria-label="social-link"
									className="mr-6 text-body-color-dark duration-300 hover:text-primary"
								>
									<svg width="18" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M12.1 10.4939V7.42705C12.1 6.23984 13.085 5.27741 14.3 5.27741H16.5V2.05296L13.5135 1.84452C10.9664 1.66676 8.8 3.63781 8.8 6.13287V10.4939H5.5V13.7183H8.8V20.1667H12.1V13.7183H15.4L16.5 10.4939H12.1Z" fill="currentColor" />
									</svg>
								</a>
								<a
									href="https://unitru.edu.pe/webfiles//Empresa/2022/11/34_Empresa__111120220839.pdf"
									target="_blank"
									aria-label="social-link"
									className="mr-6 text-body-color-dark duration-300 hover:text-primary"
								>
									<svg width="18" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.487 15.2911C19.4042 15.2911 18.3544 15.1159 17.3694 14.7783C17.0171 14.6516 16.6137 14.7394 16.3362 15.017L14.4362 16.9126C11.4865 15.4852 8.51184 12.5111 7.08652 9.56371L8.98294 7.66256C9.26172 7.38471 9.34957 6.9819 9.22315 6.63025C8.8853 5.64491 8.71039 4.59528 8.71039 3.51239C8.71039 3.01784 8.31165 2.61911 7.81711 2.61911H4.58168C4.08714 2.61911 3.6884 3.01784 3.6884 3.51239C3.6884 13.0348 11.4826 20.8286 21.0031 20.8286C21.4976 20.8286 21.8963 20.4298 21.8963 19.9353V16.7014C21.8963 16.2069 21.4976 15.8081 21.0031 15.8081H20.487Z" fill="currentColor"></path></svg>
								</a>
								{/* <a
									href="#"
									aria-label="social-link"
									className="text-body-color-dark duration-300 hover:text-primary"
								>
									<svg width="18" height="14" viewBox="0 0 18 14" className="fill-current">
										<path d="M17.5058 2.07119C17.3068 1.2488 16.7099 0.609173 15.9423 0.395963C14.5778 7.26191e-08 9.0627 0 9.0627 0C9.0627 0 3.54766 7.26191e-08 2.18311 0.395963C1.41555 0.609173 0.818561 1.2488 0.619565 2.07119C0.25 3.56366 0.25 6.60953 0.25 6.60953C0.25 6.60953 0.25 9.68585 0.619565 11.1479C0.818561 11.9703 1.41555 12.6099 2.18311 12.8231C3.54766 13.2191 9.0627 13.2191 9.0627 13.2191C9.0627 13.2191 14.5778 13.2191 15.9423 12.8231C16.7099 12.6099 17.3068 11.9703 17.5058 11.1479C17.8754 9.68585 17.8754 6.60953 17.8754 6.60953C17.8754 6.60953 17.8754 3.56366 17.5058 2.07119ZM7.30016 9.44218V3.77687L11.8771 6.60953L7.30016 9.44218Z" />
									</svg>
								</a> */}
							</div>
						</div>
					</div>

					<div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
						<div className="mb-12 lg:mb-16">
							<h2 className="mb-10 text-xl font-bold text-white">Enlaces</h2>
							<ul>
								<li>
									<Link href="/login" className="mb-4 inline-block text-base text-body-color-dark duration-300 hover:text-primary">
										Iniciar Sesión
									</Link>
								</li>
								<li>
									<Link href="/" className="mb-4 inline-block text-base text-body-color-dark duration-300 hover:text-primary">
										Inicio
									</Link>
								</li>
								<li>
									<Link href="https://inf.unitru.edu.pe/" target="_blank" className="mb-4 inline-block text-base text-body-color-dark duration-300 hover:text-primary">
										Escuela
									</Link>
								</li>
								<li>
									<Link href="https://drive.google.com/drive/folders/1mxQvxE5MovzHWmt9LKHok83aG3SsupG5?usp=sharing" target="_blank" className="mb-4 inline-block text-base text-body-color-dark duration-300 hover:text-primary">
										Tutorial de Prematrícula
									</Link>
								</li>
								<li>
									<button
										onClick={() => setOpenSupport(true)}
										className="mb-4 inline-block text-base text-body-color-dark duration-300 hover:text-primary"
									>
										Desarrollo
									</button>
								</li>
							</ul>
						</div>
					</div>

					<div className="w-full px-4 md:w-1/2 lg:w-3/12 xl:w-3/12">
						<div className="mb-12 lg:mb-16">
							<h2 className="mb-10 text-xl font-bold text-white">Contacto</h2>
							<ul>
								<li>
									<a
										href="mailto:informatica@unitru.edu.pe"
										className="mb-4 inline-block text-base text-body-color-dark duration-300 hover:text-primary"
									>
										informatica@unitru.edu.pe
									</a>
								</li>
								<li>
									<a
										href="mailto:mesadepartesfcfym@unitru.edu.pe"
										className="mb-4 inline-block text-base text-body-color-dark duration-300 hover:text-primary"
									>
										mesadepartesfcfym@unitru.edu.pe
									</a>
								</li>
							</ul>
						</div>
					</div>

					<div className="w-full px-4 md:w-1/2 lg:w-3/12 xl:w-3/12">
						<div className="mb-12 lg:mb-16">
							<h2 className="mb-10 text-xl font-bold text-white">Documentos</h2>
							<ul>
								<li>
									<Link href="https://drive.google.com/file/d/1Aasz5wfCK_X1PfbDB1_jbDO71ruv_wVZ/view?usp=sharing" target="_blank" className="mb-4 inline-block text-base text-body-color-dark duration-300 hover:text-primary">
										Currículo del programa de estudios
									</Link>
								</li>
								<li>
									<Link href="https://uraa.unitru.edu.pe/storage/normativas/normatividad_academica%202013.pdf" target="_blank" className="mb-4 inline-block text-base text-body-color-dark duration-300 hover:text-primary">
										Normativa académica
									</Link>
								</li>
							</ul>
						</div>
					</div>

				</div>

				<div className="h-px w-full bg-gradient-to-r from-transparent via-[#353943] to-transparent"></div>
				<div className="py-8">
					<p className="text-center text-base text-body-color-dark">
						© {new Date().getFullYear()} Demo de portafolio del sistema de prematrícula de Informática - UNT
					</p>
				</div>
			</div>
			<SupportModal
				isOpen={openSupport}
				onClose={() => setOpenSupport(false)}
			/>
		</footer>
	);
};

export default Footer;
