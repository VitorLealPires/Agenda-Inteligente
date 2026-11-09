"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styled from "styled-components";
import {
  Users,
  Scale,
  DollarSign,
  FileText,
  UserPlus,
  PlusCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 2rem;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const TitleGroup = styled.div`
  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--foreground);
  }
  p {
    font-size: 0.95rem;
    color: var(--foreground);
    opacity: 0.7;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
`;

const StatCard = styled(Card)`
  position: relative;
  overflow: hidden;
`;

const StatContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatText = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled.span`
  font-size: 0.875rem;
  color: var(--foreground);
  opacity: 0.7;
  font-weight: 500;
`;

const StatValue = styled.span`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--foreground);
  margin-top: 0.25rem;
`;

const StatIconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.$bg || "var(--accent)"};
  color: ${(props) => props.$color || "var(--primary)"};
`;

const TablesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const SimpleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: var(--card-background);
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background-color: var(--accent);
  }
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  strong {
    font-size: 0.95rem;
  }
  span {
    font-size: 0.8rem;
    opacity: 0.7;
  }
`;

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalAcoes: 0,
    totalHonorarios: 0,
    mediaHonorarios: 0,
    ultimosClientes: [],
    ultimasAcoes: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const carregarDados = async () => {
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };

        const [resClientes, resAcoes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/clientes`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/acoes`, { headers }),
        ]);

        const clientes = resClientes.ok ? await resClientes.json() : [];
        const acoes = resAcoes.ok ? await resAcoes.json() : [];

        const totalClientes = Array.isArray(clientes) ? clientes.length : 0;
        const totalAcoes = Array.isArray(acoes) ? acoes.length : 0;

        const totalHonorarios = Array.isArray(acoes)
          ? acoes.reduce((acc, acao) => acc + (Number(acao.honorarios?.valor) || 0), 0)
          : 0;

        const mediaHonorarios =
          totalAcoes > 0 ? totalHonorarios / totalAcoes : 0;

        const ultimosClientes = Array.isArray(clientes)
          ? [...clientes].reverse().slice(0, 5)
          : [];

        const ultimasAcoes = Array.isArray(acoes)
          ? [...acoes].reverse().slice(0, 5)
          : [];

        setStats({
          totalClientes,
          totalAcoes,
          totalHonorarios,
          mediaHonorarios,
          ultimosClientes,
          ultimasAcoes,
        });
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [router]);

  return (
    <DashboardContainer>
      <HeaderSection>
        <TitleGroup>
          <h1>Painel Principal</h1>
          <p>Visão geral de clientes, ações e honorários</p>
        </TitleGroup>

        <ActionButtons>
          <Link href="/clientes/cadastrar">
            <Button size="sm">
              <UserPlus size={16} />
              Novo Cliente
            </Button>
          </Link>
          <Link href="/acoes/cadastrar">
            <Button size="sm" variant="outline">
              <PlusCircle size={16} />
              Nova Ação
            </Button>
          </Link>
        </ActionButtons>
      </HeaderSection>

      <StatsGrid>
        <StatCard>
          <CardContent className="pt-6">
            <StatContent>
              <StatText>
                <StatLabel>Total de Clientes</StatLabel>
                <StatValue>{loading ? "..." : stats.totalClientes}</StatValue>
              </StatText>
              <StatIconWrapper $bg="#dbeafe" $color="#2563eb">
                <Users size={24} />
              </StatIconWrapper>
            </StatContent>
          </CardContent>
        </StatCard>

        <StatCard>
          <CardContent className="pt-6">
            <StatContent>
              <StatText>
                <StatLabel>Total de Ações</StatLabel>
                <StatValue>{loading ? "..." : stats.totalAcoes}</StatValue>
              </StatText>
              <StatIconWrapper $bg="#fef3c7" $color="#d97706">
                <Scale size={24} />
              </StatIconWrapper>
            </StatContent>
          </CardContent>
        </StatCard>

        <StatCard>
          <CardContent className="pt-6">
            <StatContent>
              <StatText>
                <StatLabel>Honorários Totais</StatLabel>
                <StatValue>
                  {loading
                    ? "..."
                    : `R$ ${stats.totalHonorarios.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}
                </StatValue>
              </StatText>
              <StatIconWrapper $bg="#dcfce7" $color="#16a34a">
                <DollarSign size={24} />
              </StatIconWrapper>
            </StatContent>
          </CardContent>
        </StatCard>

        <StatCard>
          <CardContent className="pt-6">
            <StatContent>
              <StatText>
                <StatLabel>Média por Ação</StatLabel>
                <StatValue>
                  {loading
                    ? "..."
                    : `R$ ${stats.mediaHonorarios.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}
                </StatValue>
              </StatText>
              <StatIconWrapper $bg="#f3e8ff" $color="#9333ea">
                <TrendingUp size={24} />
              </StatIconWrapper>
            </StatContent>
          </CardContent>
        </StatCard>
      </StatsGrid>

      <TablesGrid>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Últimos Clientes</CardTitle>
            <Link href="/clientes" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              Ver todos <ArrowRight size={14} />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Carregando...</p>
            ) : stats.ultimosClientes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum cliente cadastrado.</p>
            ) : (
              <SimpleList>
                {stats.ultimosClientes.map((cliente) => (
                  <Link href={`/clientes/${cliente._id}`} key={cliente._id}>
                    <ListItem>
                      <ItemInfo>
                        <strong>{cliente.nome}</strong>
                        <span>CPF: {cliente.cpf}</span>
                      </ItemInfo>
                      <span className="text-xs text-muted-foreground">
                        {Array.isArray(cliente.telefones) && cliente.telefones.length > 0
                          ? cliente.telefones[0]
                          : cliente.telefone || "Sem telefone"}
                      </span>
                    </ListItem>
                  </Link>
                ))}
              </SimpleList>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Últimas Ações</CardTitle>
            <Link href="/acoes" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              Ver todas <ArrowRight size={14} />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Carregando...</p>
            ) : stats.ultimasAcoes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma ação cadastrada.</p>
            ) : (
              <SimpleList>
                {stats.ultimasAcoes.map((acao) => (
                  <Link href={`/acoes/editar/${acao._id}`} key={acao._id}>
                    <ListItem>
                      <ItemInfo>
                        <strong>{acao.tipoAcao}</strong>
                        <span>Advogado: {acao.advogado}</span>
                      </ItemInfo>
                      <span className="text-xs font-semibold text-green-700">
                        R$ {(Number(acao.honorarios?.valor) || 0).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </ListItem>
                  </Link>
                ))}
              </SimpleList>
            )}
          </CardContent>
        </Card>
      </TablesGrid>
    </DashboardContainer>
  );
}
