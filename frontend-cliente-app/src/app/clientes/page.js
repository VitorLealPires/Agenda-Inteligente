"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import { Edit, Trash2, Eye, UserPlus, Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableCell, TableActions } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ClientsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 400px;
  width: 100%;
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--foreground);
  opacity: 0.5;
`;

const SearchInput = styled(Input)`
  padding-left: 2.5rem;
`;

const ActionButton = styled(Button)`
  margin-left: 0.5rem;
`;

// Dados simulados para a lista de clientes
const clientsData = [
  {
    id: 1,
    nome: "João Silva",
    cpf: "123.456.789-00",
    telefone: "(11) 98765-4321",
    tipoAcao: "Trabalhista",
    honorarios: "R$ 3.000,00",
    advogado: "Dr. Carlos Mendes",
    porcentagem: "30%",
  },
  {
    id: 2,
    nome: "Maria Oliveira",
    cpf: "987.654.321-00",
    telefone: "(11) 91234-5678",
    tipoAcao: "Civil",
    honorarios: "R$ 5.000,00",
    advogado: "Dra. Ana Souza",
    porcentagem: "25%",
  },
  {
    id: 3,
    nome: "Pedro Santos",
    cpf: "456.789.123-00",
    telefone: "(11) 95555-9999",
    tipoAcao: "Previdenciário",
    honorarios: "R$ 2.500,00",
    advogado: "Dr. Roberto Alves",
    porcentagem: "20%",
  },
];

export default function ClientsList() {
  const [clients] = useState(clientsData);
  const [filteredClients, setFilteredClients] = useState(clientsData);
  const [searchTerm, setSearchTerm] = useState("");

  // Função para filtrar clientes com base no termo de busca
  useEffect(() => {
    if (searchTerm.trim() !== "") {
      const filtered = clients.filter(
        (client) =>
          client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.cpf.includes(searchTerm) ||
          client.telefone.includes(searchTerm)
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients);
    }
  }, [searchTerm, clients]);

  // Função para excluir um cliente
  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      const updatedClients = filteredClients.filter((client) => client.id !== id);
      setFilteredClients(updatedClients);
    }
  };

  return (
    <div>
      <ClientsHeader>
        <h1 className="text-2xl font-bold">Lista de Clientes</h1>
        <Link href="/clientes/cadastrar" passHref>
          <Button>
            <UserPlus size={18} />
            Novo Cliente
          </Button>
        </Link>
      </ClientsHeader>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtrar Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchContainer>
            <SearchIconWrapper>
              <Search size={18} />
            </SearchIconWrapper>
            <SearchInput
              placeholder="Buscar por nome, CPF ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Tipo de Ação</TableHead>
              <TableHead>Honorários</TableHead>
              <TableHead>Advogado</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <tbody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.nome}</TableCell>
                  <TableCell>{client.cpf}</TableCell>
                  <TableCell>{client.telefone}</TableCell>
                  <TableCell>{client.tipoAcao}</TableCell>
                  <TableCell>{client.honorarios}</TableCell>
                  <TableCell>{client.advogado}</TableCell>
                  <TableCell>
                    <TableActions>
                      <Link href={`/clientes/${client.id}`} passHref>
                        <ActionButton variant="ghost" size="sm">
                          <Eye size={16} />
                        </ActionButton>
                      </Link>
                      <Link href={`/clientes/editar/${client.id}`} passHref>
                        <ActionButton variant="ghost" size="sm">
                          <Edit size={16} />
                        </ActionButton>
                      </Link>
                      <ActionButton variant="ghost" size="sm" onClick={() => handleDelete(client.id)}>
                        <Trash2 size={16} />
                      </ActionButton>
                    </TableActions>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="7" className="text-center py-4">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}

