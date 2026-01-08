import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, User, Loader2 } from 'lucide-react';

const GuestList = ({ eventData, onConfirm, loading }) => {
    // Store responses as: { "Name": "SIM", "Name 2": "NÃO" }
    const [responses, setResponses] = useState({});

    useEffect(() => {
        // Initialize with existing status if present
        const initial = {};
        eventData.guests.forEach(g => {
            if (g.status === 'SIM' || g.status === 'CONFIRMADO') initial[g.name] = 'SIM';
            if (g.status === 'NÃO' || g.status === 'RECUSADO') initial[g.name] = 'NÃO';
        });
        setResponses(initial);
    }, [eventData]);

    const setStatus = (name, status) => {
        setResponses(prev => ({ ...prev, [name]: status }));
    };

    const handleConfirm = () => {
        // Convert object to array for API: [{ name: "X", status: "SIM" }]
        const payload = eventData.guests.map(g => ({
            name: g.name,
            status: responses[g.name] || 'PENDENTE' // Send PENDENTE if not chosen, or maybe enforce selection?
        })).filter(g => responses[g.name]); // Only send ones that have a decision? 
        // PLAN SAID: Send list. Let's send all user interactions.
        // Actually user wants to confirm presence OR NOT.
        // If they leave it blank, maybe we shouldn't update it?
        // Let's send only the ones that are explicitly set in 'responses'.

        // Better yet: Send all linked guests with their current UI state.
        const finalPayload = Object.entries(responses).map(([name, status]) => ({ name, status }));

        onConfirm(finalPayload);
    };

    // Check if all displayed guests have a decision (optional, but good UX)
    const allDecided = eventData.guests.every(g => responses[g.name]);

    return (
        <div className="animate-enter" style={{ padding: '1.5rem', paddingBottom: '6rem' }}>
            {/* Header Card */}
            <motion.div
                className="glass-panel"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{ padding: '1.5rem', marginBottom: '2rem' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                    <span style={{ background: 'var(--primary)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>EVENTO</span>
                </div>
                <h2 style={{ fontSize: '1.5rem', margin: '0 0 8px 0' }}>{eventData.event.split(' ')[0]}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <User size={16} /> <span>Anfitrião: {eventData.host}</span>
                </div>
            </motion.div>

            {/* Guest List */}
            <h3 style={{ marginLeft: '4px', marginBottom: '1rem' }}>Sua Lista de Convidados</h3>
            <p style={{ marginLeft: '4px', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Marque <b>Sim</b> para quem vai e <b>Não</b> para quem não poderá comparecer.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {eventData.guests.map((guest, idx) => {
                    const status = responses[guest.name];
                    const isSim = status === 'SIM';
                    const isNao = status === 'NÃO';

                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-panel"
                            style={{
                                padding: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '50%',
                                    background: 'var(--card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--text-muted)'
                                }}>
                                    <User size={20} />
                                </div>
                                <span style={{ fontWeight: '500', flex: 1 }}>{guest.name}</span>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => setStatus(guest.name, 'SIM')}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        borderRadius: '8px',
                                        border: '1px solid',
                                        borderColor: isSim ? 'var(--success)' : 'var(--border)',
                                        background: isSim ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                                        color: isSim ? 'var(--success)' : 'var(--text-muted)',
                                        cursor: 'pointer',
                                        fontWeight: isSim ? 'bold' : 'normal',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Check size={18} /> Vou
                                </button>

                                <button
                                    onClick={() => setStatus(guest.name, 'NÃO')}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        borderRadius: '8px',
                                        border: '1px solid',
                                        borderColor: isNao ? '#ef4444' : 'var(--border)',
                                        background: isNao ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                                        color: isNao ? '#ef4444' : 'var(--text-muted)',
                                        cursor: 'pointer',
                                        fontWeight: isNao ? 'bold' : 'normal',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <X size={18} /> Não vou
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Floating Button */}
            <div style={{
                position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
                width: 'calc(100% - 3rem)', maxWidth: '450px', zIndex: 10
            }}>
                <button
                    className="btn-primary"
                    onClick={handleConfirm}
                    disabled={loading || !allDecided}
                    style={{ opacity: (!allDecided && !loading) ? 0.5 : 1 }}
                >
                    {loading ? <Loader2 className="animate-spin" style={{ margin: '0 auto' }} /> :
                        allDecided ? "Enviar Respostas" : "Responda todos para enviar"}
                </button>
            </div>
        </div>
    );
};

export default GuestList;
