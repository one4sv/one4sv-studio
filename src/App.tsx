import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { createPortal } from 'react-dom';

type ThemeChoice = 'auto' | 'light' | 'dark';
type Screenshot = { src: string; title: string; description: string };
type Project = {
  id: string;
  number: string;
  name: string;
  heading: ReactNode;
  category: string;
  intro: string;
  description: string;
  technologies: string[];
  openUrl: string;
  sourceUrl: string;
  screenshots: Screenshot[];
};

const projects: Project[] = [
  {
    id: 'achieve-together',
    number: '01',
    name: 'Achieve Together',
    heading: <>Achieve<br />Together<span className="period">.</span></>,
    category: 'Социальная платформа',
    intro: 'Привычки, планы и совместные достижения.',
    description: 'Я создаю пространство, в котором можно планировать дела, отмечать прогресс, делиться результатами и общаться. Всё в одном приложении.',
    technologies: ['React 19', 'TypeScript', 'Vite', 'SCSS', 'Node.js', 'Express', 'Supabase', 'Chart.js'],
    openUrl: 'https://achievetogether.vercel.app/',
    sourceUrl: 'https://github.com/one4sv/AT',
    screenshots: [
      { src: '/assets/at-plans.webp', title: 'Планы и активности', description: 'Календарь, планы и отслеживание выполнения' },
      { src: '/assets/at-settings.webp', title: 'Настройки', description: 'Темы, персонализация и управление приложением' },
      { src: '/assets/at-chat.webp', title: 'Чаты', description: 'Общение, вложения и реакции' }
    ]
  },
  {
    id: 'localhost-manager',
    number: '02',
    name: 'Localhost Manager',
    heading: <>Localhost<br />Manager<span className="period">.</span></>,
    category: 'Инструменты разработчика',
    intro: 'Локальные сервисы под контролем.',
    description: 'Моё приложение для Windows: запускаю, останавливаю и отслеживаю проекты и их сервисы из одного интерфейса. Здесь есть логи, диагностика, настройки и управление процессами.',
    technologies: ['C#', '.NET 8', 'WPF', 'XAML', 'Windows Forms'],
    openUrl: 'https://github.com/one4sv/Localhost-Manager/releases',
    sourceUrl: 'https://github.com/one4sv/Localhost-Manager',
    screenshots: [
      { src: '/assets/localhost-manager.webp', title: 'Мои проекты', description: 'Панель проектов, локальные сервисы и логи' }
    ]
  }
];

const futureProjects = [
  { name: 'oneAcc', status: 'в разработке', text: 'Единый аккаунт для сервисов студии.' },
  { name: 'oneVault', status: 'на паузе', text: 'Защищённое пространство личных данных.' },
  { name: 'Atrium', status: 'на паузе', text: 'Идея будущего проекта.' },
  { name: "let’s Meet", status: 'на паузе', text: 'Идея будущего проекта.' }
];

const getInitialTheme = (): ThemeChoice => {
  try {
    const value = window.localStorage.getItem('one4sv-theme');
    if (value === 'auto' || value === 'light' || value === 'dark') return value;
    const legacy = window.localStorage.getItem('one4sv-studio-theme');
    if (legacy === 'auto' || legacy === 'light' || legacy === 'dark') return legacy;
  } catch { /* Private mode can disable storage. */ }
  return 'auto';
};

function Arrow({ direction }: { direction: 'left' | 'right' }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {direction === 'left' ? <path d="m14 5-7 7 7 7" /> : <path d="m10 5 7 7-7 7" />}
  </svg>;
}

function Brand({ big = false }: { big?: boolean }) {
  return <span className={big ? 'brand-name brand-name-big' : 'brand-name'}>
    <span>one</span><span className="brand-green brand-four">4</span><span className="brand-green">sv.</span><span>studio</span>
  </span>;
}

function ThemePicker() {
  const [theme, setTheme] = useState<ThemeChoice>(getInitialTheme);
  const [opened, setOpened] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const labels: Record<ThemeChoice, string> = { auto: 'Авто', light: 'Светлая', dark: 'Тёмная' };

  useEffect(() => {
    if (theme === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', theme);
    try { window.localStorage.setItem('one4sv-theme', theme); } catch { /* ignore */ }
  }, [theme]);

  useEffect(() => {
    if (!opened) return;
    const closeOutside = (event: PointerEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) setOpened(false);
    };
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpened(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeEscape);
    };
  }, [opened]);

  return <div className="theme-picker" ref={pickerRef}>
    <button type="button" className="theme-trigger" onClick={() => setOpened(!opened)} aria-expanded={opened} aria-haspopup="menu" aria-label={'Тема: ' + labels[theme]}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8m-4-3v3" /></svg>
      <span>{labels[theme]}</span><span className="down-chevron" aria-hidden="true">⌄</span>
    </button>
    {opened && <div className="theme-menu" role="menu" aria-label="Выбор темы">
      {(['auto', 'dark', 'light'] as ThemeChoice[]).map(value =>
        <button key={value} type="button" role="menuitemradio" aria-checked={theme === value} className={theme === value ? 'theme-option selected' : 'theme-option'} onClick={() => { setTheme(value); setOpened(false); }}>
          {labels[value]}{theme === value && <span aria-hidden="true">✓</span>}
        </button>
      )}
    </div>}
  </div>;
}

