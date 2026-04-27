"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function SearchButton() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false); // ปิด Modal
      // นำคำค้นหาไปใส่ใน URL Param เช่น /search?q=ไฟหน้า
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery(""); // เคลียร์ช่องค้นหา
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* นำปุ่มของคุณมาใส่ไว้ตรงนี้ */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-md text-zinc-500 hover:text-[#FF4500] hover:bg-[#FF4500]/10 dark:hover:text-[#FF4500] dark:hover:bg-[#FF4500]/10 transition-colors"
          aria-label="ค้นหา"
        >
          <Search size={16} />
          
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ค้นหาสินค้า</DialogTitle>
        </DialogHeader>
        {/* ฟอร์มรับค่าการค้นหา */}
        <form onSubmit={handleSearch} className="flex gap-2 mt-4">
          <Input
            placeholder="พิมพ์ชื่อสินค้า, ยี่ห้อ, รุ่นรถ..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus // ให้เคอร์เซอร์โฟกัสช่องพิมพ์ทันทีที่เปิด Modal
          />
          <Button type="submit" className="bg-[#FF4500] hover:bg-[#FF4500]/90 text-white">
            ค้นหา
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}