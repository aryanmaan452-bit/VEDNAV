/* Shared, dependency-free theme controller for the storefront and React account page. */
(function () {
  'use strict';
  var key = 'vednav-theme';
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  var preference = null;
  try { var saved = localStorage.getItem(key); if (saved === 'light' || saved === 'dark') preference = saved; } catch (_) {}
  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelectorAll('.theme-toggle').forEach(function (button) {
      button.setAttribute('aria-checked', String(theme === 'dark'));
      button.setAttribute('aria-label', 'Dark theme');
      button.title = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#111a17' : '#f7f5ef';
  }
  setTheme(preference || (media.matches ? 'dark' : 'light'));
  function pixelIcon(rows, name) {
    var rects = '';
    rows.forEach(function (row, y) { Array.from(row).forEach(function (cell, x) { if (cell === '1') rects += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>'; }); });
    return '<svg class="pixel-icon ' + name + '" viewBox="0 0 11 11" aria-hidden="true" shape-rendering="crispEdges">' + rects + '</svg>';
  }
  function mount() {
    var slot = document.querySelector('[data-theme-slot]');
    if (!slot || slot.querySelector('.theme-toggle')) return;
    var button = document.createElement('button');
    button.type = 'button'; button.className = 'theme-toggle'; button.setAttribute('role', 'switch');
    button.innerHTML = '<span class="theme-track" aria-hidden="true"><span class="theme-thumb"></span>' + pixelIcon(['00000100000','01000000010','00100100100','00011111000','00011111000','10111111101','00011111000','00011111000','00100100100','01000000010','00000100000'], 'sun') + pixelIcon(['00011110000','00111100000','01111000000','01110000000','11110000000','11110000000','11111000001','01111100011','01111111110','00111111100','00011111000'], 'moon') + '</span>';
    button.addEventListener('click', function () { preference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; try { localStorage.setItem(key, preference); } catch (_) {} setTheme(preference); });
    slot.appendChild(button); setTheme(document.documentElement.dataset.theme);
  }
  media.addEventListener('change', function () { if (!preference) setTheme(media.matches ? 'dark' : 'light'); });
  window.addEventListener('storage', function (event) { if (event.key === key || event.key === null) { preference = event.newValue === 'dark' || event.newValue === 'light' ? event.newValue : null; setTheme(preference || (media.matches ? 'dark' : 'light')); } });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, {once:true}); else mount();
})();
