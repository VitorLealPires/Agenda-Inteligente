"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Menu, Bell, Search } from "lucide-react";

const HeaderContainer = styled.header`
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  background-color: var(--background);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 400px;
  width: 100%;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border-radius: var(--radius);
  border: 1px solid var(--input);
  background-color: var(--secondary);
  color: var(--foreground);
  
  &:focus {
    outline: none;
    border-color: var(--ring);
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--foreground);
  opacity: 0.5;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: var(--foreground);
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--secondary);
  }
`;

const MobileMenuButton = styled(IconButton)`
  @media (min-width: 769px) {
    display: none;
  }
`;

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <HeaderContainer>
      <MobileMenuButton aria-label="Menu">
        <Menu size={20} />
      </MobileMenuButton>

      <SearchContainer>
        <SearchIcon>
          <Search size={18} />
        </SearchIcon>
        <SearchInput placeholder="Buscar cliente..." />
      </SearchContainer>

      <ActionButtons>
        <IconButton aria-label="Notificações">
          <Bell size={20} />
        </IconButton>
        <IconButton onClick={toggleTheme} aria-label="Alternar tema">
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </IconButton>
      </ActionButtons>
    </HeaderContainer>
  );
}
