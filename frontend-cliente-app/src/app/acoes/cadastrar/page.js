"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import styled from "styled-components";

const AutocompleteList = styled.ul`
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  max-height: 150px;
  overflow-y: auto;
  width: 100%;
  z-index: 10;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const AutocompleteItem = styled.li`
  padding: 0.5rem;
  cursor: pointer;
  &:hover {
    background-color: #f1f1f1;
  }
`;

export default function CadastrarAcao() {
  const router = useRouter();

  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  const [formData, setFormData] = useState({
    tipoAcao: "",
    advogado: "",
    valorHonorario: "",
    porcentagemAdvogado: "",
    parcelamentoHonorario: "",
    dataFechamentoContrato: "",
    observacoes: "",
  });

  const [autocompleteVisivel, setAutocompleteVisivel] = useState(false);

  useEffect(() => {
    const buscarClientes = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clientes`);
        const data = await res.json();
        setClientes(data);
      } catch (err) {
        console.error("Erro ao buscar clientes:", err);
      }
    };
    buscarClientes();
  }, []);

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
    cliente.cpf.includes(busca)
  );

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clienteSelecionado) {
      alert("Selecione um cliente para vincular à ação.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/acoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          clienteId: clienteSelecionado._id,
        }),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar ação");

      router.push("/dashboard");
    } catch (err) {
      console.error("Erro ao enviar formulário:", err);
    }
  };

  return (
    <Card className="max-w-xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Cadastro de Ação</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label>Buscar Cliente por Nome ou CPF</label>
            <Input
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setAutocompleteVisivel(true);
              }}
              onFocus={() => setAutocompleteVisivel(true)}
              placeholder="Digite o nome ou CPF do cliente"
            />
            {autocompleteVisivel && busca && (
              <AutocompleteList>
                {clientesFiltrados.map((cliente) => (
                  <AutocompleteItem
                    key={cliente._id}
                    onClick={() => {
                      setClienteSelecionado(cliente);
                      setBusca(cliente.nome);
                      setAutocompleteVisivel(false);
                    }}
                  >
                    {cliente.nome} — {cliente.cpf}
                  </AutocompleteItem>
                ))}
              </AutocompleteList>
            )}
          </div>

          {clienteSelecionado && (
            <div className="mb-4 text-sm text-gray-600">
              Cliente Selecionado: {clienteSelecionado.nome} ({clienteSelecionado.cpf})
            </div>
          )}

          <div className="mb-4">
            <label>Tipo de Ação</label>
            <Input name="tipoAcao" value={formData.tipoAcao} onChange={handleChange} />
          </div>

          <div className="mb-4">
            <label>Advogado</label>
            <Input name="advogado" value={formData.advogado} onChange={handleChange} />
          </div>

          <div className="mb-4">
            <label>Valor dos Honorários</label>
            <Input name="valorHonorario" value={formData.valorHonorario} onChange={handleChange} />
          </div>

          <div className="mb-4">
            <label>Porcentagem do Advogado</label>
            <Input name="porcentagemAdvogado" value={formData.porcentagemAdvogado} onChange={handleChange} />
          </div>

          <div className="mb-4">
            <label>Parcelamento de Honorário</label>
            <Input name="parcelamentoHonorario" value={formData.parcelamentoHonorario} onChange={handleChange} />
          </div>

          <div className="mb-4">
            <label>Data de Fechamento do Contrato</label>
            <Input
              type="date"
              name="dataFechamentoContrato"
              value={formData.dataFechamentoContrato}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label>Observações</label>
            <textarea
              name="observacoes"
              rows={6}
              value={formData.observacoes}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Digite observações adicionais..."
            />
          </div>

          <Button type="submit">Cadastrar Ação</Button>
        </form>
      </CardContent>
    </Card>
  );
}
