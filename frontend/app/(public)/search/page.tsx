import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar"; 
import { Footer } from "@/components/layout/Footer"; 
import { ProductFilterSidebar } from "@/components/layout/ProductFilterSidebar"; 
import { CategorySidebar } from "@/components/layout/CategorySidebar"; 

// 1. ฟังก์ชันดึงข้อมูลค้นหา
async function getSearchResults(query: string) {
  if (!query) return [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/search?q=${encodeURIComponent(query)}`, {
      cache: "no-store", 
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch search results:", error);
    return [];
  }
}

// 2. ฟังก์ชันดึงข้อมูลหมวดหมู่สำหรับ Sidebar
async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, { 
      cache: "no-store" 
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

// 3. หน้า SearchPage หลัก
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const searchQuery = q || "";

  // ดึงข้อมูลสินค้าและหมวดหมู่ไปพร้อมๆ กัน
  const [products, categories] = await Promise.all([
    getSearchResults(searchQuery),
    getCategories()
  ]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Header ส่วนหัวข้อการค้นหา */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
              ผลการค้นหาสำหรับ: 
              <span className="ml-2 bg-gradient-to-r from-[#FF0000] to-[#FF8C00] text-transparent bg-clip-text">
                "{searchQuery}"
              </span>
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              พบสินค้าทั้งหมด {products.length} รายการ
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 gap-2 text-xs border-zinc-200 dark:border-zinc-800">
              <ArrowUpDown size={14} />
              เรียงลำดับ
            </Button>
            <Button variant="outline" size="sm" className="h-9 gap-2 text-xs border-zinc-200 dark:border-zinc-800">
              <Filter size={14} />
              ตัวกรอง
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar หมวดหมู่ */}
          <div className="hidden lg:block w-full lg:w-72 shrink-0">
            <ProductFilterSidebar categories={categories} />
          </div>

          {/* รายการสินค้า */}
          <div className="flex-1">
            {products && products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                
                {/* ✨ เรียกใช้ ProductCard ตรงนี้และส่งข้อมูล product เข้าไป */}
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}

              </div>
            ) : (
              /* กรณีไม่พบสินค้า */
              <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-zinc-100 dark:border-zinc-700">
                  <Search size={28} className="text-zinc-400" />
                </div>
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">ไม่พบสินค้าที่ตรงกับการค้นหา</h3>
                <p className="text-sm text-zinc-500 mt-2 max-w-xs leading-relaxed">
                  ลองใช้คำค้นหาอื่นให้กว้างขึ้น หรือเลือกดูสินค้าจากหมวดหมู่ยอดนิยมของเรา
                </p>
                <Button 
                  asChild
                  className="mt-6 rounded-full px-6 bg-zinc-900 text-white hover:bg-[#FF4500] transition-colors"
                >
                  <Link href="/">กลับสู่หน้าหลัก</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ==========================================
// ✨ Component ProductCard ดีไซน์ใหม่ของคุณ
// ==========================================
interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const productSlug = product.slug || product.id;
  const originalPrice = Math.round(product.price * 1.25);

  return (
    <div className="group relative flex flex-col bg-white border border-slate-200 hover:border-[#FF4500]/50 hover:shadow-[0_4px_24px_rgba(255,69,0,0.08)] transition-all duration-300 overflow-hidden h-full">

      {/* ── Corner brackets ── */}
      <span className="pointer-events-none absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF4500] z-10" />
      <span className="pointer-events-none absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FF4500] z-10" />
      <span className="pointer-events-none absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FF4500] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
      <span className="pointer-events-none absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF4500] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

      {/* ── Image zone ── */}
      <Link href={`/product/${productSlug}`} className="relative aspect-square bg-slate-50 flex items-center justify-center p-4 overflow-hidden">
        {/* Grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#1a1a1a 1px,transparent 1px),linear-gradient(90deg,#1a1a1a 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Discount badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-[#FF4500] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            -20%
          </span>
        </div>

        <img
          src={product.image_url || "https://placehold.co/400x400/f8fafc/94a3b8?text=Product"}
          alt={product.name}
          className="relative z-10 w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
        />
      </Link>

      {/* ── Divider ── */}
      <div className="flex items-center px-4">
        <div className="flex-1 h-px bg-slate-200 group-hover:bg-[#FF4500]/25 transition-colors duration-300" />
        <div className="mx-2 w-1.5 h-1.5 rotate-45 bg-[#FF4500]/50" />
        <div className="flex-1 h-px bg-slate-200 group-hover:bg-[#FF4500]/25 transition-colors duration-300" />
      </div>

      {/* ── Content ── */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Product name */}
        <Link href={`/product/${productSlug}`}>
          <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight mb-3 group-hover:text-[#FF4500] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price + CTA */}
        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[15px] text-slate-400 line-through leading-none mb-1">
              ฿{originalPrice.toLocaleString()}
            </span>
            <span className="text-[24px] lg:text-[30px] font-black text-[#FF4500] leading-none">
              ฿{product.price.toLocaleString()}
            </span>
          </div>

          {/* View detail button */}
          <Link
            href={`/product/${productSlug}`}
            className="h-8 px-3 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:bg-[#FF4500] group-hover:text-white transition-colors whitespace-nowrap ml-2"
          >
            ดูรายละเอียด
          </Link>
        </div>
      </div>
    </div>
  );
}