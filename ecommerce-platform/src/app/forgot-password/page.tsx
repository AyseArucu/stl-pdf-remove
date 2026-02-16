'use client';

import { requestPasswordReset } from '@/app/actions';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ForgotPasswordPage() {
    const searchParams = useSearchParams();
    const isSuccess = searchParams.get('success') === 'true';

    return (
        <main className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 className="title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Şifremi Unuttum</h1>
                    <p style={{ color: 'var(--text-light)' }}>
                        E-posta adresinizi girin, sıfırlama bağlantısını gönderelim.
                    </p>
                </div>

                {isSuccess ? (
                    <div style={{
                        backgroundColor: '#f0fff4',
                        border: '1px solid #c6f6d5',
                        padding: '1.5rem',
                        borderRadius: '0.75rem',
                        textAlign: 'center'
                    }}>
                        <div style={{ color: '#047857', fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem' }}>
                            ✅ Gönderildi!
                        </div>
                        <p style={{ color: '#065f46', marginBottom: '1.5rem' }}>
                            E-posta adresinize şifre sıfırlama bağlantısı gönderildi. Lütfen gelen kutunuzu kontrol edin.
                        </p>
                        <Link href="/login" className="btn" style={{ width: '100%', textDecoration: 'none' }}>
                            Giriş Yap
                        </Link>
                    </div>
                ) : (
                    <form action={requestPasswordReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="form-group">
                            <label className="form-label">E-posta</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="form-input"
                                placeholder="ornek@email.com"
                            />
                        </div>

                        <button type="submit" className="btn" style={{ marginTop: '0.5rem', padding: '1rem', fontSize: '1.1rem', width: '100%' }}>
                            Bağlantı Gönder
                        </button>

                        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.95rem' }}>
                            <Link href="/login" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>
                                ← Giriş Ekranına Dön
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </main>
    );
}
