"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";
import { ArrowLeft, Edit, Trash2, PlusCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ClientContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const ClientHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const BackButton = styled.div`
  margin-right: 1rem;
`;

const ClientInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const InfoLabel = styled.div`
  font-size: 0.875rem;
  color: var(--foreground);
  opacity: 0.7;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  font-weight: 500;
`;

const AcoesContainer = styled.div`
  margin-top: 2rem;
`;

const AcaoItem = styled.div`
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

export default function ClientDetails() {
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acoes, setAcoes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (!params.id) return;

    const fetchClientData = async () => {
      try {
        setLoading(true);
        const clientId = params.id;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clientes/${clientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Erro ao buscar os dados do cliente: ${res.status}`);
        }

        const data = await res.json();
        setClient(data);
      } catch (error) {
        console.error("Erro ao carregar os dados do cliente:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAcoesDoCliente = async () => {
      try {
        const clientId = params.id;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/acoes/cliente/${clientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Erro ao buscar ações");
        }

        const data = await res.json();
        setAcoes(data);
      } catch (error) {
        console.error("Erro ao buscar ações do cliente:", error);
      }
    };

    fetchClientData();
    fetchAcoesDoCliente();
  }, [params.id, router]);

  const handleDelete = async () => {
    if (!client || !client._id) {
      alert("ID do cliente não encontrado.");
      return;
    }

    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clientes/${client._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erro ao excluir cliente");
        }

        alert("Cliente excluído com sucesso.");
        router.push("/clientes");
      } catch (error) {
        console.error("Erro ao excluir o cliente:", error);
        alert("Erro ao excluir o cliente. Verifique o console para mais detalhes.");
      }
    }
  };

  if (loading) {
    return (
      <ClientContainer>
        <p>Carregando informações do cliente...</p>
      </ClientContainer>
    );
  }

  if (!client) {
    return (
      <ClientContainer>
        <p>Cliente não encontrado.</p>
        <Link href="/clientes">
          <Button variant="outline">Voltar para a lista</Button>
        </Link>
      </ClientContainer>
    );
  }

  const {
    nome,
    cpf,
    telefone,
    telefones,
    tipoAcao,
    advogado,
    observacoes,
    porcentagemAdvogado,
    honorarios,
    dataFechamentoContrato,
  } = client;

  const telefonesFormatados =
    Array.isArray(telefones) && telefones.length > 0
      ? telefones.join(", ")
      : telefone || "Não informado";

  return (
    <ClientContainer>
      <ClientHeader>
        <BackButton>
          <Link href="/clientes">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={18} />
            </Button>
          </Link>
        </BackButton>
        <h1 className="text-2xl font-bold">Detalhes do Cliente</h1>
      </ClientHeader>

      <Card>
        <CardHeader>
          <CardTitle>{nome}</CardTitle>
        </CardHeader>

        <CardContent>
          <ClientInfo>
            <InfoGroup>
              <InfoLabel>CPF</InfoLabel>
              <InfoValue>{cpf}</InfoValue>
            </InfoGroup>

            <InfoGroup>
              <InfoLabel>Telefone</InfoLabel>
              <InfoValue>{telefonesFormatados}</InfoValue>
            </InfoGroup>

            <InfoGroup>
              <InfoLabel>Tipo de Ação</InfoLabel>
              <InfoValue>{tipoAcao}</InfoValue>
            </InfoGroup>

            <InfoGroup>
              <InfoLabel>Valor dos Honorários</InfoLabel>
              <InfoValue>
                {honorarios?.valor ? `R$ ${honorarios.valor}` : "Não informado"}
              </InfoValue>
            </InfoGroup>

            <InfoGroup>
              <InfoLabel>Parcelamento de Honorário</InfoLabel>
              <InfoValue>
                {honorarios?.parcelamento?.trim() || "Não informado"}
              </InfoValue>
            </InfoGroup>

            <InfoGroup>
              <InfoLabel>Advogado Responsável</InfoLabel>
              <InfoValue>{advogado}</InfoValue>
            </InfoGroup>

            <InfoGroup>
              <InfoLabel>Porcentagem do Advogado</InfoLabel>
              <InfoValue>
                {porcentagemAdvogado ? `${porcentagemAdvogado}%` : "Não informado"}
              </InfoValue>
            </InfoGroup>

            <InfoGroup>
              <InfoLabel>Data de Fechamento do Contrato</InfoLabel>
              <InfoValue>
                {dataFechamentoContrato
                  ? new Date(dataFechamentoContrato).toLocaleDateString("pt-BR")
                  : "Não informada"}
              </InfoValue>
            </InfoGroup>
          </ClientInfo>

          <InfoGroup>
            <InfoLabel>Observações</InfoLabel>
            <InfoValue>{observacoes || "Nenhuma observação registrada."}</InfoValue>
          </InfoGroup>

          <AcoesContainer>
            <h2 className="text-xl font-semibold mb-3">Ações Relacionadas</h2>
            {acoes.length === 0 ? (
              <p>Nenhuma ação cadastrada para este cliente.</p>
            ) : (
              acoes.map((acao) => (
                <AcaoItem key={acao._id}>
                  <strong>Tipo:</strong> {acao.tipoAcao || "N/A"}<br />
                  <strong>Data de Início:</strong> {acao.dataInicio ? new Date(acao.dataInicio).toLocaleDateString("pt-BR") : "N/A"}<br />
                  <strong>Status:</strong> {acao.status || "N/A"}<br />
                  <strong>Observações:</strong> {acao.observacoes || "Nenhuma"}
                </AcaoItem>
              ))
            )}
          </AcoesContainer>
        </CardContent>

        <CardFooter>
          <Link href={`/clientes/editar/${client._id}`}>
            <Button variant="outline" className="mr-2">
              <Edit size={18} />
              Editar
            </Button>
          </Link>

          <Link href={`/acoes/cadastrar?clienteId=${client._id}`}>
            <Button variant="default" className="mr-2">
              <PlusCircle size={18} />
              Nova Ação
            </Button>
          </Link>

          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 size={18} />
            Excluir
          </Button>
        </CardFooter>
      </Card>
    </ClientContainer>
  );
}




