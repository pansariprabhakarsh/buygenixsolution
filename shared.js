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
    bg.addColorStop(0,'rgba(204,251,241,0.5)');
    bg.addColorStop(0.5,'rgba(230,250,248,0.35)');
    bg.addColorStop(1,'rgba(253,230,138,0.35)');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    const orbs=[
      {cx:W*0.12,cy:H*0.18,r:Math.min(W,H)*0.2,c:'rgba(10,95,85,0.07)'},
      {cx:W*0.88,cy:H*0.3, r:Math.min(W,H)*0.17,c:'rgba(245,158,11,0.06)'},
      {cx:W*0.5+Math.sin(t*0.2)*40,cy:H*0.7,r:Math.min(W,H)*0.22,c:'rgba(28,196,176,0.06)'},
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
      ctx.fillStyle=n.isPurple?'rgba(245,158,11,0.55)':'rgba(10,95,85,0.5)';
      ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2); ctx.fill();
      ctx.globalAlpha=1;
    });
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<110){ctx.globalAlpha=(1-d/110)*0.09; ctx.strokeStyle=nodes[i].isPurple?'rgba(245,158,11,1)':'rgba(10,95,85,1)'; ctx.lineWidth=0.6; ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y); ctx.stroke();}
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
      <stop offset="0%" stop-color="#0A5F55"/><stop offset="55%" stop-color="#0E7C6F"/><stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
    <linearGradient id="lg2" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0A5F55"/><stop offset="100%" stop-color="#1CC4B0"/>
    </linearGradient>
  </defs>
  <g transform="translate(95,60)">
    <path d="M 12 108 C -10 70,-10 30,20 8" fill="none" stroke="url(#lg2)" stroke-width="5" stroke-linecap="round"/>
    <path d="M 20 8 L 48 0 L 36 26" fill="#1CC4B0"/>
    <text x="0" y="105" font-family="Arial Black,Arial,sans-serif" font-size="108" font-weight="900" fill="url(#lg1)">B</text>
  </g>
  <text x="168" y="155" font-family="Arial,Helvetica,sans-serif" font-size="96" font-weight="700" fill="url(#lg1)">uygenix</text>
  <text x="380" y="205" font-family="Arial,Helvetica,sans-serif" font-size="44" font-weight="400" fill="#3D6B65" letter-spacing="1">Solutions</text>
</svg>`;

const LOGO_WHITE = `<svg viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" style="height:44px;width:auto">
  <defs>
    <linearGradient id="lw1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fff"/><stop offset="55%" stop-color="#99F6E4"/><stop offset="100%" stop-color="#FDE68A"/>
    </linearGradient>
    <linearGradient id="lw2" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#99F6E4"/><stop offset="100%" stop-color="#1CC4B0"/>
    </linearGradient>
  </defs>
  <g transform="translate(95,60)">
    <path d="M 12 108 C -10 70,-10 30,20 8" fill="none" stroke="url(#lw2)" stroke-width="5" stroke-linecap="round"/>
    <path d="M 20 8 L 48 0 L 36 26" fill="#1CC4B0"/>
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

