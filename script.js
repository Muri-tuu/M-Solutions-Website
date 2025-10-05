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
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    if (initialTheme === 'dark') {
        root.setAttribute('data-theme', 'dark');
    }
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
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            // ripple
            const rect = themeToggleButton.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = rect.width / 2 + 'px';
            ripple.style.top = rect.height / 2 + 'px';
            themeToggleButton.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);

            const isDark = root.getAttribute('data-theme') === 'dark';
            if (isDark) {
                root.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                root.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
            setToggleIcon();
        });
    }
    
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
    const CART_KEY = 'msolutions_cart_items';
    const WISHLIST_KEY = 'msolutions_wishlist_items';
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
        if (cartCountEl) cartCountEl.textContent = String(cartItems.length);
        if (wishlistCountEl) wishlistCountEl.textContent = String(wishlistItems.length);
    };
    updateBadges();
    if (cartToggle) cartToggle.addEventListener('click', () => {
        // ripple
        const rect = cartToggle.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = rect.width / 2 + 'px';
        ripple.style.top = rect.height / 2 + 'px';
        cartToggle.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);

        const items = readStore(CART_KEY);
        // Placeholder interaction: add a demo item to show count increment
        items.push({ id: Date.now(), name: 'Sample Item' });
        writeStore(CART_KEY, items);
        updateBadges();
    });
    if (wishlistToggle) wishlistToggle.addEventListener('click', () => {
        // ripple
        const rect = wishlistToggle.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = rect.width / 2 + 'px';
        ripple.style.top = rect.height / 2 + 'px';
        wishlistToggle.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);

        const items = readStore(WISHLIST_KEY);
        items.push({ id: Date.now(), name: 'Wishlist Item' });
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
    const servicesBg = document.querySelector('.services .services-bg');
    if (servicesBg && window.initGridDistortion) {
        const imgSrc = servicesBg.getAttribute('data-image');
        window.initGridDistortion(servicesBg, { imageSrc: imgSrc, grid: 12, mouse: 0.12, strength: 0.18, relaxation: 0.9 });
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

    /* ================================
       HERO WAVES BACKGROUND
       ================================ */
    const heroWaves = document.getElementById('hero-waves');
    if (heroWaves && window.initWaves) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        window.initWaves(heroWaves, {
            lineColor: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.9)',
            backgroundColor: 'rgba(255, 255, 255, 0.10)',
            waveSpeedX: 0.02,
            waveSpeedY: 0.01,
            waveAmpX: 40,
            waveAmpY: 20,
            friction: 0.9,
            tension: 0.01,
            maxCursorMove: 120,
            xGap: 12,
            yGap: 36
        });
    }
    
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
