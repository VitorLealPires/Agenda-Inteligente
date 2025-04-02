"use client";

import { useState } from "react";
import axios from "axios";

export default function ClienteForm({ onClienteAdicionado }) {
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    tipoAcao: "",
    valorHonorarios: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clientes`, form);
      onClienteAdicionado(res.data);
      setForm({ nome: "", cpf: "", telefone: "", tipoAcao: "", valorHonorarios: "" });
    } catch (error) {
      console.error("Erro ao adicionar cliente", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required />
      <input type="text" name="cpf" placeholder="CPF" value={form.cpf} onChange={handleChange} required />
      <input type="text" name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} required />
      <input type="text" name="tipoAcao" placeholder="Tipo de Ação" value={form.tipoAcao} onChange={handleChange} required />
      <input type="text" name="valorHonorarios" placeholder="Valor dos Honorários" value={form.valorHonorarios} onChange={handleChange} required />
      <button type="submit">Adicionar Cliente</button>
    </form>
  );
}