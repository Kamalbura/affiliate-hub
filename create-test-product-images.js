/**
 * Create Test Product Images
 * Generates SVG placeholder images for testing in the products directory
 */

const fs = require('fs');
const path = require('path');

// Create products directory if it doesn't exist
const productsDir = path.join(__dirname, 'img', 'products');
if (!fs.existsSync(productsDir)) {
    console.log('Creating products directory...');
    fs.mkdirSync(productsDir, { recursive: true });
}

// Sample product names with categories
const products = [
    { name: 'iphone-14-pro', category: 'smartphone' },
    { name: 'samsung-galaxy-s23', category: 'smartphone' },
    { name: 'sony-wh-1000xm4', category: 'audio' },
    { name: 'apple-airpods-pro', category: 'audio' },
    { name: 'macbook-pro-m2', category: 'laptop' },
    { name: 'dell-xps-15', category: 'laptop' },
    { name: 'canon-eos-5d-mark-iv', category: 'camera' },
    { name: 'sony-alpha-a7-iii', category: 'camera' },
    { name: 'samsung-55-4k-smart-tv', category: 'tv' },
    { name: 'lg-oled-c2', category: 'tv' }
];

// Color mapping for categories
const categoryColors = {
    'smartphone': '#e74c3c',
    'audio': '#2ecc71',
    'laptop': '#9b59b6',
    'camera': '#f39c12',
    'tv': '#1abc9c'
};

console.log('Generating test product SVGs...');

// Create an SVG for each product
products.forEach(product => {
    createProductSVG(product.name, product.category, categoryColors[product.category] || '#3498db');
});

/**
 * Create an SVG image for a product
 */
function createProductSVG(productName, category, color) {
    // Format the product name for display
    const displayName = productName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    
    // Create SVG content
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${color};stop-opacity:0.7" />
                <stop offset="100%" style="stop-color:${color};stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#grad)"/>
        <rect x="50" y="50" width="700" height="500" fill="white" fill-opacity="0.1" rx="20" ry="20"/>
        <text x="400" y="250" font-family="Arial, sans-serif" font-size="48" 
              font-weight="bold" fill="white" text-anchor="middle">${displayName}</text>
        <text x="400" y="320" font-family="Arial, sans-serif" font-size="28" 
              fill="white" text-anchor="middle">${category.toUpperCase()}</text>
        <text x="400" y="500" font-family="Arial, sans-serif" font-size="24" 
              fill="white" text-anchor="middle">TechDeals Hub Demo</text>
    </svg>`;
    
    const filePath = path.join(productsDir, `${productName}.svg`);
    
    fs.writeFileSync(filePath, svgContent);
    console.log(`Created test image for ${productName}`);
}

console.log('All test product images generated successfully!');
