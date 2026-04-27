import Link from "next/link";
import {
  Phone,
  MessageCircle,
  MapPin,
  Mail,
  ShieldCheck,
  Truck,
  Clock,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-slate-300">
      {/* 1. Benefits Bar - แถบไล่สีแดงส้ม */}
      <div className="bg-gradient-to-r from-[#FF0000] to-[#FF8C00] py-8 shadow-lg shadow-[#FF4500]/10">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center justify-center md:justify-start gap-4 text-white">
            <Truck className="text-white h-10 w-10 drop-shadow-md" />
            <div>
              <p className="font-black uppercase italic drop-shadow-sm text-lg">
                Fast Delivery
              </p>
              <p className="text-xs text-white/90 font-medium">
                จัดส่งด่วนทั่วไทย ได้รับสินค้าไวชัวร์
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4 text-white">
            <ShieldCheck className="text-white h-10 w-10 drop-shadow-md" />
            <div>
              <p className="font-black uppercase italic drop-shadow-sm text-lg">
                Genuine Parts
              </p>
              <p className="text-xs text-white/90 font-medium">
                รับประกันอะไหล่แท้ และคุณภาพสูง
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4 text-white">
            <Clock className="text-white h-10 w-10 drop-shadow-md" />
            <div>
              <p className="font-black uppercase italic drop-shadow-sm text-lg">
                Quick Support
              </p>
              <p className="text-xs text-white/90 font-medium">
                ปรึกษาอะไหล่ฟรี ตอบไวใน 15 นาที
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: About */}
          <div className="space-y-6">
            <Link
              href="/"
              className="text-2xl font-black text-white italic uppercase tracking-tighter flex gap-1.5"
            >
              SHODAI
              <span className="bg-gradient-to-r from-[#FF0000] to-[#FF8C00] text-transparent bg-clip-text">
                SHOP
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              ตัวแทนจำหน่ายอะไหล่รถยนต์ครบวงจร ทั้งปลีกและส่ง
              มีสต็อกพร้อมส่งสำหรับรถญี่ปุ่นทุกยี่ห้อ
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="bg-white/5 p-2 rounded-full hover:bg-gradient-to-r hover:from-[#FF0000] hover:to-[#FF8C00] hover:text-white transition-all border border-white/10 hover:border-transparent text-slate-400"
              >
                <MessageCircle size={20} />
              </Link>
            </div>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-white font-black uppercase italic mb-6 flex items-center gap-3">
              <div className="w-1.5 h-5 bg-gradient-to-b from-[#FF0000] to-[#FF8C00] rounded-full"></div>
              ติดต่อเรา
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 group">
                <MapPin
                  size={20}
                  className="text-[#FF4500] shrink-0 group-hover:text-[#FF0000] transition-colors"
                />
                <span className="group-hover:text-white transition-colors">
                  Rarm Intra 46 Alley, Lane 9, รามอินทรา Khan Na Yao, Bangkok
                  10230
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone
                  size={20}
                  className="text-[#FF4500] shrink-0 group-hover:text-[#FF0000] transition-colors"
                />
                <span className="font-bold text-white">099-556-6453</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail
                  size={20}
                  className="text-[#FF4500] shrink-0 group-hover:text-[#FF0000] transition-colors"
                />
                <span className="group-hover:text-white transition-colors">
                  LINE: @SHODAI
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust/Maps */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1 ">
            <h3 className="text-white font-black uppercase italic mb-6 flex items-center gap-3">
              <div className="w-1.5 h-5 bg-gradient-to-b from-[#FF0000] to-[#FF8C00] rounded-full"></div>
              หน้าร้านของเรา
            </h3>

            {/* กำหนดความสูงด้วย aspect-video (สัดส่วน 16:9) หรือกำหนดความสูงตายตัวเช่น h-[300px] */}
            <div className="rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 shadow-2xl border border-white/10 relative group aspect-video">
              {/* Layer สีแดงส้มอ่อนๆ ตอน Hover (ห้ามลบ pointer-events-none ไม่งั้นจะกดแผนที่ไม่ได้) */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF0000]/20 to-[#FF8C00]/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>

              {/* Iframe ของ Google Maps ที่ปรับเป็น JSX แล้ว */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.042850682325!2d100.6516393!3d13.8364655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d6304b7f189b3%3A0x311f8e5b9a27958f!2zc2hvZGFpZXYg4LiL4LmI4Lit4LihLeC4guC4suC4ouC4iOC4seC4geC4o-C4ouC4suC4meC5hOC4n-C4n-C5ieC4siAsIDPguKXguYnguK3guYTguJ_guJ_guYnguLIgLCDguKHguK3guYDguJXguK3guKPguYzguYTguIvguITguYzguYTguJ_guJ_guYnguLIgLCDguKrguIHguLnguYrguJXguYDguJXguK3guKPguYzguYTguJ_guJ_guYnguLI!5e0!3m2!1sen!2sth!4v1777219591696!5m2!1sen!2sth"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 z-0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Bar */}
      <div className="bg-black py-6 border-t border-white/5 relative overflow-hidden">
        {/* เส้นขอบบนไล่สี */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF4500]/50 to-transparent"></div>
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 text-center">
            © 2026 SHODAI SHOP - จำหน่ายอะไหล่ซิ่งเกรดพรีเมียม
          </p>
          <div className="flex gap-6">
            <img
              src="https://placehold.co/40/white/black?text=VISA"
              alt="Visa"
              className="h-4 opacity-50 grayscale hover:grayscale-0 cursor-help transition-all"
            />
            <img
              src="https://placehold.co/40/white/black?text=SCB"
              alt="SCB"
              className="h-4 opacity-50 grayscale hover:grayscale-0 cursor-help transition-all"
            />
            <img
              src="https://placehold.co/40/white/black?text=KBNK"
              alt="KBank"
              className="h-4 opacity-50 grayscale hover:grayscale-0 cursor-help transition-all"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
