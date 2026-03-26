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
