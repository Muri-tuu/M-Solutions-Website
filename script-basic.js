/* ================================
   M SOLUTIONS - Clean JavaScript
   ================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // ================================
    // MOBILE MENU
    // ================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // ================================
    // SMOOTH SCROLL
    // ================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ================================
    // PRODUCT FILTER
    // ================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;

            // Filter products
            productCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ================================
    // CART FUNCTIONALITY
    // ================================
    const CART_KEY = 'msolutions_cart';
    const cartModal = document.getElementById('cart-modal');
    const cartToggle = document.getElementById('cart-toggle');
    const cartClose = document.getElementById('cart-close');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsEl = document.getElementById('cart-items');
    const cartCountEl = document.getElementById('cart-count');
    const cartTotalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Get cart from localStorage
    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch {
            return [];
        }
    }

    // Save cart to localStorage
    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    // Update cart badge
    function updateBadge() {
        const cart = getCart();
        const count = cart.reduce((sum, item) => sum + item.qty, 0);
        cartCountEl.textContent = count;
    }

    // Render cart items
    function renderCart() {
        const cart = getCart();
        
        if (cart.length === 0) {
            cartItemsEl.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
            cartTotalEl.textContent = 'KSh 0';
            return;
        }

        let total = 0;
        cartItemsEl.innerHTML = cart.map(item => {
            total += item.price * item.qty;
            return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>KSh ${item.price} × ${item.qty}</p>
                    </div>
                    <div class="cart-item-actions">
                        <button class="qty-btn" data-action="decrease" data-id="${item.id}">−</button>
                        <span class="cart-item-qty">${item.qty}</span>
                        <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
                        <button class="cart-item-remove" data-action="remove" data-id="${item.id}">×</button>
                    </div>
                </div>
            `;
        }).join('');

        cartTotalEl.textContent = `KSh ${total.toLocaleString()}`;
    }

    // Open cart
    function openCart() {
        cartModal.classList.add('active');
        renderCart();
    }

    // Close cart
    function closeCart() {
        cartModal.classList.remove('active');
    }

    // Add to cart
    function addToCart(id, name, price, image) {
        const cart = getCart();
        const existing = cart.find(item => item.id === id);

        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ id, name, price: parseFloat(price), image, qty: 1 });
        }

        saveCart(cart);
        updateBadge();
        showToast('Added to cart!', 'success');
        openCart();
    }

    // Update quantity
    function updateQty(id, action) {
        const cart = getCart();
        const item = cart.find(i => i.id === id);

        if (!item) return;

        if (action === 'increase') {
            item.qty += 1;
        } else if (action === 'decrease') {
            item.qty -= 1;
            if (item.qty <= 0) {
                const index = cart.indexOf(item);
                cart.splice(index, 1);
            }
        } else if (action === 'remove') {
            const index = cart.indexOf(item);
            cart.splice(index, 1);
        }

        saveCart(cart);
        updateBadge();
        renderCart();
    }

    // Checkout via WhatsApp
    function checkout() {
        const cart = getCart();
        if (cart.length === 0) {
            showToast('Your cart is empty', 'error');
            return;
        }

        const name = document.getElementById('checkout-name').value.trim();
        const phone = document.getElementById('checkout-phone').value.trim();
        const payment = document.getElementById('checkout-payment').value;

        // Validation
        if (!name) {
            document.getElementById('checkout-name').classList.add('error');
            showToast('Please enter your name', 'error');
            return;
        }
        if (!phone || phone.length < 10) {
            document.getElementById('checkout-phone').classList.add('error');
            showToast('Please enter a valid phone number', 'error');
            return;
        }

        // Remove error states
        document.getElementById('checkout-name').classList.remove('error');
        document.getElementById('checkout-phone').classList.remove('error');

        // Calculate total
        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

        // Format message
        const items = cart.map(item => `• ${item.name} x${item.qty} = KSh ${item.price * item.qty}`).join('\n');
        const message = `🛒 *New Order - M Solutions*\n\n` +
            `*Customer:* ${name}\n` +
            `*Phone:* ${phone}\n` +
            `*Payment:* ${payment}\n\n` +
            `*Items:*\n${items}\n\n` +
            `*Total: KSh ${total.toLocaleString()}*`;

        // Open WhatsApp
        const whatsappUrl = `https://wa.me/254115594826?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        // Clear cart
        saveCart([]);
        updateBadge();
        closeCart();
        showToast('Order sent to WhatsApp!', 'success');
    }

    // Toast notification
    function showToast(message, type = 'info') {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Event Listeners
    if (cartToggle) cartToggle.addEventListener('click', openCart);
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
    if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);

    // Add to cart buttons
    document.addEventListener('click', function(e) {
        const addBtn = e.target.closest('[data-add-to-cart]');
        if (addBtn) {
            e.preventDefault();
            const { id, name, price, image } = addBtn.dataset;
            addToCart(id, name, price, image);
        }

        // Cart item actions
        const actionBtn = e.target.closest('[data-action]');
        if (actionBtn && actionBtn.dataset.id) {
            updateQty(actionBtn.dataset.id, actionBtn.dataset.action);
        }
    });

    // Escape key to close cart
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeCart();
    });

    // Initialize badge
    updateBadge();
});
