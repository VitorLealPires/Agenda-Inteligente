"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useAuthProtegida() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // redireciona se não estiver logado
    }
  }, [router]);
}
