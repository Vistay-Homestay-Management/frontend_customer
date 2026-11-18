import { WebStorageStateStore } from 'oidc-client-ts'
import { AuthProvider } from 'react-oidc-context'
import type { PropsWithChildren } from 'react'
import { runtimeConfig } from './runtimeConfig'

export function PortalAuthProvider({ children }: PropsWithChildren) {
  return (
    <AuthProvider
      authority={runtimeConfig.oidcIssuer || import.meta.env.VITE_OIDC_ISSUER || 'http://identity.localhost/realms/vistay-customer'}
      client_id={runtimeConfig.oidcClientId || import.meta.env.VITE_OIDC_CLIENT_ID || 'vistay-customer-web'}
      redirect_uri={runtimeConfig.oidcRedirectUri || import.meta.env.VITE_OIDC_REDIRECT_URI || `${window.location.origin}/oidc/callback`}
      post_logout_redirect_uri={runtimeConfig.oidcPostLogoutRedirectUri || import.meta.env.VITE_OIDC_POST_LOGOUT_REDIRECT_URI || `${window.location.origin}/`}
      response_type="code"
      scope="openid profile email"
      automaticSilentRenew
      userStore={new WebStorageStateStore({ store: window.sessionStorage })}
      onSigninCallback={() => window.history.replaceState({}, document.title, '/')}
    >
      {children}
    </AuthProvider>
  )
}

