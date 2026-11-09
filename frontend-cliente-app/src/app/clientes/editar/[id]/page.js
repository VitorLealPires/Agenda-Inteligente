'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Title,
  Form,
  FormGroup,
  StyledLabel,
  StyledInput,
  StyledTextarea,
  StyledButton
} from '@/components/ui/form-elements';

export default function EditarCliente() {
  const { id } = useParams();
  const router = useRouter();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  // Autenticação
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Buscar cliente
  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clientes/${id}`);
        if (!res.ok) throw new Error('Erro ao buscar cliente');
        const data = await res.json();
        const telefonesIniciais = Array.isArray(data.telefones) && data.telefones.length > 0
          ? data.telefones
          : (data.telefone ? [data.telefone] : []);
        setCliente({ ...data, telefones: telefonesIniciais });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCliente();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTelefoneChange = (index, value) => {
    const novosTelefones = [...cliente.telefones];
    novosTelefones[index] = value;
    setCliente((prev) => ({
      ...prev,
      telefones: novosTelefones,
    }));
  };

  const adicionarTelefone = () => {
    setCliente((prev) => ({
      ...prev,
      telefones: [...(prev.telefones || []), ''],
    }));
  };

  const removerTelefone = (index) => {
    const novosTelefones = cliente.telefones.filter((_, i) => i !== index);
    setCliente((prev) => ({
      ...prev,
      telefones: novosTelefones,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente),
      });

      if (!res.ok) throw new Error('Erro ao atualizar cliente');

      alert('Cliente atualizado com sucesso!');
      router.push('/clientes');
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar o cliente.');
    }
  };

  if (loading) return <p>Carregando dados do cliente...</p>;
  if (!cliente) return <p>Cliente não encontrado.</p>;

  return (
    <Container>
      <Title>Editar Cliente</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <StyledLabel>Nome</StyledLabel>
          <StyledInput name="nome" value={cliente.nome || ''} onChange={handleChange} />
        </FormGroup>

        <FormGroup>
          <StyledLabel>CPF</StyledLabel>
          <StyledInput name="cpf" value={cliente.cpf || ''} onChange={handleChange} />
        </FormGroup>

        <FormGroup>
          <StyledLabel>Telefones</StyledLabel>
          {cliente.telefones?.map((telefone, index) => (
            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <StyledInput
                type="text"
                value={telefone}
                onChange={(e) => handleTelefoneChange(index, e.target.value)}
              />
              <StyledButton type="button" onClick={() => removerTelefone(index)}>
                Remover
              </StyledButton>
            </div>
          ))}
          <StyledButton type="button" onClick={adicionarTelefone}>
            Adicionar Telefone
          </StyledButton>
        </FormGroup>

        <FormGroup>
          <StyledLabel>Observações</StyledLabel>
          <StyledTextarea name="observacoes" value={cliente.observacoes || ''} onChange={handleChange} />
        </FormGroup>

        <StyledButton type="submit">Salvar Alterações</StyledButton>
      </Form>
    </Container>
  );
}
