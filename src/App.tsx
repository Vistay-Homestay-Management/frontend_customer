import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, CalendarBlank, MapPin, Users } from '@phosphor-icons/react'
import './App.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const stays = [
  { name: 'Sông Hàn Loft', copy: 'Ánh sáng dịu, bếp mở và nhịp sống ven sông ngay ngoài khung cửa.', image: 'https://picsum.photos/seed/vistay-river-loft/1400/1000' },
  { name: 'Sơn Trà House', copy: 'Một khoảng nghỉ yên tĩnh giữa thành phố, dành cho những chuyến đi dài.', image: 'https://picsum.photos/seed/vistay-son-tra/1400/1000' },
  { name: 'An Thượng Studio', copy: 'Đi bộ ra biển, trở về một không gian gọn gàng và đầy đủ.', image: 'https://picsum.photos/seed/vistay-coastal-studio/1400/1000' },
]

function App() {
  const root = useRef<HTMLElement>(null)
  const [activeStay, setActiveStay] = useState(0)

  useGSAP(() => {
    gsap.from('.hero-copy > *', { y: 42, opacity: 0, stagger: 0.1, duration: 0.9, ease: 'power3.out' })
    gsap.utils.toArray<HTMLElement>('.reveal-media').forEach((element) => {
      gsap.fromTo(element, { scale: 0.82, opacity: 0.35 }, {
        scale: 1, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: element, start: 'top 88%', end: 'center 45%', scrub: true },
      })
    })
    gsap.utils.toArray<HTMLElement>('.story-card').forEach((card, index) => {
      gsap.to(card, {
        y: index * -22,
        scrollTrigger: { trigger: '.story-stack', start: 'top+=' + index * 80 + ' 60%', end: 'bottom 48%', scrub: true },
      })
    })
  }, { scope: root })

  return (
    <main ref={root} className="site-shell">
      <nav className="nav" aria-label="Điều hướng chính">
        <a className="brand" href="#top" aria-label="ViStay trang chủ">ViStay<span>.</span></a>
        <div className="nav-links"><a href="#stays">Không gian</a><a href="#promise">Trải nghiệm</a></div>
        <a className="nav-action" href="#search">Đặt chỗ</a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <h1>Ở như người bản địa, <span className="inline-image" role="img" aria-label="Không gian lưu trú ViStay" /> nhớ như một chuyến đi.</h1>
          <p>Những căn hộ được chăm chút tại Đà Nẵng, đặt nhanh và hỗ trợ xuyên suốt hành trình.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#search">Tìm căn phù hợp <ArrowRight weight="bold" /></a>
            <a className="button button-secondary" href="#stays">Khám phá bộ sưu tập</a>
          </div>
        </div>
        <figure className="hero-visual reveal-media">
          <img src="https://picsum.photos/seed/vistay-da-nang-home/1600/1300" alt="Phòng khách sáng và thoáng của ViStay" />
          <figcaption><strong>Đà Nẵng, Việt Nam</strong><span>Không gian được kiểm định trực tiếp</span></figcaption>
        </figure>
      </section>

      <section className="search-panel" id="search" aria-label="Tìm chỗ ở">
        <label><MapPin /><span>Điểm đến</span><input defaultValue="Đà Nẵng" aria-label="Điểm đến" /></label>
        <label><CalendarBlank /><span>Ngày ở</span><input type="date" aria-label="Ngày nhận phòng" /></label>
        <label><Users /><span>Khách</span><input type="number" min="1" defaultValue="2" aria-label="Số khách" /></label>
        <button type="button">Xem căn trống</button>
      </section>

      <section className="chapter" id="stays">
        <div className="section-heading">
          <h2>Mỗi nơi ở có một nhịp riêng.</h2>
          <p>Chọn theo cách bạn muốn sống trong thành phố, không chỉ theo số phòng ngủ.</p>
        </div>
        <div className="stay-accordion">
          {stays.map((stay, index) => (
            <article key={stay.name} className={index === activeStay ? 'stay active' : 'stay'} onMouseEnter={() => setActiveStay(index)} onFocus={() => setActiveStay(index)} tabIndex={0}>
              <img src={stay.image} alt="" />
              <div><h3>{stay.name}</h3><p>{stay.copy}</p><a href="#search">Xem lịch trống <ArrowRight /></a></div>
            </article>
          ))}
        </div>
      </section>

      <section className="chapter promise" id="promise">
        <div className="section-heading"><h2>Một kỳ nghỉ nhẹ đầu từ lúc đặt đến lúc rời đi.</h2></div>
        <div className="bento">
          <article className="bento-main reveal-media">
            <span>Hỗ trợ trong suốt thời gian ở</span>
            <h3>Một đầu mối, luôn nắm rõ căn hộ của bạn.</h3>
            <p>Tin nhắn, hướng dẫn nhận phòng và các yêu cầu phát sinh được nối trong cùng một hành trình.</p>
          </article>
          <article className="bento-image reveal-media"><img src="https://picsum.photos/seed/vistay-texture-linen/1000/1200" alt="Chi tiết nội thất ấm áp" /></article>
          <article className="bento-wide">
            <div><strong>Rõ ràng</strong><span>Giá và chính sách trước khi xác nhận</span></div>
            <div><strong>Thật</strong><span>Ảnh và tiện nghi được kiểm định</span></div>
            <div><strong>Liền mạch</strong><span>Cập nhật trạng thái theo thời gian thực</span></div>
          </article>
        </div>
      </section>

      <section className="story chapter">
        <div className="story-copy">
          <h2>Thành phố mở ra theo cách riêng của bạn.</h2>
          <p>Từ một buổi sáng ven biển đến bữa tối muộn bên sông, ViStay giữ phần lưu trú đơn giản để bạn dành thời gian cho chuyến đi.</p>
        </div>
        <div className="story-stack">
          {['biển Mỹ Khê', 'chợ Hàn', 'bán đảo Sơn Trà'].map((place, index) => (
            <article className="story-card" key={place}><span>Gần {place}</span><strong>{12 + index * 8} phút</strong></article>
          ))}
        </div>
      </section>

      <section className="marquee" aria-label="Giá trị ViStay"><div>ĐẶT NHANH — HỖ TRỢ THẬT — Ở THẬT THOẢI MÁI — ĐẶT NHANH — HỖ TRỢ THẬT —</div></section>
      <footer>
        <div><h2>Sẵn sàng tìm căn cho chuyến đi tiếp theo?</h2><a className="button button-light" href="#search">Bắt đầu tìm kiếm <ArrowRight /></a></div>
        <p>ViStay Homestay Management · Đà Nẵng</p>
      </footer>
    </main>
  )
}

export default App
