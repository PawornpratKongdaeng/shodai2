import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Phone, ChevronRight, ShieldCheck, Truck, RotateCcw, Star } from "lucide-react";
import Link from "next/link";

// นำเข้า Navbar และ Footer (ปรับ path ให้ตรงกับโปรเจกต์ของคุณ)
import { Navbar } from "@/components/layout/Navbar"; 
import { Footer } from "@/components/layout/Footer";

async function getProduct(slug: string) {
  const safeSlug = encodeURIComponent(decodeURIComponent(slug));
const res = await fetch(`https://25f2-49-48-32-134.ngrok-free.app/api/products/${safeSlug}`, {
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

  // กรณีไม่พบสินค้า
  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
            <ShoppingCart className="w-7 h-7 text-slate-400" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              ไม่พบสินค้าที่คุณต้องการ
            </h2>
            <p className="text-slate-500 text-sm max-w-xs">
              สินค้าชิ้นนี้อาจถูกลบออกไปแล้ว หรือ URL ไม่ถูกต้อง
            </p>
          </div>
          <Button asChild className="rounded-full px-6 bg-gradient-to-r from-[#FF0000] to-[#FF8C00] hover:brightness-110 text-white border-none">
            <Link href="/">กลับหน้าหลัก</Link>
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  const originalPrice = Math.round(product.price * 1.25);
  const skuCode = product.id?.toString().padStart(6, "0") ?? "000000";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* ─── Breadcrumb ─── */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-[#FF4500] transition-colors">หน้าหลัก</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/product" className="hover:text-[#FF4500] transition-colors">สินค้าทั้งหมด</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 dark:text-slate-100 font-medium line-clamp-1 max-w-[200px]">
              {product.name}
            </span>
          </div>
        </div>

        {/* ─── Main content ─── */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-8 lg:gap-12 items-start">

            {/* ── Left: Image Panel ── */}
            <div className="relative">
              {/* Main image card */}
              <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 aspect-square flex items-center justify-center group shadow-sm">
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(0,0,0,.3) 39px,rgba(0,0,0,.3) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(0,0,0,.3) 39px,rgba(0,0,0,.3) 40px)",
                  }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,69,0,0.03)_0%,transparent_70%)]" />

                <img
                  src={product.image_url || "https://placehold.co/600x600/f8fafc/94a3b8?text=No+Image"}
                  alt={product.name}
                  className="relative z-10 max-w-[78%] max-h-[78%] object-contain drop-shadow-xl group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                />

                {/* Discount pill */}
                <div className="absolute top-4 left-4 z-20">
                  <Badge className="bg-gradient-to-r from-[#FF0000] to-[#FF8C00] hover:from-[#FF0000] hover:to-[#FF8C00] text-white text-xs font-bold px-3 py-1 rounded-lg border-none shadow-lg">
                    ลด 20%
                  </Badge>
                </div>
              </div>

              {/* Trust badges row */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { icon: ShieldCheck, label: "รับประกัน", sub: "1 ปีเต็ม" },
                  { icon: Truck, label: "ส่งด่วน", sub: "ทั่วประเทศ" },
                  { icon: RotateCcw, label: "คืนสินค้า", sub: "ภายใน 30 วัน" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 py-3 px-2 text-center shadow-sm hover:border-[#FF4500]/30 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-[#FF4500]" />
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-none">
                      {label}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-none">{sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Product Info ── */}
            <div className="flex flex-col gap-6">

              {/* SKU + Category */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[11px] font-semibold text-slate-400 tracking-widest uppercase">
                  SKU #{skuCode}
                </span>
                {product.category && (
                  <>
                    <span className="text-slate-300 dark:text-slate-600">·</span>
                    <Badge
                      variant="outline"
                      className="text-[11px] font-medium rounded-md border-slate-300 dark:border-slate-700 text-slate-500"
                    >
                      {product.category}
                    </Badge>
                  </>
                )}
                {product.brand && (
                  <>
                    <span className="text-slate-300 dark:text-slate-600">·</span>
                    <Badge className="text-[11px] font-bold rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-none hover:bg-slate-800">
                      {product.brand}
                    </Badge>
                  </>
                )}
              </div>

              {/* Product name */}
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-50 leading-tight tracking-tight">
                {product.name}
              </h1>

              {/* Rating stub */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < 4 ? "fill-[#FF8C00] text-[#FF8C00]" : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500 font-medium">4.0 (124 รีวิว)</span>
              </div>

              {/* Price block */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-black text-[#FF4500] tracking-tight leading-none">
                    ฿{product.price.toLocaleString()}
                  </span>
                  <div className="flex flex-col mb-1">
                    <span className="text-sm text-slate-400 line-through leading-none">
                      ฿{originalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#FF4500] font-semibold leading-none mt-1">
                      ประหยัด ฿{(originalPrice - product.price).toLocaleString()}
                    </span>
                  </div>
                </div>

                <Separator className="my-4 bg-slate-100 dark:bg-slate-800" />

                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    มีสินค้าพร้อมส่ง
                  </span>
                  <span className="text-xs text-slate-400 ml-auto">* ยังไม่รวมค่าจัดส่ง</span>
                </div>
              </div>

              {/* ─── รายละเอียดสินค้า (เพิ่มส่วนที่คุณต้องการ) ─── */}
              <div className="space-y-4 pt-2">
                <ul className="space-y-3 text-[15px] text-slate-600 dark:text-slate-300">
                  {product.brand && (
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                      <div><strong className="text-slate-900 dark:text-slate-100 font-bold">ยี่ห้อ:</strong> {product.brand}</div>
                    </li>
                  )}
                  {product.compatible_models && (
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                      <div><strong className="text-slate-900 dark:text-slate-100 font-bold">รุ่นรถที่รองรับ:</strong> {product.compatible_models}</div>
                    </li>
                  )}
                  {product.product_type && (
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                      <div><strong className="text-slate-900 dark:text-slate-100 font-bold">ประเภทสินค้า:</strong> {product.product_type}</div>
                    </li>
                  )}
                  {product.features && (
                    <li className="flex items-start gap-2.5">
                      {/* ไฮไลท์จุดสีส้มสำหรับคุณสมบัติ เพื่อให้ดูโดดเด่นขึ้น */}
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF4500] mt-2 shrink-0" />
                      <div>
                        <strong className="text-slate-900 dark:text-slate-100 font-bold">รายละเอียดสินค้า:</strong>{" "}
                        <span className="whitespace-pre-wrap">{product.features}</span>
                      </div>
                    </li>
                  )}
                </ul>

                {/* แสดง Description ปกติ (ถ้ามี) ต่อท้ายรายการ */}
                {product.description && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    {product.description}
                  </p>
                )}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  size="lg"
                  className="flex-1 h-13 py-4 rounded-xl  bg-[#06C755] hover:brightness-110 text-white font-bold text-sm tracking-wide uppercase transition-all duration-200 shadow-md shadow-[#FF4500]/20 border-none gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  ติดต่อ Line:@SHODAI
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="sm:w-auto h-13 py-4 px-6 rounded-xl border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#FF4500] hover:text-[#FF4500] dark:hover:border-[#FF4500] dark:hover:text-[#FF4500] hover:bg-orange-50 dark:hover:bg-[#FF4500]/10 font-bold text-sm tracking-wide uppercase transition-all duration-200 gap-2"
                >
                  <Phone className="w-4 h-4" />
                  สอบถาม
                </Button>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}