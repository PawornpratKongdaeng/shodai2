import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ShopSidebar } from "@/components/layout/ShopSidebar";
import { ProductCardShodai } from "@/components/layout/ProductCardShodai";

async function getProductsByCategory(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?category=${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch products by category:", error);
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const [products, categories] = await Promise.all([
    getProductsByCategory(decodedSlug),
    getCategories(),
  ]);

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
            <span className="current">{decodedSlug}</span>
          </div>
        </div>

        <div className="sd-wrap">
          <div className="page-head">
            <div>
              <h1>
                หมวดหมู่: <span className="accent">{decodedSlug}</span>
              </h1>
              <p>สินค้าทั้งหมดในหมวดหมู่นี้ ({products.length} รายการ)</p>
            </div>
          </div>

          <div className="shop-layout">
            <ShopSidebar categories={categories} />

            <div className="shop-content">
              {products && products.length > 0 ? (
                <div className="item-grid">
                  {products.map((product: any) => (
                    <ProductCardShodai key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="shop-empty">
                  <div className="shop-empty__icon">▦</div>
                  <h3>ยังไม่มีสินค้าในหมวดหมู่นี้</h3>
                  <p>เรากำลังอัปเดตสินค้าใหม่ๆ เข้ามาเรื่อยๆ โปรดติดตามหรือเลือกดูหมวดหมู่ที่น่าสนใจอื่นๆ</p>
                  <Link className="button button--primary" href="/product">
                    ดูสินค้าทั้งหมด
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
