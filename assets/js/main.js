/* ══════════════════════════════════════
   Brainyard — main.js
   cursor · parallax · reveals · showreel
══════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Cursor ── */
  const cur  = document.getElementById('brainyard-cursor');
  const ring = document.getElementById('brainyard-cursor-ring');

  if (cur && ring && window.matchMedia('(pointer: fine)').matches) {
    let mx = -100, my = -100, rx = -100, ry = -100;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx + 'px';
      cur.style.top  = my + 'px';
    });

    (function lerpRing() {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(lerpRing);
    })();

    const hoverTargets = 'a, button, .hpc, .project-card, .brainyard-item, .btn, .video-cover, .play-circle';
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ── Parallax (hero bg word) ── */
  const bgWord = document.getElementById('hero-bg-word');
  if (bgWord) {
    window.addEventListener('scroll', () => {
      bgWord.style.transform = `translateY(calc(-50% + ${window.scrollY * 0.035}px))`;
    }, { passive: true });
  }

  /* ── Scroll reveals ── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach(el => io.observe(el));

    /* hero items reveal immediately */
    document.querySelectorAll('.home-hero-wrap .reveal').forEach(el => {
      requestAnimationFrame(() => el.classList.add('in'));
    });
  }

  /* ── Lightbox: hide dead nav buttons (target radio inexistant) ── */
  document.querySelectorAll('.nav-prev, .nav-next').forEach(function(btn) {
    var id = btn.getAttribute('for');
    if (!id || !document.getElementById(id)) {
      btn.style.display = 'none';
    }
  });

  /* ── Showreel lazy load ── */
  const cover = document.getElementById('video-cover');
  const frame = document.getElementById('yt-frame');
  if (cover && frame) {
    cover.addEventListener('click', () => {
      frame.src = frame.dataset.src;
      cover.style.display = 'none';
    });
  }

})();
