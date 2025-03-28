import "./globals.css"; // Importando direto da pasta /app

export const metadata = {
  title: "Agenda Inteligente",
  description: "Sistema de gestão de clientes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>
        <nav>
          <a href="/">Home</a>
          <a href="/clientes">Clientes</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
