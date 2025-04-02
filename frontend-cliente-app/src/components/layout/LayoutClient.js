// src/components/layout/LayoutClient.js
"use client";

import { ThemeProvider } from "@/components/theme-provider";
import StyledComponentsRegistry from "@/lib/registry";
import GlobalStyle from "@/components/styles/global-style";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import styled from "styled-components";

const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 1rem;
  margin-left: 250px;
  transition: margin-left 0.3s ease;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 0.5rem;
  }
`;

export default function LayoutClient({ children }) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider>
        <GlobalStyle />
        <LayoutWrapper>
          <Sidebar />
          <MainContent>
            <Header />
            {children}
          </MainContent>
        </LayoutWrapper>
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}
