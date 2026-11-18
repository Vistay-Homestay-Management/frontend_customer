import { useEffect, useState } from 'react'
import { useAuth } from 'react-oidc-context'
import { runtimeConfig } from './lib/runtimeConfig'

type LinkState = {
  linkId: string | null
  challengeId: string | null
  profileType: 'CUSTOMER' | 'HOST' | 'ADMIN'
  status: string
  maskedRecipient: string | null
  expiresAt: string | null
  requiresApproval: boolean
}

async function graphQl<T>(token: string, query: string, variables: Record<string, unknown>): Promise<T> {
  if (!token) throw new Error('Bạn cần đăng nhập trước khi liên kết hồ sơ.')
  const response = await fetch(runtimeConfig.graphqlUrl || import.meta.env.VITE_GRAPHQL_URL || '/graphql', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      'x-csrf-token': 'profile-link',
    },
    body: JSON.stringify({ query, variables }),
  })
  const payload = await response.json() as { data?: T; errors?: Array<{ message: string }> }
  if (!response.ok || payload.errors?.length) throw new Error(payload.errors?.[0]?.message ?? 'Không thể liên kết hồ sơ')
  if (!payload.data) throw new Error('Phản hồi liên kết hồ sơ không hợp lệ')
  return payload.data
}

export function ProfileLinking() {
  const auth = useAuth()
  const accessToken = auth.user?.access_token
  const [state, setState] = useState<LinkState | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [cccd, setCccd] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!accessToken) return
    void graphQl<{ myProfileLinkStatus: LinkState }>(
      accessToken,
      `query ProfileLinkStatus { myProfileLinkStatus { linkId challengeId profileType status maskedRecipient expiresAt requiresApproval } }`,
      {},
    ).then((result) => setState(result.myProfileLinkStatus)).catch((reason) => setError(reason instanceof Error ? reason.message : 'Không thể đọc trạng thái'))
  }, [accessToken])

  const requestLink = async () => {
    setBusy(true); setError('')
    try {
      const result = await graphQl<{ requestMyProfileLink: LinkState }>(
        accessToken!,
        `mutation RequestProfileLink($input: RequestProfileLinkInput!) {
          requestMyProfileLink(input: $input) { linkId challengeId profileType status maskedRecipient expiresAt requiresApproval }
        }`,
        { input: { displayName, cccd } },
      )
      setState(result.requestMyProfileLink)
      setCccd('')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể gửi yêu cầu')
    } finally { setBusy(false) }
  }

  const verify = async () => {
    if (!state?.challengeId) return
    setBusy(true); setError('')
    try {
      const result = await graphQl<{ verifyMyProfileLink: LinkState }>(
        accessToken!,
        `mutation VerifyProfileLink($input: VerifyProfileLinkInput!) {
          verifyMyProfileLink(input: $input) { linkId challengeId profileType status maskedRecipient expiresAt requiresApproval }
        }`,
        { input: { challengeId: state.challengeId, code } },
      )
      setState(result.verifyMyProfileLink)
      setCode('')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Mã xác nhận không hợp lệ')
    } finally { setBusy(false) }
  }

  if (!accessToken) return null
  if (state?.status === 'LINKED') return null

  return (
    <section className="profile-linking" aria-labelledby="profile-linking-title">
      <div>
        <span>XÁC MINH DANH TÍNH</span>
        <h2 id="profile-linking-title">Liên kết hồ sơ ViStay</h2>
        <p>CCCD chỉ được gửi để tạo HMAC và ciphertext trong Vault, không lưu bản rõ.</p>
      </div>
      {error && <p className="profile-linking-error">{error}</p>}
      {state?.status === 'APPROVAL_PENDING' ? (
        <p>Thông tin đã xác thực và đang chờ quản trị viên duyệt.</p>
      ) : state?.challengeId ? (
        <div className="profile-linking-form">
          <p>Mã xác nhận đã gửi tới <strong>{state.maskedRecipient}</strong>.</p>
          <input inputMode="numeric" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))} placeholder="Mã 6 chữ số" />
          <button disabled={busy || code.length !== 6} onClick={() => void verify()}>{busy ? 'Đang kiểm tra…' : 'Xác nhận'}</button>
        </div>
      ) : (
        <div className="profile-linking-form">
          <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Họ và tên" />
          <input inputMode="numeric" maxLength={12} value={cccd} onChange={(event) => setCccd(event.target.value.replace(/\D/g, ''))} placeholder="12 số CCCD" />
          <button disabled={busy || !displayName.trim() || cccd.length !== 12} onClick={() => void requestLink()}>{busy ? 'Đang xử lý…' : 'Liên kết hồ sơ'}</button>
        </div>
      )}
    </section>
  )
}
