"use client"; // บังคับให้ไฟล์นี้เป็น Client Component เพื่อใช้ onClick ได้

import { ShoppingCart } from "lucide-react";

export function AddToCartButton() {
  return (
    <button 
      className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-[#FF4500] group-hover:text-white transition-colors"
      onClick={(e) => {
        e.preventDefault(); // ป้องกันไม่ให้กดแล้วเปลี่ยนหน้าตาม <Link>
        // ใส่ Logic เพิ่มลงตะกร้าตรงนี้ได้เลยในอนาคต เช่น alert("เพิ่มลงตะกร้าแล้ว");
      }}
    >
      <ShoppingCart size={14} />
    </button>
  );
}