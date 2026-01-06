// ============================================
// The Velvet Lounge - Interactive Features
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initBookingForm();
    initGallery();
    initScrollEffects();
    initNavigation();
});

// ============================================
// Booking Form
// ============================================

const packagePrices = {
    hourly: 150,
    halfday: 550,
    fullday: 950,
    vip: 1500
};

const packageNames = {
    hourly: 'Hourly Rate',
    halfday: 'Half-Day Package',
    fullday: 'Full-Day Package',
    vip: 'VIP Premium Experience'
};

function initBookingForm() {
    const form = document.getElementById('bookingForm');
    const packageSelect = document.getElementById('package');
    const guestCount = document.getElementById('guestCount');
    const eventDate = document.getElementById('eventDate');

    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    eventDate.min = tomorrow.toISOString().split('T')[0];

    // Update price summary when inputs change
    packageSelect.addEventListener('change', updatePriceSummary);
    guestCount.addEventListener('input', updatePriceSummary);

    // Form submission
    form.addEventListener('submit', handleFormSubmit);
}

function updatePriceSummary() {
    const packageSelect = document.getElementById('package');
    const guestCount = document.getElementById('guestCount');

    const summaryPackage = document.getElementById('summaryPackage');
    const summaryGuests = document.getElementById('summaryGuests');
    const summaryTotal = document.getElementById('summaryTotal');

    const selectedPackage = packageSelect.value;
    const guests = parseInt(guestCount.value) || 0;

    if (selectedPackage && guests > 0) {
        summaryPackage.textContent = packageNames[selectedPackage];
        summaryGuests.textContent = guests;

        let basePrice = packagePrices[selectedPackage];

        // Add guest fee for large parties (over 50 guests)
        let totalPrice = basePrice;
        if (guests > 50) {
            const extraGuests = guests - 50;
            totalPrice += extraGuests * 25; // $25 per extra guest
        }

        summaryTotal.textContent = '$' + totalPrice.toLocaleString();
    } else {
        summaryPackage.textContent = '-';
        summaryGuests.textContent = '-';
        summaryTotal.textContent = '$0';
    }
}

function selectPackage(packageType, price) {
    const packageSelect = document.getElementById('package');
    packageSelect.value = packageType;
    updatePriceSummary();
    scrollToBooking();
}

function handleFormSubmit(e) {
    e.preventDefault();

    // Validate form
    if (!e.target.checkValidity()) {
        alert('Please fill in all required fields.');
        return;
    }

    // Get form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Generate confirmation number
    const confirmationNumber = 'VL' + Date.now().toString().slice(-8);

    // Show confirmation modal
    showConfirmationModal(confirmationNumber, data);

    // Reset form
    e.target.reset();
    updatePriceSummary();
}

function showConfirmationModal(confirmationNumber, bookingData) {
    const modal = document.getElementById('confirmationModal');
    const confirmNumberEl = document.getElementById('confirmationNumber');

    confirmNumberEl.textContent = confirmationNumber;
    modal.classList.add('active');

    // Log booking data (in real app, would send to server)
    console.log('Booking submitted:', {
        confirmationNumber,
        ...bookingData,
        timestamp: new Date().toISOString()
    });

    // Send simulated email confirmation
    console.log('📧 Confirmation email sent to:', bookingData.email);
}

function closeModal() {
    const modal = document.getElementById('confirmationModal');
    modal.classList.remove('active');
}

// ============================================
// Gallery Lightbox
// ============================================

let currentImageIndex = 0;
const galleryImages = [
    'images/lounge-hero.png',
    'images/lounge-vip.png',
    'images/lounge-event.png',
    'images/amenities-bar.png'
];

function initGallery() {
    // Lightbox keyboard navigation
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                changeLightboxImage(-1);
            } else if (e.key === 'ArrowRight') {
                changeLightboxImage(1);
            }
        }
    });
}

function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    lightboxImg.src = galleryImages[index];
    lightbox.classList.add('active');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');

    // Restore body scroll
    document.body.style.overflow = '';
}

function changeLightboxImage(direction) {
    currentImageIndex += direction;

    // Loop around
    if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    } else if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    }

    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = galleryImages[currentImageIndex];
}

// ============================================
// Smooth Scrolling
// ============================================

function scrollToBooking() {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function scrollToGallery() {
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
        gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ============================================
// Navigation Effects
// ============================================

function initNavigation() {
    const nav = document.querySelector('.main-nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add shadow on scroll
        if (currentScroll > 100) {
            nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            nav.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
}

// ============================================
// Scroll Animations
// ============================================

function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements that should animate in
    const animatedElements = document.querySelectorAll(
        '.service-card, .pricing-card, .testimonial-card, .amenity-item'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ============================================
// Form Validation Helpers
// ============================================

// Phone number formatting
document.getElementById('phone')?.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
        if (value.length <= 3) {
            value = `(${value}`;
        } else if (value.length <= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
    }
    e.target.value = value;
});

// Email validation feedback
document.getElementById('email')?.addEventListener('blur', function (e) {
    const email = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
        e.target.style.borderColor = 'var(--rose-gold)';
    } else {
        e.target.style.borderColor = '';
    }
});

// ============================================
// Package Quick Select
// ============================================

// Allow clicking pricing cards to select package
document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('click', function (e) {
        // Only trigger if not clicking the button directly
        if (!e.target.classList.contains('pricing-btn')) {
            const btn = this.querySelector('.pricing-btn');
            if (btn) btn.click();
        }
    });
});

// ============================================
// Utility Functions
// ============================================

// Generate booking report (for debugging)
function generateBookingReport() {
    const form = document.getElementById('bookingForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    console.log('='.repeat(50));
    console.log('THE VELVET LOUNGE - BOOKING PREVIEW');
    console.log('='.repeat(50));
    console.log('Name:', data.fullName || 'Not specified');
    console.log('Email:', data.email || 'Not specified');
    console.log('Phone:', data.phone || 'Not specified');
    console.log('Event Date:', data.eventDate || 'Not specified');
    console.log('Event Time:', data.eventTime || 'Not specified');
    console.log('Package:', packageNames[data.package] || 'Not selected');
    console.log('Guests:', data.guestCount || '0');
    console.log('Event Type:', data.eventType || 'Not specified');
    console.log('='.repeat(50));
}

// Make utility functions available in console
window.generateBookingReport = generateBookingReport;
window.selectPackage = selectPackage;
window.scrollToBooking = scrollToBooking;
window.scrollToGallery = scrollToGallery;

// ============================================
// Console Welcome Message
// ============================================

console.log('%c✨ The Velvet Lounge', 'color: #d4af37; font-size: 24px; font-weight: bold;');
console.log('%cPremium Event Space Booking System', 'color: #b76e79; font-size: 14px;');
console.log('%c\nTip: Generate a booking preview with: generateBookingReport()', 'color: #b8bec8; font-size: 12px;');
