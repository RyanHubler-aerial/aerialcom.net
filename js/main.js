/**
 * Aerial Communications - Core Client Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initForms();
    initScrollEffects();
    initHeroParticles();
});

/* ==========================================================================
   NAVIGATION
   ========================================================================== */
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.toggle('open');
            navLinks.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', isOpen);
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                navLinks.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Dynamic active class based on current page
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-link');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        // Check if path matches or if it's the root path mapping to index
        if (href === currentPath || (href === './index.html' && (currentPath === '' || currentPath === 'index.html'))) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/* ==========================================================================
   FORMS & TOASTS
   ========================================================================== */
function initForms() {
    const contactForm = document.getElementById('contact-form');
    const supportForm = document.getElementById('support-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(contactForm)) {
                const btnSubmit = contactForm.querySelector('button[type="submit"]');
                const originalText = btnSubmit.innerHTML;
                btnSubmit.disabled = true;
                btnSubmit.innerHTML = 'Sending...';

                setTimeout(() => {
                    showToast('Message sent successfully! We will contact you shortly.', 'success');
                    contactForm.reset();
                    btnSubmit.disabled = false;
                    btnSubmit.innerHTML = originalText;
                }, 1000);
            }
        });
    }

    if (supportForm) {
        supportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(supportForm)) {
                const btnSubmit = supportForm.querySelector('button[type="submit"]');
                const originalText = btnSubmit.innerHTML;
                btnSubmit.disabled = true;
                btnSubmit.innerHTML = 'Submitting Ticket...';

                setTimeout(() => {
                    showToast('Support ticket created successfully! A technician will contact you shortly.', 'success');
                    supportForm.reset();
                    btnSubmit.disabled = false;
                    btnSubmit.innerHTML = originalText;
                }, 1000);
            }
        });
    }
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            markInvalid(input);
            isValid = false;
        } else if (input.type === 'email' && !validateEmail(input.value)) {
            markInvalid(input);
            isValid = false;
        } else {
            markValid(input);
        }

        // Real-time error correction listener
        input.addEventListener('input', function handler() {
            if (input.value.trim() && (input.type !== 'email' || validateEmail(input.value))) {
                markValid(input);
                input.removeEventListener('input', handler);
            }
        });
    });

    return isValid;
}

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

function markInvalid(input) {
    input.classList.add('invalid');
}

function markValid(input) {
    input.classList.remove('invalid');
}

function showToast(message, type = 'success') {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <svg style="width: 18px; height: 18px;" viewBox="0 0 20 20" fill="currentColor">
            ${type === 'success' 
                ? '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>'
                : '<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8.25-3.5a.75.75 0 111.5 0v5a.75.75 0 11-1.5 0v-5zm1.5 8.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" clip-rule="evenodd"/>'
            }
        </svg>
        <span>${message}</span>
    `;

    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 250);
    }, 3500);
}

/* ==========================================================================
   SCROLL EFFECTS
   ========================================================================== */
function initScrollEffects() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 15) {
            header.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)';
            header.style.backgroundColor = '#ffffff';
        } else {
            header.style.boxShadow = 'none';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        }
    });

    const revealElements = document.querySelectorAll('.service-card, .process-step, .location-card');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(15px)';
            el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            observer.observe(el);
        });
    }
}

/* ==========================================================================
   HERO PARTICLES BACKGROUND (MOUSE REACTIVE SHIFT EFFECT)
   ========================================================================== */
function initHeroParticles() {
    const hero = document.querySelector('.hero');
    const canvas = document.getElementById('hero-canvas');
    if (!hero || !canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = hero.offsetWidth;
    let height = canvas.height = hero.offsetHeight;

    // Handle Resize
    window.addEventListener('resize', () => {
        width = canvas.width = hero.offsetWidth;
        height = canvas.height = hero.offsetHeight;
        initParticles();
    });

    // Shades of professional brand blue
    const colors = ['#0f4c81', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];
    let particles = [];
    const particleCount = 220;

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            // More particles on the left to match the density profile
            if (initial && Math.random() < 0.5) {
                this.x = Math.random() * (width * 0.45);
            } else {
                this.x = Math.random() * width;
            }
            this.y = Math.random() * height;
            
            this.baseX = this.x;
            this.baseY = this.y;
            
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.size = Math.random() * 2 + 1; // 1px to 3px
            this.alpha = Math.random() * 0.5 + 0.25; // opacity 0.25 to 0.75
            
            // Slow natural drift
            this.speedX = (Math.random() - 0.5) * 0.25;
            this.speedY = (Math.random() - 0.5) * 0.25;
        }

        update(mouseX, mouseY) {
            this.baseX += this.speedX;
            this.baseY += this.speedY;

            // Screen boundary wrapping
            if (this.baseX < 0) this.baseX = width;
            if (this.baseX > width) this.baseX = 0;
            if (this.baseY < 0) this.baseY = height;
            if (this.baseY > height) this.baseY = 0;

            if (mouseX !== null && mouseY !== null) {
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 140; // interaction radius

                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    const directionX = dx / distance;
                    const directionY = dy / distance;
                    
                    // Repelling push force
                    const pushX = directionX * force * 24;
                    const pushY = directionY * force * 24;

                    this.x -= pushX;
                    this.y -= pushY;
                } else {
                    // Smoothly slide back to base drift coordinates
                    this.x += (this.baseX - this.x) * 0.05;
                    this.y += (this.baseY - this.y) * 0.05;
                }
            } else {
                this.x += (this.baseX - this.x) * 0.05;
                this.y += (this.baseY - this.y) * 0.05;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    let mouseX = null;
    let mouseY = null;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    hero.addEventListener('mouseleave', () => {
        mouseX = null;
        mouseY = null;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update(mouseX, mouseY);
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    initParticles();
    animate();
}
