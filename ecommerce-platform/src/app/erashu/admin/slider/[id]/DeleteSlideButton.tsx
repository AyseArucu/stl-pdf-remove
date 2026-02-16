'use client';

import { useFormStatus } from 'react-dom';

export default function DeleteSlideButton({ id, deleteAction }: { id: string, deleteAction: any }) {
    const { pending } = useFormStatus();

    return (
        <form action={deleteAction}>
            <input type="hidden" name="id" value={id} />
            <button
                type="submit"
                disabled={pending}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition disabled:opacity-50"
                onClick={(e) => {
                    if (!confirm('Bu slaytı silmek istediğinize emin misiniz?')) {
                        e.preventDefault();
                    }
                }}
            >
                {pending ? 'Siliniyor...' : 'Slaytı Sil'}
            </button>
        </form>
    );
}
