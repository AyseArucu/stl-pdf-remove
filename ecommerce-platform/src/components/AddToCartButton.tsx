'use client';

import { useCart } from './CartContext';
import { Product } from '@prisma/client';

type ProductDTO = Omit<Product, 'createdAt'> & { createdAt: string | Date };

export default function AddToCartButton({
    product,
    detailed = false,
    disabled = false,
    label = 'Sepete Ekle',
    style
}: {
    product: Product | ProductDTO,
    detailed?: boolean,
    disabled?: boolean,
    label?: string,
    style?: React.CSSProperties
}) {
    const { addToCart } = useCart();

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!disabled) addToCart(product);
            }}
            disabled={disabled}
            className={`btn btn-primary ${detailed ? 'btn-lg' : 'btn-sm'}`}
            style={{
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
                ...style
            }}
        >
            {label}
        </button>
    );
}
