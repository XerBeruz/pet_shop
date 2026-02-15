export class Carousel {
    constructor() {
        this.track = null;
        this.cards = [];
        this.currentIndex = 0;
        this.interval = null;
        this.isPlaying = true;

        // Data for the plans
        this.plans = [
            {
                name: "DIAMANTE",
                focus: "Para todo tipo de raza",
                price: "$57.000 - $110.000",
                features: [
                    "Masaje relajante",
                    "Shampoo desmugrante e hidratante",
                    "Mascarilla",
                    "Corte y limado de uñas",
                    "Limpieza oídos/dental",
                    "Hidratación huellas",
                    "Perfume, Corbatín/Accesorios",
                    "Snack y Foto"
                ]
            },
            {
                name: "DIAMANTE PREMIUM",
                focus: "Experiencia de lujo (Hidratación Capilar)",
                price: "$62.000 - $125.000",
                features: [
                    "Aromaterapia",
                    "Shampoo según color",
                    "Hidratación huellas y nariz",
                    "Secado automático",
                    "Perfume alta duración",
                    "Pañoleta de lujo",
                    "Kit snacks amigos"
                ]
            },
            {
                name: "REINA KERATINA",
                focus: "Solo manto largo",
                price: "$74.000 - $89.000",
                features: [
                    "Keratina mascarilla reparadora",
                    "Spray alisante",
                    "Shampoo según color",
                    "Hidratación completa",
                    "Secado automático",
                    "Pañoleta de lujo"
                ]
            }
        ];
    }

    async init() {
        this.track = document.querySelector('.carousel-track');
        if (!this.track) return;

        // Render Cards
        await this.renderCards();

        // Render Navigation (Arrows/Dots)
        this.renderNavigation();

        // Init state
        this.updatePosition();
        this.startAutoplay();
        this.addEventListeners();
    }

    async renderCards() {
        // Fetch the template
        let templateHtml = '';
        try {
            const response = await fetch('../src/components/card-plan.html');
            templateHtml = await response.text();
        } catch (error) {
            console.error('Error loading card template:', error);
            return;
        }

        // Generate HTML for each plan
        const cardsHtml = this.plans.map(plan => {
            const featuresHtml = plan.features.map(f => `<li>${f}</li>`).join('');

            return templateHtml
                .replace(/{{name}}/g, plan.name)
                .replace('{{focus}}', plan.focus)
                .replace('{{price}}', plan.price)
                .replace('{{features}}', featuresHtml);
        }).join('');

        this.track.innerHTML = cardsHtml;
        this.cards = document.querySelectorAll('.plan-card');
    }

    renderNavigation() {
        const container = document.querySelector('.carousel-container');

        // Arrows
        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-arrow prev';
        prevBtn.innerHTML = '&#10094;'; // <
        prevBtn.onclick = () => this.prevSlide();

        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-arrow next';
        nextBtn.innerHTML = '&#10095;'; // >
        nextBtn.onclick = () => this.nextSlide();

        container.appendChild(prevBtn);
        container.appendChild(nextBtn);

        // Dots
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'carousel-dots';

        this.plans.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.onclick = () => this.goToSlide(index);
            dotsContainer.appendChild(dot);
        });

        container.appendChild(dotsContainer);

        this.dots = document.querySelectorAll('.carousel-dot');
    }

    startAutoplay() {
        // Only autoplay if we haven't interacted yet? 
        // Or pause on interaction.
        this.stopAutoplay(); // clear existing

        this.interval = setInterval(() => {
            if (window.innerWidth >= 768) return;
            this.nextSlide(true); // true = auto
        }, 4000);
    }

    stopAutoplay() {
        if (this.interval) clearInterval(this.interval);
    }

    prevSlide() {
        this.stopAutoplay();
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.cards.length - 1;
        }
        this.updatePosition();
    }

    nextSlide(isAuto = false) {
        if (!isAuto) this.stopAutoplay();

        this.currentIndex++;
        if (this.currentIndex >= this.cards.length) {
            this.currentIndex = 0;
        }
        this.updatePosition();
    }

    goToSlide(index) {
        this.stopAutoplay();
        this.currentIndex = index;
        this.updatePosition();
    }

    updatePosition() {
        // Reset Flips: Close any open card when moving
        this.cards.forEach(card => card.classList.remove('flipped'));

        // Update Dots
        if (this.dots) {
            this.dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === this.currentIndex);
            });
        }

        if (window.innerWidth < 768) {
            // Mobile: Slide by width
            // Since we removed container padding and plan-card is min-width 100%,
            // we can trust the track width / card width relationship.
            // Using offsetWidth of the card itself is safest.
            const firstCard = this.cards[0];
            const slideWidth = firstCard ? firstCard.clientWidth : this.track.parentElement.clientWidth;

            const moveAmount = this.currentIndex * slideWidth;
            this.track.style.transform = `translateX(-${moveAmount}px)`;
        } else {
            // Desktop: Reset to default flow
            this.track.style.transform = 'translateX(0)';
        }
    }

    addEventListeners() {
        // Touch / Swipe Support
        let startX = 0;
        let endX = 0;
        let startY = 0;
        let endY = 0;

        this.track.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            this.stopAutoplay();
        }, { passive: true });

        this.track.addEventListener('touchmove', e => {
            endX = e.touches[0].clientX;
            endY = e.touches[0].clientY;
        }, { passive: true });

        this.track.addEventListener('touchend', () => {
            if (!startX || !endX) {
                // It was a tap (no move detected or very small)
                // Reset and return
                startX = 0; endX = 0;
                return;
            }

            // Calculate distances
            const diffX = startX - endX;
            const diffY = startY - endY;

            // Horizontal swipe detection (threshold 50px)
            // Also ensure it's more horizontal than vertical scrolling
            if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) {
                    this.nextSlide(); // Swipe Left (dragged left)
                } else {
                    this.prevSlide(); // Swipe Right (dragged right)
                }
            }

            // Reset
            startX = 0;
            endX = 0;
        });

        // Resize reset - Debounce or check only width change to avoid mobile bar glitches
        let lastWidth = window.innerWidth;
        window.addEventListener('resize', () => {
            if (window.innerWidth !== lastWidth) {
                lastWidth = window.innerWidth;
                this.updatePosition();
            }
        });
    }
}
