/**
 * Enhanced Image Loading System for TechDeals Hub
 * Provides better fallbacks, loading states, and error handling
 */

document.addEventListener('DOMContentLoaded', function() {
    enhanceImageLoading();
    setupLazyLoading();
});

/**
 * Enhance image loading with proper loading states and error handling
 */
function enhanceImageLoading() {
    const productImages = document.querySelectorAll('.product-image img, .trending-image img');
    
    productImages.forEach(img => {
        // Add loading class to container
        const container = img.parentElement;
        container.classList.add('image-loading');
        
        // Set up load event
        img.addEventListener('load', function() {
            container.classList.remove('image-loading');
            container.classList.add('loaded');
            
            // Send analytics event for successful image load
            if (typeof gtag !== 'undefined') {
                gtag('event', 'image_loaded', {
                    'event_category': 'Performance',
                    'event_label': img.src
                });
            }
        });
        
        // Set up error handling
        img.addEventListener('error', function() {
            container.classList.remove('image-loading');
            handleImageError(img, container);
            
            // Send analytics event for image error
            if (typeof gtag !== 'undefined') {
                gtag('event', 'image_error', {
                    'event_category': 'Errors',
                    'event_label': img.src
                });
            }
        });
        
        // Force reload for images that may be cached but broken
        if (img.complete) {
            if (img.naturalHeight === 0) {
                handleImageError(img, container);
            } else {
                container.classList.remove('image-loading');
                container.classList.add('loaded');
            }
        }
    });
}

/**
 * Handle image loading error with smart fallback system
 */
function handleImageError(img, container) {
    // Get product name or category
    const productCard = img.closest('.product-card, .trending-card');
    let productName = 'product';
    let category = 'electronics';
    
    if (productCard) {
        const titleElement = productCard.querySelector('.product-title, .trending-title');
        if (titleElement) {
            productName = titleElement.textContent.trim();
        }
        
        // Try to determine product category
        if (productName.toLowerCase().includes('laptop') || productName.toLowerCase().includes('macbook')) {
            category = 'laptop';
        } else if (productName.toLowerCase().includes('phone') || productName.toLowerCase().includes('iphone') || productName.toLowerCase().includes('samsung')) {
            category = 'smartphone';
        } else if (productName.toLowerCase().includes('camera')) {
            category = 'camera';
        } else if (productName.toLowerCase().includes('headphone') || productName.toLowerCase().includes('earbud')) {
            category = 'audio';
        } else if (productName.toLowerCase().includes('tv') || productName.toLowerCase().includes('television')) {
            category = 'tv';
        }
    }
    
    // Try multiple fallback methods
    tryMultipleFallbacks(img, container, productName, category);
}

/**
 * Try multiple image fallback methods
 */
function tryMultipleFallbacks(img, container, productName, category) {
    // Attempt 1: Try local category placeholder
    const localPlaceholder = `img/placeholders/${category}.jpg`;
    
    // Attempt 2: Try external service based on product name
    const unsplashUrl = `https://source.unsplash.com/300x300/?${encodeURIComponent(productName)}`;
    
    // Attempt 3: Try DiceBear avatar API as a last resort
    const dicebearUrl = `https://api.dicebear.com/6.x/shapes/svg?seed=${encodeURIComponent(productName)}`;
    
    // Create a new image element to test the first fallback
    const testImg = new Image();
    testImg.onload = function() {
        img.src = localPlaceholder;
        container.classList.remove('image-loading');
        container.classList.add('loaded');
    };
    
    testImg.onerror = function() {
        // Try Unsplash
        img.src = unsplashUrl;
        
        img.onerror = function() {
            // Final fallback
            img.src = dicebearUrl;
            
            img.onerror = function() {
                // Ultimate fallback - text representation
                img.style.display = 'none';
                container.classList.remove('image-loading');
                
                const fallbackText = document.createElement('div');
                fallbackText.className = 'image-fallback-text';
                fallbackText.textContent = productName.charAt(0).toUpperCase();
                
                container.appendChild(fallbackText);
            };
        };
    };
    
    testImg.src = localPlaceholder;
}

/**
 * Set up lazy loading for images
 */
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
    const fadeElems = document.querySelectorAll('.fade-in-section');
    
    if ('IntersectionObserver' in window) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        fadeElems.forEach(elem => {
            fadeObserver.observe(elem);
        });
    } else {
        // Fallback for browsers without intersection observer
        fadeElems.forEach(elem => {
            elem.classList.add('is-visible');
        });
    }
    
    // Add staggered animations to product cards
    const productCards = document.querySelectorAll('.staggered-fade-in');
    
    if ('IntersectionObserver' in window) {
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered delay
                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    
                    staggerObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        productCards.forEach(card => {
            staggerObserver.observe(card);
        });
    } else {
        // Fallback
        productCards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    }
}

// Initialize scroll animations after DOM load
document.addEventListener('DOMContentLoaded', initScrollAnimations);
