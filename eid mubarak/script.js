// ==========================================
// 1. KONFIGURASI FIREBASE
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyB-5VdKj3f8Z2j3h4k5l6m7n8o9p0q1",
  authDomain: "idul-fitri-pplg2.firebaseapp.com",
  databaseURL: "https://idul-fitri-pplg2-default-rtdb.firebaseio.com",
  projectId: "idul-fitri-pplg2",
  storageBucket: "idul-fitri-pplg2.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const wishesRef = database.ref('wishes');

// ==========================================
// 2. LOGIKA BACKGROUND SCROLL
// ==========================================
const bgImages = document.querySelectorAll('.bg-img');
const sections = document.querySelectorAll('section[id]');
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        let imageIndex = 0;
        if (id === 'section-hero') imageIndex = 0;
        else if (id === 'section-message') imageIndex = 1;
        else if (id === 'section-thr') imageIndex = 2;
        else if (id === 'section-wishes') imageIndex = 3;

        bgImages.forEach((img) => img.classList.remove('active'));
        if (bgImages[imageIndex]) bgImages[imageIndex].classList.add('active');
      }
    });
  },
  { root: null, rootMargin: '0px', threshold: 0.3 }
);

sections.forEach((section) => sectionObserver.observe(section));

// ==========================================
// 3. GENERATE BULAN KECIL & TECH NODES
// ==========================================
const nodesContainer = document.getElementById('techNodes');
for (let i = 0; i < 15; i++) {
  const crescent = document.createElement('div');
  crescent.className = 'floating-crescent';
  crescent.style.left = `${Math.random() * 100}%`;
  crescent.style.animationDuration = `${Math.random() * 15 + 10}s`;
  crescent.style.animationDelay = `${Math.random() * 5}s`;
  nodesContainer.appendChild(crescent);
}
for (let i = 0; i < 25; i++) {
  const node = document.createElement('div');
  node.className = 'node';
  node.style.left = `${Math.random() * 100}%`;
  const duration = Math.random() * 12 + 8;
  const delay = Math.random() * 6;
  node.style.animationDuration = `${duration}s`;
  node.style.animationDelay = `${delay}s`;
  const size = Math.random() * 3 + 1.5;
  node.style.width = `${size}px`;
  node.style.height = `${size}px`;
  if (Math.random() > 0.6) {
    node.style.background = 'var(--crescent-gold)';
    node.style.boxShadow = '0 0 8px var(--crescent-gold)';
  }
  nodesContainer.appendChild(node);
}

// ==========================================
// 4. LOGIKA COPY NOMOR
// ==========================================
function copyNumber() {
  const number = document.getElementById('danaNumber').innerText;
  navigator.clipboard
    .writeText(number)
    .then(() => showToast())
    .catch((err) => prompt("Salin nomor Dana/GoPay/OVO ini:", number));
}

function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ==========================================
// 5. LOGIKA FIREBASE UCAPAN
// ==========================================
const loadingDiv = document.getElementById('loading');
const containerDiv = document.getElementById('wishesContainer');

function renderWish(name, text) {
  return `<div class="wish-card">
    <p class="wish-author">🌙 ${escapeHtml(name)}</p>
    <p class="wish-text">${escapeHtml(text)}</p>
  </div>`;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

wishesRef.on('value', (snapshot) => {
  loadingDiv.style.display = 'none';
  containerDiv.innerHTML = '';
  const data = snapshot.val();
  if (data) {
    const wishesArray = Object.values(data).reverse();
    wishesArray.forEach((wish) => {
      containerDiv.innerHTML += renderWish(wish.name, wish.text);
    });
  } else {
    containerDiv.innerHTML =
      '<p class="no-wishes">🌙 Belum ada ucapan. Jadilah yang pertama mengirimkan doa! ✨</p>';
  }
});

document.getElementById('wishForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('inputName').value.trim();
  const text = document.getElementById('inputText').value.trim();
  if (name && text) {
    wishesRef
      .push({
        name: name,
        text: text,
        timestamp: Date.now(),
      })
      .then(() => this.reset())
      .catch((error) => {
        alert("Gagal mengirim. Cek koneksi & config Firebase.");
        console.error(error);
      });
  }
});

// ==========================================
// 6. PARTIKEL BULAN, BINTANG & REVEAL
// ==========================================
const pContainer = document.getElementById('particles');
for (let i = 0; i < 25; i++) {
  const p = document.createElement('div');
  const isStar = Math.random() > 0.6;
  const isGold = Math.random() > 0.5;
  if (isStar) {
    p.className = 'particle star-particle';
    p.style.background = isGold ? 'var(--crescent-gold)' : '#ffffff';
  } else {
    p.className = `particle ${isGold ? 'gold-particle' : ''}`;
  }
  const size = Math.random() * 6 + 2;
  p.style.width = `${size}px`;
  p.style.height = `${size}px`;
  p.style.left = `${Math.random() * 100}vw`;
  p.style.animationDuration = `${Math.random() * 12 + 12}s`;
  p.style.animationDelay = `${Math.random() * 6}s`;
  pContainer.appendChild(p);
}

const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  },
  { threshold: 0.1 }
);
reveals.forEach((el) => revealObserver.observe(el));

// ==========================================
// 7. CONFETTI BURST ON YEAR-BADGE CLICK
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const yearBadge = document.getElementById('yearBadge');
  const confettiContainer = document.getElementById('confettiContainer');
  if (yearBadge && confettiContainer) {
    yearBadge.addEventListener('click', function (e) {
      e.preventDefault();
      this.classList.add('clicked');
      setTimeout(() => this.classList.remove('clicked'), 300);
      confettiContainer.innerHTML = '';
      const count = 60;
      for (let i = 0; i < count; i++) {
        const piece = document.createElement('div');
        piece.classList.add('confetti-piece');
        const colors = [
          '#f4d03f',
          '#ffe066',
          '#ffffff',
          '#00f3ff',
          '#1d4a2c',
        ];
        piece.style.background =
          colors[Math.floor(Math.random() * colors.length)];
        const spreadX = Math.random() * 120 - 60;
        piece.style.setProperty('--spread-x', `${spreadX}px`);
        const rect = yearBadge.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const size = Math.random() * 8 + 4;
        piece.style.width = `${size}px`;
        piece.style.height = `${size}px`;
        piece.style.left = `${centerX}px`;
        piece.style.top = `${centerY}px`;
        const duration = Math.random() * 1.2 + 1;
        piece.style.animationDuration = `${duration}s`;
        confettiContainer.appendChild(piece);
      }
    });
  }
});