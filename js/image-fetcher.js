/**
 * Auto-loading Image Fetcher for TechDeals Hub
 * Automatically loads product images from multiple sources
 */

document.addEventListener('DOMContentLoaded', function() {
    // Run image fetcher immediately when page loads
    initializeImageFetcher();
    
    // Also run it again after a short delay to catch any delayed elements
    setTimeout(initializeImageFetcher, 500);
    
    // Set up a mutation observer to watch for dynamically added product cards
    setupDynamicImageLoader();
});

/**
 * Initialize the image fetcher for all product cards on the page
 */
function initializeImageFetcher() {
    const productCards = document.querySelectorAll('.product-card, .trending-card');
    console.log(`Found ${productCards.length} product cards to process`);
    
    productCards.forEach((card, index) => {
        // Add slight delay between cards to prevent all requests happening at once
        setTimeout(() => processCard(card), index * 50);
    });
}

/**
 * Process a single product card for image loading
 */
function processCard(card) {
    const imageElement = card.querySelector('.product-image img, .trending-image img');
    const productTitle = card.querySelector('.product-title, .trending-title')?.textContent.trim() || 'Product';
    const imageContainer = imageElement?.parentElement;
    const buyButton = card.querySelector('a.btn-primary');
    
    if (!imageElement || !imageContainer) return;
    
    // Immediately set a data URL placeholder to ensure something displays
    if (!imageElement.src || imageElement.src === window.location.href || imageElement.src.includes('placeholder')) {
        setInlinePlaceholder(imageElement, productTitle);
    }
    
    // Mark container as loading
    imageContainer.classList.add('image-loading');
    
    // Get category and ASIN
    const category = determineProductCategory(productTitle);
    let asin = null;
    if (buyButton && (buyButton.href.includes('amzn.to') || buyButton.href.includes('amazon'))) {
        asin = extractASIN(buyButton.href);
    }
    
    // Use Auto-Image Loader Chain (tries multiple sources in sequence)
    autoLoadImage(imageElement, productTitle, category, asin, imageContainer);
}

/**
 * Auto-load image from multiple sources in sequence
 */
function autoLoadImage(imageElement, productTitle, category, asin, container) {
    // Create sanitized filename from product title
    const filename = productTitle
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    
    // Try these sources in order:
    // 1. Local file in img/products/ directory
    // 2. Unsplash API with category and product name
    // 3. Direct Amazon image if ASIN available
    // 4. Generated SVG placeholder as final fallback
    
    // First try local image
    const localUrl = `img/products/${filename}.jpg`;
    tryLoadImage(localUrl, imageElement, container)
        .then(success => {
            if (success) return true;
            
            // Try local PNG if JPG failed
            return tryLoadImage(`img/products/${filename}.png`, imageElement, container);
        })
        .then(success => {
            if (success) return true;
            
            // Try Unsplash API
            const unsplashUrl = `https://source.unsplash.com/300x300/?${encodeURIComponent(category + ' ' + productTitle)}`;
            return tryLoadImage(unsplashUrl, imageElement, container);
        })
        .then(success => {
            if (success) return true;
            
            // If we have ASIN, try Amazon image
            if (asin) {
                const amazonUrl = `https://m.media-amazon.com/images/I/${asin}._AC_SY300_.jpg`;
                return tryLoadImage(amazonUrl, imageElement, container);
            }
            return false;
        })
        .then(success => {
            if (!success) {
                // All attempts failed, use generated SVG placeholder (already set at start)
                container.classList.remove('image-loading');
                container.classList.add('loaded');
            }
        });
}

/**
 * Try to load an image from URL
 */
function tryLoadImage(url, imgElement, container) {
    return new Promise(resolve => {
        const img = new Image();
        
        img.onload = function() {
            console.log(`Successfully loaded: ${url}`);
            imgElement.src = url;
            container.classList.remove('image-loading');
            container.classList.add('loaded');
            resolve(true);
        };
        
        img.onerror = function() {
            console.log(`Failed to load: ${url}`);
            resolve(false);
        };
        
        img.src = url;
    });
}

/**
 * Set an immediate inline SVG placeholder
 */
function setInlinePlaceholder(imageElement, productTitle) {
    // Get first letter and generate a color based on product name
    const firstChar = productTitle.charAt(0).toUpperCase();
    const category = determineProductCategory(productTitle);
    const hue = getStringHashCode(productTitle) % 360;
    
    // Create a simple SVG placeholder with product info
    const placeholderSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
        <rect width="300" height="300" fill="hsl(${hue}, 70%, 85%)"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="120" 
              font-weight="bold" fill="hsl(${hue}, 70%, 40%)" text-anchor="middle" dy=".3em">${firstChar}</text>
        <text x="50%" y="75%" font-family="Arial, sans-serif" font-size="16" 
              fill="hsl(${hue}, 70%, 30%)" text-anchor="middle">${category}</text>
    </svg>
    `;
    
    // Convert SVG to a data URL and set as image source
    const dataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(placeholderSvg)));
    imageElement.src = dataUrl;
}

/**
 * Get a simple hash code from a string
 */
function getStringHashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
}

/**
 * Determine product category based on name
 */
function determineProductCategory(productName) {
    const name = productName.toLowerCase();
    
    if (name.includes('laptop') || name.includes('macbook') || name.includes('notebook')) {
        return 'laptop';
    } else if (name.includes('phone') || name.includes('iphone') || name.includes('samsung') || name.includes('xiaomi')) {
        return 'smartphone';
    } else if (name.includes('camera') || name.includes('canon') || name.includes('nikon') || name.includes('sony')) {
        return 'camera';
    } else if (name.includes('headphone') || name.includes('earbud') || name.includes('airpod') || name.includes('speaker')) {
        return 'audio';
    } else if (name.includes('tv') || name.includes('television')) {
        return 'tv';
    } else if (name.includes('watch') || name.includes('band')) {
        return 'wearable';
    } else if (name.includes('tablet') || name.includes('ipad')) {
        return 'tablet';
    } else if (name.includes('router') || name.includes('wifi')) {
        return 'networking';
    }
    
    return 'electronics'; // Default category
}

/**
 * Extract Amazon ASIN from a product URL
 */
function extractASIN(url) {
    if (!url) return null;
    
    // Common patterns in Amazon URLs
    const patterns = [
        /\/dp\/([A-Z0-9]{10})/i,
        /\/product\/([A-Z0-9]{10})/i,
        /\/gp\/product\/([A-Z0-9]{10})/i,
        /\/ASIN\/([A-Z0-9]{10})/i,
        /amzn\.to\/([A-Za-z0-9]{7,10})/i
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1].toUpperCase();
        }
    }
    
    return null;
}

/**
 * Setup mutation observer to watch for dynamically loaded content
 */
function setupDynamicImageLoader() {
    // Create an observer to watch for new product cards being added to the DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(function(node) {
                    // Check if the added node is a product card or contains product cards
                    if (node.nodeType === 1) { // Element node
                        if (node.classList && (node.classList.contains('product-card') || node.classList.contains('trending-card'))) {
                            processCard(node);
                        } else {
                            // Check if this element contains product cards
                            const cards = node.querySelectorAll('.product-card, .trending-card');
                            cards.forEach(card => processCard(card));
                        }
                    }
                });
            }
        });
    });
    
    // Observe the entire document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
