import Link from "next/link";

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const productSlug = product.slug || product.id;
  const originalPrice = Math.round(product.price * 1.25);

  return (
    <div className="group relative flex flex-col bg-white border border-slate-200 hover:border-[#FF4500]/50 hover:shadow-[0_4px_24px_rgba(255,69,0,0.08)] transition-all duration-300 overflow-hidden">

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

        {/* Discount badge — matches listing page */}
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
        {/* Product name — matches listing page */}
        <Link href={`/product/${productSlug}`}>
          <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight mb-3 group-hover:text-[#FF4500] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price + CTA — matches listing page */}
        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[15px] text-slate-400 line-through leading-none mb-1">
              ฿{originalPrice.toLocaleString()}
            </span>
            <span className="text-[20px] font-black text-[#FF4500] leading-none">
              ฿{product.price.toLocaleString()}
            </span>
          </div>

          {/* View detail button */}
          <Link
            href={`/product/${productSlug}`}
            className="h-8 px-3 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:bg-[#FF4500] group-hover:text-white transition-colors"
          >
            ดูรายละเอียด
          </Link>
        </div>
      </div>
    </div>
  );
}