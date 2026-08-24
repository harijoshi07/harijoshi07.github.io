/* ============================================================
   highlight.js initialisation — Catppuccin Mocha
   ─────────────────────────────────────────────────────────────
   This script sits at the END of <body>.
   By the time it executes the full DOM is parsed and all
   inline scripts (slides.js) have already run, so we call
   hljs directly — no DOMContentLoaded needed.
   ============================================================ */

(function () {
  if (typeof hljs === 'undefined') {
    console.warn('[hljs] library not loaded — syntax highlighting skipped');
    return;
  }

  hljs.configure({
    ignoreUnescapedHTML: true,
    // Explicitly tell hljs which languages we use so it doesn't
    // try to auto-detect and mis-classify our tree blocks.
    languages: ['dart'],
  });

  // highlightAll() processes every <pre><code class="language-*">
  // block in the document. Our tree <code> elements have NO
  // language class, so they are untouched.
  hljs.highlightAll();
})();
