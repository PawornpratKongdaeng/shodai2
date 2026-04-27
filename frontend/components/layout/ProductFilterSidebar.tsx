"use client";

import React from "react";

// สร้าง Interface สำหรับรับข้อมูล Category จาก API
interface Category {
  id: number;
  name: string;
  // หาก API คุณมีฟิลด์อื่น เช่น slug ก็สามารถเพิ่มได้
}

interface ProductFilterSidebarProps {
  categories: Category[];
}

export function ProductFilterSidebar({ categories }: ProductFilterSidebarProps) {
  return (
    <aside className="hidden md:block w-64 shrink-0">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sticky top-24">
        
        {/* หมวดหมู่สินค้า */}
        <div className="mb-6">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-4">หมวดหมู่สินค้า</h3>
          <div className="space-y-3">
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <label key={category.id} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    value={category.name}
                    className="w-4 h-4 rounded border-slate-300 text-[#FF4500] focus:ring-[#FF4500] cursor-pointer" 
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-[#FF4500] transition-colors">
                    {category.name}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">กำลังโหลดหมวดหมู่...</p>
            )}
          </div>
        </div>

        <div className="h-px w-full bg-slate-100 dark:bg-slate-800 my-6"></div>

        {/* ช่วงราคา */}
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-4">ช่วงราคา</h3>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              placeholder="ต่ำสุด" 
              className="w-full h-10 px-3 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-[#FF4500] focus:ring-1 focus:ring-[#FF4500] transition-all"
            />
            <input 
              type="number" 
              placeholder="สูงสุด" 
              className="w-full h-10 px-3 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-[#FF4500] focus:ring-1 focus:ring-[#FF4500] transition-all"
            />
          </div>
        </div>

      </div>
    </aside>
  );
}