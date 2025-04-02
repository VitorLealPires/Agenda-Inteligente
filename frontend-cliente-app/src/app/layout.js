import { Inter } from "next/font/google";
import LayoutClient from "@/components/layout/LayoutClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sistema de Cadastro de Clientes",
  description: "Sistema para gerenciamento de clientes jurídicos",
  generator: "v0.dev",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}

