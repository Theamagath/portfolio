import { For, Show, createEffect, createMemo, createSignal, onCleanup, onMount } from 'solid-js';
import { experiences, expertise, profile, projects, updateContent, type Project, type ProjectCategory } from './data/content';
import { onSnapshot } from 'firebase/firestore';
import { contentRef } from './firebase';
import { experienceGroups, type ExperienceGroup } from './data/experience';

const filters = ['Semua', 'Web App', 'UI/UX', 'Desain Grafis', 'Publikasi'] as const;
const navigation = [
  { id: 'work', label: 'Karya' },
  { id: 'about', label: 'Tentang' },
  { id: 'expertise', label: 'Keahlian' },
  { id: 'experience', label: 'Pengalaman' },
  { id: 'contact', label: 'Kontak' },
];
type Filter = (typeof filters)[number];

function BrandAvatar(props: { photo: string }) {
  return <Show when={props.photo} fallback={<span>{profile.shortName}</span>}>
    <img class="brand-avatar" src={props.photo} alt={`Foto ${profile.name}`} />
  </Show>;
}

function ArrowIcon(props: { diagonal?: boolean; size?: number }) {
  return props.diagonal ? (
    <svg width={props.size ?? 18} height={props.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M6 18 18 6M7 6h11v11" />
    </svg>
  ) : (
    <svg width={props.size ?? 18} height={props.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4 12h16m-7-7 7 7-7 7" />
    </svg>
  );
}

function SunMoonIcon(props: { dark: boolean }) {
  return (
    <Show when={props.dark} fallback={<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" /></svg>}>
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
    </Show>
  );
}

function VisualCard(props: { project: Project }) {
  return (
    <div class={`project-visual visual-${props.project.visual} ${props.project.image ? 'has-cover' : ''}`}>
      <Show when={props.project.image}>
        <img class="project-cover" src={props.project.image} alt={`Sampul karya ${props.project.title}`} loading="lazy" />
        <span class="project-cover-title">{props.project.title}</span>
      </Show>
      <Show when={!props.project.image}>
      <Show when={props.project.visual === 'website'}>
        <div class="website-preview">
          <div class="website-preview-bar"><span aria-hidden="true">● ● ●</span><span>{props.project.link ? new URL(props.project.link).hostname : 'Galeri desain'}</span></div>
          <div class={`website-preview-body ${props.project.publication ? 'publication-preview-body' : ''}`}><span>{props.project.publication ?? (props.project.category === 'Desain Grafis' ? 'DESAIN GRAFIS' : `WEB DEVELOPMENT / 0${props.project.id}`)}</span><strong>{props.project.title}</strong><span class="website-preview-label">{props.project.publication ? 'Baca jurnal' : props.project.category === 'Desain Grafis' ? 'Lihat galeri' : 'Jelajahi website'} <ArrowIcon diagonal size={22}/></span></div>
        </div>
      </Show>
      <Show when={props.project.visual === 'dashboard'}>
        <div class="dash-window">
          <div class="dash-side"><span class="dash-mark">in.</span><span class="dash-side-lines" /><span class="dash-side-lines short" /><span class="dash-side-lines" /><span class="dash-side-bottom">◈</span></div>
          <div class="dash-main">
            <div class="dash-header"><b>Analytics Overview</b><span>● ● ●</span></div>
            <div class="dash-metrics"><div><small>Visitors</small><b>24.8k</b><em>↗ 12.4%</em></div><div><small>Revenue</small><b>8.9m</b><em>↗ 8.2%</em></div><div><small>Growth</small><b>+18%</b><em>↗ 4.8%</em></div></div>
            <div class="dash-graph"><div class="dash-graph-title">Performance <span>Last 7 days</span></div><svg viewBox="0 0 420 130" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="dashArea" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#8adaad" stop-opacity=".5"/><stop offset="1" stop-color="#8adaad" stop-opacity="0" /></linearGradient></defs><path d="M0 95 C35 84 43 114 81 85 S137 43 175 64 S232 93 267 47 S320 60 351 28 S385 39 420 8 L420 130 L0 130Z" fill="url(#dashArea)"/><path d="M0 95 C35 84 43 114 81 85 S137 43 175 64 S232 93 267 47 S320 60 351 28 S385 39 420 8" stroke="#2d845f" stroke-width="3" fill="none" /></svg></div>
          </div>
        </div>
      </Show>
      <Show when={props.project.visual === 'mobile'}>
        <div class="mobile-orb one" /><div class="mobile-orb two" />
        <div class="phone-shadow" /><div class="mobile-device">
          <div class="mobile-notch" /><div class="mobile-app-top"><span>nova<span class="brand-dot">.</span></span><span>✳</span></div>
          <div class="mobile-welcome">Find your<br /><b>daily balance.</b></div>
          <div class="mobile-hero-card"><div class="mobile-hero-sun"/><span>YOUR DAILY MOMENT</span><b>Take a breath.</b></div>
          <div class="mobile-progress"><small>Daily activity</small><b>78%</b><div><span/></div></div>
          <div class="mobile-tabbar">⌂ <span>◉</span> ≋ <span>☻</span></div>
        </div>
        <span class="mobile-side-type">BETTER DAYS, BY DESIGN.</span>
      </Show>
      <Show when={props.project.visual === 'branding'}>
        <div class="brand-outline">M</div><div class="brand-circle"/><div class="brand-text"><small>INDEPENDENT CREATIVE STUDIO</small><b>MONO<span>®</span></b><p>Make things<br />matter.</p></div><div class="brand-bottom"><span>IDENTITY / DIGITAL / EXPERIENCE</span><span>↗</span></div>
      </Show>
      <Show when={props.project.visual === 'analytics'}>
        <div class="analytics-panel"><div class="analytics-top"><span>flow<span>●</span></span><span>Overview &nbsp; ↗</span></div><div class="analytics-title">Good morning, Alex ✳</div><div class="analytics-sub">Here's what happened with your projects.</div><div class="analytics-stats"><div><small>Total tasks</small><strong>1,284</strong><span>↗ 24%</span></div><div><small>Completed</small><strong>896</strong><span>↗ 18%</span></div></div><div class="analytics-bars"><div class="analytics-bars-top"><b>Weekly progress</b><span>VIEW ALL ↗</span></div><div class="bars"><For each={[48, 72, 61, 86, 68, 94, 76]}>{(h, i) => <div class="bar-group"><div style={{ height: `${h}%` }} class={i() === 5 ? 'hot' : ''} /><small>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i()]}</small></div>}</For></div></div></div>
      </Show>
      </Show>
      <span class="visual-corner">PROJECT / 0{props.project.id}</span>
    </div>
  );
}

function ProjectCarousel(props: { projects: Project[]; onOpen: (project: Project) => void }) {
  const [active, setActive] = createSignal(0);
  const [dragX, setDragX] = createSignal(0);
  let gesture: { x: number; y: number; captured: boolean } | undefined;
  let suppressClickUntil = 0;
  const current = createMemo(() => props.projects[active()]);
  createEffect(() => { props.projects; setActive(0); setDragX(0); });
  const move = (direction: number) => {
    if (props.projects.length) setActive((index) => (index + direction + props.projects.length) % props.projects.length);
  };
  const offset = (index: number) => {
    const count = props.projects.length;
    let distance = index - active();
    if (distance > count / 2) distance -= count;
    if (distance < -count / 2) distance += count;
    return distance;
  };
  const finishDrag = (event: PointerEvent, cancelled = false) => {
    if (!gesture) return;
    const captured = gesture.captured;
    const distance = event.clientX - gesture.x;
    gesture = undefined;
    setDragX(0);
    if (captured) {
      suppressClickUntil = Date.now() + 350;
      const shell = event.currentTarget as HTMLElement;
      if (shell.hasPointerCapture(event.pointerId)) shell.releasePointerCapture(event.pointerId);
      if (!cancelled && Math.abs(distance) > 45) move(distance < 0 ? 1 : -1);
    }
  };
  return (
    <div class="project-carousel">
      <Show when={current()} keyed>{project => <Show when={project.category === 'Desain Grafis'}><div class="design-link-action"><Show when={project.link} fallback={<button type="button" class="button-primary" disabled>Lihat semua desain <ArrowIcon diagonal size={16}/></button>}><a class="button-primary" href={project.link} target="_blank" rel="noopener noreferrer">Lihat semua desain <ArrowIcon diagonal size={16}/></a></Show></div></Show>}</Show>
      <div class={`carousel-shell ${dragX() ? 'dragging' : ''}`} role="region" aria-roledescription="carousel" aria-label="Galeri proyek. Geser atau gunakan tombol panah." tabIndex={0}
        style={{ '--drag-x': `${dragX()}px` }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1);
          }
        }}
        onPointerDown={(event) => {
          if (event.pointerType === 'mouse' && event.button !== 0) return;
          gesture = { x: event.clientX, y: event.clientY, captured: false };
        }}
        onPointerMove={(event) => {
          if (!gesture) return;
          const dx = event.clientX - gesture.x;
          const dy = event.clientY - gesture.y;
          if (!gesture.captured && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) { gesture = undefined; return; }
          if (Math.abs(dx) > 8) {
            if (!gesture.captured) { event.currentTarget.setPointerCapture(event.pointerId); gesture.captured = true; }
            setDragX(Math.max(-160, Math.min(160, dx)));
          }
        }}
        onPointerUp={(event) => finishDrag(event)}
        onPointerCancel={(event) => finishDrag(event, true)}
        onLostPointerCapture={() => { gesture = undefined; setDragX(0); }}>
        <div class="carousel-stage">
          <For each={props.projects}>{(project, index) => (
            <button type="button" class={`carousel-slide ${offset(index()) === 0 ? 'selected' : ''}`}
              style={{ '--position': offset(index()), '--scale': Math.max(.55, 1 - Math.abs(offset(index())) * .22), opacity: Math.max(.12, 1 - Math.abs(offset(index())) * .3), 'z-index': 10 - Math.abs(offset(index())) }}
              aria-current={offset(index()) === 0 ? 'true' : undefined}
              aria-label={offset(index()) === 0 ? `Lihat detail ${project.title}` : `Pilih proyek ${project.title}`}
              onClick={() => {
                if (Date.now() < suppressClickUntil) return;
                if (index() === active()) props.onOpen(project); else setActive(index());
              }}>
              <VisualCard project={project} />
              <span class="carousel-open-icon"><ArrowIcon diagonal size={19} /></span>
            </button>
          )}</For>
        </div>
      </div>
      <div class="carousel-controls">
        <button type="button" onClick={() => move(-1)} disabled={props.projects.length < 2} aria-label="Proyek sebelumnya"><span aria-hidden="true">←</span></button>
        <span>{String(props.projects.length ? active() + 1 : 0).padStart(2, '0')} <span class="carousel-total">/ {String(props.projects.length).padStart(2, '0')}</span></span>
        <button type="button" onClick={() => move(1)} disabled={props.projects.length < 2} aria-label="Proyek berikutnya"><ArrowIcon size={18} /></button>
      </div>
      <div class="carousel-caption" aria-live="polite" aria-atomic="true">
        <Show when={current()} keyed>{(project) => <>
          <div class="project-meta">{project.category}{project.year ? ' · ' + project.year : ''}</div>
          <h3>{project.title}</h3><p>{project.summary}</p>
          <button type="button" class="carousel-detail" onClick={() => props.onOpen(project)}>Lihat detail proyek <ArrowIcon diagonal size={16} /></button>
        </>}</Show>
      </div>
    </div>
  );
}

