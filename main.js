
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    createBackToTopButton();
    initScrollEffects();
    initPageTransitions();
});

/**
 * Handle mobile menu toggle and dropdowns
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenuBtn && navLinks) {
        // Toggle Main Menu
        mobileMenuBtn.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            
            // If we close the menu, also close all open sub-dropdowns
            if (!isActive) {
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
            }
        });

        // Handle Dropdowns on Mobile
        const navItemsWithDropdown = document.querySelectorAll('.nav-item.has-dropdown');
        
        navItemsWithDropdown.forEach(item => {
            const link = item.querySelector('.nav-link');
            
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault(); 
                    const wasActive = item.classList.contains('active');
                    navItemsWithDropdown.forEach(other => other.classList.remove('active'));
                    
                    if (!wasActive) {
                        item.classList.add('active');
                    } else {
                        window.location.href = link.href;
                    }
                }
            });
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('.dropdown a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
            });
        });
    }
}

/**
 * Handle scroll-dependent effects (Navbar shadow & Back-to-Top visibility)
 */
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    const footer = document.querySelector('.main-footer');
    const BASE_BOTTOM = 32; // 2rem in px

    window.addEventListener('scroll', () => {
        // Navbar shadow
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top visibility + footer avoidance
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;

            // Show when user has scrolled past 70% of the page
            if (scrollableHeight > 0 && window.scrollY > scrollableHeight * 0.7) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }

            // Avoid overlapping the footer
            if (footer) {
                const footerRect = footer.getBoundingClientRect();
                const btnHeight = backToTopBtn.offsetHeight;
                const gap = 16; // px gap between button and footer

                if (footerRect.top < window.innerHeight) {
                    // Footer is visible — push button up above it
                    const pushUp = window.innerHeight - footerRect.top + gap;
                    backToTopBtn.style.bottom = `${Math.max(BASE_BOTTOM, pushUp)}px`;
                } else {
                    // Footer not visible — reset to normal position
                    backToTopBtn.style.bottom = `${BASE_BOTTOM}px`;
                }
            }
        }
    });
}

/**
 * Handle page fade transitions on load and link click
 */
function initPageTransitions() {
    const body = document.body;
    
    // Fade in on load (handled by CSS transition on body opacity: 1)
    
    // Handle fade out on internal link clicks
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const target = link.getAttribute('target');

            // Exclude external, anchor, and special links
            if (
                target === '_blank' || 
                !href || 
                href.startsWith('#') || 
                href.startsWith('mailto:') || 
                href.startsWith('tel:') ||
                href.includes('://') && !href.includes(window.location.hostname)
            ) {
                return;
            }

            e.preventDefault();
            body.classList.add('fade-out');

            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
}

/**
 * Injects the Back to Top button into the DOM
 */
function createBackToTopButton() {
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.setAttribute('aria-label', 'Back to top');
    
    // Simple SVG Arrow Icon
    button.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
        </svg>
    `;

    document.body.appendChild(button);

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
