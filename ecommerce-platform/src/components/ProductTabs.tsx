'use client';

import { useState, useEffect } from 'react';
import { submitReview } from '@/app/actions';
import { Review } from '@prisma/client';

type ReviewDTO = Omit<Review, 'createdAt'> & { createdAt: string | Date };

type Props = {
    reviews: ReviewDTO[];
    productId: string;
};

export default function ProductTabs({ reviews = [], productId }: Props) {
    const [activeTab, setActiveTab] = useState('reviews');
    const [showReviewForm, setShowReviewForm] = useState(false);

    // Auth State
    const [user, setUser] = useState<{ name: string, id: string } | null>(null);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [guestName, setGuestName] = useState('');

    useEffect(() => {
        // Simple client-side session check
        const storedUser = localStorage.getItem('guest_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleWriteReviewClick = () => {
        if (user) {
            setShowReviewForm(true);
        } else {
            setAuthModalOpen(true);
        }
    };

    const handleGuestLogin = () => {
        if (!guestName.trim()) return;
        const newUser = { name: guestName, id: Math.random().toString(36).substring(7) };
        localStorage.setItem('guest_user', JSON.stringify(newUser));
        setUser(newUser);
        setAuthModalOpen(false);
        setShowReviewForm(true);
    };

    const handleSubmit = async (formData: FormData) => {
        if (!user) return;

        formData.append('productId', productId);
        formData.append('userId', user.id);
        formData.append('userName', user.name);

        const result = await submitReview(formData);
        if (result.success) {
            alert(result.message);
            setShowReviewForm(false);
            window.location.reload();
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="product-tabs-container">
            <div className="tabs-header">

                <button
                    className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`}
                    onClick={() => setActiveTab('features')}
                >
                    Ürün Özellikleri
                </button>
                <button
                    className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Değerlendirmeler ({reviews.length})
                </button>
            </div>

            <div className="tab-content">

                {activeTab === 'features' && (
                    <div className="content-pane">
                        <ul className="feature-list">
                            <li><strong>Materyal:</strong> %100 Pamuk</li>
                            <li><strong>Kalıp:</strong> Regular Fit</li>
                        </ul>
                    </div>
                )}
                {activeTab === 'reviews' && (
                    <div className="content-pane">
                        <div className="review-summary-header">
                            <div className="review-summary">
                                <span className="big-rating">{reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 'Yeni'}</span>
                                <span className="total-reviews">{reviews.length} Yorum</span>
                            </div>
                            <button className="btn btn-outline" onClick={handleWriteReviewClick}>
                                Yorum Yap
                            </button>
                        </div>

                        {showReviewForm && (
                            <form action={handleSubmit} className="review-form">
                                <h4>Yorumunu Yaz</h4>
                                <div className="form-group">
                                    <label>Puanın:</label>
                                    <select name="rating" required className="form-input">
                                        <option value="5">5 Yıldız - Çok İyi</option>
                                        <option value="4">4 Yıldız - İyi</option>
                                        <option value="3">3 Yıldız - Orta</option>
                                        <option value="2">2 Yıldız - Kötü</option>
                                        <option value="1">1 Yıldız - Çok Kötü</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Yorumun:</label>
                                    <textarea name="comment" required className="form-input" rows={4} placeholder="Ürün deneyimini paylaş..."></textarea>
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary">Gönder</button>
                                    <button type="button" className="btn btn-text" onClick={() => setShowReviewForm(false)}>İptal</button>
                                </div>
                            </form>
                        )}

                        {/* Auth Modal (Simple Inline) */}
                        {authModalOpen && (
                            <div className="auth-modal-inline">
                                <h4>Yorum Yapmak İçin Giriş Yapın</h4>
                                <p>Hızlıca isminizi girerek devam edebilirsiniz.</p>
                                <input
                                    type="text"
                                    placeholder="Adınız Soyadınız"
                                    className="form-input"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                />
                                <button className="btn btn-primary" onClick={handleGuestLogin}>Devam Et</button>
                                <button className="btn btn-text" onClick={() => setAuthModalOpen(false)}>Vazgeç</button>
                            </div>
                        )}

                        <div className="review-list">
                            {reviews.length > 0 ? reviews.map((review) => (
                                <div key={review.id} className="review-item">
                                    <div className="review-stars">
                                        {Array.from({ length: review.rating }).map((_, i) => <span key={i}>⭐</span>)}
                                    </div>
                                    <p className="review-text">{review.comment}</p>
                                    <div className="review-meta">
                                        {review.userName} - {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                                    </div>
                                </div>
                            )) : (
                                <p className="no-reviews">Henüz yorum yapılmamış. İlk yorumu sen yap!</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