function ProjectGallery(props: { images: NonNullable<Project['gallery']>; title: string; heading?: string }) {
  const [active, setActive] = createSignal(0);
  let viewer!: HTMLDialogElement;
  let touchStart: { x: number; y: number } | undefined;
  const current = () => props.images[active()];
  const move = (direction: number) => setActive(index => (index + direction + props.images.length) % props.images.length);
  const open = (index: number) => { setActive(index); viewer.showModal(); };
  onCleanup(() => { if (viewer?.open) viewer.close(); });
  return <section class="project-gallery" aria-label={'Galeri ' + props.title}>
    <header class="gallery-heading"><div><span class="gallery-eyebrow">DETAIL / VISUAL</span><h3>{props.heading ?? 'Galeri karya'}<span>{props.images.length}</span></h3></div><p>Klik gambar untuk melihat lebih dekat.</p></header>
    <div class="gallery-grid" classList={{'gallery-grid-single':props.images.length === 1}}><For each={props.images}>{(picture,index) => {
      const [failed, setFailed] = createSignal(false);
      return <figure class="gallery-tile"><button type="button" class="gallery-image-button" onClick={() => open(index())} aria-label={'Perbesar ' + (picture.alt || 'gambar ' + (index()+1))} disabled={failed()}><Show when={!failed()} fallback={<span class="gallery-image-error">Gambar belum tersedia.<br/>Periksa URL gambar di admin.</span>}><img src={picture.src} alt={picture.alt || props.title + ' - gambar ' + (index()+1)} loading="lazy" onError={() => setFailed(true)}/></Show><span class="gallery-image-index">{String(index()+1).padStart(2,'0')}</span><Show when={!failed()}><span class="gallery-expand" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/></svg></span></Show></button><figcaption><span>{picture.alt || 'Visual karya ' + (index()+1)}</span><span aria-hidden="true">{String(index()+1).padStart(2,'0')}</span></figcaption></figure>;
    }}</For></div>
    <dialog class="gallery-viewer" ref={viewer} aria-label={'Penampil gambar ' + props.title} onTouchStart={event => { const touch = event.touches[0]; touchStart = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : undefined; }} onTouchCancel={() => { touchStart = undefined; }} onTouchEnd={event => { const start = touchStart; touchStart = undefined; if (!start || event.touches.length) return; const touch = event.changedTouches[0]; const dx = touch.clientX - start.x; const dy = touch.clientY - start.y; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && props.images.length > 1) move(dx < 0 ? 1 : -1); }} onClick={event => { if (event.target === viewer) viewer.close(); }} onKeyDown={event => {
      if (['Escape','ArrowLeft','ArrowRight'].includes(event.key)) event.stopPropagation();
      if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
    }}><div class="gallery-viewer-inner"><header><div><small>{props.title}</small><span>{String(active()+1).padStart(2,'0')} / {String(props.images.length).padStart(2,'0')}</span></div><button type="button" onClick={() => viewer.close()} aria-label="Tutup gambar">Tutup <span aria-hidden="true">&times;</span></button></header><div class="gallery-viewer-stage"><img src={current()?.src} alt={current()?.alt || props.title}/></div><footer><button type="button" disabled={props.images.length < 2} onClick={() => move(-1)} aria-label="Gambar sebelumnya">&larr;</button><p>{current()?.alt || 'Visual karya'}</p><button type="button" disabled={props.images.length < 2} onClick={() => move(1)} aria-label="Gambar berikutnya">&rarr;</button></footer></div></dialog>
  </section>;
}

