/**
 * Homepage-specific JavaScript for TechDeals Hub
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize hero carousel
    initCarousel();
    
    // Initialize trending products scroll
    initTrendingScroll();
    
    // Initialize countdown timer
    initCountdownTimer();
    
    // Initialize search functionality
    initSearch();
    
    // Initialize back to top button
    initBackToTop();
    
    // Initialize ambient animations
    initAmbientAnimations();
});

/**
 * Hero carousel functionality
 */
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicators button');
    const prevButton = document.querySelector('.carousel-control.prev');
    const nextButton = document.querySelector('.carousel-control.next');
    
    let currentSlide = 0;
    let slideInterval;
    
    // Start automatic slideshow
    startSlideshow();
    
    // Add event listeners for controls
    prevButton.addEventListener('click', showPreviousSlide);
    nextButton.addEventListener('click', showNextSlide);
    
    // Add event listeners for indicators
    indicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            const slideIndex = parseInt(this.dataset.slide);
            showSlide(slideIndex);
        });
    });
    
    // Pause slideshow on hover
    const carousel = document.querySelector('.hero-carousel');
    carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
    carousel.addEventListener('mouseleave', () => startSlideshow());
    
    function showSlide(index) {
        // Update slides
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
        
        // Update indicators
        indicators.forEach(indicator => indicator.classList.remove('active'));
        indicators[index].classList.add('active');
        
        currentSlide = index;
    }
    
    function showNextSlide() {
        let nextSlide = currentSlide + 1;
        if (nextSlide >= slides.length) {
            nextSlide = 0;
        }
        showSlide(nextSlide);
    }
    
    function showPreviousSlide() {
        let prevSlide = currentSlide - 1;
        if (prevSlide < 0) {
            prevSlide = slides.length - 1;
        }
        showSlide(prevSlide);
    }
    
    function startSlideshow() {
        clearInterval(slideInterval);
        slideInterval = setInterval(showNextSlide, 5000);
    }
}

/**
 * Trending products horizontal scroll
 */
function initTrendingScroll() {
    const scrollContainer = document.querySelector('.trending-scroll');
    const prevButton = document.querySelector('.trending-controls .prev');
    const nextButton = document.querySelector('.trending-controls .next');
    
    if (!scrollContainer || !prevButton || !nextButton) return;
    
    // Calculate the scroll distance (one card width + gap)
    const card = document.querySelector('.trending-card');
    
    if (!card) return;
    
    const cardWidth = card.offsetWidth;
    const scrollDistance = cardWidth + 20; // card width + gap
    
    prevButton.addEventListener('click', () => {
        scrollContainer.scrollBy({
            left: -scrollDistance * 3,
            behavior: 'smooth'
        });
    });
    
    nextButton.addEventListener('click', () => {
        scrollContainer.scrollBy({
            left: scrollDistance * 3,
            behavior: 'smooth'
        });
    });
    
    // Add drag-to-scroll functionality for mobile
    let isDown = false;
    let startX;
    let scrollLeft;
    
    scrollContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        scrollContainer.style.cursor = 'grabbing';
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
    });
    
    scrollContainer.addEventListener('mouseleave', () => {
        isDown = false;
        scrollContainer.style.cursor = 'grab';
    });
    
    scrollContainer.addEventListener('mouseup', () => {
        isDown = false;
        scrollContainer.style.cursor = 'grab';
    });
    
    scrollContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainer.scrollLeft = scrollLeft - walk;
    });
}

/**
 * Countdown timer for deal of the day
 */
function initCountdownTimer() {
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (!hoursElement || !minutesElement || !secondsElement) return;
    
    // Set the countdown to end at midnight
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(23, 59, 59);
    
    updateCountdown();
    
    // Update every second
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    function updateCountdown() {
        const now = new Date();
        const diff = midnight - now;
        
        if (diff <= 0) {
            clearInterval(countdownInterval);
            return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
    }
}

/**
 * Search functionality
 */
function initSearch() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-close');
    const searchInput = document.querySelector('.search-form input');
    
    if (!searchToggle || !searchOverlay) return;
    
    searchToggle.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        if (searchInput) {
            setTimeout(() => searchInput.focus(), 300);
        }
    });
    
    if (searchClose) {
        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });
    }
    
    // Close search on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            searchOverlay.classList.remove('active');
        }
    });
}

/**
 * Back to top button
 */
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (!backToTopButton) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Initialize ambient animations for homepage elements
 */
function initAmbientAnimations() {
    // Add floating animation to category circles
    const categoryCircles = document.querySelectorAll('.category-circle');
    categoryCircles.forEach((circle, index) => {
        circle.style.animation = `floatAnimation ${3 + index % 2}s ease-in-out ${index * 0.2}s infinite alternate`;
    });
    
    // Add parallax effect to hero carousel
    const heroCarousel = document.querySelector('.hero-carousel');
    if (heroCarousel) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            if (scrolled < 600) { // Only apply effect when carousel is visible
                const slides = document.querySelectorAll('.carousel-slide');
                slides.forEach(slide => {
                    const background = slide.style.backgroundImage;
                    if (background) {
                        // Create parallax effect by moving background slower than scroll
                        slide.style.backgroundPositionY = `calc(50% + ${scrolled * 0.4}px)`;
                    }
                });
            }
        });
    }
    
    // Add subtle movement to trending cards on mouse move
    const trendingSection = document.querySelector('.trending-products');
    if (trendingSection) {
        const cards = trendingSection.querySelectorAll('.trending-card');
        
        trendingSection.addEventListener('mousemove', function(e) {
            const sectionRect = trendingSection.getBoundingClientRect();
            const sectionCenterX = sectionRect.left + sectionRect.width / 2;
            const sectionCenterY = sectionRect.top + sectionRect.height / 2;
            
            const moveX = (e.clientX - sectionCenterX) / sectionRect.width * 10;
            const moveY = (e.clientY - sectionCenterY) / sectionRect.height * 5;
            
            cards.forEach((card, index) => {
                // Create varied movement based on card position
                const factor = 1 - (index % 3) * 0.2;
                card.style.transform = `translateX(${moveX * factor}px) translateY(${moveY * factor}px)`;
            });
        });
        
        trendingSection.addEventListener('mouseleave', function() {
            cards.forEach(card => {
                card.style.transform = 'translateX(0) translateY(0)';
            });
        });
    }
}
