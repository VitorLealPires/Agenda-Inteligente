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

  // Verificação de autenticação
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clientes/${id}`);
        if (!res.ok) throw new Error('Erro ao buscar cliente');
        const data = await res.json();
        setCliente(data);
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

    if (name === 'parcelamentoHonorario') {
      setCliente((prev) => ({
        ...prev,
        honorarios: {
          ...prev.honorarios,
          parcelamento: value,
        },
      }));
    } else {
      setCliente((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleHonorariosChange = (e) => {
    const { name, value } = e.target;
    setCliente((prev) => ({
      ...prev,
      honorarios: {
        ...prev.honorarios,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataAjustada = cliente.dataFechamentoContrato?.slice(0, 10);
    const dataFormatada = dataAjustada
      ? new Date(`${dataAjustada}T12:00:00.000Z`).toISOString()
      : null;

    const clienteAtualizado = {
      ...cliente,
      dataFechamentoContrato: dataFormatada,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteAtualizado),
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
          <StyledLabel>Telefone</StyledLabel>
          <StyledInput name="telefone" value={cliente.telefone || ''} onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <StyledLabel>Tipo de Ação</StyledLabel>
          <StyledInput name="tipoAcao" value={cliente.tipoAcao || ''} onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <StyledLabel>Advogado Responsável</StyledLabel>
          <StyledInput name="advogado" value={cliente.advogado || ''} onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <StyledLabel>Porcentagem do Advogado (%)</StyledLabel>
          <StyledInput name="porcentagemAdvogado" value={cliente.porcentagemAdvogado || ''} onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <StyledLabel>Valor dos Honorários</StyledLabel>
          <StyledInput name="valor" value={cliente.honorarios?.valor || ''} onChange={handleHonorariosChange} />
        </FormGroup>
        <FormGroup>
          <StyledLabel>Parcelamento de Honorário</StyledLabel>
          <StyledInput
            name="parcelamentoHonorario"
            value={cliente.honorarios?.parcelamento || ''}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <StyledLabel>Data de Fechamento do Contrato</StyledLabel>
          <StyledInput
            type="date"
            name="dataFechamentoContrato"
            value={cliente.dataFechamentoContrato?.slice(0, 10) || ''}
            onChange={handleChange}
          />
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


