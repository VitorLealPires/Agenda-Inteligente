"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Eye, UserPlus, Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableActions
} from "@/components/ui/table";
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

const SortMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  width: 180px;
`;

const SortMenuItem = styled.div`
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  background-color: ${(props) => (props.active ? "#f0f0f0" : "white")};

  &:hover {
    background-color: #f9f9f9;
  }
`;

const sortOptions = [
  { label: "A → Z", value: "asc" },
  { label: "Z → A", value: "desc" },
  { label: "Mais recente", value: "recent" },
  { label: "Mais antigo", value: "oldest" }
];

export default function ClientsList() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState(null);
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchClients = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clientes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Erro ao buscar clientes");

        const data = await response.json();
        setClients(data);
        setFilteredClients(data);
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [router]);

  useEffect(() => {
    let filtered = [...clients];

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (client) =>
          client.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.cpf?.includes(searchTerm) ||
          client.telefones?.some((t) => t.includes(searchTerm))
      );
    }

    switch (sortOrder) {
      case "asc":
        filtered.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case "desc":
        filtered.sort((a, b) => b.nome.localeCompare(a.nome));
        break;
      case "recent":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id)
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt || a._id) - new Date(b.createdAt || b._id)
        );
        break;
    }

    setFilteredClients(filtered);
  }, [searchTerm, clients, sortOrder]);

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clientes/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Erro ao excluir cliente");
        setClients((prev) => prev.filter((client) => client._id !== id));
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
      }
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
              <TableHead style={{ position: "relative", cursor: "pointer" }} onClick={() => setShowSortMenu(!showSortMenu)}>
                Nome ▾
                {showSortMenu && (
                  <SortMenu>
                    {sortOptions.map((option) => (
                      <SortMenuItem
                        key={option.value}
                        onClick={() => {
                          setSortOrder(option.value);
                          setShowSortMenu(false);
                        }}
                        active={sortOrder === option.value}
                      >
                        {option.label}
                      </SortMenuItem>
                    ))}
                  </SortMenu>
                )}
              </TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Tipo de Ação</TableHead>
              <TableHead>Advogado</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <tbody>
            {loading ? (
              <TableRow key="loading">
                <TableCell colSpan="6" className="text-center py-4">
                  Carregando clientes...
                </TableCell>
              </TableRow>
            ) : filteredClients.length > 0 ? (
              filteredClients.map((client) => {
                const key = client._id || `${client.nome}-${client.cpf}`;
                return (
                  <TableRow key={key}>
                  <TableCell>{client.nome}</TableCell>
                  <TableCell>{client.cpf}</TableCell>
                  <TableCell>
                    {Array.isArray(client.telefones) && client.telefones.length > 0
                      ? client.telefones.join(", ")
                      : client.telefone || "—"}
                  </TableCell>
                  <TableCell>{client.tipoAcao || "—"}</TableCell>
                  <TableCell>{client.advogado || "—"}</TableCell>
                  <TableCell>
                    <TableActions>
                      <Link href={`/clientes/${client._id}`} passHref>
                        <ActionButton variant="ghost" size="sm">
                          <Eye size={16} />
                        </ActionButton>
                      </Link>
                      <Link href={`/clientes/editar/${client._id}`} passHref>
                        <ActionButton variant="ghost" size="sm">
                          <Edit size={16} />
                        </ActionButton>
                      </Link>
                      <ActionButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(client._id)}
                      >
                        <Trash2 size={16} />
                      </ActionButton>
                    </TableActions>
                  </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow key="no-clients">
                <TableCell colSpan="6" className="text-center py-4">
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
