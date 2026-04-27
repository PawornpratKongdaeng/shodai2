"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function HeroBanner({ banners = [] }: { banners: any[] }) {
  const [current, setCurrent] = useState(0);

  // เลื่อนภาพอัตโนมัติทุกๆ 5 วินาที
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  const hasBanners = banners.length > 0;

  return (
    // ✅ เอาการกำหนดความสูง (h-[...]) ออก เพื่อให้ Section ยืดหยุ่นตามขนาดรูปภาพ
    <section className="relative w-full overflow-hidden bg-slate-100 group flex items-center justify-center">
      
      {hasBanners ? (
        <div className="relative w-full">
          {banners.map((banner, index) => (
            <img
              key={banner.id || index}
              src={banner.image_url}
              alt={`Banner ${index + 1}`}
              // ✅ เทคนิค: รูปที่แสดงอยู่ให้เป็น relative เพื่อดันความสูงของกล่อง ส่วนรูปอื่นเป็น absolute ทับไว้
              className={`w-full h-auto object-cover transition-opacity duration-1000 ${
                index === current ? "opacity-100 relative z-10" : "opacity-0 absolute top-0 left-0 z-0"
              }`}
            />
          ))}
        </div>
      ) : (
        // Fallback กรณีที่ยังไม่ได้เพิ่มรูปภาพ
        <div className="w-full h-[300px] md:h-[400px] bg-gradient-to-br from-[#FF0000] via-[#FF4500] to-[#FF8C00]"></div>
      )}

      {/* ปุ่มลูกศรเลื่อนซ้าย-ขวา */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-[#FF4500] text-white p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20 backdrop-blur-sm"
          >
            <ChevronLeft size={32} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-[#FF4500] text-white p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20 backdrop-blur-sm"
          >
            <ChevronRight size={32} />
          </button>

          {/* จุดบอกตำแหน่ง (Dots) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all shadow-md ${idx === current ? "w-8 bg-[#FF4500]" : "w-2 bg-white/70 hover:bg-white"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}