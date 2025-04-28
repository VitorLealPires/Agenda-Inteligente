"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
`;

const AcaoItem = styled.div`
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 1rem;
  background-color: var(--card-background);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.span`
  font-weight: bold;
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ObservacoesText = styled.p`
  white-space: pre-wrap;
  word-break: break-word;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${(props) => (props.delete ? "#f87171" : "#3b82f6")};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background-color: ${(props) => (props.delete ? "#ef4444" : "#2563eb")};
  }
`;

export default function ListaAcoes() {
  const [acoes, setAcoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [termoBusca, setTermoBusca] = useState("");
  const router = useRouter();

  const fetchAcoes = async (termo = "") => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const url = termo
        ? `${process.env.NEXT_PUBLIC_API_URL}/acoes/buscar?termo=${encodeURIComponent(termo)}`
        : `${process.env.NEXT_PUBLIC_API_URL}/acoes`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao buscar ações");

      const data = await res.json();
      setAcoes(data);
    } catch (err) {
      console.error("Erro ao buscar ações:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcoes();
  }, []);

  const handleBuscar = (e) => {
    const valor = e.target.value;
    setTermoBusca(valor);
    fetchAcoes(valor);
  };

  const handleEditar = (id) => {
    router.push(`/acoes/editar/${id}`);
  };

  const handleExcluir = async (id) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir esta ação?");
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/acoes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao excluir ação");

      alert("Ação excluída com sucesso!");
      fetchAcoes(); // Atualiza a lista
    } catch (err) {
      console.error("Erro ao excluir ação:", err);
      alert("Erro ao excluir ação. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <Container>
        <p>Carregando ações...</p>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Lista de Ações</Title>
      <SearchInput
        type="text"
        placeholder="Buscar por nome ou CPF do cliente..."
        value={termoBusca}
        onChange={handleBuscar}
      />
      {acoes.length === 0 ? (
        <p>Nenhuma ação encontrada.</p>
      ) : (
        acoes.map((acao) => (
          <AcaoItem key={acao._id}>
            <p><Label>Cliente:</Label> {acao.cliente?.nome || "N/A"}</p>
            <p><Label>CPF:</Label> {acao.cliente?.cpf || "N/A"}</p>
            <p><Label>Tipo de Ação:</Label> {acao.tipoAcao || "N/A"}</p>
            <p><Label>Honorários:</Label> R$ {acao.honorarios?.valor?.toFixed(2) || "0,00"}</p>
            <p><Label>Parcelamento:</Label> {acao.honorarios?.parcelamento || "Não informado"}</p>
            <p><Label>Advogado:</Label> {acao.advogado}</p>
            <p><Label>Porcentagem do Advogado:</Label> {acao.porcentagemAdvogado}%</p>
            <p><Label>Data de Fechamento:</Label> {acao.dataFechamentoContrato ? new Date(acao.dataFechamentoContrato).toLocaleDateString("pt-BR") : "N/A"}</p>
            <div>
              <Label>Observações:</Label>
              <ObservacoesText>{acao.observacoes || "Nenhuma"}</ObservacoesText>
            </div>
            <ButtonGroup>
              <ActionButton onClick={() => handleEditar(acao._id)}>Editar</ActionButton>
              <ActionButton delete onClick={() => handleExcluir(acao._id)}>Excluir</ActionButton>
            </ButtonGroup>
          </AcaoItem>
        ))
      )}
    </Container>
  );
}



