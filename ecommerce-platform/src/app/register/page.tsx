import Link from 'next/link';
import { registerUser } from '@/app/actions';

export default function RegisterPage({ searchParams }: { searchParams: { error?: string, callbackUrl?: string } }) {
    const isEmailExists = searchParams.error === 'EmailAlreadyExists';
    const callbackUrl = searchParams.callbackUrl;

    return (
        <main className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 className="title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Kayıt Ol</h1>
                    <p style={{ color: 'var(--text-light)' }}>Hızlıca üye olun ve alışverişe başlayın.</p>
                </div>

                {isEmailExists ? (
                    <div style={{
                        backgroundColor: '#fff0f0',
                        border: '1px solid #ffcccc',
                        padding: '1.5rem',
                        borderRadius: '0.75rem',
                        textAlign: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{ color: '#dc2626', fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem' }}>
                            ⚠ Bu e-posta adresiyle kayıtlı bir hesabınız var.
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <Link href={`/login${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`} className="btn" style={{ width: '100%', textDecoration: 'none' }}>
                                Giriş Yap
                            </Link>
                            <Link href="/forgot-password" className="btn btn-outline" style={{ width: '100%', textDecoration: 'none' }}>
                                Şifremi Unuttum
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form action={registerUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}
                        <div className="form-group">
                            <label className="form-label">Ad Soyad</label>
                            <input
                                name="name"
                                type="text"
                                required
                                className="form-input"
                                placeholder="Örn: Ahmet Yılmaz"
                            />
                        </div>

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

                        <div className="form-group">
                            <label className="form-label">Şifre</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="form-input"
                                placeholder="••••••••"
                            />
                        </div>

                        {searchParams.error === 'RegistrationFailed' && (
                            <div style={{ color: 'red', textAlign: 'center', fontSize: '0.9rem' }}>
                                Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.
                            </div>
                        )}

                        <button type="submit" className="btn" style={{ marginTop: '0.5rem', padding: '1rem', fontSize: '1.1rem', width: '100%' }}>
                            Kayıt Ol
                        </button>
                    </form>
                )}

                {!isEmailExists && (
                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.95rem' }}>
                        <p style={{ color: 'var(--text-light)' }}>
                            Zaten hesabınız var mı? <Link href={`/login${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`} style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Giriş Yap</Link>
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
