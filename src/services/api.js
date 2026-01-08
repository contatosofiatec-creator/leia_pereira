import axios from 'axios';

const USE_MOCK = false; // AGORA VAI FUNCIONAR COM O PROXY
const SEARCH_WEBHOOK = "/api/search";
const CONFIRM_WEBHOOK = "/api/enviar_confirmacao";

const mockData = {
  "554899999999": {
    valid: true,
    event: "Casamento de Ana & Carlos",
    host: "Família Silva",
    guests: [
      { id: 1, name: "João Silva", status: "PENDENTE" },
      { id: 2, name: "Maria Silva", status: "PENDENTE" },
      { id: 3, name: "Pedro Silva", status: "SIM" }
    ]
  },
  "99999999999": {
    valid: true,
    event: "Aniversário 15 Anos",
    host: "Beatriz",
    guests: [
      { id: 10, name: "Teste User", status: "PENDENTE" }
    ]
  }
};

export const searchGuests = async (phone) => {
  // Normalize phone: remove non-numeric
  const cleanPhone = phone.replace(/\D/g, '');

  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = mockData[cleanPhone];
        if (result) resolve({ data: result });
        else resolve({ data: { valid: false, message: "Número não encontrado." } });
      }, 800);
    });
  }

  return axios.get(SEARCH_WEBHOOK, { params: { phone: cleanPhone } });
};

export const confirmGuests = async (phone, confirmedGuests) => {
  const cleanPhone = phone.replace(/\D/g, '');

  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { success: true } });
      }, 1000);
    });
  }

  return axios.post(CONFIRM_WEBHOOK, {
    phone: cleanPhone,
    guests: confirmedGuests // The argument name here is passed from App.jsx, which now receives the full object list
  });
};
