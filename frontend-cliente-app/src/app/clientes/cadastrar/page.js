"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styled from "styled-components"
import { Save, ArrowLeft } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormGroup, Label, Input, Select, Textarea, ErrorText } from "@/components/ui/input"
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
    honorariosTipo: "fixo",
    advogado: "",
    porcentagem: "",
    observacoes: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório"
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = "CPF é obrigatório"
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      newErrors.cpf = "CPF inválido. Use o formato 000.000.000-00"
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = "Telefone é obrigatório"
    }

    if (!formData.tipoAcao) {
      newErrors.tipoAcao = "Tipo de ação é obrigatório"
    }

    if (!formData.honorariosValor.trim()) {
      newErrors.honorariosValor = "Valor dos honorários é obrigatório"
    }

    if (!formData.advogado) {
      newErrors.advogado = "Advogado responsável é obrigatório"
    }

    if (!formData.porcentagem.trim()) {
      newErrors.porcentagem = "Porcentagem do advogado é obrigatória"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Aqui seria feita a chamada à API para cadastrar o cliente
      
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // })

      // if (!response.ok) {
      //   throw new Error('Erro ao cadastrar cliente')
      // }

      // Simulação de delay para mostrar o estado de loading
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redireciona para a lista de clientes após o cadastro
      router.push("/clientes")
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error)
      alert("Ocorreu um erro ao cadastrar o cliente. Tente novamente.")
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
                <Input
                  id="telefone"
                  name="telefone"
                  placeholder="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={handleChange}
                />
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
                <Select id="tipoAcao" name="tipoAcao" value={formData.tipoAcao} onChange={handleChange}>
                  <option value="">Selecione o tipo de ação</option>
                  <option value="Trabalhista">Trabalhista</option>
                  <option value="Civil">Civil</option>
                  <option value="Previdenciário">Previdenciário</option>
                  <option value="Consumidor">Consumidor</option>
                  <option value="Família">Família</option>
                  <option value="Criminal">Criminal</option>
                  <option value="Tributário">Tributário</option>
                </Select>
                {errors.tipoAcao && <ErrorText>{errors.tipoAcao}</ErrorText>}
              </FormGroup>

              <div>
                <FormGroup>
                  <Label htmlFor="honorariosValor">Valor dos Honorários</Label>
                  <Input
                    id="honorariosValor"
                    name="honorariosValor"
                    placeholder="R$ 0,00"
                    value={formData.honorariosValor}
                    onChange={handleChange}
                  />
                  {errors.honorariosValor && <ErrorText>{errors.honorariosValor}</ErrorText>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="honorariosTipo">Tipo de Honorários</Label>
                  <Select
                    id="honorariosTipo"
                    name="honorariosTipo"
                    value={formData.honorariosTipo}
                    onChange={handleChange}
                  >
                    <option value="fixo">Fixo</option>
                    <option value="percentual">Percentual sobre ganho de causa</option>
                    <option value="misto">Misto</option>
                  </Select>
                </FormGroup>
              </div>

              <FormGroup>
                <Label htmlFor="advogado">Advogado Responsável</Label>
                <Select id="advogado" name="advogado" value={formData.advogado} onChange={handleChange}>
                  <option value="">Selecione o advogado</option>
                  <option value="Dr. Carlos Mendes">Dr. Carlos Mendes</option>
                  <option value="Dra. Ana Souza">Dra. Ana Souza</option>
                  <option value="Dr. Roberto Alves">Dr. Roberto Alves</option>
                  <option value="Dra. Juliana Costa">Dra. Juliana Costa</option>
                </Select>
                {errors.advogado && <ErrorText>{errors.advogado}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="porcentagem">Porcentagem do Advogado (%)</Label>
                <Input
                  id="porcentagem"
                  name="porcentagem"
                  placeholder="Ex: 30"
                  value={formData.porcentagem}
                  onChange={handleChange}
                />
                {errors.porcentagem && <ErrorText>{errors.porcentagem}</ErrorText>}
              </FormGroup>

              <FormGroup style={{ gridColumn: "1 / span 2" }}>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea id="observacoes" name="observacoes" value={formData.observacoes} onChange={handleChange} />
              </FormGroup>
            </FormGrid>
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

