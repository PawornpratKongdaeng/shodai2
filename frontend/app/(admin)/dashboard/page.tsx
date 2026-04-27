"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ImageIcon, Package, DollarSign, Activity } from "lucide-react";

export default function Dashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();

  // ดึงข้อมูลสินค้ามาแสดงผลเท่านั้น
  const fetchProducts = () => {
    fetch("https://1a1d-49-48-32-150.ngrok-free.app/api/products")
      .then(res => res.json())
      .then(setProducts)
      .catch(err => console.error("ไม่สามารถเชื่อมต่อ API ได้", err));
  };

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchProducts();
  }, [router]);

  // คำนวณข้อมูลสรุปเบื้องต้น
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + Number(p.price || 0), 0);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">ภาพรวมระบบ (Dashboard)</h1>
        <p className="text-slate-500 mt-2">ข้อมูลสรุปสถิติและรายการสินค้าล่าสุด</p>
      </div>

      {/* --- Section 1: การ์ดสรุปข้อมูลสถิติ --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">สินค้าทั้งหมด</p>
            <h3 className="text-2xl font-bold text-slate-800">{totalProducts} <span className="text-sm font-normal text-slate-500">รายการ</span></h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">มูลค่าสินค้ารวมโดยประมาณ</p>
            <h3 className="text-2xl font-bold text-slate-800">฿{totalValue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">สถานะระบบ</p>
            <h3 className="text-2xl font-bold text-emerald-500">ปกติ (Online)</h3>
          </div>
        </div>
      </div>

      {/* --- Section 2: ตารางแสดงสินค้า (ดูได้อย่างเดียว) --- */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-lg md:text-xl font-semibold mb-6 text-slate-800">รายการสินค้าล่าสุด</h2>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="w-[80px]">รหัส</TableHead>
                <TableHead>รูปภาพ</TableHead>
                <TableHead>ชื่อสินค้า</TableHead>
                <TableHead>ราคา</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-slate-500">#{product.id}</TableCell>
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg bg-slate-100 border overflow-hidden flex items-center justify-center">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="text-slate-300 w-6 h-6" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700">{product.name}</TableCell>
                    <TableCell className="text-blue-600 font-bold">฿{Number(product.price).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-20 text-slate-400">ยังไม่มีข้อมูลสินค้าในระบบ</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}