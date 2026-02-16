'use client';

import { useState } from 'react';
import { FaTrash, FaReply, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import { deleteMessage, replyToMessage } from '@/app/actions/contact';

interface Message {
    id: string;
    date: Date;
    name: string;
    email: string;
    subject: string;
    message: string;
}

export default function MessageRow({ msg }: { msg: Message }) {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Bu mesajı silmek istediğinize emin misiniz?')) return;
        setDeleting(true);
        const res = await deleteMessage(msg.id);
        if (!res.success) {
            alert(res.error || 'Silinemedi');
            setDeleting(false);
        }
        // If success, the row will be removed by revalidation, or we can hide it locally, but revalidation is cleaner if fast.
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        setSending(true);
        const res = await replyToMessage(msg.id, replyText);
        setSending(false);

        if (res.success) {
            alert('Cevap gönderildi.');
            setIsReplying(false);
            setReplyText('');
        } else {
            alert(res.error || 'Cevap gönderilemedi.');
        }
    };

    return (
        <>
            <tr style={{ borderBottom: '1px solid #f9f9f9', backgroundColor: isReplying ? '#f0f9ff' : 'transparent' }}>
                <td style={{ padding: '1rem', whiteSpace: 'nowrap', color: '#666' }}>
                    {new Date(msg.date).toLocaleDateString('tr-TR')} {new Date(msg.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{msg.name}</td>
                <td style={{ padding: '1rem', color: '#666' }}>
                    <a href={`mailto:${msg.email}`} style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaEnvelope size={12} /> {msg.email}
                    </a>
                </td>
                <td style={{ padding: '1rem' }}>{msg.subject}</td>
                <td style={{ padding: '1rem', maxWidth: '400px' }}>
                    <p style={{ maxHeight: '100px', overflowY: 'auto' }}>
                        {msg.message}
                    </p>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            style={{
                                padding: '0.5rem',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                background: isReplying ? '#e0f2fe' : 'white',
                                color: '#0284c7',
                                cursor: 'pointer'
                            }}
                            title="Yanıtla"
                        >
                            <FaReply />
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            style={{
                                padding: '0.5rem',
                                border: '1px solid #fee2e2',
                                borderRadius: '4px',
                                background: 'white',
                                color: '#ef4444',
                                cursor: deleting ? 'not-allowed' : 'pointer',
                                opacity: deleting ? 0.5 : 1
                            }}
                            title="Sil"
                        >
                            <FaTrash />
                        </button>
                    </div>
                </td>
            </tr>
            {isReplying && (
                <tr style={{ backgroundColor: '#f0f9ff' }}>
                    <td colSpan={6} style={{ padding: '0 1rem 1rem 1rem' }}>
                        <form onSubmit={handleReply} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0369a1' }}>Yanıtınız:</label>
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Mesajınızı buraya yazın..."
                                    rows={4}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '6px',
                                        border: '1px solid #bae6fd',
                                        fontFamily: 'inherit'
                                    }}
                                    autoFocus
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsReplying(false)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: 'transparent',
                                        color: '#64748b',
                                        cursor: 'pointer'
                                    }}
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={sending || !replyText.trim()}
                                    style={{
                                        padding: '0.5rem 1.5rem',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: '#0ea5e9',
                                        color: 'white',
                                        fontWeight: 600,
                                        cursor: (sending || !replyText.trim()) ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        opacity: (sending || !replyText.trim()) ? 0.7 : 1
                                    }}
                                >
                                    {sending ? 'Gönderiliyor...' : <><FaPaperPlane /> Gönder</>}
                                </button>
                            </div>
                        </form>
                    </td>
                </tr>
            )}
        </>
    );
}
