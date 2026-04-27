"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Car, Wrench, Zap, Gauge, ShieldCheck, Cog, LayoutGrid, Component, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"; // เอา DialogTrigger ออกเพราะเราจะคุมเอง
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminAlert } from "@/lib/alert";

const ICON_MAP: Record<string, React.ElementType> = {
  Car, Wrench, Zap, Gauge, ShieldCheck, Cog, LayoutGrid
};

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("Car");
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("https://25f2-49-48-32-134.ngrok-free.app/api/categories");
      if (res.ok) setCategories(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number, catName: string) => {
    const isConfirm = await adminAlert.confirmDelete(catName);
    if (!isConfirm) return;

    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`https://25f2-49-48-32-134.ngrok-free.app/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });

      if (res.ok) {
        adminAlert.success("ลบสำเร็จ!", `ลบหมวดหมู่ ${catName} เรียบร้อยแล้ว`);
        fetchCategories(); 
      } else {
        // ลองอ่าน Error จาก Backend เผื่อบอกเหตุผลได้ชัดเจนขึ้น
        const errorData = await res.json().catch(() => ({}));
        adminAlert.error("ไม่สามารถลบได้", errorData.message || errorData.error || "อาจมีข้อมูลสินค้าที่เกี่ยวข้องกับหมวดหมู่นี้อยู่");
      }
    } catch (err) {
      console.error(err);
      adminAlert.error("ข้อผิดพลาดระบบ", "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };

  // ✨ ฟังก์ชันจัดการ State ของ Modal โดยเฉพาะ
  const handleModalChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingId(null);
      setName("");
      setIcon("Car");
    }
  };

  // ✨ ฟังก์ชันสำหรับกดปุ่ม "เพิ่มหมวดหมู่ใหม่"
  const openAddModal = () => {
    setEditingId(null);
    setName("");
    setIcon("Car");
    setIsModalOpen(true);
  };

  const handleEditClick = (cat: any) => {
    // ✨ ดักจับเผื่อ Go ส่งมาเป็น ID (พิมพ์ใหญ่) หรือ id (พิมพ์เล็ก)
    const currentId = cat.id || cat.ID; 
    
    setEditingId(currentId);
    setName(cat.name || cat.Name);
    setIcon(cat.icon || cat.Icon || "Car");
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("admin_token");
    const slug = name.trim().toLowerCase().replace(/\s+/g, '-');
    
    const method = editingId ? "PUT" : "POST";
    const url = editingId 
      ? `https://25f2-49-48-32-134.ngrok-free.app/api/admin/categories/${editingId}`
      : "https://25f2-49-48-32-134.ngrok-free.app/api/admin/categories";

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, slug, icon }), 
      });

      if (res.ok) {
        handleModalChange(false); // ปิด Modal และเคลียร์ค่า
        fetchCategories(); // โหลดข้อมูลตารางใหม่
        adminAlert.success("บันทึกข้อมูลสำเร็จ!", editingId ? "อัปเดตข้อมูลหมวดหมู่แล้ว" : "เพิ่มหมวดหมู่ใหม่เข้าระบบแล้ว");
      } else {
        // ✨ ดึง Error message จาก Backend ออกมาโชว์ จะได้รู้ว่าทำไมถึงเซฟไม่ผ่าน
        const errorData = await res.json().catch(() => ({}));
        console.error("API Error Response:", errorData);
        adminAlert.error("เกิดข้อผิดพลาด", errorData.message || errorData.error || "ไม่สามารถบันทึกข้อมูลได้ กรุณาตรวจสอบข้อมูล");
      }
    } catch (err) {
      console.error(err);
      adminAlert.error("ข้อผิดพลาดระบบ", "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">จัดการหมวดหมู่</h1>
        
        {/* ✨ แยกปุ่มออกมาเรียกใช้งาน openAddModal ตรงๆ ไม่ง้อ DialogTrigger */}
        <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto" onClick={openAddModal}>
          <PlusCircle className="mr-2 h-4 w-4" /> เพิ่มหมวดหมู่ใหม่
        </Button>
        
        {/* ✨ ใช้ onOpenChange คุม State ทั้งหมด */}
        <Dialog open={isModalOpen} onOpenChange={handleModalChange}>
          <DialogContent className="sm:max-w-[425px] w-[95vw]">
            <DialogHeader>
              <DialogTitle>{editingId ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่ใหม่"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">ชื่อหมวดหมู่</Label>
                <Input 
                  id="name" 
                  placeholder="เช่น ช่วงล่าง, เครื่องยนต์" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="icon">เลือกไอคอน</Label>
                <div className="flex gap-3 items-center">
                  <div className="p-2 border rounded-md bg-slate-50">
                    {(() => {
                      const SelectedIcon = ICON_MAP[icon] || Component;
                      return <SelectedIcon size={20} className="text-slate-700" />;
                    })()}
                  </div>
                  <select 
                    id="icon"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                  >
                    {Object.keys(ICON_MAP).map((iconName) => (
                      <option key={iconName} value={iconName}>{iconName}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => handleModalChange(false)}>ยกเลิก</Button>
              <Button onClick={handleSubmit} disabled={!name} className="bg-blue-600 hover:bg-blue-700 text-white">
                {editingId ? "อัปเดตข้อมูล" : "บันทึกข้อมูล"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <Table className="min-w-[500px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead className="w-[100px]">ไอคอน</TableHead>
                <TableHead>ชื่อหมวดหมู่</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat: any) => {
              const IconComp = ICON_MAP[cat.icon || cat.Icon] || Component;
              const currentId = cat.id || cat.ID; // ✨ ดึง ID
              const currentName = cat.name || cat.Name; // ✨ ดึง Name
              const currentSlug = cat.slug || cat.Slug; // ✨ ดึง Slug
              
              return (
                <TableRow key={currentId}>
                  <TableCell className="text-slate-500">{currentId}</TableCell>
                  <TableCell>
                    <div className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-md border border-slate-100">
                      <IconComp size={18} className="text-slate-600" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-700">{currentName}</TableCell>
                  <TableCell className="text-slate-500 font-mono text-xs">{currentSlug}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-amber-600 border-amber-200 hover:bg-amber-50"
                        onClick={() => handleEditClick(cat)}
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1" /> แก้ไข
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(currentId, currentName)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> ลบ
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-slate-400">
                    ไม่พบข้อมูลหมวดหมู่
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}