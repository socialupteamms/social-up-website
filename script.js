const nav = document.querySelector('.navbar');
document.getElementById('hamburger')?.addEventListener('click', (e) => {
  const expanded = e.currentTarget.getAttribute('aria-expanded') === 'true';
  e.currentTarget.setAttribute('aria-expanded', String(!expanded));
  nav.classList.toggle('open');
});

const form = document.getElementById('contactForm');
const message = document.getElementById('message');
const counter = document.getElementById('counter');
const statusEl = document.getElementById('formStatus');

message?.addEventListener('input', () => {
  counter.textContent = `${message.value.length} / 1000`;
});

// Per invio reale su sito statico: configura EmailJS con le tue credenziali.
// window.SOCIAL_UP_EMAIL = { serviceId: '...', templateId: '...', publicKey: '...' }
async function sendWithEmailJS(payload) {
  if (!window.emailjs || !window.SOCIAL_UP_EMAIL) throw new Error('EmailJS non configurato');
  const { serviceId, templateId, publicKey } = window.SOCIAL_UP_EMAIL;
  window.emailjs.init(publicKey);
  return window.emailjs.send(serviceId, templateId, payload);
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.textContent = '';
  const data = Object.fromEntries(new FormData(form).entries());
  if (!data.fullName || !data.businessName || !data.email || !data.phone || !data.message) return;
  if (data.message.length > 1000) return;

  const payload = {
    subject: 'Nuova richiesta consulenza Social Up',
    fullName: data.fullName,
    businessName: data.businessName,
    email: data.email,
    phone: data.phone,
    message: data.message
  };

  try {
    await sendWithEmailJS(payload);
    statusEl.textContent = 'Richiesta inviata con successo. Ti ricontatteremo al più presto.';
    form.reset();
    counter.textContent = '0 / 1000';
  } catch {
    const body = encodeURIComponent(`Nome e cognome: ${payload.fullName}\nNome attività: ${payload.businessName}\nEmail: ${payload.email}\nTelefono: ${payload.phone}\nMessaggio: ${payload.message}`);
    window.location.href = `mailto:team.socialup.ms@gmail.com?subject=${encodeURIComponent(payload.subject)}&body=${body}`;
    statusEl.textContent = 'Si è verificato un errore durante l’invio. Riprova tra qualche minuto o scrivici direttamente a team.socialup.ms@gmail.com.';
  }
});
