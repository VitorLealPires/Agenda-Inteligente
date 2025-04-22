"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styled from "styled-components"
import { Save, ArrowLeft } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormGroup, Label, Input, ErrorText } from "@/components/ui/input"
import Link from "next/link"

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const FormHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`

const BackButton = styled.div`
  margin-right: 1rem;
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export default function ClientRegister() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    tipoAcao: "",
    honorariosValor: "",
    advogado: "",
    porcentagem: "",
    observacoes: "",
    parcelamento: "",
    dataFechamentoContrato: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório"
    if (!formData.cpf.trim()) newErrors.cpf = "CPF é obrigatório"
    if (!formData.telefone.trim()) newErrors.telefone = "Telefone é obrigatório"
    if (!formData.tipoAcao) newErrors.tipoAcao = "Tipo de ação é obrigatório"
    if (!formData.honorariosValor.trim()) newErrors.honorariosValor = "Valor dos honorários é obrigatório"
    if (!formData.parcelamento.trim()) newErrors.parcelamento = "Parcelamento é obrigatório"
    if (!formData.advogado) newErrors.advogado = "Advogado responsável é obrigatório"
    if (!formData.porcentagem.trim()) newErrors.porcentagem = "Porcentagem do advogado é obrigatória"
    if (!formData.dataFechamentoContrato.trim()) newErrors.dataFechamentoContrato = "Data de fechamento é obrigatória"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // 1. Cadastra o cliente
      const clienteResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.nome,
          cpf: formData.cpf,
          telefone: formData.telefone,
        }),
      })

      const clienteData = await clienteResponse.json()

      if (!clienteResponse.ok) {
        throw new Error(clienteData.message || "Erro ao criar cliente")
      }

      const clienteId = clienteData._id

      // 2. Cadastra a primeira ação vinculada ao cliente
      const acaoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/acoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clienteId,
          tipoAcao: formData.tipoAcao,
          honorarios: {
            valor: formData.honorariosValor,
            parcelamento: formData.parcelamento,
          },
          advogado: formData.advogado,
          porcentagemAdvogado: formData.porcentagem,
          dataFechamentoContrato: formData.dataFechamentoContrato,
          observacoes: formData.observacoes,
        }),
      })

      const acaoData = await acaoResponse.json()

      if (!acaoResponse.ok) {
        throw new Error(acaoData.message || "Erro ao criar ação")
      }

      router.push("/clientes")
    } catch (error) {
      console.error("Erro ao cadastrar:", error)
      alert(`Erro ao cadastrar cliente ou ação: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormContainer>
      <FormHeader>
        <BackButton>
          <Link href="/clientes">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={18} />
            </Button>
          </Link>
        </BackButton>
        <h1 className="text-2xl font-bold">Cadastrar Novo Cliente</h1>
      </FormHeader>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            <FormGrid>
              <FormGroup>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} />
                {errors.nome && <ErrorText>{errors.nome}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" name="cpf" placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange} />
                {errors.cpf && <ErrorText>{errors.cpf}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" name="telefone" placeholder="(00) 00000-0000" value={formData.telefone} onChange={handleChange} />
                {errors.telefone && <ErrorText>{errors.telefone}</ErrorText>}
              </FormGroup>
            </FormGrid>
          </CardContent>

          <CardHeader>
            <CardTitle>Informações do Processo</CardTitle>
          </CardHeader>
          <CardContent>
            <FormGrid>
              <FormGroup>
                <Label htmlFor="tipoAcao">Tipo de Ação</Label>
                <Input id="tipoAcao" name="tipoAcao" value={formData.tipoAcao} onChange={handleChange} />
                {errors.tipoAcao && <ErrorText>{errors.tipoAcao}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="honorariosValor">Valor dos Honorários</Label>
                <Input id="honorariosValor" name="honorariosValor" value={formData.honorariosValor} onChange={handleChange} />
                {errors.honorariosValor && <ErrorText>{errors.honorariosValor}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="parcelamento">Parcelamento de Honorário</Label>
                <Input id="parcelamento" name="parcelamento" value={formData.parcelamento} onChange={handleChange} />
                {errors.parcelamento && <ErrorText>{errors.parcelamento}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="porcentagem">Porcentagem do Advogado</Label>
                <Input id="porcentagem" name="porcentagem" value={formData.porcentagem} onChange={handleChange} />
                {errors.porcentagem && <ErrorText>{errors.porcentagem}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="dataFechamentoContrato">Data de Fechamento do Contrato</Label>
                <Input type="date" id="dataFechamentoContrato" name="dataFechamentoContrato" value={formData.dataFechamentoContrato} onChange={handleChange} />
                {errors.dataFechamentoContrato && <ErrorText>{errors.dataFechamentoContrato}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="advogado">Advogado Responsável</Label>
                <Input id="advogado" name="advogado" value={formData.advogado} onChange={handleChange} />
                {errors.advogado && <ErrorText>{errors.advogado}</ErrorText>}
              </FormGroup>
            </FormGrid>
          </CardContent>

          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <FormGroup>
              <Label htmlFor="observacoes">Observações</Label>
              <Input id="observacoes" name="observacoes" value={formData.observacoes} onChange={handleChange} />
            </FormGroup>
          </CardContent>

          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              <Save size={18} />
              {isSubmitting ? "Salvando..." : "Salvar Cliente"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </FormContainer>
  )
}

