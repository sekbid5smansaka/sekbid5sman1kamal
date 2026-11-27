/* publik.js — halaman publik: render dari cache lokal seketika, data baru menyusul di latar. */
(function () {
  var $ = SB.$, esc = SB.esc, P = SB.PAGES;
  var PIL = [
    { n: 'Demokrasi & Pendidikan Politik', c: '#1652F0', i: '🗳️', img: 'pilar-demokrasi', peran: 'Melatih siswa berorganisasi secara jujur, bermusyawarah, serta menyalurkan aspirasi dan hak pilih secara demokratis.', prog: ['Pemilos langsung', 'LDKS', 'Forum aspirasi dan survei kebijakan sekolah', 'Lomba debat dan pidato antarkelas'] },
    { n: 'HAM & Anti-Perundungan', c: '#7B2FF7', i: '🛡️', img: 'pilar-ham', peran: 'Menegakkan kesadaran hak dan kewajiban siswa serta menciptakan iklim sekolah yang aman dan bebas kekerasan.', prog: ['Panitia inti MPLS ramah anak dan bebas perpeloncoan', 'Kampanye anti-bullying', 'Sosialisasi tata tertib serta hak dan kewajiban siswa'] },
    { n: 'Lingkungan Hidup', c: '#22A06B', i: '🌱', img: 'pilar-lingkungan', peran: 'Menumbuhkan kepedulian warga sekolah terhadap kebersihan, kelestarian, dan pengelolaan sampah.', prog: ['Penghijauan dan penanaman pohon', 'Bank sampah dan pemilahan sampah kelas', 'Lomba kebersihan dan keindahan kelas', 'Hari Bumi / Green Day Action'] },
    { n: 'Kepekaan & Toleransi Sosial', c: '#F7941D', i: '🤝', img: 'pilar-sosial', peran: 'Membangun empati, gotong royong, dan sikap saling menghargai keberagaman suku, agama, serta latar belakang sosial.', prog: ['Penggalangan dana bencana alam dan duka cita', 'Bakti sosial ke panti asuhan atau masyarakat sekitar', 'Peringatan Hari Guru / Teacher\'s Day'] }];
  var TUGAS = ['Memantapkan dan mengembangkan peran siswa di dalam OSIS sesuai dengan tugasnya masing-masing;', 'Melaksanakan latihan kepemimpinan siswa;', 'Melaksanakan kegiatan dengan prinsip kejujuran, transparan, dan profesional;', 'Melaksanakan kewajiban dan hak diri dan orang lain dalam pergaulan masyarakat;', 'Melaksanakan kegiatan kelompok belajar, diskusi, debat dan pidato;', 'Melaksanakan kegiatan orientasi siswa baru yang bersifat akademik dan pengenalan lingkungan tanpa kekerasan;', 'Melaksanakan penghijauan dan perindangan lingkungan sekolah.'];
  var NAMA_RESMI = 'Seksi Pembinaan Demokrasi, Hak Asasi Manusia, Pendidikan Politik, Lingkungan Hidup, Kepekaan dan Toleransi Sosial dalam Konteks Masyarakat Plural';
  var ST = ['Diterima', 'Sedang Dibahas', 'Terlaksana', 'Tidak Dapat Dilanjutkan'];
  function pil(n) { return PIL.filter(function (p) { return p.n === n; })[0] || PIL[0]; }
  function tgl(s) { var d = new Date(s); return isNaN(d) ? '' : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }); }
  function pisah(x) { var j = String(x.nama_program || ''), d = String(x.deskripsi || ''), k = j.indexOf(': '); if (!d && k > 3 && k < 90) { d = j.slice(k + 2); j = j.slice(0, k); } return { j: j, d: d }; }   // data lama "Judul: deskripsi" dipisah saat tampil
  function B() { return SB.data && SB.data.b; }
  function S(k, d) { var b = B(); return (b && b.setting && b.setting[k]) || d; }                                   // teks konten dari admin (kosong = bawaan)
  function foto(k, def) { var id = S(k, ''); return id ? 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(id) + '&sz=w1200' : 'img/' + def; }
  function slogan() { var t = S('slogan', 'Suaramu, Perubahan Kita'), i = t.indexOf(','); return i > 0 ? esc(t.slice(0, i + 1)) + '<br><b>' + esc(t.slice(i + 1).trim()) + '</b>' : esc(t); }
  function skel() { return '<div class="wrap sec"><div class="sk" style="min-height:260px"></div></div>'; }
  function gambar(id) { return id ? 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(id) + '&sz=w800' : ''; }
  function pilChip(n) { var p = pil(n); return '<span class="chip" style="background:' + p.c + '1f;color:' + p.c + '">' + p.i + ' ' + esc(n) + '</span>'; }
  function stBadge(s) { return '<span class="st s' + Math.max(0, ST.indexOf(s)) + '">' + esc(s) + '</span>'; }
  function wrapSec(t, e, body) { return '<section class="sec"><div class="wrap">' + (e ? '<div class="eyebrow">' + e + '</div>' : '') + (t ? '<h2>' + t + '</h2>' : '') + '<div style="margin-top:' + (t ? 18 : 0) + 'px">' + body + '</div></div></section>'; }
  function banner(o) { return '<section class="pgb"><div class="wrap"><nav class="crumb" aria-label="Breadcrumb"><a href="#/beranda">Beranda</a> › <b>' + o.crumb + '</b></nav><div class="pgb-g"><div><span class="tag">' + o.tag + '</span><h1>' + o.judul + '</h1><p>' + o.desk + '</p>' + (o.aksi ? '<div class="cta">' + o.aksi + '</div>' : '') + '</div>' + (o.sisi ? '<aside class="pgb-s">' + o.sisi + '</aside>' : '') + '</div></div></section>'; }
  function sg(a) { return '<div class="sg">' + a.map(function (x) { return '<div><b>' + esc(x[0]) + '</b><span>' + x[1] + '</span></div>'; }).join('') + '</div>'; }
  function cnt(arr, f) { return (arr || []).filter(f).length; }

  P.beranda = function (el) {
    var b = B(), s = b ? b.stats : { aspirasi: '–', terlaksana: '–', program: '–', survei: '–' }, inf = b ? b.informasi.slice(0, 4) : [];
    el.innerHTML = '<section class="hero"><div class="wrap"><div><span class="chip" style="background:rgba(255,255,255,.15);color:#fff">Sekbid 5 OSIS SMAN 1 Kamal</span><h1 style="margin-top:14px">' + slogan() + '</h1>' +
      '<p>' + esc(S('hero_deskripsi', 'Baca program kerja, isi survei, kirim aspirasi (boleh anonim), dan pantau tindak lanjutnya secara terbuka.')) + '</p><div class="cta"><a class="btn" style="background:#fff;color:var(--blue)" href="#/aspirasi">Kirim Aspirasi →</a><a class="btn ghost" href="#/survei">Isi Survei</a></div><div class="hand">Small voices, big change.</div></div>' +
      '<div class="hfig"><img src="' + esc(foto('hero_foto', 'hero.webp')) + '" alt="Foto kegiatan Sekbid 5 SMAN 1 Kamal" width="1000" height="558" fetchpriority="high"><span class="tag">' + esc(S('hero_tag', 'Suara Siswa, Aksi Nyata')) + '</span>' +
      '<div class="cap"><i>📍</i><div><b>' + esc(S('hero_cap_judul', '7 Tugas Pokok Pembinaan Kesiswaan')) + '</b><small>' + esc(S('hero_cap_desk', 'Sekbid 5 OSIS SMAN 1 Kamal · Bangkalan, Pulau Madura')) + '</small></div></div></div></div></section>' +
      '<div class="wrap"><div class="quick">' + [['#/aspirasi', '✍️', 'Kirim Aspirasi', 'Suaramu didengar', '#1652F0'], ['#/survei', '📊', 'Isi Survei', 'Jajak pendapat singkat', '#12B5A5'], ['#/program', '📅', 'Program Kerja', 'Jadwal & kegiatan', '#F7941D'], ['#/transparansi', '🔎', 'Papan Transparansi', 'Dari aspirasi ke aksi', '#7B2FF7']].map(function (q) {
        return '<a class="card hov qc" href="' + q[0] + '"><span class="ico" style="background:' + q[4] + '">' + q[1] + '</span><span><b>' + q[2] + '</b><small>' + q[3] + '</small></span></a>'; }).join('') + '</div></div>' +
      '<section class="sec"><div class="wrap"><div class="mandat"><figure class="ph"><img src="' + esc(foto('mandat_foto', 'mandat.webp')) + '" alt="Foto mandat kesiswaan" loading="lazy" width="1000" height="558"><figcaption class="cap"><span class="chip">Kegiatan Sekbid 5</span><b style="margin-top:6px">' + esc(S('mandat_cap_judul', 'Demokrasi & Pendidikan Politik')) + '</b><small>' + esc(S('mandat_cap_desk', 'Pemilos, LDKS, debat, dan forum aspirasi siswa SMAN 1 Kamal.')) + '</small></figcaption></figure>' +
      '<div class="card txt"><span class="chip">Mandat Kesiswaan</span><h2 style="margin-top:10px">' + esc(S('mandat_judul', 'Membangun Karakter Melalui Edukasi Demokrasi & HAM')) + '</h2><p>' + esc(NAMA_RESMI) + '.</p><p>' + esc(S('mandat_teks', 'Berlandaskan Permendiknas Nomor 39 Tahun 2008 tentang Pembinaan Kesiswaan, Sekbid 5 berkoordinasi dengan MPK untuk menampung aspirasi tiap kelas.')) + '</p><p style="margin-top:16px"><a class="btn" href="#/tentang">Pelajari 7 Tugas Pokok</a></p></div>' +
      '<div class="mstat">' + [['aspirasi', 'Aspirasi masuk', '💬', '#1652F0'], ['terlaksana', 'Terlaksana', '✅', '#22A06B'], ['program', 'Program berjalan', '🚀', '#F7941D'], ['survei', 'Survei aktif', '📊', '#7B2FF7']].map(function (x) { return '<div class="card"><span class="ico" style="background:' + x[3] + '">' + x[2] + '</span><div><b>' + esc(s[x[0]]) + '</b><span>' + x[1] + '</span></div></div>'; }).join('') + '</div></div></div></section>' +
      wrapSec('Empat Pilar Kegiatan', 'Fokus kami', '<div class="grid g4">' + PIL.map(function (p, i) { return '<a class="pilar" href="#/tentang" style="border-top:4px solid ' + p.c + '"><img src="' + esc(foto('pilar_foto_' + (i + 1), p.img + '.webp')) + '" alt="' + esc(p.n) + '" loading="lazy" width="1000" height="558"><span class="ico" style="background:' + p.c + '">' + p.i + '</span><h3>' + esc(p.n) + '</h3><p class="muted" style="font-size:14px;margin-top:6px">' + esc(p.peran) + '</p></a>'; }).join('') + '</div>') +
      wrapSec('Informasi Terbaru', 'Kabar Sekbid 5', b ? (inf.length ? '<div class="grid g2">' + inf.map(infoCard).join('') + '</div>' : '<p class="muted">Belum ada informasi.</p>') : '<div class="sk"></div>');
  };
  function infoCard(i) { return '<article class="card"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap">' + pilChip(i.pilar || PIL[0].n) + '<small class="muted">' + tgl(i.tanggal_terbit) + '</small></div><h3 style="margin:10px 0 6px">' + esc(i.judul) + '</h3><p class="muted" style="font-size:14px">' + esc(i.ringkasan) + '</p></article>'; }

  var PROFIL_DEF = { label: 'Visi Kebangsaan & Demokrasi Sekolah', judul: 'Menumbuhkan Kepemimpinan Inklusif & Berwawasan Kemanusiaan', deskripsi: 'Sekbid 5 OSIS SMAN 1 Kamal membina demokrasi, hak asasi manusia, pendidikan politik, kelestarian lingkungan, serta kepekaan dan toleransi sosial di tengah masyarakat yang majemuk.\n\nMelalui Pemilos, forum aspirasi, dan kegiatan peduli lingkungan, siswa belajar berpendapat secara santun, menghargai perbedaan, dan bertanggung jawab atas pilihannya.', local1: 'img/mandat.webp', cap1: 'Demokrasi & Pendidikan Politik' };
  function profilSec() {
    var b = B(), arr = b && b.profil && b.profil.length ? b.profil : [PROFIL_DEF];
    return arr.map(function (x, n) {
      var ph = [[x.id_foto1 ? 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(x.id_foto1) + '&sz=w1000' : x.local1 || '', x.cap1], [x.id_foto2 ? 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(x.id_foto2) + '&sz=w800' : '', x.cap2], [x.id_foto3 ? 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(x.id_foto3) + '&sz=w800' : '', x.cap3]].filter(function (f) { return f[0]; });
      function fig(f, cls) { return '<figure class="' + cls + '"><img src="' + esc(f[0]) + '" alt="' + esc(f[1] || x.judul) + '" loading="lazy">' + (f[1] ? '<figcaption>' + esc(f[1]) + '</figcaption>' : '') + '</figure>'; }
      var kol = ph.length ? '<div class="vph">' + fig(ph[0], 'vm') + (ph.length > 1 ? '<div class="vsm" style="grid-template-columns:repeat(' + (ph.length - 1) + ',1fr)">' + ph.slice(1).map(function (f) { return fig(f, 'vs'); }).join('') + '</div>' : '') + '</div>' : '';
      var paras = String(x.deskripsi || '').split(/\n+/).filter(function (t) { return t.trim(); }).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');
      var st = [[x.stat1_angka, x.stat1_label], [x.stat2_angka, x.stat2_label]].filter(function (z) { return z[0]; });
      return '<section class="sec"><div class="wrap"><div class="vis' + (!ph.length ? ' solo' : (n % 2 ? ' rev' : '')) + '">' + kol + '<div class="vtx">' + (x.label ? '<span class="chip">' + esc(x.label) + '</span>' : '') + '<h2 style="margin:10px 0">' + esc(x.judul) + '</h2>' + paras + (st.length ? '<div class="vst">' + st.map(function (z) { return '<div class="card"><b>' + esc(z[0]) + '</b><span>' + esc(z[1]) + '</span></div>'; }).join('') + '</div>' : '') + '</div></div></div></section>';
    }).join('');
  }
  function pengurusSec() {
    var b = B(), g = b && b.pengurus || []; if (!g.length) return '';
    var W = ['#1652F0', '#7B2FF7', '#22A06B', '#F7941D'], per = S('periode', '');
    return '<section class="sec"><div class="wrap"><div style="text-align:center"><span class="chip">Struktur Kepengurusan</span><h2 style="margin-top:10px">Pengurus Sekbid 5' + (per ? ' Periode ' + esc(per) : '') + '</h2><p class="muted" style="margin-top:6px">Amanah kepengurusan siswa yang berdedikasi menjaga demokrasi dan kelestarian lingkungan di SMAN 1 Kamal.</p></div><div class="grid g3" style="margin-top:24px">' + g.map(function (x, i) {
      var c = W[i % 4], ph = x.id_foto ? '<img class="ph2" loading="lazy" src="https://drive.google.com/thumbnail?id=' + encodeURIComponent(x.id_foto) + '&sz=w300" alt="' + esc(x.nama) + '">' : '<div class="ph2">' + esc((x.nama || '?').trim().charAt(0).toUpperCase()) + '</div>';
      return '<article class="peng">' + (x.jabatan ? '<span class="bd" style="background:' + c + '1f;color:' + c + '">' + esc(x.jabatan) + '</span>' : '') + ph + '<h3>' + esc(x.nama) + '</h3><div class="dv" style="color:' + c + '">' + esc(x.divisi) + '</div><p>' + esc(x.deskripsi) + '</p>' + (x.kelas || x.label ? '<div class="ft"><span>🎓 ' + esc(x.kelas) + '</span><span>' + esc(x.label) + '</span></div>' : '') + '</article>'; }).join('') + '</div></div></section>';
  }
  P.tentang = function (el) {
    el.innerHTML = banner({ crumb: 'Tentang Sekbid 5', tag: 'PROFIL RESMI & LANDASAN YURIDIS ORGANISASI', judul: 'Sekbid 5 OSIS SMAN 1 Kamal', desk: esc(NAMA_RESMI) + '.', aksi: '<a class="btn w" href="#tugas-pokok" data-scroll="tugas-pokok">Pelajari 7 Tugas Pokok</a><a class="btn gl" href="#/program">Program Kerja</a>',
      sisi: '<small>Rujukan</small><p style="margin:6px 0;color:#fff;font-weight:700">Permendiknas Nomor 39 Tahun 2008</p><p style="font-size:13px;margin:0">tentang Pembinaan Kesiswaan</p>' + sg([['4', 'Pilar kegiatan'], ['7', 'Tugas pokok']]) }) +
      profilSec() + '<section class="sec" id="tugas-pokok"><div class="wrap"><div class="eyebrow">Mandat kesiswaan</div><h2>7 Tugas Pokok Sekbid 5</h2><p class="muted" style="margin:6px 0 16px">Antara lain:</p><div class="tg2">' + TUGAS.map(function (t, i) { return '<div class="tugas-i"><span class="n">' + (i + 1) + '</span><span>' + esc(t) + '</span></div>'; }).join('') + '</div></div></section>' +
      '<section class="sec"><div class="wrap"><div class="eyebrow">Fokus pengabdian</div><h2>Empat Pilar Kegiatan &amp; Contoh Program Kerja</h2><div class="grid g2" style="margin-top:18px">' + PIL.map(function (p, i) { return '<article class="pdet" style="border-top-color:' + p.c + '"><img src="' + esc(foto('pilar_foto_' + (i + 1), p.img + '.webp')) + '" alt="' + esc(p.n) + '" loading="lazy" width="1000" height="558"><div><h3>' + p.i + ' ' + esc(p.n) + '</h3><p class="muted" style="font-size:14px;margin-top:6px">' + esc(p.peran) + '</p><b style="font-size:14px;display:block;margin-top:10px">Contoh program kerja</b><ul>' + p.prog.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div></article>'; }).join('') + '</div></div></section>' +
      wrapSec('Sinergi dengan MPK', '', '<div class="card">Sekbid 5 berkoordinasi erat dengan Majelis Perwakilan Kelas (MPK), sebagai perwakilan aspirasi tiap kelas, dalam menjalankan survei dan menampung aspirasi.</div>') + pengurusSec() +
      '<section class="sec"><div class="wrap"><div class="cta2"><div><span class="tag">SUARAMU PENTING</span><h2>Ada Masukan, Saran Kebijakan, atau Laporan Kesiswaan?</h2><p>Sampaikan melalui kanal resmi SUARA SEKBID 5 SMAN 1 Kamal. Kami menjamin kerahasiaan identitas dan transparansi penanganan setiap masukan.</p></div><div class="ac2"><a class="btn w" href="#/aspirasi">Kirim Aspirasi Sekarang</a><a class="btn gl" href="#/program">Jadwal Program Kerja</a></div></div></div></section>';
    var sc = el.querySelector('[data-scroll]'); if (sc) sc.onclick = function (e) { e.preventDefault(); var t = document.getElementById(this.dataset.scroll); t && t.scrollIntoView({ behavior: 'smooth' }); };
  };
  P.tentang.title = 'Tentang';

  P.program = function (el) {
    var b = B(), f = { p: '', s: '' };
    function draw() {
      var rows = (b ? b.program : []).filter(function (x) { return (!f.p || x.pilar === f.p) && (!f.s || x.status === f.s); });
      $('#lp').innerHTML = !b ? '<div class="sk"></div>' : rows.length ? rows.map(function (x) { return '<article class="card"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap">' + pilChip(x.pilar) + '<span class="pill">' + esc(x.status || '—') + '</span></div><h3 style="margin:10px 0 4px">' + esc(pisah(x).j) + '</h3>' + (pisah(x).d ? '<p class="muted" style="font-size:14px;font-weight:400;margin:0 0 8px">' + esc(pisah(x).d) + '</p>' : '') + '<p class="muted" style="font-size:14px">📅 ' + tgl(x.tanggal_mulai) + (x.tanggal_selesai ? ' – ' + tgl(x.tanggal_selesai) : '') + (x.lokasi ? ' · 📍 ' + esc(x.lokasi) : '') + '</p></article>'; }).join('') : '<p class="muted">Tidak ada program yang cocok dengan filter.</p>';
    }
    var pg = b ? b.program : []; el.innerHTML = banner({ crumb: 'Program Kerja', tag: 'AGENDA & REALISASI KEGIATAN', judul: 'Program Kerja & Agenda Aksi Nyata', desk: 'Transparansi pelaksanaan program kesiswaan berlandaskan 4 pilar utama Sekbid 5.', aksi: '<a class="btn w" href="#/aspirasi">Usulkan Kegiatan</a>', sisi: '<small>Ringkasan capaian</small>' + sg([[pg.length, 'Total program'], [cnt(pg, function (x) { return x.status === 'Direncanakan'; }), 'Direncanakan'], [cnt(pg, function (x) { return x.status === 'Berjalan'; }), 'Sedang berjalan'], [cnt(pg, function (x) { return x.status === 'Selesai'; }), 'Selesai']]) }) + wrapSec('', '', '<div class="grid g2" style="margin-bottom:16px"><select id="fp" aria-label="Filter pilar"><option value="">Semua pilar</option>' + PIL.map(function (p) { return '<option>' + esc(p.n) + '</option>'; }).join('') + '</select><select id="fs" aria-label="Filter status"><option value="">Semua status</option><option>Direncanakan</option><option>Berjalan</option><option>Selesai</option></select></div><div id="lp" class="grid g2"></div>');
    $('#fp').onchange = function () { f.p = this.value; draw(); }; $('#fs').onchange = function () { f.s = this.value; draw(); }; draw();
  };
  P.program.title = 'Program';

  P.dokumentasi = function (el) {
    var b = B(), imgs = b ? b.informasi.filter(function (i) { return i.id_gambar; }) : [], links = b ? b.program.filter(function (p) { return p.link_dokumentasi; }) : [];
    el.innerHTML = banner({ crumb: 'Dokumentasi', tag: 'GALERI KEGIATAN', judul: 'Dokumentasi Kegiatan Sekbid 5', desk: 'Foto dan album kegiatan. Foto siswa dipakai hanya dengan izin.', sisi: '<small>Koleksi</small>' + sg([[imgs.length, 'Foto'], [links.length, 'Album']]) }) + wrapSec('', '', !b ? '<div class="sk"></div>' : (imgs.length ? '<div class="grid g3">' + imgs.map(function (i) { return '<figure class="card" style="padding:0;overflow:hidden"><img loading="lazy" src="' + esc(gambar(i.id_gambar)) + '" alt="' + esc(i.judul) + '" style="aspect-ratio:4/3;object-fit:cover;width:100%"><figcaption style="padding:12px;font-size:14px">' + esc(i.judul) + '</figcaption></figure>'; }).join('') + '</div>' : '') +
      (links.length ? '<h3 style="margin:20px 0 10px">Album kegiatan</h3><div class="grid g2">' + links.map(function (p) { return '<a class="card hov" target="_blank" rel="noopener" href="' + esc(p.link_dokumentasi) + '">📁 ' + esc(pisah(p).j) + '</a>'; }).join('') + '</div>' : '') + (!imgs.length && !links.length ? '<p class="muted">Dokumentasi belum tersedia. Foto dipakai hanya dengan izin.</p>' : ''));
  };
  P.dokumentasi.title = 'Dokumentasi';

  /* ---- Kirim aspirasi ---- */
  P.aspirasi = function (el) {
    var t0 = Date.now(), b = B(), mend = b ? b.setting.teks_mendesak : 'Untuk kejadian mendesak atau yang mengancam keselamatan, segera hubungi Guru BK atau orang dewasa tepercaya.', riwayat = SB.store.get('kodeku', []);
    el.innerHTML = banner({ crumb: 'Kirim Aspirasi', tag: 'SUARAMU PENTING', judul: 'Kirim Aspirasi', desk: 'Sampaikan ide, kritik, dan masukan secara terbuka. Boleh anonim: nama dan kelas tidak disimpan.', aksi: '<a class="btn w" href="#/transparansi">Lacak Aspirasi</a>', sisi: '<small>Aspirasi</small>' + sg([[b ? b.stats.aspirasi : '–', 'Masuk'], [b ? b.stats.terlaksana : '–', 'Terlaksana']]) }) + wrapSec('', '', '<div class="grid g2" style="align-items:start"><form class="card" id="fa" novalidate>' +
      '<div class="fg"><label for="pl">Pilar</label><select id="pl" required><option value="">— Pilih pilar —</option>' + PIL.map(function (p) { return '<option>' + esc(p.n) + '</option>'; }).join('') + '</select></div>' +
      '<div class="fg"><label for="jd">Judul singkat (opsional)</label><input id="jd" maxlength="120"></div>' +
      '<div class="fg"><label for="is">Aspirasi Anda</label><textarea id="is" maxlength="1500" required></textarea><small class="muted"><span id="cn">0</span>/1.500 karakter (minimal 20)</small></div>' +
      '<label class="chk"><input type="checkbox" id="an" checked> Kirim sebagai anonim</label>' +
      '<div id="idn" hidden style="margin-top:12px"><div class="fg"><label for="nm">Nama</label><input id="nm" maxlength="80" autocomplete="name"></div><div class="fg"><label for="kl">Kelas</label><input id="kl" maxlength="20" placeholder="mis. XI-3"></div></div>' +
      '<p class="note" id="wan" style="margin:12px 0">Jika ingin anonim, jangan menulis data yang membuka identitas diri (nama, kelas, nomor HP) di dalam isi aspirasi.</p>' +
      '<div class="hp" aria-hidden="true"><input id="web" tabindex="-1" autocomplete="off"></div><div class="err" id="er" role="alert"></div>' +
      '<button class="btn" id="kr" type="submit" style="width:100%;margin-top:8px">Kirim Aspirasi</button></form>' +
      '<div><div class="note"><b>Mendesak?</b><br>' + esc(mend) + '</div>' + (riwayat.length ? '<div class="card" style="margin-top:14px"><b>Kode lacak di perangkat ini</b>' + riwayat.map(function (k) { return '<div style="margin-top:6px"><a href="#/transparansi" class="pill" data-k="' + esc(k) + '">' + esc(k) + '</a></div>'; }).join('') + '</div>' : '') + '</div></div>');
    var f = $('#fa'); $('#is').oninput = function () { $('#cn').textContent = this.value.length; };
    $('#an').onchange = function () { $('#idn').hidden = this.checked; $('#wan').hidden = !this.checked; };
    el.querySelectorAll('[data-k]').forEach(function (a) { a.onclick = function () { SB.store.set('lacak', this.dataset.k); }; });
    f.onsubmit = function (e) {
      e.preventDefault(); var d = { pilar: $('#pl').value, judul: $('#jd').value, isi: $('#is').value.trim(), anonim: $('#an').checked, nama: $('#nm').value, kelas: $('#kl').value, web: $('#web').value, dur: Date.now() - t0 }, er = $('#er');
      if (!d.pilar) return er.textContent = 'Pilih pilar aspirasi.'; if (d.isi.length < 20) return er.textContent = 'Isi aspirasi minimal 20 karakter.'; if (!d.anonim && (!d.nama.trim() || !d.kelas.trim())) return er.textContent = 'Nama dan kelas wajib diisi bila tidak anonim.';
      er.textContent = ''; var btn = $('#kr'); btn.disabled = true; btn.textContent = 'Mengirim…';
      SB.api('aspirasi.kirim', d, { write: true }).then(function (j) {
        if (!j.success) { btn.disabled = false; btn.textContent = 'Kirim Aspirasi'; er.textContent = j.message; return; }
        var k = j.data.kode, h = SB.store.get('kodeku', []); h.unshift(k); SB.store.set('kodeku', h.slice(0, 10));
        f.outerHTML = '<div class="okbox" style="grid-column:1"><h3>Terima kasih! Aspirasi terkirim ✅</h3><p>Simpan kode lacak ini untuk memantau tindak lanjutnya:</p><p style="font-size:28px;font-weight:800;color:var(--navy);margin:8px 0" id="kd">' + esc(k) + '</p><button class="btn sm" id="cp">Salin kode</button> <a class="btn sm out" href="#/transparansi" id="lc">Lacak sekarang</a></div>';
        $('#cp').onclick = function () { (navigator.clipboard ? navigator.clipboard.writeText(k) : Promise.reject()).then(function () { SB.toast('Kode disalin'); }, function () { SB.toast('Salin manual: ' + k); }); };
        $('#lc').onclick = function () { SB.store.set('lacak', k); };
      });
    };
  };
  P.aspirasi.title = 'Kirim Aspirasi';

  /* ---- Survei ---- */
  P.survei = function (el) {
    var b = B(), done = SB.store.get('srvdone', {}), hasil = SB.data ? SB.data.hasil : {};
    function res(s) { var h = hasil[s.id]; if (!h) return ''; var mx = Math.max.apply(null, [1].concat(Object.keys(h.hitung).map(function (k) { return h.hitung[k]; }))); return '<div style="margin-top:12px"><b style="font-size:14px">Hasil sementara (' + h.total + ' jawaban)</b>' + Object.keys(h.hitung).map(function (k) { var n = h.hitung[k]; return '<div style="margin-top:8px;font-size:14px;display:flex;justify-content:space-between"><span>' + esc(k) + '</span><b>' + n + '</b></div><div class="bar"><i style="width:' + Math.round(n / mx * 100) + '%"></i></div>'; }).join('') + '</div>'; }
    el.innerHTML = banner({ crumb: 'Survei', tag: 'PORTAL PARTISIPASI DEMOKRASI SISWA', judul: 'Survei & Jajak Pendapat Siswa', desk: 'Preferensimu menjadi dasar perumusan program kerja Sekbid 5 bersama MPK.', sisi: '<small>Survei</small>' + sg([[b ? b.survei.length : '–', 'Sedang dibuka'], [Object.keys(hasil).reduce(function (n, k) { return n + hasil[k].total; }, 0), 'Jawaban masuk']]) }) + wrapSec('', '', !b ? '<div class="sk"></div>' : b.survei.length ? '<div class="note" style="margin-bottom:14px">Satu jawaban per perangkat. Hasil bersifat jajak pendapat, bukan pemungutan suara resmi.</div><div class="grid g2">' + b.survei.map(function (s) {
      var inp = s.tipe === 'skala 1–5' ? [1, 2, 3, 4, 5].map(function (n) { return '<label class="chk"><input type="radio" name="r' + esc(s.id) + '" value="' + n + '"> ' + n + '</label>'; }).join('') : s.pilihan.map(function (o) { return '<label class="chk"><input type="' + (s.tipe === 'pilihan ganda' ? 'checkbox' : 'radio') + '" name="r' + esc(s.id) + '" value="' + esc(o) + '"> ' + esc(o) + '</label>'; }).join('');
      return '<div class="card" data-s="' + esc(s.id) + '"><h3>' + esc(s.judul) + '</h3><p class="muted" style="margin:6px 0 12px">' + esc(s.pertanyaan) + '</p>' + (done[s.id] ? '<div class="okbox">Anda sudah mengisi survei ini. Terima kasih! ✅</div>' : '<div style="display:grid;gap:8px">' + inp + '</div><div class="hp" aria-hidden="true"><input class="web" tabindex="-1"></div><div class="err"></div><button class="btn sm" style="margin-top:12px">Kirim jawaban</button>') + (s.tampilkan_hasil ? res(s) : '') + '</div>'; }).join('') + '</div>' : '<p class="muted">Belum ada survei aktif.</p>');
    el.querySelectorAll('[data-s]').forEach(function (c) {
      var bt = c.querySelector('button'); if (!bt) return; var id = c.dataset.s, s = b.survei.filter(function (x) { return x.id === id; })[0];
      bt.onclick = function () {
        var ch = [].slice.call(c.querySelectorAll('input:checked')).map(function (i) { return i.value; }), er = c.querySelector('.err'); if (!ch.length) return er.textContent = 'Pilih jawaban dulu.';
        var j = s.tipe === 'pilihan ganda' ? ch : s.tipe === 'skala 1–5' ? Number(ch[0]) : ch[0]; bt.disabled = true;
        SB.api('survei.jawab', { id: id, jawaban: j, web: c.querySelector('.web').value }, { write: true }).then(function (r) { if (!r.success) { bt.disabled = false; er.textContent = r.message; return; } done[id] = 1; SB.store.set('srvdone', done); SB.toast(r.message); P.survei(el); SB.refresh(); });
      };
    });
  };
  P.survei.title = 'Survei';

  /* ---- Papan transparansi ---- */
  P.transparansi = function (el) {
    var b = B(), ps = b ? b.papan : [];
    function kol(i) { var r = ps.filter(function (x) { return x.status === ST[i]; }); return '<div class="col"><h3>' + stBadge(ST[i]) + '<span class="pill">' + r.length + '</span></h3>' + (r.length ? r.map(function (x) { return '<div class="it"><div>' + pilChip(x.pilar) + '</div><p style="margin:8px 0 4px">' + esc(x.ringkasan) + '</p><small class="muted">' + esc(x.kode) + ' · ' + tgl(x.tgl) + '</small></div>'; }).join('') : '<p class="muted" style="font-size:14px">Belum ada.</p>') + '</div>'; }
    var tak = ps.filter(function (x) { return x.status === ST[3]; });
    el.innerHTML = banner({ crumb: 'Papan Transparansi', tag: 'DARI ASPIRASI KE AKSI', judul: 'Papan Transparansi', desk: 'Pantau status tindak lanjut aspirasi siswa secara terbuka. Hanya ringkasan yang disetujui admin yang ditampilkan.', sisi: '<small>Status</small>' + sg([[cnt(ps, function (x) { return x.status === ST[0]; }), 'Diterima'], [cnt(ps, function (x) { return x.status === ST[1]; }), 'Dibahas'], [cnt(ps, function (x) { return x.status === ST[2]; }), 'Terlaksana'], [cnt(ps, function (x) { return x.status === ST[3]; }), 'Tidak dilanjutkan']]) }) + wrapSec('', '', '<form class="card" id="fl" style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px"><input id="kd" placeholder="Masukkan kode lacak, mis. SBK5-AB12CD" style="flex:1;min-width:220px" aria-label="Kode lacak" autocapitalize="characters"><button class="btn">Lacak</button></form><div id="hs"></div>' +
      (b ? '<div class="board">' + kol(0) + kol(1) + kol(2) + '</div>' + (tak.length ? '<h3 style="margin:24px 0 10px">' + stBadge(ST[3]) + '</h3><div class="grid g2">' + tak.map(function (x) { return '<div class="card"><p>' + esc(x.ringkasan) + '</p><p class="muted" style="font-size:14px;margin-top:6px"><b>Alasan:</b> ' + esc(x.alasan) + '</p></div>'; }).join('') + '</div>' : '') : '<div class="sk"></div>'));
    function cari(k) { $('#kd').value = k; $('#hs').innerHTML = '<div class="sk" style="min-height:60px"></div>'; SB.api('aspirasi.lacak', { kode: k }).then(function (j) { $('#hs').innerHTML = j.success ? '<div class="card" style="margin-bottom:18px;border-left:5px solid var(--blue)"><b>' + esc(j.data.kode) + '</b> ' + stBadge(j.data.status) + '<p class="muted" style="margin-top:6px">' + pilChip(j.data.pilar) + ' · diterima ' + tgl(j.data.tgl) + '</p>' + (j.data.ringkasan ? '<p style="margin-top:8px">' + esc(j.data.ringkasan) + '</p>' : '<p class="muted" style="margin-top:8px">Aspirasi Anda sedang diproses pengurus.</p>') + (j.data.alasan ? '<p style="margin-top:6px"><b>Alasan:</b> ' + esc(j.data.alasan) + '</p>' : '') + '</div>' : '<div class="note" style="margin-bottom:18px">' + esc(j.message) + '</div>'; }); }
    $('#fl').onsubmit = function (e) { e.preventDefault(); var k = $('#kd').value.trim(); if (k) cari(k); };
    var k0 = SB.store.get('lacak', ''); if (k0) { SB.store.del('lacak'); cari(k0); }
  };
  P.transparansi.title = 'Transparansi';

  SB.on.data = function () { var n = SB.cur().name; if (['beranda', 'tentang', 'program', 'dokumentasi', 'survei', 'transparansi'].indexOf(n) > -1 && !(document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))) SB.route(true); };
})();
