'use client';

import { deleteReview } from '@/app/actions';

interface ReviewDeleteButtonProps {
    reviewId: string;
}

export default function ReviewDeleteButton({ reviewId }: ReviewDeleteButtonProps) {
    return (
        <form action={deleteReview}>
            <input type="hidden" name="id" value={reviewId} />
            <button
                type="submit"
                style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                onClick={(e) => {
                    if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
                        e.preventDefault();
                    }
                }}
            >
                Sil
            </button>
        </form>
    );
}
