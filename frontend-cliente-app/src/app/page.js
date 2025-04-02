"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { Users, UserPlus, FileText, ArrowUpRight } from "lucide-react";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(Card)`
  display: flex;
  flex-direction: column;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-top: 0.5rem;
`;

const StatIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: var(--primary);
  color: var(--primary-foreground);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RecentClientsSection = styled.div`
  margin-top: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
`;

export default function Dashboard() {
  const [totalClients, setTotalClients] = useState(null);
  const [activeProcesses, setActiveProcesses] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState(null);
  const [recentClients, setRecentClients] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:5000/clientes");
        if (!response.ok) {
          throw new Error(`Erro ao buscar dados: ${response.status}`);
        }
        const data = await response.json();
        setTotalClients(data.totalClients || 0);
        setActiveProcesses(data.activeProcesses || 0);
        setMonthlyRevenue(data.monthlyRevenue || 0);
        setRecentClients(data.recentClients || []);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      }
    }
    
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <DashboardGrid>
        <StatCard>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Total de Clientes</CardTitle>
                <StatValue>{totalClients}</StatValue>
              </div>
              <StatIcon>
                <Users size={24} />
              </StatIcon>
            </div>
          </CardContent>
        </StatCard>

        <StatCard>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Processos Ativos</CardTitle>
                <StatValue>{activeProcesses}</StatValue>
              </div>
              <StatIcon>
                <FileText size={24} />
              </StatIcon>
            </div>
          </CardContent>
        </StatCard>

        <StatCard>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Faturamento Mensal</CardTitle>
                <StatValue>{monthlyRevenue}</StatValue>
              </div>
              <StatIcon>
                <ArrowUpRight size={24} />
              </StatIcon>
            </div>
          </CardContent>
        </StatCard>
      </DashboardGrid>

      <RecentClientsSection>
        <SectionHeader>
          <SectionTitle>Clientes Recentes</SectionTitle>
          <Link href="/clientes">
            <Button variant="outline" size="sm">Ver Todos</Button>
          </Link>
        </SectionHeader>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Tipo de Ação</TableHead>
                <TableHead>Advogado</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {recentClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.nome}</TableCell>
                  <TableCell>{client.cpf}</TableCell>
                  <TableCell>{client.telefone}</TableCell>
                  <TableCell>{client.tipoAcao}</TableCell>
                  <TableCell>{client.advogado}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </Card>
      </RecentClientsSection>

      <div className="mt-6">
        <Link href="/clientes/cadastrar">
          <Button>
            <UserPlus size={18} />
            Cadastrar Novo Cliente
          </Button>
        </Link>
      </div>
    </div>
  );
}




