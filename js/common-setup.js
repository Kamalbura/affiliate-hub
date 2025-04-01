/**
 * Common Setup for TechDeals Hub
 * Handles initialization of common elements across all pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mark active nav item based on current URL
    markActiveNavItem();

    // Initialize mobile menu
    initializeMobileMenu();

    // Initialize search functionality
    initializeSearch();
    
    // Add page transitions
    addPageTransitions();
    
    // Initialize comparison tables (if any)
    enhanceComparisonTables();
    
    // Add background image lazy loading
    lazyLoadBackgrounds();
});

/**
 * Mark the current page's nav item as active
 */
function markActiveNavItem() {
    const currentPath = window.location.pathname;
    const fileName = currentPath.split('/').pop();
    
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        if (linkHref === fileName || 
            (fileName === '' && linkHref === 'index.html') ||
            (currentPath === '/' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize mobile menu
 */
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-list') && !e.target.closest('.mobile-menu-toggle') && navList.classList.contains('active')) {
                navList.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }
}

/**
 * Initialize search functionality
 */
function initializeSearch() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-close');
    
    if (searchToggle && searchOverlay) {
        searchToggle.addEventListener('click', function() {
            searchOverlay.classList.add('active');
            // Focus the search input
            const searchInput = document.querySelector('.search-form input');
            if (searchInput) searchInput.focus();
        });
        
        if (searchClose) {
            searchClose.addEventListener('click', function() {
                searchOverlay.classList.remove('active');
            });
        }
        
        // Close search on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
            }
        });
    }
}

/**
 * Add page transition effects
 */
function addPageTransitions() {
    // Add fade-in effect to main content
    const mainContent = document.querySelector('main') || document.querySelector('.hero') || document.body;
    if (mainContent && mainContent !== document.body) {
        mainContent.classList.add('fade-in-animation');
    }
    
    // Add animation to product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('slide-up-animation');
    });
}

/**
 * Enhance comparison tables with hover effects and responsiveness
 */
function enhanceComparisonTables() {
    const tables = document.querySelectorAll('.comparison-table');
    
    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            row.addEventListener('mouseover', function() {
                this.classList.add('highlighted-row');
            });
            
            row.addEventListener('mouseout', function() {
                this.classList.remove('highlighted-row');
            });
        });
    });
}

/**
 * Lazy load background images for hero sections
 */
function lazyLoadBackgrounds() {
    const heroElements = document.querySelectorAll('.hero');
    
    heroElements.forEach(hero => {
        const backgroundStyle = getComputedStyle(hero).backgroundImage;
        
        if (backgroundStyle && backgroundStyle !== 'none') {
            // Extract the URL from the inline style
            const urlMatch = backgroundStyle.match(/url\(['"]?([^'"]+)['"]?\)/);
            
            if (urlMatch && urlMatch[1]) {
                // Create a new image to preload
                const img = new Image();
                img.onload = function() {
                    hero.style.backgroundImage = `url('${urlMatch[1]}')`;
                    hero.classList.add('bg-loaded');
                };
                img.src = urlMatch[1];
            }
        }
    });
}
