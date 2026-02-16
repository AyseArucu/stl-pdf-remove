'use client';

import { useState } from 'react';
import { toggleProductStatus } from '@/app/actions';

interface ProductStatusToggleProps {
    productId: string;
    initialStatus: boolean;
}

export default function ProductStatusToggle({ productId, initialStatus }: ProductStatusToggleProps) {
    const [isActive, setIsActive] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
        setIsLoading(true);
        const newState = !isActive;
        try {
            // Optimistic update
            setIsActive(newState);
            await toggleProductStatus(productId, newState);
        } catch (error) {
            // Revert on error
            setIsActive(!newState);
            console.error('Failed to toggle status', error);
            alert('Durum güncellenemedi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', opacity: isLoading ? 0.7 : 1 }}>
            <div style={{
                position: 'relative',
                width: '36px',
                height: '20px',
                backgroundColor: isActive ? '#10b981' : '#d1d5db',
                borderRadius: '99px',
                transition: 'background-color 0.2s'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '2px',
                    left: isActive ? '18px' : '2px',
                    width: '16px',
                    height: '16px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }} />
            </div>
            <input
                type="checkbox"
                checked={isActive}
                onChange={handleToggle}
                style={{ display: 'none' }}
                disabled={isLoading}
            />
            <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: 'var(--text)' }}>
                {isActive ? 'Aktif' : 'Pasif'}
            </span>
        </label>
    );
}
