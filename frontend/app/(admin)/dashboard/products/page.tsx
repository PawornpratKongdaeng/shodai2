"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ImagePlus, PlusCircle, Loader2, Edit, Trash2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea"; // (ถ้ามีก็ใช้ได้เลย)
import { adminAlert } from "@/lib/alert"; // ✨ Import Alert ของเราเข้ามา

export default function ManageProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({ 
    name: "", 
    price: "", 
    image_url: "", 
    category_id: "",
    brand: "",              
    compatible_models: "",  
    product_type: "",       
    features: "",           
  });
  
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchProducts();
    fetchCategories();
  }, [router]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
      if (res.ok) setCategories(await res.json());
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("image", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/upload`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("admin_token")}` },
        body: data,
      });
      const result = await res.json();
      if (res.ok) {
        setFormData({ ...formData, image_url: result.image_url });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: "", price: "", image_url: "", category_id: "",
      brand: "", compatible_models: "", product_type: "", features: ""
    });
    setEditingId(null);
  };

  const handleModalChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) resetForm();
  };

  const handleEditClick = (product: any) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      image_url: product.image_url || "",
      category_id: product.category_id ? product.category_id.toString() : "",
      brand: product.brand || "",
      compatible_models: product.compatible_models || "",
      product_type: product.product_type || "",
      features: product.features || ""
    });
    setEditingId(product.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("admin_token");
    const generateSlug = formData.name.trim().toLowerCase().replace(/\s+/g, '-');

    const isEditing = editingId !== null;
    const url = isEditing 
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/products/${editingId}` 
      : `${process.env.NEXT_PUBLIC_API_URL}/api/admin/products`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price) || 0,
          slug: generateSlug,
          category_id: parseInt(formData.category_id) || 1
        }),
      });

      if (res.ok) {
        setIsModalOpen(false); // 1. สั่งปิด Modal ทันที
        resetForm();
        fetchProducts(); 
        
        // ✨ 2. หน่วงเวลา 500ms ให้ Modal ปิดสนิทก่อน แล้วค่อยโชว์ Alert
        setTimeout(() => {
          adminAlert.success(
            "บันทึกข้อมูลสำเร็จ!", 
            isEditing ? "อัปเดตข้อมูลสินค้าแล้ว" : "เพิ่มสินค้าใหม่เข้าระบบแล้ว"
          );
        }, 500);

      } else {
        // กรณี Error ก็ใช้ setTimeout ป้องกันไว้เหมือนกัน
        setTimeout(() => {
          adminAlert.error("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้ กรุณาตรวจสอบข้อมูลอีกครั้ง");
        }, 500);
      }
    } catch (err) {
      console.error(err);
      adminAlert.error("ข้อผิดพลาดระบบ", "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };

  // ✨ สร้างฟังก์ชันลบสินค้าที่เรียกใช้ confirmDelete
  const handleDelete = async (id: number, name: string) => {
    const isConfirm = await adminAlert.confirmDelete(name);
    
    if (isConfirm) {
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.ok) {
          adminAlert.success("ลบสำเร็จ!", `ลบสินค้า ${name} ออกจากระบบแล้ว`);
          fetchProducts(); // โหลดข้อมูลตารางใหม่
        } else {
          adminAlert.error("ไม่สามารถลบได้", "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์");
        }
      } catch (err) {
        console.error(err);
        adminAlert.error("ข้อผิดพลาดระบบ", "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      }
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : "ไม่ระบุ";
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">จัดการสินค้า</h1>
        
        <Dialog open={isModalOpen} onOpenChange={handleModalChange}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto" onClick={resetForm}>
              <PlusCircle className="mr-2 h-4 w-4" /> เพิ่มสินค้าใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
            <DialogHeader>
              <DialogTitle>{editingId ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">ชื่อสินค้า *</Label>
                <Input 
                  id="name" 
                  placeholder="เช่น TYC ไฟหน้า ISUZU MUX" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">หมวดหมู่ *</Label>
                <select 
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                >
                  <option value="" disabled>-- เลือกหมวดหมู่ --</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price">ราคา (บาท) *</Label>
                <Input 
                  id="price" 
                  type="number"
                  placeholder="เช่น 1900" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand">ยี่ห้อ (Brand)</Label>
                <Input 
                  id="brand" 
                  placeholder="เช่น TYC, แท้ศูนย์" 
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="product_type">ประเภทสินค้า</Label>
                <Input 
                  id="product_type" 
                  placeholder="เช่น ไฟหน้า โปรเจคเตอร์" 
                  value={formData.product_type}
                  onChange={(e) => setFormData({...formData, product_type: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="compatible_models">รุ่นรถที่รองรับ</Label>
                <Input 
                  id="compatible_models" 
                  placeholder="เช่น ISUZU MU-X ปี 2014-2017" 
                  value={formData.compatible_models}
                  onChange={(e) => setFormData({...formData, compatible_models: e.target.value})}
                />
              </div>

              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="features">รายละเอียดสินค้า (Description)</Label>
                <textarea 
                  id="features" 
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="เช่น เลนส์ใสพิเศษ ลำแสงคมชัด ติดตั้งเข้ารูปสนิท 100% รับประกัน 6 เดือน" 
                  value={formData.features}
                  onChange={(e) => setFormData({...formData, features: e.target.value})}
                />
              </div>

              <div className="grid gap-2 md:col-span-2">
                <Label>รูปภาพสินค้า</Label>
                <div className="flex flex-col items-center gap-3 border-2 border-dashed p-4 rounded-lg">
                  {formData.image_url ? (
                    <img src={formData.image_url} alt="Preview" className="h-40 object-contain" />
                  ) : (
                    <ImagePlus className="h-10 w-10 text-slate-400" />
                  )}
                  <Input type="file" className="hidden" id="product-up" onChange={handleImageUpload} />
                  <Label htmlFor="product-up" className="cursor-pointer text-blue-600 hover:underline">
                    {uploading ? "กำลังอัปโหลด..." : "คลิกเพื่อเลือกรูปภาพ"}
                  </Label>
                </div>
              </div>

            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>ยกเลิก</Button>
              <Button onClick={handleSubmit} disabled={uploading || !formData.name || !formData.price || !formData.category_id} className="bg-blue-600">
                {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingId ? "อัปเดตสินค้า" : "บันทึกสินค้า"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
        {/* ✨ เพิ่ม overflow-x-auto ตรงนี้เพื่อให้ตารางเลื่อนได้ในมือถือ */}
        <div className="overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead>รูปภาพ</TableHead>
                <TableHead>ชื่อสินค้า</TableHead>
                <TableHead>ยี่ห้อ</TableHead>
                <TableHead>หมวดหมู่</TableHead>
                <TableHead>ราคา</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                    ยังไม่มีข้อมูลสินค้า
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product: any) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="h-12 w-12 object-cover rounded border" />
                      ) : (
                        <div className="h-12 w-12 bg-slate-100 flex items-center justify-center rounded border text-xs text-slate-400">ไม่มีรูป</div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate" title={product.name}>{product.name}</TableCell>
                    <TableCell>{product.brand || "-"}</TableCell>
                    <TableCell>{getCategoryName(product.category_id)}</TableCell>
                    <TableCell>฿{Number(product.price).toLocaleString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        onClick={() => handleEditClick(product)}
                      >
                        <Edit className="w-4 h-4 mr-1" /> แก้ไข
                      </Button>
                      {/* ✨ ผูกฟังก์ชัน handleDelete เข้ากับปุ่มลบ */}
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(product.id, product.name)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> ลบ
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}