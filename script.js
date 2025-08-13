// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .stat');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        // We will validate first, then submit programmatically
        e.preventDefault();

        // Read values by input IDs to match the actual form fields
        const nameInput = this.querySelector('#name');
        const emailInput = this.querySelector('#email'); // name="_replyto" in HTML
        const subjectInput = this.querySelector('#subject'); // name="_subject" in HTML
        const messageInput = this.querySelector('#message');

        const name = (nameInput?.value || '').trim();
        const email = (emailInput?.value || '').trim();
        const subject = (subjectInput?.value || '').trim();
        const message = (messageInput?.value || '').trim();

        // Simple validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Passed validation -> submit to Formspree
        // Optionally show a brief pending state; the page will navigate on success
        // Remove any existing error notifications before submitting
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) existingNotification.remove();

        this.submit();
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '10px',
        color: '#fff',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #2196F3, #1976D2)';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Typing animation for hero subtitle
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

// Load and populate website content from JSON
async function loadWebsiteData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        // Populate personal information
        populatePersonalInfo(data.personal);
        
        // Populate about section
        populateAboutSection(data.about);
        
        // Populate skills section
        populateSkillsSection(data.skills);
        
        // Populate projects section
        populateProjectsSection(data.projects);
        
        // Populate contact section
        populateContactSection(data.personal, data.contact, data.social);
        
        // Populate footer
        populateFooter(data.footer);
        
        // Initialize typing animation after content is loaded
        initializeTypingAnimation(data.personal.title);
        
    } catch (error) {
        console.error('Error loading website data:', error);
        // Fallback to existing content if JSON fails to load
        initializeTypingAnimation();
    }
}

function populatePersonalInfo(personal) {
    // Update navigation logo
    const navLogo = document.querySelector('.nav-logo a');
    if (navLogo) navLogo.textContent = personal.name;
    
    // Update hero section
    const heroTitle = document.querySelector('.hero-title .highlight');
    if (heroTitle) heroTitle.textContent = personal.name;
    
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) heroSubtitle.textContent = personal.title;
    
    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription) heroDescription.textContent = personal.tagline;
    
    // Update page title
    document.title = `${personal.name} - ${personal.title}`;
}

function populateAboutSection(about) {
    const aboutText = document.querySelector('.about-text');
    if (aboutText && about.description) {
        // Clear existing paragraphs
        const existingPs = aboutText.querySelectorAll('p');
        existingPs.forEach(p => p.remove());
        
        // Add new paragraphs
        about.description.forEach(paragraph => {
            const p = document.createElement('p');
            p.textContent = paragraph;
            aboutText.appendChild(p);
        });
    }
    
    // Update stats
    const stats = document.querySelectorAll('.stat');
    if (stats && about.stats) {
        about.stats.forEach((stat, index) => {
            if (stats[index]) {
                const h3 = stats[index].querySelector('h3');
                const p = stats[index].querySelector('p');
                if (h3) h3.textContent = stat.number;
                if (p) p.textContent = stat.label;
            }
        });
    }
}

function populateSkillsSection(skills) {
    const skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid && skills) {
        skillsGrid.innerHTML = '';
        
        skills.forEach(skillCategory => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'skill-category';
            
            categoryDiv.innerHTML = `
                <h3>${skillCategory.category}</h3>
                <div class="skill-items">
                    ${skillCategory.technologies.map(tech => 
                        `<span class="skill-tag">${tech}</span>`
                    ).join('')}
                </div>
            `;
            
            skillsGrid.appendChild(categoryDiv);
        });
    }
}

function populateProjectsSection(projects) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid && projects) {
        projectsGrid.innerHTML = '';
        
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            projectCard.innerHTML = `
                <div class="project-image">
                    <i class="${project.icon}"></i>
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tech">
                        ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        <a href="${project.github}" class="project-link" target="_blank"><i class="fab fa-github"></i></a>
                        <a href="${project.demo}" class="project-link" target="_blank"><i class="fas fa-external-link-alt"></i></a>
                    </div>
                </div>
            `;
            
            projectsGrid.appendChild(projectCard);
        });
    }
}

function populateContactSection(personal, contact, social) {
    // Update contact heading and description
    const contactHeading = document.querySelector('.contact-info h3');
    if (contactHeading && contact.heading) {
        contactHeading.textContent = contact.heading;
    }
    
    const contactDescription = document.querySelector('.contact-info p');
    if (contactDescription && contact.description) {
        contactDescription.textContent = contact.description;
    }
    
    // Update contact items
    const contactItems = document.querySelectorAll('.contact-item span');
    if (contactItems.length >= 3) {
        contactItems[0].textContent = personal.email;
        contactItems[1].textContent = personal.phone;
        contactItems[2].textContent = personal.location;
    }
    
    // Update social links
    const socialLinks = document.querySelector('.social-links');
    if (socialLinks && social) {
        socialLinks.innerHTML = '';
        
        social.forEach(socialItem => {
            const link = document.createElement('a');
            link.href = socialItem.url;
            link.className = 'social-link';
            link.target = '_blank';
            link.innerHTML = `<i class="${socialItem.icon}"></i>`;
            socialLinks.appendChild(link);
        });
    }
}

function populateFooter(footer) {
    const footerText = document.querySelector('.footer p');
    if (footerText && footer.copyright) {
        footerText.innerHTML = `&copy; ${footer.copyright}`;
    }
}

function initializeTypingAnimation(title) {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const textToType = title || heroSubtitle.textContent;
        setTimeout(() => {
            typeWriter(heroSubtitle, textToType, 100);
        }, 1000);
    }
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadWebsiteData();
});

// Add hover effect to skill tags
document.addEventListener('DOMContentLoaded', () => {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotate(2deg)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        const rate = scrolled * -0.5;
        heroContent.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add CSS for loading animation
const loadingStyles = `
    body:not(.loaded) * {
        animation-play-state: paused !important;
    }
    
    .loaded .hero-content {
        animation: fadeInUp 1s ease forwards;
    }
    
    .loaded .hero-image {
        animation: fadeInUp 1s ease 0.3s forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Inject loading styles
const styleSheet = document.createElement('style');
styleSheet.textContent = loadingStyles;
document.head.appendChild(styleSheet);