function Header() {
  return <header className="header" id="top">
    <div className="container header-inside">
      <a className="header-brand" href="#top" aria-label="one4sv.studio — наверх"><Brand /></a>
      <nav className="main-nav" aria-label="Основная навигация"><a href="#projects">проекты</a><a href="#about">о студии</a><a href="#contacts">контакты</a></nav>
      <div className="header-actions">
        <a className="github-link" href="https://github.com/one4sv" target="_blank" rel="noopener noreferrer" aria-label="GitHub one4sv">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.08c-3.08.67-3.73-1.31-3.73-1.31-.5-1.28-1.23-1.28-1.62-1.28-1.62-1.01-.69.08-.67.08-.67 1.12.08 1.71 1.15 1.71 1.15 1 .1.74 1.52 3.19 1.06.1-.72.39-1.21.71-1.49-2.46-.28-5.05-1.23-5.05-5.49 0-1.21.43-2.2 1.15-2.98-.11-.28-.5-1.41.11-2.94 0 0 .94-.3 3.05 1.14A10.5 10.5 0 0 1 12 6.15c.94 0 1.88.13 2.76.37 2.11-1.43 3.04-1.14 3.04-1.14.61 1.53.23 2.66.11 2.94.72.78 1.15 1.77 1.15 2.98 0 4.27-2.6 5.21-5.08 5.48.4.35.76 1.04.76 2.1v3.11c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"/></svg>
        </a>
        <ThemePicker />
      </div>
    </div>
  </header>;
}

function Gallery({ project, onOpen }: { project: Project; onOpen: (project: Project, index: number) => void }) {
  const [current, setCurrent] = useState(0);
  const screenshots = project.screenshots;
  const currentImage = screenshots[current];
  const change = (delta: number) => setCurrent(index => (index + delta + screenshots.length) % screenshots.length);
  return <div className="project-gallery">
    <button type="button" className="gallery-open" aria-label={'Открыть скриншот: ' + currentImage.title} onClick={() => onOpen(project, current)}>
      <div className="browser-bar"><div className="window-dots"><i /><i /><i /></div><span>{project.name}</span><span className="gallery-open-icon" aria-hidden="true">↗</span></div>
      <div className="gallery-stage"><img src={currentImage.src} alt={currentImage.title + ' — ' + project.name} loading={project.id === 'achieve-together' ? 'eager' : 'lazy'} /></div>
    </button>
    <div className="gallery-bottom">
      <div className="gallery-description"><strong>{currentImage.title}</strong><span>{currentImage.description}</span></div>
      <div className="gallery-navigation">
        {screenshots.length > 1 && <button className="round-arrow" type="button" onClick={() => change(-1)} aria-label="Предыдущий скриншот"><Arrow direction="left" /></button>}
        <span className="gallery-counter">{current + 1} / {screenshots.length}</span>
        {screenshots.length > 1 && <button className="round-arrow" type="button" onClick={() => change(1)} aria-label="Следующий скриншот"><Arrow direction="right" /></button>}
      </div>
    </div>
  </div>;
}

type ViewerState = { project: Project; index: number } | null;

function ImagePreview({ state, onClose, onChange }: { state: ViewerState; onClose: () => void; onChange: (index: number) => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!state) return;
    const previousOverflow = document.body.style.overflow;
    const focusedElement = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); onChange(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); onChange(1); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      focusedElement?.focus();
    };
  }, [Boolean(state), onClose, onChange]);

  if (!state) return null;
  const { project, index } = state;
  const screenshot = project.screenshots[index];
  return createPortal(
    <div className="preview-overlay" role="dialog" aria-modal="true" aria-label={'Просмотр скриншота ' + project.name}>
      <button type="button" className="preview-backdrop" aria-label="Закрыть просмотр" onClick={onClose} />
      <div className="preview-content">
        <div className="preview-header">
          <div><span className="preview-category">Проект {project.number}</span><h3>{project.name}</h3></div>
          <button className="round-arrow preview-close" type="button" aria-label="Закрыть" onClick={onClose} ref={closeButtonRef}>×</button>
        </div>
        <div className="preview-layout">
          <div className="preview-image-area">
            <img src={screenshot.src} alt={screenshot.title + ' — ' + project.name} />
            {project.screenshots.length > 1 && <>
              <button className="round-arrow preview-arrow preview-prev" type="button" onClick={() => onChange(-1)} aria-label="Предыдущий скриншот"><Arrow direction="left" /></button>
              <button className="round-arrow preview-arrow preview-next" type="button" onClick={() => onChange(1)} aria-label="Следующий скриншот"><Arrow direction="right" /></button>
            </>}
          </div>
          <aside className="preview-info">
            <span className="preview-category">{project.category}</span>
            <h4>{screenshot.title}</h4>
            <p>{screenshot.description}</p>
            <div className="preview-tech">{project.technologies.map(item => <span key={item}>{item}</span>)}</div>
            <div className="preview-links">
              <a href={project.openUrl} target="_blank" rel="noopener noreferrer">Открыть проект ↗</a>
              <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">Исходный код ↗</a>
            </div>
            <div className="preview-count">{index + 1} / {project.screenshots.length}</div>
          </aside>
        </div>
      </div>
    </div>, document.body
  );
}

