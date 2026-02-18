import { login } from '../auth';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
    const { error } = await searchParams;
    return (
        <main className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                padding: '2rem',
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
                <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Admin Girişi</h1>

                {error && (
                    <div style={{
                        backgroundColor: '#fef2f2',
                        color: '#ef4444',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        marginBottom: '1rem',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        Hatalı e-posta veya şifre!
                    </div>
                )}

                <form action={login} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>E-posta</label>
                        <input
                            name="email"
                            type="email"
                            defaultValue="admin@example.com"
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Şifre</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="123123"
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                        />
                    </div>

                    <button type="submit" className="btn" style={{ marginTop: '1rem', width: '100%' }}>
                        Giriş Yap
                    </button>
                </form>
            </div>
        </main>
    );
}
