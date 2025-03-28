export default function Home() {
  return (
    <main style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Bem-vindo à Agenda Inteligente</h1>
      <p>Gerencie seus clientes de forma prática e eficiente.</p>

      <nav style={{ marginTop: "20px" }}>
        <a
          href="/clientes"
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
          }}
        >
          Ver Lista de Clientes
        </a>
      </nav>
    </main>
  );
}
