"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
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

export default function ClientDetails() {
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return; // Se `id` não estiver disponível, não faz a requisição.

    console.log("Buscando cliente com ID:", params.id);

    const fetchClientData = async () => {
      try {
        const clientId = params.id; // Pegando ID correto
        const response = await fetch(`http://localhost:5000/clientes/${clientId}`);

        if (!response.ok) {
          throw new Error("Erro ao buscar os dados do cliente");
        }

        const data = await response.json();
        setClient(data);
      } catch (error) {
        console.error("Erro ao carregar os dados do cliente:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [params.id]);

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        const clientId = params.id;
        const response = await fetch(`http://localhost:5000/clientes/${clientId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          router.push("/clientes");
        } else {
          console.error("Erro ao excluir cliente");
        }
      } catch (error) {
        console.error("Erro ao excluir o cliente:", error);
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
          <CardTitle>{client.nome}</CardTitle>
        </CardHeader>

        <CardContent>
          <ClientInfo>
            <InfoGroup>
              <InfoLabel>CPF</InfoLabel>
              <InfoValue>{client.cpf}</InfoValue>
            </InfoGroup>

            <InfoGroup>
              <InfoLabel>Telefone</InfoLabel>
              <InfoValue>{client.telefone}</InfoValue>
            </InfoGroup>

            <InfoGroup>
              <InfoLabel>Tipo de Ação</InfoLabel>
              <InfoValue>{client.tipoAcao}</InfoValue>
            </InfoGroup>

            <InfoGroup>
              <InfoLabel>Honorários</InfoLabel>
              <InfoValue>
                {client.honorariosValor} ({client.honorariosTipo})
              </InfoValue>
            </InfoGroup>

            <InfoGroup>
              <InfoLabel>Advogado Responsável</InfoLabel>
              <InfoValue>{client.advogado}</InfoValue>
            </InfoGroup>

            <InfoGroup>
              <InfoLabel>Porcentagem do Advogado</InfoLabel>
              <InfoValue>{client.porcentagem}</InfoValue>
            </InfoGroup>
          </ClientInfo>

          <InfoGroup>
            <InfoLabel>Observações</InfoLabel>
            <InfoValue>{client.observacoes || "Nenhuma observação registrada."}</InfoValue>
          </InfoGroup>
        </CardContent>

        <CardFooter>
          <Link href={`/clientes/editar/${client.id}`}>
            <Button variant="outline" className="mr-2">
              <Edit size={18} />
              Editar
            </Button>
          </Link>
          <Button variant="danger" onClick={handleDelete}>
            <Trash2 size={18} />
            Excluir
          </Button>
        </CardFooter>
      </Card>
    </ClientContainer>
  );
}


