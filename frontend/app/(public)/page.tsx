import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ProductCardShodai } from "@/components/layout/ProductCardShodai";
import { LINE_URL } from "@/lib/shodai";

// รูป hero สำรอง ใช้เมื่อยังไม่มี banner จากหลังบ้าน
const FALLBACK_HERO = [
  { src: "/shodai/shodai-big-banner.png", alt: "Shodai Ev Shop ศูนย์รวมอะไหล่รถยนต์ไฟฟ้า" },
  { src: "/shodai/shodai-secondary-banner.png", alt: "Shodai Ev Shop โปรโมชั่นอะไหล่แท้ศูนย์" },
  { src: "/shodai/shodai-byd-parts-banner.png", alt: "Shodai EV อะไหล่ BYD คุณภาพอันดับ 1" },
];

async function getData() {
  try {
    const [resProducts, resCategories, resBanners] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, { cache: "no-store" }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, { cache: "no-store" }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banners`, { cache: "no-store" }).catch(() => null),
    ]);
    let banners: any[] = [];
    if (resBanners && resBanners.ok) banners = await resBanners.json();
    return {
      products: (await resProducts.json()) || [],
      categories: (await resCategories.json()) || [],
      banners,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { products: [], categories: [], banners: [] };
  }
}

export default async function HomePage() {
  const { products, categories, banners } = await getData();

  const heroSlides =
    banners.length > 0
      ? banners.map((b: any) => ({ src: b.image_url, alt: b.title || "Shodai Ev Shop banner" }))
      : FALLBACK_HERO;

  const featured = (products as any[]).slice(0, 8);

  return (
    <div className="sd">
      <SiteHeader />

      <main id="main">
        <section className="hero" aria-label="Shodai Ev Shop hero">
          <div className="hero-slider" data-slider>
            <button className="hero-arrow hero-arrow--prev" type="button" data-slide-prev aria-label="ก่อนหน้า"></button>
            {heroSlides.map((slide, i) => (
              <div key={i} className={`hero-slide${i === 0 ? " is-active" : ""}`} data-slide>
                <picture>
                  <img src={slide.src} alt={slide.alt} />
                </picture>
              </div>
            ))}
            <button className="hero-arrow hero-arrow--next" type="button" data-slide-next aria-label="ถัดไป"></button>
            <div className="hero-dots" aria-hidden="true">
              {heroSlides.map((_, i) => (
                <span key={i} className={i === 0 ? "is-active" : ""} data-hero-dot></span>
              ))}
            </div>
          </div>
        </section>

        <section className="ev-showcase reveal" aria-label="Shodai EV product showcase">
          <div className="sd-wrap ev-showcase__inner">
            <div className="ev-showcase__copy">
              <span className="eyebrow">SHODAI EV PARTS</span>
              <h1>อะไหล่ EV ครบ จบในที่เดียว</h1>
              <p>เลือกอะไหล่แท้เดิมโรงงาน, OEM และอะไหล่แต่งซิ่งสำหรับรถคุณ พร้อมทักถามรุ่นที่ต้องการได้ทันที</p>
              <div className="showcase-actions">
                <Link className="button button--primary" href="/product">
                  เลือกชมสินค้าทั้งหมด
                </Link>
                <a className="button button--ghost" href={LINE_URL} target="_blank" rel="noopener">
                  ทัก LINE
                </a>
              </div>
            </div>

            <div className="ev-showcase__graphic" data-tilt-card>
              <div className="electric-path" aria-hidden="true"></div>
              <img className="graphic-logo" src="/shodai/IMG_3144-removebg-preview.png" alt="" />
              <img className="graphic-wide" src="/shodai/shodai-big-banner.png" alt="สินค้าอะไหล่ EV Shodai" />
              <img className="graphic-square" src="/shodai/PC.png" alt="โชว์เคสอะไหล่ EV Shodai" />
              <div className="brand-chips" aria-label="แบรนด์รถ EV">
                <span>NETA</span>
                <span>BYD</span>
                <span>AION</span>
                <span>TESLA</span>
                <span>DEEPAL</span>
                <span>GWM</span>
              </div>
            </div>
          </div>
        </section>

        <section className="promo-panels reveal">
          <div className="sd-wrap promo-panels__grid">
            <Link className="promo-card promo-card--genuine" href="/product">
              <img src="/shodai/Mobile.png" alt="อะไหล่เดิม Shodai Ev Shop" />
              <span>อะไหล่เดิม</span>
              <strong>อะไหล่แท้ศูนย์ 100% และ OEM</strong>
            </Link>
            <Link className="promo-card promo-card--upgrade" href="/product">
              <img src="/shodai/PC.png" alt="อะไหล่แต่ง Shodai Ev Shop" />
              <span>อะไหล่แต่ง</span>
              <strong>อัปเกรดประสิทธิภาพและรูปลักษณ์</strong>
            </Link>
          </div>
        </section>

        <section className="category-strip reveal" aria-label="หมวดหมู่สินค้า">
          <div className="sd-wrap category-strip__wrap">
            <button className="rail-arrow rail-arrow--prev" type="button" data-rail-prev aria-label="เลื่อนหมวดหมู่ก่อนหน้า"></button>
            <div className="category-rail" data-category-rail>
              {(categories as any[]).length > 0 ? (
                (categories as any[]).map((cat: any) => (
                  <Link className="cat-tile" key={cat.id} href={`/category/${cat.slug}`}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 15.5 8.5 20 20 8.5 17.5 6 8.5 15 6.5 13Z" />
                    </svg>
                    <span>{cat.name}</span>
                  </Link>
                ))
              ) : null}
              <Link className="cat-tile" href="/product">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 5h16M4 12h16M4 19h16" />
                </svg>
                <span>สินค้าทั้งหมด</span>
              </Link>
              <a className="cat-tile" href="#contact">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 5h16v12H8l-4 4Z" />
                </svg>
                <span>ติดต่อเรา</span>
              </a>
            </div>
            <button className="rail-arrow rail-arrow--next" type="button" data-rail-next aria-label="เลื่อนหมวดหมู่ถัดไป"></button>
          </div>
        </section>

        <section className="item-list reveal" aria-label="รายการสินค้า">
          <div className="sd-wrap">
            <div className="item-list__header">
              <div className="item-tabs" role="tablist" aria-label="รายการสินค้าแนะนำ">
                <button className="is-active" type="button" role="tab" aria-selected="true">
                  สินค้าแนะนำ
                </button>
                <button type="button" role="tab" aria-selected="false">
                  ขายดี
                </button>
                <button type="button" role="tab" aria-selected="false">
                  มาใหม่
                </button>
              </div>
              <div className="item-controls" aria-label="เลื่อนสินค้า">
                <button type="button" data-product-prev aria-label="สินค้าก่อนหน้า"></button>
                <button type="button" data-product-next aria-label="สินค้าถัดไป"></button>
              </div>
            </div>

            <div className="item-rail" data-product-rail>
              {featured.length === 0 ? (
                <p style={{ padding: "32px 4px", color: "var(--muted)" }}>ยังไม่มีสินค้าในขณะนี้</p>
              ) : (
                featured.map((p: any) => <ProductCardShodai key={p.id} product={p} />)
              )}
            </div>
          </div>
        </section>

        <section className="brand-band reveal">
          <div className="sd-wrap brand-band__inner">
            <h2>Shodai Ev Shop</h2>
            <p>
              ศูนย์รวมอะไหล่รถยนต์คุณภาพสูง ทั้งอะไหล่แท้เดิมโรงงาน และอะไหล่แต่งซิ่ง คัดสรรสิ่งที่ดีที่สุดเพื่อรถคุณ
            </p>
          </div>
        </section>

        <section className="why-section reveal">
          <div className="sd-wrap">
            <h2>ทำไมต้องเลือกซื้อสินค้ากับ Shodai Ev Shop ?</h2>
            <div className="gold-line"></div>
            <div className="why-grid">
              <article className="why-card reveal-item" style={{ "--delay": "0ms" } as React.CSSProperties}>
                <div className="why-card__icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 3 5 6v5c0 4.4 2.8 8.4 7 10 4.2-1.6 7-5.6 7-10V6Z" />
                  </svg>
                </div>
                <h3>อะไหล่แท้ศูนย์ 100%</h3>
                <p>คัดสรรอะไหล่เดิมโรงงานและอะไหล่ทดแทนมาตรฐาน OEM</p>
              </article>
              <article className="why-card reveal-item" style={{ "--delay": "90ms" } as React.CSSProperties}>
                <div className="why-card__icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m20 7-8 10-4-4-4 4" />
                  </svg>
                </div>
                <h3>อัปเกรดรถของคุณ</h3>
                <p>อะไหล่แต่งคุณภาพสูงสำหรับประสิทธิภาพและรูปลักษณ์</p>
              </article>
              <article className="why-card reveal-item" style={{ "--delay": "180ms" } as React.CSSProperties}>
                <div className="why-card__icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 17.3 18.2 21l-1.6-7 5.4-4.7-7.1-.6L12 2 9.1 8.7 2 9.3 7.4 14 5.8 21Z" />
                  </svg>
                </div>
                <h3>สอบถามง่าย</h3>
                <p>หากหาสินค้าไม่เจอ หรือต้องการปรึกษาเรื่องอะไหล่ ทักแชทหาเราได้เลย</p>
              </article>
            </div>
          </div>
        </section>

        <section className="info-section reveal">
          <div className="sd-wrap info-section__grid">
            <div>
              <h2>สินค้าครบวงจรที่สุด</h2>
              <p>Shodai Ev Parts พร้อมคัดสรรอะไหล่รถยนต์คุณภาพสูง ทั้งอะไหล่แท้เดิมโรงงานและอะไหล่แต่งซิ่ง</p>
            </div>
            <div>
              <h2>ราคาดี ทั้งปลีกและส่ง</h2>
              <p>เลือกชมสินค้าทั้งหมด หรือสอบถามราคาและรุ่นที่ต้องการได้ทันทีผ่าน LINE และโทรศัพท์</p>
            </div>
            <div>
              <h2>บริการโดยผู้เชี่ยวชาญ</h2>
              <p>ช่วยแนะนำเส้นทางเลือกสินค้าให้ตรงรุ่น ตรงงาน และเหมาะกับรถของคุณ</p>
            </div>
            <div>
              <h2>คุณภาพมั่นใจได้</h2>
              <p>อะไหล่แท้ศูนย์ 100%, OEM และอะไหล่แต่งคุณภาพสูงสำหรับรถของคุณ</p>
            </div>
          </div>
        </section>

        <section className="contact-band reveal" id="contact">
          <div className="sd-wrap contact-band__inner">
            <div>
              <h2>ติดต่อเรา - สอบถาม</h2>
              <p>สินค้าราคาเท่าไหร่ ใช้งานกับรถของท่านได้ไหม ?</p>
            </div>
            <a href={LINE_URL} target="_blank" rel="noopener">
              <span className="line-dot">LINE</span>
              LINE ID: @shodaievshop
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
