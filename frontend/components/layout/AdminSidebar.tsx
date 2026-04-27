"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Image as ImageIcon, 
  LogOut, 
  Settings, 
  Book,
  Menu,
  X
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "แดชบอร์ด", href: "/dashboard", icon: LayoutDashboard },
    { name: "จัดการสินค้า", href: "/dashboard/products", icon: Package },
    { name: "จัดการหมวดหมู่", href: "/dashboard/categories", icon: Book },
    { name: "จัดการแบนเนอร์", href: "/dashboard/banners", icon: ImageIcon },
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/login";
  };

  return (
    <>
      {/* 📱 Mobile Top Bar (แสดงเฉพาะบนมือถือ) */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 text-white p-4 shrink-0">
        <h2 className="text-xl font-bold tracking-wider">
      SHODAI<span className="text-blue-500">ADMINPANEL</span>
        </h2>
        <button 
          onClick={() => setIsMobileMenuOpen(true)} 
          className="p-1 hover:bg-slate-800 rounded-md transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* 🌑 Overlay พื้นหลังสีดำจางๆ เวลาเปิดเมนูบนมือถือ */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 🖥️ Sidebar ตัวหลัก */}
      <aside 
        className={`
          fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 z-50 
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-6 flex justify-between items-center border-b md:border-none border-slate-800">
          <h2 className="text-2xl font-bold text-white tracking-wider">
             SHODAI<span className="text-blue-500 flex ">ADMIN PANEL</span>
          </h2>
          {/* ปุ่มปิด (X) แสดงเฉพาะมือถือ */}
          <button 
            className="md:hidden p-1 text-slate-400 hover:text-white rounded-md transition-colors" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                onClick={() => setIsMobileMenuOpen(false)} // กดเลือกเมนูแล้วให้ปิด Sidebar อัตโนมัติในมือถือ
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>
    </>
  );
}