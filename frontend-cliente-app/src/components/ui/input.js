"use client"

import styled from "styled-components"

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`

export const Input = styled.input`
  width: 100%;
  height: 2.5rem;
  padding: 0 0.75rem;
  background-color: var(--background);
  border: 1px solid var(--input);
  border-radius: var(--radius);
  color: var(--foreground);
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  
  &:focus {
    outline: none;
    border-color: var(--ring);
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const Select = styled.select`
  width: 100%;
  height: 2.5rem;
  padding: 0 0.75rem;
  background-color: var(--background);
  border: 1px solid var(--input);
  border-radius: var(--radius);
  color: var(--foreground);
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  
  &:focus {
    outline: none;
    border-color: var(--ring);
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 6rem;
  padding: 0.75rem;
  background-color: var(--background);
  border: 1px solid var(--input);
  border-radius: var(--radius);
  color: var(--foreground);
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--ring);
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const HelperText = styled.p`
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: var(--foreground);
  opacity: 0.7;
`

export const ErrorText = styled.p`
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: #e53e3e;
`

