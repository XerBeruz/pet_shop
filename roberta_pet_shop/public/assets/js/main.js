import { Router } from './router.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Load Global Components
    await loadComponent('#header-container', '../src/components/header.html');
    await loadComponent('#footer-container', '../src/components/footer.html');

    // Initialize Router
    const router = new Router({});

    // Mobile Menu Toggle Logic
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
});

async function loadComponent(selector, path) {
    try {
        const response = await fetch(path);
        const html = await response.text();
        document.querySelector(selector).innerHTML = html;
    } catch (error) {
        console.error(`Error loading component ${path}:`, error);
    }
}
