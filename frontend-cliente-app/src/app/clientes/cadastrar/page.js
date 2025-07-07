"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styled from "styled-components"
import { Save, ArrowLeft, Trash2, Plus } from "lucide-react"
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

const PhoneList = styled.ul`
  margin-top: 0.5rem;
  padding-left: 1rem;
  list-style: disc;
`

const PhoneItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export default function ClientRegister() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefones: [],
    telefoneTemp: "",
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

  const addTelefone = () => {
    let tel = formData.telefoneTemp.trim()
    const onlyDigits = tel.replace(/\D/g, "")

    if (onlyDigits.length < 10 || onlyDigits.length > 11) return

    // Evita duplicidade
    if (!formData.telefones.includes(onlyDigits)) {
      setFormData((prev) => ({
        ...prev,
        telefones: [...prev.telefones, onlyDigits],
        telefoneTemp: "",
      }))
    }
  }

  const removeTelefone = (telToRemove) => {
    setFormData((prev) => ({
      ...prev,
      telefones: prev.telefones.filter((t) => t !== telToRemove),
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório"
    if (!formData.cpf.trim()) newErrors.cpf = "CPF é obrigatório"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.nome,
          cpf: formData.cpf,
          telefones: formData.telefones, // <- agora é array puro
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Erro ao criar cliente")

      router.push("/clientes")
    } catch (error) {
      console.error("Erro ao cadastrar:", error)
      alert(`Erro ao cadastrar cliente: ${error.message}`)
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
                <Input
                  id="cpf"
                  name="cpf"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleChange}
                />
                {errors.cpf && <ErrorText>{errors.cpf}</ErrorText>}
              </FormGroup>

              <FormGroup style={{ gridColumn: "1 / -1" }}>
                <Label htmlFor="telefone">Telefones</Label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Input
                    id="telefone"
                    name="telefoneTemp"
                    placeholder="(00) 00000-0000"
                    value={formData.telefoneTemp}
                    onChange={handleChange}
                  />
                  <Button type="button" onClick={addTelefone} variant="outline">
                    <Plus size={16} />
                  </Button>
                </div>
                <PhoneList>
                  {formData.telefones.map((tel) => (
                    <PhoneItem key={tel}>
                      {tel}
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => removeTelefone(tel)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </PhoneItem>
                  ))}
                </PhoneList>
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