function ProjectSection({ project, onOpen }: { project: Project; onOpen: (project: Project, index: number) => void }) {
  return <section id={project.id} className="project-section container">
    <div className="section-kicker"><span>{project.number} /</span> {project.category}</div>
    <div className="project-columns">
      <div className="project-copy">
        <div className="project-icon" aria-hidden="true">{project.id === 'achieve-together' ? 'AT' : '>_'}</div>
        <h2>{project.heading}</h2>
        <p className="project-lead">{project.intro}</p>
        <p className="project-description">{project.description}</p>
        <div className="project-actions">
          <a className="action action-primary" href={project.openUrl} target="_blank" rel="noopener noreferrer">Открыть проект <span aria-hidden="true">↗</span></a>
          <a className="action action-secondary" href={project.sourceUrl} target="_blank" rel="noopener noreferrer">Исходный код <span aria-hidden="true">↗</span></a>
        </div>
        <div className="tech-list" aria-label={'Технологии ' + project.name}>
          {project.technologies.map(tech => <span key={tech}>{tech}</span>)}
        </div>
      </div>
      <Gallery project={project} onOpen={onOpen}/>
    </div>
  </section>;
}

function App() {
  const [viewer, setViewer] = useState<ViewerState>(null);
  const handleClose = () => setViewer(null);
  const handleChange = (delta: number) => setViewer(current => current ? ({
    ...current, index: (current.index + delta + current.project.screenshots.length) % current.project.screenshots.length
  }) : null);

  return <div className="site-root">
    <Header />
    <main>
      <section className="hero container" aria-labelledby="hero-title">
        <div className="hero-note"><span className="green-dot" /> independent digital studio</div>
        <div className="hero-brand"><div className="orbit" aria-hidden="true"><span /></div><h1 id="hero-title"><Brand big /></h1></div>
        <p>Продукты, сервисы и немного экспериментов.</p>
      </section>

      <div className="project-tabs-shell" id="projects">
        <nav className="project-tabs container" aria-label="Проекты">
          <a href="#achieve-together">Achieve Together <small>01</small></a>
          <a href="#localhost-manager">Localhost Manager <small>02</small></a>
          <a href="#future-projects">Будущие проекты <small>03</small></a>
        </nav>
      </div>

      {projects.map(project => <ProjectSection key={project.id} project={project} onOpen={(p, index) => setViewer({ project: p, index })} />)}

      <section className="future-section container" id="future-projects">
        <div className="section-kicker"><span>03 /</span> дальше</div>
        <h2>Следующие идеи<span className="period">.</span></h2>
        <p className="future-intro">Я работаю над новыми продуктами. Часть идей пока отложена.</p>
        <div className="future-grid">{futureProjects.map(project =>
          <article key={project.name} className="future-card"><span>{project.status}</span><h3>{project.name}</h3><p>{project.text}</p></article>
        )}</div>
      </section>

      <section className="about-section container" id="about">
        <div className="section-kicker">/ о студии</div>
        <div className="about-content"><h2>Небольшая студия.<br /><span>Внимание к деталям.</span></h2><p>one4sv.studio — место, где я собираю свои проекты, пробую идеи и создаю инструменты, которыми хочется пользоваться каждый день.</p></div>
      </section>
    </main>
    <footer id="contacts"><div className="container footer-content">
      <div><a href="#top"><Brand /></a><p>Создаю и развиваю свои проекты.</p></div>
      <div className="footer-actions"><a href="https://github.com/one4sv" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="https://t.me/one4sv" target="_blank" rel="noopener noreferrer">Telegram ↗</a></div>
      <span>© {new Date().getFullYear()} one4sv.studio</span>
    </div></footer>
    <ImagePreview state={viewer} onClose={handleClose} onChange={handleChange} />
  </div>;
}
export default App;
