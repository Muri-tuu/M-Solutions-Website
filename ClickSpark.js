(function(){
  function initClickSpark(target, opts){
    const options = Object.assign({ sparkColor:'#fff', sparkSize:10, sparkRadius:15, sparkCount:8, duration:400, easing:'ease-out', extraScale:1.0 }, opts||{});
    const wrapper = document.createElement('div');
    wrapper.style.position='absolute'; wrapper.style.inset='0'; wrapper.style.pointerEvents='none';
    const canvas = document.createElement('canvas'); canvas.style.width='100%'; canvas.style.height='100%'; canvas.style.display='block'; wrapper.appendChild(canvas);
    target.style.position = target.style.position || 'relative';
    target.appendChild(wrapper);
    const ctx = canvas.getContext('2d'); let sparks=[]; let ani=0;
    function resize(){ const rect=target.getBoundingClientRect(); canvas.width=rect.width; canvas.height=rect.height; }
    const ro = new ResizeObserver(resize); ro.observe(target); resize();
    function ease(t){ switch(options.easing){ case 'linear': return t; case 'ease-in': return t*t; case 'ease-in-out': return t<0.5? 2*t*t : -1 + (4 - 2*t)*t; default: return t*(2-t);} }
    function draw(now){ ctx.clearRect(0,0,canvas.width,canvas.height); sparks = sparks.filter(s=> now - s.start < options.duration); for(const s of sparks){ const elapsed = now - s.start; const p = ease(elapsed/options.duration); const dist = p*options.sparkRadius*options.extraScale; const len = options.sparkSize*(1-p); const x1 = s.x + dist*Math.cos(s.angle); const y1 = s.y + dist*Math.sin(s.angle); const x2 = s.x + (dist+len)*Math.cos(s.angle); const y2 = s.y + (dist+len)*Math.sin(s.angle); ctx.strokeStyle = options.sparkColor; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); }
      ani = requestAnimationFrame(draw); }
    function spawn(x,y){ const now=performance.now(); for(let i=0;i<options.sparkCount;i++){ sparks.push({ x, y, angle: (2*Math.PI*i)/options.sparkCount, start: now }); } if(!ani) ani=requestAnimationFrame(draw); }
    target.addEventListener('click', (e)=>{ const rect=target.getBoundingClientRect(); spawn(e.clientX-rect.left, e.clientY-rect.top); }, { passive:true });
    target._clickspark = { dispose: function(){ cancelAnimationFrame(ani); ro.disconnect(); } };
  }
  window.initClickSpark = initClickSpark;
})();
