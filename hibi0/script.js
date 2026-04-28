/* ===========================
   hibi — script.js
   共通スクリプト（全ページ共有）
   =========================== */

'use strict';

// ============================================================
// PAGE LOAD REVEAL
// ============================================================
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// ============================================================
// NAV: scroll effect
// ============================================================
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ============================================================
// PARALLAX HERO
// ============================================================
(function () {
  const parallax = document.getElementById('heroParallax');
  if (!parallax) return;
  let ticking = false;
  function updateParallax() {
    parallax.style.transform = `translateY(${window.scrollY * 0.5}px)`;
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
  }, { passive: true });
})();

// ============================================================
// FADE-UP (Intersection Observer)
// ============================================================
(function () {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));
})();

// ============================================================
// SCROLL TO TOP
// ============================================================
document.getElementById('toTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// SMOOTH ANCHOR LINKS
// ============================================================
(function () {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('nav')?.offsetHeight || 0;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    });
  });
})();

// ============================================================
// CUSTOM CURSOR (desktop only)
// ============================================================
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const cursor = document.createElement('div');
  Object.assign(cursor.style, {
    position: 'fixed', top: '0', left: '0',
    width: '5px', height: '5px', borderRadius: '50%',
    background: 'rgba(196,168,130,0.75)', pointerEvents: 'none',
    zIndex: '9999', transform: 'translate(-50%,-50%)',
    transition: 'width 0.25s, height 0.25s, opacity 0.25s',
    mixBlendMode: 'screen',
  });
  document.body.appendChild(cursor);
  let mx = -100, my = -100;
  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
  (function loop() { cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; requestAnimationFrame(loop); })();
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, .kimochi-word'))
      Object.assign(cursor.style, { width: '28px', height: '28px', opacity: '0.25' });
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, .kimochi-word'))
      Object.assign(cursor.style, { width: '5px', height: '5px', opacity: '0.75' });
  });
})();

// ============================================================
// SP DRAWER MENU
// ============================================================
(function () {
  const hamburger = document.getElementById('navHamburger');
  const drawer    = document.getElementById('navDrawer');
  const closeBtn  = document.getElementById('navDrawerClose');

  function openDrawer()  { drawer?.classList.add('open');    document.body.style.overflow = 'hidden'; }
  function closeDrawer() { drawer?.classList.remove('open'); document.body.style.overflow = ''; }

  hamburger?.addEventListener('click', () => {
    drawer?.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  closeBtn?.addEventListener('click', closeDrawer);
  drawer?.addEventListener('click', (e) => { if (e.target === drawer) closeDrawer(); });

  window.closeDrawer = closeDrawer;
})();

// ============================================================
// KIMOCHI PICKER  (index.html only)
// script.js の「KIMOCHI PICKER」ブロック全体をこれで置き換え
// ============================================================
(function () {
  const stage  = document.getElementById('kimochiStage');
  const prompt = document.getElementById('kimochiPrompt');
  if (!stage) return;

  const ALL_WORDS = [
    'もやもや', 'ぼんやり', 'さびしい', 'ほっとした',
    'うれしい', 'ぐったり', 'すこしつかれた', 'おだやか',
    'ざわざわ', 'なんともない', 'あたたかい', 'そわそわ',
    'わくわく', 'むしゃくしゃ', 'ふわふわ', 'きゅっとした',
    'どきどき', 'つかれた', 'すっきり', 'どんより',
    'あんしん', 'あせり', 'おちつかない', 'なつかしい',
    'からっぽ',
  ];
  const DISPLAY_COUNT = 15;

  // シャッフル
  let seed = Date.now();
  function rng() { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; }
  const shuffled = ALL_WORDS.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const words = shuffled.slice(0, DISPLAY_COUNT);

  const elements = [];

  words.forEach((word, i) => {
    const el = document.createElement('p');
    el.className = 'kimochi-word';
    el.textContent = word;
    el.style.transitionDelay = `${(0.1 + i * 0.06).toFixed(2)}s`;

    el.addEventListener('click', () => {
      el.classList.add('is-selected');
      setTimeout(() => {
        if (prompt) prompt.style.opacity = '0';
        elements.forEach(e => e.classList.add('is-gone'));
        setTimeout(() => {
          const nextSection = document.getElementById('kimochi')?.nextElementSibling;
          if (nextSection) {
            const navH = document.getElementById('nav')?.offsetHeight || 0;
            window.scrollTo({
              top: nextSection.getBoundingClientRect().top + window.scrollY - navH,
              behavior: 'smooth',
            });
          }
        }, 900);
      }, 300);
    });

    stage.appendChild(el);
    elements.push(el);
    requestAnimationFrame(() => requestAnimationFrame(() => { el.style.opacity = '1'; }));
  });
})();

// ============================================================
// TOJIRU  (index.html only)
// ============================================================
(function () {
  const textarea  = document.getElementById('tojiruTextarea');
  const counter   = document.getElementById('tojiruCounter');
  const btn       = document.getElementById('tojiruBtn');
  const prompt    = document.getElementById('tojiruPrompt');
  const fieldWrap = document.getElementById('tojiruFieldWrap');
  const actions   = document.getElementById('tojiruActions');
  const done      = document.getElementById('tojiruDone');
  const tsuduru   = document.getElementById('tojiruTsuduru');
  if (!textarea) return;

  const MAX = 200;
  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    counter.textContent = `${len} / ${MAX}`;
    counter.classList.toggle('over', len > MAX);
    btn.disabled = len > MAX;
  });

  btn.addEventListener('click', () => {
    if (textarea.value.trim() === '') return;
    prompt.style.opacity      = '0';
    fieldWrap.style.opacity   = '0';
    fieldWrap.style.transform = 'translateY(-10px)';
    actions.style.opacity     = '0';
    setTimeout(() => {
      prompt.style.display    = 'none';
      fieldWrap.style.display = 'none';
      actions.style.display   = 'none';
      done.classList.add('visible');
      setTimeout(() => { tsuduru?.classList.add('visible'); }, 400);
    }, 700);
  });
})();

