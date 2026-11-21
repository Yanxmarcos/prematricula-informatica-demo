import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Deliberately public accounts for an isolated portfolio demonstration.
const demoUsers = [
  { id: "1", codigo: "0000000001", name: "Alex Demo", email: "alex@example.invalid", rol: "estudiante" },
  { id: "2", codigo: "0000000002", name: "Sam Demo", email: "sam@example.invalid", rol: "administrador" },
] as const;

export const authOptions: NextAuthOptions = {
  providers: [CredentialsProvider({
    name: "Demo",
    credentials: { codigo: { label: "Código de demo", type: "text" }, password: { label: "Contraseña", type: "password" } },
    async authorize(credentials) {
      const user = demoUsers.find((item) => item.codigo === credentials?.codigo);
      if (!user || credentials?.password !== "demo2026") return null;
      return { ...user, codigo_estudiante: user.codigo, necesitaCambioPassword: false };
    },
  })],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.rol = user.rol;
        token.codigo_estudiante = user.codigo_estudiante;
        token.necesitaCambioPassword = false;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.rol = token.rol as string;
      session.user.codigo_estudiante = token.codigo_estudiante as string;
      session.user.necesitaCambioPassword = false;
      return session;
    },
  },
  pages: { signIn: "/login", signOut: "/login", error: "/login" },
  session: { strategy: "jwt", maxAge: 3600 },
  secret: process.env.NEXTAUTH_SECRET,
};
