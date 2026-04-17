"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function NavbarCart() {
  const { cartCount } = useCart();

  return (
  <Link href="/checkout" className="dm-cart dm-cart--mobile">
  <span>🧾</span>
  <span>Your Quote ({cartCount})</span>
</Link>
  );
}