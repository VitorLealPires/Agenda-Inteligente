"use client"

import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
  :root {
    --background: #ffffff;
    --foreground: #1a1a1a;
    --card-background: #f8f9fa;
    --primary: #0070f3;
    --primary-foreground: #ffffff;
    --secondary: #f5f5f5;
    --secondary-foreground: #1a1a1a;
    --accent: #e6f0ff;
    --border: #e2e8f0;
    --input: #e2e8f0;
    --ring: #0070f3;
    --radius: 0.5rem;
    --header-height: 60px;
  }

  .dark {
    --background: #121212;
    --foreground: #f8f9fa;
    --card-background: #1e1e1e;
    --primary: #0070f3;
    --primary-foreground: #ffffff;
    --secondary: #2d2d2d;
    --secondary-foreground: #f8f9fa;
    --accent: #1a365d;
    --border: #2d2d2d;
    --input: #2d2d2d;
    --ring: #0070f3;
  }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  html,
  body {
    max-width: 100vw;
    overflow-x: hidden;
    background-color: var(--background);
    color: var(--foreground);
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button, input, select, textarea {
    font-family: inherit;
  }
`

export default GlobalStyle

