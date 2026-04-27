"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ImagePlus, PlusCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ title: "", link: "", image_url: "" });
  
  const router = useRouter();

  // ฟังก์ชันอัปโหลดรูป (เรียกใช้ API ที่เราทำไว้คราวก่อน)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("image", file);

    try {
      const res = await fetch("https://1a1d-49-48-32-150.ngrok-free.app/api/admin/upload", {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("admin_token")}` },
        body: data,
      });
      const result = await res.json();
      if (res.ok) {
        setFormData({ ...formData, image_url: result.image_url });
        alert("อัปโหลดรูปสำเร็จ!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch("https://1a1d-49-48-32-150.ngrok-free.app/api/admin/banners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newBanner = await res.json();
        setBanners([newBanner, ...banners]); // อัปเดตตารางทันที
        setIsModalOpen(false); // ปิด Modal
        setFormData({ title: "", link: "", image_url: "" }); // ล้างค่าในฟอร์ม
        alert("เพิ่มแบนเนอร์สำเร็จ!");
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">จัดการแบนเนอร์</h1>
        
        {/* --- ส่วนของ Modal Form --- */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="mr-2 h-4 w-4" /> เพิ่มแบนเนอร์ใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>รายละเอียดแบนเนอร์</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">ชื่อแบนเนอร์</Label>
                <Input 
                  id="title" 
                  placeholder="เช่น โปรโมชั่นหน้าร้อน" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="link">ลิงก์เมื่อคลิก (ถ้ามี)</Label>
                <Input 
                  id="link" 
                  placeholder="https://..." 
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label>รูปภาพแบนเนอร์</Label>
                <div className="flex flex-col items-center gap-3 border-2 border-dashed p-4 rounded-lg">
                  {formData.image_url ? (
                    <img src={formData.image_url} alt="Preview" className="h-32 object-contain" />
                  ) : (
                    <ImagePlus className="h-10 w-10 text-slate-400" />
                  )}
                  <Input type="file" className="hidden" id="banner-up" onChange={handleImageUpload} />
                  <Label htmlFor="banner-up" className="cursor-pointer text-blue-600 hover:underline">
                    {uploading ? "กำลังอัปโหลด..." : "คลิกเพื่อเลือกรูปภาพ"}
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>ยกเลิก</Button>
              <Button onClick={handleSubmit} disabled={uploading || !formData.image_url}>
                {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                บันทึกข้อมูล
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* --------------------------- */}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รูปภาพ</TableHead>
              <TableHead>ชื่อแบนเนอร์</TableHead>
              <TableHead>ลิงก์</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-slate-500">
                  ยังไม่มีข้อมูลแบนเนอร์
                </TableCell>
              </TableRow>
            ) : (
              banners.map((banner: any, index: number) => (
                <TableRow key={banner.id || index}>
                  <TableCell>
                    <img 
                      src={banner.image_url} 
                      alt={banner.title} 
                      className="h-16 w-32 object-cover rounded border border-slate-200" 
                      onError={(e) => { e.currentTarget.src = "https://placehold.co/300x150?text=Image" }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{banner.title}</TableCell>
                  <TableCell>
                    {banner.link ? (
                      <a href={banner.link} target="_blank" className="text-blue-500 hover:underline">
                        ดูลิงก์
                      </a>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="destructive" size="sm" onClick={async () => {
                      if(confirm("ต้องการลบแบนเนอร์นี้ใช่ไหม?")) {
                        const token = localStorage.getItem("admin_token");
                        await fetch(`http://localhost:8080/api/admin/banners/${banner.id}`, {
                          method: "DELETE",
                          headers: { "Authorization": `Bearer ${token}` }
                        });
                        setBanners(banners.filter((b: any) => b.id !== banner.id));
                      }
                    }}>
                      ลบ
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}