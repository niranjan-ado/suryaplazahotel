/**
 * ---
 * SURYA PLAZA HOTEL - SCRIPT.JS (FINAL PRODUCTION VERSION)
 * ---
 * This script manages all sitewide interactivity and user experience enhancements.
 *
 * Features:
 * 1. Advanced Mobile Drawer Menu: Includes focus trapping, focus return, and ESC key closing.
 * 2. Light/Dark Theme Toggle: Persists choice in localStorage and handles logo swapping.
 * 3. Unified Scroll Listener: Efficiently handles header changes and back-to-top button visibility.
 * 4. Performant On-Scroll Animations: Uses IntersectionObserver for smooth fade-in effects.
 * 5. Page-Specific Handlers: Includes logic for pagination and content toggles.
 * ---
 */

document.addEventListener("DOMContentLoaded", () => {

    // --- DOM Element Selectors ---
    const body = document.body;
    const header = document.querySelector('.main-header');
    const mainLogo = document.getElementById('main-logo');
    const hamburgerButton = document.getElementById('hamburger-button');
    const navMenu = document.getElementById('nav-links-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const themeToggleButton = document.getElementById('theme-toggle');
    const backToTopButton = document.getElementById('back-to-top-btn');
    const yearSpan = document.getElementById('year');
    const animatedElements = document.querySelectorAll('[data-animate]');

    /**
     * 1. Handles the advanced mobile navigation with full accessibility support.
     */
    const mobileNavHandler = () => {
        if (!hamburgerButton || !navMenu || !mobileMenuOverlay) return;
        
        const focusableElements = navMenu.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])');
        const firstFocusableEl = focusableElements[0];
        const lastFocusableEl = focusableElements[focusableElements.length - 1];

        const toggleMenu = (forceState = null) => {
            const isActive = forceState !== null ? forceState : !navMenu.classList.contains('active');
            
            navMenu.classList.toggle('active', isActive);
            mobileMenuOverlay.classList.toggle('active', isActive);
            hamburgerButton.setAttribute('aria-expanded', isActive);
            body.classList.toggle('no-scroll', isActive);
            hamburgerButton.classList.toggle('is-open', isActive);

            if (isActive) {
                setTimeout(() => firstFocusableEl.focus(), 100);
            } else {
                hamburgerButton.focus();
            }
        };

        const handleFocusTrap = (e) => {
            if (e.key !== 'Tab' || !navMenu.classList.contains('active')) return;
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableEl) {
                    lastFocusableEl.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableEl) {
                    firstFocusableEl.focus();
                    e.preventDefault();
                }
            }
        };

        hamburgerButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        mobileMenuOverlay.addEventListener('click', () => toggleMenu(false));
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                toggleMenu(false);
            }
            handleFocusTrap(e);
        });
    };

    /**
     * 2. Manages the light/dark theme toggle.
     */
    const themeToggleHandler = () => {
        if (!themeToggleButton) return;

        const applyTheme = (theme) => {
            document.documentElement.classList.toggle('dark-theme', theme === 'dark-theme');
            localStorage.setItem('theme', theme);
            
            const icon = themeToggleButton.querySelector('.material-icons-outlined');
            if (icon) {
                icon.textContent = theme === 'dark-theme' ? 'dark_mode' : 'light_mode';
            }
            
            if (mainLogo) {
                // REVISED: Use absolute paths for robust logo swapping
                const isDark = theme === 'dark-theme';
                mainLogo.src = isDark ? '/assets/images/logo-light.svg' : '/assets/images/logo-dark.svg';
            }
        };

        const currentTheme = localStorage.getItem('theme') || 'light-theme';
        applyTheme(currentTheme);

        themeToggleButton.addEventListener('click', () => {
            const newTheme = document.documentElement.classList.contains('dark-theme') ? 'light-theme' : 'dark-theme';
            applyTheme(newTheme);
        });
    };

    /**
     * 3. Manages all effects that happen on scroll.
     */
    const unifiedScrollHandler = () => {
        if (!header && !backToTopButton) return;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            if (header) {
                header.classList.toggle('scrolled', scrollY > 50);
            }
            if (backToTopButton) {
                backToTopButton.classList.toggle('visible', scrollY > 300);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    /**
     * 4. Uses IntersectionObserver for on-scroll animations.
     */
    const onScrollAnimationHandler = () => {
        if (animatedElements.length === 0) return;
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observerInstance.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        animatedElements.forEach(el => observer.observe(el));
    };
    
    /**
     * 5. Handles the 'Back to Top' button click.
     */
    const backToTopClickHandler = () => {
        if (!backToTopButton) return;
        backToTopButton.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    /**
     * 6. Updates the year in the footer.
     */
    const updateFooterYear = () => {
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    };

    /**
     * 7. Handles placeholder pagination functionality.
     */
    const paginationHandler = () => {
        const paginationLinks = document.querySelectorAll('.pagination a');
        if (paginationLinks.length === 0) return;

        paginationLinks.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                if (link.classList.contains('disabled') || link.classList.contains('current')) return;
                
                const currentLink = document.querySelector('.pagination a.current');
                if(currentLink) currentLink.classList.remove('current');
                link.classList.add('current');
            });
        });
    };

    /**
     * 8. Handles generic content toggles (e.g., for Tariff page).
     */
    const contentToggleHandler = () => {
        const toggles = document.querySelectorAll('.content-toggle');
        if (toggles.length === 0) return;

        toggles.forEach(toggle => {
            const buttons = toggle.querySelectorAll('button[data-toggle-target]');
            buttons.forEach(button => {
                const targetElement = document.querySelector(button.dataset.toggleTarget);
                if (!targetElement) return;

                button.addEventListener('click', () => {
                    buttons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    const toggleClass = button.dataset.toggleClass;
                    if (button.textContent.toLowerCase().includes('double')) {
                        targetElement.classList.add(toggleClass);
                    } else {
                        targetElement.classList.remove(toggleClass);
                    }
                });
            });
        });
    };

    /**
     * --- Initialize All Functions ---
     */
    const init = () => {
        // Core functionality for every page
        mobileNavHandler();
        themeToggleHandler();
        unifiedScrollHandler();
        onScrollAnimationHandler();
        backToTopClickHandler();
        updateFooterYear();

        // Page-specific functionality
        paginationHandler();
        contentToggleHandler();
    };

    // Run the initialization
    init();
});