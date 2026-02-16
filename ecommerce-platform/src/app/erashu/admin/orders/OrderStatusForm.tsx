'use client';

import { updateOrderStatus } from '@/app/actions';

interface OrderStatusFormProps {
    orderId: string;
    currentStatus: string;
}

const statusOptions = ['Hazırlanıyor', 'Kargolandı', 'Teslim Edildi', 'İptal'];

export default function OrderStatusForm({ orderId, currentStatus }: OrderStatusFormProps) {
    return (
        <form action={updateOrderStatus} style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input type="hidden" name="id" value={orderId} />
            <select
                name="status"
                defaultValue={currentStatus}
                style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'white' }}
                onChange={(e) => e.target.form?.requestSubmit()}
            >
                {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                ))}
            </select>
            <button type="submit" style={{ display: 'none' }}>Güncelle</button>
        </form>
    );
}
