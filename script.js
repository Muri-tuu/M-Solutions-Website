/* ================================
   M SOLUTIONS - MAIN JAVASCRIPT
   ================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
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
    const WHATSAPP_NUMBER = '1234567890'; // Replace with your WhatsApp number (include country code, no + or spaces)
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
       HEADER SCROLL EFFECT (OPTIONAL)
       Adds shadow to header on scroll
       ================================ */
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
            }
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
