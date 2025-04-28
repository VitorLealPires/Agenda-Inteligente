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

const Label = styled.span`
  font-weight: bold;
`;

const Observacoes = styled.p`
  white-space: pre-wrap;
  overflow-wrap: break-word;
  margin-top: 0.5rem;
`;

export default function DetalhesAcao({ params }) {
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
      <Title>Detalhes da Ação</Title>
      <p><Label>Cliente:</Label> {acao.cliente?.nome || "N/A"}</p>
      <p><Label>CPF:</Label> {acao.cliente?.cpf || "N/A"}</p>
      <p><Label>Tipo de Ação:</Label> {acao.tipoAcao}</p>
      <p><Label>Honorários:</Label> R$ {acao.honorarios?.valor?.toFixed(2) || "0,00"}</p>
      <p><Label>Parcelamento:</Label> {acao.honorarios?.parcelamento || "Não informado"}</p>
      <p><Label>Advogado:</Label> {acao.advogado}</p>
      <p><Label>Porcentagem do Advogado:</Label> {acao.porcentagemAdvogado}%</p>
      <p><Label>Data de Fechamento:</Label> {acao.dataFechamentoContrato ? new Date(acao.dataFechamentoContrato).toLocaleDateString("pt-BR") : "N/A"}</p>
      <Label>Observações:</Label>
      <Observacoes>{acao.observacoes || "Nenhuma"}</Observacoes>
    </Container>
  );
}
