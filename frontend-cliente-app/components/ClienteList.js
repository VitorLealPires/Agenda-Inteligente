"use client";

import axios from "axios";

export default function ClienteList({ clientes, setClientes }) {
  const removerCliente = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/clientes/${id}`);
      setClientes(clientes.filter((cliente) => cliente._id !== id));
    } catch (error) {
      console.error("Erro ao remover cliente", error);
    }
  };

  return (
    <ul>
      {clientes.map((cliente) => (
        <li key={cliente._id}>
          {cliente.nome} - {cliente.cpf} - {cliente.telefone}
          <button onClick={() => removerCliente(cliente._id)}>Remover</button>
        </li>
      ))}
    </ul>
  );
}
