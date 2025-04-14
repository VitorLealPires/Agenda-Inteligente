"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styled from "styled-components";
import { Home, Users, UserPlus, FileText, Settings, LogOut } from "lucide-react";

const SidebarContainer = styled.aside`
  width: 250px;
  height: 100vh;
  background-color: var(--card-background);
  border-right: 1px solid var(--border);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 20;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    transform: translateX(-100%);
    
    &.open {
      transform: translateX(0);
    }
  }
`;

const Logo = styled.div`
  height: var(--header-height);
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  border-bottom: 1px solid var(--border);
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--primary);
`;

const NavMenu = styled.nav`
  padding: 1.5rem 0;
`;

const NavItem = styled.div`
  padding: 0.75rem 1.5rem;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  color: ${(props) => (props.active === "true" ? "var(--primary)" : "var(--foreground)")};
  background-color: ${(props) => (props.active === "true" ? "var(--accent)" : "transparent")};
  border-left: ${(props) => (props.active === "true" ? "3px solid var(--primary)" : "3px solid transparent")};
  transition: all 0.2s;
  
  &:hover {
    background-color: var(--accent);
  }
`;

const NavIcon = styled.span`
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
`;

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border);
`;

const FooterItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  color: var(--foreground);
  cursor: pointer;
  
  &:hover {
    color: var(--primary);
  }
`;

export default function Sidebar() {
  const [isClient, setIsClient] = useState(false);
  const [pathname, setPathname] = useState("");
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    setPathname(window.location.pathname);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const navItems = [
    { icon: <Home size={20} />, label: "Dashboard", path: "/" },
    { icon: <Users size={20} />, label: "Clientes", path: "/clientes" },
    { icon: <UserPlus size={20} />, label: "Cadastrar Cliente", path: "/clientes/cadastrar" },
    { icon: <FileText size={20} />, label: "Relatórios", path: "/relatorios" },
  ];

  if (!isClient) return null;

  return (
    <SidebarContainer>
      <Logo>{isClient ? "Mauricio Advocacia" : ""}</Logo>

      <NavMenu>
        {navItems.map((item) => (
          <Link href={item.path} key={item.path} passHref>
            <NavItem active={pathname === item.path ? "true" : "false"}>
              <NavIcon>{item.icon}</NavIcon>
              {item.label}
            </NavItem>
          </Link>
        ))}
      </NavMenu>

      <Footer>
        <Link href="/configuracoes">
          <FooterItem>
            <NavIcon>
              <Settings size={20} />
            </NavIcon>
            Configurações
          </FooterItem>
        </Link>
        <FooterItem onClick={handleLogout}>
          <NavIcon>
            <LogOut size={20} />
          </NavIcon>
          Sair
        </FooterItem>
      </Footer>
    </SidebarContainer>
  );
}
