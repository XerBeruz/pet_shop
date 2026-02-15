export class Router {
    constructor(routes) {
        this.routes = routes;
        this.app = document.getElementById('app');
        this.cache = {};

        window.addEventListener('popstate', () => this.loadRoute());

        document.addEventListener('click', e => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                this.navigateTo(e.target.href);
            }
        });

        this.loadRoute();
    }

    navigateTo(url) {
        history.pushState(null, null, url);
        this.loadRoute();
    }

    async loadRoute() {
        // Simple routing based on path
        const path = window.location.pathname.replace('/roberta_pet_shop/public', '') || '/';
        // Normalize for local dev if needed, typically strictly mapped:
        // Adjust logic to handle specific constraints if serving from nested folder

        // Let's assume root-relative for flexibility in this environment
        let relativePath = path;
        if (path.endsWith('/') || path.endsWith('/index.html')) relativePath = '/home';

        // Remove leading slash for matching, and handle potential prefix if not at root
        // A simple way to get the "page name" is to take the last segment
        const segments = relativePath.split('/').filter(Boolean);
        let routeKey = segments.length > 0 ? segments[segments.length - 1] : 'home';

        // Clean extension if present
        routeKey = routeKey.replace('.html', '');

        // Handle "roberta_pet_shop" or "public" appearing as the last segment by mistake if logic fails? 
        // No, let's just default to home if weird.
        if (['public', 'roberta_pet_shop'].includes(routeKey)) routeKey = 'home';

        const pagePath = `../src/pages/${routeKey}.html`;

        try {
            const response = await fetch(pagePath);
            if (!response.ok) throw new Error(`Page not found: ${pagePath}`);

            const html = await response.text();
            this.app.innerHTML = html;

            this.afterRender(routeKey);

        } catch (error) {
            console.error(error);
            this.app.innerHTML = '<h1>404 - Página no encontrada</h1><p>Intenta volver al <a href="/" data-link>Inicio</a></p>';
        }
    }

    afterRender(routeKey) {
        // Re-attach listeners or scripts specific to pages
        if (routeKey === 'home') {
            // Plans Carousel
            import('./carousel.js').then(module => {
                const carousel = new module.Carousel();
                carousel.init();
            });
            // Hero Image Carousel
            import('./hero-carousel.js').then(module => {
                const heroCarousel = new module.HeroCarousel();
                heroCarousel.init();
            });
        }

        // Close mobile menu if open
        document.querySelector('.nav-list')?.classList.remove('active');
    }
}
