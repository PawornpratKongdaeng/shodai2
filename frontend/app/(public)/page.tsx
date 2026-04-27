import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/layout/ProductCard";
import { CategorySidebar } from "@/components/layout/CategorySidebar";
// นำเข้า HeroBanner ที่เราเพิ่งสร้าง
import { HeroBanner } from "@/components/layout/HeroSearch";

async function getData() {
  try {
    const [resProducts, resCategories, resBanners] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, { cache: 'no-store' }),
      // สมมติว่าฝั่ง Go มีเส้น API /api/banners (แบบไม่ต้องใช้ Token) สำหรับหน้าบ้าน
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banners`, { cache: 'no-store' }).catch(() => null)
    ]);
    
    // ป้องกันกรณีที่ API Banners ยังไม่พร้อม
    let banners = [];
    if (resBanners && resBanners.ok) {
      banners = await resBanners.json();
    }

    return { 
      products: await resProducts.json(), 
      categories: await resCategories.json(),
      banners 
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { products: [], categories: [], banners: [] };
  }
}

export default async function HomePage() {
  const { products, categories, banners } = await getData();

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar />

      {/* ส่งข้อมูลรูปภาพไปให้ HeroBanner ทำหน้าที่ Slider */}
      <HeroBanner banners={banners} />

      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          <CategorySidebar categories={categories} />

          <div className="flex-1">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-10 w-3 bg-gradient-to-b from-[#FF0000] to-[#FF8C00]"></div>
              <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">New Arrivals</h2>
              <div className="flex-grow h-[2px] bg-slate-100"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {products.length === 0 ? (
                 <p className="col-span-full text-center py-10 text-slate-500 italic">ไม่มีสินค้าในขณะนี้</p>
              ) : (
                products.map((p: any) => (
                  <ProductCard key={p.id} product={p} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
       <Footer />
    </div>
  );
}