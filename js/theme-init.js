/**
 * Theme Initialization
 * This file runs before other scripts to ensure theme is applied immediately
 */

(function() {
    // Add class to html element to prevent flash during theme change
    document.documentElement.classList.add('theme-transition-ready');
    
    // Apply saved theme immediately, before page renders
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        // Add specific meta theme-color for dark mode on mobile
        updateMetaThemeColor('#111827'); // Dark blue/black
    } else if (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Check system preference
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        updateMetaThemeColor('#111827');
    } else {
        // Light mode default
        updateMetaThemeColor('#2563eb'); // Blue
    }
    
    // Update meta theme color for mobile browser UI
    function updateMetaThemeColor(color) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = color;
    }
    
    // Create and append a theme announcer for accessibility
    document.addEventListener('DOMContentLoaded', function() {
        if (!document.getElementById('theme-announcer')) {
            const announcer = document.createElement('div');
            announcer.id = 'theme-announcer';
            announcer.setAttribute('aria-live', 'polite');
            announcer.classList.add('sr-only');
            document.body.appendChild(announcer);
        }
        
        // After a short delay, remove transition-ready class to enable animations
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition-ready');
        }, 100);
    });
})();
