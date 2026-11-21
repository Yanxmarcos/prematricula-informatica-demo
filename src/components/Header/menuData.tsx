// src/components/Header/menuData.tsx
import { Menu } from "@/types/menu";

const menuData: Menu[] = [
	{
		id: 1,
		title: "Inicio",
		path: "/",
		newTab: false,
	},
	{
		id: 2,
		title: "Escuela",
		path: "https://inf.unitru.edu.pe/",
		newTab: true,
	},
	{
		id: 3,
		title: "Tipos de Matricula",
		path: "/#tipos_matricula",
		newTab: false,
	},
	{
		id: 3,
		title: "Acerca de",
		path: "/#importante",
		newTab: false,
	},
];

export default menuData;