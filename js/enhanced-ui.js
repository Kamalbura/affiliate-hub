/**
 * Enhanced UI Script for TechDeals Hub
 * Adds interactive elements and visual feedback
 */

document.addEventListener('DOMContentLoaded', function() {
    initScrollEffects();
    enhanceButtonInteractions();
    addDynamicBackgroundEffects();
    initProductCardEnhancements();
    setupMagneticElements();
});

/**
 * Initialize scroll-based animations and effects
 */
function initScrollEffects() {
    // Setup scroll reveal animation for elements
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const staggerContainers = document.querySelectorAll('.stagger-children');
    
    // Use Intersection Observer to trigger animations
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(el => revealObserver.observe(el));
        staggerContainers.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for browsers not supporting IntersectionObserver
        revealElements.forEach(el => el.classList.add('revealed'));
        staggerContainers.forEach(el => el.classList.add('revealed'));
    }
    
    // Add smooth parallax scrolling effect
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.scrollY;
            
            parallaxElements.forEach(element => {
                const speed = element.getAttribute('data-parallax-speed') || 0.2;
                const offset = scrollTop * speed;
                element.style.transform = `translateY(${offset}px)`;
            });
        });
    }
    
    // Add back-to-top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopBtn);
    
    // Show/hide back-to-top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Smooth scroll to top
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Add enhanced interactions to buttons
 */
function enhanceButtonInteractions() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn, .filter-tab');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - this.getBoundingClientRect().left;
            const y = e.clientY - this.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.className = 'btn-ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add tooltip functionality to elements with data-tooltip attribute
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = tooltipText;
            
            document.body.appendChild(tooltip);
            
            const elementRect = this.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            // Position tooltip above the element
            tooltip.style.left = `${elementRect.left + (elementRect.width / 2) - (tooltipRect.width / 2)}px`;
            tooltip.style.top = `${elementRect.top - tooltipRect.height - 10}px`;
            
            // Add active class to show with animation
            setTimeout(() => {
                tooltip.classList.add('active');
            }, 50);
            
            // Store tooltip reference
            this.tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltip) {
                this.tooltip.classList.remove('active');
                
                setTimeout(() => {
                    this.tooltip.remove();
                    this.tooltip = null;
                }, 200);
            }
        });
    });
}

/**
 * Add dynamic background effects to enhance visual appeal
 */
