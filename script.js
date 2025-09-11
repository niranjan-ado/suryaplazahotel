/**
 * ---
 * SURYA PLAZA HOTEL - SCRIPT.JS (FINAL PRODUCTION VERSION)
 * REVISED AND REFINED: 2025-09-11
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
    
    // REVISION: Moved the faqAccordionHandler to the correct scope, outside of mobileNavHandler.
    const faqAccordionHandler = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        if (faqItems.length === 0) return;

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            // Ensure both question and answer elements exist before adding listener
            if (question && answer) {
                question.addEventListener('click', () => {
                    const isActive = question.classList.contains('active');

                    question.classList.toggle('active');
                    if (question.classList.contains('active')) {
                        question.setAttribute('aria-expanded', 'true');
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    } else {
                        question.setAttribute('aria-expanded', 'false');
                        answer.style.maxHeight = null;
                    }
                });
            }
        });
    };

    const themeToggleHandler = () => {
        if (!themeToggleButton) return;
        const updateLogoForTheme = (theme) => {
            if (mainLogo) {
                const isDark = theme === 'dark-theme';
                mainLogo.src = isDark ? '/assets/images/logo-light.svg' : '/assets/images/logo-dark.svg';
            }
        };
        const applyTheme = (theme) => {
            document.documentElement.classList.toggle('dark-theme', theme === 'dark-theme');
            localStorage.setItem('theme', theme);
            const icon = themeToggleButton.querySelector('.material-icons-outlined');
            if (icon) {
                icon.textContent = theme === 'dark-theme' ? 'dark_mode' : 'light_mode';
            }
            updateLogoForTheme(theme);
        };
        const getInitialTheme = () => {
            const storedTheme = localStorage.getItem('theme');
            if (storedTheme) {
                return storedTheme;
            }
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            return prefersDark ? 'dark-theme' : 'light-theme';
        };
        const currentTheme = getInitialTheme();
        applyTheme(currentTheme);
        themeToggleButton.addEventListener('click', () => {
            const newTheme = document.documentElement.classList.contains('dark-theme') ? 'light-theme' : 'dark-theme';
            applyTheme(newTheme);
        });
    };

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

    const backToTopClickHandler = () => {
        if (!backToTopButton) return;
        backToTopButton.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    const updateFooterYear = () => {
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    };

    const paginationHandler = () => {
        const paginationLinks = document.querySelectorAll('.pagination a');
        if (paginationLinks.length === 0) return;
        paginationLinks.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                if (link.classList.contains('disabled') || link.classList.contains('current')) return;
                const currentLink = document.querySelector('.pagination a.current');
                if (currentLink) currentLink.classList.remove('current');
                link.classList.add('current');
            });
        });
    };

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

    const roomGalleryHandler = () => {
        const mainImage = document.getElementById('main-gallery-image');
        const thumbnails = document.querySelectorAll('.gallery-thumbnails img');
        if (!mainImage || thumbnails.length === 0) return;
        thumbnails[0].classList.add('active');
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', (e) => {
                const clickedThumb = e.target;
                if (mainImage.src === clickedThumb.src) return;
                mainImage.src = clickedThumb.src;
                mainImage.alt = clickedThumb.alt;
                thumbnails.forEach(t => t.classList.remove('active'));
                clickedThumb.classList.add('active');
            });
        });
    };

    const menuFilterHandler = () => {
        const filterButtons = document.querySelectorAll('.menu-filter [data-filter]');
        const menuContent = document.getElementById('menu-content');
        if (!filterButtons.length || !menuContent) return;
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filterValue = button.dataset.filter;
                menuContent.dataset.filterShow = filterValue;
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    };

    const stickyNavHandler = () => {
        const navLinks = document.querySelectorAll('.menu-category-nav a');
        const sections = document.querySelectorAll('.menu-section');
        if (!navLinks.length || !sections.length) return;
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const activeLink = document.querySelector(`.menu-category-nav a[href="#${id}"]`);
                    navLinks.forEach(link => link.classList.remove('active'));
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, { rootMargin: "-40% 0px -60% 0px" });
        sections.forEach(section => observer.observe(section));
    };

    const init = () => {
        mobileNavHandler();
        themeToggleHandler();
        unifiedScrollHandler();
        onScrollAnimationHandler();
        backToTopClickHandler();
        updateFooterYear();
        paginationHandler();
        contentToggleHandler();
        roomGalleryHandler();
        menuFilterHandler();
        stickyNavHandler();
        faqAccordionHandler();
    };

    init();
});