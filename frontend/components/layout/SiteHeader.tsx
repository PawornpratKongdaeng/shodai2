import Link from "next/link";
import { HomeInteractions } from "@/components/layout/HomeInteractions";
import { LINE_URL, PHONE, PHONE_DISPLAY, LINE_ID } from "@/lib/shodai";

// Header ธีม Shodai EV ใช้ร่วมกันทุกหน้า (top-strip + header + nav + mobile drawer)
export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#main">
        ข้ามไปยังเนื้อหา
      </a>

      <div className="top-strip">
        <div className="sd-wrap top-strip__inner">
          <span>หาอะไหล่ไม่เจอ ? สอบถามง่ายๆที่</span>
          <a href={LINE_URL} target="_blank" rel="noopener">
            LINE: {LINE_ID}
          </a>
          <span>โทร</span>
          <a href={`tel:${PHONE}`}>{PHONE_DISPLAY}</a>
        </div>
      </div>

      <header className="site-header" data-header>
        <div className="header-main">
          <div className="sd-wrap header-main__inner">
            <Link className="brand" href="/" aria-label="Shodai Ev Shop">
              <img src="/shodai/shodai-logo.png" alt="Shodai Ev Shop" />
            </Link>

            <form className="search-box" action="/search" role="search">
              <label className="sr-only" htmlFor="site-search">
                ค้นหาสินค้า
              </label>
              <input id="site-search" type="search" name="q" placeholder="ค้นหาสินค้าที่นี่..." />
              <button type="submit" aria-label="ค้นหา">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m21 21-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" />
                </svg>
              </button>
            </form>

            <div className="header-tools" aria-label="เครื่องมือด่วน">
              <Link href="/product" aria-label="สินค้าทั้งหมด">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
                <span>สินค้าทั้งหมด</span>
              </Link>
              <a href={`tel:${PHONE}`} aria-label="โทรหาเรา">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5.3 4.3 8 3.7l2 4.5-1.4 1.1c1 2.1 2.6 3.7 4.7 4.7l1.1-1.4 4.6 2-.7 2.7c-.2.8-.9 1.3-1.7 1.2C9.7 18.1 5.9 14.3 5.1 7.4c-.1-.8.4-1.6 1.2-1.8Z" />
                </svg>
                <span>โทร</span>
              </a>
            </div>

            <button className="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu">
              <span></span>
              <span></span>
              <span></span>
              <span className="sr-only">เปิดเมนู</span>
            </button>
          </div>
        </div>

        <nav className="nav-bar" aria-label="เมนูหลัก">
          <div className="sd-wrap nav-bar__inner">
            <Link href="/">หน้าแรก</Link>
            <Link href="/product">สินค้าทั้งหมด</Link>
            <Link href="/product">อะไหล่เดิม</Link>
            <Link href="/product">อะไหล่แต่ง</Link>
            <a href="#contact">ติดต่อเรา</a>
            <a className="nav-cta" href={LINE_URL} target="_blank" rel="noopener">
              สอบถาม LINE ID: {LINE_ID}
            </a>
          </div>
        </nav>

        <div className="mobile-menu" id="mobile-menu" data-mobile-menu>
          <Link href="/">หน้าแรก</Link>
          <Link href="/product">สินค้าทั้งหมด</Link>
          <Link href="/product">อะไหล่เดิม</Link>
          <Link href="/product">อะไหล่แต่ง</Link>
          <a href="#contact">ติดต่อเรา</a>
          <a className="mobile-menu__cta" href={LINE_URL} target="_blank" rel="noopener">
            ทักแชทสอบถามเลย
          </a>
        </div>
      </header>

      <HomeInteractions />
    </>
  );
}
