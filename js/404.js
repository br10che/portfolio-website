/* ============================================================
   404.js — small script for the "page not found" page
   (script.js isn't loaded here: it expects the home page.)
   ============================================================ */

/* Same theme and language the visitor chose on the home page */
function getSaved(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
}

const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
document.documentElement.dataset.theme = getSaved('theme') || (prefersLight ? 'light' : 'dark');

const texts = {
    en: { title: 'this page spilled out',
          text: "The address doesn't exist, or it moved. Everything else is still on the home page.",
          home: 'back home', tab: 'Page not found' },
    el: { title: 'αυτή η σελίδα σκόρπισε',
          text: 'Η διεύθυνση δεν υπάρχει ή έχει μετακινηθεί. Όλα τα υπόλοιπα είναι στην αρχική σελίδα.',
          home: 'πίσω στην αρχική', tab: 'Η σελίδα δεν βρέθηκε' },
    ru: { title: 'эта страница рассыпалась',
          text: 'Такого адреса нет, или он переехал. Всё остальное по-прежнему на главной странице.',
          home: 'на главную', tab: 'Страница не найдена' },
};

let lang = getSaved('lang');
if (!texts[lang]) {
    const browser = (navigator.language || 'en').slice(0, 2);
    lang = texts[browser] ? browser : 'en';
}
const t = texts[lang];
document.documentElement.lang = lang;
document.title = `${t.tab} · Viola Sanyan`;
document.getElementById('nfTitle').textContent = t.title;
document.getElementById('nfText').textContent = t.text;
document.getElementById('nfHome').textContent = t.home;

/* The 0s and 1s in the open capsule (same idea as on the home page) */
const pillBits  = document.getElementById('pillBits');
const bitColors = ['var(--accent)', 'var(--accent-2)', 'var(--text)'];
const tilt = 40 * Math.PI / 180;
const bits = [];

for (let i = 0; i < 18; i++) {
    const bit = document.createElement('span');
    bit.className = 'pill-bit';
    bit.textContent = Math.random() < 0.5 ? '0' : '1';
    const across = (i / 17 - 0.5) * 200 + (Math.random() - 0.5) * 12;
    const along  = (Math.random() - 0.5) * 60;
    bit.style.setProperty('--x', `${across * Math.sin(tilt) + along * Math.cos(tilt)}px`);
    bit.style.setProperty('--y', `${across * Math.cos(tilt) - along * Math.sin(tilt)}px`);
    bit.style.setProperty('--o', (0.55 + Math.random() * 0.45).toFixed(2));
    bit.style.fontSize = `${11 + Math.random() * 12}px`;
    bit.style.color = bitColors[i % bitColors.length];
    pillBits.append(bit);
    bits.push(bit);
}

// Flip a digit now and then, like on the home page
setInterval(() => {
    const bit = bits[Math.floor(Math.random() * bits.length)];
    bit.textContent = bit.textContent === '0' ? '1' : '0';
}, 150);
