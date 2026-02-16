'use client';

import { submitQuestion } from '@/app/actions';
import { useState } from 'react';

type Question = {
    id: string;
    userName: string;
    question: string;
    answer?: string | null;
    createdAt: string | Date;
};

type Props = {
    productId: string;
    questions: Question[];
};

export default function ProductQuestions({ productId, questions }: Props) {
    // Check if questions is array, if not use empty array (safety)
    const safeQuestions = Array.isArray(questions) ? questions : [];

    // Determine answered questions to show
    const answeredQuestions = safeQuestions.filter(q => q.answer);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        await submitQuestion(formData);
        setIsSubmitting(false);
        setShowSuccess(true);
        // Reset form manually or hide it, simplest is showing success message
    };

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* Question List */}
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Önceki Sorular ({answeredQuestions.length})</h3>

                    {answeredQuestions.length === 0 ? (
                        <p style={{ color: '#666', fontStyle: 'italic' }}>Henüz cevaplanmış soru yok. İlk soruyu sen sor!</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {answeredQuestions.map(q => (
                                <div key={q.id} style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{q.userName}</span>
                                        <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{new Date(q.createdAt).toLocaleDateString('tr-TR')}</span>
                                    </div>
                                    <p style={{ fontWeight: '500', marginBottom: '0.75rem' }}>Soru: {q.question}</p>

                                    <div style={{ backgroundColor: '#fff', padding: '0.75rem', borderRadius: '6px', borderLeft: '4px solid #10b981' }}>
                                        <p style={{ fontSize: '0.9rem', color: '#333' }}>
                                            <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.2rem', color: '#10b981' }}>Mağaza Cevabı:</span>
                                            {q.answer}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Ask Question Form */}
                <div>
                    <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Soru Sor</h3>

                        {showSuccess ? (
                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✅</div>
                                <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Sorunuz Alındı!</h4>
                                <p style={{ color: '#666' }}>Sorunuz satıcıya iletildi. Cevaplandığında burada yayınlanacaktır.</p>
                                <button onClick={() => setShowSuccess(false)} style={{ marginTop: '1.5rem', textDecoration: 'underline', cursor: 'pointer', border: 'none', background: 'none', color: '#3b82f6' }}>Yeni Soru Sor</button>
                            </div>
                        ) : (
                            <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <input type="hidden" name="productId" value={productId} />

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Adınız Soyadınız (İsteğe bağlı)</label>
                                    <input
                                        type="text"
                                        name="userName"
                                        placeholder="Adınız"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Sorunuz</label>
                                    <textarea
                                        name="question"
                                        required
                                        rows={4}
                                        placeholder="Ürünle ilgili merak ettiklerinizi sorun..."
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', resize: 'vertical' }}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '0.8rem', fontWeight: '600' }}
                                >
                                    {isSubmitting ? 'Gönderiliyor...' : 'Soruyu Gönder'}
                                </button>
                                <p style={{ fontSize: '0.8rem', color: '#9ca3af', textAlign: 'center' }}>
                                    Sorunuz onaylandıktan ve cevaplandıktan sonra yayınlanacaktır.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
