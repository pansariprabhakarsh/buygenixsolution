/* BuyGenix Solutions shared.js v3.1 — file:// compatible */

/* CANVAS */
function initCanvas(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, t = 0, nodes = [];
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    nodes = [];
    const count = Math.floor((W * H) / 18000);
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random()*W, y: Math.random()*H,
        vx:(Math.random()-0.5)*0.25, vy:(Math.random()-0.5)*0.25,
        r: Math.random()*2+0.8, isPurple: Math.random()>0.6,
        opacity: Math.random()*0.3+0.08
      });
    }
  }
  resize(); window.addEventListener('resize', resize);
  function draw() {
    ctx.clearRect(0,0,W,H);
    const bg = ctx.createLinearGradient(0,0,W,H);
    bg.addColorStop(0,'rgba(227,238,255,0.5)');
    bg.addColorStop(0.5,'rgba(238,242,251,0.35)');
    bg.addColorStop(1,'rgba(243,232,255,0.45)');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    const orbs=[
      {cx:W*0.12,cy:H*0.18,r:Math.min(W,H)*0.2,c:'rgba(21,101,192,0.06)'},
      {cx:W*0.88,cy:H*0.3, r:Math.min(W,H)*0.17,c:'rgba(123,31,162,0.05)'},
      {cx:W*0.5+Math.sin(t*0.2)*40,cy:H*0.7,r:Math.min(W,H)*0.22,c:'rgba(66,165,245,0.05)'},
    ];
    orbs.forEach(o=>{
      const g=ctx.createRadialGradient(o.cx,o.cy,0,o.cx,o.cy,o.r);
      g.addColorStop(0,o.c); g.addColorStop(1,'transparent');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(o.cx+Math.sin(t*0.15)*15,o.cy+Math.cos(t*0.12)*12,o.r,0,Math.PI*2); ctx.fill();
    });
    nodes.forEach(n=>{
      n.x+=n.vx; n.y+=n.vy;
      if(n.x<0||n.x>W)n.vx*=-1; if(n.y<0||n.y>H)n.vy*=-1;
      ctx.globalAlpha=n.opacity*(0.7+Math.sin(t*0.8+n.x*0.01)*0.3);
      ctx.fillStyle=n.isPurple?'rgba(123,31,162,0.5)':'rgba(21,101,192,0.5)';
      ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2); ctx.fill();
      ctx.globalAlpha=1;
    });
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<110){ctx.globalAlpha=(1-d/110)*0.09; ctx.strokeStyle=nodes[i].isPurple?'rgba(123,31,162,1)':'rgba(21,101,192,1)'; ctx.lineWidth=0.6; ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y); ctx.stroke();}
      }
    }
    ctx.globalAlpha=1; t+=0.007; requestAnimationFrame(draw);
  }
  draw();
}

