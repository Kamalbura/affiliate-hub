/**
 * Homepage Enhancements for TechDeals Hub
 * Adds interactive elements and animations specific to the homepage
 */

document.addEventListener('DOMContentLoaded', function() {
    enhanceHeroCarousel();
    addAtmosphericEffects();
    improveProductHighlighting();
    setupFeaturedItemSpotlight();
});

/**
 * Enhance the hero carousel with better transitions and interactions
 */
function enhanceHeroCarousel() {
    const carousel = document.querySelector('.hero-carousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicators button');
    const prevBtn = document.querySelector('.carousel-control[data-direction="prev"]');
    const nextBtn = document.querySelector('.carousel-control[data-direction="next"]');
    
    let currentIndex = 0;
    let interval;
    
    // Improve slide transitions with cross-fade and content animations
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.style.opacity = '0';
            slide.style.zIndex = '1';
            
            // Reset content animations
            const content = slide.querySelector('.slide-content');
            if (content) {
                content.style.opacity = '0';
                content.style.transform = 'translateY(30px)';
            }
        });
        
        // Update indicators
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Show current slide
        slides[index].style.opacity = '1';
        slides[index].style.zIndex = '2';
        
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
        
        // Animate content with delay
        const content = slides[index].querySelector('.slide-content');
        if (content) {
            setTimeout(() => {
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
                content.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            }, 300);
        }
        
        currentIndex = index;
    }
    
    // Set up a more robust auto-play with pause on hover
    function startAutoPlay() {
        interval = setInterval(() => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= slides.length) {
                nextIndex = 0;
            }
            showSlide(nextIndex);
        }, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoPlay() {
        clearInterval(interval);
    }
    
    // Add pause on hover functionality
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    
    // Add navigation button functionality
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            stopAutoPlay();
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) {
                prevIndex = slides.length - 1;
            }
            showSlide(prevIndex);
            startAutoPlay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            stopAutoPlay();
            let nextIndex = currentIndex + 1;
            if (nextIndex >= slides.length) {
                nextIndex = 0;
            }
            showSlide(nextIndex);
            startAutoPlay();
        });
    }
    
    // Add indicator button functionality
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            stopAutoPlay();
            showSlide(index);
            startAutoPlay();
        });
    });
    
    // Add swipe support for touch devices
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    carousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left - go to next slide
            stopAutoPlay();
            let nextIndex = currentIndex + 1;
            if (nextIndex >= slides.length) {
                nextIndex = 0;
            }
            showSlide(nextIndex);
            startAutoPlay();
        }
        
        if (touchEndX > touchStartX + 50) {
            // Swipe right - go to previous slide
            stopAutoPlay();
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) {
                prevIndex = slides.length - 1;
            }
            showSlide(prevIndex);
            startAutoPlay();
        }
    }
    
    // Initialize carousel
    showSlide(0);
    startAutoPlay();
}

/**
 * Add atmospheric effects to homepage sections
 */
