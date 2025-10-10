(function(){
  const CART_KEY = 'msolutions_cart_v1';
  const modal = document.createElement('div'); modal.id='cart-modal';
  const panel = document.createElement('div'); panel.id='cart'; panel.innerHTML = `
    <div class="cart-layout">
      <div class="cart-list">
        <h3>Cart</h3>
        <div id="cart-items"></div>
      </div>
      <aside class="cart-summary">
        <h4>Checkout</h4>
        <form id="checkout-form" class="checkout-form">
          <input type="text" id="co-name" placeholder="Full name" required />
          <input type="tel" id="co-phone" placeholder="Phone (2547...)" required />
          <input type="text" id="co-address" placeholder="Address (optional)" />
          <select id="co-payment">
            <option value="M-PESA">M-Pesa (Pay now)</option>
            <option value="COD">Cash on Delivery</option>
          </select>
        </form>
        <div class="cart-actions">
          <button id="cart-close" class="btn-ghost">Close</button>
          <button id="cart-checkout" class="btn-gradient">Place Order</button>
        </div>
      </aside>
    </div>
  `; modal.appendChild(panel); document.body.appendChild(modal);

  function readCart(){ try{return JSON.parse(localStorage.getItem(CART_KEY)||'[]');}catch{return [];} }
  function writeCart(items){ localStorage.setItem(CART_KEY, JSON.stringify(items)); }
  function addItem(item){ const cart=readCart(); const idx=cart.findIndex(i=>i.productId===item.productId); if(idx>-1){ cart[idx].quantity+=item.quantity; } else { cart.push(item); } writeCart(cart); syncBadge(); render(); openCart(); }
  function removeItem(productId){ const cart=readCart().filter(i=>i.productId!==productId); writeCart(cart); syncBadge(); render(); }
  function updateQty(productId, qty){ const cart=readCart(); const it=cart.find(i=>i.productId===productId); if(it){ it.quantity=Math.max(1,qty); writeCart(cart); syncBadge(); render(); } }

  function render(){ const items=readCart(); const root=document.getElementById('cart-items'); if(!root) return; root.innerHTML=''; if(items.length===0){ root.innerHTML = `<div class="empty-state">Your cart is empty.</div>`; panel.dataset.total = 0; const summary = document.querySelector('.cart-summary'); if(summary){ summary.querySelector('.summary-box')?.remove?.(); const box = document.createElement('div'); box.className='summary-box'; box.innerHTML = `<div class="summary-row"><span>Items</span><span>0</span></div><div class="summary-row"><span>Subtotal</span><span>KSh 0</span></div><div class="summary-row summary-total"><span>Total</span><span>KSh 0</span></div>`; summary.insertBefore(box, summary.querySelector('.checkout-form')); } return; } let total=0; items.forEach(it=>{ total += it.price*it.quantity; const row=document.createElement('div'); row.className='cart-item-card'; const img = it.image ? `<img src="${it.image}" alt="${it.name}">` : `<div style="width:96px;height:96px;border-radius:12px;background:#1113;"></div>`; row.innerHTML = `
      ${img}
      <div class="cart-item-meta">
        <h4>${it.name}</h4>
        <p>KSh ${it.price} <span class="line-total">× ${it.quantity} = KSh ${it.price*it.quantity}</span></p>
      </div>
      <div class="cart-qty">
        <button class="qty-dec" data-id="${it.productId}">−</button>
        <input type="number" min="1" value="${it.quantity}" data-id="${it.productId}" class="qty-input">
        <button class="qty-inc" data-id="${it.productId}">+</button>
        <button class="remove-btn" data-id="${it.productId}">Remove</button>
      </div>
    `; root.appendChild(row); });
    const qtyInputs = root.querySelectorAll('.qty-input'); qtyInputs.forEach(inp=> inp.addEventListener('change', (e)=> updateQty(e.target.getAttribute('data-id'), parseInt(e.target.value,10)||1)));
    const incBtns = root.querySelectorAll('.qty-inc'); incBtns.forEach(btn=> btn.addEventListener('click', (e)=> { const id=e.target.getAttribute('data-id'); const cart=readCart(); const it=cart.find(i=>i.productId===id); if(it){ it.quantity+=1; writeCart(cart); syncBadge(); render(); }}));
    const decBtns = root.querySelectorAll('.qty-dec'); decBtns.forEach(btn=> btn.addEventListener('click', (e)=> { const id=e.target.getAttribute('data-id'); const cart=readCart(); const it=cart.find(i=>i.productId===id); if(it){ it.quantity=Math.max(1,it.quantity-1); writeCart(cart); syncBadge(); render(); }}));
    const rmButtons = root.querySelectorAll('.remove-btn'); rmButtons.forEach(btn=> btn.addEventListener('click', (e)=> removeItem(e.target.getAttribute('data-id'))));
    panel.dataset.total = total;
    const badge = document.getElementById('cart-count'); if(badge){ badge.textContent = String(items.reduce((s,i)=> s + i.quantity, 0)); }
    const summary = document.querySelector('.cart-summary'); if(summary){ summary.querySelector('.summary-box')?.remove?.(); const count = items.reduce((s,i)=> s + i.quantity, 0); const box = document.createElement('div'); box.className='summary-box'; box.innerHTML = `<div class="summary-row"><span>Items</span><span>${count}</span></div><div class="summary-row"><span>Subtotal</span><span>KSh ${total}</span></div><div class="summary-row summary-total"><span>Total</span><span>KSh ${total}</span></div>`; summary.insertBefore(box, summary.querySelector('.checkout-form')); }
  }

  function openCart(){ modal.classList.add('active'); modal.style.display='flex'; render(); }
  function closeCart(){ modal.classList.remove('active'); modal.style.display='none'; }
  function syncBadge(){ const items=readCart(); const badge = document.getElementById('cart-count'); if(badge){ badge.textContent = String(items.reduce((s,i)=> s + i.quantity, 0)); } }

  document.addEventListener('click', (e)=>{
    const addBtn = e.target.closest('[data-add-to-cart]');
    if(addBtn){
      const el = addBtn;
      const productId = el.getAttribute('data-id');
      const name = el.getAttribute('data-name')||'Product';
      const price = parseFloat(el.getAttribute('data-price')||'0');
      const image = el.getAttribute('data-image')||'';
      addItem({ productId, name, price, image, quantity: 1 });
    }
    const wishBtn = e.target.closest('[data-add-to-wishlist]');
    if(wishBtn){
      try{
        const WKEY='msolutions_wishlist_v1';
        const store = JSON.parse(localStorage.getItem(WKEY)||'[]');
        const pid = wishBtn.getAttribute('data-id');
        const name = wishBtn.getAttribute('data-name')||'Product';
        const image = wishBtn.getAttribute('data-image')||'';
        if(!store.find(i=>i.productId===pid)) store.push({productId:pid,name,image});
        localStorage.setItem(WKEY, JSON.stringify(store));
        const wbadge=document.getElementById('wishlist-count'); if(wbadge){ wbadge.textContent=String(store.length); }
      }catch{}
    }
    if(e.target.id==='cart-close'){ closeCart(); }
    if(e.target.id==='cart-checkout'){ checkout(); }
    // Disable any non-navbar open triggers
  });
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape'){ closeCart(); }});
  modal.addEventListener('click', (e)=>{ if(e.target===modal){ closeCart(); }});

  async function checkout(){
    const items = readCart(); if(!items.length){ alert('Cart is empty'); return; }
    const name = (document.getElementById('co-name')||{}).value || '';
    const phone = (document.getElementById('co-phone')||{}).value || '';
    const address = (document.getElementById('co-address')||{}).value || '';
    const paymentMode = (document.getElementById('co-payment')||{}).value || 'M-PESA';
    if(!name || !phone){ alert('Please fill name and phone'); return; }
    const total = items.reduce((s,i)=> s + i.price*i.quantity, 0);
    const order = {
      customer: { name, phone, address },
      items: items.map(i=> ({ productId: i.productId, name: i.name, quantity: i.quantity, price: i.price })),
      total, paymentMode
    };
    try {
      const res = await fetch('/api/orders/create', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(order) });
      const data = await res.json();
      if(res.ok){
        alert(paymentMode==='M-PESA' ? 'STK push initiated. Complete on your phone.' : 'Order placed. Pay on delivery.');
        writeCart([]); closeCart();
      } else {
        alert(data.message||'Checkout failed');
      }
    } catch(err){ alert('Network error'); }
  }

  // Expose for manual open
  window.MSolutionsCart = { open: openCart, add: addItem };
  syncBadge();
})();
