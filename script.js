/* ================================
   M SOLUTIONS - MAIN JAVASCRIPT
   ================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    /* ================================
       THEME: PERSISTED DARK/LIGHT TOGGLE
       ================================ */
    const root = document.documentElement;
    const themeToggleButton = document.querySelector('.theme-toggle');
    // Force dark mode site-wide
    root.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    const setToggleIcon = () => {
        if (!themeToggleButton) return;
        const icon = themeToggleButton.querySelector('i');
        if (!icon) return;
        icon.classList.remove('fa-moon', 'fa-sun');
        if (root.getAttribute('data-theme') === 'dark') {
            icon.classList.add('fa-sun');
        } else {
            icon.classList.add('fa-moon');
        }
    };
    setToggleIcon();
    // No-op: theme toggle disabled
    
    /* ================================
       SERVICES SPOTLIGHT EFFECT
       ================================ */
    document.querySelectorAll('.card-spotlight').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', x + 'px');
            card.style.setProperty('--mouse-y', y + 'px');
        });
    });

    /* ================================
       MOBILE NAVIGATION TOGGLE
       ================================ */
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    /* ================================
       WHATSAPP PRODUCT ORDER BUTTONS
       Customize the WhatsApp number and message format here
       ================================ */
    const whatsappButtons = document.querySelectorAll('.btn-whatsapp');
    
    // WhatsApp Configuration - EDIT THESE VALUES
    const WHATSAPP_NUMBER = '254115594826'; // M Solutions WhatsApp Business Number
    const BUSINESS_NAME = 'M Solutions';
    
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product name from data attribute
            const productName = this.getAttribute('data-product') || 'a product';
            
            // Create custom message with product info and tracking tag
            const message = `Hi ${BUSINESS_NAME}! I'm interested in ordering: ${productName}. [Source: Website - Product Section]`;
            
            // Encode message for URL
            const encodedMessage = encodeURIComponent(message);
            
            // Create WhatsApp link
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
            
            // Open WhatsApp in new tab with security attributes
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        });
    });

    /* ================================
       CART & WISHLIST (LOCALSTORAGE)
       Minimal counters to support UI badges
       ================================ */
    const CART_KEY = 'msolutions_cart_v1';
    const WISHLIST_KEY = 'msolutions_wishlist_v1';
    const cartToggle = document.querySelector('.cart-toggle');
    const wishlistToggle = document.querySelector('.wishlist-toggle');
    const cartCountEl = document.getElementById('cart-count');
    const wishlistCountEl = document.getElementById('wishlist-count');
    const readStore = (key) => {
        try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
    };
    const writeStore = (key, value) => localStorage.setItem(key, JSON.stringify(value));
    const updateBadges = () => {
        const cartItems = readStore(CART_KEY);
        const wishlistItems = readStore(WISHLIST_KEY);
        const cartQty = Array.isArray(cartItems) ? cartItems.reduce((s,i)=> s + (Number(i.quantity)||0), 0) : 0;
        const wishQty = Array.isArray(wishlistItems) ? wishlistItems.length : 0;
        if (cartCountEl) cartCountEl.textContent = String(cartQty);
        if (wishlistCountEl) wishlistCountEl.textContent = String(wishQty);
    };
    updateBadges();
    if (cartToggle) cartToggle.addEventListener('click', () => {
        if (window.MSolutionsCart && typeof window.MSolutionsCart.open === 'function') {
            window.MSolutionsCart.open();
        }
    });
    if (wishlistToggle) wishlistToggle.addEventListener('click', () => {
        const items = readStore(WISHLIST_KEY);
        writeStore(WISHLIST_KEY, items);
        updateBadges();
    });
    
    /* ================================
       SMOOTH SCROLL FOR ANCHOR LINKS
       ================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (href === '#' || href === '') {
                return;
            }
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerOffset = 80; // Account for fixed header
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ================================
       SERVICES GRID DISTORTION BACKGROUND (THREE.js)
       ================================ */
    const productsBg = document.querySelector('.products .products-bg');
    const runWhenIdle = (fn) => {
        if ('requestIdleCallback' in window) { requestIdleCallback(fn, { timeout: 1500 }); }
        else { setTimeout(fn, 300); }
    };
    if (productsBg && window.initGridDistortion) {
        runWhenIdle(() => window.initGridDistortion(productsBg, { imageSrc: '', grid: 12, mouse: 0.12, strength: 0.18, relaxation: 0.9 }));
    }
    
    /* ================================
       HEADER SCROLL EFFECT (OPTIONAL)
       Adds shadow to header on scroll
       ================================ */
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY > 50;
            header.style.boxShadow = scrolled ? '0 12px 30px rgba(0,0,0,0.08)' : '0 10px 30px rgba(0,0,0,0.05)';
        });
    }

    // Services LetterGlitch init
    const letterGlitch = document.getElementById('letterglitch');
    if (letterGlitch && window.initLetterGlitch) {
        runWhenIdle(() => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const glitchColors = isDark ? ['#1f2937','#4b5563','#9ca3af'] : ['#e5e7eb','#93c5fd','#34d399'];
            window.initLetterGlitch(letterGlitch, { glitchColors, glitchSpeed: 60, centerVignette: true, outerVignette: false, smooth: true });
        });
    }

    /* ================================
       HERO WAVES BACKGROUND
       ================================ */
    // Hero composite: services LetterGlitch + products GridDistortion
    const heroLetter = document.getElementById('hero-letterglitch');
    if (heroLetter && window.initLetterGlitch) {
        runWhenIdle(() => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const glitchColors = isDark ? ['#1f2937','#4b5563','#9ca3af'] : ['#e5e7eb','#93c5fd','#34d399'];
            window.initLetterGlitch(heroLetter, { glitchColors, glitchSpeed: 70, centerVignette: false, outerVignette: false, smooth: true });
        });
    }
    const heroProductsBg = document.getElementById('hero-products-bg');
    if (heroProductsBg && window.initGridDistortion) {
        runWhenIdle(() => window.initGridDistortion(heroProductsBg, { imageSrc: '', grid: 10, mouse: 0.1, strength: 0.15, relaxation: 0.9 }));
    }

    /* ================================
       INIT INTERACTIVE CARDS
       ================================ */
    if (window.autoInitTiltedCards) {
        window.autoInitTiltedCards();
    }
    if (window.mountAllProfileCards) {
        window.mountAllProfileCards();
    }

    // ClickSpark on WhatsApp float (with brand color)
    const waFloat = document.querySelector('.whatsapp-float');
    if (waFloat && window.initClickSpark) {
        window.initClickSpark(waFloat, { sparkColor: '#FF6B35', sparkSize: 10, sparkRadius: 18, sparkCount: 10, duration: 420, extraScale: 1.1 });
    }

    // Initialize docks
    if (window.initMainDock) { window.initMainDock(); }
    if (window.initUtilityDock) { window.initUtilityDock(); }
    
    /* ================================
       PLACEHOLDER FOR FUTURE FEATURES
       
       You can add more functionality here:
       - Form validation
       - Dynamic product loading
       - Shopping cart
       - Search functionality
       - Image lightbox/gallery
       - Testimonials carousel
       - etc.
       ================================ */
    
});

/* ================================
   EXTERNAL FUNCTIONS (HELPERS)
   ================================ */

// Example: Function to format price
function formatPrice(price) {
    return `$${parseFloat(price).toFixed(2)}`;
}

// Example: Function to validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Example: Function to show notification (can be expanded later)
function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // Future: Display toast/modal notification
}