// ============================================================
// PRODUCT PAGE — Gallery  (products-note/lamp/candle.html)
// ============================================================
(function () {
  const slides  = document.querySelectorAll('.gallery-main-img');
  const thumbs  = document.querySelectorAll('.gallery-thumb');
  const counter = document.getElementById('galleryCounter');
  if (!slides.length) return;

  let current = 0;
  function goTo(idx) {
    slides[current].classList.remove('active');
    thumbs[current]?.classList.remove('active');
    current = idx;
    slides[current].classList.add('active');
    thumbs[current]?.classList.add('active');
    if (counter) counter.textContent =
      String(current + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
  }
  thumbs.forEach((thumb) => thumb.addEventListener('click', () => goTo(parseInt(thumb.dataset.index))));
  setInterval(() => goTo((current + 1) % slides.length), 4000);
})();

// ============================================================
// PRODUCT PAGE — Option buttons
// ============================================================
document.querySelectorAll('.option-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const group = btn.dataset.group;
    document.querySelectorAll(`.option-btn[data-group="${group}"]`).forEach((b) => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

// ============================================================
// PRODUCT PAGE — Quantity
// ============================================================
(function () {
  const num = document.getElementById('qtyNum');
  if (!num) return;
  let qty = 1;
  document.getElementById('qtyMinus')?.addEventListener('click', () => { if (qty > 1)  { qty--; num.textContent = qty; } });
  document.getElementById('qtyPlus')?.addEventListener('click',  () => { if (qty < 10) { qty++; num.textContent = qty; } });
})();

// ============================================================
// PRODUCT PAGE — Toast
// ============================================================
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  if (msg) toast.textContent = msg;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 2800);
}
document.getElementById('cartBtn')?.addEventListener('click', () => showToast());
document.getElementById('stickyCartBtn')?.addEventListener('click', () => showToast());
document.getElementById('wishlistBtn')?.addEventListener('click', () => {
  showToast('お気に入りに追加しました。');
  setTimeout(() => {
    const toast = document.getElementById('toast');
    if (toast) toast.textContent = 'カートに追加しました。';
  }, 3200);
});

// ============================================================
// PRODUCT PAGE — Sticky bar
// ============================================================
(function () {
  const hero = document.getElementById('productHero');
  const bar  = document.getElementById('stickyBar');
  if (!hero || !bar) return;
  new IntersectionObserver(
    (entries) => bar.classList.toggle('visible', !entries[0].isIntersecting),
    { threshold: 0 }
  ).observe(hero);
})();

// ============================================================
// PRODUCTS LIST PAGE — Filter & Sort  (products.html)
// ============================================================
(function () {
  const grid       = document.getElementById('plGrid');
  const filterBtns = document.querySelectorAll('.pl-filter-btn');
  const sortSelect = document.getElementById('sortSelect');
  const countNum   = document.getElementById('plCountNum');
  if (!grid) return;

  let currentFilter = 'all';
  let currentSort   = 'default';

  function getCards() { return Array.from(grid.querySelectorAll('.pl-card')); }

  function applyFilter(filter) {
    currentFilter = filter;
    let visible = 0;
    getCards().forEach((card) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !show);
      if (show) visible++;
    });

    // ワイドカードのspan調整
    grid.querySelectorAll('.pl-card--wide').forEach((card) => {
      card.style.gridColumn = (filter !== 'all' && filter !== 'set') ? 'span 1' : '';
    });

    if (countNum) countNum.textContent = visible;

    let empty = document.querySelector('.pl-empty');
    if (visible === 0) {
      if (!empty) {
        empty = document.createElement('div');
        empty.className = 'pl-empty';
        empty.innerHTML = '<div class="pl-empty-icon">（ ）</div><p class="pl-empty-msg">該当するプロダクトが見つかりませんでした。</p>';
        grid.parentElement.insertBefore(empty, grid.nextSibling);
      }
      empty.classList.add('visible');
      grid.style.display = 'none';
    } else {
      empty?.classList.remove('visible');
      grid.style.display = '';
    }
  }

  function applySort(sort) {
    currentSort = sort;
    const cards = getCards();
    cards.sort((a, b) => {
      if (sort === 'price-asc')  return +a.dataset.price - +b.dataset.price;
      if (sort === 'price-desc') return +b.dataset.price - +a.dataset.price;
      if (sort === 'newest')     return +b.dataset.order - +a.dataset.order;
      return +a.dataset.order - +b.dataset.order;
    });
    cards.forEach((card) => grid.appendChild(card));
  }

  filterBtns.forEach((btn) => btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(btn.dataset.filter);
    applySort(currentSort);
  }));
  sortSelect?.addEventListener('change', () => applySort(sortSelect.value));
  applySort('default');
})();

