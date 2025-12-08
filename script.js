/*
================================================================================
M SOLUTIONS - Main JavaScript
================================================================================
Author:  Kennedy Muritu (https://muritukennedy.vercel.app)
Version: 2.0.0
Updated: December 2025

Description:
Core JavaScript functionality for M Solutions e-commerce website.
Handles UI interactions, cart management, and checkout flow.

Features:
1. Mobile Navigation - Hamburger menu toggle
2. Smooth Scrolling - Anchor link navigation
3. Active Nav Highlighting - Intersection Observer based
4. Header Scroll Effect - Sticky header behavior
5. Back to Top Button - Scroll-triggered visibility
6. Product Filtering - Category-based filtering
7. Shopping Cart - Add, remove, update quantities
8. WhatsApp Checkout - Order via WhatsApp integration
9. Toast Notifications - User feedback messages
10. Scroll Animations - Fade-in effects on scroll
11. Stats Counter - Animated number counting

Dependencies:
- None (Vanilla JavaScript ES6+)

Browser Support:
- Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
================================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================================================
       1. MOBILE MENU
       - Toggle hamburger menu on mobile devices
       - Auto-close when clicking navigation links
       ========================================================================= */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    mobileToggle?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });

    /* =========================================================================
       2. SMOOTH SCROLL
       - Smooth scrolling for anchor links
       - Prevents default jump behavior
       ========================================================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* =========================================================================
       3. ACTIVE NAV LINK ON SCROLL
       - Uses Intersection Observer API for performance
       - Highlights current section in navigation
       ========================================================================= */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));

    /* =========================================================================
       4. HEADER SCROLL EFFECT
       - Adds 'scrolled' class when page is scrolled
       - Used for header background/shadow changes
       ========================================================================= */
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });

    /* =========================================================================
       5. BACK TO TOP BUTTON
       - Shows button when scrolled past 500px
       - Smooth scroll to top on click
       ========================================================================= */
    const backToTop = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });
    
    backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* =========================================================================
       6. PRODUCT FILTER
       - Filter products by category
       - Uses data-filter and data-category attributes
       ========================================================================= */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            // Filter with animation
            productCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeIn 0.3s ease';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    /* =========================================================================
       7. CART FUNCTIONALITY
       - Full shopping cart with localStorage persistence
       - Add, remove, update quantities
       - WhatsApp checkout integration
       ========================================================================= */
    const CART_KEY = 'msolutions_cart_2025';
    
    // Elements
    const cartModal = document.getElementById('cart-modal');
    const cartToggle = document.getElementById('cart-toggle');
    const cartClose = document.getElementById('cart-close');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItems = document.getElementById('cart-items');
    const cartFooter = document.getElementById('cart-footer');
    const cartCount = document.getElementById('cart-count');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartDelivery = document.getElementById('cart-delivery');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartShopBtn = document.getElementById('cart-shop-btn');

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
        cartCount.textContent = count;
        
        // Animate badge
        if (count > 0) {
            cartCount.style.animation = 'none';
            cartCount.offsetHeight; // Trigger reflow
            cartCount.style.animation = 'pulse 0.3s ease';
        }
    }

    // Render cart
    function renderCart() {
        const cart = getCart();
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Your cart is empty</p>
                    <a href="#products" class="btn btn-primary btn-sm" id="cart-shop-btn">Start Shopping</a>
                </div>
            `;
            cartFooter.style.display = 'none';
            
            // Re-attach shop button listener
            document.getElementById('cart-shop-btn')?.addEventListener('click', closeCart);
            return;
        }

        let subtotal = 0;
        cartItems.innerHTML = cart.map(item => {
            subtotal += item.price * item.qty;
            return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>KSh ${item.price.toLocaleString()}</p>
                        <div class="cart-item-actions">
                            <button class="qty-btn" data-action="decrease" data-id="${item.id}">−</button>
                            <span class="cart-item-qty">${item.qty}</span>
                            <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
                            <button class="cart-item-remove" data-action="remove" data-id="${item.id}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Calculate delivery
        const delivery = subtotal >= 2000 ? 0 : 150;
        const total = subtotal + delivery;

        cartSubtotal.textContent = `KSh ${subtotal.toLocaleString()}`;
        cartDelivery.textContent = delivery === 0 ? 'Free' : `KSh ${delivery}`;
        cartTotal.textContent = `KSh ${total.toLocaleString()}`;
        
        cartFooter.style.display = 'block';
    }

    // Open cart
    function openCart() {
        cartModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderCart();
    }

    // Close cart
    function closeCart() {
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
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
        showToast(`${name} added to cart!`, 'success');
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
                showToast('Item removed from cart', 'info');
            }
        } else if (action === 'remove') {
            const index = cart.indexOf(item);
            cart.splice(index, 1);
            showToast('Item removed from cart', 'info');
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

        const nameInput = document.getElementById('checkout-name');
        const phoneInput = document.getElementById('checkout-phone');
        const paymentSelect = document.getElementById('checkout-payment');

        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const payment = paymentSelect.value;

        // Validation
        let hasError = false;
        
        if (!name) {
            nameInput.classList.add('error');
            hasError = true;
        } else {
            nameInput.classList.remove('error');
        }
        
        if (!phone || phone.length < 10) {
            phoneInput.classList.add('error');
            hasError = true;
        } else {
            phoneInput.classList.remove('error');
        }

        if (hasError) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        // Calculate totals
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const delivery = subtotal >= 2000 ? 0 : 150;
        const total = subtotal + delivery;

        // Format message
        const items = cart.map(item => 
            `• ${item.name} x${item.qty} = KSh ${(item.price * item.qty).toLocaleString()}`
        ).join('\n');
        
        const message = `🛒 *NEW ORDER - M Solutions*\n\n` +
            `👤 *Customer:* ${name}\n` +
            `📱 *Phone:* ${phone}\n` +
            `💳 *Payment:* ${payment}\n\n` +
            `📦 *Items:*\n${items}\n\n` +
            `📍 *Delivery:* ${delivery === 0 ? 'Free (Order over KSh 2,000)' : 'KSh 150'}\n` +
            `💰 *Total: KSh ${total.toLocaleString()}*\n\n` +
            `Thank you for shopping with M Solutions! 🙏`;

        // Open WhatsApp
        const whatsappUrl = `https://wa.me/254115594826?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        // Clear cart
        saveCart([]);
        updateBadge();
        closeCart();
        showToast('Order sent! Check WhatsApp to confirm.', 'success');

        // Clear form
        nameInput.value = '';
        phoneInput.value = '';
    }

    // Toast notification
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Event Listeners
    cartToggle?.addEventListener('click', openCart);
    cartClose?.addEventListener('click', closeCart);
    cartOverlay?.addEventListener('click', closeCart);
    checkoutBtn?.addEventListener('click', checkout);
    cartShopBtn?.addEventListener('click', closeCart);

    // Add to cart buttons
    document.addEventListener('click', (e) => {
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
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCart();
    });

    // Initialize
    updateBadge();

    /* =========================================================================
       8. SCROLL ANIMATIONS
       - Fade-in-up animation on scroll
       - Uses Intersection Observer for performance
       ========================================================================= */
    const animateElements = document.querySelectorAll('.service-card, .product-card, .review-card');
    
    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.5s ease forwards';
                animateObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        animateObserver.observe(el);
    });

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }
    `;
    document.head.appendChild(style);

    /* =========================================================================
       9. STATS COUNTER ANIMATION
       - Animated counting effect for statistics
       - Triggers when stats section is visible
       ========================================================================= */
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const num = parseInt(text.replace(/\D/g, ''));
                
                if (!isNaN(num) && num > 0) {
                    animateNumber(target, num, text.includes('+') ? '+' : '', text.includes('★') ? '★' : '');
                }
                
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => statsObserver.observe(stat));
    
    function animateNumber(element, target, suffix = '', prefix = '') {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + suffix + prefix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix + prefix;
            }
        }, 30);
    }

    console.log('M Solutions 2025 - Ready! 🚀');
});
