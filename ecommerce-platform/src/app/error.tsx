'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">Bir şeyler ters gitti!</h2>
            <p className="text-sm text-gray-600">{error.message || "Beklenmedik bir hata oluştu."}</p>
            <button
                className="rounded bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
            >
                Tekrar Dene
            </button>
        </div>
    );
}
