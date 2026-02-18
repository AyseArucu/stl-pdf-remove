import Link from 'next/link';
import { loginUser } from '@/app/actions';

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedSearchParams = await searchParams;
    const { error } = resolvedSearchParams;
    const callbackUrl = typeof resolvedSearchParams.callbackUrl === 'string' ? resolvedSearchParams.callbackUrl : undefined;

    return (
        <main className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 className="title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Giriş Yap</h1>
                    <p style={{ color: 'var(--text-light)' }}>Hesabınıza erişmek için bilgilerinizi girin.</p>
                </div>

                <form action={loginUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {error && (
                        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                            {error === 'InvalidCredentials' && 'E-posta veya şifre hatalı.'}
                            {error === 'EmailNotVerified' && 'Lütfen e-posta adresinizi doğrulayın.'}
                            {error === 'SystemError' && 'Sistem hatası oluştu. Lütfen tekrar deneyin.'}
                            {!['InvalidCredentials', 'EmailNotVerified', 'SystemError'].includes(error as string) && 'Giriş yapılamadı.'}
                        </div>
                    )}
                    {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}
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

                    <button type="submit" className="btn" style={{ marginTop: '0.5rem', padding: '1rem', fontSize: '1.1rem', width: '100%' }}>
                        Giriş Yap
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.95rem' }}>
                    <p style={{ color: 'var(--text-light)' }}>
                        Hesabınız yok mu? <Link href={`/register${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`} style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Kayıt Ol</Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
