'use client';

import { useCart } from './CartContext';
import Link from 'next/link';

export default function CartSummary() {
    const { items } = useCart();
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <Link href="/cart" className="btn btn-cart">
            Sepet ({itemCount})
        </Link>
    );
}
