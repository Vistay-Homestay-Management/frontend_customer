import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client/react'
import './index.css'
import App from './App.tsx'
import { apolloClient } from './lib/apollo.ts'
import { PortalAuthProvider } from './lib/auth.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PortalAuthProvider>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </PortalAuthProvider>
  </StrictMode>,
)