function addAtmosphericEffects() {
    // Add parallax effect to section backgrounds
    const sections = document.querySelectorAll(
        '.featured-deals, .trending-products, .featured-categories, .hero-carousel'
    );
    
    // Skip for mobile devices
    if (window.innerWidth < 768) return;
    
    sections.forEach(section => {
        // Add parallax attribute
        section.setAttribute('data-parallax', 'true');
        
        // Create atmospheric overlay
        const atmosphere = document.createElement('div');
        atmosphere.className = 'atmospheric-overlay';
        section.prepend(atmosphere); // Add as first child
    });
    
    // Add CSS for atmospheric overlays
    const atmoStyle = document.createElement('style');
    atmoStyle.textContent = `
        .atmospheric-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
                radial-gradient(circle at 25% 25%, rgba(var(--primary-rgb), 0.03) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(var(--primary-rgb), 0.03) 0%, transparent 50%);
            z-index: 0;
            pointer-events: none;
            opacity: 0.7;
        }
        
        [data-theme="dark"] .atmospheric-overlay {
            background-image: 
                radial-gradient(circle at 25% 25%, rgba(var(--primary-rgb), 0.05) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(var(--primary-rgb), 0.05) 0%, transparent 50%);
            opacity: 0.4;
        }
    `;
    document.head.appendChild(atmoStyle);
    
    // Move background on scroll for parallax effect
    window.addEventListener('scroll', function() {
        const scrolled = window.scrollY;
        
        document.querySelectorAll('[data-parallax="true"]').forEach(element => {
            const offset = element.offsetTop;
            const height = element.offsetHeight;
            
            if (scrolled + window.innerHeight > offset && scrolled < offset + height) {
                const parallaxOffset = (scrolled - offset) * 0.2;
                const overlay = element.querySelector('.atmospheric-overlay');
                
                if (overlay) {
                    overlay.style.transform = `translateY(${parallaxOffset}px)`;
                }
            }
        });
    });
}

/**
 * Improve product highlighting with better visual cues
 */
function improveProductHighlighting() {
    // Find featured or best deal products
    const featuredProducts = document.querySelectorAll(
        '.product-card[data-featured="true"], .product-card.featured, ' +
        '.product-badge:contains("Best Deal"), .product-badge:contains("Featured")'
    );
    
    featuredProducts.forEach(product => {
        let card;
        
        // If we selected the badge, get the parent card
        if (product.classList.contains('product-badge')) {
            card = product.closest('.product-card');
        } else {
            card = product;
        }
        
        if (!card) return;
        
        // Add pulsing aura
        card.classList.add('featured-aura');
        
        // Add small corner accents
        const cornerAccent = document.createElement('div');
        cornerAccent.className = 'corner-accent';
        card.appendChild(cornerAccent);
    });
    
    // Add CSS for featured product highlight
    const featuredStyle = document.createElement('style');
    featuredStyle.textContent = `
        .featured-aura {
            position: relative;
            z-index: 2;
        }
        
        .featured-aura::before {
            content: '';
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
            background: radial-gradient(
                ellipse at center,
                rgba(var(--primary-rgb), 0.15) 0%,
                rgba(var(--primary-rgb), 0) 70%
            );
            border-radius: inherit;
            z-index: -1;
            animation: aura-pulse 2s infinite alternate ease-in-out;
            pointer-events: none;
        }
        
        .corner-accent {
            position: absolute;
            top: 0;
            right: 0;
            width: 40px;
            height: 40px;
            overflow: hidden;
            z-index: 3;
        }
        
        .corner-accent::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 80px;
            height: 30px;
            background-color: var(--primary-color);
            transform: rotate(45deg) translateX(20px) translateY(-15px);
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }
        
        @keyframes aura-pulse {
            0% {
                opacity: 0.6;
                transform: scale(0.98);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(featuredStyle);
}

/**
 * Setup featured item spotlight effect
 */
function setupFeaturedItemSpotlight() {
    // Find the deal of the day section
    const dealOfDay = document.querySelector('.deal-of-day');
    if (!dealOfDay) return;
    
    // Create spotlight effect
    const spotlight = document.createElement('div');
    spotlight.className = 'spotlight-effect';
    dealOfDay.appendChild(spotlight);
    
    // Add CSS for spotlight effect
    const spotlightStyle = document.createElement('style');
    spotlightStyle.textContent = `
        .spotlight-effect {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(
                circle at 50% 50%,
                rgba(var(--primary-rgb), 0.1) 0%,
                transparent 70%
            );
            z-index: 0;
            pointer-events: none;
            animation: spotlight-shift 10s infinite alternate ease-in-out;
        }
        
        @keyframes spotlight-shift {
            0% {
                background-position: 30% 30%;
            }
            100% {
                background-position: 70% 70%;
            }
        }
    `;
    document.head.appendChild(spotlightStyle);
}
