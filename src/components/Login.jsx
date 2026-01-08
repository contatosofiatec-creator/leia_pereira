import React, { useState } from 'react';
import { Phone, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.jpeg';

const Login = ({ onLogin, loading }) => {
    const [phone, setPhone] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (phone.length >= 10) {
            onLogin(phone);
        }
    };

    const handleChange = (e) => {
        // Basic mask logic (only numbers)
        const val = e.target.value.replace(/\D/g, '');
        setPhone(val);
    };

    return (
        <div className="animate-enter" style={{ padding: '2rem', textAlign: 'center', marginTop: '20vh' }}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={logo} alt="Logo" style={{ maxWidth: '300px', maxHeight: '225px', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '800' }}>Bem-vindo</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Digite seu celular para confirmar presença.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Phone size={20} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                        <input
                            type="tel"
                            className="input-field"
                            placeholder="DDD + Número (Ex: 48999999999)"
                            value={phone}
                            onChange={handleChange}
                            style={{ paddingLeft: '48px' }}
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading || phone.length < 10}
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: (loading || phone.length < 10) ? 0.7 : 1 }}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Continuar <ArrowRight size={20} /></>}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
