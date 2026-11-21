(() => {
  'use strict';

  const root = document.documentElement;
  const themeButton = document.getElementById('themeButton');
  const themeLabel = document.getElementById('themeLabel');
  const themeValues = ['auto', 'dark', 'light'];
  const themeNames = { auto: 'авто', dark: 'тёмная', light: 'светлая' };
  let theme = 'auto';
  try {
    const saved = window.localStorage.getItem('one4sv-studio-theme');
    if (themeValues.includes(saved)) theme = saved;
  } catch (_) { /* The system theme still works if storage is unavailable. */ }

  function applyTheme(next) {
    theme = next;
    if (theme === 'auto') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
    themeLabel.textContent = themeNames[theme];
    themeButton.setAttribute('aria-label', `Тема: ${themeNames[theme]}. Нажмите для смены`);
    themeButton.setAttribute('title', `Тема: ${themeNames[theme]}. Нажмите для смены`);
    try { localStorage.setItem('one4sv-studio-theme', theme); } catch (_) {}
  }
  applyTheme(theme);
  themeButton.addEventListener('click', () => {
    applyTheme(themeValues[(themeValues.indexOf(theme) + 1) % themeValues.length]);
  });

  // Mouse/focus interaction is deliberately subtle: only the orbit marker
  // and the elevated numeral "4" respond to a pointer, never page layout.
  const heroMark = document.getElementById('heroMark');
  const orbitDot = heroMark.querySelector('.orbit-dot');
  const four = heroMark.querySelector('.logo-four');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function moveOrbit(event) {
    if (reduceMotion.matches) return;
    const r = heroMark.getBoundingClientRect();
    const dx = event.clientX - (r.left + r.width / 2);
    const dy = event.clientY - (r.top + r.height / 2);
    const angle = Math.atan2(dy, dx) + .14;
    orbitDot.style.left = `${50 + 50 * Math.cos(angle)}%`;
    orbitDot.style.top = `${50 + 50 * Math.sin(angle)}%`;
    const lift = -Math.min(7, Math.max(0, (r.height / 2 - Math.abs(dy)) * .055));
    four.style.setProperty('--lift', `${lift.toFixed(1)}px`);
  }
  function resetOrbit() {
    orbitDot.style.left = '86%';
    orbitDot.style.top = '9%';
    four.style.setProperty('--lift', '0px');
  }
  heroMark.addEventListener('pointermove', moveOrbit);
  heroMark.addEventListener('pointerleave', resetOrbit);
  heroMark.addEventListener('blur', resetOrbit);
  heroMark.addEventListener('focus', () => {
    orbitDot.style.left = '65%';
    orbitDot.style.top = '0%';
  });

  const screenshots = [
    { src: './assets/at-plans.webp', title: 'Планы и активности', caption: 'Планы и активности — интерфейс AchieveTogether', alt: 'Интерфейс планов и активностей AchieveTogether' },
    { src: './assets/at-settings.webp', title: 'Настройки', caption: 'Настройки, темы и оформление AchieveTogether', alt: 'Интерфейс настроек AchieveTogether' },
    { src: './assets/at-chat.webp', title: 'Чаты', caption: 'Общение и сообщения AchieveTogether', alt: 'Интерфейс чатов AchieveTogether' }
  ];
  let activeScreenshot = 0;
  let imageSwitchTimer = 0;
  const galleryMain = document.getElementById('galleryMain');
  const galleryCaption = document.getElementById('galleryCaption');
  const thumbs = [...document.querySelectorAll('[data-gallery]')];
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCount = document.getElementById('lightboxCount');
  const lightboxClose = document.getElementById('lightboxClose');
  const galleryOpen = document.getElementById('galleryOpen');

  function selectScreenshot(index) {
    activeScreenshot = (index + screenshots.length) % screenshots.length;
    const item = screenshots[activeScreenshot];
    clearTimeout(imageSwitchTimer);
    galleryMain.classList.add('fade');
    imageSwitchTimer = setTimeout(() => {
      galleryMain.src = item.src;
      galleryMain.alt = item.alt;
      galleryCaption.textContent = item.caption;
      galleryMain.classList.remove('fade');
    }, reduceMotion.matches ? 0 : 95);
    thumbs.forEach((thumb, thumbIndex) => {
      const active = thumbIndex === activeScreenshot;
      thumb.classList.toggle('is-active', active);
      if (active) thumb.setAttribute('aria-current', 'true');
      else thumb.removeAttribute('aria-current');
    });
    if (lightbox.open) {
      lightboxImage.src = item.src;
      lightboxImage.alt = item.alt;
      lightboxTitle.textContent = item.title;
      lightboxCount.textContent = `${activeScreenshot + 1} / ${screenshots.length}`;
    }
  }
  thumbs.forEach((thumb) => thumb.addEventListener('click', () => selectScreenshot(Number(thumb.dataset.gallery))));
  document.getElementById('galleryPrev').addEventListener('click', () => selectScreenshot(activeScreenshot - 1));
  document.getElementById('galleryNext').addEventListener('click', () => selectScreenshot(activeScreenshot + 1));
  document.getElementById('lightboxPrev').addEventListener('click', () => selectScreenshot(activeScreenshot - 1));
  document.getElementById('lightboxNext').addEventListener('click', () => selectScreenshot(activeScreenshot + 1));
  galleryOpen.addEventListener('click', () => {
    const item = screenshots[activeScreenshot];
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;
    lightboxTitle.textContent = item.title;
    lightboxCount.textContent = `${activeScreenshot + 1} / ${screenshots.length}`;
    lightbox.showModal();
    document.body.classList.add('modal-open');
    lightboxClose.focus();
  });
  function closeLightbox() { if (lightbox.open) lightbox.close(); }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target.dataset.close === 'true') closeLightbox();
  });
  lightbox.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    galleryOpen.focus();
  });
  document.addEventListener('keydown', (event) => {
    if (!lightbox.open) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); selectScreenshot(activeScreenshot - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); selectScreenshot(activeScreenshot + 1); }
  });

  const tabs = [...document.querySelectorAll('.project-tab')];
  const sections = tabs.map((tab) => document.getElementById(tab.dataset.target)).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (!visible.length) return;
      tabs.forEach((tab) => {
        const active = tab.dataset.target === visible[0].target.id;
        tab.classList.toggle('is-active', active);
        if (active) tab.setAttribute('aria-current', 'location');
        else tab.removeAttribute('aria-current');
      });
    }, { rootMargin: '-16% 0px -58% 0px', threshold: [0, .1, .3] });
    sections.forEach((section) => observer.observe(section));
  }
  document.getElementById('year').textContent = String(new Date().getFullYear());
})();
