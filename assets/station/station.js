/* Station project pages — shared behaviour:
   day/night (shared with the homepage), the station band, the calling-at rail, split-flap text. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  /* ---------- day / night, remembered with the homepage's key ---------- */
  const modeBtn = document.getElementById('mode');
  function setMode(m) {
    root.dataset.mode = m;
    if (modeBtn) { modeBtn.textContent = m === 'night' ? 'Day' : 'Night'; modeBtn.setAttribute('aria-pressed', m === 'night'); }
    try { localStorage.setItem('station-mode', m); } catch (e) {}
  }
  let saved = null; try { saved = localStorage.getItem('station-mode'); } catch (e) {}
  setMode(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day'));
  modeBtn && modeBtn.addEventListener('click', () => setMode(root.dataset.mode === 'night' ? 'day' : 'night'));

  /* ---------- station band ---------- */
  const band = document.querySelector('.band');
  if (band) {
    const flowers = [[40,232,.8,1],[110,229,1,-1],[170,234,.7,1],[260,231,.95,1],[330,233,.75,-1],[1210,230,1.05,1],[1270,234,.7,-1],[1350,231,.9,1],[1430,233,.75,-1],[1500,230,1,1],[1560,234,.7,1]];
    band.insertAdjacentHTML('afterbegin', `
<svg viewBox="0 0 1600 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
  <defs>
    <linearGradient id="bsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--sky1)"/><stop offset=".6" style="stop-color:var(--sky2)"/><stop offset="1" style="stop-color:var(--sky3)"/></linearGradient>
    <g id="bwild">
      <path d="M-14 0 q-2 -14 -6 -24 M-4 0 q0 -16 2 -30 M6 0 q3 -12 8 -20 M14 0 q1 -10 -1 -16" fill="none" stroke="#5b7a3a" stroke-width="2.2" stroke-linecap="round"/>
      <g fill="#f4efe2"><circle cx="-23" cy="-26" r="3.2"/><circle cx="-17" cy="-26" r="3.2"/><circle cx="-20" cy="-30" r="3.2"/><circle cx="-20" cy="-22" r="3.2"/></g>
      <circle cx="-20" cy="-26" r="2" fill="#e2b93f"/><circle cx="-2" cy="-32" r="4" fill="#e2b93f"/>
      <circle cx="14" cy="-22" r="3.4" fill="#c97aa8"/><circle cx="13" cy="-17" r="2.6" fill="#9a6bb3"/>
    </g>
  </defs>
  <rect x="-200" y="-100" width="2000" height="500" fill="url(#bsky)"/>
  <g class="drift"><g id="bclouds">
    <path d="M-40 70 q120 -60 260 -16 q90 -44 210 0 q80 -16 140 16 z" style="fill:var(--cloud)"/>
    <path d="M520 120 q140 -46 300 -8 q100 -34 220 8 z" style="fill:var(--cloud2)"/>
    <path d="M980 56 q160 -64 330 -10 q110 -38 230 6 z" style="fill:var(--cloud)"/>
  </g><use href="#bclouds" x="1600"/></g>
  <path d="M-200 250 L-200 170 Q 80 120 300 160 Q 520 110 760 150 Q 980 96 1220 146 Q 1460 110 1800 166 L1800 250 Z" style="fill:var(--fell-far)"/>
  <path d="M-200 260 L-200 196 Q 120 162 380 196 Q 640 166 880 194 Q 1100 172 1300 196 Q 1560 172 1800 200 L1800 260 Z" style="fill:var(--fell-mid)"/>
  <g style="fill:var(--tree)"><ellipse cx="60" cy="236" rx="100" ry="40"/><ellipse cx="300" cy="232" rx="90" ry="44"/><ellipse cx="1260" cy="234" rx="110" ry="40"/><ellipse cx="1520" cy="230" rx="100" ry="46"/></g>
  <g style="fill:var(--tree2)"><ellipse cx="170" cy="246" rx="90" ry="26"/><ellipse cx="1400" cy="246" rx="100" ry="26"/></g>
  <g>${flowers.map(([x,y,s,f]) => `<use href="#bwild" transform="translate(${x} ${y}) scale(${f*s} ${s})"/>`).join('')}</g>
  <rect x="-200" y="232" width="2000" height="16" style="fill:var(--wall)"/>
  <rect x="-200" y="248" width="2000" height="14" style="fill:var(--plat-edge)"/>
  <rect x="-200" y="262" width="2000" height="8" style="fill:var(--plat)"/>
  <rect x="-200" y="270" width="2000" height="40" style="fill:var(--stone-d)"/>
  <path d="M-200 288 H1800" style="stroke:var(--stone)" stroke-width="2" opacity=".5"/>
</svg>`);
  }

  /* ---------- split-flap text: <span data-flap="TEXT"></span> ---------- */
  const CH = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+%.';
  const flaps = [...document.querySelectorAll('[data-flap]')];
  flaps.forEach(el => {
    const text = el.dataset.flap;
    el.classList.add('cells');
    el.setAttribute('aria-label', text);
    el.innerHTML = [...text].map(ch => `<span class="c" aria-hidden="true" data-t="${ch}">${reduce ? ch : ' '}</span>`).join('');
  });
  function run(el) {
    if (reduce || el.dataset.done) return;
    el.dataset.done = 1;
    el.querySelectorAll('.c').forEach((c, i) => {
      let n = 0; const steps = 4 + Math.floor(Math.random() * 9);
      setTimeout(() => {
        const iv = setInterval(() => {
          c.textContent = n >= steps ? c.dataset.t : CH[Math.floor(Math.random() * CH.length)];
          c.classList.remove('flip'); void c.offsetWidth; c.classList.add('flip');
          if (n++ >= steps) clearInterval(iv);
        }, 60);
      }, i * 40);
    });
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }), { threshold: .4 });
    flaps.forEach(f => io.observe(f));
  } else flaps.forEach(run);

  /* ---------- calling-at rail follows the reader ---------- */
  const rail = document.querySelector('.rail ol');
  if (rail) {
    const items = [...rail.querySelectorAll('li')];
    const tram = document.createElement('span'); tram.className = 'tram'; tram.setAttribute('aria-hidden', 'true'); rail.appendChild(tram);
    const secs = items.map(li => document.querySelector(li.querySelector('a').getAttribute('href')));
    let current = -1;
    const place = i => {
      if (i === current || i < 0) return; current = i;
      items.forEach((li, k) => { li.classList.toggle('on', k === i); li.querySelector('a').toggleAttribute('aria-current', k === i); });
      tram.style.transform = `translateY(${items[i].offsetTop}px)`;
    };
    const update = () => {
      const line = innerHeight * .35; let idx = 0;
      secs.forEach((s, k) => { if (s && s.getBoundingClientRect().top < line) idx = k; });
      place(idx);
    };
    addEventListener('scroll', update, { passive: true }); addEventListener('resize', () => { const c = current; current = -1; place(c); });
    update();
  }
})();
