"use client"

import styled, { css } from "styled-components"

const getVariantStyles = (variant) => {
  switch (variant) {
    case "primary":
      return css`
        background-color: var(--primary);
        color: var(--primary-foreground);
        
        &:hover:not(:disabled) {
          background-color: var(--primary);
          opacity: 0.9;
        }
      `
    case "secondary":
      return css`
        background-color: var(--secondary);
        color: var(--secondary-foreground);
        
        &:hover:not(:disabled) {
          background-color: var(--secondary);
          opacity: 0.9;
        }
      `
    case "outline":
      return css`
        background-color: transparent;
        color: var(--foreground);
        border: 1px solid var(--border);
        
        &:hover:not(:disabled) {
          background-color: var(--secondary);
        }
      `
    case "ghost":
      return css`
        background-color: transparent;
        color: var(--foreground);
        
        &:hover:not(:disabled) {
          background-color: var(--secondary);
        }
      `
    case "danger":
      return css`
        background-color: #e53e3e;
        color: white;
        
        &:hover:not(:disabled) {
          background-color: #c53030;
        }
      `
    default:
      return ""
  }
}

const getSizeStyles = (size) => {
  switch (size) {
    case "sm":
      return css`
        height: 2rem;
        padding: 0 0.75rem;
        font-size: 0.875rem;
      `
    case "md":
      return css`
        height: 2.5rem;
        padding: 0 1rem;
        font-size: 0.875rem;
      `
    case "lg":
      return css`
        height: 3rem;
        padding: 0 1.5rem;
        font-size: 1rem;
      `
    default:
      return ""
  }
}

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  outline: none;
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};
  
  ${(props) => getVariantStyles(props.variant || "primary")}
  ${(props) => getSizeStyles(props.size || "md")}
  
  &:focus-visible {
    box-shadow: 0 0 0 2px var(--background), 0 0 0 4px var(--ring);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  & > svg {
    margin-right: ${(props) => (props.children ? "0.5rem" : "0")};
  }
`

