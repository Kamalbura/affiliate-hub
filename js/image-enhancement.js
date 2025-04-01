/**
 * Enhanced Image Loading System for TechDeals Hub
 * Provides better fallbacks, loading states, and error handling
 */

document.addEventListener('DOMContentLoaded', function() {
    enhanceImageLoading();
    setupLazyLoading();
    initScrollAnimations();
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

/**
 * Image Enhancement Script for TechDeals Hub
 * Adds visual effects and loading improvements to images
 */

document.addEventListener('DOMContentLoaded', function() {
    initImageEnhancements();
    setupParallaxImages();
    improveImageLoading();
    addZoomEffect();
});

/**
 * Initialize image enhancements throughout the site
 */
function initImageEnhancements() {
    // Add loading animation to all product images
    const productImages = document.querySelectorAll('.product-image, .trending-image, .deal-image');
    
    productImages.forEach(container => {
        // Add loading state
        container.classList.add('image-loading');
        
        // Find the image inside
        const img = container.querySelector('img');
        if (img) {
            // Set up loading events
            img.addEventListener('load', function() {
                container.classList.remove('image-loading');
                container.classList.add('image-loaded');
                
                // Add subtle reveal animation
                img.style.animation = 'fadeIn 0.5s ease forwards';
            });
            
            img.addEventListener('error', function() {
                container.classList.remove('image-loading');
                container.classList.add('image-error');
                
                // Add fallback content
                const fallback = document.createElement('div');
                fallback.className = 'image-fallback';
                fallback.innerHTML = `
                    <div class="image-error-icon"><i class="fas fa-image"></i></div>
                    <div class="image-error-text">Image unavailable</div>
                `;
                container.appendChild(fallback);
            });
            
            // If image is already loaded (from cache), trigger load event
            if (img.complete) {
                container.classList.remove('image-loading');
                container.classList.add('image-loaded');
            }
        }
    });
}

/**
 * Add parallax effect to hero and feature images
 */
function setupParallaxImages() {
    const parallaxElements = document.querySelectorAll('.hero, .feature-image, .parallax-section');
    
    if (parallaxElements.length === 0) return;
    
    // Skip for mobile devices to improve performance
    if (window.innerWidth < 768) return;
    
    // Add subtle parallax on mouse move
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        parallaxElements.forEach(element => {
            const boundingRect = element.getBoundingClientRect();
            
            // Check if element is in viewport
            if (
                boundingRect.top < window.innerHeight &&
                boundingRect.bottom > 0
            ) {
                const elementCenterX = boundingRect.left + boundingRect.width / 2;
                const elementCenterY = boundingRect.top + boundingRect.height / 2;
                
                const offsetX = (mouseX - 0.5) * 10; // Max 10px movement
                const offsetY = (mouseY - 0.5) * 10;
                
                element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                
                // Move background slightly for hero sections
                if (element.classList.contains('hero')) {
                    element.style.backgroundPosition = `calc(50% + ${offsetX * 2}px) calc(50% + ${offsetY * 2}px)`;
                }
            }
        });
    });
    
    // Add scroll parallax
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const boundingRect = element.getBoundingClientRect();
            const elementTop = boundingRect.top + scrollTop;
            const elementHeight = element.offsetHeight;
            
            // Check if element is in viewport
            if (
                scrollTop + window.innerHeight > elementTop &&
                elementTop + elementHeight > scrollTop
            ) {
                // Calculate parallax offset
                const offset = (scrollTop - elementTop) * 0.2;
                
                if (element.classList.contains('hero')) {
                    element.style.backgroundPositionY = `calc(50% - ${offset}px)`;
                }
            }
        });
    });
}

/**
 * Improve image loading with priority loading and placeholders
 */
function improveImageLoading() {
    // Select hero and above-the-fold images
    const priorityImages = document.querySelectorAll('.hero img, .hero-carousel img, .product-card:nth-child(-n+3) img');
    
    // Set loading priority for important images
    priorityImages.forEach(img => {
        img.setAttribute('loading', 'eager');
        img.setAttribute('fetchpriority', 'high');
    });
    
    // Load other product images lazily
    const lazyImages = document.querySelectorAll('.product-card:nth-child(n+4) img, .trending-card img');
    lazyImages.forEach(img => {
        img.setAttribute('loading', 'lazy');
    });
    
    // Create SVG placeholder for product images to maintain aspect ratio
    document.querySelectorAll('.product-image, .trending-image').forEach(container => {
        if (!container.querySelector('img')) return;
        
        const img = container.querySelector('img');
        const placeholderColor = getComputedStyle(document.documentElement).getPropertyValue('--card-bg').trim() || '#f5f5f5';
        
        // Create SVG placeholder with product outline
        const placeholderSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 800">
                <rect width="800" height="800" fill="${placeholderColor}" />
                <path d="M400 200 L600 350 L600 650 L200 650 L200 350 Z" fill="none" stroke="#ccc" stroke-width="5"/>
                <circle cx="400" cy="300" r="50" fill="none" stroke="#ccc" stroke-width="5"/>
            </svg>
        `;
        
        // Apply placeholder as background while image loads
        if (!img.style.backgroundImage) {
            const placeholder = `url(data:image/svg+xml;base64,${btoa(placeholderSvg)})`;
            container.style.backgroundImage = placeholder;
        }
    });
}

/**
 * Add zoom effect to product images on hover
 */
function addZoomEffect() {
    const productCards = document.querySelectorAll('.product-card, .trending-card');
    
    productCards.forEach(card => {
        const imageContainer = card.querySelector('.product-image, .trending-image');
        const img = imageContainer ? imageContainer.querySelector('img') : null;
        
        if (!imageContainer || !img) return;
        
        // Add zoom effect class
        imageContainer.classList.add('zoom-effect-container');
        img.classList.add('zoom-effect-image');
        
        // Create magnifying lens effect
        card.addEventListener('mouseenter', function() {
            imageContainer.classList.add('active-zoom');
        });
        
        card.addEventListener('mouseleave', function() {
            imageContainer.classList.remove('active-zoom');
        });
        
        // Move zoom position based on cursor
        imageContainer.addEventListener('mousemove', function(e) {
            if (window.innerWidth < 768) return; // Skip on mobile
            
            const bounds = imageContainer.getBoundingClientRect();
            const x = e.clientX - bounds.left;
            const y = e.clientY - bounds.top;
            
            // Calculate percentage positions
            const xPercent = x / bounds.width * 100;
            const yPercent = y / bounds.height * 100;
            
            // Apply transform origin for zoom effect
            img.style.transformOrigin = `${xPercent}% ${yPercent}%`;
        });
    });
}
