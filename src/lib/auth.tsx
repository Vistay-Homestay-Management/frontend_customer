import { WebStorageStateStore } from 'oidc-client-ts'
import { AuthProvider } from 'react-oidc-context'
import type { PropsWithChildren } from 'react'

export function PortalAuthProvider({ children }: PropsWithChildren) {
  return (
    <AuthProvider
      authority={import.meta.env.VITE_OIDC_ISSUER ?? 'http://identity.localhost/realms/vistay-customer'}
      client_id={import.meta.env.VITE_OIDC_CLIENT_ID ?? 'vistay-customer-web'}
      redirect_uri={import.meta.env.VITE_OIDC_REDIRECT_URI ?? 'http://customer.localhost/oidc/callback'}
      post_logout_redirect_uri={import.meta.env.VITE_OIDC_POST_LOGOUT_REDIRECT_URI ?? 'http://customer.localhost/'}
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

