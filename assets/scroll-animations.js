/**
 * WoodenCraft — Global Scroll Animation Engine
 * Features:
 *  1. Section scroll-reveal (IntersectionObserver)
 *  2. Card stagger within revealed sections
 *  3. Scroll-progress bar (thin gold line at top)
 *  4. Back-to-top button
 *  5. Header compact mode on scroll
 */
(function () {
  'use strict';

  var GOLD = '#c49a5e';
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Scroll Reveal ──────────────────────────────────────── */
  function initScrollReveal() {
    var sections = document.querySelectorAll('section[class]');
    var vh = window.innerHeight;

    sections.forEach(function (section) {
      var rect = section.getBoundingClientRect();
      // Only animate sections that start below the fold
      if (rect.top > vh * 0.92) {
        section.classList.add('wf-reveal');

        // Pre-set stagger delays on known card types
        var cards = section.querySelectorAll(
          '.product-card, .result-card, .blog-card, .collection-card'
        );
        cards.forEach(function (card, i) {
          // cap at 0.45s so last card doesn't wait forever
          card.style.animationDelay = Math.min(i * 0.07, 0.45) + 's';
        });
      }
    });

    if (prefersReducedMotion) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('wf-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.07,
      rootMargin: '0px 0px -48px 0px'
    });

    document.querySelectorAll('.wf-reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── 2. Scroll Progress Bar ────────────────────────────────── */
  function initScrollProgress() {
    var bar = document.createElement('div');
    bar.className = 'wf-scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var scrolled = window.scrollY;
        var total = document.documentElement.scrollHeight - window.innerHeight;
        var progress = total > 0 ? (scrolled / total) * 100 : 0;
        bar.style.width = progress.toFixed(2) + '%';
        ticking = false;
      });
    }, { passive: true });
  }

  /* ── 3. Back to Top Button ─────────────────────────────────── */
  function initBackToTop() {
    var btn = document.createElement('button');
    btn.className = 'wf-back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.setAttribute('type', 'button');
    btn.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="2.5" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M18 15l-6-6-6 6"/>' +
      '</svg>';
    document.body.appendChild(btn);

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        if (window.scrollY > 500) {
          btn.classList.add('wf-btt-visible');
        } else {
          btn.classList.remove('wf-btt-visible');
        }
        ticking = false;
      });
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ── 4. Header Compact on Scroll ───────────────────────────── */
  function initHeaderCompact() {
    var header = document.querySelector('.header');
    if (!header) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        if (window.scrollY > 60) {
          header.classList.add('wf-header-compact');
        } else {
          header.classList.remove('wf-header-compact');
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ── 5. Smooth Anchor Scroll ────────────────────────────────── */
  function initAnchorScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute('href').slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  }

  /* ── Init ───────────────────────────────────────────────────── */
  function init() {
    document.body.classList.add('wf-loading');
    initScrollReveal();
    initScrollProgress();
    initBackToTop();
    initHeaderCompact();
    initAnchorScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
