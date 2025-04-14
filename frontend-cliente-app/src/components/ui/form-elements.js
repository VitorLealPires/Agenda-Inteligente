// src/components/ui/form-elements.js
import styled from 'styled-components';

export const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledLabel = styled.label`
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

export const StyledInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const StyledTextarea = styled.textarea`
  padding: 0.5rem;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const StyledButton = styled.button`
  background-color: #0070f3;
  color: white;
  font-weight: bold;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #005bd1;
  }
`;
