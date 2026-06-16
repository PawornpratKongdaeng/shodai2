// ค่าคงที่ร้าน Shodai EV ใช้ร่วมกันทุกหน้า
export const LINE_URL = "https://line.me/R/ti/p/@shodaiev";
export const LINE_ID = "@shodaievshop";
export const PHONE = "0995566453";
export const PHONE_DISPLAY = "099-556-6453";

export function formatPrice(price: number) {
  return `฿${Number(price || 0).toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
