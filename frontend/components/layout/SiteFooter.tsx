import Link from "next/link";
import { LINE_URL, PHONE, PHONE_DISPLAY, LINE_ID } from "@/lib/shodai";

// Footer ธีม Shodai EV ใช้ร่วมกันทุกหน้า + ปุ่มเลื่อนขึ้นบน
export function SiteFooter() {
  return (
    <>
      <footer className="site-footer">
        <div className="sd-wrap footer-grid">
          <div>
            <img className="footer-logo" src="/shodai/shodai-logo.png" alt="Shodai Ev Shop" />
            <h2>Shodai Ev Shop</h2>
            <p>
              ศูนย์รวมอะไหล่รถยนต์คุณภาพสูง ทั้งอะไหล่แท้เดิมโรงงานและอะไหล่แต่งซิ่ง คัดสรรสิ่งที่ดีที่สุดเพื่อรถคุณ
            </p>
          </div>
          <div>
            <h3>เมนูลัด</h3>
            <Link href="/">หน้าแรก</Link>
            <Link href="/product">สินค้าทั้งหมด</Link>
            <Link href="/product">อะไหล่เดิม</Link>
            <Link href="/product">อะไหล่แต่ง</Link>
          </div>
          <div>
            <h3>ติดต่อเรา</h3>
            <a href={`tel:${PHONE}`}>{PHONE_DISPLAY}</a>
            <a href={LINE_URL} target="_blank" rel="noopener">
              {LINE_ID}
            </a>
          </div>
          <div>
            <h3>สอบถามด่วน?</h3>
            <p>หากหาสินค้าไม่เจอ หรือต้องการปรึกษาเรื่องอะไหล่ ทักแชทหาเราได้เลย</p>
            <a className="footer-cta" href={LINE_URL} target="_blank" rel="noopener">
              แอด LINE สอบถาม
            </a>
          </div>
        </div>
        <div className="sd-wrap footer-bottom">
          <p>© 2026 Shodai Ev Parts. All rights reserved.</p>
          <div>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>

      <button className="scroll-top" type="button" data-scroll-top aria-label="กลับขึ้นด้านบน"></button>

      <div className="contact-dock" aria-label="ติดต่อด่วน">
        <a className="contact-dock__btn contact-dock__btn--line" href={LINE_URL} target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3C6.5 3 2 6.6 2 11c0 4 3.7 7.3 8.7 7.9.3.1.8.2 1 .5.1.3.1.7.1 1l-.2 1.2c0 .4-.3 1.4 1.2.8 1.5-.6 8-4.7 10.9-8.1C25 11.9 25 11.5 25 11c0-4.4-4.5-8-10-8Z" />
          </svg>
          <span>แชท LINE</span>
        </a>
        <a className="contact-dock__btn contact-dock__btn--call" href={`tel:${PHONE}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5.3 4.3 8 3.7l2 4.5-1.4 1.1c1 2.1 2.6 3.7 4.7 4.7l1.1-1.4 4.6 2-.7 2.7c-.2.8-.9 1.3-1.7 1.2C9.7 18.1 5.9 14.3 5.1 7.4c-.1-.8.4-1.6 1.2-1.8Z" />
          </svg>
          <span>โทรเลย {PHONE_DISPLAY}</span>
        </a>
      </div>
    </>
  );
}
