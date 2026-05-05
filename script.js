const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-menu');
const form = document.getElementById('contactForm');
const statusText = document.getElementById('formStatus');

if (toggle && nav) {
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

if (form && statusText) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    statusText.className = '';

    const data = new FormData(form);
    const fullName = data.get('fullName')?.toString().trim();
    const email = data.get('email')?.toString().trim();
    const message = data.get('message')?.toString().trim();

    if (!fullName || !email || !message) {
      statusText.textContent = 'Compila i campi obbligatori: nome, email e messaggio.';
      statusText.classList.add('error');
      return;
    }

    const payload = {
      name: fullName,
      business: data.get('businessName')?.toString().trim() || 'Non specificato',
      email,
      phone: data.get('phone')?.toString().trim() || 'Non specificato',
      businessType: data.get('businessType')?.toString().trim() || 'Non specificato',
      message,
      sentAt: new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' })
    };

    try {
      const response = await fetch('https://formsubmit.co/ajax/team.socialup.ms@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          _subject: 'Nuova richiesta consulenza - Social Up',
          _template: 'table',
          Nome: payload.name,
          'Nome attività': payload.business,
          Email: payload.email,
          Telefono: payload.phone,
          'Tipo di attività': payload.businessType,
          Messaggio: payload.message,
          'Data e ora invio': payload.sentAt,
          _autoresponse:
            'Ciao, grazie per averci contattato. Abbiamo ricevuto la tua richiesta e ti ricontatteremo il prima possibile. — Social Up'
        })
      });

      if (!response.ok) throw new Error('Request failed');

      form.reset();
      statusText.textContent = 'Richiesta inviata con successo. Ti ricontatteremo il prima possibile.';
      statusText.classList.add('success');
    } catch (error) {
      statusText.textContent = 'Si è verificato un problema durante l’invio. Riprova tra poco.';
      statusText.classList.add('error');
    }
  });
}
