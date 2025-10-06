(function(){
  function initDock(container, items, opts){
    const options = Object.assign({ panelHeight:68, baseItemSize:50, magnification:70, distance:200 }, opts||{});
    container.classList.add('dock-outer');
    const panel = document.createElement('div'); panel.className='dock-panel'; panel.style.height=options.panelHeight+'px'; container.appendChild(panel);
    function createItem(item){
      const wrap = document.createElement('div'); wrap.className='dock-item'; wrap.style.width=options.baseItemSize+'px'; wrap.style.height=options.baseItemSize+'px';
      const icon = document.createElement('div'); icon.className='dock-icon'; icon.innerHTML = item.icon || '';
      const label = document.createElement('div'); label.className='dock-label'; label.textContent = item.label || '';
      label.style.opacity='0'; label.style.pointerEvents='none';
      wrap.appendChild(icon); wrap.appendChild(label);
      wrap.addEventListener('click', item.onClick);
      wrap.addEventListener('mouseenter', ()=>{ label.style.opacity='1'; });
      wrap.addEventListener('mouseleave', ()=>{ label.style.opacity='0'; });
      return wrap;
    }
    const els = items.map(createItem);
    els.forEach(e=>panel.appendChild(e));
    // simple magnification on mousemove
    panel.addEventListener('mousemove', (ev)=>{
      const rect = panel.getBoundingClientRect();
      els.forEach((el)=>{
        const r = el.getBoundingClientRect();
        const center = r.left + r.width/2; const dist = Math.abs(ev.clientX - center);
        const t = Math.max(0, 1 - dist/options.distance);
        const size = options.baseItemSize + t*(options.magnification - options.baseItemSize);
        el.style.width = size+'px'; el.style.height=size+'px';
      });
    });
    panel.addEventListener('mouseleave', ()=>{
      els.forEach((el)=>{ el.style.width=options.baseItemSize+'px'; el.style.height=options.baseItemSize+'px'; });
    });
  }
  window.initDock = initDock;
})();
