"use client";
import { useEffect, useState } from "react";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]); // Garante que começa como array
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    tipoAcao: "",
    honorarios: { valor: "", tipo: "" },
    advogado: "",
    porcentagemAdvogado: "",
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  async function fetchClientes() {
    try {
      const res = await fetch("http://localhost:5000/clientes");
      const data = await res.json();
      
      // Garante que 'data' é um array antes de chamar setClientes
      if (Array.isArray(data)) {
        setClientes(data);
      } else {
        console.error("Erro: A API não retornou um array.", data);
        setClientes([]); // Evita erro no .map()
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      setClientes([]); // Garante que clientes não seja undefined
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("honorarios.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        honorarios: { ...prev.honorarios, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("📤 Enviando dados:", formData);
  
    try {
      const res = await fetch("http://localhost:5000/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        console.log("✅ Cliente cadastrado com sucesso!");
        setFormData({
          nome: "",
          cpf: "",
          telefone: "",
          tipoAcao: "",
          honorarios: { valor: "", tipo: "" },
          advogado: "",
          porcentagemAdvogado: "",
        });
        fetchClientes();
      } else {
        console.error("❌ Erro ao adicionar cliente.");
        const errorData = await res.json();
        console.error("🛑 Detalhes do erro:", errorData);
      }
    } catch (error) {
      console.error("⚠️ Erro ao enviar os dados:", error);
    }
  }

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1>Cadastro de Clientes</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="text" name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} required />
        <input type="text" name="cpf" placeholder="CPF" value={formData.cpf} onChange={handleChange} required />
        <input type="text" name="telefone" placeholder="Telefone" value={formData.telefone} onChange={handleChange} required />
        <input type="text" name="tipoAcao" placeholder="Tipo de Ação" value={formData.tipoAcao} onChange={handleChange} required />
        <input type="text" name="honorarios.valor" placeholder="Valor Honorários" value={formData.honorarios.valor} onChange={handleChange} required />
        <input type="text" name="honorarios.tipo" placeholder="Tipo Honorários" value={formData.honorarios.tipo} onChange={handleChange} required />
        <input type="text" name="advogado" placeholder="Advogado Responsável" value={formData.advogado} onChange={handleChange} required />
        <input type="text" name="porcentagemAdvogado" placeholder="Porcentagem Advogado" value={formData.porcentagemAdvogado} onChange={handleChange} required />

        <button type="submit" style={{ backgroundColor: "#0070f3", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Cadastrar
        </button>
      </form>

      <h2 style={{ marginTop: "20px" }}>Clientes Cadastrados</h2>
      {Array.isArray(clientes) && clientes.length > 0 ? (
        <ul>
          {clientes.map((cliente) => (
            <li key={cliente._id}>
              <strong>Nome:</strong> {cliente.nome} | <strong>CPF:</strong> {cliente.cpf}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum cliente cadastrado.</p>
      )}
    </div>
  );
}
