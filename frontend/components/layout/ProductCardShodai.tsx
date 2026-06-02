import Link from "next/link";
import { formatPrice } from "@/lib/shodai";

// การ์ดสินค้าแบบ Shodai (ใช้คลาส .item-card จากดีไซน์ใหม่) สำหรับหน้า grid
export function ProductCardShodai({ product }: { product: any }) {
  const slug = product.slug || product.id;
  return (
    <article className="item-card">
      <Link className="item-card__visual" href={`/product/${slug}`}>
        <button className="heart-button" type="button" aria-label="รายการโปรด"></button>
        <img className="part-photo" src={product.image_url || "/shodai/products/headlamp.png"} alt={product.name} />
      </Link>
      <Link className="item-card__button" href={`/product/${slug}`}>
        ดูสินค้า
      </Link>
      <div className="swatches">
        <span></span>
        <span></span>
      </div>
      <h3>{product.name}</h3>
      <p>{formatPrice(product.price)}</p>
    </article>
  );
}
