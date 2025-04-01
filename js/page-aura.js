/**
 * Page Aura Effects for TechDeals Hub
 * Adds ambient animated effects across the site
 */

document.addEventListener('DOMContentLoaded', function() {
    initPageAura();
    enhanceSectionTitles();
    setupAmbientAnimations();
    addDecorativeElements();
});

/**
 * Initialize the page aura effects
 */
function initPageAura() {
    // Add aura class to main sections
    const sections = document.querySelectorAll('.featured-deals, .trending-products, .featured-categories, .testimonials-section');
    sections.forEach(section => {
        section.classList.add('aura-glow');
    });
    
    // Create background gradient effect based on page theme
    const pageThemeElement = document.querySelector('.page-theme');
    if (pageThemeElement) {
        const themeClass = Array.from(pageThemeElement.classList).find(cls => cls.includes('-theme'));
        if (themeClass) {
            createThemeGradients(themeClass);
        }
    }
}

/**
 * Create theme-specific gradient backgrounds
 * @param {string} themeClass - The theme class name
 */
function createThemeGradients(themeClass) {
    // Get the theme's accent color RGB values from CSS variables
    let accentRGB = '255, 153, 0'; // Default orange
    
    if (themeClass === 'electronics-theme') accentRGB = '0, 112, 243';
    else if (themeClass === 'cameras-theme') accentRGB = '213, 63, 140';
    else if (themeClass === 'audio-theme') accentRGB = '107, 70, 193';
    else if (themeClass === 'appliances-theme') accentRGB = '56, 161, 105';
    else if (themeClass === 'fans-theme') accentRGB = '49, 130, 206';
    else if (themeClass === 'coolers-theme') accentRGB = '0, 181, 216';
    else if (themeClass === 'about-theme') accentRGB = '102, 126, 234';
    
    // Set the CSS variable for use in animations and effects
    document.documentElement.style.setProperty('--page-accent-rgb', accentRGB);
    
    // Add ambient background elements
    const body = document.body;
    
    // Top-right gradient
    const topGradient = document.createElement('div');
    topGradient.className = 'ambient-gradient top-right';
    topGradient.style.cssText = `
        position: fixed;
        top: -20%;
        right: -20%;
        width: 70vw;
        height: 70vh;
        border-radius: 50%;
        background: radial-gradient(circle at center, rgba(${accentRGB}, 0.05) 0%, rgba(${accentRGB}, 0) 70%);
        pointer-events: none;
        z-index: -1;
        animation: ambient-shift 25s infinite alternate ease-in-out;
    `;
    
    // Bottom-left gradient
    const bottomGradient = document.createElement('div');
    bottomGradient.className = 'ambient-gradient bottom-left';
    bottomGradient.style.cssText = `
        position: fixed;
        bottom: -20%;
        left: -20%;
        width: 70vw;
        height: 70vh;
        border-radius: 50%;
        background: radial-gradient(circle at center, rgba(${accentRGB}, 0.05) 0%, rgba(${accentRGB}, 0) 70%);
        pointer-events: none;
        z-index: -1;
        animation: ambient-shift 25s infinite alternate-reverse ease-in-out;
    `;
    
    body.appendChild(topGradient);
    body.appendChild(bottomGradient);
}

/**
 * Enhance section titles with data-text attribute for shadow effect
 */
function enhanceSectionTitles() {
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.setAttribute('data-text', title.textContent);
    });
}

/**
 * Setup ambient animations for various page elements
 */
function setupAmbientAnimations() {
    // Add subtle hover animations to cards
    const cards = document.querySelectorAll('.product-card, .trending-card, .deal-card, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top; // y position within the element
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const moveX = (x - centerX) / 20;
            const moveY = (y - centerY) / 20;
            
            this.style.transform = `translateY(-5px) perspective(1000px) rotateX(${-moveY}deg) rotateY(${moveX}deg)`;
            
            // Add highlight effect based on cursor position
            const highlight = this.querySelector('.card-highlight') || document.createElement('div');
            if (!highlight.classList.contains('card-highlight')) {
                highlight.classList.add('card-highlight');
                highlight.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                    border-radius: inherit;
                    background: radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%);
                    z-index: 1;
                `;
                this.appendChild(highlight);
            } else {
                highlight.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%)`;
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            const highlight = this.querySelector('.card-highlight');
            if (highlight) highlight.remove();
        });
    });
    
    // Add subtle animation to hero icon
    const heroIcon = document.querySelector('.hero-icon');
    if (heroIcon) {
        document.addEventListener('mousemove', function(e) {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            
            const moveX = (e.clientX - windowWidth / 2) / windowWidth * 10;
            const moveY = (e.clientY - windowHeight / 2) / windowHeight * 10;
            
            heroIcon.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }
}

/**
 * Add decorative background elements to the page
 */
function addDecorativeElements() {
    // Add animated gradient background to certain sections
    const gradientSections = ['.hero', '.newsletter', '.stats-section'];
    
    gradientSections.forEach(selector => {
        const sections = document.querySelectorAll(selector);
        sections.forEach(section => {
            const gradientEl = document.createElement('div');
            gradientEl.className = 'animated-gradient-bg';
            section.appendChild(gradientEl);
        });
    });
    
    // Add decorative corner elements to certain sections
    const cornerSections = ['.featured-deals', '.testimonials-section'];
    
    cornerSections.forEach(selector => {
        const sections = document.querySelectorAll(selector);
        sections.forEach(section => {
            // Add top right corner decoration
            const topRightCorner = document.createElement('div');
            topRightCorner.className = 'decorative-corner corner-top-right';
            section.appendChild(topRightCorner);
            
            // Add bottom left corner decoration
            const bottomLeftCorner = document.createElement('div');
            bottomLeftCorner.className = 'decorative-corner corner-bottom-left';
            section.appendChild(bottomLeftCorner);
        });
    });
}
