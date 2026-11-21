// src/app/layout.tsx
import type { Metadata } from "next";
// @ts-ignore: Allow side-effect import of global CSS without type declarations
import "./global.css";
import { Providers } from "./providers";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
	title: "Demo de Prematrícula | Portafolio",
	description: "Demostración académica de prematrícula con datos ficticios; no es un sistema institucional activo.",
	icons: {
		icon: [
			{ url: '/favicon.svg', type: 'image/svg+xml' },
			{ url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
			{ url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
			{ url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
		],
		apple: '/apple-touch-icon.png',
		shortcut: '/favicon.ico',
	},
	manifest: '/site.webmanifest',
	appleWebApp: {
		capable: true,
		statusBarStyle: 'black-translucent',
		title: 'Demo de Prematrícula',
	},
	openGraph: {
		title: 'Demo de Prematrícula',
		description: 'Demostración académica con datos ficticios',
		url: siteUrl,
		siteName: 'Demo de Prematrícula',
		images: [
			{
				url: `${siteUrl}/og-image.webp`,
				width: 1200,
				height: 630,
				alt: 'Prematricula Informática',
				type: 'image/webp',
			},
		],
		type: 'website',
		locale: 'es_PE',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Demo de Prematrícula',
		description: 'Demostración académica con datos ficticios',
		images: [`${siteUrl}/og-image.webp`],
	},
	metadataBase: new URL(siteUrl),
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="es" className="dark" suppressHydrationWarning>
			<body className="bg-[#121723] text-white font-inter antialiased">
				<Providers>
					{children}
				</Providers>
			</body>
		</html>
	);
}
