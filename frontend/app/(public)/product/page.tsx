import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ShopSidebar } from "@/components/layout/ShopSidebar";
import { ProductCardShodai } from "@/components/layout/ProductCardShodai";

interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  brand: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

async function getPageData(categoryFilter?: string) {
  try {
    const [resProducts, resCategories] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, { cache: "no-store" }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, { cache: "no-store" }),
    ]);

    let products: Product[] = [];
    let categories: Category[] = [];

    if (resCategories.ok) categories = await resCategories.json();

    if (resProducts.ok) {
      const allProducts: Product[] = await resProducts.json();
      products =
        categoryFilter && categoryFilter !== "all"
          ? allProducts.filter((p) => p.category?.toLowerCase() === categoryFilter.toLowerCase())
          : allProducts;
    }

    return { products, categories };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return { products: [], categories: [] };
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: activeCategory = "all" } = await searchParams;
  const { products, categories } = await getPageData(activeCategory);

  return (
    <div className="sd">
      <SiteHeader />

      <main id="main" className="shop-main">
        <div className="breadcrumb-bar">
          <div className="sd-wrap breadcrumb">
            <Link href="/">หน้าหลัก</Link>
            <span className="sep">›</span>
            <span className="current">สินค้าทั้งหมด</span>
          </div>
        </div>

        <div className="sd-wrap">
          <div className="page-head">
            <div>
              <h1>
                สินค้า<span className="accent">ทั้งหมด</span>
              </h1>
              <p>พบสินค้า {products.length} รายการ</p>
            </div>
          </div>

          <div className="shop-layout">
            <ShopSidebar categories={categories} />

            <div className="shop-content">
              {products.length === 0 ? (
                <div className="shop-empty">
                  <div className="shop-empty__icon">🔍</div>
                  <h3>ไม่พบสินค้าในหมวดหมู่นี้</h3>
                  <p>ลองเลือกหมวดหมู่ใหม่ หรือค้นหาด้วยคำค้นหาอื่นดูอีกครั้ง</p>
                  <Link className="button button--primary" href="/">
                    กลับหน้าหลัก
                  </Link>
                </div>
              ) : (
                <div className="item-grid">
                  {products.map((product) => (
                    <ProductCardShodai key={product.id} product={product} />
                  ))}
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