// ============================================================
// PRODUCTS LIST PAGE — Card image parallax on hover
// ============================================================
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.pl-card').forEach((card) => {
    const imgWrap = card.querySelector('.pl-card-img-wrap');
    const img     = card.querySelector('.pl-card-img');
    if (!imgWrap || !img) return;
    card.addEventListener('mousemove', (e) => {
      const r = imgWrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      img.style.transform = `scale(1.07) translate(${x * 10}px, ${y * 8}px)`;
    });
    card.addEventListener('mouseleave', () => { img.style.transform = ''; });
  });
})();

// ============================================================
// PRODUCTS LIST PAGE — Filter bar background on scroll
// ============================================================
(function () {
  const bar = document.querySelector('.pl-filter-bar');
  if (!bar) return;
  function onScroll() {
    bar.style.background = window.scrollY > 80
      ? 'rgba(30,32,41,0.92)'
      : 'rgba(30,32,41,0.75)';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ============================================================
// JOURNAL LIST PAGE — Filter  (journal.html)
// ============================================================
(function () {
  const filterBtns = document.querySelectorAll('.jl-filter-btn');
  const featured   = document.getElementById('jlFeatured');
  const grid       = document.getElementById('jlGrid');
  const countEl    = document.getElementById('jlCountNum');
  const emptyEl    = document.getElementById('jlEmpty');
  if (!grid) return;

  function getCards() { return Array.from(grid.querySelectorAll('.jl-card')); }

  function updateFeatured(card) {
    if (!featured || !card) return;
    const img    = featured.querySelector('.jl-featured-img');
    const title  = featured.querySelector('.jl-featured-title');
    const desc   = featured.querySelector('.jl-featured-desc');
    const link   = featured.querySelector('.jl-featured-link');
    const catEl  = featured.querySelector('.jl-cat');
    const dateEl = featured.querySelector('.jl-date');
    if (img)    { img.src = card.dataset.img || img.src; img.alt = card.dataset.title || img.alt; }
    if (title)  title.textContent  = card.dataset.title    || title.textContent;
    if (desc)   desc.textContent   = card.dataset.desc     || desc.textContent;
    if (link)   link.href          = card.dataset.href     || link.href;
    if (catEl)  catEl.textContent  = card.dataset.category || catEl.textContent;
    if (dateEl) dateEl.textContent = (card.dataset.date || '').replace(/-/g, '.');
    featured.dataset.category = card.dataset.category;
    featured.dataset.date     = card.dataset.date;
  }

  function getNewest(cards) {
    return cards.slice().sort((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date))[0] || null;
  }

  function applyJlFilter(filter) {
    const cards = getCards();
    const matchedCards = cards.filter(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !show);
      return show;
    });

    let newestCard = null;
    if (featured) {
      newestCard = getNewest(matchedCards);
      if (newestCard) {
        updateFeatured(newestCard);
        featured.classList.remove('is-hidden');
        newestCard.classList.add('is-hidden');
      } else {
        featured.classList.add('is-hidden');
      }
    }

    const gridVisible = matchedCards.filter(c => !c.classList.contains('is-hidden')).length;
    const totalVisible = (newestCard ? 1 : 0) + gridVisible;
    if (countEl) countEl.textContent = totalVisible;
    if (emptyEl) emptyEl.classList.toggle('visible', totalVisible === 0);
    if (grid)    grid.style.opacity = gridVisible > 0 ? '' : '0';
  }

  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyJlFilter(btn.dataset.filter);
  }));

  applyJlFilter('all');

  // URLパラメータによる初期フィルター
  const params = new URLSearchParams(window.location.search);
  const paramFilter = params.get('filter');
  if (paramFilter) {
    const targetBtn = document.querySelector(`.jl-filter-btn[data-filter="${paramFilter}"]`);
    (targetBtn || document.querySelector('.jl-filter-btn[data-filter="all"]'))?.click();
  }
})();

