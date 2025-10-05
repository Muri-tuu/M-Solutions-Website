(function(){
  function loadScript(src){ return new Promise(function(res,rej){ var s=document.createElement('script'); s.src=src; s.onload=res; s.onerror=rej; document.head.appendChild(s); }); }
  function initHyperspeed(container, options){
    if(!window.THREE){ console.warn('THREE not loaded'); return; }
    if(container._hyper){ try{ container._hyper.dispose && container._hyper.dispose(); }catch(e){} }
    // Minimal placeholder: dark animated gradient to emulate hyperspeed feel without postprocessing bundle
    var canvas = document.createElement('canvas');
    canvas.style.width='100%'; canvas.style.height='100%'; canvas.style.display='block';
    var ctx = canvas.getContext('2d');
    container.innerHTML=''; container.appendChild(canvas);
    function resize(){ canvas.width = container.clientWidth; canvas.height = container.clientHeight; }
    window.addEventListener('resize', resize); resize();
    var t=0, rafId=null;
    function draw(){
      t += 0.008;
      var w=canvas.width, h=canvas.height;
      var g=ctx.createLinearGradient(0,0,w,h);
      var c1 = 'hsl(' + ((t*120)%360) + ',70%,20%)';
      var c2 = 'hsl(' + ((t*120+120)%360) + ',70%,10%)';
      g.addColorStop(0, c1);
      g.addColorStop(1, c2);
      ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
      // light streaks
      for(var i=0;i<40;i++){
        var x = (Math.sin(t*3 + i)*0.5+0.5)*w;
        var len = (Math.sin(t*4 + i)*0.5+0.5)*h*0.6 + h*0.2;
        var grd = ctx.createLinearGradient(x,0,x,h);
        grd.addColorStop(0,'rgba(255,255,255,0)');
        grd.addColorStop(0.5,'rgba(255,255,255,0.12)');
        grd.addColorStop(1,'rgba(255,255,255,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(x-1, 0, 2, len);
      }
      rafId = requestAnimationFrame(draw);
    }
    draw();
    container._hyper = { dispose: function(){ cancelAnimationFrame(rafId); window.removeEventListener('resize', resize); }};
  }
  window.initHyperspeed = initHyperspeed;
})();
