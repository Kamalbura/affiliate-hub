/**
 * Enhanced UI Functionality for TechDeals Hub
 * Provides additional interactive features and UI improvements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all sliders with proper value displays
    initializeRangeSliders();
    
    // Add subtle animations to product cards
    addProductCardAnimations();
    
    // Add enhanced mobile menu behavior
    enhanceMobileMenu();
    
    // Add sticky header on scroll
    implementStickyHeader();
    
    // Add smooth scrolling for anchor links
    enableSmoothScrolling();
    
    // Add enhanced search overlay functionality
    enhanceSearchOverlay();
});

/**
 * Initialize all range sliders with proper value displays
 */
function initializeRangeSliders() {
    const sliders = document.querySelectorAll('.price-range');
    
    sliders.forEach(slider => {
        const valueDisplay = document.getElementById(slider.id + 'Value');
        if (valueDisplay) {
            // Set initial value
            valueDisplay.textContent = formatCurrency(slider.value);
            
            // Add visual feedback during sliding
            slider.addEventListener('input', function() {
                slider.style.backgroundImage = `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) ${(this.value - this.min) / (this.max - this.min) * 100}%, #e0e0e0 ${(this.value - this.min) / (this.max - this.min) * 100}%, #e0e0e0 100%)`;
                valueDisplay.textContent = formatCurrency(this.value);
                
                // Add a subtle pop effect to the value display
                valueDisplay.classList.add('pop-effect');
                setTimeout(() => {
                    valueDisplay.classList.remove('pop-effect');
                }, 200);
            });
        }
    });
}

/**
 * Format currency values in Indian Rupee format
 */
function formatCurrency(value) {
    return '₹' + parseInt(value).toLocaleString('en-IN');
}

/**
 * Add animations to product cards for better user experience
 */
function addProductCardAnimations() {
    const productCards = document.querySelectorAll('.product-card');
    
    // Use Intersection Observer to animate cards when they come into view
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        productCards.forEach(card => {
            card.classList.add('fade-in');
            observer.observe(card);
        });
    }
}

/**
 * Enhanced mobile menu with better interaction
 */
function enhanceMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            this.classList.toggle('active');
            
            // Prevent scrolling when menu is open
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (navList.classList.contains('active') && 
                !event.target.closest('.nav-list') && 
                !event.target.closest('.mobile-menu-toggle')) {
                navList.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
}

/**
 * Implement sticky header on scroll
 */
function implementStickyHeader() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add sticky class when scrolling down past 100px
        if (scrollTop > 100) {
            header.classList.add('sticky');
            
            // Hide header when scrolling down, show when scrolling up
            if (scrollTop > lastScrollTop) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
        } else {
            header.classList.remove('sticky');
            header.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
    });
}

/**
 * Enable smooth scrolling for anchor links
 */
function enableSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                const navList = document.querySelector('.nav-list');
                const menuToggle = document.querySelector('.mobile-menu-toggle');
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
                
                // Smooth scroll to element
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Enhanced search overlay with better visibility control
 */
function enhanceSearchOverlay() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-close');
    
    if (searchToggle && searchOverlay) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            searchOverlay.classList.add('active');
            
            // Focus the search input when overlay opens
            const searchInput = searchOverlay.querySelector('input');
            if (searchInput) {
                setTimeout(() => searchInput.focus(), 300);
            }
        });
        
        // Close search on clicking close button
        if (searchClose) {
            searchClose.addEventListener('click', function() {
                searchOverlay.classList.remove('active');
            });
        }
        
        // Close search on clicking outside
        document.addEventListener('click', function(e) {
            if (searchOverlay.classList.contains('active') &&
                !e.target.closest('.search-overlay') && 
                !e.target.closest('.search-toggle')) {
                searchOverlay.classList.remove('active');
            }
        });
        
        // Close search on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
            }
        });
    }
}
