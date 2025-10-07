(function(){
  const CART_KEY = 'msolutions_cart_v1';
  const modal = document.createElement('div'); modal.id='cart-modal';
  const panel = document.createElement('div'); panel.id='cart'; panel.innerHTML = `
    <h3>Your Cart</h3>
    <div id="cart-items"></div>
    <div class="cart-actions">
      <button id="cart-close">Close</button>
      <button id="cart-checkout">Checkout</button>
    </div>
  `; modal.appendChild(panel); document.body.appendChild(modal);

  function readCart(){ try{return JSON.parse(localStorage.getItem(CART_KEY)||'[]');}catch{return [];} }
  function writeCart(items){ localStorage.setItem(CART_KEY, JSON.stringify(items)); }
  function addItem(item){ const cart=readCart(); const idx=cart.findIndex(i=>i.productId===item.productId); if(idx>-1){ cart[idx].quantity+=item.quantity; } else { cart.push(item); } writeCart(cart); syncBadge(); render(); openCart(); }
  function removeItem(productId){ const cart=readCart().filter(i=>i.productId!==productId); writeCart(cart); render(); }
  function updateQty(productId, qty){ const cart=readCart(); const it=cart.find(i=>i.productId===productId); if(it){ it.quantity=Math.max(1,qty); writeCart(cart); render(); } }

  function render(){ const items=readCart(); const root=document.getElementById('cart-items'); if(!root) return; root.innerHTML=''; let total=0; items.forEach(it=>{ total += it.price*it.quantity; const row=document.createElement('div'); row.className='cart-item'; row.innerHTML = `
      <div>
        <div><strong>${it.name}</strong></div>
        <div>KSh ${it.price} x <input type="number" min="1" value="${it.quantity}" data-id="${it.productId}" class="qty-input" style="width:60px"></div>
      </div>
      <div>
        <button class="remove-btn" data-id="${it.productId}">Remove</button>
      </div>
    `; root.appendChild(row); });
    const qtyInputs = root.querySelectorAll('.qty-input'); qtyInputs.forEach(inp=> inp.addEventListener('change', (e)=> updateQty(e.target.getAttribute('data-id'), parseInt(e.target.value,10)||1)));
    const rmButtons = root.querySelectorAll('.remove-btn'); rmButtons.forEach(btn=> btn.addEventListener('click', (e)=> removeItem(e.target.getAttribute('data-id'))));
    panel.dataset.total = total;
    const badge = document.getElementById('cart-count'); if(badge){ badge.textContent = String(items.reduce((s,i)=> s + i.quantity, 0)); }
  }

  function openCart(){ modal.style.display='flex'; render(); }
  function closeCart(){ modal.style.display='none'; }
  function syncBadge(){ const items=readCart(); const badge = document.getElementById('cart-count'); if(badge){ badge.textContent = String(items.reduce((s,i)=> s + i.quantity, 0)); } }

  document.addEventListener('click', (e)=>{
    const addBtn = e.target.closest('[data-add-to-cart]');
    if(addBtn){
      const el = addBtn;
      const productId = el.getAttribute('data-id');
      const name = el.getAttribute('data-name')||'Product';
      const price = parseFloat(el.getAttribute('data-price')||'0');
      addItem({ productId, name, price, quantity: 1 });
    }
    if(e.target.id==='cart-close'){ closeCart(); }
    if(e.target.id==='cart-checkout'){ checkout(); }
    const openBtn = e.target.closest('[data-open-cart]'); if(openBtn){ openCart(); }
  });

  async function checkout(){
    const items = readCart(); if(!items.length){ alert('Cart is empty'); return; }
    const name = prompt('Your name?'); if(!name) return;
    const phone = prompt('Phone (2547...)?'); if(!phone) return;
    const paymentMode = confirm('Pay now with M-Pesa? OK=Yes, Cancel=Cash on Delivery') ? 'M-PESA' : 'COD';
    const total = items.reduce((s,i)=> s + i.price*i.quantity, 0);
    const order = {
      customer: { name, phone },
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
