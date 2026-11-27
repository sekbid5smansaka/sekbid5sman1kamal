/* core.js — API, penyimpanan lokal, router hash, util UI. Render dari cache dulu (stale-while-revalidate). */
(function () {
  var C = window.APP_CONFIG, LS = window.localStorage;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var store = { get: function (k, d) { try { var v = LS.getItem('sb5_' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }, set: function (k, v) { try { LS.setItem('sb5_' + k, JSON.stringify(v)); } catch (e) { } }, del: function (k) { try { LS.removeItem('sb5_' + k); } catch (e) { } } };
  var bar = null, pend = 0;
  function loading(on) { bar = bar || $('.top'); pend += on ? 1 : -1; if (!bar) return; if (pend > 0) bar.style.width = '70%'; else { bar.style.width = '100%'; setTimeout(function () { if (!pend) bar.style.width = '0'; }, 250); } }
  function toast(m, err) { var t = document.createElement('div'); t.className = 'toast' + (err ? ' e' : ''); t.setAttribute('role', 'status'); t.textContent = m; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 3200); }
  function rid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function api(action, data, o) {
    o = o || {}; var body = { action: action, data: data || {}, token: store.get('token', '') }; if (o.write) body.reqId = rid();
    var n = 0; if (!o.quiet) loading(true);
    function tri() {
      return fetch(C.GAS_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) }).then(function (r) { return r.json(); }).catch(function (e) {
        if (n++ < 2) return new Promise(function (ok) { setTimeout(ok, 700 * n); }).then(tri); throw e;   // coba ulang otomatis; reqId mencegah data ganda
      });
    }
    return tri().then(function (j) { if (!o.quiet) loading(false); if (!j.success && j.code === 'AUTH') { store.del('token'); store.del('me'); if (location.hash.indexOf('#/admin') === 0) { toast('Sesi berakhir. Silakan masuk lagi.', true); location.hash = '#/login'; } } return j; })
      .catch(function () { if (!o.quiet) loading(false); return { success: false, message: 'Tidak ada koneksi ke server. Periksa internet Anda, lalu coba lagi.' }; });
  }
  var PAGES = {}, cur = { name: '', arg: '' };
  function route(keep) {
    var h = (location.hash || '#/beranda').replace(/^#\/?/, '').split('/'), name = h[0] || 'beranda', arg = h[1] || '';
    if (name === 'admin' && !store.get('token')) { location.hash = '#/login'; return; }
    var p = PAGES[name] || PAGES.beranda, el = $('#app'); cur = { name: name, arg: arg }; document.body.classList.toggle('is-admin', name === 'admin');
    document.querySelectorAll('.nav a').forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#/' + name || (name === 'login' && a.dataset.login !== undefined)); });
    $('.nav').classList.remove('open'); $('.ban') && ($('.ban').hidden = navigator.onLine);
    p(el, arg); if (keep !== true && !(name === 'admin' && arg)) window.scrollTo(0, 0);
    document.title = (p.title || 'Beranda') + ' · ' + C.NAMA;
  }
  window.SB = { $: $, esc: esc, store: store, api: api, toast: toast, PAGES: PAGES, route: route, cur: function () { return cur; }, on: {}, rid: rid };
  window.addEventListener('hashchange', function () { route(); }); window.addEventListener('online', function () { route(true); }); window.addEventListener('offline', function () { route(true); });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-go]'); if (b) { e.preventDefault(); location.hash = b.dataset.go; }
    if (e.target.closest('.burger')) $('.nav').classList.toggle('open');
  });
  /* data publik: cache dulu → segarkan di latar */
  var D = store.get('boot', null); SB.data = D;
  SB.refresh = function () {
    return api('boot', {}, { quiet: true }).then(function (j) {
      if (!j.success) return; var s = JSON.stringify(j.data.b + '|' + JSON.stringify(j.data.hasil)); var ch = !SB.data || JSON.stringify(SB.data) !== JSON.stringify(j.data);
      SB.data = j.data; store.set('boot', j.data); if (ch && SB.on.data) SB.on.data();
    });
  };
  window.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.hdr .brand').addEventListener('click', function () { location.hash = '#/beranda'; });
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(function () { });
    route(); SB.refresh();
  });
})();
