/* Service worker: shell aplikasi di-cache (instan & jalan offline); panggilan API TIDAK pernah di-cache. */
var V = 'sb5-v5', SHELL = ['./', 'index.html', 'css/style.css', 'js/config.js', 'js/core.js', 'js/publik.js', 'js/admin.js', 'js/ai-setup.js', 'js/kupu.js', 'img/hero.webp', 'img/logo.png', 'manifest.json'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(V).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (x) { return x !== V; }).map(function (x) { return caches.delete(x); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url); if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(caches.match(e.request).then(function (hit) {
    var net = fetch(e.request).then(function (r) { if (r.ok) { var cp = r.clone(); caches.open(V).then(function (c) { c.put(e.request, cp); }); } return r; }).catch(function () { return hit; });
    return hit || net;
  }));
});
