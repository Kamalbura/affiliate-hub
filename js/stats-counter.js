/**
 * Stats Counter Animation for TechDeals Hub
 * Animates the counting of statistics numbers when they come into view
 */

document.addEventListener('DOMContentLoaded', function() {
    initStatsCounter();
});

/**
 * Initialize stats counter animation
 */
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length === 0) return;
    
    // Use Intersection Observer to trigger counting animation when stats are visible
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statElement = entry.target;
                    const countTo = parseFloat(statElement.getAttribute('data-count'));
                    
                    // Detect if it's a decimal number
                    const isDecimal = countTo % 1 !== 0;
                    const decimalPlaces = isDecimal ? 1 : 0;
                    
                    animateCounter(statElement, 0, countTo, 2000, decimalPlaces);
                    
                    // Stop observing after animation
                    observer.unobserve(statElement);
                }
            });
        }, {
            threshold: 0.1
        });
        
        // Start observing each stat number
        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        statNumbers.forEach(stat => {
            const countTo = parseFloat(stat.getAttribute('data-count'));
            const isDecimal = countTo % 1 !== 0;
            const decimalPlaces = isDecimal ? 1 : 0;
            animateCounter(stat, 0, countTo, 2000, decimalPlaces);
        });
    }
}

/**
 * Animate counter from a start value to an end value
 * @param {Element} element - The DOM element to update
 * @param {Number} start - Starting value
 * @param {Number} end - Ending value
 * @param {Number} duration - Animation duration in milliseconds
 * @param {Number} decimals - Number of decimal places
 */
function animateCounter(element, start, end, duration, decimals = 0) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = progress * (end - start) + start;
        
        element.textContent = currentValue.toFixed(decimals);
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.textContent = end.toFixed(decimals);
        }
    };
    
    window.requestAnimationFrame(step);
}
