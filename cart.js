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

  function isDisabled(){ return document.documentElement.getAttribute('data-cart-disabled') === 'true'; }
  function readCart(){ try{return JSON.parse(localStorage.getItem(CART_KEY)||'[]');}catch{return [];} }
  function writeCart(items){ localStorage.setItem(CART_KEY, JSON.stringify(items)); }
  function addItem(item){ if(isDisabled()) return; const cart=readCart(); const idx=cart.findIndex(i=>i.productId===item.productId); if(idx>-1){ cart[idx].quantity+=item.quantity; } else { cart.push(item); } writeCart(cart); syncBadge(); render(); openCart(); }
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

  function openCart(){ if(isDisabled()) return; modal.classList.add('active'); modal.style.display='flex'; render(); }
  function closeCart(){ modal.classList.remove('active'); modal.style.display='none'; }
  function syncBadge(){ const items=readCart(); const badge = document.getElementById('cart-count'); if(badge){ badge.textContent = String(items.reduce((s,i)=> s + i.quantity, 0)); } }

  document.addEventListener('click', (e)=>{
    const addBtn = e.target.closest('[data-add-to-cart]');
    if(addBtn){
      if(isDisabled()){ e.preventDefault(); return; }
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
    // Close button
    if(e.target.id==='cart-close' || e.target.closest('#cart-close')){ 
      e.preventDefault();
      closeCart(); 
    }
    // Checkout button
    if(e.target.id==='cart-checkout' || e.target.closest('#cart-checkout')){ 
      e.preventDefault();
      if(isDisabled()) return; 
      checkout(); 
    }
  });
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape'){ closeCart(); }});
  modal.addEventListener('click', (e)=>{ if(e.target===modal){ closeCart(); }});
  
  // Also attach direct event listeners to buttons after modal is created
  const closeBtn = panel.querySelector('#cart-close');
  const checkoutBtn = panel.querySelector('#cart-checkout');
  const checkoutForm = panel.querySelector('#checkout-form');
  
  if(closeBtn) closeBtn.addEventListener('click', (e) => { e.preventDefault(); closeCart(); });
  if(checkoutBtn) checkoutBtn.addEventListener('click', (e) => { 
    e.preventDefault(); 
    e.stopPropagation();
    console.log('Checkout button clicked');
    if(!isDisabled()) checkout(); 
  });
  // Prevent form submission
  if(checkoutForm) checkoutForm.addEventListener('submit', (e) => { e.preventDefault(); });

  async function checkout(){
    console.log('Checkout function called');
    if(isDisabled()) return;
    const items = readCart(); 
    if(!items.length){ 
      showToast('Your cart is empty', 'error'); 
      return; 
    }
    const name = (document.getElementById('co-name')||{}).value?.trim() || '';
    const phone = (document.getElementById('co-phone')||{}).value?.trim() || '';
    const address = (document.getElementById('co-address')||{}).value?.trim() || '';
    const paymentMode = (document.getElementById('co-payment')||{}).value || 'M-PESA';
    
    // Validation
    if(!name){ 
      document.getElementById('co-name')?.classList.add('invalid');
      showToast('Please enter your name', 'error'); 
      return; 
    }
    if(!phone || phone.length < 10){ 
      document.getElementById('co-phone')?.classList.add('invalid');
      showToast('Please enter a valid phone number', 'error'); 
      return; 
    }
    
    // Remove invalid states
    document.getElementById('co-name')?.classList.remove('invalid');
    document.getElementById('co-phone')?.classList.remove('invalid');
    
    const total = items.reduce((s,i)=> s + i.price*i.quantity, 0);
    
    // Format order details for WhatsApp
    const orderDetails = items.map(i => `• ${i.name} x${i.quantity} = KSh ${i.price * i.quantity}`).join('\n');
    const whatsappMessage = `🛒 *New Order from M Solutions Website*\n\n` +
      `*Customer:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      `*Address:* ${address || 'Not provided'}\n` +
      `*Payment:* ${paymentMode}\n\n` +
      `*Order Items:*\n${orderDetails}\n\n` +
      `*Total: KSh ${total.toLocaleString()}*`;
    
    const whatsappNumber = '254115594826';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Try API first, fallback to WhatsApp
    try {
      const res = await fetch('/api/orders/create', { 
        method:'POST', 
        headers:{'Content-Type':'application/json'}, 
        body: JSON.stringify({
          customer: { name, phone, address },
          items: items.map(i=> ({ productId: i.productId, name: i.name, quantity: i.quantity, price: i.price })),
          total, 
          paymentMode
        })
      });
      
      if(res.ok){
        const data = await res.json();
        showToast(paymentMode==='M-PESA' ? 'STK push sent! Check your phone.' : 'Order placed successfully!', 'success');
        writeCart([]); 
        syncBadge();
        render();
        setTimeout(closeCart, 1500);
      } else {
        throw new Error('API failed');
      }
    } catch(err){ 
      // Fallback to WhatsApp
      showToast('Redirecting to WhatsApp...', 'success');
      writeCart([]); 
      syncBadge();
      render();
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        closeCart();
      }, 500);
    }
  }
  
  // Toast notification helper
  function showToast(message, type = 'info') {
    const existing = document.querySelector('.cart-toast');
    if(existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = `cart-toast cart-toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Expose for manual open
  window.MSolutionsCart = { open: openCart, add: addItem };
  syncBadge();
})();
