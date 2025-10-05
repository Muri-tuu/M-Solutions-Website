(function(){
  function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }
  function initProfileCard(el, opts){
    var enableTilt = (opts && opts.enableTilt) !== false;
    var scaleOnHover = (opts && opts.scaleOnHover) || 1.04;
    el.setAttribute('data-tilt', enableTilt ? 'true' : 'false');
    var inside = el.querySelector('.pc-inside');
    var card = el.querySelector('.pc-card');
    if(!enableTilt || !card){ return; }

    function onMove(e){
      var rect = el.getBoundingClientRect();
      var offsetX = e.clientX - rect.left - rect.width/2;
      var offsetY = e.clientY - rect.top - rect.height/2;
      var rotX = clamp((offsetY/(rect.height/2))*-10, -10, 10);
      var rotY = clamp((offsetX/(rect.width/2))* 10, -10, 10);
      card.style.transform = 'rotateX('+rotX+'deg) rotateY('+rotY+'deg) scale('+scaleOnHover+')';
    }
    function onLeave(){ card.style.transform = 'rotateX(0) rotateY(0) scale(1)'; }
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
  }

  function mountAllProfileCards(){
    document.querySelectorAll('.pc-card-wrapper').forEach(function(w){ initProfileCard(w, { enableTilt:true }); });
  }

  window.initProfileCard = initProfileCard;
  window.mountAllProfileCards = mountAllProfileCards;
})();
