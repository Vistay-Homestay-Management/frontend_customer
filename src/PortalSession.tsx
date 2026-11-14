import { useEffect } from 'react'
import { useAuth } from 'react-oidc-context'

export function PortalSession() {
  const auth = useAuth()
  useEffect(() => {
    if (auth.user?.access_token) sessionStorage.setItem('vistay.accessToken', auth.user.access_token)
    else sessionStorage.removeItem('vistay.accessToken')
  }, [auth.user?.access_token])

  if (auth.isLoading) return <div className="portal-session">Đang kiểm tra phiên đăng nhập…</div>
  if (auth.error) return <div className="portal-session error">{auth.error.message}</div>
  if (!auth.isAuthenticated) {
    return <div className="portal-session"><span>Đăng nhập để quản lý và liên kết hồ sơ.</span><button onClick={() => void auth.signinRedirect()}>Đăng nhập</button><button className="secondary" onClick={() => void auth.signinRedirect({ extraQueryParams: { kc_action: 'register' } })}>Tạo tài khoản</button></div>
  }
  return <div className="portal-session"><span>{auth.user?.profile.email as string}</span><button className="secondary" onClick={() => void auth.signoutRedirect()}>Đăng xuất</button></div>
}

