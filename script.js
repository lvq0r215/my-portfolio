// ─── Header scroll ───
const header = document.getElementById('header');
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      header.classList.toggle('scrolled', window.scrollY > 10);
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// ─── Hamburger ───
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navMobile.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

hamburger.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    hamburger.click();
  }
});

document.querySelectorAll('.nav-mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMobile.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// ─── Hero entrance（index.html） ───
/* ════════════════════════════════════
   ヒーロー JavaScript
   script.js の既存ヒーロー入場アニメーション部分
   （heroInner 関連）をこちらに置き換えてください
   ════════════════════════════════════ */

// ─── Hero entrance ───
const heroInner = document.getElementById('heroInner');
if (heroInner) {
  setTimeout(() => {
    heroInner.classList.add('visible');
  }, 120);
}

// ─── Work hero entrance（works-.html） ───
const workHero = document.getElementById('workHero');
if (workHero) {
  setTimeout(() => workHero.classList.add('visible'), 100);
}

// ─── Page header entrance（about.html） ───
const pageHeader = document.getElementById('pageHeader');
if (pageHeader) {
  setTimeout(() => pageHeader.classList.add('visible'), 100);
}

// ─── Scroll reveal ───
const revealEls = document.querySelectorAll('.reveal, .section');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => io.observe(el));

// ─── Skill bars（about.html） ───
const skillBars = document.querySelectorAll('.skill-bar');
if (skillBars.length > 0) {
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width + '%';
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  skillBars.forEach(bar => barObserver.observe(bar));
}

// ─── Contact form（index.html） ───
const form = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');
if (form && success) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    // エラー表示をリセット
    form.querySelectorAll('.field-error').forEach(el => el.remove());
    form.querySelectorAll('[aria-invalid]').forEach(el => {
      el.removeAttribute('aria-invalid');
      el.style.borderColor = '';
    });

    const inputs = form.querySelectorAll('[required]');
    let valid = true;

    inputs.forEach(input => {
      input.style.borderColor = '';
      let errorMsg = '';

      if (!input.value.trim()) {
        errorMsg = 'この項目は必須です';
      } else if (
        input.type === 'email' &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)
      ) {
        errorMsg = '正しいメールアドレスを入力してください';
      }

      if (errorMsg) {
        input.style.borderColor = '#c0391a';
        input.setAttribute('aria-invalid', 'true');
        const msg = document.createElement('p');
        msg.className = 'field-error';
        msg.textContent = errorMsg;
        msg.style.cssText = 'color:#c0391a; font-size:11.5px; margin-top:4px;';
        input.insertAdjacentElement('afterend', msg);
        valid = false;
      }
    });

    if (!valid) return;

    const btn = form.querySelector('.btn-submit');
    btn.disabled = true;
    btn.textContent = '送信中...';

    const data = new FormData(form);
    fetch(form.action, {
      method: 'POST',
      mode: 'no-cors',
      body: data,
    })
    .catch(() => {})
    .finally(() => {
      btn.disabled = false;
      btn.textContent = '送信する';
    });

    form.style.display = 'none';
    success.classList.add('show');
  });
}

/* ════════════════════════════════════
   キャッチコピー 中央配置 JS
   script.js の末尾に追記してください。
   （以前追記した hero-copy 関連の JS があれば
   　そちらはすべて削除してからこちらを追記）
   ════════════════════════════════════ */

(function () {
  const inner     = document.getElementById('heroInner');
  const cloudImg  = inner && inner.querySelector('.hero-cloud img');
  const copyLeft  = inner && inner.querySelector('.hero-copy--left');
  const copyRight = inner && inner.querySelector('.hero-copy--right');

  if (!inner || !cloudImg || !copyLeft || !copyRight) return;

  function positionCopies() {
    const innerRect = inner.getBoundingClientRect();
    const cloudRect = cloudImg.getBoundingClientRect();

    /* inner 左端を基準とした雲の左端・右端 */
    const cloudL = cloudRect.left  - innerRect.left;   // 雲左端（innerからの距離）
    const cloudR = innerRect.right - cloudRect.right;  // 雲右端（innerからの距離）

    /* 左コピー：画面左端〜雲左端の中央
       inner は .hero の padding 内に収まるので、
       innerRect.left = .hero の padding-left ぶんだけ画面左端からずれている */
    const gapLeftTotal  = cloudRect.left;              // 画面左端〜雲左端（px）
    const gapRightTotal = window.innerWidth - cloudRect.right; // 雲右端〜画面右端（px）

    /* 中央 x 座標（画面基準） → inner 基準に変換 */
    const centerLeftScreen  = gapLeftTotal  / 2;
    const centerRightScreen = window.innerWidth - gapRightTotal / 2;

    const centerLeftInner  = centerLeftScreen  - innerRect.left;
    const centerRightInner = centerRightScreen - innerRect.left;

    /* left プロパティで配置（テキストの水平中心を合わせる） */
    copyLeft.style.left      = centerLeftInner  + 'px';
    copyLeft.style.right     = 'auto';
    copyLeft.style.transform = 'translate(-50%, -50%)';

    copyRight.style.left     = centerRightInner + 'px';
    copyRight.style.right    = 'auto';
    copyRight.style.transform = 'translate(-50%, -50%)';

    /* 表示 */
    copyLeft.classList.add('ready');
    copyRight.classList.add('ready');
  }

  /* 雲画像ロード後に実行 */
  function init() {
    positionCopies();
    window.addEventListener('resize', positionCopies);
  }

  if (cloudImg.complete && cloudImg.naturalWidth > 0) {
    init();
  } else {
    cloudImg.addEventListener('load', init);
    setTimeout(init, 1000); // フォールバック
  }
})();

// ─── Work All List — カーソル追従画像 ───
(function () {
  const cursorBox = document.getElementById('workCursorImg');
  const cursorImg = document.getElementById('workCursorImgEl');
  if (!cursorBox || !cursorImg) return;

 if (window.innerWidth <= 1024) return;

  let mouseX = 0, mouseY = 0;
  let rafId = null;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorBox.classList.contains('visible')) {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        cursorBox.style.left = mouseX + 'px';
        cursorBox.style.top  = mouseY + 'px';
      });
    }
  }, { passive: true });

  document.querySelectorAll('.work-all-item a[data-img]').forEach(link => {
    link.addEventListener('mouseenter', () => {
      const src = link.dataset.img;
      if (!src) return;

      // 一度クラスを外してアニメーションをリセット
      cursorBox.classList.remove('visible');
      cursorImg.src = src;
      cursorBox.style.left = mouseX + 'px';
      cursorBox.style.top  = mouseY + 'px';

      // 次フレームで visible を付与して出現アニメを確実に走らせる
      requestAnimationFrame(() => {
        cursorBox.classList.add('visible');
      });
    });

    link.addEventListener('mouseleave', () => {
      cursorBox.classList.remove('visible');
    });
  });
})();