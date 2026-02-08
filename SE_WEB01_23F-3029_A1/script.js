// ========================================
// AETHER VOYAGES - Mission Control System
// ========================================

// PHASE 2: Planet Database
const PlanetData = {
    'MARS': {
        temperature: -63,
        duration: '7 Months',
        distance: '225M km'
    },
    'EUROPA': {
        temperature: -160,
        duration: '3 Years',
        distance: '628M km'
    },
    'TITAN': {
        temperature: -179,
        duration: '7 Years',
        distance: '1.4B km'
    }
};

// Mission Status Banner Management
const MissionControl = {
    // Initialize the system
    init() {
        this.createBanner();
        this.loadSavedMission();
        this.attachEventListeners();
        this.attachPaymentValidation();
    },

    // Create mission status banner element
    createBanner() {
        // Check if banner already exists
        if (document.querySelector('.mission-banner')) return;

        const banner = document.createElement('div');
        banner.className = 'mission-banner';
        banner.id = 'mission-banner';
        banner.style.display = 'none'; // Hidden by default

        document.body.insertBefore(banner, document.body.firstChild);
    },

    // PHASE 2: Evaluate environmental conditions
    evaluateEnvironment(planet) {
        const data = PlanetData[planet];

        if (!data) return '';

        // Rule-based logic: Extreme cold warning
        if (data.temperature < -150) {
            return `
                <div class="env-warning extreme">
                    <span class="warning-indicator">!</span>
                    <div class="warning-content">
                        <strong>EXTREME ENVIRONMENT</strong>
                        <span class="warning-detail">Special Suit Required • ${data.temperature}°C</span>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="env-warning standard">
                    <span class="warning-indicator">✓</span>
                    <div class="warning-content">
                        <strong>STANDARD MISSION CONDITIONS</strong>
                        <span class="warning-detail">Temperature: ${data.temperature}°C</span>
                    </div>
                </div>
            `;
        }
    },

    // Display mission status banner
    showBanner(destination) {
        const banner = document.getElementById('mission-banner');
        if (!banner) return;

        const envWarning = this.evaluateEnvironment(destination);

        banner.innerHTML = `
            <div class="banner-content">
                <div class="banner-main">
                    <div class="banner-icon-wrapper">
                        <div class="rocket-icon"></div>
                    </div>
                    <div class="banner-info">
                        <span class="banner-label">MISSION TARGET LOCKED</span>
                        <span class="banner-destination">${destination}</span>
                    </div>
                </div>
                <button class="banner-close" onclick="MissionControl.clearMission()">
                    <span class="close-icon">×</span>
                </button>
            </div>
            ${envWarning}
        `;

        banner.style.display = 'block';

        // Add animation
        banner.classList.add('banner-slide-in');
    },

    // Hide mission banner
    hideBanner() {
        const banner = document.getElementById('mission-banner');
        if (banner) {
            banner.style.display = 'none';
        }
    },

    // Save destination to localStorage
    saveDestination(planet) {
        localStorage.setItem('destination', planet);
        console.log(`Mission saved: ${planet}`);
    },

    // Load saved mission from localStorage
    loadSavedMission() {
        const savedDestination = localStorage.getItem('destination');

        if (savedDestination) {
            this.showBanner(savedDestination);
            console.log(`Mission restored: ${savedDestination}`);
        }
    },

    // Clear mission (remove from storage and hide banner)
    clearMission() {
        localStorage.removeItem('destination');
        this.hideBanner();
        console.log('Mission cleared');
    },

    // Attach event listeners to all "Book Ticket" buttons
    attachEventListeners() {
        const bookButtons = document.querySelectorAll('.book-button');

        bookButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent form submission

                // Find the planet name from the card
                const card = button.closest('.card-container');
                const planetName = card.querySelector('.planet-name').textContent.trim();

                // Save and display with environmental check
                this.saveDestination(planetName);
                this.showBanner(planetName);

                // Scroll to payment section
                this.scrollToPayment();
            });
        });

        console.log(`Event listeners attached to ${bookButtons.length} buttons`);
    },

    // Scroll to payment section smoothly
    scrollToPayment() {
        const paymentSection = document.querySelector('.payment-section');
        if (paymentSection) {
            paymentSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    // PHASE 3: Payment Form Validation
    attachPaymentValidation() {
        const form = document.querySelector('.payment-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validatePaymentForm();
        });

        console.log('Payment validation attached');
    },

    // Validate entire payment form
    validatePaymentForm() {
        // FIRST: Check if destination is selected
        const selectedDestination = localStorage.getItem('destination');

        if (!selectedDestination) {
            // Show error if no destination selected
            this.showDestinationError();
            return;
        }

        const cardNumber = document.getElementById('card-number').value;
        const cardName = document.getElementById('card-name').value;
        const expiry = document.getElementById('expiry').value;
        const cvv = document.getElementById('cvv').value;

        // Clear previous errors
        this.clearErrors();

        let isValid = true;

        // Validate Card Number (16 digits, numbers only)
        if (!this.validateCardNumber(cardNumber)) {
            this.showError('card-number', 'Card number must be exactly 16 digits');
            isValid = false;
        }

        // Validate Cardholder Name (not empty)
        if (!this.validateName(cardName)) {
            this.showError('card-name', 'Cardholder name is required');
            isValid = false;
        }

        // Validate Expiry Date (not in past)
        if (!this.validateExpiry(expiry)) {
            this.showError('expiry', 'Card has expired or invalid format (MM/YY)');
            isValid = false;
        }

        // Validate CVV (3 digits)
        if (!this.validateCVV(cvv)) {
            this.showError('cvv', 'CVV must be 3 digits');
            isValid = false;
        }

        // If all valid, show success
        if (isValid) {
            this.showSuccessMessage();
        }
    },

    // Show error when no destination is selected
    showDestinationError() {
        const paymentSection = document.querySelector('.payment-section');

        // Remove any existing error
        const existingError = document.querySelector('.destination-error');
        if (existingError) {
            existingError.remove();
        }

        const errorNotification = document.createElement('div');
        errorNotification.className = 'destination-error';
        errorNotification.innerHTML = `
            <div class="destination-error-content">
                <span class="error-icon">⚠</span>
                <div class="error-text">
                    <strong>No Destination Selected</strong>
                    <p>Please select a destination from the cards above before proceeding with payment.</p>
                </div>
            </div>
        `;

        paymentSection.insertBefore(errorNotification, paymentSection.firstChild);

        // Scroll to destinations section
        const destinationsSection = document.querySelector('.destinations-section');
        if (destinationsSection) {
            destinationsSection.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }

        // Remove notification after 5 seconds
        setTimeout(() => {
            errorNotification.remove();
        }, 5000);
    },

    // Validate card number: exactly 16 digits
    validateCardNumber(cardNumber) {
        const cleaned = cardNumber.replace(/\s/g, ''); // Remove spaces
        return /^\d{16}$/.test(cleaned);
    },

    // Validate name: not empty
    validateName(name) {
        return name.trim().length > 0;
    },

    // Validate expiry: MM/YY format and not in past
    validateExpiry(expiry) {
        if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;

        const [month, year] = expiry.split('/').map(Number);

        // Check valid month
        if (month < 1 || month > 12) return false;

        // Get current date
        const now = new Date();
        const currentYear = now.getFullYear() % 100; // Last 2 digits
        const currentMonth = now.getMonth() + 1;

        // Check if expired
        if (year < currentYear) return false;
        if (year === currentYear && month < currentMonth) return false;

        return true;
    },

    // Validate CVV: exactly 3 digits
    validateCVV(cvv) {
        return /^\d{3}$/.test(cvv);
    },

    // Show inline error message
    showError(inputId, message) {
        const input = document.getElementById(inputId);
        const inputGroup = input.closest('.input-group');

        // Create error element
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;

        // Add error styling to input
        input.classList.add('input-error');

        // Append error message
        inputGroup.appendChild(error);
    },

    // Clear all error messages
    clearErrors() {
        const errors = document.querySelectorAll('.error-message');
        errors.forEach(error => error.remove());

        const errorInputs = document.querySelectorAll('.input-error');
        errorInputs.forEach(input => input.classList.remove('input-error'));
    },

    // Show success message
    showSuccessMessage() {
        const form = document.querySelector('.payment-form');

        // Create success message
        const success = document.createElement('div');
        success.className = 'success-message';
        success.id = 'success-container';
        success.innerHTML = `
            <div class="success-content">
                <span class="success-icon"></span>
                <h3>Mission Approved!</h3>
                <p>Preparing for Launch...</p>
                <div id="countdown-display" class="countdown-display"></div>
                <button id="abort-button" class="abort-button" style="display: none;">ABORT MISSION</button>
            </div>
        `;

        // Insert after form
        form.parentNode.insertBefore(success, form.nextSibling);

        // Hide form
        form.style.display = 'none';

        console.log('Mission approved! Payment validated.');

        // PHASE 4: Start countdown after 2 seconds
        setTimeout(() => {
            this.startCountdown();
        }, 2000);
    },

    // PHASE 4: Countdown Timer
    countdownInterval: null,

    startCountdown() {
        const countdownDisplay = document.getElementById('countdown-display');
        const abortButton = document.getElementById('abort-button');

        if (!countdownDisplay) return;

        let count = 5;

        // Show abort button
        abortButton.style.display = 'inline-block';

        // Attach abort handler
        abortButton.onclick = () => this.abortMission();

        // Display initial countdown
        countdownDisplay.innerHTML = `<h2 class="countdown-text">Launching in <span class="countdown-number">${count}</span>...</h2>`;

        // Start countdown interval
        this.countdownInterval = setInterval(() => {
            count--;

            if (count > 0) {
                countdownDisplay.innerHTML = `<h2 class="countdown-text">Launching in <span class="countdown-number">${count}</span>...</h2>`;
            } else if (count === 0) {
                countdownDisplay.innerHTML = `<h2 class="countdown-text">Launching in <span class="countdown-number">0</span>...</h2>`;
            } else {
                // Countdown complete - Liftoff!
                clearInterval(this.countdownInterval);
                this.showLiftoff();
            }
        }, 1000);

        console.log('Countdown started');
    },

    showLiftoff() {
        const countdownDisplay = document.getElementById('countdown-display');
        const abortButton = document.getElementById('abort-button');

        if (!countdownDisplay) return;

        // Hide abort button
        abortButton.style.display = 'none';

        // Show liftoff message
        countdownDisplay.innerHTML = `
            <h2 class="liftoff-text"> LIFTOFF SUCCESSFUL! </h2>
            <p class="liftoff-subtext">Your journey to the stars has begun...</p>
        `;

        console.log('🚀 Liftoff successful!');
    },

    abortMission() {
        // Stop countdown
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }

        // Clear localStorage
        localStorage.removeItem('destination');

        // Hide banner
        this.hideBanner();

        // Remove success message
        const successContainer = document.getElementById('success-container');
        if (successContainer) {
            successContainer.remove();
        }

        // Show form again
        const form = document.querySelector('.payment-form');
        if (form) {
            form.style.display = 'block';
            form.reset();
        }

        // Clear any errors
        this.clearErrors();

        console.log('Mission aborted! System reset.');

        // Show abort notification
        this.showAbortNotification();
    },

    showAbortNotification() {
        const paymentSection = document.querySelector('.payment-section');

        const notification = document.createElement('div');
        notification.className = 'abort-notification';
        notification.innerHTML = `
            <div class="abort-content">
                <span class="abort-icon">⚠️</span>
                <p><strong>Mission Aborted</strong></p>
                <p>All systems reset. You may start a new mission.</p>
            </div>
        `;

        paymentSection.insertBefore(notification, paymentSection.firstChild);

        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
};

// Initialize Mission Control when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('AETHER VOYAGES Mission Control System Online');
    MissionControl.init();
});

