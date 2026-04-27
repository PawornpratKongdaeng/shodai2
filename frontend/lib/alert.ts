import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const adminAlert = {
  // แจ้งเตือนสำเร็จ
  success: (title: string, text?: string) => {
    return MySwal.fire({
      icon: 'success',
      title: title,
      text: text,
      confirmButtonColor: '#2563eb', // สีปุ่มน้ำเงิน
      confirmButtonText: 'ตกลง',
    });
  },

  // แจ้งเตือนผิดพลาด
  error: (title: string, text?: string) => {
    return MySwal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonColor: '#ef4444', // สีปุ่มแดง
      confirmButtonText: 'ปิด',
    });
  },

  // แจ้งเตือนยืนยันการลบ (คืนค่ากลับมาเป็น boolean ว่ากด Yes หรือ No)
  confirmDelete: async (itemName: string = 'ข้อมูลนี้') => {
    const result = await MySwal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: `ต้องการลบ "${itemName}" ใช่ไหม? (ไม่สามารถกู้คืนได้)`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก',
    });
    
    return result.isConfirmed; // คืนค่า true ถ้ากด "ใช่, ลบเลย!"
  }
};