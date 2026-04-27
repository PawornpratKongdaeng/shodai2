"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; // ✨ เพิ่ม useRouter สำหรับจัดการค้นหา
import { Phone, MessageCircle, Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input"; // ✨ นำเข้า Input ของ shadcn

const NAV_LINKS = [
  { label: "หน้าแรก", href: "/" },
  { label: "สินค้าหลังหมด", href: "/product" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  
  // ✨ State สำหรับเก็บคำค้นหา
  const [query, setQuery] = useState("");
  const router = useRouter();

  // ✨ ฟังก์ชันจัดการเมื่อกด Enter หรือคลิกแว่นขยาย
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setOpen(false); // ปิดเมนูมือถือ (ถ้าเปิดอยู่)
    }
  };

  return (
    <header className="w-full">
      <div className="bg-gradient-to-r from-[#FF0000] to-[#FF8C00] border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-9 flex items-center justify-center">
          <div className="flex items-center gap-4 text-[11px] font-medium text-zinc-400">
            <a 
              href="tel:0995566453" 
              className="flex items-center gap-1.5 group cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Phone size={11} className="text-gray-800" />
              <span className="text-gray-800">099-556-6453</span>
            </a>

            <Separator orientation="vertical" className="h-3 bg-zinc-700" />
            
            <a 
              href="https://line.me/R/ti/p/@shodaishop" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 group cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img 
                src="/LINE_New_App_Icon_(2020-12).png" 
                alt="Line Logo" 
                className="w-3.5 h-3.5 object-contain" 
              />
              <span className="text-gray-800">Line:@shodaishop</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Main nav bar ── */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-[60px] flex items-center gap-4">

          {/* Logo */}
          <Link href="/" className="flex flex-col shrink-0 mr-1 group">
            <img src="/IMG_3144-removebg-preview.png" alt="SHODAI SHOP Logo" width={120} height={30} className="object-contain w-[180px] h-[60px]" />
          </Link>

          <Separator orientation="vertical" className="h-7 hidden lg:block bg-zinc-200 dark:bg-zinc-700" />

          {/* Desktop links */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 rounded-md text-[12.5px] font-bold uppercase tracking-wide text-zinc-600 dark:text-zinc-400 hover:text-[#FF4500] dark:hover:text-[#FF4500] hover:bg-gradient-to-r hover:from-[#FF0000]/5 hover:to-[#FF8C00]/5 dark:hover:from-[#FF0000]/10 dark:hover:to-[#FF8C00]/10 transition-all duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-2 lg:gap-3">
            
            {/* ✨ Searchbar สำหรับ Desktop (ซ่อนในมือถือ) ✨ */}
            <form onSubmit={handleSearch} className="relative hidden md:flex items-center w-48 lg:w-64">
              <Input
                type="text"
                placeholder="ค้นหาสินค้า..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pr-9 h-8 text-xs bg-zinc-100 dark:bg-zinc-800 border-transparent focus-visible:ring-1 focus-visible:ring-[#FF4500] rounded-full transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 text-zinc-400 hover:text-[#FF4500] transition-colors"
                aria-label="ค้นหา"
              >
                <Search size={14} />
              </button>
            </form>
            
            <Separator orientation="vertical" className="h-5 hidden sm:block bg-zinc-200 dark:bg-zinc-700 mx-1" />

            <Button className="hidden sm:flex items-center gap-2 h-8 px-4 rounded-full bg-[#06C755] hover:bg-[#05af4a] text-white font-bold text-[11px] uppercase tracking-wider border-none shadow-none transition-colors">
              <MessageCircle size={13} />
              LINE: @SHODAI
            </Button>

            {/* Mobile sheet */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-8 w-8 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <Menu size={18} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 p-0 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-[15px] font-black uppercase tracking-tight text-zinc-900 dark:text-white flex gap-1">
                    SHODAI 
                    <span className="bg-gradient-to-r from-[#FF0000] to-[#FF8C00] text-transparent bg-clip-text">
                      SHOP
                    </span>
                  </span>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:text-[#FF4500] hover:bg-[#FF4500]/10" onClick={() => setOpen(false)}>
                    <X size={15} />
                  </Button>
                </div>

                {/* ✨ Searchbar สำหรับ Mobile ✨ */}
                <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                  <form onSubmit={handleSearch} className="relative flex items-center">
                    <Input
                      type="text"
                      placeholder="ค้นหาสินค้า..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pr-9 h-9 text-sm bg-zinc-100 dark:bg-zinc-800 border-transparent focus-visible:ring-1 focus-visible:ring-[#FF4500]"
                    />
                    <button
                      type="submit"
                      className="absolute right-3 text-zinc-400 hover:text-[#FF4500] transition-colors"
                    >
                      <Search size={16} />
                    </button>
                  </form>
                </div>

                <nav className="flex flex-col py-2 flex-1 overflow-y-auto">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="px-5 py-3 text-[13px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300 hover:text-[#FF4500] dark:hover:text-[#FF4500] hover:bg-gradient-to-r hover:from-[#FF0000]/5 hover:to-[#FF8C00]/5 dark:hover:from-[#FF0000]/10 dark:hover:to-[#FF8C00]/10 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto">
                  <Separator className="bg-zinc-100 dark:bg-zinc-800" />
                  <div className="px-5 py-4 space-y-3">
                    <Button className="w-full h-9 rounded-md bg-[#06C755] hover:bg-[#05af4a] text-white font-bold text-xs gap-2 border-none">
                      <MessageCircle size={14} />
                      LINE: @SHODAI
                    </Button>
                    <span className="flex items-center justify-center gap-2 text-[11px] text-zinc-500">
                      <Phone size={11} className="text-[#FF4500]" />
                      099-556-6453
                    </span>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}