"use client";
import { useEffect, useState } from "react";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    tipoAcao: "",
    valorHonorarios: "",
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
      setClientes(data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  }

  async function handleSubmit(e) {
  e.preventDefault();
  console.log("Enviando dados:", formData); // Adiciona esse console.log

  try {
    const res = await fetch("http://localhost:5000/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
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
      console.error("Erro ao adicionar cliente.");
      const errorData = await res.json();
      console.error("Detalhes do erro:", errorData);
    }
  } catch (error) {
    console.error("Erro ao enviar os dados:", error);
  }
}


  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1>Cadastro de Clientes</h1>

      {/* Formulário de Cadastro */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="text" placeholder="Nome" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required />
        <input type="text" placeholder="CPF" value={formData.cpf} onChange={(e) => setFormData({ ...formData, cpf: e.target.value })} required />
        <input type="text" placeholder="Telefone" value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} required />
        <input type="text" placeholder="Tipo de Ação" value={formData.tipoAcao} onChange={(e) => setFormData({ ...formData, tipoAcao: e.target.value })} required />
        <input type="text" placeholder="Valor Honorários" value={formData.valorHonorarios} onChange={(e) => setFormData({ ...formData, valorHonorarios: e.target.value })} required />
        <input type="text" placeholder="Advogado Responsável" value={formData.advogado} onChange={(e) => setFormData({ ...formData, advogado: e.target.value })} required />
        <input type="text" placeholder="Porcentagem Advogado" value={formData.porcentagemAdvogado} onChange={(e) => setFormData({ ...formData, porcentagemAdvogado: e.target.value })} required />
        <button type="submit" style={{ backgroundColor: "#0070f3", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer" }}>Cadastrar</button>
      </form>

      {/* Lista de Clientes */}
      <h2 style={{ marginTop: "20px" }}>Clientes Cadastrados</h2>
      <ul>
        {clientes.map((cliente) => (
          <li key={cliente._id}>
            <strong>Nome:</strong> {cliente.nome} | <strong>CPF:</strong> {cliente.cpf}
          </li>
        ))}
      </ul>
    </div>
  );
}

