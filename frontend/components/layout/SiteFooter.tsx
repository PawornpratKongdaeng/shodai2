import Link from "next/link";
import { LINE_URL, PHONE, PHONE_DISPLAY, LINE_ID } from "@/lib/shodai";

// Footer ธีม Shodai EV ใช้ร่วมกันทุกหน้า + ปุ่มเลื่อนขึ้นบน
export function SiteFooter() {
  return (
    <>
      <footer className="site-footer">
        <div className="sd-wrap footer-grid">
          <div>
            <img className="footer-logo" src="/shodai/IMG_3144-removebg-preview.png" alt="Shodai Ev Shop" />
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
    </>
  );
}