/* 3D TILT */
function initTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-0.5, y=(e.clientY-r.top)/r.height-0.5;
      card.style.transform=`perspective(700px) rotateY(${x*7}deg) rotateX(${-y*7}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave',()=>{ card.style.transform='perspective(700px) rotateY(0deg) rotateX(0deg) translateZ(0px)'; });
  });
}

/* SCROLL REVEAL */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach((e,i)=>{ if(e.isIntersecting){ setTimeout(()=>e.target.classList.add('visible'),i*80); obs.unobserve(e.target); } });
  },{threshold:0.1});
  els.forEach(el=>obs.observe(el));
}

/* COUNTER */
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if(!els.length) return;
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el=entry.target, target=parseFloat(el.dataset.count);
        const suffix=el.dataset.suffix||'', prefix=el.dataset.prefix||'';
        const dur=1600, start=performance.now();
        function tick(now){
          const p=Math.min((now-start)/dur,1), ease=1-Math.pow(1-p,3);
          el.textContent=prefix+(target%1!==0?(target*ease).toFixed(1):Math.floor(target*ease))+suffix;
          if(p<1)requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick); obs.unobserve(el);
      }
    });
  },{threshold:0.5});
  els.forEach(el=>obs.observe(el));
}

/* NAV */
function initNav() {
  const nav=document.querySelector('nav');
  if(!nav) return;
  window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>40));
  const curr=window.location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-links a').forEach(a=>{ if(a.getAttribute('href')===curr)a.classList.add('active'); });
  const burger=document.querySelector('.nav-burger'), mob=document.querySelector('.mobile-nav-overlay');
  if(burger&&mob){
    burger.addEventListener('click',()=>{
      mob.classList.toggle('open');
      const s=burger.querySelectorAll('span');
      mob.classList.contains('open')
        ?(s[0].style.transform='rotate(45deg) translate(5px,5px)',s[1].style.opacity='0',s[2].style.transform='rotate(-45deg) translate(5px,-5px)')
        :(s[0].style.transform='',s[1].style.opacity='',s[2].style.transform='');
    });
    document.querySelectorAll('.mobile-nav-overlay a').forEach(a=>{ if(a.getAttribute('href')===curr)a.style.color='#1565C0'; });
  }
}

/* LOGO SVG — exact brand colors */
const LOGO_SVG = `<svg viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" style="height:44px;width:auto">
  <defs>
    <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1565C0"/><stop offset="55%" stop-color="#1976D2"/><stop offset="100%" stop-color="#7B1FA2"/>
    </linearGradient>
    <linearGradient id="lg2" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1565C0"/><stop offset="100%" stop-color="#42A5F5"/>
    </linearGradient>
  </defs>
  <g transform="translate(95,60)">
    <path d="M 12 108 C -10 70,-10 30,20 8" fill="none" stroke="url(#lg2)" stroke-width="5" stroke-linecap="round"/>
    <path d="M 20 8 L 48 0 L 36 26" fill="#42A5F5"/>
    <text x="0" y="105" font-family="Arial Black,Arial,sans-serif" font-size="108" font-weight="900" fill="url(#lg1)">B</text>
  </g>
  <text x="168" y="155" font-family="Arial,Helvetica,sans-serif" font-size="96" font-weight="700" fill="url(#lg1)">uygenix</text>
  <text x="380" y="205" font-family="Arial,Helvetica,sans-serif" font-size="44" font-weight="400" fill="#424242" letter-spacing="1">Solutions</text>
</svg>`;

const LOGO_WHITE = `<svg viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" style="height:44px;width:auto">
  <defs>
    <linearGradient id="lw1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fff"/><stop offset="55%" stop-color="#90CAF9"/><stop offset="100%" stop-color="#CE93D8"/>
    </linearGradient>
    <linearGradient id="lw2" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#90CAF9"/><stop offset="100%" stop-color="#42A5F5"/>
    </linearGradient>
  </defs>
  <g transform="translate(95,60)">
    <path d="M 12 108 C -10 70,-10 30,20 8" fill="none" stroke="url(#lw2)" stroke-width="5" stroke-linecap="round"/>
    <path d="M 20 8 L 48 0 L 36 26" fill="#42A5F5"/>
    <text x="0" y="105" font-family="Arial Black,Arial,sans-serif" font-size="108" font-weight="900" fill="url(#lw1)">B</text>
  </g>
  <text x="168" y="155" font-family="Arial,Helvetica,sans-serif" font-size="96" font-weight="700" fill="url(#lw1)">uygenix</text>
  <text x="380" y="205" font-family="Arial,Helvetica,sans-serif" font-size="44" font-weight="400" fill="rgba(255,255,255,0.5)" letter-spacing="1">Solutions</text>
</svg>`;

function injectLogos(){
  document.querySelectorAll('.logo-svg-wrap').forEach(el=>{ el.innerHTML=LOGO_SVG; });
}
function injectFooterLogos(){
  document.querySelectorAll('.logo-svg-wrap-footer').forEach(el=>{ el.innerHTML=LOGO_WHITE; });
}

document.addEventListener('DOMContentLoaded',()=>{
  initCanvas('bg-canvas'); initNav(); initTilt();
  initScrollReveal(); initCounters(); injectLogos(); injectFooterLogos();
});
