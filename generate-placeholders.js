/**
 * Generate Product Placeholder Images
 * Creates SVG placeholder images for each product category
 */

const fs = require('fs');
const path = require('path');

// Create placeholders directory if it doesn't exist
const placeholdersDir = path.join(__dirname, 'img', 'placeholders');
if (!fs.existsSync(placeholdersDir)) {
    console.log('Creating placeholders directory...');
    fs.mkdirSync(placeholdersDir, { recursive: true });
}

// Define categories with their colors
const categories = {
    'electronics': '#3498db', // blue
    'smartphone': '#e74c3c', // red
    'laptop': '#9b59b6',     // purple
    'camera': '#f39c12',     // orange
    'audio': '#2ecc71',      // green
    'tv': '#1abc9c',         // turquoise
    'wearable': '#e67e22',   // orange
    'tablet': '#34495e',     // dark blue
    'networking': '#95a5a6', // gray
    'generic': '#7f8c8d'     // darker gray
};

console.log('Generating placeholder SVGs for product categories...');

// Create placeholder for each category
Object.entries(categories).forEach(([category, color]) => {
    createPlaceholder(category, color);
});

/**
 * Create an SVG placeholder for a category
 */
function createPlaceholder(category, color) {
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
    
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
        <rect width="300" height="300" fill="${color}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="36" 
              fill="white" text-anchor="middle" dy=".3em">${categoryTitle}</text>
        <text x="50%" y="65%" font-family="Arial, sans-serif" font-size="16" 
              fill="white" text-anchor="middle">Placeholder Image</text>
    </svg>`;
    
    const filePath = path.join(placeholdersDir, `${category}.svg`);
    
    fs.writeFileSync(filePath, svgContent);
    console.log(`Created placeholder for ${category}`);
}

console.log('All placeholders generated successfully!');