// ============================================================
// JOURNAL LIST PAGE — Filter bar scroll bg  (journal.html)
// ============================================================
(function () {
  const bar = document.querySelector('.jl-filter');
  if (!bar) return;
  const observer = new IntersectionObserver(
    ([entry]) => bar.classList.toggle('scrolled', !entry.isIntersecting),
    { threshold: 0 }
  );
  const header = document.getElementById('jlHeader');
  if (header) observer.observe(header);
})();

// ============================================================
// JOURNAL LIST PAGE — Image parallax on hover
// ============================================================
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  // Featured
  const featured = document.getElementById('jlFeatured');
  if (featured) {
    const img = featured.querySelector('.jl-featured-img');
    if (img) {
      featured.addEventListener('mousemove', (e) => {
        const r = featured.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        img.style.transform = `scale(1.07) translate(${x * 14}px, ${y * 8}px)`;
      });
      featured.addEventListener('mouseleave', () => { img.style.transform = 'scale(1.02)'; });
    }
  }

  // Cards
  document.querySelectorAll('.jl-card').forEach(card => {
    const imgWrap = card.querySelector('.jl-card-img-wrap');
    const img     = card.querySelector('.jl-card-img');
    if (!imgWrap || !img) return;
    card.addEventListener('mousemove', (e) => {
      const r = imgWrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      img.style.transform = `scale(1.07) translate(${x * 9}px, ${y * 6}px)`;
    });
    card.addEventListener('mouseleave', () => { img.style.transform = ''; });
  });
})();

