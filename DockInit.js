(function(){
  function initMainDock(){
    if(!window.initDock) return;
    const main = document.getElementById('main-dock'); if(!main) return;
    const items = [
      { icon: '<i class="fa-solid fa-house"></i>', label: 'Home', onClick: ()=> document.getElementById('home')?.scrollIntoView({ behavior:'smooth', block:'start' }) },
      { icon: '<i class="fa-solid fa-gear"></i>', label: 'Services', onClick: ()=> document.getElementById('services')?.scrollIntoView({ behavior:'smooth', block:'start' }) },
      { icon: '<i class="fa-solid fa-box"></i>', label: 'Products', onClick: ()=> document.getElementById('products')?.scrollIntoView({ behavior:'smooth', block:'start' }) },
      { icon: '<i class="fa-solid fa-envelope"></i>', label: 'Contact', onClick: ()=> document.getElementById('contact')?.scrollIntoView({ behavior:'smooth', block:'start' }) }
    ];
    window.initDock(main, items, { panelHeight: 68, baseItemSize: 50, magnification: 70, distance: 200 });
  }
  function initUtilityDock(){
    if(!window.initDock) return;
    const util = document.getElementById('utility-dock'); if(!util) return;
    const items = [
      { icon: '<i class="fa-regular fa-heart"></i>', label: 'Wishlist', onClick: ()=> document.querySelector('.wishlist-toggle')?.click() },
      { icon: '<i class="fa-solid fa-cart-shopping"></i>', label: 'Cart', onClick: ()=> document.querySelector('.cart-toggle')?.click() },
      { icon: '<i class="fa-solid fa-moon"></i>', label: 'Theme', onClick: ()=> document.querySelector('.theme-toggle')?.click() }
    ];
    window.initDock(util, items, { panelHeight: 60, baseItemSize: 44, magnification: 64, distance: 180 });
  }
  window.initMainDock = initMainDock;
  window.initUtilityDock = initUtilityDock;
})();
