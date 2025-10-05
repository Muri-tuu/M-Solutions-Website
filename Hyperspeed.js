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
      ctx.fillStyle = '#000'; ctx.fillRect(0,0,w,h);
      // hyperspeed light streaks, brighter and more crowded
      for(var i=0;i<90;i++){
        var x = (Math.sin(t*3 + i*0.77)*0.5+0.5)*w;
        var y = 0;
        var len = (Math.sin(t*5 + i*1.7)*0.5+0.5)*h*0.7 + h*0.2;
        var alphaMid = 0.2 + 0.2*Math.sin(t*2 + i);
        var grd = ctx.createLinearGradient(x,y,x,h);
        grd.addColorStop(0,'rgba(255,255,255,0)');
        grd.addColorStop(0.45,'rgba(255,255,255,'+alphaMid.toFixed(3)+')');
        grd.addColorStop(1,'rgba(255,255,255,0)');
        ctx.fillStyle = grd;
        var wline = 1 + (Math.sin(i*2.1)+1)*0.7;
        ctx.fillRect(x-wline/2, y, wline, len);
      }
      rafId = requestAnimationFrame(draw);
    }
    draw();
    container._hyper = { dispose: function(){ cancelAnimationFrame(rafId); window.removeEventListener('resize', resize); }};
  }
  window.initHyperspeed = initHyperspeed;
})();
