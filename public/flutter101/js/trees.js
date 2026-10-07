/**
 * Interactive Trees & Terminal Helper
 */
(function() {
  'use strict';

  /* ── Tree Definitions ────────────────────────────────────── */
  const FULL_TREE = [
    { text: 'my_app/',                  cls: 'tr-root' },
    { text: '├── android/',              cls: 'tr-dim',  comment: '                 # Android-specific project files' },
    { text: '├── ios/',                  cls: 'tr-dim',  comment: '                     # iOS-specific project files' },
    { text: '├── linux/',                cls: 'tr-dim',  comment: '                   # Linux desktop files' },
    { text: '├── macos/',                cls: 'tr-dim',  comment: '                   # macOS desktop files' },
    { text: '├── web/',                  cls: 'tr-dim',  comment: '                     # Web-specific files' },
    { text: '├── windows/',              cls: 'tr-dim',  comment: '                 # Windows desktop files' },
    { text: '│',                         cls: 'tr-dim' },
    { text: '├── lib/',                  cls: 'tr-blue' },
    { text: '│   └── main.dart',         cls: 'tr-blue', comment: '            # Main entry point of your Flutter app', commentCls: 'tr-comment-blue' },
    { text: '│',                         cls: 'tr-dim' },
    { text: '├── test/',                 cls: 'tr-dim' },
    { text: '│   └── widget_test.dart',  cls: 'tr-dim',  comment: '    # Tests' },
    { text: '│',                         cls: 'tr-dim' },
    { text: '├── .gitignore',            cls: 'tr-dim' },
    { text: '├── .metadata',             cls: 'tr-dim' },
    { text: '├── analysis_options.yaml', cls: 'tr-dim',  comment: '   # Dart/Flutter lint rules' },
    { text: '├── pubspec.yaml',          cls: 'tr-orng', comment: '            # Dependencies, assets, app metadata', commentCls: 'tr-comment-orng' },
    { text: '├── pubspec.lock',          cls: 'tr-dim',  comment: '            # Locked dependency versions' },
    { text: '└── README.md',             cls: 'tr-dim' },
  ];

  /* ── Terminal lines ──────────────────────────────────────── */
  const TERM_LINES = [
    { cls: 'prompt',  text: '~/code/flutter %' },
    { cls: 'cmd',     text: '$ flutter create my_app', type: true },
    { cls: 'out',     text: '' },
    { cls: 'out',     text: 'Creating project my_app...' },
    { cls: 'out',     text: 'Resolving dependencies...' },
    { cls: 'out',     text: '' },
    { cls: 'out',     text: 'Got dependencies.' },
    { cls: 'out',     text: '' },
    { cls: 'success', text: '✓  android: created successfully' },
    { cls: 'success', text: '✓  ios:     created successfully' },
    { cls: 'success', text: '✓  web:     created successfully' },
    { cls: 'success', text: '✓  lib:     created successfully' },
    { cls: 'out',     text: '' },
    { cls: 'success', text: 'All done! Project created at ./my_app' },
    { cls: 'out',     text: '' },
    { cls: 'prompt',  text: '~/code/flutter/my_app %', cursor: true },
  ];

  function esc(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function renderTree(containerId, rows) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = rows.map(row => {
      const text = esc(row.text);
      let commentHtml = '';
      if (row.comment) {
        const cls = row.commentCls || 'tr-dim';
        const style = row.commentCls ? '' : 'opacity:0.45;';
        commentHtml = `<span class="${cls}" style="${style}">${esc(row.comment)}</span>`;
      }
      const ann = row.ann ? `  <span class="tr-dim" style="color:var(--t-muted);font-style:italic;opacity:0.7">${esc(row.ann)}</span>` : '';
      return `<span class="${row.cls}">${text}</span>${commentHtml}${ann}`;
    }).join('\n');
  }

  let termPlayed = false;
  window.playTerminal = function() {
    if (termPlayed) return;
    termPlayed = true;

    const termBody = document.getElementById('term-body');
    if (!termBody) return;
    termBody.innerHTML = '';

    let lineIdx = 0;
    function printNext() {
      if (lineIdx >= TERM_LINES.length) return;
      const l = TERM_LINES[lineIdx++];

      const row = document.createElement('div');
      row.className = `term-line ${l.cls}`;

      if (l.type) {
        row.innerHTML = `<span class="term-cursor"></span>`;
        termBody.appendChild(row);
        let charIdx = 0;
        const text = l.text;
        const iv = setInterval(() => {
          if (charIdx < text.length) {
            row.textContent = text.slice(0, ++charIdx);
            row.innerHTML += `<span class="term-cursor"></span>`;
          } else {
            clearInterval(iv);
            row.querySelector('.term-cursor')?.remove();
            setTimeout(printNext, 120);
          }
        }, 28);
      } else if (l.cursor) {
        row.innerHTML = `${esc(l.text)} <span class="term-cursor"></span>`;
        termBody.appendChild(row);
      } else {
        row.textContent = l.text;
        termBody.appendChild(row);
        termBody.scrollTop = termBody.scrollHeight;
        setTimeout(printNext, l.text === '' ? 40 : 80);
      }
    }

    setTimeout(printNext, 400);
  };

  // Render on load
  document.addEventListener('DOMContentLoaded', () => {
    renderTree('tree-full', FULL_TREE);
  });
  renderTree('tree-full', FULL_TREE);
})();
