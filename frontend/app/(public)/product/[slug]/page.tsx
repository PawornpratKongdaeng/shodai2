import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LINE_URL, PHONE, formatPrice } from "@/lib/shodai";

async function getProduct(slug: string) {
  const safeSlug = encodeURIComponent(decodeURIComponent(slug));
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${safeSlug}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return (
      <div className="sd">
        <SiteHeader />
        <main id="main" className="shop-main">
          <div className="sd-wrap" style={{ padding: "64px 0" }}>
            <div className="shop-empty">
              <div className="shop-empty__icon">🛒</div>
              <h3>ไม่พบสินค้าที่คุณต้องการ</h3>
              <p>สินค้าชิ้นนี้อาจถูกลบออกไปแล้ว หรือ URL ไม่ถูกต้อง</p>
              <Link className="button button--primary" href="/">
                กลับหน้าหลัก
              </Link>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const originalPrice = Math.round(product.price * 1.25);
  const skuCode = product.id?.toString().padStart(6, "0") ?? "000000";

  const specs = [
    product.brand && { label: "ยี่ห้อ", value: product.brand },
    product.compatible_models && { label: "รุ่นรถที่รองรับ", value: product.compatible_models },
    product.product_type && { label: "ประเภทสินค้า", value: product.product_type },
    product.features && { label: "รายละเอียดสินค้า", value: product.features },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="sd">
      <SiteHeader />

      <main id="main" className="shop-main">
        <div className="breadcrumb-bar">
          <div className="sd-wrap breadcrumb">
            <Link href="/">หน้าหลัก</Link>
            <span className="sep">›</span>
            <Link href="/product">สินค้าทั้งหมด</Link>
            <span className="sep">›</span>
            <span className="current">{product.name}</span>
          </div>
        </div>

        <div className="sd-wrap pdp">
          <div className="pdp__grid">
            {/* Gallery */}
            <div>
              <div className="pdp__gallery">
                <span className="item-badge">ลด 20%</span>
                <img
                  src={product.image_url || "/shodai/products/headlamp.png"}
                  alt={product.name}
                />
              </div>
              <div className="pdp__trust">
                <div>
                  <strong>รับประกัน</strong>
                  <span>1 ปีเต็ม</span>
                </div>
                <div>
                  <strong>ส่งด่วน</strong>
                  <span>ทั่วประเทศ</span>
                </div>
                <div>
                  <strong>คืนสินค้า</strong>
                  <span>ภายใน 30 วัน</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="pdp__meta">
                <span style={{ letterSpacing: "0.12em", fontWeight: 700 }}>SKU #{skuCode}</span>
                {product.category && <span className="pdp__chip pdp__chip--cat">{product.category}</span>}
                {product.brand && <span className="pdp__chip pdp__chip--brand">{product.brand}</span>}
              </div>

              <h1 className="pdp__title">{product.name}</h1>

              <div className="pdp__price-box">
                <div className="pdp__price">
                  <b>{formatPrice(product.price)}</b>
                  <del>{formatPrice(originalPrice)}</del>
                </div>
                <div className="pdp__stock">
                  <i></i>
                  มีสินค้าพร้อมส่ง
                  <span style={{ marginLeft: "auto", color: "var(--muted)", fontWeight: 400, fontSize: 12 }}>
                    * ยังไม่รวมค่าจัดส่ง
                  </span>
                </div>
              </div>

              {specs.length > 0 && (
                <ul className="pdp__specs">
                  {specs.map((s) => (
                    <li key={s.label}>
                      <div>
                        <strong>{s.label}:</strong> {s.value}
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {product.description && <p className="pdp__desc">{product.description}</p>}

              <div className="pdp__actions">
                <a className="button button--line" href={LINE_URL} target="_blank" rel="noopener">
                  ติดต่อ LINE: @shodaievshop
                </a>
                <a className="button button--outline" href={`tel:${PHONE}`}>
                  โทรสอบถาม
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
