// ─── ДАННЫЕ ─────────────────────────────────────────────
// Замените src на пути к реальным фото, например: "images/kartina1.jpg"
const paintings = [
  { id:1,  title:"Заяц",         size:"17 × 21 см", material:"Картон",  src:"https://picsum.photos/seed/p1/600/450"  },
  { id:2,  title:"Осенний лес",             size:"40 × 60 см", material:"Картон", src:"https://picsum.photos/seed/p2/600/450"  },
  { id:3,  title:"Утренний туман",          size:"60 × 80 см", material:"Холст",  src:"https://picsum.photos/seed/p3/600/450"  },
  { id:4,  title:"Горное озеро",            size:"30 × 40 см", material:"Картон", src:"https://picsum.photos/seed/p4/600/450"  },
  { id:5,  title:"Южный берег",             size:"50 × 50 см", material:"Холст",  src:"https://picsum.photos/seed/p5/600/450"  },
  { id:6,  title:"Первый снег",             size:"70 × 90 см", material:"Холст",  src:"https://picsum.photos/seed/p6/600/450"  },
  { id:7,  title:"Цветущий сад",            size:"45 × 60 см", material:"Картон", src:"https://picsum.photos/seed/p7/600/450"  },
  { id:8,  title:"Вечерняя гавань",         size:"60 × 80 см", material:"Холст",  src:"https://picsum.photos/seed/p8/600/450"  },
  { id:9,  title:"Дождь над полем",         size:"40 × 55 см", material:"Картон", src:"https://picsum.photos/seed/p9/600/450"  },
  { id:10, title:"Белые ночи",              size:"50 × 70 см", material:"Холст",  src:"https://picsum.photos/seed/p10/600/450" },
  { id:11, title:"Старый маяк",             size:"35 × 50 см", material:"Картон", src:"https://picsum.photos/seed/p11/600/450" },
  { id:12, title:"Рассвет в горах",         size:"80 × 100 см",material:"Холст",  src:"https://picsum.photos/seed/p12/600/450" },
  { id:13, title:"Тихая заводь",            size:"40 × 60 см", material:"Холст",  src:"https://picsum.photos/seed/p13/600/450" },
  { id:14, title:"Весенний мотив",          size:"30 × 40 см", material:"Картон", src:"https://picsum.photos/seed/p14/600/450" },
  { id:15, title:"Море в штиль",            size:"60 × 80 см", material:"Холст",  src:"https://picsum.photos/seed/p15/600/450" },
  { id:16, title:"Осенний натюрморт",       size:"50 × 65 см", material:"Картон", src:"https://picsum.photos/seed/p16/600/450" },
  { id:17, title:"Полевые цветы",           size:"40 × 50 см", material:"Холст",  src:"https://picsum.photos/seed/p17/600/450" },
  { id:18, title:"Зимний этюд",             size:"25 × 35 см", material:"Картон", src:"https://picsum.photos/seed/p18/600/450" },
];

// ─── СОСТОЯНИЕ ──────────────────────────────────────────
let currentFilter = 'all';
let currentSearch = '';

// ─── ЭЛЕМЕНТЫ DOM ───────────────────────────────────────
const grid    = document.getElementById('grid');
const empty   = document.getElementById('empty');
const badge   = document.getElementById('count-badge');
const lightbox = document.getElementById('lightbox');
const lbImg      = document.getElementById('lb-img');
const lbTitle    = document.getElementById('lb-title');
const lbSize     = document.getElementById('lb-size');
const lbMaterial = document.getElementById('lb-material');

// ─── ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ────────────────────────────
function plural(n, forms) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}

function getFiltered() {
  return paintings.filter(p => {
    const matchFilter = currentFilter === 'all' || p.material.toLowerCase() === currentFilter;
    const matchSearch = p.title.toLowerCase().includes(currentSearch.toLowerCase());
    return matchFilter && matchSearch;
  });
}

// ─── РЕНДЕР КАРТОЧЕК ────────────────────────────────────
function renderCards() {
  grid.querySelectorAll('.card').forEach(c => c.remove());

  const filtered = getFiltered();
  badge.textContent = filtered.length + ' ' + plural(filtered.length, ['работа','работы','работ']);

  if (filtered.length === 0) {
    empty.classList.add('show');
    return;
  }
  empty.classList.remove('show');

  filtered.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', p.title);
    card.innerHTML = `
      <div class="card-img-wrap">
        <img src="${p.src}" alt="${p.title}" loading="lazy" decoding="async" width="600" height="450">
        <div class="card-overlay">
          <div class="overlay-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          </div>
        </div>
        <span class="card-material-tag">${p.material}</span>
      </div>
      <div class="card-body">
        <h2 class="card-title">${p.title}</h2>
        <div class="card-details">
          <span>${p.size}</span>
          <span class="sep"></span>
          <span>${p.material}</span>
        </div>
      </div>`;

    card.addEventListener('click', () => openLightbox(p));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(p); }
    });
    grid.appendChild(card);

    // Анимация появления с задержкой
    const delay = Math.min(i * 60, 500);
    setTimeout(() => requestAnimationFrame(() => card.classList.add('visible')), delay);
  });
}

// ─── ФИЛЬТРЫ ────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderCards();
  });
});

let searchTimer;
document.getElementById('search').addEventListener('input', e => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    currentSearch = e.target.value.trim();
    renderCards();
  }, 180);
});

// ─── ЛАЙТБОКС ───────────────────────────────────────────
function openLightbox(p) {
  lbImg.src = p.src;
  lbImg.alt = p.title;
  lbTitle.textContent = p.title;
  lbSize.textContent = p.size;
  lbMaterial.textContent = p.material;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('lb-close-btn').focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('lb-close-btn').addEventListener('click', closeLightbox);
document.getElementById('lb-close-x').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ─── ИНИЦИАЛИЗАЦИЯ ──────────────────────────────────────
renderCards();
