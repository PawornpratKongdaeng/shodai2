import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  ChevronRight,
  SlidersHorizontal,
  Search,
} from "lucide-react";
import { ProductFilterSidebar } from "@/components/layout/ProductFilterSidebar";
// ✨ Import ProductCard เข้ามาใช้งาน
import { ProductCard } from "@/components/layout/ProductCard";

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
}

// รวมฟังก์ชันดึงข้อมูล Product และ Category ไว้ด้วยกัน
async function getPageData(categoryFilter?: string) {
  try {
    const [resProducts, resCategories] = await Promise.all([
      fetch(`https://1a1d-49-48-32-150.ngrok-free.app/api/products`, { cache: "no-store" }),
      fetch(`https://1a1d-49-48-32-150.ngrok-free.app/api/categories`, { cache: "no-store" }),
    ]);

    let products: Product[] = [];
    let categories: Category[] = [];

    // ดึงข้อมูล Categories
    if (resCategories.ok) {
      categories = await resCategories.json();
    }

    // ดึงข้อมูล Products และทำการ Filter
    if (resProducts.ok) {
      const allProducts: Product[] = await resProducts.json();
      if (categoryFilter && categoryFilter !== "all") {
        products = allProducts.filter(
          (p) => p.category?.toLowerCase() === categoryFilter.toLowerCase(),
        );
      } else {
        products = allProducts;
      }
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

  // เรียกใช้งาน Data ทั้งสองส่วน
  const { products, categories } = await getPageData(activeCategory);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-[#FF4500] transition-colors">
              หน้าหลัก
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 dark:text-slate-100 font-medium">
              สินค้าทั้งหมด
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="md:hidden mb-6">
            <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900">
              <SlidersHorizontal size={16} />
              ตัวกรองสินค้า
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* ─── ส่ง Props categories ไปให้ Sidebar ─── */}
            <ProductFilterSidebar categories={categories} />

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  พบสินค้า {products.length} รายการ
                </h2>
              </div>

              {products.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 py-20 flex flex-col items-center justify-center text-center px-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    ไม่พบสินค้าในหมวดหมู่นี้
                  </h3>
                  <p className="text-slate-500 text-sm max-w-sm">
                    ลองเลือกหมวดหมู่ใหม่ หรือค้นหาด้วยคำค้นหาอื่นดูอีกครั้ง
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {/* ✨ เรียกใช้ ProductCard Component แทนโค้ดยาวๆ */}
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}