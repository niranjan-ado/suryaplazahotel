document.addEventListener("DOMContentLoaded", () => {
    'use strict';

    const body = document.body;
    const header = document.querySelector('.main-header');
    const hamburgerButton = document.getElementById('hamburger-button');
    const navMenu = document.getElementById('nav-links-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const themeToggleButton = document.getElementById('theme-toggle');
    const backToTopButton = document.getElementById('back-to-top-btn');
    const yearSpan = document.getElementById('year');
    const animatedElements = document.querySelectorAll('[data-animate]');
    const faqItems = document.querySelectorAll('.faq-item');

    let savedScrollPosition = 0;

    const toggleMenu = (forceState = null, isNavLinkClick = false) => {
        const isActive = forceState !== null ? forceState : !navMenu.classList.contains('active');
        
        navMenu.classList.toggle('active', isActive);
        mobileMenuOverlay.classList.toggle('active', isActive);
        hamburgerButton.setAttribute('aria-expanded', isActive);
        hamburgerButton.classList.toggle('is-open', isActive);

        if (isActive) {
            savedScrollPosition = window.scrollY;
            body.style.top = `-${savedScrollPosition}px`;
            body.classList.add('no-scroll');
        } else {
            body.classList.remove('no-scroll');
            body.style.top = '';
            if (!isNavLinkClick) {
                window.scrollTo(0, savedScrollPosition);
            }
        }
    };

    const mobileNavHandler = () => {
        if (!hamburgerButton || !navMenu) return;

        hamburgerButton.addEventListener('click', () => toggleMenu());
        mobileMenuOverlay.addEventListener('click', () => toggleMenu(false));
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                toggleMenu(false);
            }
        });
    };

    const faqAccordionHandler = () => {
        if (!faqItems.length) return;

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            if (question && answer) {
                question.addEventListener('click', () => {
                    const isActive = question.classList.contains('active');
                    question.classList.toggle('active');
                    question.setAttribute('aria-expanded', !isActive);
                    if (!isActive) {
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    } else {
                        answer.style.maxHeight = null;
                    }
                });
            }
        });
    };
    
    const themeToggleHandler = () => {
        if (!themeToggleButton) return;
        const mainLogo = document.getElementById('main-logo');
        const applyTheme = (theme) => {
            document.documentElement.classList.toggle('dark-theme', theme === 'dark-theme');
            localStorage.setItem('theme', theme);
            if (mainLogo) {
                mainLogo.src = theme === 'dark-theme' ? '/assets/images/logo-light.svg' : '/assets/images/logo-dark.svg';
            }
            if (themeToggleButton) {
                const newLabel = theme === 'dark-theme' ? 'Activate light theme' : 'Activate dark theme';
                themeToggleButton.setAttribute('aria-label', newLabel);
            }
        };
        const storedTheme = localStorage.getItem('theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-theme' : 'light-theme';
        applyTheme(storedTheme || systemTheme);
        themeToggleButton.addEventListener('click', () => {
            const newTheme = document.documentElement.classList.contains('dark-theme') ? 'light-theme' : 'dark-theme';
            applyTheme(newTheme);
        });
    };

    const scrollDependentHandler = () => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            if (header) header.classList.toggle('scrolled', scrollY > 50);
            if (backToTopButton) backToTopButton.classList.toggle('visible', scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    };
    
    const onScrollAnimationHandler = () => {
        if (!animatedElements.length) return;
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
    
    const singlePageNavHandler = () => {
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        if (!navLinks.length || !document.body.classList.contains('home-page')) return;

        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                const scrollToAction = () => {
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                };

                if (navMenu.classList.contains('active')) {
                    toggleMenu(false, true);
                    setTimeout(scrollToAction, 0);
                } else {
                    scrollToAction();
                }
            });
        });

        const sections = document.querySelectorAll('main section[id]');
        if (!sections.length) return;

        const headerHeightValue = getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim() || '85px';
        const headerHeight = parseInt(headerHeightValue, 10);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, {
            rootMargin: `-${headerHeight}px 0px -75% 0px`
        });

        sections.forEach(section => observer.observe(section));
    };

    const roomGalleryHandler = () => {
        const mainImage = document.getElementById('main-gallery-image');
        const thumbnails = document.querySelectorAll('.gallery-thumbnails img');

        if (!mainImage || !thumbnails.length) return;

        thumbnails[0]?.classList.add('active');

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const largeSrc = thumb.dataset.largeSrc;
                if (largeSrc) {
                    mainImage.src = largeSrc;
                    thumbnails.forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                }
            });
        });
    };

    const menuFilterHandler = () => {
        const filterContainer = document.querySelector('.menu-filter');
        const menuContent = document.getElementById('menu-content');

        if (!filterContainer || !menuContent) return;

        const filterButtons = filterContainer.querySelectorAll('button');
        const menuItems = menuContent.querySelectorAll('.menu-item');
        const menuSections = menuContent.querySelectorAll('.menu-section');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filterValue = button.dataset.filter;

                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                menuItems.forEach(item => {
                    const itemCategory = item.dataset.category || '';
                    const shouldShow = filterValue === 'all' || itemCategory.includes(filterValue);
                    item.style.display = shouldShow ? 'block' : 'none';
                });

                menuSections.forEach(section => {
                    const visibleItems = section.querySelectorAll('.menu-item[style*="display: block"], .menu-item:not([style])');
                    section.style.display = visibleItems.length > 0 ? 'block' : 'none';
                });
            });
        });
    };

    const menuScrollspyHandler = () => {
        const stickyNav = document.querySelector('.menu-nav-sticky');
        if (!stickyNav) return;

        const navLinks = stickyNav.querySelectorAll('.menu-category-nav a');
        const sections = document.querySelectorAll('.menu-section');
        const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim() || '85px', 10);
        const stickyNavHeight = stickyNav.offsetHeight;
        const totalOffset = headerHeight + stickyNavHeight + 20;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, {
            rootMargin: `-${totalOffset}px 0px -65% 0px`
        });

        sections.forEach(section => observer.observe(section));

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetElement = document.querySelector(link.getAttribute('href'));
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    };

    const init = () => {
        mobileNavHandler();
        themeToggleHandler();
        scrollDependentHandler();
        onScrollAnimationHandler();
        backToTopClickHandler();
        updateFooterYear();
        faqAccordionHandler();
        singlePageNavHandler();
        roomGalleryHandler();
        menuFilterHandler();
        menuScrollspyHandler();
    };

    init();
});