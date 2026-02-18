import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { logoutUser } from '@/app/actions';
import ProfileForm from './ProfileForm';

export default async function AccountPage() {
    const cookieStore = await cookies();
    const sessionConfig = cookieStore.get('user_session');

    if (!sessionConfig?.value) {
        redirect('/login');
    }

    const user = JSON.parse(sessionConfig.value);

    return (
        <div className="container" style={{ padding: '4rem 2rem', minHeight: '80vh' }}>
            <div className="profile-header">
                <div>
                    <h1 className="title">Hesabım</h1>
                    <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>
                        Hoşgeldiniz, {user.name || user.email}
                    </p>
                </div>
                <form action={logoutUser}>
                    <button type="submit" className="btn" style={{ backgroundColor: 'white', color: 'var(--primary)', border: '1px solid var(--primary)', cursor: 'pointer' }}>
                        Çıkış Yap
                    </button>
                </form>
            </div>

            <div className="profile-layout">
                {/* Sidebar Menu */}
                <div className="profile-menu">
                    <Link href="/account" className="profile-link active">
                        Profil Bilgileri
                    </Link>
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                    <ProfileForm user={user} />
                </div>
            </div>
        </div>
    );
}
