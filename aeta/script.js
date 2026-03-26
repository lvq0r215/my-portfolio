// =====================
// loading
// =====================

window.addEventListener("load", () => {
  const loading = document.getElementById("loading");
  setTimeout(() => {
    loading.classList.add("hide");
  }, 1200);
});


// =====================
// hero zoom
// =====================

window.addEventListener("load", () => {
  document.querySelector(".hero-img").style.transform = "scale(1)";
});


// =====================
// fade animation
// =====================

const fades = document.querySelectorAll(".fade");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, {
  threshold: 0.2
});

fades.forEach(el => {
  observer.observe(el);
});


// =====================
// PC nav: 表示タイミング制御
// =====================

const header = document.querySelector(".header");
const hideSections = document.querySelectorAll(".hide-nav");

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      header.classList.remove("show");
    } else {
      header.classList.add("show");
    }
  });
}, {
  threshold: 0.2
});

hideSections.forEach(section => {
  navObserver.observe(section);
});


// =====================
// PC nav: カラー切り替え (dark-bg セクション)
// =====================

const lightSections = document.querySelectorAll(".dark-bg");

const colorObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      header.classList.add("light");
    } else {
      header.classList.remove("light");
    }
  });
}, {
  threshold: .4
});

lightSections.forEach(section => {
  colorObserver.observe(section);
});


// =====================
// SP/タブレット ハンバーガーメニュー
// =====================

const hamburger = document.getElementById("hamburger");
const drawer = document.getElementById("drawer");
const drawerClose = document.getElementById("drawerClose");
const drawerOverlay = document.getElementById("drawerOverlay");
const drawerLinks = document.querySelectorAll(".drawer-link");

function openDrawer() {
  drawer.classList.add("open");
  drawerOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  drawer.classList.remove("open");
  drawerOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

hamburger.addEventListener("click", openDrawer);
drawerClose.addEventListener("click", closeDrawer);
drawerOverlay.addEventListener("click", closeDrawer);

// リンクをタップしたらドロワーを閉じてスクロール
drawerLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    closeDrawer();
    // ドロワーが閉じてからスクロール
    setTimeout(() => {
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 350);
  });
});


// =====================
// ハンバーガーアイコン: 背景に応じた色切り替え
// (ヒーロー・ギャラリー・メッセージ上は白/beige、それ以外は brown)
// =====================

function updateHamburgerColor() {
  // ヒーロー・ギャラリー・メッセージは暗背景 → beige (デフォルト)
  // concept・menu・footer(green) → brown or manage separately
  const hero = document.querySelector(".hero");
  const rect = hero.getBoundingClientRect();

  // ヒーロー内またはダーク系セクション内にいるか判定
  const darkSections = document.querySelectorAll(".hero, .gallery, #message, .dark-bg");
  let onDark = false;
  darkSections.forEach(sec => {
    const r = sec.getBoundingClientRect();
    if (r.top <= 40 && r.bottom >= 40) {
      onDark = true;
    }
  });

  if (onDark) {
    hamburger.classList.remove("on-light");
  } else {
    hamburger.classList.add("on-light");
  }
}

window.addEventListener("scroll", updateHamburgerColor, { passive: true });
window.addEventListener("load", updateHamburgerColor);


// =====================
// parallax
// =====================

const gallery = document.querySelector(".gallery");

const slow   = document.querySelectorAll(".vertical-text");
const middle = document.querySelectorAll(".img3,.img5");
const fast   = document.querySelectorAll(".img1,.img2,.img4");

// デバイス幅によってパララックス強度を調整
function getParallaxRatios() {
  const w = window.innerWidth;
  if (w <= 600) {
    // スマホ: 控えめに
    return { slow: 0.06, middle: 0.10, fast: 0.15 };
  } else if (w <= 900) {
    // タブレット: 中程度
    return { slow: 0.09, middle: 0.14, fast: 0.20 };
  } else {
    // PC: オリジナル
    return { slow: 0.12, middle: 0.18, fast: 0.28 };
  }
}

let ratios = getParallaxRatios();

window.addEventListener("resize", () => {
  ratios = getParallaxRatios();
});

function parallax() {
  const rect = gallery.getBoundingClientRect();
  const scroll = -rect.top;

  const limit = gallery.offsetHeight + 200;

  if (scroll > -300 && scroll < limit) {
    slow.forEach(el => {
      el.style.transform = `translateY(${-scroll * ratios.slow}px)`;
    });

    middle.forEach(el => {
      el.style.transform = `translateY(${-scroll * ratios.middle}px)`;
    });

    fast.forEach(el => {
      el.style.transform = `translateY(${-scroll * ratios.fast}px)`;
    });
  }

  requestAnimationFrame(parallax);
}

parallax();
