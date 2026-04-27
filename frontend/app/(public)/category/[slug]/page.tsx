import { Filter, ArrowUpDown, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar"; 
import { Footer } from "@/components/layout/Footer"; 
import { ProductFilterSidebar } from "@/components/layout/ProductFilterSidebar"; 
import { ProductCard } from "@/components/layout/ProductCard";

// 1. ฟังก์ชันดึงสินค้าตามหมวดหมู่
async function getProductsByCategory(slug: string) {
  try {
    const res = await fetch(`https://25f2-49-48-32-134.ngrok-free.app/api/products?category=${encodeURIComponent(slug)}`, {
      cache: "no-store", 
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch products by category:", error);
    return [];
  }
}

// 2. ฟังก์ชันดึงข้อมูลหมวดหมู่เพื่อส่งให้ Sidebar
async function getCategories() {
  try {
    const res = await fetch("https://25f2-49-48-32-134.ngrok-free.app/api/categories", { 
      cache: "no-store" 
    });
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
  
  // แปลงค่า URL Encoded กลับเป็นภาษาไทย (ป้องกันชื่อหมวดหมู่แสดงเป็น %E0%B8...)
  const decodedSlug = decodeURIComponent(slug);

  // ดึงข้อมูลสินค้าและหมวดหมู่พร้อมกัน
  const [products, categories] = await Promise.all([
    getProductsByCategory(decodedSlug),
    getCategories()
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-6 py-8 w-full">
        {/* Header ส่วนหัวข้อหมวดหมู่ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
              หมวดหมู่: 
              <span className="text-[#FF4500]">
                {decodedSlug}
              </span>
            </h1>
            <p className="text-sm text-zinc-500 mt-2">
              สินค้าทั้งหมดในหมวดหมู่นี้ ({products.length} รายการ)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 gap-2 text-xs border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <ArrowUpDown size={14} />
              เรียงลำดับ
            </Button>
            {/* ปุ่ม Filter สำหรับ Mobile (เพราะ ProductFilterSidebar ซ่อนไว้ใน md:block) */}
            <Button variant="outline" size="sm" className="h-9 gap-2 text-xs border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 md:hidden">
              <Filter size={14} />
              ตัวกรอง
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* ✨ เรียกใช้ ProductFilterSidebar ตัวใหม่ของคุณ */}
          <ProductFilterSidebar categories={categories} />

          {/* รายการสินค้า */}
          <div className="flex-1">
            {products && products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* กรณีไม่พบสินค้า */
              <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-zinc-100 dark:border-zinc-700">
                  <LayoutGrid size={28} className="text-zinc-400" />
                </div>
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">ยังไม่มีสินค้าในหมวดหมู่นี้</h3>
                <p className="text-sm text-zinc-500 mt-2 max-w-xs leading-relaxed">
                  เรากำลังอัปเดตสินค้าใหม่ๆ เข้ามาเรื่อยๆ โปรดติดตามหรือเลือกดูหมวดหมู่ที่น่าสนใจอื่นๆ
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}