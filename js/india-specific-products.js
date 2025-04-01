/**
 * India-specific Product Enhancements
 * Adds functionality specific to Indian market products
 */

document.addEventListener('DOMContentLoaded', function() {
    localizeProductDisplay();
    enhanceIndianProductLinks();
});

/**
 * Localizes product display for Indian market
 */
function localizeProductDisplay() {
    // Convert prices to INR format
    document.querySelectorAll('.product-price, .current-price, .deal-current-price').forEach(element => {
        const text = element.textContent;
        if (text.includes('₹')) {
            // Already in rupee format, just ensure proper formatting
            const priceMatch = text.match(/₹\s*(\d+[,\d]*(\.\d+)?)/);
            if (priceMatch && priceMatch[1]) {
                const numericValue = parseFloat(priceMatch[1].replace(/,/g, ''));
                element.textContent = formatIndianPrice(numericValue);
            }
        }
    });
    
    // Add "Made in India" badge to applicable products
    document.querySelectorAll('.product-card, .trending-card').forEach(card => {
        const title = card.querySelector('.product-title, .trending-title')?.textContent || '';
        const description = card.querySelector('.product-description')?.textContent || '';
        
        // Check if product is Indian
        if (isIndianProduct(title, description)) {
            // Add Made in India badge
            const badge = document.createElement('div');
            badge.className = 'indian-product-badge';
            badge.innerHTML = '<span>Made in India</span>';
            
            const imageContainer = card.querySelector('.product-image, .trending-image');
            if (imageContainer) {
                imageContainer.appendChild(badge);
            }
        }
    });
}

/**
 * Enhance product links to prioritize Indian e-commerce sites
 */
function enhanceIndianProductLinks() {
    document.querySelectorAll('a[href*="amzn.to"], a[href*="amazon.com"]').forEach(link => {
        // Check if the link already points to Amazon.in
        if (!link.href.includes('amazon.in')) {
            // Try to modify the link to point to Amazon.in
            const asin = extractASINFromUrl(link.href);
            if (asin) {
                // Store the original link as a data attribute
                link.setAttribute('data-original-href', link.href);
                
                // Update with Amazon.in link
                link.href = `https://www.amazon.in/dp/${asin}?tag=${getAffiliateTag()}`;
                
                // Add visual indicator
                link.classList.add('indian-store-link');
                
                // Add tooltip
                link.setAttribute('title', 'Amazon.in link');
            }
        }
    });
}

/**
 * Format price in Indian format with rupee symbol
 * @param {number} price - Price to format
 * @returns {string} Formatted price string
 */
function formatIndianPrice(price) {
    // Format according to Indian numbering system (lakhs, crores)
    let priceString = price.toFixed(0);
    let lastThree = priceString.substring(priceString.length - 3);
    let otherNumbers = priceString.substring(0, priceString.length - 3);
    
    if (otherNumbers !== '') {
        lastThree = ',' + lastThree;
    }
    
    let formattedPrice = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    return '₹' + formattedPrice;
}

/**
 * Check if a product is likely Indian made
 * @param {string} title - Product title
 * @param {string} description - Product description
 * @returns {boolean} True if product appears to be Indian
 */
function isIndianProduct(title, description) {
    const combinedText = (title + ' ' + description).toLowerCase();
    
    // List of Indian brands
    const indianBrands = [
        'micromax', 'wipro', 'godrej', 'tata', 'bajaj', 'videocon', 
        'reliance', 'karbonn', 'lava', 'onida', 'voltas', 'borosil',
        'prestige', 'havells', 'crompton', 'boat', 'noise', 'himalaya'
    ];
    
    // Check for Indian brands or made in India text
    for (const brand of indianBrands) {
        if (combinedText.includes(brand)) {
            return true;
        }
    }
    
    return combinedText.includes('made in india') || 
           combinedText.includes('indian made') || 
           combinedText.includes('manufactured in india');
}

/**
 * Extract ASIN from an Amazon URL
 */
function extractASINFromUrl(url) {
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
 * Get your Amazon affiliate tag
 */
function getAffiliateTag() {
    return 'techhub-21'; // Replace with your actual Amazon.in affiliate tag
}
