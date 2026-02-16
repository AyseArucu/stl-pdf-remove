'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

type Props = {
    placeholder?: string;
};

export default function AdminSearch({ placeholder = 'Ara...' }: Props) {
    const { replace } = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }

        startTransition(() => {
            replace(`${pathname}?${params.toString()}`);
        });
    };

    return (
        <div style={{ position: 'relative', width: '300px' }}>
            <input
                type="text"
                placeholder={placeholder}
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get('q')?.toString()}
                style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: '#fff'
                }}
            />
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8'
                }}
            >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            {isPending && (
                <div style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                }}>
                    <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: '2px solid #e2e8f0',
                        borderTopColor: '#9333ea',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <style jsx>{`
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
}
