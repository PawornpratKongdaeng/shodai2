import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function CategorySidebar({ categories }: { categories: any[] }) {
  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="sticky top-24">
        {/* เปลี่ยนหัวเมนูเป็น Gradient แดง-ส้ม */}
        <div className="bg-gradient-to-r from-[#FF0000] to-[#FF8C00] text-white px-5 py-4 font-black text-lg uppercase italic shadow-md">
          หมวดหมู่สินค้า
        </div>
        <div className="bg-white border-x border-b shadow-md">
          {categories.map((cat: any) => (
            <Link 
              key={cat.id} 
              href={`/category/${cat.slug}`}
              className="flex justify-between items-center px-5 py-4 hover:bg-orange-50 transition-all border-b border-slate-100 group"
            >
              <span className="text-slate-700 font-bold text-[14px] group-hover:text-[#FF4500]">{cat.name}</span>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-[#FF4500] transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}