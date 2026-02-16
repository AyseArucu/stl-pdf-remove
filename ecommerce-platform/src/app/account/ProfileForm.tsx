'use client';

import { useState } from 'react';
import { updateProfile, changePassword, requestEmailChange } from '../actions';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    image: string | null;
}

export default function ProfileForm({ user }: { user: User }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);

    // Form State
    const [name, setName] = useState(user.name || '');
    const [phone, setPhone] = useState(user.phone || '');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(user.image);

    const router = useRouter();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('phone', phone);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            await updateProfile(formData);
            setIsEditing(false);
            router.refresh();
        } catch (error) {
            console.error('Profile update failed:', error);
            alert('Profil güncellenirken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="card-title">Üyelik Bilgileri</h2>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="btn"
                        style={{ backgroundColor: 'var(--primary)', color: 'white' }}
                    >
                        Düzenle
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit}>
                {/* Profile Image */}
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        backgroundColor: '#eee',
                        backgroundImage: `url(${imagePreview || '/placeholder-user.jpg'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}>
                        {!imagePreview && !user.image && (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                                No Img
                            </div>
                        )}
                    </div>

                    {isEditing && (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    )}
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">Ad Soyad</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isEditing}
                        className="form-input"
                        style={{ backgroundColor: isEditing ? 'white' : '#f9fafb' }}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">Telefon Numarası</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={!isEditing}
                        className="form-input"
                        style={{ backgroundColor: isEditing ? 'white' : '#f9fafb' }}
                        placeholder="05XX XXX XX XX"
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">E-posta</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            type="text"
                            value={user.email}
                            disabled
                            className="form-input"
                            style={{ backgroundColor: '#f9fafb', flex: 1 }}
                        />
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => setShowEmailModal(true)}
                                className="btn"
                                style={{ backgroundColor: '#fff', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.5rem 1rem' }}
                            >
                                Değiştir
                            </button>
                        )}
                    </div>
                    {isEditing && <small style={{ color: '#666' }}>E-posta değişikliği doğrulama gerektirir.</small>}
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">Şifre</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <input
                            type="password"
                            value="********"
                            disabled
                            className="form-input"
                            style={{ backgroundColor: '#f9fafb', flex: 1 }}
                        />
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => setShowPasswordModal(true)}
                                className="btn"
                                style={{ backgroundColor: '#fff', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.5rem 1rem' }}
                            >
                                Değiştir
                            </button>
                        )}
                    </div>
                </div>

                {isEditing && (
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn"
                            style={{ backgroundColor: 'var(--primary)', color: 'white', flex: 1 }}
                        >
                            {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                        <button
                            type="button"
                            className="btn"
                            onClick={() => {
                                setIsEditing(false);
                                setName(user.name || '');
                                setPhone(user.phone || '');
                                setImagePreview(user.image);
                            }}
                            style={{ backgroundColor: '#eee', color: '#333', flex: 1 }}
                        >
                            İptal
                        </button>
                    </div>
                )}
            </form>

            {/* Modals will be placed here */}
            {showPasswordModal && <PasswordModal onClose={() => setShowPasswordModal(false)} />}
            {showEmailModal && <EmailChangeModal onClose={() => setShowEmailModal(false)} currentEmail={user.email} />}
        </div>
    );
}

function PasswordModal({ onClose }: { onClose: () => void }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Yeni şifreler eşleşmiyor.');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('currentPassword', currentPassword);
            formData.append('newPassword', newPassword);

            const result = await changePassword(formData);

            if (result?.error) {
                setError(result.error);
            } else {
                alert('Şifreniz başarıyla güncellendi.');
                onClose();
            }
        } catch (e) {
            setError('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '400px', maxWidth: '90%' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Şifre Değiştir</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label">Mevcut Şifre</label>
                        <input
                            type="password"
                            className="form-input"
                            required
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label">Yeni Şifre</label>
                        <input
                            type="password"
                            className="form-input"
                            required
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label">Yeni Şifre (Tekrar)</label>
                        <input
                            type="password"
                            className="form-input"
                            required
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="submit"
                            className="btn"
                            style={{ backgroundColor: 'var(--primary)', color: 'white', flex: 1 }}
                            disabled={loading}
                        >
                            {loading ? 'Güncelleniyor...' : 'Güncelle'}
                        </button>
                        <button
                            type="button"
                            className="btn"
                            style={{ backgroundColor: '#eee', color: '#333', flex: 1 }}
                            onClick={onClose}
                        >
                            İptal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function EmailChangeModal({ onClose, currentEmail }: { onClose: () => void, currentEmail: string }) {
    const [newEmail, setNewEmail] = useState('');
    const [step, setStep] = useState(1); // 1: Request, 2: Sent
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('newEmail', newEmail);
            // Assuming verifyEmailChange handles the token verification from a link, 
            // but here we are REQUESTING the change.
            // Wait, the prompt said "link sends verification". 
            // So here we likely just trigger the email sending.
            const result = await requestEmailChange(formData);

            if (result?.error) {
                setError(result.error);
            } else {
                setStep(2);
            }
        } catch (e) {
            setError('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    if (step === 2) {
        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
            }}>
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '400px', maxWidth: '90%', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'green' }}>Doğrulama Gönderildi</h3>
                    <p>Lütfen <strong>{newEmail}</strong> adresine gönderilen linke tıklayarak değişikliği onaylayın.</p>
                    <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '1rem' }}>(Konsolu kontrol edin for demo link)</p>
                    <button
                        className="btn"
                        style={{ backgroundColor: 'var(--primary)', color: 'white', marginTop: '1.5rem', width: '100%' }}
                        onClick={onClose}
                    >
                        Tamam
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '400px', maxWidth: '90%' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>E-posta Değiştir</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Mevcut: {currentEmail}</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label">Yeni E-posta Adresi</label>
                        <input
                            type="email"
                            className="form-input"
                            required
                            value={newEmail}
                            onChange={e => setNewEmail(e.target.value)}
                        />
                    </div>

                    {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="submit"
                            className="btn"
                            style={{ backgroundColor: 'var(--primary)', color: 'white', flex: 1 }}
                            disabled={loading}
                        >
                            {loading ? 'Gönderiliyor...' : 'Onay Gönder'}
                        </button>
                        <button
                            type="button"
                            className="btn"
                            style={{ backgroundColor: '#eee', color: '#333', flex: 1 }}
                            onClick={onClose}
                        >
                            İptal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
