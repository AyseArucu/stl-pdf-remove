'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '2rem', textAlign: 'center', fontFamily: 'system-ui' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Bir şeyler yanlış gitti!</h2>
                    <p style={{ color: '#666', marginBottom: '2rem' }}>Beklenmedik bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin.</p>
                    <button
                        onClick={() => reset()}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#000',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Tekrar Dene
                    </button>
                    {process.env.NODE_ENV === 'development' && (
                        <pre style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px', textAlign: 'left', overflow: 'auto', maxWidth: '800px' }}>
                            {error.message}
                            {error.stack}
                        </pre>
                    )}
                </div>
            </body>
        </html>
    );
}
