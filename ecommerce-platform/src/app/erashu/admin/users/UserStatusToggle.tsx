'use client';

import { toggleUserStatus } from '@/app/actions';
import { useTransition } from 'react';

type Props = {
    userId: string;
    initialStatus: boolean;
};

export default function UserStatusToggle({ userId, initialStatus }: Props) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(() => {
            toggleUserStatus(userId, !initialStatus);
        });
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: initialStatus ? '#dcfce7' : '#fee2e2',
                color: initialStatus ? '#166534' : '#991b1b',
                transition: 'all 0.2s',
                opacity: isPending ? 0.7 : 1
            }}
        >
            <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: initialStatus ? '#166534' : '#991b1b'
            }}></span>
            {initialStatus ? 'Aktif' : 'Pasif'}
        </button>
    );
}