// ============================================================
// JOURNAL LIST PAGE — Newsletter form
// ============================================================
(function () {
  const form  = document.getElementById('jlNewsletterForm');
  const input = document.getElementById('jlEmailInput');
  const msg   = document.getElementById('jlNewsletterMsg');
  if (!form || !input || !msg) return;

  function isValidEmail(val) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()); }

  function showMsg(text, isError) {
    msg.textContent = text;
    msg.classList.toggle('error', isError);
    msg.style.opacity = '1';
    if (!isError) {
      setTimeout(() => { msg.style.opacity = '0'; setTimeout(() => { msg.textContent = ''; }, 400); }, 5000);
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val)            { showMsg('メールアドレスをご入力ください。', true); return; }
    if (!isValidEmail(val)) { showMsg('正しいメールアドレスの形式でご入力ください。', true); return; }
    const btn = form.querySelector('.jl-newsletter-btn');
    if (btn) { btn.disabled = true; btn.style.opacity = '0.5'; }
    setTimeout(() => {
      input.value = '';
      showMsg('ご登録ありがとうございます。次の更新をお楽しみに。', false);
      if (btn) { btn.disabled = false; btn.style.opacity = ''; }
    }, 900);
  });

  input.addEventListener('focus', () => {
    if (msg.classList.contains('error')) { msg.textContent = ''; msg.classList.remove('error'); }
  });
})();

// ============================================================
// JOURNAL ARTICLE PAGE — Hero parallax  (journal-article*.html)
// ============================================================
(function () {
  const heroWrap = document.querySelector('.ja-hero-img-wrap');
  if (!heroWrap) return;
  let ticking = false;
  function update() {
    const heroH = document.getElementById('jaHero')?.offsetHeight || 0;
    if (window.scrollY <= heroH * 1.2)
      heroWrap.style.transform = `translateY(${window.scrollY * 0.38}px)`;
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
})();

// ============================================================
// JOURNAL ARTICLE PAGE — Reading progress bar
// ============================================================
(function () {
  const fill    = document.getElementById('jaProgressFill');
  const article = document.getElementById('jaArticle');
  if (!fill || !article) return;
  let ticking = false;
  function update() {
    const rect = article.getBoundingClientRect();
    const articleTop = rect.top + window.scrollY;
    const scrolled   = window.scrollY + window.innerHeight - articleTop;
    const total      = article.offsetHeight + window.innerHeight;
    fill.style.width = Math.min(100, Math.max(0, (scrolled / total) * 100)) + '%';
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();

// ============================================================
// JOURNAL ARTICLE PAGE — Table of contents
// ============================================================
(function () {
  const tocList = document.getElementById('jaTocList');
  const article = document.getElementById('jaArticle');
  if (!tocList || !article) return;

  const headings = article.querySelectorAll('[data-heading]');
  headings.forEach((section, i) => {
    section.id = section.id || `section-${i + 1}`;
    const a = document.createElement('a');
    a.className   = 'ja-toc-link';
    a.href        = `#${section.id}`;
    a.textContent = section.dataset.heading;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const navH = document.getElementById('nav')?.offsetHeight || 0;
      window.scrollTo({
        top: document.getElementById(section.id).getBoundingClientRect().top + window.scrollY - navH - 32,
        behavior: 'smooth'
      });
    });
    const li = document.createElement('li');
    li.className = 'ja-toc-item';
    li.appendChild(a);
    tocList.appendChild(li);
  });

  const links = tocList.querySelectorAll('.ja-toc-link');
  function updateActive() {
    const navH = document.getElementById('nav')?.offsetHeight || 0;
    let activeIdx = -1;
    headings.forEach((s, i) => { if (s.getBoundingClientRect().top - navH - 48 <= 0) activeIdx = i; });
    links.forEach((l, i) => l.classList.toggle('active', i === activeIdx));
  }
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();

// ============================================================
// JOURNAL ARTICLE PAGE — Share buttons
// ============================================================
(function () {
  const copyBtn = document.getElementById('jaShareCopy');
  const xBtn    = document.getElementById('jaShareX');
  const toast   = document.getElementById('jaToast');
  if (!copyBtn && !xBtn) return;

  function showJaToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 2600);
  }

  copyBtn?.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(window.location.href); showJaToast('URLをコピーしました。'); }
    catch { showJaToast('コピーできませんでした。'); }
  });

  xBtn?.addEventListener('click', () => {
    const text = encodeURIComponent(document.title);
    const url  = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
  });
})();