function App() {
  onMount(() => {
    const stop = onSnapshot(contentRef, snapshot => {
      if (snapshot.exists()) {
        try { updateContent(snapshot.data()); } catch (error) { console.error('Konten Firestore tidak valid; menggunakan konten terakhir.', error); }
      }
    }, error => console.warn('Firestore belum tersedia; menggunakan konten lokal.', error.code));
    onCleanup(stop);
  });
  const [dark, setDark] = createSignal((() => {
    if (typeof window === 'undefined') return false;
    try {
      const saved = window.localStorage.getItem('portfolio-theme');
      if (saved === 'dark' || saved === 'light') return saved === 'dark';
    } catch { /* Use system preference when storage is unavailable. */ }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  })());
  const [menuOpen, setMenuOpen] = createSignal(false);
  const [activeSection, setActiveSection] = createSignal('');
  let navElement: HTMLElement | undefined;
  const [navLine, setNavLine] = createSignal({ x: 0, y: 0, width: 0, visible: false });
  const updateNavLine = () => {
    const activeLink = navElement?.querySelector<HTMLAnchorElement>('[aria-current="location"]');
    if (!navElement || !activeLink || !navElement.getClientRects().length) {
      setNavLine((line) => ({ ...line, visible: false }));
      return;
    }
    setNavLine({ x: activeLink.offsetLeft, y: activeLink.offsetTop + activeLink.offsetHeight - 1, width: window.innerWidth <= 760 ? 32 : activeLink.offsetWidth, visible: true });
  };
  createEffect(() => {
    activeSection();
    menuOpen();
    const frame = window.requestAnimationFrame(updateNavLine);
    onCleanup(() => window.cancelAnimationFrame(frame));
  });
  onMount(() => {
    const observer = new ResizeObserver(updateNavLine);
    if (navElement) observer.observe(navElement);
    window.addEventListener('resize', updateNavLine);
    onCleanup(() => {
      observer.disconnect();
      window.removeEventListener('resize', updateNavLine);
    });
  });
  onMount(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionPreference.matches || !('IntersectionObserver' in window)) return;
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (motionPreference.matches) continue;
        const animation = entry.target.animate([
          { opacity: 0, transform: 'translateY(20px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], { duration: 550, easing: 'cubic-bezier(.2,.7,.2,1)' });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, { threshold: 0.08 });
    document.querySelectorAll('.section-heading, .about-photo-column, .about-story, .skills-overview, .skill-card, .experience-intro, .journey-browser, .collaboration-intro, .contact-email-card, .contact-network-card, .footer-content').forEach((element) => observer.observe(element));
    const cancelMotion = () => {
      if (motionPreference.matches) {
        animations.forEach((animation) => animation.cancel());
        animations.clear();
      }
    };
    motionPreference.addEventListener('change', cancelMotion);
    onCleanup(() => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      motionPreference.removeEventListener('change', cancelMotion);
    });
  });
  onMount(() => {
    const sections = navigation.map(({ id }) => document.getElementById(id)).filter((section): section is HTMLElement => Boolean(section));
    let frame = 0;
    const updateActiveSection = () => {
      frame = 0;
      const header = document.querySelector('.site-header');
      const boundary = (header?.getBoundingClientRect().bottom ?? 100) + 32;
      let current = '';
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= boundary) current = section.id;
      }
      if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        current = sections.at(-1)?.id ?? current;
      }
      setActiveSection(current);
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
    };
    updateActiveSection();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    onCleanup(() => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    });
  });
  const [activeFilter, setActiveFilter] = createSignal<Filter>('Semua');
  const [selectedProject, setSelectedProject] = createSignal<Project | null>(null);
  const [copied, setCopied] = createSignal(false);
  const [experienceGroup, setExperienceGroup] = createSignal<ExperienceGroup>('Profesional');
  const [selectedExperience, setSelectedExperience] = createSignal('');
  const [experienceGallery, setExperienceGallery] = createSignal('');
  createEffect(() => { experienceGroup(); selectedExperience(); setExperienceGallery(''); });
  const visibleExperiences = createMemo(() => experiences.filter(item => item.group === experienceGroup()));
  const currentExperience = createMemo(() => visibleExperiences().find(item => item.id === selectedExperience()) ?? visibleExperiences()[0]);
  const filteredProjects = createMemo(() => projects.filter((p) => activeFilter() === 'Semua' || p.category === (activeFilter() as ProjectCategory)));
  let copyTimeout: number | undefined;

  createEffect(() => {
    if (typeof window !== 'undefined') {
      const theme = dark() ? 'dark' : 'light';
      document.documentElement.style.colorScheme = theme;
      try {
        window.localStorage.setItem('portfolio-theme', theme);
      } catch { /* Theme switching remains available without storage. */ }
    }
  });

  createEffect(() => {
    const open = Boolean(selectedProject());
    document.body.style.overflow = open ? 'hidden' : '';
    const closeOnEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedProject(null); };
    if (open) window.addEventListener('keydown', closeOnEscape);
    onCleanup(() => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', closeOnEscape);
    });
  });
  onCleanup(() => { if (copyTimeout) window.clearTimeout(copyTimeout); });

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      if (copyTimeout) window.clearTimeout(copyTimeout);
      copyTimeout = window.setTimeout(() => setCopied(false), 2600);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <div class={`site ${dark() ? 'dark' : ''}`} id="top">
      <div class="site-noise" aria-hidden="true" />
      <header class="site-header">
        <a class="wordmark" href="#top" onClick={() => setMenuOpen(false)} aria-label="Kembali ke awal"><span class="wordmark-box"><BrandAvatar photo={profile.navbarPhoto || profile.photo} /></span><span>PORTFOLIO<span class="brand-dot">.</span></span></a>
        <nav ref={navElement} class={`main-nav ${menuOpen() ? 'open' : ''}`} aria-label="Navigasi utama">
          <For each={navigation}>{(item) => (
            <a href={`#${item.id}`} aria-current={activeSection() === item.id ? 'location' : undefined} onClick={() => setMenuOpen(false)}>{item.label}</a>
          )}</For>
          <span class="nav-active-line" aria-hidden="true" style={{ width: `${navLine().width}px`, transform: `translate(${navLine().x}px, ${navLine().y}px)`, opacity: navLine().visible ? 1 : 0 }} />
        </nav>
        <div class="header-actions"><button type="button" class="theme-button" onClick={() => setDark(!dark())} aria-label={dark() ? 'Aktifkan tema terang' : 'Aktifkan tema gelap'} title="Ganti tema"><SunMoonIcon dark={dark()} /></button><a href="#contact" class="header-contact">Let's talk <ArrowIcon diagonal size={16} /></a><button type="button" class="hamburger" aria-label={menuOpen() ? 'Tutup menu' : 'Buka menu'} aria-expanded={menuOpen()} onClick={() => setMenuOpen(!menuOpen())}><span /><span /></button></div>
      </header>

      <main>
        <section class="hero section-container" aria-labelledby="hero-title">
          <div class="hero-left"><div class="eyebrow"><span class="status-pulse"/> OPEN TO NEW OPPORTUNITIES <span class="eyebrow-line"/></div><p class="hero-hello">HALO, SAYA</p><h1 id="hero-title"><span class="hero-name">{profile.name}<span class="hero-period">.</span></span></h1><div class="hero-position"><span>↗</span><strong>{profile.role}</strong></div><p class="hero-bio">{profile.shortBio}</p><div class="hero-buttons"><a href="#work" class="button-primary">Lihat Karya <ArrowIcon diagonal /></a><a class="button-text" href="#about">Kenali saya <ArrowIcon /></a></div><div class="hero-divider"/><div class="hero-bottom"><span>BASED IN<br/><b>{profile.location}</b></span><span>CURRENT FOCUS<br/><b>Building better digital things</b></span><span class="hero-scroll">SCROLL TO EXPLORE <span>↓</span></span></div></div>
          <div class="hero-right"><div class="portrait-frame"><div class="portrait-decor decor-one"/><div class="portrait-decor decor-two"/><div class="portrait-grid"/><Show when={profile.introPhoto || profile.photo} fallback={<div class="portrait-placeholder"><span class="portrait-sun">✳</span><div class="portrait-avatar"><span class="avatar-head"/><span class="avatar-body"/></div><span class="portrait-empty-label">YOUR PHOTO HERE</span></div>}><div class="profile-image-crop"><img class="profile-image" src={profile.introPhoto || profile.photo} alt={`Foto profil ${profile.name}`}/></div></Show><div class="portrait-sticker"><span>✳</span> <b>LET'S MAKE<br/>IT HAPPEN</b></div></div><div class="photo-caption"><span><span class="caption-dot" /> NICE TO MEET YOU.</span><span>01 / INTRO</span></div></div>
        </section>

        <section class="work-section" id="work" aria-labelledby="work-title">
          <div class="section-container">
            <div class="section-heading"><div>
              <div class="section-kicker"><span>01 / SELECTED WORK</span><span class="kicker-line"/></div>
              <h2 id="work-title">Karya <em>&</em> proyek<span class="heading-dot">.</span></h2>
              <p>Karya website, desain, dan publikasi penelitian saya. Pilih karya untuk melihat cerita dan detailnya.</p>
            </div></div>
            <div class="work-filters" aria-label="Filter proyek"><For each={filters}>{(filter) =>
              <button type="button" class={activeFilter() === filter ? 'active' : ''} aria-pressed={activeFilter() === filter} onClick={() => setActiveFilter(filter)}>
                {filter}<Show when={filter === 'Semua'}><span>{projects.length.toString().padStart(2, '0')}</span></Show>
              </button>
            }</For></div>
          </div>
          <Show when={filteredProjects().length} fallback={<div class="work-empty" role="status"><span>{activeFilter()}</span><p>Karya dalam kategori ini akan segera ditambahkan.</p></div>}>
            <ProjectCarousel projects={filteredProjects()} onOpen={setSelectedProject} />
          </Show>
        </section>

        <section class="about-section" id="about" aria-labelledby="about-title">
          <div class="section-container about-profile-layout">
            <div class="about-photo-column">
              <div class="about-photo-wrap">
                <div class="about-photo-halo" aria-hidden="true" />
                <div class="about-photo-frame">
                  <Show when={profile.aboutPhoto || profile.photo} fallback={<div class="about-photo-placeholder"><span class="about-photo-initials">{profile.shortName}</span><span>RUANG UNTUK FOTO SAYA</span></div>}>
                    <img class="about-profile-image" src={profile.aboutPhoto || profile.photo} alt={'Foto profil ' + profile.name} loading="lazy" />
                  </Show>
                </div>
                <div class="about-photo-note"><span aria-hidden="true">✳</span><span>STILL CURIOUS.<br/><b>ALWAYS LEARNING.</b></span></div>
              </div>
              <div class="about-identity"><div><h3>{profile.name}</h3><p>{profile.role}</p></div><span class="about-location">{profile.location}</span></div>
            </div>
            <div class="about-story">
              <div class="section-kicker"><span>02 / BEHIND THE SCREEN</span><span class="kicker-line"/></div>
              <h2 id="about-title">Lebih dari<br/><em>sekadar kode.</em></h2>
              <p class="about-story-lead">Saya percaya setiap ide besar dimulai dari <em>rasa ingin tahu.</em></p>
              <p>{profile.about}</p><p>{profile.aboutSecond}</p>
              <div class="about-values">
                <div><span>01</span><div><b>Curiosity first.</b><p>Selalu terbuka belajar hal baru.</p></div></div>
                <div><span>02</span><div><b>Detail matters.</b><p>Hal kecil membuat pengalaman lebih baik.</p></div></div>
                <div><span>03</span><div><b>Keep evolving.</b><p>Setiap proses adalah kesempatan bertumbuh.</p></div></div>
              </div>
            </div>
          </div>
        </section>

        <section class="expertise-section" id="expertise" aria-labelledby="expertise-title">
          <div class="section-container skills-layout">
            <div class="skills-overview">
              <div class="section-kicker"><span>03 / WHAT I DO</span><span class="kicker-line"/></div>
              <h2 id="expertise-title">Hal yang saya<br/><em>sukai kerjakan.</em></h2>
              <p>Kombinasi kreativitas, teknologi, dan pemikiran yang terstruktur untuk membangun solusi digital.</p>
              <div class="skills-toolbox">
                <span class="skills-toolbox-label">TOOLS & TEKNOLOGI</span>
                <div class="skills-tools"><For each={[...new Set(expertise.flatMap((item) => item.tags))]}>{(tag) => <span>{tag}</span>}</For></div>
              </div>
            </div>
            <div class="skills-cards">
              <For each={expertise}>{(item, index) => (
                <article class={`skill-card skill-tone-${index() % 3}`}>
                  <div class="skill-card-top"><span class="skill-number">/{item.number}</span><span class="skill-orbit" aria-hidden="true" /></div>
                  <div class="skill-icon" aria-hidden="true">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <Show when={index() % 3 === 0}><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16" /></Show>
                      <Show when={index() % 3 === 1}><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M3 9h18M9 9v12"/><circle cx="6" cy="6" r=".5"/></Show>
                      <Show when={index() % 3 === 2}><path d="M4 4v16h16M8 15v-4m5 4V7m5 8v-6"/></Show>
                    </svg>
                  </div>
                  <h3>{item.title}</h3><p>{item.desc}</p>
                  <div class="skill-tags"><For each={item.tags}>{(tag) => <span>{tag}</span>}</For></div>
                </article>
              )}</For>
            </div>
          </div>
        </section>

        <section class="experience-section" id="experience" aria-labelledby="experience-title">
          <div class="section-container experience-layout">
            <div class="experience-intro">
              <div class="section-kicker"><span>04 / MY JOURNEY</span><span class="kicker-line"/></div>
              <h2 id="experience-title">Pengalaman<br/><em>& perjalanan.</em></h2>
              <p>Jelajahi pengalaman profesional dan organisasi saya. Pilih kelompok, lalu pengalaman untuk melihat cerita dan pencapaiannya.</p>
            </div>
            <div class="experience-group-tabs" role="group" aria-label="Kelompok pengalaman">
              <For each={experienceGroups}>{group => <button type="button" aria-pressed={experienceGroup() === group} aria-controls="journey-browser" onClick={() => { setExperienceGroup(group); setSelectedExperience(''); }}>{group}<span>{experiences.filter(item => item.group === group).length}</span></button>}</For>
            </div>
            <div class="journey-browser" id="journey-browser">
              <div class="journey-selector">
              <Show when={visibleExperiences().length > 1}>
                <div class="journey-scroll-hint"><span>Geser untuk melihat pengalaman lainnya</span><span aria-hidden="true">&larr; &rarr;</span></div>
              </Show>
              <div class="journey-menu" role="group" aria-label="Pilih pengalaman">
                <For each={visibleExperiences()}>{(item, index) => (
                  <button type="button" class={currentExperience()?.id === item.id ? 'journey-choice active' : 'journey-choice'} aria-pressed={currentExperience()?.id === item.id} aria-controls="journey-panel" onClick={() => setSelectedExperience(item.id)}>
                    <span class="journey-index">{String(index() + 1).padStart(2, '0')}</span>
                    <span class="journey-choice-copy"><span class="journey-category">{item.category}</span><span class="journey-choice-title">{item.organization || item.title}</span></span>
                    <span class="journey-choice-arrow"><ArrowIcon size={18}/></span>
                  </button>
                )}</For>
              </div>
              </div>
              <div class="journey-panel" id="journey-panel" aria-live="polite" aria-atomic="true">
                <Show when={currentExperience()} keyed fallback={<p class="experience-group-empty">Belum ada pengalaman {experienceGroup().toLowerCase()} yang ditambahkan.</p>}>{(item) => <div class="journey-story">
                  <div class="journey-panel-top"><span class="journey-category">{item.category}</span><span class="journey-watermark" aria-hidden="true">{String(visibleExperiences().indexOf(item) + 1).padStart(2, '0')}</span></div>
                  <h3>{item.title}</h3>
                  <Show when={item.organization}><p class="journey-organization">{item.organization}</p></Show>
                  <span class="journey-period">{item.period || 'Periode belum diisi'}</span>
                  <p class="journey-description">{item.description}</p>
                  <Show when={item.highlights.length}><ul class="experience-highlights"><For each={item.highlights}>{(highlight) => <li>{highlight}</li>}</For></ul></Show>
                  <div class="journey-actions">
                    <button type="button" class="journey-documentation" aria-expanded={experienceGallery() === item.id} aria-controls="journey-gallery" onClick={() => setExperienceGallery(experienceGallery() === item.id ? '' : item.id)}>Galeri ({item.gallery.length})</button>
                    <Show when={item.documentation} fallback={<button type="button" class="journey-documentation" disabled>Dokumentasi belum tersedia</button>}>
                      <a class="journey-documentation" href={item.documentation} target="_blank" rel="noopener noreferrer">Lihat dokumentasi <ArrowIcon diagonal size={16}/></a>
                    </Show>
                    <Show when={item.link}><a class="carousel-detail" href={item.link} target="_blank" rel="noopener noreferrer">Informasi lainnya <ArrowIcon diagonal size={16}/></a></Show>
                  </div>
                  <Show when={experienceGallery() === item.id}><div id="journey-gallery">
                    <Show when={item.gallery.length} fallback={<p class="experience-group-empty">Foto dokumentasi pengalaman ini belum ditambahkan.</p>}>
                      <ProjectGallery images={item.gallery} title={item.title} heading="Galeri pengalaman" />
                    </Show>
                  </div></Show>
                  <Show when={!item.organization && !item.period}><span class="experience-pending">Detail pengalaman belum dilengkapi</span></Show>
                </div>}</Show>
              </div>
            </div>
          </div>
        </section>

        <section class="contact-section contact-collaboration" id="contact" aria-labelledby="contact-title">
          <div class="section-container collaboration-panel">
            <div class="collaboration-intro">
              <div class="section-kicker"><span>05 / LET'S CONNECT</span><span class="kicker-line"/></div>
              <h2 id="contact-title">Mari<br/><em>bekerja sama.</em></h2>
              <p>Butuh dukungan untuk proyek digital, desain, atau marketing? Saya terbuka untuk berdiskusi dan menjajaki peluang kolaborasi bersama Anda.</p>
              <Show when={profile.resume}><a class="contact-cv" href={profile.resume} download="">Download CV <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5" /></svg></a></Show>
              <div class="collaboration-note"><span aria-hidden="true">✳</span><span>Berawal dari percakapan,<br/>berlanjut menjadi kolaborasi.</span></div>
            </div>
            <div class="collaboration-channels">
              <div class="contact-email-card">
                <div class="contact-channel-label"><span>01 / EMAIL</span><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 7 9 6 9-6"/></svg></div>
                <h3>Ceritakan rencana Anda.</h3>
                <a class="collaboration-email" href={'mailto:' + profile.email}>{profile.email}<ArrowIcon diagonal size={20}/></a>
                <button type="button" class="collaboration-copy" onClick={copyEmail} aria-live="polite">{copied() ? '✓ Email disalin!' : 'Salin alamat email'}</button>
              </div>
              <div class="contact-network-card">
                <span class="contact-channel-label">02 / TERHUBUNG LEBIH DEKAT</span>
                <div class="collaboration-social"><For each={profile.social}>{(item) => <a href={item.url} target="_blank" rel="noopener noreferrer"><span>{item.label}</span><ArrowIcon diagonal size={17}/></a>}</For></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer class="portfolio-footer">
        <div class="section-container footer-content">
          <div class="footer-main">
            <a class="footer-identity" href="#top" aria-label="Kembali ke awal">
              <BrandAvatar photo={profile.footerPhoto || profile.photo} />
              <span><strong>{profile.name}</strong><span>{profile.role}</span></span>
            </a>
            <a class="footer-top" href="#top"><span>Kembali ke atas</span><span class="footer-top-icon" aria-hidden="true">↑</span></a>
          </div>
          <div class="footer-bottom">
            <p>© {new Date().getFullYear()} {profile.name}</p>
            <nav class="footer-links" aria-label="Media sosial"><For each={profile.social}>{(item) => <a href={item.url} target="_blank" rel="noopener noreferrer">{item.label}<ArrowIcon diagonal size={13}/></a>}</For></nav>
          </div>
        </div>
      </footer>

      <Show when={selectedProject()} keyed>{(project) => <div class="modal-backdrop" onClick={() => setSelectedProject(null)} role="presentation"><div class="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}><button class="modal-close" onClick={() => setSelectedProject(null)} aria-label="Tutup detail proyek">✕</button><Show when={!project.publication}><VisualCard project={project}/></Show><div class={`modal-copy ${project.publication ? 'publication-modal-copy' : ''}`}><div class="project-meta">{project.category}{project.year ? ' · ' + project.year : ''}</div><h2 id="modal-title">{project.title}</h2><Show when={project.publication}><div class="project-publication">{project.publication}</div></Show><p>{project.description}</p><Show when={project.category === 'Desain Grafis' && !project.gallery?.length}><p>Gambar desain akan segera ditambahkan.</p></Show><Show when={project.category === 'Desain Grafis' && project.link}><div class="design-modal-action"><a href={project.link} target="_blank" rel="noopener noreferrer" class="button-primary">Lihat semua desain <ArrowIcon diagonal/></a></div></Show><Show when={project.link && project.category !== 'Desain Grafis'}><div class="design-modal-action"><a href={project.link} target="_blank" rel="noopener noreferrer" class="button-primary">{project.publication ? 'Baca jurnal' : 'Lihat proyek'} <ArrowIcon diagonal/></a></div></Show><Show when={project.gallery?.length}><ProjectGallery images={project.gallery!} title={project.title}/></Show><div class="modal-stack"><For each={project.stack}>{(tech) => <span>{tech}</span>}</For></div></div></div></div>}</Show>
    </div>
  );
}

export default App;
