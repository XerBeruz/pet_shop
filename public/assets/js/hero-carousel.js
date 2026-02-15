export class HeroCarousel {
    constructor() {
        this.slides = [];
        this.currentIndex = 0;
        this.interval = null;
        // Using placeholder images for demonstration
        this.images = [
            'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1920&auto=format&fit=crop', // Dog playing
            'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=1920&auto=format&fit=crop', // Dog grooming/spa vibe
            'https://images.unsplash.com/photo-1583336663277-620dc1996580?q=80&w=1920&auto=format&fit=crop'  // Dog portrait
        ];
    }

    init() {
        const container = document.querySelector('.hero-slider');
        if (!container) return;

        // Inject images
        this.images.forEach((src, index) => {
            const slide = document.createElement('div');
            slide.className = `hero-slide ${index === 0 ? 'active' : ''}`;
            slide.style.backgroundImage = `url('${src}')`;
            container.appendChild(slide);
        });

        this.slides = document.querySelectorAll('.hero-slide');
        this.startAutoplay();
    }

    startAutoplay() {
        this.interval = setInterval(() => {
            this.nextSlide();
        }, 5000); // 5 seconds per slide
    }

    nextSlide() {
        // Remove active from current
        this.slides[this.currentIndex].classList.remove('active');

        // Calculate next
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;

        // Add active to next
        this.slides[this.currentIndex].classList.add('active');
    }

    stop() {
        clearInterval(this.interval);
    }
}
