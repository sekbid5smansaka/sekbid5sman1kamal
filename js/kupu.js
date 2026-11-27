/* kupu.js — kupu-kupu yang mengikuti kursor/sentuhan. Ukuran menyesuaikan layar; bisa dimatikan; mati otomatis di panel admin. */
(function () {
  var C = (window.APP_CONFIG && window.APP_CONFIG.KUPU) || {}, LS = window.localStorage, KEY = 'sb5_kupu_off';
  if (C.aktif === false || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
  var el = document.createElement('div'); el.className = 'kupu'; el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<svg viewBox="0 0 64 64"><defs><linearGradient id="kg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9CCBFF"/><stop offset="1" stop-color="#1652F0"/></linearGradient><linearGradient id="kg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD66B"/><stop offset="1" stop-color="#F7941D"/></linearGradient></defs>' +
    '<g class="wl"><path d="M32 30C22 10 4 8 6 24c1 10 14 14 26 8z" fill="url(#kg1)"/><path d="M32 34C20 36 10 44 16 54c6 6 14-6 16-18z" fill="url(#kg2)"/></g>' +
    '<g class="wr"><path d="M32 30C42 10 60 8 58 24c-1 10-14 14-26 8z" fill="url(#kg1)"/><path d="M32 34C44 36 54 44 48 54c-6 6-14-6-16-18z" fill="url(#kg2)"/></g>' +
    '<rect x="30.5" y="22" width="3" height="26" rx="1.5" fill="#0A1F5C"/><path d="M31 22c-3-6-6-8-8-8M33 22c3-6 6-8 8-8" stroke="#0A1F5C" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>';
  document.body.appendChild(el);
  var size = 0, x = innerWidth * .8, y = innerHeight * .6, tx = x, ty = y, rot = 0, t0 = performance.now(), aktif = true, raf = 0, lx = x, ly = y;
  function ukuran() { var b = Number(C.ukuran) || 38; size = Math.round(Math.max(24, Math.min(b, b * innerWidth / 900))); el.style.width = el.style.height = size + 'px'; }
  function tampilkan() { var admin = /^#\/(admin|login)/.test(location.hash), off = LS.getItem(KEY) === '1'; el.style.display = (admin || off) ? 'none' : ''; aktif = !(admin || off); if (aktif && !raf) loop(); }
  function pindah(e) { tx = e.clientX + size * .6; ty = e.clientY + size * .6; }
  addEventListener('pointermove', pindah, { passive: true }); addEventListener('pointerdown', pindah, { passive: true });
  addEventListener('resize', ukuran); addEventListener('hashchange', tampilkan); document.addEventListener('visibilitychange', function () { if (!document.hidden) tampilkan(); });
  function loop(t) {
    raf = 0; if (!aktif || document.hidden) return; t = t || performance.now(); var s = (t - t0) / 1000;
    var gx = tx + Math.sin(s * 2.1) * size * .5, gy = ty + Math.cos(s * 1.7) * size * .4;        // melayang-layang kecil
    x += (gx - x) * .08; y += (gy - y) * .08; var dx = x - lx, dy = y - ly, v = Math.sqrt(dx * dx + dy * dy); lx = x; ly = y;
    if (v > .4) { var a = Math.atan2(dy, dx) * 180 / Math.PI + 90, d = ((a - rot + 540) % 360) - 180; rot += d * .12; }
    el.style.setProperty('--fl', Math.max(.14, .34 - v * .02).toFixed(2) + 's');
    el.style.transform = 'translate3d(' + (x - size / 2).toFixed(1) + 'px,' + (y - size / 2).toFixed(1) + 'px,0) rotate(' + rot.toFixed(1) + 'deg)'; raf = requestAnimationFrame(loop);
  }
  ukuran(); tampilkan();
  window.SB && (SB.kupuToggle = function () { var off = LS.getItem(KEY) === '1'; off ? LS.removeItem(KEY) : LS.setItem(KEY, '1'); tampilkan(); return !off; });
})();