// ============================================================
// MEMBERSHIP PAGE — FAQ accordion
// ============================================================
function toggleFaq(btn) {
  const item   = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach((el) => el.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ============================================================
// LOGIN PAGE — Tab switch
// ============================================================
function switchTab(tab) {
  document.getElementById('tabLogin')    ?.classList.toggle('active', tab === 'login');
  document.getElementById('tabRegister') ?.classList.toggle('active', tab === 'register');
  document.getElementById('panelLogin')    ?.classList.toggle('active', tab === 'login');
  document.getElementById('panelRegister') ?.classList.toggle('active', tab === 'register');
}

// ============================================================
// LOGIN PAGE — Plan selection
// ============================================================
function selectPlan(plan) {
  document.getElementById('planFree')?.classList.toggle('selected', plan === 'free');
  document.getElementById('planPlus')?.classList.toggle('selected', plan === 'plus');
}

// ============================================================
// LOGIN PAGE — Checkbox toggle
// ============================================================
function toggleCheck(id) {
  document.getElementById(id)?.classList.toggle('checked');
}

// ============================================================
// LOGIN PAGE — Password visibility
// ============================================================
function togglePass(inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn   = document.getElementById(btnId);
  if (!input || !btn) return;
  if (input.type === 'password') { input.type = 'text';     btn.textContent = 'hide'; }
  else                           { input.type = 'password'; btn.textContent = 'show'; }
}

// ============================================================
// LOGIN PAGE — Validation helper
// ============================================================
function showErr(id, show) {
  document.getElementById(id)?.classList.toggle('visible', show);
}

// ============================================================
// LOGIN PAGE — Handle login
// ============================================================
function handleLogin() {
  const email = document.getElementById('loginEmail')?.value.trim();
  const pass  = document.getElementById('loginPass')?.value;
  let ok = true;
  if (!email || !/\S+@\S+\.\S+/.test(email)) { showErr('loginEmailErr', true);  ok = false; }
  else                                          { showErr('loginEmailErr', false); }
  if (!pass) { showErr('loginPassErr', true);  ok = false; }
  else       { showErr('loginPassErr', false); }
  if (ok) alert('ログイン処理（実装時に認証APIと接続）');
}

// ============================================================
// LOGIN PAGE — Handle register
// ============================================================
function handleRegister() {
  const email = document.getElementById('regEmail')?.value.trim();
  const pass  = document.getElementById('regPass')?.value;
  const conf  = document.getElementById('regPassConf')?.value;
  const terms = document.getElementById('termsCheck')?.classList.contains('checked');
  let ok = true;
  if (!email || !/\S+@\S+\.\S+/.test(email)) { showErr('regEmailErr', true);  ok = false; }
  else                                          { showErr('regEmailErr', false); }
  if (!pass || pass.length < 8) { showErr('regPassErr', true);  ok = false; }
  else                           { showErr('regPassErr', false); }
  if (pass !== conf) { showErr('regPassConfErr', true);  ok = false; }
  else               { showErr('regPassConfErr', false); }
  if (!terms) { alert('利用規約への同意が必要です。'); ok = false; }
  if (ok) alert('登録処理（実装時に認証APIと接続）');
}

// ============================================================
// LOGIN PAGE — Password reset modal
// ============================================================
function openReset() {
  document.getElementById('resetOverlay')?.classList.add('visible');
}
function closeReset() {
  document.getElementById('resetOverlay')?.classList.remove('visible');
}
function handleReset() {
  const email = document.getElementById('resetEmail')?.value.trim();
  const msg   = document.getElementById('resetMsg');
  if (!msg) return;
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    msg.style.color = '#c07070'; msg.textContent = 'メールアドレスを正しく入力してください。'; msg.style.opacity = '1';
    return;
  }
  msg.style.color = 'var(--accent)'; msg.textContent = 'ご案内メールをお送りしました。'; msg.style.opacity = '1';
}
(function () {
  document.getElementById('resetOverlay')?.addEventListener('click', function (e) {
    if (e.target === this) closeReset();
  });
})();

// ---- Philosophy Ring Canvas ----
(function () {
  const canvas = document.getElementById('ringCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const SIZE = 600;
  const DPR = window.devicePixelRatio || 1;
  canvas.width  = SIZE * DPR;
  canvas.height = SIZE * DPR;
  canvas.style.width  = SIZE + 'px';
  canvas.style.height = SIZE + 'px';
  ctx.scale(DPR, DPR);

  const cx = SIZE / 2;
  const cy = SIZE / 2;

  const rings = [
    { r: 230, speed: 10, tailLength: 1.8 },
    { r: 290, speed: 16, tailLength: 1.4 }
  ];

  const angles = rings.map(() => -Math.PI / 2);
  angles[1] = -Math.PI / 2 + Math.PI * 0.7;
  let lastTime = null;

  function drawRing(ring, angle, tailLength) {
    const { r } = ring;

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(196,168,130,0.07)';
    ctx.lineWidth = 1;
    ctx.stroke();

    const tailStart = angle - tailLength;
    const steps = 80;
    for (let i = 0; i < steps; i++) {
      const t0 = i / steps;
      const t1 = (i + 1) / steps;
      const a0 = tailStart + tailLength * t0;
      const a1 = tailStart + tailLength * t1;
      const alpha = t0 * 0.55;
      ctx.beginPath();
      ctx.arc(cx, cy, r, a0, a1);
      ctx.strokeStyle = `rgba(196,168,130,${alpha.toFixed(3)})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  function animate(ts) {
    if (!lastTime) lastTime = ts;
    const dt = (ts - lastTime) / 1000;
    lastTime = ts;

    ctx.clearRect(0, 0, SIZE, SIZE);

    rings.forEach((ring, i) => {
      angles[i] += (Math.PI * 2 / ring.speed) * dt;
      if (angles[i] > Math.PI * 2 - Math.PI / 2) {
        angles[i] -= Math.PI * 2;
      }
      drawRing(ring, angles[i], ring.tailLength);
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();


// ---- Membership Hero Particles ----
(function () {
  const canvas  = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx     = canvas.getContext('2d');
  const content = document.getElementById('heroContent');

  let W, H, exclusionRect;
  const PARTICLE_COUNT = 80;
  let particles = [];

  function getExclusionRect() {
    const rect = content.getBoundingClientRect();
    const pad  = 60;
    return {
      x: rect.left   - pad,
      y: rect.top    - pad,
      w: rect.width  + pad * 2,
      h: rect.height + pad * 2,
    };
  }

  function randomPosOutsideRect(ex) {
    let x, y, tries = 0;
    do {
      x = Math.random() * W;
      y = Math.random() * H;
      tries++;
    } while (
      tries < 100 &&
      x > ex.x && x < ex.x + ex.w &&
      y > ex.y && y < ex.y + ex.h
    );
    return { x, y };
  }

  function createParticle(ex) {
    const { x, y } = randomPosOutsideRect(ex);
    const size = Math.random() < 0.18 ? 2 : 1;
    return {
      x, y, size,
      baseAlpha: 0.3 + Math.random() * 0.5,
      alpha:     Math.random(),
      speed:     0.0001 + Math.random() * 0.002, // ← 明滅スピード
      phase:     Math.random() * Math.PI * 2,
      vx:        (Math.random() - 0.5) * 0.025,
      vy:        (Math.random() - 0.5) * 0.025,
    };
  }

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    init();
  }

  function init() {
    exclusionRect = getExclusionRect();
    particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(exclusionRect));
  }

  function isInExclusion(x, y, ex) {
    return x > ex.x && x < ex.x + ex.w && y > ex.y && y < ex.y + ex.h;
  }

  let lastTime = 0;
  function animate(ts) {
    const dt = ts - lastTime;
    lastTime = ts;
    ctx.clearRect(0, 0, W, H);
    exclusionRect = getExclusionRect();

    particles.forEach(p => {
      p.phase += p.speed * dt;
      const brightness = (Math.sin(p.phase) + 1) / 2;
      p.alpha = p.baseAlpha * brightness;

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      if (isInExclusion(p.x, p.y, exclusionRect)) {
        p.vx *= -1;
        p.vy *= -1;
        p.x  += p.vx * 2;
        p.y  += p.vy * 2;
      }

      if (p.size > 1) {
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 6);
        glow.addColorStop(0,   `rgba(217,196,168,${Math.min(p.alpha * 1.8, 1).toFixed(3)})`);
        glow.addColorStop(0.5, `rgba(196,168,130,${(p.alpha * 0.5).toFixed(3)})`);
        glow.addColorStop(1,   'rgba(196,168,130,0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(196,168,130,${p.alpha.toFixed(3)})`;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener('load', () => {
    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(animate);
  });
})();