// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;
const themeKey = 'portfolio-theme';
const paletteKey = 'portfolio-palette';

// Get saved theme or default to light
function getTheme() {
    const savedTheme = localStorage.getItem(themeKey);
    if (savedTheme) {
        return savedTheme;
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

// Set theme
function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem(themeKey, theme);
}

// Toggle theme
function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// Initialize theme on load
const savedTheme = getTheme();
setTheme(savedTheme);

// Theme toggle button event
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Listen for system theme changes
if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a theme
        if (!localStorage.getItem(themeKey)) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

// Color Palette Picker Functionality
const paletteButton = document.getElementById('paletteButton');
const paletteDropdown = document.getElementById('paletteDropdown');
const paletteOptions = document.querySelectorAll('.palette-option');
const defaultPalette = 'blue';

// Get saved palette or default to blue
function getPalette() {
    return localStorage.getItem(paletteKey) || defaultPalette;
}

// Set palette
function setPalette(palette) {
    htmlElement.setAttribute('data-palette', palette);
    localStorage.setItem(paletteKey, palette);
    
    // Update active state
    paletteOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-palette') === palette) {
            option.classList.add('active');
        }
    });
}

// Initialize palette on load
const savedPalette = getPalette();
setPalette(savedPalette);

// Toggle palette dropdown
if (paletteButton && paletteDropdown) {
    paletteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        paletteDropdown.classList.toggle('active');
    });
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (paletteDropdown && paletteButton) {
        if (!paletteDropdown.contains(e.target) && !paletteButton.contains(e.target)) {
            paletteDropdown.classList.remove('active');
        }
    }
});

// Handle palette option clicks
paletteOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        e.stopPropagation();
        const palette = option.getAttribute('data-palette');
        setPalette(palette);
        paletteDropdown.classList.remove('active');
    });
});

// Close dropdown when clicking on a palette option (mobile)
paletteDropdown.addEventListener('click', (e) => {
    if (e.target.closest('.palette-option')) {
        setTimeout(() => {
            paletteDropdown.classList.remove('active');
        }, 200);
    }
});

// Navigation toggle for mobile
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.getElementById('navbar');

// Mobile menu toggle
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        if (paletteDropdown) {
            paletteDropdown.classList.remove('active');
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for scroll animations with stagger effect
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
        }
    });
}, observerOptions);

// Observe all sections
sections.forEach(section => {
    observer.observe(section);
});

// Animate elements on scroll
const animateElements = document.querySelectorAll('.skill-category, .timeline-item, .education-card, .contact-item');
const elementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            elementObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

animateElements.forEach(el => elementObserver.observe(el));

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const heroContent = hero.querySelector('.hero-content');
        const heroBlob = hero.querySelector('.hero-blob');
        
        if (scrolled < window.innerHeight) {
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
            }
            if (heroBlob) {
                heroBlob.style.transform = `translateY(${scrolled * 0.5}px) scale(${1 + scrolled * 0.0005})`;
            }
        }
    }
});

// Typing animation for hero name (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation on load (optional - can be disabled)
// const heroName = document.querySelector('.hero-name');
// if (heroName && window.innerWidth > 768) {
//     const originalText = heroName.textContent;
//     typeWriter(heroName, originalText, 100);
// }

// Form validation (if contact form is added later)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Scroll to top functionality with enhanced styling
function createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top button
createScrollToTopButton();

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }, 250);
});

// Performance optimization: Lazy load images (if images are added later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add active state management for better UX
document.addEventListener('DOMContentLoaded', () => {
    // Set initial active nav link
    highlightNavigation();
    
    // Add smooth reveal animation on page load
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Add staggered animation to skill tags
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach((tag, index) => {
        tag.style.animationDelay = `${index * 0.05}s`;
        tag.style.opacity = '0';
        tag.style.animation = 'fadeInUp 0.5s ease-out forwards';
    });
    
    // Add typing effect to hero name (optional)
    const heroName = document.querySelector('.hero-name');
    if (heroName && window.innerWidth > 768) {
        const text = heroName.textContent;
        heroName.textContent = '';
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroName.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        setTimeout(typeWriter, 1000);
    }
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
});

// Profile Photo Upload Functionality
const profilePhoto = document.getElementById('profilePhoto');
const photoInput = document.createElement('input');
photoInput.type = 'file';
photoInput.accept = 'image/*';
photoInput.style.display = 'none';

if (profilePhoto) {
    // Load saved photo from localStorage
    const savedPhoto = localStorage.getItem('profile-photo');
    if (savedPhoto) {
        profilePhoto.src = savedPhoto;
    }
    
    // Add click to upload
    profilePhoto.addEventListener('click', () => {
        photoInput.click();
    });
    
    // Add hover cursor
    profilePhoto.style.cursor = 'pointer';
    profilePhoto.title = 'Click to upload your photo';
    
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                profilePhoto.src = event.target.result;
                localStorage.setItem('profile-photo', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
    
    document.body.appendChild(photoInput);
}

// Console message (optional - for development)
console.log('%c👋 Welcome to Kathiravan P\'s Portfolio!', 'color: #6366f1; font-size: 16px; font-weight: bold;');
console.log('%cBuilt with modern web technologies (2025)', 'color: #8b5cf6; font-size: 12px;');

