import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'

const MY_LOYALTY = gql`query MyLoyaltyProfile { myLoyaltyProfile { status qualifyingPoints pointsToNextTier currentTier { displayName } nextTier { displayName } } }`
interface LoyaltyResult { myLoyaltyProfile: { status: string; qualifyingPoints: string; pointsToNextTier?: string | null; currentTier?: { displayName: string } | null; nextTier?: { displayName: string } | null } }

export function LoyaltyStatus() {
  const { data, loading, error } = useQuery<LoyaltyResult>(MY_LOYALTY, { skip: !sessionStorage.getItem('vistay.accessToken') })
  if (error || (!loading && !data)) return null
  const profile = data?.myLoyaltyProfile
  return <section className="story chapter" aria-label="Hạng thành viên">
    <div className="story-copy"><span>THÀNH VIÊN VISTAY</span><h2>{loading ? 'Đang xác định hạng…' : profile?.currentTier?.displayName ?? 'Thành viên mới'}</h2>
      <p>Điểm xét hạng chỉ dùng để xác định quyền lợi. Mốc hạng và thời gian hiệu lực do quản trị viên cấu hình.</p></div>
    {profile && <div className="story-stack"><article className="story-card"><span>Điểm xét hạng</span><strong>{profile.qualifyingPoints}</strong></article>
      <article className="story-card"><span>{profile.nextTier ? `Còn tới ${profile.nextTier.displayName}` : 'Hạng cao nhất hiện tại'}</span><strong>{profile.pointsToNextTier ?? '✓'}</strong></article></div>}
  </section>
}
