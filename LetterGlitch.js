(function(){
  function initLetterGlitch(container, opts){
    const options = Object.assign({ glitchColors:['#2b4539','#61dca3','#61b3dc'], glitchSpeed:50, centerVignette:true, outerVignette:false, smooth:true, characters:'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789' }, opts||{});
    const canvas = document.createElement('canvas');
    canvas.style.position='absolute'; canvas.style.inset='0'; canvas.style.width='100%'; canvas.style.height='100%';
    container.innerHTML=''; container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const letters=[]; const grid={columns:0, rows:0};
    const fontSize=16, charWidth=10, charHeight=20;
    const chars = options.characters.split('');

    function hexToRgb(hex){ const s=/^#?([a-f\d])([a-f\d])([a-f\d])$/i; hex=hex.replace(s,(m,r,g,b)=>r+r+g+g+b+b); const res=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); return res?{r:parseInt(res[1],16),g:parseInt(res[2],16),b:parseInt(res[3],16)}:null; }
    function interp(c1,c2,t){ const r={r:Math.round(c1.r+(c2.r-c1.r)*t), g:Math.round(c1.g+(c2.g-c1.g)*t), b:Math.round(c1.b+(c2.b-c1.b)*t)}; return `rgb(${r.r}, ${r.g}, ${r.b})`; }
    function randChar(){ return chars[(Math.random()*chars.length)|0]; }
    function randColor(){ return options.glitchColors[(Math.random()*options.glitchColors.length)|0]; }

    function resize(){ const dpr=window.devicePixelRatio||1; const rect=container.getBoundingClientRect(); canvas.width=rect.width*dpr; canvas.height=rect.height*dpr; canvas.style.width=rect.width+'px'; canvas.style.height=rect.height+'px'; ctx.setTransform(dpr,0,0,dpr,0,0); grid.columns=Math.ceil(rect.width/charWidth); grid.rows=Math.ceil(rect.height/charHeight); const total=grid.columns*grid.rows; letters.length=0; for(let i=0;i<total;i++){ letters.push({ char: randChar(), color: randColor(), targetColor: randColor(), progress:1 }); } draw(); }

    function draw(){ const rect=container.getBoundingClientRect(); ctx.clearRect(0,0,rect.width,rect.height); ctx.font = fontSize+'px monospace'; ctx.textBaseline='top'; for(let i=0;i<letters.length;i++){ const x=(i%grid.columns)*charWidth; const y=((i/grid.columns)|0)*charHeight; ctx.fillStyle = letters[i].color; ctx.fillText(letters[i].char, x, y); } }

    let last = performance.now(); let raf=0;
    function tick(now){ if(now-last >= options.glitchSpeed){ // update random 5%
        const updates = Math.max(1, (letters.length*0.05)|0); for(let i=0;i<updates;i++){ const idx=(Math.random()*letters.length)|0; const L=letters[idx]; L.char = randChar(); L.targetColor = randColor(); if(!options.smooth){ L.color=L.targetColor; L.progress=1; } else { L.progress=0; } }
        draw(); last = now;
      }
      if(options.smooth){ let need=false; for(let i=0;i<letters.length;i++){ const L=letters[i]; if(L.progress<1){ L.progress+=0.05; if(L.progress>1) L.progress=1; const c1=hexToRgb(L.color)||hexToRgb('#000000'); const c2=hexToRgb(L.targetColor)||hexToRgb('#ffffff'); L.color = interp(c1,c2,L.progress); need=true; } } if(need) draw(); }
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener('resize', resize); resize(); raf=requestAnimationFrame(tick);
    container._glitch = { dispose: function(){ cancelAnimationFrame(raf); window.removeEventListener('resize', resize); }}
  }
  window.initLetterGlitch = initLetterGlitch;
})();
