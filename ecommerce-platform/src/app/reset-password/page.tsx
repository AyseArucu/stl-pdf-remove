'use client';

import { resetPassword } from '@/app/actions';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (!token) {
        return (
            <main className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <div className="card" style={{ padding: '2.5rem', textAlign: 'center', maxWidth: '450px' }}>
                    <div style={{ color: '#dc2626', fontWeight: 600, fontSize: '1.2rem', marginBottom: '1rem' }}>
                        Geçersiz Bağlantı
                    </div>
                    <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                        Şifre sıfırlama bağlantısı geçersiz veya eksik.
                    </p>
                    <Link href="/forgot-password" className="btn">
                        Tekrar Dene
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 className="title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Şifre Belirle</h1>
                    <p style={{ color: 'var(--text-light)' }}>
                        Hesabınız için yeni bir şifre belirleyin.
                    </p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: '#fff0f0',
                        border: '1px solid #ffcccc',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        textAlign: 'center',
                        marginBottom: '1.5rem',
                        color: '#dc2626'
                    }}>
                        {error === 'InvalidToken' ? 'Bağlantı geçersiz veya süresi dolmuş.' : 'Bilinmeyen bir hata oluştu.'}
                    </div>
                )}

                <form action={resetPassword.bind(null, token)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group">
                        <label className="form-label">Yeni Şifre</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="form-input"
                            placeholder="••••••••"
                            minLength={6}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Yeni Şifre (Tekrar)</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            className="form-input"
                            placeholder="••••••••"
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="btn" style={{ marginTop: '0.5rem', padding: '1rem', fontSize: '1.1rem', width: '100%' }}>
                        Şifreyi Güncelle
                    </button>
                </form>
            </div>
        </main>
    );
}
