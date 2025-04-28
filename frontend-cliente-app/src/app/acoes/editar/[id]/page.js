"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: vertical;
`;

const Button = styled.button`
  padding: 0.7rem;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #059669;
  }
`;

export default function EditarAcao({ params }) {
  const { id } = params;
  const [acao, setAcao] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAcao = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/acoes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar ação");

        const data = await res.json();
        setAcao(data);
      } catch (error) {
        console.error("Erro ao buscar ação:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAcao();
  }, [id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/acoes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(acao),
      });

      if (!res.ok) throw new Error("Erro ao atualizar ação");

      alert("Ação atualizada com sucesso!");
      router.push("/acoes");
    } catch (error) {
      console.error("Erro ao atualizar ação:", error);
      alert("Erro ao atualizar ação.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAcao((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        <Input
          type="text"
          name="tipoAcao"
          placeholder="Tipo de Ação"
          value={acao.tipoAcao || ""}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="advogado"
          placeholder="Advogado"
          value={acao.advogado || ""}
          onChange={handleChange}
        />
        <Input
          type="number"
          name="porcentagemAdvogado"
          placeholder="Porcentagem do Advogado"
          value={acao.porcentagemAdvogado || ""}
          onChange={handleChange}
        />
        <TextArea
          name="observacoes"
          placeholder="Observações"
          rows="5"
          value={acao.observacoes || ""}
          onChange={handleChange}
        />
        <Button type="submit">Salvar Alterações</Button>
      </Form>
    </Container>
  );
}
