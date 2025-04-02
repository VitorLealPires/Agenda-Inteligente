"use client"

import styled from "styled-components"

export const Card = styled.div`
  background-color: var(--card-background);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`

export const CardHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
`

export const CardDescription = styled.p`
  color: var(--foreground);
  opacity: 0.7;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`

export const CardContent = styled.div`
  padding: 1.5rem;
`

export const CardFooter = styled.div`
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
`

