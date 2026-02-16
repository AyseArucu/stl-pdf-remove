'use client';

import { useCart } from '@/components/CartContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderSuccessHandler() {
    const { clearCart } = useCart();
    const router = useRouter();

    useEffect(() => {
        // Sepeti temizle
        clearCart();

        // URL'den parametreyi temizle (opsiyonel, temiz bir URL için)
        // router.replace('/'); 
        // Ancak kullanıcı "Siparişiniz alındı" mesajını görmeli. 
        // clearCart() zaten alert veriyor şu anki impl'de.

    }, [clearCart]);

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#22c55e',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 1000,
            animation: 'slideIn 0.5s ease-out'
        }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Siparişiniz Başarıyla Alındı!</h3>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
                Teşekkür ederiz.
            </p>
        </div>
    );
}
