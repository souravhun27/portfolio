/* =========================================================
   Sourav · Portfolio — vanilla JS
   ========================================================= */
(() => {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover)').matches;

  /* ---------- footer year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- reveal on load / scroll (staggered) ---------- */
  const revealEls = $$('.reveal');
  $$('[data-stagger]').forEach(group => {
    $$('.reveal', group).forEach((el, i) => el.style.setProperty('--d', `${Math.min(i, 6) * 90}ms`));
  });
  $$('.skills-card').forEach(card => $$('.chip', card).forEach((chip, i) => chip.style.setProperty('--i', i)));

  const markDone = el => setTimeout(() => el.classList.add('done'), 1600);

  if (reduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => { el.classList.add('in', 'done'); });
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        markDone(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- header shadow ---------- */
  const header = $('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- nav: sliding underline + active section + mobile menu ---------- */
  const navList  = $('#nav-links');
  const navLinks = $$('a[data-nav]', navList);
  const underline = $('.nav-underline', navList);
  const menuBtn  = $('#menu-btn');
  const sections = ['home', 'about', 'projects', 'resume'].map(id => document.getElementById(id));
  let activeId = 'home';

  function moveUnderline(link) {
    if (!link || !underline) return;
    const pad = 16; // matches link horizontal padding
    underline.style.setProperty('--x', `${link.offsetLeft + pad}px`);
    underline.style.setProperty('--w', `${link.offsetWidth - pad * 2}px`);
    underline.classList.add('ready');
  }
  const activeLink = () => navLinks.find(a => a.dataset.nav === activeId);

  function setActive(id) {
    activeId = id;
    navLinks.forEach(a => {
      const on = a.dataset.nav === id;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    moveUnderline(activeLink());
  }

  navLinks.forEach(a => {
    a.addEventListener('mouseenter', () => { if (canHover) moveUnderline(a); });
    a.addEventListener('focus', () => moveUnderline(a));
    a.addEventListener('mouseleave', () => moveUnderline(activeLink()));
    a.addEventListener('blur', () => moveUnderline(activeLink()));
    a.addEventListener('click', () => closeMenu());
  });
  window.addEventListener('resize', () => moveUnderline(activeLink()));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => moveUnderline(activeLink()));

  function closeMenu() {
    navList.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
  }
  menuBtn.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); menuBtn.blur(); } });
  document.addEventListener('click', e => { if (!e.target.closest('.navbar')) closeMenu(); });

  function pickActive() {
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) return setActive('resume');
    const line = window.innerHeight * 0.4;
    let current = 'home';
    sections.forEach(s => { if (s && s.getBoundingClientRect().top <= line) current = s.id; });
    if (current !== activeId) setActive(current);
  }
  setActive('home');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { pickActive(); updateScrollBtn(); ticking = false; });
  }, { passive: true });

  /* ---------- floating scroll button ---------- */
  const scrollBtn = $('#scroll-btn');
  function nextSection() {
    const line = 80;
    return sections.find(s => s && s.getBoundingClientRect().top > line + 40);
  }
  function updateScrollBtn() {
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;
    scrollBtn.classList.toggle('up', atBottom);
    scrollBtn.setAttribute('aria-label', atBottom ? 'Scroll back to top' : 'Scroll to next section');
  }
  scrollBtn.addEventListener('click', () => {
    const behavior = reduced ? 'auto' : 'smooth';
    if (scrollBtn.classList.contains('up')) return window.scrollTo({ top: 0, behavior });
    const next = nextSection();
    if (next) next.scrollIntoView({ behavior, block: 'start' });
    else window.scrollTo({ top: document.documentElement.scrollHeight, behavior });
  });
  updateScrollBtn();

  /* ---------- 3D tilt following cursor / finger ---------- */
  if (!reduced) {
    $$('[data-tilt]').forEach(card => {
      const max = parseFloat(card.dataset.tilt) || 3;
      const move = e => {
        // don't tilt while interacting with the swipe stack
        if (e.target.closest && e.target.closest('.stack')) return reset();
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--ry', `${(px * max * 2).toFixed(2)}deg`);
        card.style.setProperty('--rx', `${(-py * max * 2).toFixed(2)}deg`);
        card.classList.add('tilting');
      };
      const reset = () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
        card.classList.remove('tilting');
      };
      card.addEventListener('pointermove', e => { if (e.pointerType === 'mouse' || e.buttons) move(e); });
      card.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') move(e); });
      card.addEventListener('pointerleave', reset);
      card.addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') setTimeout(reset, 180); });
      card.addEventListener('pointercancel', reset);
    });
  }

  /* ---------- project cards: scroll-triggered zoom for touch ---------- */
  if (!canHover && 'IntersectionObserver' in window && !reduced) {
    const pio = new IntersectionObserver(entries => {
      entries.forEach(e => e.target.classList.toggle('is-active', e.isIntersecting));
    }, { rootMargin: '-35% 0px -35% 0px' });
    $$('.project').forEach(p => pio.observe(p));
  }

  /* ---------- signature interaction: project card stack ---------- */
  const stack = $('#stack');
  if (stack) {
    const cards  = $$('.stack-card', stack);
    const status = $('#stack-status');
    const n = cards.length;
    let order = cards.map((_, i) => i);   // order[0] = index of front card
    let busy = false;
    let startX = 0, startY = 0, dragged = false, pointerId = null;

    const names = cards.map(c => $('h3', c).textContent);

    function render() {
      order.forEach((cardIdx, pos) => {
        const c = cards[cardIdx];
        c.dataset.pos = pos;
        c.setAttribute('aria-hidden', pos === 0 ? 'false' : 'true');
      });
      status.textContent = `${order[0] + 1} / ${n} · ${names[order[0]]} · tap or swipe to shuffle`;
    }

    function go(dir) {
      if (busy) return;
      busy = true;
      if (dir > 0) {
        const front = cards[order[0]];
        front.classList.add('leaving');
        setTimeout(() => {
          order.push(order.shift());
          front.classList.remove('leaving');
          render();
          setTimeout(() => { busy = false; }, 300);
        }, reduced ? 0 : 340);
      } else {
        // bring the last card back to the front
        const back = cards[order[n - 1]];
        back.style.transition = 'none';
        back.classList.add('leaving');
        void back.offsetWidth;
        back.style.transition = '';
        back.style.zIndex = 5;
        order.unshift(order.pop());
        back.classList.remove('leaving');
        render();
        setTimeout(() => { back.style.zIndex = ''; busy = false; }, 500);
      }
    }

    render();

    stack.addEventListener('pointerdown', e => {
      startX = e.clientX; startY = e.clientY; dragged = false; pointerId = e.pointerId;
      if (e.pointerType !== 'mouse') stack.classList.add('fan'); // press = fan out on touch
    });
    stack.addEventListener('pointermove', e => {
      if (e.pointerId !== pointerId) return;
      if (Math.abs(e.clientX - startX) > 12) dragged = true;
    });
    const endPress = e => {
      if (e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
      pointerId = null;
      setTimeout(() => stack.classList.remove('fan'), 350);
    };
    stack.addEventListener('pointerup', endPress);
    stack.addEventListener('pointercancel', () => { pointerId = null; stack.classList.remove('fan'); dragged = true; });

    stack.addEventListener('click', () => {
      if (dragged) { dragged = false; return; } // swipe already handled
      go(1);
    });
    stack.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); go(-1); }
    });
  }
})();
