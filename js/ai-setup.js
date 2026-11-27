/* =====================================================================
   ai-setup.js — Modul Setup API AI (skill: setup-ai-api)
   Komponen mandiri (tanpa pustaka): daftar penyedia AI berurutan prioritas, kunci API (disimpan
   di Script Properties lewat server), saklar aktif, uji koneksi, dan PILIH MODEL lewat dropdown:
   rekomendasi + daftar langsung dari API penyedia (cari, tanda 📷 gambar / gratis, ketik manual).
   Pakai: AiSetup.pasang(elemen, { api, toast, konfirmasi, panel, ikon, simpanKunci, saatBerubah })
   ===================================================================== */
(function (global) {
  'use strict';

  const GAYA = `
.ais{--ais-card:var(--card,#FFFDF6);--ais-sub:var(--subtle,#F7F5EE);--ais-ink:var(--ink,#1F1F1F);--ais-mut:var(--ink-2,#6B6B6B);--ais-line:var(--line,#EDEDED);
 --ais-acc:var(--yellow,#FFD84D);--ais-acc-soft:var(--yellow-soft,#FFF7D6);--ais-ok:var(--ok,#4CAF7A);--ais-ok-ink:var(--ok-ink,#276738);--ais-ok-soft:var(--ok-soft,#EBF7EE);
 --ais-bad-ink:var(--bad-ink,#C53030);--ais-bad-soft:var(--bad-soft,#FDE8E8);--ais-warn-ink:var(--warn-ink,#997000);--ais-warn-soft:var(--warn-soft,#FFF7D6);
 --ais-blue-ink:var(--blue-ink,#1A56DB);--ais-blue-soft:var(--blue-soft,#E8F0FE);--ais-r:var(--r-card,24px);--ais-sh:var(--sh1,0 8px 24px -4px rgba(31,31,31,.05));
 color:var(--ais-ink);font:inherit;display:grid;gap:14px}
.ais *{box-sizing:border-box;min-width:0}
.ais-info{display:flex;gap:12px;padding:14px 16px;border-radius:18px;background:var(--ais-blue-soft);color:var(--ais-blue-ink);font-size:13px;line-height:1.5}
.ais-info b{display:block;margin-bottom:2px}.ais-info p{margin:0}
.ais-card{background:var(--ais-card);border:1px solid var(--ais-line);border-radius:var(--ais-r);box-shadow:var(--ais-sh);padding:16px;display:grid;grid-template-columns:auto minmax(0,1fr) minmax(220px,280px);gap:14px;align-items:start}
.ais-card.mati{opacity:.72}
.ais-urut{display:grid;gap:6px}
.ais-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1px solid var(--ais-line);background:#fff;color:var(--ais-ink);font:inherit;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;text-decoration:none}
.ais-btn:hover{border-color:var(--ais-ink)}.ais-btn:disabled{opacity:.4;cursor:not-allowed}
.ais-btn.gelap{background:var(--ais-ink);border-color:var(--ais-ink);color:#fff}.ais-btn.bahaya{color:var(--ais-bad-ink);border-color:var(--ais-bad-soft);background:var(--ais-bad-soft)}
.ais-btn.ikon{width:38px;padding:0}.ais-btn.kecil{height:32px;padding:0 11px;font-size:12px}.ais-btn.ikon.kecil{width:32px}
.ais-baris{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.ais-nama{font-size:16px;font-weight:700;letter-spacing:-.01em}
.ais-chip{display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:999px;font-size:11.5px;font-weight:600;background:var(--ais-sub);color:var(--ais-mut);white-space:nowrap}
.ais-chip.gelap{background:var(--ais-ink);color:#fff}.ais-chip.ok{background:var(--ais-ok-soft);color:var(--ais-ok-ink)}.ais-chip.bad{background:var(--ais-bad-soft);color:var(--ais-bad-ink)}.ais-chip.warn{background:var(--ais-warn-soft);color:var(--ais-warn-ink)}
.ais-model{margin-top:10px;display:grid;gap:6px}
.ais-label{font-size:12px;font-weight:600;color:var(--ais-mut)}
.ais-pilih{display:flex;gap:8px;align-items:center}
.ais-select,.ais-input{width:100%;height:42px;border-radius:14px;border:1px solid var(--ais-line);background:#fff;color:var(--ais-ink);font:inherit;font-size:13.5px;padding:0 12px;outline:none}
.ais-select{appearance:none;padding-right:34px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B6B6B' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 13px center;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12.5px}
.ais-select:focus,.ais-input:focus{border-color:var(--ais-ink);box-shadow:0 0 0 3px var(--ais-acc-soft)}
.ais-input.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12.5px}
.ais-ket{font-size:12px;color:var(--ais-mut);line-height:1.45}.ais-ket.ok{color:var(--ais-ok-ink)}.ais-ket.bad{color:var(--ais-bad-ink)}
.ais-stat{display:flex;flex-wrap:wrap;gap:4px 14px;margin-top:10px;font-size:12px;color:var(--ais-mut)}.ais-stat b{color:var(--ais-ink)}
.ais-err{font-size:12px;color:var(--ais-bad-ink);margin-top:4px;overflow-wrap:anywhere}
.ais-sisi{display:grid;gap:8px}
.ais-tautan{font-size:12px;color:var(--ais-blue-ink);text-decoration:none;font-weight:600}.ais-tautan:hover{text-decoration:underline}
.ais-switch{position:relative;display:inline-block;width:46px;height:26px;flex-shrink:0}.ais-switch input{opacity:0;width:0;height:0}
.ais-switch span{position:absolute;inset:0;background:var(--track,#E8E6DF);border-radius:99px;transition:.2s;cursor:pointer}
.ais-switch span:before{content:'';position:absolute;width:20px;height:20px;left:3px;top:3px;background:#fff;border-radius:50%;transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,.2)}
.ais-switch input:checked+span{background:var(--ais-ok)}.ais-switch input:checked+span:before{transform:translateX(20px)}
.ais-grow{flex:1}.ais-kaki{display:flex;justify-content:flex-end}
.ais-form{display:grid;gap:12px}.ais-field{display:grid;gap:6px}
.ais-lapis{position:fixed;inset:0;background:rgba(31,31,31,.32);display:flex;align-items:center;justify-content:center;padding:16px;z-index:9999}
.ais-modal{background:var(--ais-card);border-radius:24px;box-shadow:0 20px 48px -8px rgba(31,31,31,.25);width:min(520px,100%);max-height:90vh;overflow:auto;padding:20px;display:grid;gap:14px}
.ais-modal h3{margin:0;font-size:18px}.ais-modal .ais-aksi{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap}
.ais-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:var(--ais-ink);color:#fff;padding:12px 18px;border-radius:14px;font-size:13px;z-index:10000;max-width:min(560px,92vw)}
@media (max-width:820px){.ais-card{grid-template-columns:auto minmax(0,1fr)}.ais-sisi{grid-column:1/-1}}
@media (max-width:480px){.ais-card{grid-template-columns:minmax(0,1fr)}.ais-urut{display:flex;order:-1}.ais-urut::after{content:'Prioritas';align-self:center;font-size:12px;color:var(--ais-mut)}}
`;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const IKON = { naik: '↑', turun: '↓', uji: '⚡', ubah: '✎', hapus: '🗑', tambah: '+', muat: '↻', tautan: '↗', info: 'ℹ' };
  const jam = iso => { try { return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } };

  function pasangCss() {
    if (document.getElementById('ais-css')) return;
    const s = document.createElement('style'); s.id = 'ais-css'; s.textContent = GAYA; document.head.appendChild(s);
  }
  /* ---------- dialog bawaan (dipakai bila aplikasi tidak memberi versinya sendiri) ---------- */
  function toastBawaan(m) {
    const t = document.createElement('div'); t.className = 'ais-toast'; t.textContent = m; document.body.appendChild(t);
    setTimeout(() => t.remove(), 3500);
  }
  function panelBawaan({ judul, isi, kaki }) {
    const lapis = document.createElement('div'); lapis.className = 'ais-lapis ais';
    lapis.innerHTML = `<div class="ais-modal" role="dialog" aria-modal="true"><div class="ais-baris"><h3 class="ais-grow">${esc(judul)}</h3><button class="ais-btn ikon kecil" data-x aria-label="Tutup">✕</button></div><div data-isi>${isi}</div><div class="ais-aksi">${kaki || ''}</div></div>`;
    document.body.appendChild(lapis);
    const tutup = () => lapis.remove();
    lapis.addEventListener('click', e => { if (e.target === lapis || e.target.closest('[data-x]')) tutup(); });
    return { el: lapis, tutup };
  }
  function konfirmasiBawaan(html, op) {
    return new Promise(res => {
      const p = panelBawaan({ judul: (op && op.judul) || 'Konfirmasi', isi: `<div style="font-size:14px;line-height:1.5">${html}</div>`,
        kaki: `<button class="ais-btn" data-t>Batal</button><button class="ais-btn ${op && op.bahaya ? 'bahaya' : 'gelap'}" data-y>${esc((op && op.ok) || 'Ya')}</button>` });
      p.el.querySelector('[data-t]').onclick = () => { p.tutup(); res(false); };
      p.el.querySelector('[data-y]').onclick = () => { p.tutup(); res(true); };
    });
  }

  function pasang(el, opsi) {
    pasangCss();
    const o = Object.assign({ toast: toastBawaan, konfirmasi: konfirmasiBawaan, panel: panelBawaan, ikon: n => IKON[n] || '', saatBerubah: () => { } }, opsi || {});
    if (!o.api) throw new Error('AiSetup: opsi.api wajib diisi.');
    if (!o.simpanKunci) o.simpanKunci = (id, nilai) => o.api('ai.kunci', { id, nilai });
    const hasil = (r, okPesan) => { o.toast(r && r.success ? (r.message || okPesan || 'Tersimpan.') : ((r && r.message) || 'Gagal.'), r && r.success ? 'ok' : 'bad'); return !!(r && r.success); };
    const sibuk = async (btn, fn) => { const h = btn.innerHTML; btn.disabled = true; btn.innerHTML = '…'; try { return await fn(); } finally { btn.disabled = false; btn.innerHTML = h; } };
    let list = [], kat = { preset: {}, urutan: [], kebutuhan: 'gambar' }; const MODEL = {}, CARI = {};
    el.classList.add('ais');

    async function muat() {
      el.innerHTML = '<div class="ais-ket">Memuat penyedia AI…</div>';
      const [a, b] = await Promise.all([o.api('ai.list', {}, { fresh: true }), o.api('ai.katalog', {})]);
      if (!a.success) { el.innerHTML = `<div class="ais-err">${esc(a.message)}</div>`; return; }
      list = a.data; if (b.success) kat = b.data;
      gambar();
      list.forEach(p => { if (!MODEL[p.id] && (p.punyaKunci || p.preset === 'openrouter')) muatModel(p, false); });
    }
    const p_ = id => list.find(x => x.id === id);
    const rek = p => ((kat.preset[p.preset] || {}).model || []);
    const tanda = x => (x.gambar === true ? (x.tebak ? ' · 📷?' : ' · 📷') : x.gambar === false ? ' · teks saja' : '') + (x.gratis ? ' · gratis' : '') + (x.usang ? ' · usang' : '');
    const label = x => x.id + (x.ket ? ' — ' + x.ket : x.nama ? ' — ' + x.nama : '') + tanda(x);
    const opt = (x, cur, nonaktif) => `<option value="${esc(x.id)}" ${x.id === cur ? 'selected' : ''} ${nonaktif && x.id !== cur ? 'disabled' : ''}>${esc(label(x))}</option>`;

    function opsiModel(p) {
      const m = MODEL[p.id] || {}, r = rek(p), ids = new Set(r.map(x => x.id)), butuhGambar = kat.kebutuhan === 'gambar';
      const q = (CARI[p.id] || '').toLowerCase(), cocok = x => !q || (x.id + ' ' + (x.nama || '')).toLowerCase().indexOf(q) > -1 || x.id === p.model;
      const semua = (m.langsung || []).filter(x => !ids.has(x.id)).filter(cocok);
      let h = '';
      if (!r.concat(m.langsung || []).some(x => x.id === p.model)) h += `<optgroup label="Dipakai sekarang"><option value="${esc(p.model)}" selected>${esc(p.model)}</option></optgroup>`;
      if (r.length) h += `<optgroup label="Rekomendasi">${r.map(x => opt(x, p.model, butuhGambar && x.gambar === false)).join('')}</optgroup>`;
      if (butuhGambar) {
        const g = semua.filter(x => x.gambar === true), t = semua.filter(x => x.gambar == null), n = semua.filter(x => x.gambar === false);
        if (g.length) h += `<optgroup label="Bisa membaca gambar · ${g.length} model">${g.map(x => opt(x, p.model)).join('')}</optgroup>`;
        if (t.length) h += `<optgroup label="Belum pasti bisa membaca gambar · ${t.length}">${t.map(x => opt(x, p.model)).join('')}</optgroup>`;
        if (n.length) h += `<optgroup label="Teks saja — tidak cocok untuk aplikasi ini · ${n.length}">${n.map(x => opt(x, p.model, true)).join('')}</optgroup>`;
      } else if (semua.length) h += `<optgroup label="Semua model dari ${esc(p.penyedia)} · ${semua.length}">${semua.map(x => opt(x, p.model)).join('')}</optgroup>`;
      return h + '<optgroup label="Lainnya"><option value="__lain__">✎ Ketik ID model lain…</option></optgroup>';
    }
    function ketModel(p) {
      const m = MODEL[p.id] || {};
      if (m.status) return `<span class="${m.status.k}">${esc(m.status.t)}</span>`;
      if (m.memuat) return 'Memuat daftar model dari ' + esc(p.penyedia) + '…';
      if (m.galat) return `<span class="bad">${esc(m.galat)}</span> · menampilkan rekomendasi.`;
      if (m.langsung) return `${m.langsung.length} model dari ${esc(p.penyedia)} · diperbarui ${esc(jam(m.diambil))}. Tekan ${o.ikon('muat')} untuk memuat ulang.`;
      return p.punyaKunci || p.preset === 'openrouter' ? 'Rekomendasi ditampilkan. Tekan ' + o.ikon('muat') + ' untuk memuat semua model penyedia.' : 'Simpan kunci API untuk memuat semua model penyedia. Rekomendasi tetap bisa dipilih.';
    }
    function kartu(p, i) {
      const m = MODEL[p.id] || {};
      return `<div class="ais-card ${p.aktif ? '' : 'mati'}" data-kartu="${esc(p.id)}">
        <div class="ais-urut"><button class="ais-btn ikon kecil" data-naik="${i}" ${i === 0 ? 'disabled' : ''} aria-label="Naikkan prioritas">${o.ikon('naik')}</button><button class="ais-btn ikon kecil" data-turun="${i}" ${i === list.length - 1 ? 'disabled' : ''} aria-label="Turunkan prioritas">${o.ikon('turun')}</button></div>
        <div>
          <div class="ais-baris"><span class="ais-chip gelap">#${i + 1}</span><span class="ais-nama">${esc(p.penyedia)}</span>${p.dingin ? '<span class="ais-chip warn">jeda kuota</span>' : ''}${p.punyaKunci ? '<span class="ais-chip ok">kunci tersimpan</span>' : '<span class="ais-chip bad">kunci belum diisi</span>'}${p.aktif ? '' : '<span class="ais-chip">nonaktif</span>'}</div>
          <div class="ais-model"><label class="ais-label" for="aisM-${esc(p.id)}">Model AI · ${esc(p.jenis === 'gemini' ? 'Gemini API' : 'OpenAI-compatible')}</label>
            ${(m.langsung || []).length > 25 ? `<input class="ais-input" data-cari="${esc(p.id)}" placeholder="Cari model (mis. vision, free, flash)…" value="${esc(CARI[p.id] || '')}" style="height:36px">` : ''}
            <div class="ais-pilih"><select class="ais-select" id="aisM-${esc(p.id)}" data-model="${esc(p.id)}">${opsiModel(p)}</select><button class="ais-btn ikon" data-muat="${esc(p.id)}" title="Muat ulang daftar model dari penyedia" aria-label="Muat ulang daftar model">${o.ikon('muat')}</button></div>
            <div class="ais-baris" data-lain="${esc(p.id)}" hidden><input class="ais-input mono ais-grow" placeholder="ID model persis, mis. ${esc((rek(p)[0] || { id: 'nama-model' }).id)}" style="height:38px"><button class="ais-btn kecil gelap" data-pakai="${esc(p.id)}">Pakai</button></div>
            <div class="ais-ket" data-ket="${esc(p.id)}">${ketModel(p)}</div></div>
          <div class="ais-stat"><span>Hari ini: <b>${p.hariIni || 0}</b></span><span>Berhasil: ${p.berhasil || 0}</span><span>Gagal: ${p.gagal || 0}</span><span>Rata-rata: ${p.rataMs ? (p.rataMs / 1000).toFixed(1) + ' dtk' : '-'}</span></div>
          ${p.errTerakhir ? `<div class="ais-err">${esc(p.errTerakhir)}</div>` : ''}${p.batas ? `<div class="ais-ket" style="margin-top:4px">${esc(p.batas)}</div>` : ''}
        </div>
        <div class="ais-sisi">
          <div class="ais-baris" style="flex-wrap:nowrap"><input class="ais-input" type="password" data-kunci="${esc(p.id)}" placeholder="${p.punyaKunci ? esc(p.kunci) + ' (isi untuk ganti)' : 'Tempel kunci API'}" autocomplete="off" style="height:40px"><button class="ais-btn kecil gelap" data-simpankunci="${esc(p.id)}">Simpan</button></div>
          ${p.kunciUrl ? `<a class="ais-tautan" href="${esc(p.kunciUrl)}" target="_blank" rel="noopener">Dapatkan kunci API ${esc(p.penyedia)} ${o.ikon('tautan')}</a>` : ''}
          <div class="ais-baris"><span class="ais-ket ais-grow">Aktif</span><label class="ais-switch"><input type="checkbox" data-aktif="${esc(p.id)}" ${p.aktif ? 'checked' : ''}><span></span></label><button class="ais-btn kecil" data-uji="${esc(p.id)}">${o.ikon('uji')} Uji</button><button class="ais-btn ikon kecil" data-ubah="${esc(p.id)}" aria-label="Ubah penyedia">${o.ikon('ubah')}</button></div>
        </div></div>`;
    }
    function gambar() {
      el.innerHTML = `<div class="ais-info"><span>${o.ikon('info')}</span><div><b>Failover otomatis antarpenyedia</b><p>Sistem mencoba penyedia aktif sesuai urutan. Bila gagal, timeout, atau kuota habis (jeda 10 menit), pindah ke berikutnya. Pilih model tiap penyedia dari daftar; tanda 📷 = bisa membaca gambar${kat.kebutuhan === 'gambar' ? ' (wajib untuk aplikasi ini)' : ''}. Kunci API disimpan di Script Properties dan hanya tampil tersamar. Cek kebijakan data & batas paket gratis tiap penyedia sebelum dipakai sungguhan.</p></div></div>
        <div style="display:grid;gap:12px">${list.map(kartu).join('')}</div>
        <div class="ais-kaki"><button class="ais-btn" data-tambah>${o.ikon('tambah')} Tambah penyedia</button></div>`;
    }
    function gambarKartu(id) {
      const i = list.findIndex(x => x.id === id), lama = el.querySelector(`[data-kartu="${CSS.escape(id)}"]`);
      if (i < 0 || !lama) return; const fokusCari = document.activeElement && document.activeElement.matches('[data-cari]');
      const t = document.createElement('div'); t.innerHTML = kartu(list[i], i); lama.replaceWith(t.firstElementChild);
      if (fokusCari) { const c = el.querySelector(`[data-cari="${CSS.escape(id)}"]`); if (c) { c.focus(); c.setSelectionRange(c.value.length, c.value.length); } }
    }
    function setKet(id, t, k) { (MODEL[id] = MODEL[id] || {}).status = t ? { t, k: k || '' } : null; const e = el.querySelector(`[data-ket="${CSS.escape(id)}"]`); if (e) e.innerHTML = ketModel(p_(id)); }

    async function muatModel(p, segar) {
      MODEL[p.id] = Object.assign(MODEL[p.id] || {}, { memuat: true, status: null }); gambarKartu(p.id);
      const r = await o.api('ai.model', { id: p.id, muat: true, segar: !!segar });
      const m = MODEL[p.id]; m.memuat = false;
      if (r.success) { m.langsung = r.data.langsung || m.langsung || null; m.diambil = r.data.diambil || m.diambil; m.galat = r.data.galat || ''; }
      else m.galat = r.message;
      gambarKartu(p.id);
      if (segar && r.success && !m.galat) o.toast((m.langsung || []).length + ' model dimuat dari ' + p.penyedia + '.', 'ok');
    }
    async function gantiModel(p, model) {
      const lama = p.model; setKet(p.id, 'Menyimpan ' + model + '…');
      const r = await o.api('ai.simpan', { id: p.id, hanyaModel: true, model });
      if (!r.success) { setKet(p.id, ''); o.toast(r.message || 'Gagal menyimpan model.', 'bad'); gambarKartu(p.id); return; }
      p.model = model; gambarKartu(p.id); o.saatBerubah();
      if (!p.punyaKunci) { setKet(p.id, 'Model disimpan: ' + model + '. Isi kunci API lalu tekan Uji.', 'ok'); return; }
      setKet(p.id, 'Model disimpan. Menguji ' + model + '…');
      const u = await o.api('ai.uji', { id: p.id });
      setKet(p.id, u.success ? '✓ ' + u.message : '✗ ' + u.message + (lama !== model ? ' Model sebelumnya: ' + lama + '.' : ''), u.success ? 'ok' : 'bad');
    }
    const cariInfo = (p, id) => rek(p).concat((MODEL[p.id] || {}).langsung || []).find(x => x.id === id);

    el.onclick = async e => {
      const n = e.target.closest('[data-naik]'), t = e.target.closest('[data-turun]');
      if (n || t) {
        const i = +(n || t).dataset[n ? 'naik' : 'turun'], j = n ? i - 1 : i + 1; [list[i], list[j]] = [list[j], list[i]]; gambar();
        hasil(await o.api('ai.simpan', { urutanIds: list.map(x => x.id) })); o.saatBerubah(); return;
      }
      const sk = e.target.closest('[data-simpankunci]');
      if (sk) {
        const id = sk.dataset.simpankunci, inp = el.querySelector(`[data-kunci="${CSS.escape(id)}"]`), v = inp.value.trim();
        if (!v) { o.toast('Tempel kunci API dulu.', 'warn'); inp.focus(); return; }
        const r = await sibuk(sk, () => o.simpanKunci(id, v)); inp.value = '';
        if (hasil(r, 'Kunci API tersimpan.')) { const p = p_(id); p.punyaKunci = true; p.kunci = (r.data && (r.data.samar || r.data.tersamar)) || '••••'; gambarKartu(id); muatModel(p, true); o.saatBerubah(); }
        return;
      }
      const mu = e.target.closest('[data-muat]'); if (mu) { const p = p_(mu.dataset.muat); if (!p.punyaKunci && p.preset !== 'openrouter') { o.toast('Simpan kunci API ' + p.penyedia + ' dulu.', 'warn'); return; } muatModel(p, true); return; }
      const pk = e.target.closest('[data-pakai]');
      if (pk) { const id = pk.dataset.pakai, v = el.querySelector(`[data-lain="${CSS.escape(id)}"] input`).value.trim(); if (!v) return; gantiModel(p_(id), v); return; }
      const u = e.target.closest('[data-uji]');
      if (u) { const id = u.dataset.uji, r = await sibuk(u, () => o.api('ai.uji', { id })); setKet(id, (r.success ? '✓ ' : '✗ ') + r.message, r.success ? 'ok' : 'bad'); hasil(r); return; }
      const ub = e.target.closest('[data-ubah]'); if (ub) { formulir(p_(ub.dataset.ubah)); return; }
      if (e.target.closest('[data-tambah]')) formulir(null);
    };
    el.onchange = async e => {
      const s = e.target.closest('[data-model]');
      if (s) {
        const p = p_(s.dataset.model), v = s.value;
        if (v === '__lain__') { s.value = p.model; const row = el.querySelector(`[data-lain="${CSS.escape(p.id)}"]`); row.hidden = false; row.querySelector('input').focus(); return; }
        if (v === p.model) return;
        const info = cariInfo(p, v);
        if (kat.kebutuhan === 'gambar' && info && info.gambar == null && !(await o.konfirmasi(`Belum pasti <b>${esc(v)}</b> bisa membaca gambar. Aplikasi ini mengirim foto ke AI. Tetap pakai lalu uji?`, { ok: 'Pakai & uji' }))) { s.value = p.model; return; }
        gantiModel(p, v); return;
      }
      const a = e.target.closest('[data-aktif]');
      if (a) {
        const p = p_(a.dataset.aktif);
        const r = await o.api('ai.simpan', { id: p.id, penyedia: p.penyedia, model: p.model, endpoint: p.endpoint, jenis: p.jenis, batas: p.batas, aktif: a.checked });
        if (hasil(r)) { p.aktif = a.checked; gambarKartu(p.id); o.saatBerubah(); } else a.checked = !a.checked;
      }
    };
    el.oninput = e => {
      const c = e.target.closest('[data-cari]'); if (!c) return;
      CARI[c.dataset.cari] = c.value; clearTimeout(c._t);
      c._t = setTimeout(() => { const s = el.querySelector(`[data-model="${CSS.escape(c.dataset.cari)}"]`); if (s) s.innerHTML = opsiModel(p_(c.dataset.cari)); }, 150);
    };

    function formulir(p) {
      const baru = !p, pilihan = kat.urutan.map(k => [k, kat.preset[k].penyedia]).concat([['lain', 'Lainnya (OpenAI-compatible)']]);
      p = p || { preset: kat.urutan.find(k => !list.some(x => x.preset === k)) || 'lain', jenis: 'openai', aktif: true };
      const pre = kat.preset[p.preset] || null;
      const v = { penyedia: p.penyedia || (pre && pre.penyedia) || '', jenis: p.jenis || (pre && pre.jenis) || 'openai', endpoint: p.endpoint || (pre && pre.endpoint) || '', model: p.model || (pre && pre.model[0].id) || '', batas: p.batas || (pre && pre.batas) || '' };
      const pan = o.panel({ judul: baru ? 'Tambah penyedia AI' : 'Ubah ' + p.penyedia, isi: `<form class="ais-form ais" data-form>
        <div class="ais-field"><label class="ais-label">Penyedia</label><select class="ais-select" name="preset" style="font-family:inherit">${pilihan.map(x => `<option value="${x[0]}" ${x[0] === p.preset ? 'selected' : ''}>${esc(x[1])}</option>`).join('')}</select></div>
        <div class="ais-field"><label class="ais-label">Nama tampilan</label><input class="ais-input" name="penyedia" value="${esc(v.penyedia)}" placeholder="mis. Together AI"></div>
        <div class="ais-field"><label class="ais-label">Jenis API</label><select class="ais-select" name="jenis" style="font-family:inherit"><option value="openai" ${v.jenis === 'openai' ? 'selected' : ''}>OpenAI-compatible (/chat/completions)</option><option value="gemini" ${v.jenis === 'gemini' ? 'selected' : ''}>Google Gemini (generateContent)</option></select></div>
        <div class="ais-field"><label class="ais-label">Endpoint dasar</label><input class="ais-input mono" name="endpoint" value="${esc(v.endpoint)}" placeholder="https://api.contoh.com/v1"></div>
        <div class="ais-field"><label class="ais-label">Model${kat.kebutuhan === 'gambar' ? ' (harus bisa membaca gambar)' : ''}</label><select class="ais-select" name="modelPilih"></select><input class="ais-input mono" name="model" value="${esc(v.model)}" placeholder="ID model" hidden></div>
        <div class="ais-field"><label class="ais-label">Catatan batas harian</label><input class="ais-input" name="batas" value="${esc(v.batas)}"></div></form>`,
        kaki: `${baru ? '' : `<button class="ais-btn bahaya" type="button" data-hapus>${o.ikon('hapus')} Hapus</button><span class="ais-grow"></span>`}<button class="ais-btn gelap" type="button" data-simpan>Simpan</button>` });
      const f = pan.el.querySelector('[data-form]');
      const isiModel = (k, cur) => {
        const r = (kat.preset[k] || { model: [] }).model, s = f.modelPilih, ada = r.some(x => x.id === cur);
        s.innerHTML = (cur && !ada ? `<option value="${esc(cur)}" selected>${esc(cur)}</option>` : '') + r.map(x => opt(x, cur || r[0].id, kat.kebutuhan === 'gambar' && x.gambar === false)).join('') + '<option value="__lain__">✎ Ketik ID model lain…</option>';
        f.model.hidden = s.value !== '__lain__' && r.length > 0; if (!r.length) { s.hidden = true; f.model.hidden = false; } else s.hidden = false;
        if (s.value !== '__lain__') f.model.value = s.value;
      };
      isiModel(p.preset, v.model);
      f.preset.onchange = () => {
        const k = f.preset.value, q = kat.preset[k];
        if (q) { f.penyedia.value = q.penyedia; f.jenis.value = q.jenis; f.endpoint.value = q.endpoint; f.batas.value = q.batas; isiModel(k, q.model[0].id); }
        else { f.penyedia.value = ''; f.endpoint.value = ''; f.jenis.value = 'openai'; f.batas.value = ''; isiModel(k, ''); f.model.value = ''; }
      };
      f.modelPilih.onchange = () => { const x = f.modelPilih.value; f.model.hidden = x !== '__lain__'; if (x !== '__lain__') f.model.value = x; else { f.model.value = ''; f.model.focus(); } };
      pan.el.querySelector('[data-simpan]').onclick = async ev => {
        const d = { id: p.id || '', preset: f.preset.value, penyedia: f.penyedia.value.trim(), jenis: f.jenis.value, endpoint: f.endpoint.value.trim(), model: f.model.value.trim(), batas: f.batas.value.trim(), aktif: p.aktif !== false };
        const r = await sibuk(ev.currentTarget, () => o.api('ai.simpan', d));
        if (hasil(r)) { pan.tutup(); if (p.id) delete MODEL[p.id]; o.saatBerubah(); muat(); }
      };
      const h = pan.el.querySelector('[data-hapus]');
      if (h) h.onclick = async () => { if (await o.konfirmasi('Hapus penyedia <b>' + esc(p.penyedia) + '</b> beserta kunci API-nya?', { bahaya: true, ok: 'Hapus' }) && hasil(await o.api('ai.hapus', { id: p.id }))) { pan.tutup(); delete MODEL[p.id]; o.saatBerubah(); muat(); } };
    }
    muat();
    return { muatUlang: muat };
  }

  global.AiSetup = { pasang, versi: '1.0.0' };
})(window);
