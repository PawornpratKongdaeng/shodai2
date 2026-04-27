import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // ✨ แก้จุดนี้: เปลี่ยนเป็น flex-col md:flex-row และใส่ w-full
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 w-full overflow-hidden">
      
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden overflow-y-auto">
        {children}
      </main>
      
    </div>
  );
}