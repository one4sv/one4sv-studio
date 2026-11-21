(() => {
  'use strict';

  const root = document.documentElement;
  const themeButton = document.getElementById('themeButton');
  const themeLabel = document.getElementById('themeLabel');
  const themeDropdown = document.getElementById('themeDropdown');
  const themeMenu = document.getElementById('themeMenu');
  const themeOptions = [...document.querySelectorAll('.theme-option')];
  const themeValues = ['auto', 'dark', 'light'];
  const themeNames = { auto: 'авто', dark: 'тёмная', light: 'светлая' };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let theme = 'auto';
  try {
    const saved = localStorage.getItem('one4sv-studio-theme');
    if (themeValues.includes(saved)) theme = saved;
  } catch (_) { /* System theme works when storage is unavailable. */ }

  function setMenuState(open) {
    themeDropdown.classList.toggle('is-open', open);
    themeButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    themeMenu.hidden = !open;
  }
  function applyTheme(next) {
    theme = next;
    if (theme === 'auto') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
    themeLabel.textContent = themeNames[theme];
    themeButton.setAttribute('aria-label', `Тема: ${themeNames[theme]}`);
    themeButton.setAttribute('title', `Тема: ${themeNames[theme]}`);
    themeOptions.forEach(option => {
      const active = option.dataset.themeValue === theme;
      option.classList.toggle('is-active', active);
      option.setAttribute('aria-checked', active ? 'true' : 'false');
    });
    try { localStorage.setItem('one4sv-studio-theme', theme); } catch (_) {}
  }
  applyTheme(theme);
  themeButton.addEventListener('click', () => setMenuState(themeMenu.hidden));
  themeOptions.forEach(option => option.addEventListener('click', () => {
    applyTheme(option.dataset.themeValue);
    setMenuState(false);
  }));
  document.addEventListener('click', event => {
    if (!themeDropdown.contains(event.target)) setMenuState(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setMenuState(false);
  });

  const screenshots = [
    { src: './assets/at-plans.webp', title: 'Планы и активности', caption: 'Планы и активности — интерфейс Achieve Together', alt: 'Интерфейс планов и активностей Achieve Together' },
    { src: './assets/at-settings.webp', title: 'Настройки', caption: 'Настройки, темы и оформление Achieve Together', alt: 'Интерфейс настроек Achieve Together' },
    { src: './assets/at-chat.webp', title: 'Чаты', caption: 'Общение и сообщения Achieve Together', alt: 'Интерфейс чатов Achieve Together' }
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
