import React, { useState } from 'react';
import Login from './components/Login';
import GuestList from './components/GuestList';
import { searchGuests, confirmGuests } from './services/api';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

// Simple Success Component
const Success = () => (
  <div className="animate-enter" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', textAlign: 'center', padding: '2rem' }}>
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 10 }}
    >
      <CheckCircle size={80} color="var(--success)" strokeWidth={1.5} />
    </motion.div>
    <h2 style={{ marginTop: '2rem', fontSize: '2rem' }}>Confirmado!</h2>
    <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
      Sua presença foi confirmada com sucesso. Enviamos os detalhes para o seu WhatsApp.
    </p>
    <p style={{ marginTop: '3rem', fontSize: '0.9rem', opacity: 0.5 }}>Pode fechar esta janela.</p>
  </div>
);

function App() {
  const [step, setStep] = useState('LOGIN'); // LOGIN, LIST, SUCCESS
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [phone, setPhone] = useState(null);

  const handleLogin = async (inputPhone) => {
    setLoading(true);
    try {
      const response = await searchGuests(inputPhone);
      if (response.data.valid) {
        setEventData(response.data);
        setPhone(inputPhone);
        setStep('LIST');
      } else {
        alert(response.data.message || "Número não encontrado na lista de convidados.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao buscar convidados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (selectedGuests) => {
    setLoading(true);
    try {
      await confirmGuests(phone, selectedGuests);
      setStep('SUCCESS');
    } catch (error) {
      console.error(error);
      alert("Erro ao confirmar presença. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {step === 'LOGIN' && <Login onLogin={handleLogin} loading={loading} />}
      {step === 'LIST' && <GuestList eventData={eventData} onConfirm={handleConfirm} loading={loading} />}
      {step === 'SUCCESS' && <Success />}
    </div>
  );
}

export default App;
