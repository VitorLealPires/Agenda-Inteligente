"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 80px auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ErrorMsg = styled.p`
  color: red;
  margin-bottom: 1rem;
  text-align: center;
`;

const SuccessMsg = styled.p`
  color: green;
  margin-bottom: 1rem;
  text-align: center;
`;

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ login: "", senha: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    console.log("Tentando fazer login com:", credentials);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      console.log("Resposta da API:", res);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erro ao fazer login");
      }

      const data = await res.json();
      console.log("Login bem-sucedido. Token recebido:", data.token);

      localStorage.setItem("token", data.token);
      setSuccess("Login bem-sucedido!");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      console.error("Erro no login:", err);
      setError(err.message);
    }
  };

  return (
    <LoginContainer>
      <Title>Login</Title>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      {success && <SuccessMsg>{success}</SuccessMsg>}

      <form>
        <div className="mb-4">
          <Input
            type="text"
            name="login" // ← corrigido para "login" minúsculo
            placeholder="Login"
            value={credentials.login}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <Input
            type="password"
            name="senha"
            placeholder="Senha"
            value={credentials.senha}
            onChange={handleChange}
            required
          />
        </div>
        <Button type="button" onClick={handleLogin} className="w-full">
          Entrar
        </Button>
      </form>
    </LoginContainer>
  );
}
