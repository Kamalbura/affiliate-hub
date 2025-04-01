/**
 * Background Enhancer for TechDeals Hub
 * Manages background image loading and effects
 */

document.addEventListener('DOMContentLoaded', function() {
    enhanceBackgrounds();
    setupIconEffects();
});

/**
 * Enhance hero background images with lazy loading and transitions
 */
function enhanceBackgrounds() {
    const heroes = document.querySelectorAll('.hero');
    
    heroes.forEach(hero => {
        // Add loading state
        hero.classList.add('loading');
        
        // Extract the background image URL if set inline
        const style = getComputedStyle(hero);
        const bgImage = style.backgroundImage;
        
        if (bgImage && bgImage !== 'none') {
            const urlMatch = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (urlMatch && urlMatch[1]) {
                preloadImage(urlMatch[1], () => {
                    // Remove loading state once image is loaded
                    hero.classList.remove('loading');
                    
                    // Add fade-in class
                    hero.classList.add('bg-loaded');
                });
            }
        } else {
            // Check if the hero has a category class that defines background
            const categoryClass = Array.from(hero.classList).find(cls => cls.endsWith('-bg'));
            if (categoryClass) {
                // The background will be loaded via CSS, just wait a bit
                setTimeout(() => {
                    hero.classList.remove('loading');
                    hero.classList.add('bg-loaded');
                }, 500);
            }
        }
    });
}

/**
 * Setup enhanced hero icon effects
 */
function setupIconEffects() {
    const icons = document.querySelectorAll('.hero-icon');
    
    icons.forEach(icon => {
        // Add hover effect listener
        icon.addEventListener('mouseover', function() {
            this.classList.add('icon-hover');
        });
        
        icon.addEventListener('mouseout', function() {
            this.classList.remove('icon-hover');
        });
        
        // For touch devices
        icon.addEventListener('touchstart', function() {
            this.classList.add('icon-hover');
        });
        
        icon.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('icon-hover');
            }, 300);
        });
    });
}

/**
 * Preload an image and run callback when loaded
 */
function preloadImage(src, callback) {
    const img = new Image();
    img.onload = callback;
    img.onerror = callback; // Still run callback on error to remove loading state
    img.src = src;
}
