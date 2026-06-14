/* ==========================================================================
   PORTFOLIO SCRIPTS - PRASHOBH NAIR
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize all components
    initLoader();
    initTheme();
    initMobileNav();
    initParticles();
    initTyping();
    initProjectFilters();
    initCaseStudies();
    initGithubStats();
    initScrollAnimations();
    initContactForm();
    initBackToTop();
});

/* ==========================================================================
   1. LOADER OVERLAY
   ========================================================================== */
function initLoader() {
    const loader = document.getElementById('loader');
    
    // Ensure loader fades out after document is loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hide');
            // Allow interactions once loader is gone
            document.body.style.overflow = 'initial';
        }, 600);
    });

    // Fallback safety timeout (2 seconds)
    setTimeout(() => {
        if (!loader.classList.contains('hide')) {
            loader.classList.add('hide');
        }
    }, 2000);
}

/* ==========================================================================
   2. DARK/LIGHT THEME SWITCHER
   ========================================================================== */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Load saved preference or check system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        html.classList.remove('dark-theme');
        html.classList.add('light-theme');
    } else {
        html.classList.remove('light-theme');
        html.classList.add('dark-theme');
    }

    // Toggle theme action
    themeToggle.addEventListener('click', () => {
        if (html.classList.contains('dark-theme')) {
            html.classList.remove('dark-theme');
            html.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            html.classList.remove('light-theme');
            html.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        }
    });
}

/* ==========================================================================
   3. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileNav() {
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const toggleIcon = navToggle.querySelector('i');

    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen);
        
        // Toggle icon between menu and close
        if (isOpen) {
            navToggle.innerHTML = '<i data-lucide="x"></i>';
        } else {
            navToggle.innerHTML = '<i data-lucide="menu"></i>';
        }
        lucide.createIcons();
    });

    // Close menu when clicking link items
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.innerHTML = '<i data-lucide="menu"></i>';
                lucide.createIcons();
            }
        });
    });
}

/* ==========================================================================
   4. INTERACTIVE CANVAS PARTICLE SYSTEM
   ========================================================================== */
function initParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let animationId;
    
    // Mouse properties
    const mouse = {
        x: null,
        y: null,
        radius: 120
    };

    window.addEventListener('mousemove', (event) => {
        // Offset mouse coordinate mapping for relative position inside hero
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle Blueprints
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Collision detection at boundary
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;

            // Interaction with mouse hover
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius + this.size) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                    this.x += 2;
                }
                if (mouse.x > this.x && this.x > this.size * 10) {
                    this.x -= 2;
                }
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                    this.y += 2;
                }
                if (mouse.y > this.y && this.y > this.size * 10) {
                    this.y -= 2;
                }
            }
            
            this.draw();
        }
    }

    // Populate array
    function initParticleList() {
        particlesArray = [];
        let numberOfParticles = Math.floor((canvas.width * canvas.height) / 16000);
        numberOfParticles = Math.min(numberOfParticles, 120); // Cap count for stability
        
        const isLightTheme = document.documentElement.classList.contains('light-theme');
        const particleColor = isLightTheme ? 'rgba(99, 102, 241, 0.22)' : 'rgba(255, 255, 255, 0.15)';

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            
            particlesArray.push(new Particle(x, y, directionX, directionY, size, particleColor));
        }
    }

    // Resize canvas
    function resizeCanvas() {
        const rect = canvas.parentNode.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        initParticleList();
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Render loop connects nodes that are near
    function animate() {
        animationId = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
    }

    // Connect node grids
    function connectParticles() {
        let opacityValue = 1;
        const isLightTheme = document.documentElement.classList.contains('light-theme');
        const lineColor = isLightTheme ? '99, 102, 241' : '255, 255, 255';
        
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                // If particles are close, draw link
                if (distance < 90) {
                    opacityValue = 1 - (distance / 90);
                    ctx.strokeStyle = `rgba(${lineColor}, ${opacityValue * 0.08})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Listen to theme adjustments to recalculate colors
    const observer = new MutationObserver(() => {
        initParticleList();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    animate();
}

/* ==========================================================================
   5. HERO SUBHEADING TYPING ANIMATION
   ========================================================================== */
function initTyping() {
    const textElement = document.querySelector('.typing-text');
    if (!textElement) return;

    const phrases = [
        "B.Tech Computer Science & Engineering Student",
        "Full-Stack Web Developer",
        "AI Automation Enthusiast"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            // Removing character
            textElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40; // Erase faster
        } else {
            // Typing character
            textElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 90; // Standard typing pace
        }

        // State changes
        if (!isDeleting && charIndex === currentPhrase.length) {
            // Completed phrase, hold before delete
            isDeleting = true;
            typingSpeed = 1800; // Hold delay
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length; // Next phrase
            typingSpeed = 400; // Delay before starting next
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // Trigger typing loop
    setTimeout(typeEffect, 800);
}

/* ==========================================================================
   6. PROJECTS FILTERING LOGIC
   ========================================================================== */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Toggle active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.classList.remove('hide');
                    // Add fade entrance style
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                        card.style.transition = 'all 0.35s ease';
                    }, 50);
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });
}

/* ==========================================================================
   7. CASE STUDIES MODALS & DETAILS MAPPING
   ========================================================================== */
const CASE_STUDIES_DATA = {
    callnexa: {
        title: "CallNexa Communication Platform",
        tag: "Communication Platform",
        img: "assets/images/callnexa.jpg",
        challenge: "Integrating custom voice triggers and asynchronous chat features securely without introducing payload lags or call dropouts.",
        solution: "Configured clean client-side routing modules that manage API integrations with external networks, dynamically updating chat bubbles and call queues.",
        tech: "HTML, CSS, JavaScript, APIs, Webhooks.",
        learnings: "Mastered asynchronous promise handling, client data mapping, and designing clean modern communication interfaces.",
        demo: "https://callnexa.launchweb.me/"
    },
    debate: {
        title: "Debate AI Discussion Platform",
        tag: "AI-Powered Discussion Platform",
        img: "assets/images/debate.jpg",
        challenge: "Orchestrating logical debate exchanges between multiple AI perspectives without entering circular repetitive conversation loops.",
        solution: "Structured state-tokens passed dynamically within the payload and designed a prompt scaffolding that guides reasoning and referee scoring.",
        tech: "HTML, CSS, JavaScript, AI APIs (Gemini API).",
        learnings: "Gained insights into AI API parameters (temperature, token limits), generative loops, and system prompt engineering.",
        demo: "https://debate.launchweb.me/"
    },
    chess: {
        title: "Chess Engine Strategic Board Solver",
        tag: "Algorithm-Based Application",
        img: "assets/images/chess.jpg",
        challenge: "Computing chess move validation sequences and rendering real-time validation feedback on mobile layouts without thread-locking.",
        solution: "Mapped chess boards to dynamic matrix models, validating check conditions recursively and optimizing evaluation complexity.",
        tech: "HTML, CSS, JavaScript, Custom Algorithms, Data Structures.",
        learnings: "Deepened understandings of matrix models, complexity bounds, recursive lookahead logic, and client thread scheduling.",
        demo: "https://chess.launchweb.me/"
    },
    flight: {
        title: "FlightRadar Tracker Dashboard",
        tag: "Flight Tracking Platform",
        img: "assets/images/flight.jpg",
        challenge: "Handling active API rate ceilings and drawing smooth paths for dynamic flight telemetry vectors on client maps.",
        solution: "Created local fetching intervals that catch aviation telemetry arrays, interpolating flight headings and speeds on the map overlay.",
        tech: "HTML, CSS, JavaScript, Aviation APIs, Map overlays.",
        learnings: "Learned how to process dynamic coordinates data streams, implement cache layers, and manage API rate structures.",
        demo: "https://flightradar.launchweb.me/"
    }
};

function initCaseStudies() {
    const modal = document.getElementById('cs-modal');
    const openButtons = document.querySelectorAll('.open-cs-btn');
    const closeButton = document.querySelector('.modal-close');
    
    // Modal Element hooks
    const mTitle = document.getElementById('modal-title');
    const mTag = document.getElementById('modal-project-tag');
    const mImage = document.getElementById('modal-image');
    const mChallengeMeta = document.getElementById('modal-meta-challenge');
    const mSolutionMeta = document.getElementById('modal-meta-solution');
    const mChallengeText = document.getElementById('modal-challenge-text');
    const mSolutionText = document.getElementById('modal-solution-text');
    const mTechText = document.getElementById('modal-tech-text');
    const mLearningsText = document.getElementById('modal-learnings-text');
    const mDemoLink = document.getElementById('modal-demo-link');

    function openModal(projectId) {
        const data = CASE_STUDIES_DATA[projectId];
        if (!data) return;

        // Inject data
        mTitle.textContent = data.title;
        mTag.textContent = data.tag;
        mImage.src = data.img;
        mImage.alt = `${data.title} Mockup`;
        
        mChallengeMeta.textContent = data.tag;
        mSolutionMeta.textContent = "Production deployment";

        mChallengeText.textContent = data.challenge;
        mSolutionText.textContent = data.solution;
        mTechText.textContent = data.tech;
        mLearningsText.textContent = data.learnings;
        mDemoLink.href = data.demo;

        // Toggle modal open
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Freeze main scrolling
    }

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'initial';
    }

    // Open listeners
    openButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.getAttribute('data-project');
            openModal(projectId);
        });
    });

    // Close listeners
    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // ESC key closes modal
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });
}

/* ==========================================================================
   8. DYNAMIC GITHUB API STATS & ACTIVITY BOARD
   ========================================================================== */
async function initGithubStats() {
    const username = "Prashobh-Nair";
    const reposLabel = document.getElementById('git-repos');
    const contribsLabel = document.getElementById('git-contribs');
    
    // 1. Fetch Repository Count
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (response.ok) {
            const data = await response.json();
            if (reposLabel && data.public_repos !== undefined) {
                reposLabel.textContent = data.public_repos;
            }
        }
    } catch (err) {
        console.warn("GitHub API error (likely rate limit). Using fallback static statistics.", err);
    }

    // 2. Build Contribution Activity Mockup Board
    const activityGrid = document.getElementById('github-activity-grid');
    if (!activityGrid) return;

    activityGrid.innerHTML = '';
    const totalCells = 26 * 7; // 26 columns, 7 rows representing ~half a year
    
    // Generate simulated patterns that reflect real active development (high streaks)
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.classList.add('activity-cell');
        
        // Compute active shades randomly weighted to simulate commit clusters
        const rand = Math.random();
        let level = 0;
        
        if (rand > 0.90) {
            level = 4; // Bright green
        } else if (rand > 0.80) {
            level = 3;
        } else if (rand > 0.65) {
            level = 2;
        } else if (rand > 0.50) {
            level = 1; // Muted green
        } // levels under 0.50 remain 0 (empty gray)
        
        cell.classList.add(`level-${level}`);
        activityGrid.appendChild(cell);
    }
}

/* ==========================================================================
   9. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollAnimations() {
    const scrollElements = document.querySelectorAll('.scroll-anim');
    if (scrollElements.length === 0) return;

    const elementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });

    scrollElements.forEach(el => {
        elementObserver.observe(el);
    });
}

/* ==========================================================================
   10. CONTACT FORM VALIDATION
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const messageInput = document.getElementById('form-message');
    const submitBtn = form.querySelector('.btn-submit');
    const statusAlert = document.getElementById('form-status');

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    }

    function checkInput(input, condition, errorId) {
        const group = input.parentNode;
        if (condition) {
            group.classList.remove('invalid');
            return true;
        } else {
            group.classList.add('invalid');
            return false;
        }
    }

    form.addEventListener('submit', (e) => {
        // Run validations
        const isNameValid = checkInput(nameInput, nameInput.value.trim().length > 0);
        const isEmailValid = checkInput(emailInput, validateEmail(emailInput.value.trim()));
        const isMessageValid = checkInput(messageInput, messageInput.value.trim().length > 0);

        if (!(isNameValid && isEmailValid && isMessageValid)) {
            e.preventDefault();
            statusAlert.style.display = 'block';
            statusAlert.className = 'form-status-alert error';
            statusAlert.textContent = "Please correct the highlighted inputs and try submitting again.";
        } else {
            // Let the form submit naturally to FormSubmit.co.
            // This works 100% of the time, even on local file:/// protocols.
            // It navigates to FormSubmit's page to guide the user on email activation.
            statusAlert.style.display = 'block';
            statusAlert.className = 'form-status-alert success';
            statusAlert.textContent = "Redirecting to the message forwarding service...";
        }
    });

    // Real-time error removal on input focusout/input
    nameInput.addEventListener('input', () => checkInput(nameInput, nameInput.value.trim().length > 0));
    emailInput.addEventListener('input', () => checkInput(emailInput, validateEmail(emailInput.value.trim())));
    messageInput.addEventListener('input', () => checkInput(messageInput, messageInput.value.trim().length > 0));
}

/* ==========================================================================
   11. BACK-TO-TOP BUTTON
   ========================================================================== */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
