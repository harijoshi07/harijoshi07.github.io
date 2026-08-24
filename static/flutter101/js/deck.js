/**
 * Modular Slide Deck Controller
 * Supports: dynamic slide count, inline data-notes, fragments, progress bar, keyboard navigation
 */
(function() {
  'use strict';

  const slides = Array.from(document.querySelectorAll('.slide'));
  const total = slides.length;
  let current = 0;
  let isAnimating = false;

  const progressFill = document.getElementById('progress-fill');
  const slideCounter = document.getElementById('slide-counter');
  const notesOverlay = document.getElementById('notes-overlay');
  const notesContent = document.getElementById('notes-text');

  // Auto-index slides dynamically
  slides.forEach((slide, idx) => {
    slide.setAttribute('data-index', idx);
  });

  function updateUI() {
    // Progress
    const pct = total > 1 ? (current / (total - 1)) * 100 : 0;
    if (progressFill) progressFill.style.width = `${pct}%`;

    // HUD Counter
    const currEl = document.getElementById('slide-current');
    const totEl = document.getElementById('slide-total');
    if (currEl) currEl.textContent = String(current + 1).padStart(2, '0');
    if (totEl) totEl.textContent = String(total).padStart(2, '0');

    // HUD Buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.style.opacity = current === 0 ? 0.3 : 1;
    if (nextBtn) nextBtn.style.opacity = current === total - 1 ? 0.3 : 1;

    // Save to local storage so live-reloads don't drop to slide 1
    localStorage.setItem('deck-slide', current);

    // Notes
    if (notesContent && slides[current]) {
      const note = slides[current].getAttribute('data-notes') || 'No notes for this slide.';
      notesContent.textContent = note;
    }

    if (slides[current].id === 'slide-ch1-1' && window.playTerminal) {
      window.playTerminal();
    }
  }

  function goTo(idx) {
    if (isAnimating) return;

    if (idx > current) {
      const activeSlide = slides[current];
      if (activeSlide.hasAttribute('data-has-fragments')) {
        const fragCount = parseInt(activeSlide.getAttribute('data-fragments-count') || "1");
        let currentFrag = parseInt(activeSlide.getAttribute('data-current-frag') || "0");
        
        if (currentFrag < fragCount) {
          currentFrag++;
          activeSlide.setAttribute('data-current-frag', currentFrag);
          activeSlide.classList.add(`frag-${currentFrag}-active`);
          updateUI();
          return;
        }
      }
    }
    
    if (idx < current) {
      const activeSlide = slides[current];
      if (activeSlide.hasAttribute('data-has-fragments')) {
        let currentFrag = parseInt(activeSlide.getAttribute('data-current-frag') || "0");
        if (currentFrag > 0) {
          activeSlide.classList.remove(`frag-${currentFrag}-active`);
          currentFrag--;
          activeSlide.setAttribute('data-current-frag', currentFrag);
          updateUI();
          return;
        }
      }
    }

    if (idx < 0 || idx >= total || idx === current) return;

    isAnimating = true;

    slides.forEach((s, i) => {
      s.classList.remove('is-active', 'is-prev');
      if (i < idx) {
        s.classList.add('is-prev');
      }
    });

    slides[idx].classList.add('is-active');
    current = idx;
    updateUI();

    // Autoplay Ch2 typewriter demos when slide enters view
    const newSlideId = slides[idx].id;
    if (window.ch2SlideAutoplay) {
      setTimeout(() => window.ch2SlideAutoplay(newSlideId), 400);
    }

    setTimeout(() => {
      isAnimating = false;
    }, 460);
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function toggleNotes() {
    if (notesOverlay) notesOverlay.classList.toggle('show');
  }

  document.addEventListener('keydown', (e) => {
    switch(e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
      case 'PageDown':
        e.preventDefault();
        next();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        prev();
        break;
      case 'Home':
        e.preventDefault();
        goTo(0);
        break;
      case 'End':
        e.preventDefault();
        goTo(total - 1);
        break;
      case 'n':
      case 'N':
        toggleNotes();
        break;
    }
  });

  // HUD Button listeners
  document.addEventListener('DOMContentLoaded', () => {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);
  });

  window.Deck = {
    goTo, next, prev, toggleNotes,
    getCurrent: () => current,
    getTotal: () => total
  };

  // Init
  const saved = parseInt(localStorage.getItem('deck-slide'), 10);
  if (!isNaN(saved) && saved >= 0 && saved < total) {
    current = saved;
  }
  
  slides.forEach((s, i) => {
    s.classList.remove('is-active', 'is-prev');
    if (i === current) s.classList.add('is-active');
    if (i < current) s.classList.add('is-prev');
  });
  updateUI();
  
  // Trigger initial slide autoplay if starting on demo
  if (window.ch2SlideAutoplay) {
    setTimeout(() => window.ch2SlideAutoplay(slides[current].id), 600);
  }
})();
