/**
 * Product Recommendation Quiz for TechDeals Hub
 * Helps users find products that match their needs
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeQuiz();
});

function initializeQuiz() {
    // Find quiz container
    const quizContainer = document.querySelector('.product-quiz');
    if (!quizContainer) return;
    
    // Get quiz elements
    const startButton = quizContainer.querySelector('.quiz-start');
    const quizContent = quizContainer.querySelector('.quiz-content');
    const quizResult = quizContainer.querySelector('.quiz-result');
    
    // Initialize variables
    let currentQuestion = 0;
    let userResponses = {};
    const questions = [
        {
            id: 'budget',
            text: 'What is your budget range?',
            options: [
                { value: 'budget', text: 'Under ₹15,000' },
                { value: 'midrange', text: '₹15,000 - ₹50,000' },
                { value: 'premium', text: 'Above ₹50,000' }
            ]
        },
        {
            id: 'primary_use',
            text: 'What will you primarily use this for?',
            options: [
                { value: 'work', text: 'Work & Productivity' },
                { value: 'entertainment', text: 'Entertainment & Media' },
                { value: 'gaming', text: 'Gaming' },
                { value: 'casual', text: 'Casual Everyday Use' }
            ]
        },
        {
            id: 'brand_preference',
            text: 'Do you have a brand preference?',
            options: [
                { value: 'apple', text: 'Apple' },
                { value: 'samsung', text: 'Samsung' },
                { value: 'sony', text: 'Sony' },
                { value: 'others', text: 'Others' },
                { value: 'no_preference', text: 'No Preference' }
            ]
        }
    ];
    
    // Start quiz when button is clicked
    if (startButton) {
        startButton.addEventListener('click', function() {
            startButton.style.display = 'none';
            showQuestion(currentQuestion);
        });
    }
    
    // Show question function
    function showQuestion(index) {
        // Clear previous content
        quizContent.innerHTML = '';
        
        if (index >= questions.length) {
            // Show results
            showResults();
            return;
        }
        
        const question = questions[index];
        
        // Create question element
        const questionElement = document.createElement('div');
        questionElement.className = 'quiz-question';
        questionElement.innerHTML = `
            <h3>${question.text}</h3>
            <div class="quiz-options"></div>
            <div class="quiz-navigation">
                ${index > 0 ? '<button class="btn-previous">Previous</button>' : ''}
                <button class="btn-next" ${index === questions.length - 1 ? 'data-final="true"' : ''}>
                    ${index === questions.length - 1 ? 'See Results' : 'Next'}
                </button>
            </div>
        `;
        
        quizContent.appendChild(questionElement);
        
        // Add options
        const optionsContainer = questionElement.querySelector('.quiz-options');
        question.options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'quiz-option';
            optionElement.innerHTML = `
                <input type="radio" name="${question.id}" value="${option.value}" id="${question.id}_${option.value}">
                <label for="${question.id}_${option.value}">${option.text}</label>
            `;
            optionsContainer.appendChild(optionElement);
            
            // Check if user has already answered this question
            if (userResponses[question.id] === option.value) {
                optionElement.querySelector('input').checked = true;
            }
        });
        
        // Add event listeners for navigation
        const nextButton = questionElement.querySelector('.btn-next');
        if (nextButton) {
            nextButton.addEventListener('click', function() {
                // Get selected option
                const selectedOption = questionElement.querySelector(`input[name="${question.id}"]:checked`);
                if (!selectedOption) {
                    alert('Please select an option to continue.');
                    return;
                }
                
                // Save response
                userResponses[question.id] = selectedOption.value;
                
                // Move to next question or show results
                if (this.getAttribute('data-final') === 'true') {
                    showResults();
                } else {
                    currentQuestion++;
                    showQuestion(currentQuestion);
                }
            });
        }
        
        // Previous button
        const prevButton = questionElement.querySelector('.btn-previous');
        if (prevButton) {
            prevButton.addEventListener('click', function() {
                currentQuestion--;
                showQuestion(currentQuestion);
            });
        }
    }
    
    // Show results function
    function showResults() {
        quizContent.style.display = 'none';
        quizResult.style.display = 'block';
        
        // Logic to determine recommendations based on responses
        const recommendations = determineRecommendations(userResponses);
        
        // Display recommendations
        quizResult.innerHTML = `
            <h3>Your Personalized Recommendations</h3>
            <div class="recommendation-products">
                ${recommendations.map(product => `
                    <div class="recommendation-card">
                        <div class="rec-image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="rec-details">
                            <h4>${product.name}</h4>
                            <div class="rec-price">₹${product.price.toLocaleString('en-IN')}</div>
                            <a href="${product.link}" class="btn btn-primary" target="_blank">View on Amazon</a>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn btn-secondary restart-quiz">Start Over</button>
        `;
        
        // Add restart functionality
        const restartButton = quizResult.querySelector('.restart-quiz');
        if (restartButton) {
            restartButton.addEventListener('click', function() {
                currentQuestion = 0;
                userResponses = {};
                quizResult.style.display = 'none';
                quizContent.style.display = 'block';
                showQuestion(currentQuestion);
            });
        }
    }
    
    // Determine recommendations based on user responses
    function determineRecommendations(responses) {
        let recommendations = [];
        
        // Example logic - would be more sophisticated in production
        if (responses.budget === 'premium' && responses.primary_use === 'work') {
            if (responses.brand_preference === 'apple') {
                recommendations.push({
                    name: 'MacBook Pro M2',
                    price: 129999,
                    image: 'img/products/macbook-pro-m2.jpg',
                    link: 'https://amzn.to/youraffiliatelink'
                });
            } else {
                recommendations.push({
                    name: 'Dell XPS 15',
                    price: 149999,
                    image: 'img/products/dell-xps-15.jpg',
                    link: 'https://amzn.to/youraffiliatelink'
                });
            }
        } else if (responses.budget === 'midrange' && responses.primary_use === 'entertainment') {
            recommendations.push({
                name: 'Samsung Galaxy Tab S7',
                price: 45999,
                image: 'img/products/samsung-galaxy-tab-s7.jpg',
                link: 'https://amzn.to/youraffiliatelink'
            });
        } else if (responses.budget === 'budget' && responses.primary_use === 'casual') {
            recommendations.push({
                name: 'Redmi Note 11',
                price: 13999,
                image: 'img/products/redmi-note-11.jpg',
                link: 'https://amzn.to/youraffiliatelink'
            });
        }
        
        // Add a few more recommendations based on category
        if (responses.primary_use === 'gaming') {
            recommendations.push({
                name: 'ASUS ROG Gaming Laptop',
                price: 89999,
                image: 'img/products/asus-rog.jpg',
                link: 'https://amzn.to/youraffiliatelink'
            });
        }
        
        return recommendations;
    }
}
