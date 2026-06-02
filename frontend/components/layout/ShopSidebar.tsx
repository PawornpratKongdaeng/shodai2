import Link from "next/link";

// แถบหมวดหมู่ด้านข้างสำหรับหน้า shop ธีม Shodai
export function ShopSidebar({ categories = [] }: { categories: any[] }) {
  return (
    <aside className="shop-aside">
      <div className="shop-aside__head">หมวดหมู่สินค้า</div>
      <nav className="shop-aside__list">
        <Link href="/product">สินค้าทั้งหมด</Link>
        {categories.map((cat: any) => (
          <Link key={cat.id} href={`/category/${cat.slug}`}>
            <span>{cat.name}</span>
            <span aria-hidden="true">›</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
