/* ═══ LOADER ═══ */
(function(){
  const bar = document.getElementById('loader-bar');
  const pct = document.getElementById('loader-pct');
  const loader = document.getElementById('loader');
  let p = 0;
  const steps = [
    [30, 'LOADING NEURAL NETWORK...'],
    [55, 'CALIBRATING SPIDER-SENSE...'],
    [75, 'SYNCING DATA STREAMS...'],
    [90, 'INITIALIZING UI...'],
    [100, 'SYSTEM READY']
  ];
  let si = 0;
  function tick() {
    if (p >= 100) {
      bar.style.width = '100%';
      pct.textContent = 'SYSTEM READY — 100%';
      setTimeout(() => loader.classList.add('hidden'), 400);
      return;
    }
    p += Math.random() * 3 + 1;
    if (p > 100) p = 100;
    bar.style.width = p + '%';
    if (si < steps.length && p >= steps[si][0]) {
      pct.textContent = steps[si][1] + ' — ' + Math.floor(p) + '%';
      si++;
    }
    setTimeout(tick, 40 + Math.random() * 60);
  }
  tick();
})();

/* ═══ CURSOR ═══ */
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
const trail = document.getElementById('cursor-trail');
let mx = -100, my = -100, rx = -100, ry = -100, tx = -100, ty = -100;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
document.addEventListener('mouseleave', () => { mx = -200; my = -200; });
(function tick() {
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
  rx += (mx - rx) * .12; ry += (my - ry) * .12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  tx += (mx - tx) * .06; ty += (my - ty) * .06;
  trail.style.left = tx + 'px'; trail.style.top = ty + 'px';
  requestAnimationFrame(tick);
})();
document.querySelectorAll('a,button,.badge,.chip,.cert,.cb,.wsb,.wsb2,.cv-btn,.sc,.pc,.about-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.style.transform = 'translate(-50%,-50%) scale(2.5)';
    cur.style.background = 'var(--crimson)';
    ring.style.width = '52px'; ring.style.height = '52px';
    ring.style.borderColor = 'rgba(255,30,86,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cur.style.transform = 'translate(-50%,-50%) scale(1)';
    cur.style.background = 'var(--neon-blue)';
    ring.style.width = '36px'; ring.style.height = '36px';
    ring.style.borderColor = 'rgba(0,229,255,0.7)';
  });
});

/* ═══ TYPED ROLE ═══ */
const roles = ['DATA SCIENTIST', 'BI ENGINEER', 'ML ENGINEER', 'TEAM LEADER'];
let ri = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed-role');
function typeLoop() {
  const role = roles[ri];
  if (!deleting) {
    typedEl.textContent = role.slice(0, ++ci);
    if (ci === role.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
    setTimeout(typeLoop, 80);
  } else {
    typedEl.textContent = role.slice(0, --ci);
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; setTimeout(typeLoop, 300); return; }
    setTimeout(typeLoop, 45);
  }
}
setTimeout(typeLoop, 2000);

/* ═══ NEURAL CANVAS ═══ */
const cv = document.getElementById('neural-canvas'), cx = cv.getContext('2d');
let W, H, nodes = [], mouse = { x: -2000, y: -2000 };
function resize() { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; }
window.addEventListener('resize', () => { resize(); init(); }); resize();
class Node {
  constructor() { this.reset(true); }
  reset(ini) {
    this.x = Math.random() * W; this.y = ini ? Math.random() * H : -20;
    this.vx = (Math.random() - .5) * .3; this.vy = (Math.random() - .5) * .3;
    this.r = Math.random() * 2.4 + .8;
    this.op = Math.random() * .55 + .22;
    this.phase = Math.random() * Math.PI * 2;
    this.col = Math.random() > .5 ? '0,229,255' : '255,30,86';
  }
  draw() {
    this.phase += .018;
    cx.beginPath(); cx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    const o = Math.max(0, this.op + Math.sin(this.phase) * .14);
    cx.fillStyle = `rgba(${this.col},${o})`;
    cx.shadowColor = `rgba(${this.col},.8)`; cx.shadowBlur = 6; cx.fill(); cx.shadowBlur = 0;
    this.x += this.vx; this.y += this.vy;
    if (this.x < -20 || this.x > W + 20 || this.y < -20 || this.y > H + 20) this.reset(false);
  }
}
function init() { nodes = []; const n = Math.floor(W * H / 11000); for (let i = 0; i < n; i++) nodes.push(new Node()); }
init();
document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
document.addEventListener('mouseleave', () => { mouse.x = -2000; mouse.y = -2000; });
function drawLines() {
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
      if (d < 160) {
        cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y);
        cx.strokeStyle = `rgba(0,229,255,${(1 - d / 160) * .14})`; cx.lineWidth = .5; cx.stroke();
      }
    }
    const cdx = a.x - mouse.x, cdy = a.y - mouse.y, cd = Math.sqrt(cdx * cdx + cdy * cdy);
    if (cd < 220) {
      const al = (1 - cd / 220) * .7;
      const g = cx.createLinearGradient(a.x, a.y, mouse.x, mouse.y);
      g.addColorStop(0, `rgba(0,229,255,${al})`); g.addColorStop(1, `rgba(255,30,86,${al * .6})`);
      cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(mouse.x, mouse.y);
      cx.strokeStyle = g; cx.lineWidth = 1; cx.stroke();
    }
  }
}
(function loop() { cx.clearRect(0, 0, W, H); drawLines(); nodes.forEach(n => n.draw()); requestAnimationFrame(loop); })();

/* ═══ SCROLL REVEAL ═══ */
const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('v'); }), { threshold: .1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* ═══ NAV SCROLL ═══ */
const mainNav = document.getElementById('main-nav');
const secs = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  mainNav.classList.toggle('scrolled', window.scrollY > 60);
  let cur = '';
  secs.forEach(s => { if (window.scrollY >= s.offsetTop - 220) cur = s.id; });
  links.forEach(a => {
    const isActive = a.href.includes(cur);
    a.classList.toggle('active', isActive);
  });
});

/* ═══ CERT DRAG ═══ */
const track = document.getElementById('certs-track');
let down = false, sx, sl;
track.addEventListener('mousedown', e => { down = true; sx = e.pageX - track.offsetLeft; sl = track.scrollLeft; });
track.addEventListener('mouseleave', () => down = false);
track.addEventListener('mouseup', () => down = false);
track.addEventListener('mousemove', e => { if (!down) return; e.preventDefault(); track.scrollLeft = sl - (e.pageX - track.offsetLeft - sx) * 1.5; });

/* ═══ PARALLAX HERO BG ═══ */
const heroBgText = document.querySelector('.hero-bg-text');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (heroBgText) heroBgText.style.transform = `translate(-50%, calc(-50% + ${y * 0.3}px))`;
});
