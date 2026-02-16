'use client';

import { updateUserRole } from '@/app/actions';
import { useTransition } from 'react';

type Props = {
    userId: string;
    currentRole: 'ADMIN' | 'CUSTOMER';
};

export default function UserRoleSelect({ userId, currentRole }: Props) {
    const [isPending, startTransition] = useTransition();

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value;
        startTransition(() => {
            const formData = new FormData();
            formData.append('userId', userId);
            formData.append('role', newRole);
            updateUserRole(formData);
        });
    };

    return (
        <select
            value={currentRole}
            onChange={handleRoleChange}
            disabled={isPending}
            style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '0.85rem',
                fontWeight: 600,
                backgroundColor: currentRole === 'ADMIN' ? '#f3e8ff' : '#f1f5f9',
                color: currentRole === 'ADMIN' ? '#9333ea' : '#64748b',
                cursor: 'pointer',
                outline: 'none'
            }}
        >
            <option value="CUSTOMER">CUSTOMER</option>
            <option value="ADMIN">ADMIN</option>
        </select>
    );
}
