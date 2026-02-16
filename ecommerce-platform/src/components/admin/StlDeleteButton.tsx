'use client';

import { useState } from 'react';
import { deleteStlModel } from '@/app/actions';

export default function StlDeleteButton({ id }: { id: string }) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleDelete() {
        if (!confirm('Bu modeli silmek istediğinize emin misiniz?')) return;

        setIsLoading(true);
        const formData = new FormData();
        formData.append('id', id);
        const res = await deleteStlModel(formData);
        setIsLoading(false);

        if (res.success) {
            // Ideally we refresh the page, but router.refresh() or window.location.reload()
            window.location.reload();
        } else {
            alert(res.error || 'Silinemedi');
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isLoading}
            className="text-red-600 hover:text-red-800"
            title="Sil"
        >
            {isLoading ? '...' : 'Sil'}
        </button>
    );
}
