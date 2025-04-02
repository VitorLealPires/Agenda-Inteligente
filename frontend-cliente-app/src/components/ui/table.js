"use client"

import styled from "styled-components"

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
`

export const TableHeader = styled.thead`
  background-color: var(--secondary);
  border-bottom: 1px solid var(--border);
`

export const TableRow = styled.tr`
  border-bottom: 1px solid var(--border);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: var(--secondary);
  }
`

export const TableHead = styled.th`
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
`

export const TableCell = styled.td`
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
`

export const TableFooter = styled.tfoot`
  background-color: var(--secondary);
  border-top: 1px solid var(--border);
`

export const TablePagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
`

export const TableActions = styled.div`
  display: flex;
  gap: 0.5rem;
`