function addDynamicBackgroundEffects() {
    // Skip for mobile devices to improve performance
    if (window.innerWidth < 768) return;
    
    // Create subtle floating particles in hero sections
    const heroSections = document.querySelectorAll('.hero, .hero-carousel');
    
    heroSections.forEach(section => {
        const dots = document.createElement('div');
        dots.className = 'dynamic-dots';
        
        // Create random dots
        for (let i = 0; i < 20; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            
            // Random position
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            dot.style.left = `${x}%`;
            dot.style.top = `${y}%`;
            
            // Random size and opacity
            const size = Math.random() * 3 + 1;
            const opacity = Math.random() * 0.3 + 0.1;
            
            dot.style.width = `${size}px`;
            dot.style.height = `${size}px`;
            dot.style.opacity = opacity;
            
            // Random animation duration and delay
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 10;
            
            dot.style.animation = `float-around ${duration}s ${delay}s infinite linear`;
            
            dots.appendChild(dot);
        }
        
        section.appendChild(dots);
    });
    
    // Define the float-around animation dynamically
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes float-around {
            0% {
                transform: translate(0, 0) rotate(0deg);
            }
            25% {
                transform: translate(20px, -15px) rotate(90deg);
            }
            50% {
                transform: translate(0px, 30px) rotate(180deg);
            }
            75% {
                transform: translate(-20px, -15px) rotate(270deg);
            }
            100% {
                transform: translate(0, 0) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(styleSheet);
    
    // Add ambient gradient motion to page background
    const ambientBg = document.createElement('div');
    ambientBg.className = 'ambient-background';
    document.body.appendChild(ambientBg);
    
    // Add CSS for ambient background
    const ambientStyle = document.createElement('style');
    ambientStyle.textContent = `
        .ambient-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -10;
            pointer-events: none;
            background: 
                radial-gradient(circle at 20% 20%, rgba(var(--primary-rgb), 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(var(--primary-rgb), 0.05) 0%, transparent 50%);
            opacity: 0.4;
            animation: ambient-shift 30s infinite alternate ease-in-out;
        }
        
        [data-theme="dark"] .ambient-background {
            opacity: 0.2;
        }
        
        @keyframes ambient-shift {
            0% {
                background-position: 0% 0%;
            }
            100% {
                background-position: 100% 100%;
            }
        }
    `;
    document.head.appendChild(ambientStyle);
}

/**
 * Add enhancements to product cards
 */
function initProductCardEnhancements() {
    // Add hover interactions and visual effects to product cards
    const productCards = document.querySelectorAll('.product-card, .trending-card');
    
    productCards.forEach(card => {
        // Add highlight class for enhanced hover effect
        card.classList.add('highlight-hover');
        
        // Create shine effect element
        const shine = document.createElement('div');
        shine.className = 'card-shine';
        card.appendChild(shine);
        
        // Add mouse move effect
        card.addEventListener('mousemove', function(e) {
            const bounds = this.getBoundingClientRect();
            const x = e.clientX - bounds.left;
            const y = e.clientY - bounds.top;
            
            // Calculate percentage positions
            const xPercent = x / bounds.width * 100;
            const yPercent = y / bounds.height * 100;
            
            // Move shine effect
            shine.style.background = `
                radial-gradient(
                    circle at ${xPercent}% ${yPercent}%, 
                    rgba(255,255,255,0.2) 0%, 
                    transparent 50%
                )
            `;
        });
        
        // Reset shine on mouse leave
        card.addEventListener('mouseleave', function() {
            shine.style.background = 'transparent';
        });
    });
    
    // Add CSS for card shine effect
    const shineStyle = document.createElement('style');
    shineStyle.textContent = `
        .product-card, .trending-card {
            position: relative;
            overflow: hidden;
        }
        
        .card-shine {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            z-index: 2;
        }
        
        /* Button ripple effect */
        .btn-ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple-effect 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-effect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        /* Custom tooltip */
        .custom-tooltip {
            position: fixed;
            background: var(--tooltip-bg, rgba(0, 0, 0, 0.8));
            color: var(--tooltip-text, #fff);
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 9999;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.2s ease, transform 0.2s ease;
            pointer-events: none;
        }
        
        .custom-tooltip.active {
            opacity: 1;
            transform: translateY(0);
        }
        
        .custom-tooltip::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 50%;
            transform: translateX(-50%);
            border-width: 5px 5px 0;
            border-style: solid;
            border-color: var(--tooltip-bg, rgba(0, 0, 0, 0.8)) transparent transparent;
        }
    `;
    document.head.appendChild(shineStyle);
}

/**
 * Set up magnetic elements that attract to cursor
 */
function setupMagneticElements() {
    // Skip for mobile devices
    if (window.innerWidth < 992) return;
    
    const magneticElements = document.querySelectorAll('.btn-magnetic, .category-circle, .hero-icon');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', function(e) {
            const bound = this.getBoundingClientRect();
            const x = e.clientX - bound.left - bound.width / 2;
            const y = e.clientY - bound.top - bound.height / 2;
            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = Math.max(bound.width, bound.height) / 2;
            
            // Only apply magnetic effect if cursor is within a certain range
            if (distance < maxDistance * 1.5) {
                // Calculate magnetic pull (stronger when closer)
                const pull = (maxDistance - distance) / maxDistance;
                const moveX = x * pull * 0.3; // Adjust multiplier to control strength
                const moveY = y * pull * 0.3;
                
                this.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });
}
