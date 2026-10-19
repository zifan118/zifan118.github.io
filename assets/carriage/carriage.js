/* Carriage view — shared behaviour: sky and meadow scenes, speech shapes, railway map, route strip, seat screen.
   Page data (the map's lines) is supplied as window.CARRIAGE before this script loads. */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- sky: telegraph poles and wires ---------- */
  const tile = `<svg viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true"><g transform="translate(-26 0)">
    <path d="M14 66C330 172 690 172 1014 66M40 66C330 208 690 208 1040 66M68 66C330 190 690 190 1068 66" fill="none" stroke="#889ea9" stroke-width="1.2" opacity=".55"/>
    <rect x="36" y="58" width="9" height="560" fill="#97aab3" opacity=".5"/><rect x="8" y="64" width="66" height="6" fill="#90a4ad" opacity=".6"/>
    <circle cx="14" cy="62" r="3" fill="#889ea9" opacity=".7"/><circle cx="40.5" cy="62" r="3" fill="#889ea9" opacity=".7"/><circle cx="68" cy="62" r="3" fill="#889ea9" opacity=".7"/></g></svg>`;
  const sky = $('#sky');
  const mk = (cls, n) => `<div class="layer ${cls}"><div class="shift"><div class="drift">${tile.repeat(n)}</div></div></div>`;
  $('#air').innerHTML = mk('far', 1) + mk('near', 1);
  const setSky = () => {};

  /* ---------- meadow: hills, dry-stone walls, a few sheep ---------- */
  (function meadow() {
    let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const sheep = (x, y, k, f) => `<g transform="translate(${x} ${y}) scale(${k * f} ${k})">
      <g fill="#322c26"><rect x="-17" y="10" width="3.2" height="13" rx="1"/><rect x="-8" y="11" width="3.2" height="12" rx="1"/><rect x="9" y="11" width="3.2" height="12" rx="1"/><rect x="18" y="10" width="3.2" height="13" rx="1"/></g>
      <g fill="#f4f0e4" stroke="#d6d0bd" stroke-width="1"><ellipse cx="-12" cy="2" rx="11" ry="10"/><ellipse cx="2" cy="-2" rx="14" ry="12"/><ellipse cx="16" cy="2" rx="11" ry="10"/><ellipse cx="2" cy="8" rx="15" ry="9"/></g>
      <ellipse cx="-27" cy="0" rx="7.5" ry="6.4" fill="#3a342d"/><path d="M-32 -5l-5 -3 1 6zM-23 -6l-1 -6 5 4z" fill="#3a342d"/></g>`;
    let tufts = '';
    for (let i = 0; i < 190; i++) {
      const y = 250 + rnd() * 400, t = (y - 200) / 450, x = rnd() * 940, h = 3 + t * 9;
      tufts += `<path d="M${x.toFixed(1)} ${y.toFixed(1)}l${(-h * .35).toFixed(1)} ${(-h).toFixed(1)}M${x.toFixed(1)} ${y.toFixed(1)}l${(h * .05).toFixed(1)} ${(-h * 1.1).toFixed(1)}M${x.toFixed(1)} ${y.toFixed(1)}l${(h * .4).toFixed(1)} ${(-h * .9).toFixed(1)}"/>`;
    }
    $('#meadow').innerHTML = `<svg viewBox="0 0 940 660" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><linearGradient id="g0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ac"/><stop offset="1" stop-color="#b9d094"/></linearGradient></defs>
      <rect width="940" height="660" fill="url(#g0)"/>
      <path d="M0 210Q150 168 330 196T640 180T940 200V660H0Z" fill="#b6cf8f"/>
      <path d="M0 320Q200 268 420 304T940 286V660H0Z" fill="#a9c783"/>
      <path d="M0 440Q240 386 500 424T940 400V660H0Z" fill="#9dbd78"/>
      <path d="M0 560Q260 520 520 548T940 530V660H0Z" fill="#92b46d"/>
      <g fill="none" stroke="#d4cfbe" stroke-width="2" stroke-dasharray="7 3 2 3" opacity=".75">
        <path d="M0 214Q150 172 330 200T640 184T940 204"/><path d="M0 324Q200 272 420 308T940 290"/><path d="M0 444Q240 390 500 428T940 404"/></g>
      <g fill="none" stroke="#6f9150" stroke-width="1.4" stroke-linecap="round" opacity=".42">${tufts}</g>
      ${sheep(866, 372, .5, 1)}${sheep(780, 252, .36, -1)}${sheep(250, 388, .62, -1)}${sheep(690, 584, 1.05, 1)}${sheep(150, 590, .8, -1)}
    </svg>`;
  })();

  /* ---------- speech shapes ---------- */
  const shapes = $$('.bubble');
  function shape(b) {
    let svg = $('svg.shape', b);
    if (!svg) { svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'shape'); svg.setAttribute('aria-hidden', 'true'); svg.appendChild(document.createElementNS(svg.namespaceURI, 'path')); b.prepend(svg); }
    const w = b.offsetWidth, h = b.offsetHeight, t1 = 16, t2 = 34, tl = 14, m = (t1 + t2) / 2;
    if (!w) return;
    svg.setAttribute('width', w); svg.setAttribute('height', h); svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const r = 13, W = w, H = h;
    const d = b.classList.contains('us')
      ? `M${r} 0H${W - r}Q${W} 0 ${W} ${r}V${t1}L${W + tl} ${m}L${W} ${t2}V${H - r}Q${W} ${H} ${W - r} ${H}H${r}Q0 ${H} 0 ${H - r}V${r}Q0 0 ${r} 0Z`
      : `M${r} 0H${W - r}Q${W} 0 ${W} ${r}V${H - r}Q${W} ${H} ${W - r} ${H}H${r}Q0 ${H} 0 ${H - r}V${t2}L${-tl} ${m}L0 ${t1}V${r}Q0 0 ${r} 0Z`;
    $('path', svg).setAttribute('d', d); b.classList.add('shaped');
  }
  if ('ResizeObserver' in window) { const ro = new ResizeObserver(es => es.forEach(e => shape(e.target))); shapes.forEach(b => ro.observe(b)); }
  else { shapes.forEach(shape); addEventListener('resize', () => shapes.forEach(shape)); }

  /* ---------- the railway map: double track, a little uneven ---------- */
  const { lines, base: BASE } = window.CARRIAGE || { lines: [], base: '' };
  const OX = 54, OY = 300;
  const smooth = pts => {
    const q = [pts[0], ...pts, pts[pts.length - 1]]; let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < q.length - 2; i++) {
      const [p0, p1, p2, p3] = [q[i - 1], q[i], q[i + 1], q[i + 2]];
      d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0]} ${p2[1]}`;
    }
    return d;
  };
  /* two narrow red lines side by side: a fat stroke with a slim gap cut out of its middle */
  const rail = (d, id) => `<mask id="m-${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="940" height="600"><rect width="940" height="600" fill="#fff"/><path d="${d}" fill="none" stroke="#000" stroke-width="3"/></mask><path class="rail" d="${d}" pathLength="1" mask="url(#m-${id})"/>`;
  const tsp = (arr, x, y, cls, dy) => `<text class="${cls}" x="${x}" y="${y}" text-anchor="middle">${arr.map((t, i) => `<tspan x="${x}" dy="${i ? dy : 0}">${t}</tspan>`).join('')}</text>`;
  let svg = `<svg viewBox="0 0 940 600" role="group" aria-label="Railway map of the prototype: the homepage, then three lines">`;
  svg += `<g class="org ln-stub">${rail(`M${OX} ${OY}L178 ${OY}`, 'o')}
    <circle class="stop end" cx="${OX}" cy="${OY}" r="13"/><circle cx="${OX}" cy="${OY}" r="4" fill="var(--canal)"/>
    <text class="t-org" x="24" y="226">Homepage</text>
    <text class="t-d" x="24" y="248"><tspan x="24">Culture is not a</tspan><tspan x="24" dy="18">category. It's a world.</tspan></text>
    <a href="${BASE}"><text class="t-link" x="24" y="346">Enter the website →</text></a></g>`;
  lines.forEach(L => {
    const at = x => L.pts.find(p => p[0] === x), s1 = at(462), s2 = at(650), e = at(845);
    svg += `<g class="ln" data-id="${L.id}">${rail(smooth(L.pts), L.id)}
      <text class="t-line" x="388" y="${s1[1] - 24}">${L.name}</text>`;
    [[s1, 0], [s2, 1]].forEach(([pt, i]) => {
      const st = L.stops[i];
      svg += `<g class="st"><circle class="stop" cx="${pt[0]}" cy="${pt[1]}" r="8"/><text class="t-h" x="${pt[0]}" y="${pt[1] + 38}" text-anchor="middle">${st[0]}</text>${tsp(st[1], pt[0], pt[1] + 58, 't-d', 18)}</g>`;
    });
    svg += `<a href="${BASE}${L.url}"><circle class="stop end" cx="${e[0]}" cy="${e[1]}" r="11"/><text class="t-link" x="${e[0] + 20}" y="${e[1] - 24}" text-anchor="end">${L.open}</text></a></g>`;
  });
  svg += `</svg>`;
  const map = $('#map'); map.innerHTML = svg;
  $('#maplist').innerHTML = `<div><h3>Homepage</h3><ol><li><b>Culture is not a category.</b>It's a world. <a href="${BASE}">Enter the website →</a></li></ol></div>` +
    lines.map(L => `<div><h3>${L.name}</h3><ol>${L.stops.map(s => `<li><b>${s[0]}</b>${s[1].join(' ')}</li>`).join('')}<li><a href="${BASE}${L.url}">${L.open}</a></li></ol></div>`).join('');

  /* ---------- the carriage strip ---------- */
  const stage = $('#stage'), calls = $$('.call'), tabs = $$('.stop-btn');
  const panes = { research: $('#pane-research'), web: $('#pane-web') }, seat = $('#pane-video'), film = $('#film');
  const hashOf = { research: 'research', web: 'webpages', video: 'video' }, idOf = { research: 'research', webpages: 'web', video: 'video' };
  let current = null;

  function show(id, push) {
    if (id === current) return; current = id;
    calls.forEach(c => { const on = c.dataset.id === id; c.classList.toggle('on', on);
      const t = $('.stop-btn', c); t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
    const video = id === 'video';
    stage.dataset.view = video ? 'seat' : 'window';
    if (!video) $('#glass').dataset.scene = id === 'web' ? 'meadow' : 'air';
    seat.setAttribute('aria-hidden', !video);
    if (!video) { film.pause(); Object.entries(panes).forEach(([k, p]) => { p.hidden = k !== id; p.classList.remove('play'); if (k === id) { p.scrollTop = 0; setSky(0); void p.offsetWidth; p.classList.add('play'); } });
      map.dataset.focus && (delete map.dataset.focus, $$('.sub-btn', $('[data-id="web"]')).forEach((b, i) => b.classList.toggle('on', i === 0))); }
    if (push) { try { history.replaceState(null, '', '#' + hashOf[id]); } catch (e) {} }
  }
  tabs.forEach((t, i) => {
    const id = t.closest('.call').dataset.id;
    t.addEventListener('click', () => show(id, true));
    t.addEventListener('keydown', e => {
      const d = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0; if (!d) return;
      e.preventDefault(); const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); show(n.closest('.call').dataset.id, true);
    });
  });

  /* research sub-stops follow the scroll; webpages sub-stops pick a line */
  const rp = panes.research, secs = $$('.sub-btn[data-to]');
  secs.forEach(b => b.addEventListener('click', () => { const t = document.getElementById(b.dataset.to); rp.scrollTo({ top: t.offsetTop - 30, behavior: 'smooth' }); }));
  const follow = () => { let k = 0; secs.forEach((b, i) => { if (document.getElementById(b.dataset.to).offsetTop - 140 <= rp.scrollTop) k = i; }); secs.forEach((b, i) => b.classList.toggle('on', i === k)); };
  panes.research.addEventListener('scroll', () => { setSky(rp.scrollTop); follow(); }, { passive: true });
  $$('.sub-btn[data-focus]').forEach(b => b.addEventListener('click', () => {
    const f = b.dataset.focus; if (f) map.dataset.focus = f; else delete map.dataset.focus;
    $$('.sub-btn[data-focus]').forEach(x => x.classList.toggle('on', x === b));
  }));

  const fromHash = () => show(idOf[location.hash.slice(1)] || 'research', false);
  fromHash(); addEventListener('hashchange', fromHash);
})();
