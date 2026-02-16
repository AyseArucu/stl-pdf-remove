'use client';

import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useAdmin } from '@/context/AdminContext';
import { changeAdminPassword, logoutAllDevices } from './actions';
import { FaUser, FaLock, FaShieldAlt, FaHistory, FaMoon, FaSun, FaGlobe, FaSignOutAlt } from 'react-icons/fa';

export default function AdminProfilePage() {
    const { user } = useUser();
    const { theme, toggleTheme, language, setLanguage, t } = useAdmin();

    // Password Form State
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toggleLanguage = () => {
        const newLang = language === 'TR' ? 'EN' : 'TR';
        setLanguage(newLang);
    };

    const handlePasswordChange = async (formData: FormData) => {
        setIsLoading(true);
        setPasswordError('');
        setPasswordSuccess('');

        const res = await changeAdminPassword(formData);

        if (res?.error) {
            setPasswordError(res.error);
        } else if (res?.success) {
            setPasswordSuccess(res.success);
            // Reset form
            const form = document.getElementById('passwordForm') as HTMLFormElement;
            form.reset();
        }

        setIsLoading(false);
    };

    return (
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1 className="title" style={{ marginBottom: '2rem' }}>{language === 'TR' ? 'Yönetici Profili' : 'Admin Profile'}</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* 1. General Info */}
                <div className="card" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <div className="card-content">
                        <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)' }}>
                            <FaUser style={{ color: 'var(--primary)' }} /> {t.generalInfo}
                        </h2>
                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-light)' }}>{t.fullName}</span>
                                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{user?.name || 'Admin User'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-light)' }}>{t.email}</span>
                                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{user?.email || 'admin@example.com'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-light)' }}>{t.role}</span>
                                <span style={{
                                    backgroundColor: '#dbeafe',
                                    color: '#1e40af',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '4px',
                                    fontSize: '0.85rem',
                                    fontWeight: 600
                                }}>
                                    {user?.role || 'ADMIN'}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-light)' }}>{t.status}</span>
                                <span style={{ color: '#16a34a', fontWeight: 600 }}>Aktif</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-light)' }}>{t.lastLogin}</span>
                                <span style={{ color: 'var(--text)' }}>{new Date().toLocaleDateString(language === 'TR' ? 'tr-TR' : 'en-US')} {new Date().toLocaleTimeString(language === 'TR' ? 'tr-TR' : 'en-US')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Security (Change Password) */}
                <div className="card" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <div className="card-content">
                        <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)' }}>
                            <FaLock style={{ color: 'var(--primary)' }} /> {t.security}
                        </h2>

                        <form id="passwordForm" action={handlePasswordChange} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--text-light)' }}>{t.currentPassword}</label>
                                <input type="password" name="currentPassword" required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--text)' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--text-light)' }}>{t.newPassword}</label>
                                <input type="password" name="newPassword" required minLength={6} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--text)' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--text-light)' }}>{t.confirmPassword}</label>
                                <input type="password" name="confirmPassword" required minLength={6} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--text)' }} />
                            </div>

                            {passwordError && (
                                <div style={{ color: '#ef4444', fontSize: '0.9rem', backgroundColor: '#fef2f2', padding: '0.5rem', borderRadius: '6px' }}>{passwordError}</div>
                            )}
                            {passwordSuccess && (
                                <div style={{ color: '#16a34a', fontSize: '0.9rem', backgroundColor: '#f0fdf4', padding: '0.5rem', borderRadius: '6px' }}>{passwordSuccess}</div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn"
                                style={{
                                    marginTop: '0.5rem',
                                    width: '100%',
                                    justifyContent: 'center',
                                    opacity: isLoading ? 0.7 : 1
                                }}
                            >
                                {isLoading ? '...' : t.updatePassword}
                            </button>
                        </form>
                    </div>
                </div>

                {/* 3. Session Management */}
                <div className="card" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <div className="card-content">
                        <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)' }}>
                            <FaShieldAlt style={{ color: 'var(--primary)' }} /> {t.sessionManagement}
                        </h2>

                        <div style={{ marginTop: '1.5rem', backgroundColor: 'var(--background)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
                                <div style={{ width: '10px', height: '10px', backgroundColor: '#16a34a', borderRadius: '50%' }}></div>
                                <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}>{t.currentSession}</span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.2rem' }}>Windows 10 • Chrome • 192.168.1.1</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Aktif: Şimdi</p>
                        </div>

                        <form action={logoutAllDevices} style={{ marginTop: '1.5rem' }}>
                            <button type="submit" style={{
                                width: '100%',
                                padding: '0.75rem',
                                backgroundColor: '#fef2f2',
                                color: '#ef4444',
                                border: '1px solid #fecaca',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}>
                                <FaSignOutAlt /> {t.logoutAll}
                            </button>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.5rem', textAlign: 'center' }}>
                                {language === 'TR' ? 'Bu işlem mevcut oturumunuzu da sonlandıracaktır.' : 'This will also end your current session.'}
                            </p>
                        </form>
                    </div>
                </div>

                {/* 4. Preferences */}
                <div className="card" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <div className="card-content">
                        <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)' }}>
                            <FaGlobe style={{ color: 'var(--primary)' }} /> {t.preferences}
                        </h2>

                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem', color: 'var(--text)' }}>{t.theme}</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{t.themeDesc}</p>
                                </div>
                                <button onClick={toggleTheme} style={{
                                    background: 'none',
                                    border: '1px solid var(--border)',
                                    borderRadius: '20px',
                                    padding: '0.4rem 0.8rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    cursor: 'pointer',
                                    backgroundColor: theme === 'dark' ? '#334155' : 'var(--background)',
                                    color: theme === 'dark' ? 'white' : 'var(--text)'
                                }}>
                                    {theme === 'light' ? <FaSun color="#fbbf24" /> : <FaMoon color="#94a3b8" />}
                                    <span style={{ fontSize: '0.9rem' }}>{theme === 'light' ? t.light : t.dark}</span>
                                </button>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem', color: 'var(--text)' }}>{t.language}</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{t.languageDesc}</p>
                                </div>
                                <button onClick={toggleLanguage} style={{
                                    background: 'none',
                                    border: '1px solid var(--border)',
                                    borderRadius: '20px',
                                    padding: '0.4rem 0.8rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    cursor: 'pointer',
                                    color: 'var(--text)'
                                }}>
                                    <span style={{ fontSize: '1.2rem' }}>{language === 'TR' ? '🇹🇷' : '🇬🇧'}</span>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{language}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Logs (Full Width) */}
            <div className="card" style={{ marginTop: '2rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="card-content">
                    <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)' }}>
                        <FaHistory style={{ color: 'var(--primary)' }} /> {t.recentActivity}
                    </h2>

                    <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                                    <th style={{ padding: '0.75rem', color: 'var(--text-light)' }}>{t.date}</th>
                                    <th style={{ padding: '0.75rem', color: 'var(--text-light)' }}>{t.action}</th>
                                    <th style={{ padding: '0.75rem', color: 'var(--text-light)' }}>{t.target}</th>
                                    <th style={{ padding: '0.75rem', color: 'var(--text-light)' }}>{t.status}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '0.75rem', color: 'var(--text)' }}>{new Date(Date.now() - i * 3600000).toLocaleString(language === 'TR' ? 'tr-TR' : 'en-US')}</td>
                                        <td style={{ padding: '0.75rem', color: 'var(--text)' }}>{i % 2 === 0 ? 'Ürün Güncelleme' : 'Giriş İsteği'}</td>
                                        <td style={{ padding: '0.75rem', color: 'var(--text)' }}>{i % 2 === 0 ? 'PRD-00' + i : 'System'}</td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <span style={{
                                                backgroundColor: '#f0fdf4',
                                                color: '#16a34a',
                                                padding: '0.1rem 0.4rem',
                                                borderRadius: '4px',
                                                fontSize: '0.8rem',
                                                fontWeight: 600
                                            }}>Başarılı</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
