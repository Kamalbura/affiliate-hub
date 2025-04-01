/**
 * Image Preloader for TechDeals Hub
 * Preloads common category placeholder images to improve user experience
 */

document.addEventListener('DOMContentLoaded', function() {
    // Start preloading common images
    preloadCategoryImages();
});

/**
 * Preload category placeholder images
 */
function preloadCategoryImages() {
    const categories = [
        'electronics',
        'smartphone',
        'laptop',
        'camera',
        'audio',
        'tv',
        'wearable',
        'tablet',
        'networking'
    ];
    
    // For each category, try to preload both local placeholder and Unsplash alternative
    categories.forEach(category => {
        // Try local placeholder
        preloadImage(`img/placeholders/${category}.svg`);
        preloadImage(`img/placeholders/${category}.jpg`);
        
        // Also preload a few Unsplash category images that might be used
        preloadImage(`https://source.unsplash.com/300x300/?${category}`);
    });
}

/**
 * Preload an image
 */
function preloadImage(src) {
    const img = new Image();
    img.src = src;
}
