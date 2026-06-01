/* TAR01 — horizontalni carousel engine (pokončni tablet)
 * Vanilla JS, brez odvisnosti, offline. Brez localStorage (in-session state only).
 */
(function(){
  "use strict";
  const D = window.TAR01 || { items: [] };
  const items = D.items || [];

  // ── HEADER ──
  const $ = (id) => document.getElementById(id);
  if (D.heading)    $("heading").textContent    = D.heading;
  if (D.subheading) $("subheading").textContent = D.subheading;
  if (D.station || D.heading)
    $("kicker").textContent = (D.station ? D.station + " · " : "") + (D.heading || "");

  const track   = $("track");
  const dotsEl  = $("dots");
  const curEl   = $("cur");
  const totalEl = $("total");
  const prog    = $("progress");
  const hint    = $("hint");

  let idx = 0;
  const N = items.length;
  totalEl.textContent = N;

  // placeholder ikona (ko video manjka)
  const PH = '<div class="ph"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" '
    + 'stroke-width="1.4"><rect x="3" y="5" width="18" height="14" rx="2"/>'
    + '<path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none"/></svg>POSNETEK</div>';

  // ── BUILD SLIDES ──
  items.forEach((it, i) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    const hasVideo = !!it.video;
    const media = hasVideo
      ? `<video data-i="${i}" muted playsinline preload="none"
            poster="${it.img ? "img/" + it.img : ""}"
            src="video/${it.video}"></video>`
      : PH;
    slide.innerHTML =
      `<div class="media">${media}</div>
       <div class="info">
         ${it.group ? `<div class="group">${it.group}</div>` : ""}
         <div class="title">${it.title || "—"}</div>
         ${it.year ? `<div class="year">${it.year}</div>` : ""}
         ${it.desc ? `<div class="desc">${it.desc}</div>` : ""}
       </div>`;
    track.appendChild(slide);

    const dot = document.createElement("div");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => goto(i));
    dotsEl.appendChild(dot);
  });
  const dots   = [...dotsEl.children];
  const videos = [...track.querySelectorAll("video")];

  // ── NAVIGATION ──
  function playActiveVideo(){
    videos.forEach(v => { try { v.pause(); v.currentTime = 0; } catch(e){} });
    const active = track.children[idx]?.querySelector("video");
    if (active){
      if (active.preload === "none") active.preload = "auto";
      active.loop = true;
      active.play().catch(()=>{}); // muted autoplay je dovoljen
    }
  }

  function render(animate){
    track.style.transition = animate ? "" : "none";
    track.style.transform = `translateX(${-idx * 100}%)`;
    if (!animate) requestAnimationFrame(()=>{ track.style.transition = ""; });
    dots.forEach((d,i)=> d.classList.toggle("active", i === idx));
    curEl.textContent = idx + 1;
    prog.style.width = (N > 1 ? (idx/(N-1))*100 : 100) + "%";
    playActiveVideo();
  }

  function goto(i){ idx = (i + N) % N; render(true); resetIdle(); }
  const next = () => goto(idx + 1);
  const prev = () => goto(idx - 1);

  $("next").addEventListener("click", next);
  $("prev").addEventListener("click", prev);

  // keyboard (test + nekateri kioski)
  window.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft")  prev();
  });

  // ── SWIPE / DRAG ──
  let startX = 0, dx = 0, dragging = false;
  const TH = () => track.offsetWidth * 0.18; // prag = 18% širine

  function down(x){ startX = x; dx = 0; dragging = true; track.classList.add("dragging"); resetIdle(); }
  function move(x){
    if (!dragging) return;
    dx = x - startX;
    track.style.transform = `translateX(calc(${-idx*100}% + ${dx}px))`;
  }
  function up(){
    if (!dragging) return;
    dragging = false; track.classList.remove("dragging");
    if (dx <= -TH() && idx < N-1)      goto(idx+1);
    else if (dx >= TH() && idx > 0)    goto(idx-1);
    else                               render(true);
  }

  const vp = $("viewport");
  vp.addEventListener("touchstart", e => down(e.touches[0].clientX), {passive:true});
  vp.addEventListener("touchmove",  e => move(e.touches[0].clientX), {passive:true});
  vp.addEventListener("touchend",   up);
  vp.addEventListener("mousedown",  e => down(e.clientX));
  window.addEventListener("mousemove", e => move(e.clientX));
  window.addEventListener("mouseup",   up);

  // ── IDLE: po 60s nazaj na prvi predmet + namig ──
  const IDLE = (D.idleSeconds || 60) * 1000;
  let idleTimer, hintTimer;
  function resetIdle(){
    clearTimeout(idleTimer); clearTimeout(hintTimer);
    hint.classList.remove("show");
    idleTimer = setTimeout(()=>{ if (idx !== 0) goto(0); }, IDLE);
    hintTimer = setTimeout(()=> hint.classList.add("show"), Math.min(IDLE*0.5, 18000));
  }
  ["touchstart","mousedown","keydown"].forEach(ev =>
    window.addEventListener(ev, resetIdle, {passive:true}));

  // ── INIT ──
  if (N === 0){
    track.innerHTML = '<div class="slide"><div class="info"><div class="title">Ni vsebine</div>'
      + '<div class="desc">content.js je prazen.</div></div></div>';
  } else {
    render(false);
    resetIdle();
  }
})();
