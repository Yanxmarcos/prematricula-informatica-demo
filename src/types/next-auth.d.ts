// src/types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            rol: string;
            codigo_estudiante: string;
            necesitaCambioPassword: boolean;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        rol: string;
        codigo_estudiante: string;
        necesitaCambioPassword: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        rol: string;
        codigo_estudiante: string;
        necesitaCambioPassword: boolean;
    }
}