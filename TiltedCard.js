(function(){
  function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }
  function initTiltedCard(figure, options){
    var containerHeight = (options && options.containerHeight) || null;
    var containerWidth = (options && options.containerWidth) || null;
    var rotateAmplitude = (options && options.rotateAmplitude) || 14;
    var scaleOnHover = (options && options.scaleOnHover) || 1.1;
    var showTooltip = (options && options.showTooltip) !== false;

    var inner = figure.querySelector('.tilted-card-inner');
    var card = inner && inner.querySelector('.service-card');
    var caption = figure.querySelector('.tilted-card-caption');

    if(containerHeight) figure.style.height = containerHeight;
    if(containerWidth) figure.style.width = containerWidth;

    function onMove(e){
      var rect = figure.getBoundingClientRect();
      var offsetX = e.clientX - rect.left - rect.width/2;
      var offsetY = e.clientY - rect.top - rect.height/2;
      var rotX = clamp((offsetY/(rect.height/2))*-rotateAmplitude, -rotateAmplitude, rotateAmplitude);
      var rotY = clamp((offsetX/(rect.width/2))* rotateAmplitude, -rotateAmplitude, rotateAmplitude);
      if(inner){ inner.style.transform = 'rotateX('+rotX+'deg) rotateY('+rotY+'deg) scale('+scaleOnHover+')'; }
      if(caption && showTooltip){
        caption.style.opacity = '1';
        caption.style.left = e.clientX - rect.left + 'px';
        caption.style.top = e.clientY - rect.top + 'px';
      }
    }
    function onEnter(){ if(inner){ inner.style.transition='transform 150ms ease'; } }
    function onLeave(){ if(inner){ inner.style.transform='rotateX(0) rotateY(0) scale(1)'; } if(caption){ caption.style.opacity='0'; } }

    figure.addEventListener('mousemove', onMove);
    figure.addEventListener('mouseenter', onEnter);
    figure.addEventListener('mouseleave', onLeave);
  }

  function autoInitTiltedCards(){
    document.querySelectorAll('.tilted-card-figure').forEach(function(fig){
      initTiltedCard(fig, { rotateAmplitude: 12, scaleOnHover: 1.06, showTooltip: true });
    });
  }

  window.initTiltedCard = initTiltedCard;
  window.autoInitTiltedCards = autoInitTiltedCards;
})();
