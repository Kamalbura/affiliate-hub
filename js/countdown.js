/**
 * Countdown Timer for TechDeals Hub
 * Creates dynamic countdown timers for deals and offers
 */

document.addEventListener('DOMContentLoaded', function() {
    initCountdownTimers();
});

/**
 * Initialize all countdown timers on the page
 */
function initCountdownTimers() {
    const timers = document.querySelectorAll('.countdown-timer');
    
    // If no timers found, exit
    if (!timers.length) return;
    
    // Set random end times for demo purposes (in real use, these would come from server)
    timers.forEach((timer, index) => {
        // Generate a random time between 1-24 hours from now
        const hours = Math.floor(Math.random() * 23) + 1;
        const minutes = Math.floor(Math.random() * 59);
        const seconds = Math.floor(Math.random() * 59);
        
        const now = new Date();
        const endTime = new Date(now.getTime() + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000));
        
        // Store end time as data attribute
        timer.setAttribute('data-endtime', endTime.getTime());
        
        // Start countdown
        updateTimer(timer);
    });
    
    // Update all timers every second
    setInterval(() => {
        timers.forEach(timer => updateTimer(timer));
    }, 1000);
}

/**
 * Update a single countdown timer
 * @param {Element} timerElement - The DOM element containing the timer
 */
function updateTimer(timerElement) {
    const endTime = parseInt(timerElement.getAttribute('data-endtime'));
    const now = new Date().getTime();
    const timeLeft = endTime - now;
    
    if (timeLeft <= 0) {
        timerElement.textContent = "Deal Ended";
        
        // Add expired class to parent card
        const dealCard = timerElement.closest('.deal-card');
        if (dealCard) {
            dealCard.classList.add('deal-expired');
        }
        return;
    }
    
    // Calculate hours, minutes, seconds
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    // Format the time string with leading zeros
    const timeString = 
        String(hours).padStart(2, '0') + ':' + 
        String(minutes).padStart(2, '0') + ':' + 
        String(seconds).padStart(2, '0');
    
    // Update the timer display
    timerElement.textContent = timeString;
    
    // Add urgency class if less than 1 hour remains
    if (timeLeft < 3600000) {
        timerElement.classList.add('urgent');
    }
}
