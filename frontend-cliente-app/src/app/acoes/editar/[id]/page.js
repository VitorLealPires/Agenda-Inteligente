"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styled from "styled-components";

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  font-size: 1rem;
  min-height: 100px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: vertical;
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #2563eb;
  }
`;

export default function EditarAcao() {
  const [acao, setAcao] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  const fetchAcao = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/acoes/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao buscar ação");

      const data = await res.json();
      setAcao(data);
    } catch (err) {
      console.error("Erro ao buscar ação:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcao();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAcao((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/acoes/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tipoAcao: acao.tipoAcao,
          advogado: acao.advogado,
          porcentagemAdvogado: acao.porcentagemAdvogado,
          observacoes: acao.observacoes,
          honorarios: {
            valor: acao.honorarios?.valor || 0,
            parcelamento: acao.honorarios?.parcelamento || "",
          },
          dataFechamentoContrato: acao.dataFechamentoContrato,
        }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar ação");

      alert("Ação atualizada com sucesso!");
      router.push("/acoes");
    } catch (err) {
      console.error("Erro ao atualizar ação:", err);
      alert("Erro ao atualizar ação. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <Container>
        <p>Carregando ação...</p>
      </Container>
    );
  }

  if (!acao) {
    return (
      <Container>
        <p>Ação não encontrada.</p>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Editar Ação</Title>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label>Tipo de Ação</Label>
          <Input
            name="tipoAcao"
            value={acao.tipoAcao || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Advogado</Label>
          <Input
            name="advogado"
            value={acao.advogado || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Porcentagem do Advogado (%)</Label>
          <Input
            type="number"
            name="porcentagemAdvogado"
            value={acao.porcentagemAdvogado || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Valor dos Honorários (R$)</Label>
          <Input
            type="number"
            step="0.01"
            name="valor"
            value={acao.honorarios?.valor || ""}
            onChange={(e) =>
              setAcao((prev) => ({
                ...prev,
                honorarios: { ...prev.honorarios, valor: e.target.value },
              }))
            }
            required
          />
        </div>

        <div>
          <Label>Parcelamento</Label>
          <Input
            name="parcelamento"
            value={acao.honorarios?.parcelamento || ""}
            onChange={(e) =>
              setAcao((prev) => ({
                ...prev,
                honorarios: { ...prev.honorarios, parcelamento: e.target.value },
              }))
            }
          />
        </div>

        <div>
          <Label>Data de Fechamento do Contrato</Label>
          <Input
            type="date"
            name="dataFechamentoContrato"
            value={acao.dataFechamentoContrato ? new Date(acao.dataFechamentoContrato).toISOString().split("T")[0] : ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Observações</Label>
          <TextArea
            name="observacoes"
            value={acao.observacoes || ""}
            onChange={handleChange}
          />
        </div>

        <Button type="submit">Salvar Alterações</Button>
      </Form>
    </Container>
  );
}
