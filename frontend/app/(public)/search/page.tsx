import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ShopSidebar } from "@/components/layout/ShopSidebar";
import { ProductCardShodai } from "@/components/layout/ProductCardShodai";

async function getSearchResults(query: string) {
  if (!query) return [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/search?q=${encodeURIComponent(query)}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch search results:", error);
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

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const searchQuery = q || "";

  const [products, categories] = await Promise.all([getSearchResults(searchQuery), getCategories()]);

  return (
    <div className="sd">
      <SiteHeader />

      <main id="main" className="shop-main">
        <div className="breadcrumb-bar">
          <div className="sd-wrap breadcrumb">
            <Link href="/">หน้าหลัก</Link>
            <span className="sep">›</span>
            <span className="current">ผลการค้นหา</span>
          </div>
        </div>

        <div className="sd-wrap">
          <div className="page-head">
            <div>
              <h1>
                ผลการค้นหา: <span className="accent">&ldquo;{searchQuery}&rdquo;</span>
              </h1>
              <p>พบสินค้าทั้งหมด {products.length} รายการ</p>
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
                  <div className="shop-empty__icon">🔍</div>
                  <h3>ไม่พบสินค้าที่ตรงกับการค้นหา</h3>
                  <p>ลองใช้คำค้นหาอื่นให้กว้างขึ้น หรือเลือกดูสินค้าจากหมวดหมู่ยอดนิยมของเรา</p>
                  <Link className="button button--primary" href="/">
                    กลับสู่หน้าหลัก
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