/* EXTRA AMBIENT ANIMATIONS — injected at runtime */
(function injectAnimations() {
  const style = document.createElement('style');
  style.textContent = `
    /* Floating hero h1 shimmer */
    .page-hero h1 {
      animation: heroTextGlow 6s ease-in-out infinite;
    }
    @keyframes heroTextGlow {
      0%,100% { text-shadow: none; }
      50% { text-shadow: 0 0 40px rgba(28,196,176,0.12); }
    }

    /* Card hover glow ring */
    .card-glass, .plan-main, .contact-card-item, .faq-item {
      position: relative;
    }
    .card-glass::before, .plan-main::before {
      content: '';
      position: absolute; inset: -1px;
      border-radius: inherit;
      background: linear-gradient(135deg, rgba(28,196,176,0), rgba(245,158,11,0), rgba(28,196,176,0));
      transition: background 0.4s;
      pointer-events: none; z-index: 0;
    }

    /* Entrance stagger for plan cards */
    .plans-main-grid .plan-main:nth-child(1) { transition-delay: 0ms; }
    .plans-main-grid .plan-main:nth-child(2) { transition-delay: 80ms; }
    .plans-main-grid .plan-main:nth-child(3) { transition-delay: 160ms; }
    .plans-main-grid .plan-main:nth-child(4) { transition-delay: 240ms; }

    /* Subtle shine sweep on buttons */
    .btn-primary, .btn-gold, .nav-cta {
      overflow: hidden;
    }
    .btn-primary::after, .btn-gold::after {
      content: '';
      position: absolute; top: 0; left: -100%;
      width: 60%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
      transform: skewX(-20deg);
      animation: btnShine 4s ease-in-out infinite;
      pointer-events: none;
    }
    @keyframes btnShine {
      0%,70%,100% { left: -100%; }
      40% { left: 150%; }
    }

    /* Teal glow on WhatsApp float */
    .wa-float {
      position: fixed !important;
    }

    /* Form input animated border on focus */
    .form-group input, .form-group select, .form-group textarea {
      border-color: rgba(10,95,85,0.28) !important;
      background: #FAFFFE !important;
    }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
      border-color: #1CC4B0 !important;
      background: white !important;
      box-shadow: 0 0 0 3px rgba(28,196,176,0.18) !important;
    }

    /* Billing toggle style */
    .billing-toggle {
      background: linear-gradient(135deg, #CCFBF1, #FDE68A) !important;
      border: 1px solid rgba(10,95,85,0.2) !important;
    }
    .billing-badge {
      background: linear-gradient(135deg, #0A5F55, #1CC4B0) !important;
    }

    /* Referral card level colours */
    .ref-card.l1 .ref-level { color: #0A5F55 !important; }
    .ref-card.l2 .ref-level { color: #6B7280 !important; }
    .ref-card.l3 .ref-level { color: #D97706 !important; }

    /* Hours open colour fix */
    .hours-open { color: #0A5F55 !important; }

    /* Contact info card icon backgrounds */
    .ci-icon { background: linear-gradient(135deg, #CCFBF1, #E6FAF8) !important; }
    .ci-icon.gold { background: linear-gradient(135deg, #FDE68A, #FEF3C7) !important; }
    .ci-icon.green { background: linear-gradient(135deg, #D1FAE5, #A7F3D0) !important; }
    .ci-value { color: #0A5F55 !important; }
    .hours-card h4 { color: #0A5F55 !important; }
    .social-links h4 { color: #0A5F55 !important; }
    .soc-label { color: #0A5F55 !important; }

    /* Contact layout top-alignment fix */
    .contact-layout {
      align-items: start !important;
    }
    .form-card {
      padding: 36px 40px 40px !important;
    }
    .form-card h2 {
      margin-bottom: 6px !important;
      font-size: 25px !important;
      line-height: 1.2 !important;
    }
    .form-card > p {
      margin-bottom: 20px !important;
      font-size: 13.5px !important;
    }
    .form-group { margin-bottom: 14px !important; }

    /* Fix extra whitespace below form heading — remove any auto margin */
    .reveal-right { margin-top: 0 !important; }

    /* Membership plan equal-height buttons */
    .plan-action a {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }

    /* Value note styling */
    .value-note {
      background: linear-gradient(135deg, #CCFBF1, #FDE68A) !important;
      border-color: rgba(10,95,85,0.18) !important;
      color: #134E48 !important;
    }

    /* Popular column background in table */
    table.compare tbody td.popular-col {
      background: rgba(28,196,176,0.04) !important;
    }

    /* Fix CTA button outline on dark BG in membership */
    .cta-member .btn-outline {
      border-color: rgba(255,255,255,0.35) !important;
      color: white !important;
    }
    .cta-member .btn-outline:hover {
      background: rgba(255,255,255,0.1) !important;
    }

    /* Success / error boxes */
    .success-box {
      background: linear-gradient(135deg, #D1FAE5, #CCFBF1) !important;
      border-color: rgba(10,95,85,0.2) !important;
    }
    .success-box h4 { color: #0A5F55 !important; }
    .success-box p { color: #0E7C6F !important; }
  `;
  document.head.appendChild(style);
})();
