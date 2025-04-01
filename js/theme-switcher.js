/**
 * Theme Switcher for TechDeals Hub
 * Enables dark/light mode toggle and persists user preference
 */

document.addEventListener('DOMContentLoaded', function() {
    initThemeSwitcher();
    setupLogoTapFeature();
});

function initThemeSwitcher() {
    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    
    // Check for saved user preference
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark';
    
    // Set initial icon state
    updateThemeToggleIcon(themeToggle, isDarkMode);
    
    // Add toggle to header
    const headerActions = document.querySelector('.header-actions');
    if (headerActions) {
        // Insert before the search button for better positioning
        const searchToggle = headerActions.querySelector('.search-toggle');
        if (searchToggle) {
            headerActions.insertBefore(themeToggle, searchToggle);
        } else {
            headerActions.prepend(themeToggle);
        }
    }
    
    // Toggle theme on click with animation
    themeToggle.addEventListener('click', function() {
        // Add clicking animation
        this.classList.add('theme-toggle-clicked');
        setTimeout(() => {
            this.classList.remove('theme-toggle-clicked');
        }, 300);
        
        toggleTheme(themeToggle);
    });
    
    // Check system preference on first visit
    if (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        updateThemeToggleIcon(themeToggle, true);
    }
    
    // Listen for system theme changes
    if (window.matchMedia) {
        const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (colorSchemeQuery.addEventListener) {
            colorSchemeQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    // Only apply if user hasn't manually set preference
                    const newIsDarkMode = e.matches;
                    document.documentElement.setAttribute('data-theme', newIsDarkMode ? 'dark' : 'light');
                    updateThemeToggleIcon(themeToggle, newIsDarkMode);
                    updateMetaThemeColor(newIsDarkMode ? '#1a1a1a' : '#232f3e');
                }
            });
        }
    }
}

/**
 * Setup hidden feature to toggle dark mode by tapping logo 4 times
 */
function setupLogoTapFeature() {
    const logo = document.querySelector('.logo');
    if (!logo) return;
    
    let tapCount = 0;
    let tapTimer = null;
    
    logo.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default link behavior if logo is a link
        
        tapCount++;
        
        // Clear previous timer
        if (tapTimer) {
            clearTimeout(tapTimer);
        }
        
        // Add visual feedback for each tap
        const ripple = document.createElement('span');
        ripple.className = 'logo-tap-ripple';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 700);
        
        // Set timer to reset tap count if user pauses
        tapTimer = setTimeout(() => {
            tapCount = 0;
        }, 1500);
        
        // If 4 taps detected, toggle theme
        if (tapCount === 4) {
            tapCount = 0;
            clearTimeout(tapTimer);
            
            const themeToggle = document.querySelector('.theme-toggle');
            toggleTheme(themeToggle);
            
            // Add special animation for successful activation
            const successRipple = document.createElement('span');
            successRipple.className = 'logo-success-ripple';
            this.appendChild(successRipple);
            
            setTimeout(() => {
                successRipple.remove();
            }, 1000);
        }
    });
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme(toggleButton) {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const isDarkMode = currentTheme === 'dark';
    const body = document.body;
    
    // Add transition class for smooth theme change
    document.documentElement.classList.add('theme-transition');
    body.classList.add('theme-transition');
    
    if (isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        updateThemeToggleIcon(toggleButton, false);
        updateMetaThemeColor('#232f3e');
        
        // Announce theme change for accessibility
        announceThemeChange('Light mode activated');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        updateThemeToggleIcon(toggleButton, true);
        updateMetaThemeColor('#1a1a1a');
        
        // Announce theme change for accessibility
        announceThemeChange('Dark mode activated');
    }
    
    // Remove transition class after animation completes
    setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
        body.classList.remove('theme-transition');
    }, 1000);
}

/**
 * Update theme toggle button icon
 * @param {Element} toggleButton - The toggle button element
 * @param {boolean} isDarkMode - Whether dark mode is active
 */
function updateThemeToggleIcon(toggleButton, isDarkMode) {
    if (!toggleButton) return;
    
    toggleButton.innerHTML = isDarkMode ? 
        '<i class="fas fa-sun"></i>' : 
        '<i class="fas fa-moon"></i>';
    
    toggleButton.setAttribute('data-tooltip', isDarkMode ? 
        'Switch to light mode' : 
        'Switch to dark mode');
}

/**
 * Update meta theme color for mobile browser UI
 * @param {string} color - Hex color code
 */
function updateMetaThemeColor(color) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
    }
    
    metaThemeColor.content = color;
}

/**
 * Announce theme change for screen readers
 */
function announceThemeChange(message) {
    let announcer = document.getElementById('theme-announcer');
    if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'theme-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.classList.add('sr-only'); // screen reader only
        document.body.appendChild(announcer);
    }
    
    announcer.textContent = message;
}
