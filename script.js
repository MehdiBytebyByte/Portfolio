// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('project-card')) {
                entry.target.style.transitionDelay = `${Math.random() * 0.5}s`;
            }
        }
    });
}, observerOptions);

// Observe all project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.classList.add('fade-in');
    observer.observe(card);
});

// Particle effect in the background
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = '#64ffda';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > this.canvas.width) this.x = 0;
        if (this.x < 0) this.x = this.canvas.width;
        if (this.y > this.canvas.height) this.y = 0;
        if (this.y < 0) this.y = this.canvas.height;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

// Setup canvas
const canvas = document.createElement('canvas');
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-1';
canvas.style.opacity = '0.5';
document.body.prepend(canvas);

// Resize handler
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Create particles
const particles = [];
const particleCount = 50;

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(canvas));
}

// Animation loop
function animate() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animate);
}

animate();

// Typing effect for the description
const description = document.querySelector('.description');
if (description) {
    const text = description.textContent;
    description.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            description.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }

    // Start typing effect when description is in view
    const descObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            typeWriter();
            descObserver.disconnect();
        }
    });

    descObserver.observe(description);
}

// Add hover effect to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Space background with dynamic stars
function createStarGroup(count) {
    const group = document.createElement('div');
    group.className = 'star-group';
    
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random size class
        const sizeClass = Math.random() < 0.6 ? 'small' : (Math.random() < 0.8 ? 'medium' : 'large');
        star.classList.add(sizeClass);
        
        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Random twinkle duration
        star.style.setProperty('--twinkle-duration', `${2 + Math.random() * 3}s`);
        
        // Random animation delay
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        group.appendChild(star);
    }
    
    return group;
}

function createShootingStar() {
    const star = document.createElement('div');
    star.className = 'star shooting';
    
    // Random position at the top
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = '0';
    
    return star;
}

function initSpaceBackground() {
    const spaceBackground = document.querySelector('.space-background');
    
    // Create multiple star groups
    for (let i = 0; i < 4; i++) {
        const starCount = 200 + Math.floor(Math.random() * 100); // 200-300 stars per group
        const group = createStarGroup(starCount);
        spaceBackground.appendChild(group);
    }
    
    // Periodically add shooting stars
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance every interval
            const shootingStar = createShootingStar();
            spaceBackground.appendChild(shootingStar);
            
            // Remove shooting star after animation
            setTimeout(() => {
                shootingStar.remove();
            }, 3000);
        }
    }, 2000);
}

// Rocket following cursor
function initRocket() {
    const rocketContainer = document.querySelector('.rocket-container');
    const rocket = rocketContainer.querySelector('.rocket');
    const trail = rocketContainer.querySelector('.rocket-trail');
    
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let isMoving = false;
    let moveTimeout;

    // Store previous positions for trail effect
    const positions = [];
    const maxPositions = 10;

    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    function updateRocketPosition() {
        // Smooth movement
        currentX = lerp(currentX, mouseX, 0.15);
        currentY = lerp(currentY, mouseY, 0.15);

        // Calculate movement direction
        const dx = mouseX - currentX;
        const dy = mouseY - currentY;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        // Store current position
        positions.unshift({ x: currentX, y: currentY });
        if (positions.length > maxPositions) {
            positions.pop();
        }

        // Update rocket position and rotation
        rocketContainer.style.transform = `translate(${currentX}px, ${currentY}px)`;
        rocket.style.transform = `rotate(${angle + 90}deg)`;

        // Update trail
        if (positions.length > 1) {
            const lastPos = positions[positions.length - 1];
            const trailAngle = Math.atan2(lastPos.y - currentY, lastPos.x - currentX) * (180 / Math.PI);
            trail.style.setProperty('--rotation', `${trailAngle + 90}deg`);
        }

        // Check if rocket is moving
        const speed = Math.sqrt(dx * dx + dy * dy);
        if (speed > 0.1) {
            if (!isMoving) {
                rocketContainer.classList.add('moving');
                isMoving = true;
            }
            clearTimeout(moveTimeout);
            moveTimeout = setTimeout(() => {
                rocketContainer.classList.remove('moving');
                isMoving = false;
            }, 100);
        }

        requestAnimationFrame(updateRocketPosition);
    }

    // Update mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Start animation
    updateRocketPosition();
}

// Initialize space background and rocket
document.addEventListener('DOMContentLoaded', () => {
    initSpaceBackground();
    initRocket();
});

// Load and render skills and projects
async function loadPortfolioData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        renderSkills(data.skills);
        renderProjects(data.projects);
        createSkillGraph(data.skills);
    } catch (error) {
        console.error('Error loading portfolio data:', error);
    }
}

function createSkillGraph(skills) {
    const ctx = document.getElementById('skillGraph').getContext('2d');
    
    // Prepare data for the graph
    const allSkills = [
        ...skills.languages.map(s => ({ ...s, category: 'Languages' })),
        ...skills.frameworks.map(s => ({ ...s, category: 'Frameworks' })),
        ...skills.tools.map(s => ({ ...s, category: 'Tools' }))
    ];

    // Sort skills by level
    allSkills.sort((a, b) => b.level - a.level);

    // Create the radar chart
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: allSkills.map(s => s.name),
            datasets: [{
                label: 'Skill Level',
                data: allSkills.map(s => s.level),
                backgroundColor: 'rgba(100, 255, 218, 0.2)',
                borderColor: 'rgba(100, 255, 218, 0.8)',
                borderWidth: 2,
                pointBackgroundColor: allSkills.map(s => s.color),
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(100, 255, 218, 1)',
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    pointLabels: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        font: {
                            size: 12
                        }
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.5)',
                        backdropColor: 'transparent',
                        stepSize: 20
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 25, 40, 0.9)',
                    titleColor: 'rgba(100, 255, 218, 1)',
                    bodyColor: '#fff',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        title: (items) => {
                            const skill = allSkills[items[0].dataIndex];
                            return `${skill.name} (${skill.category})`;
                        },
                        label: (item) => `Proficiency: ${item.raw}%`
                    }
                }
            }
        }
    });
}

function renderSkills(skills) {
    // Render each skill category
    Object.entries(skills).forEach(([category, skillList]) => {
        const container = document.getElementById(`${category}-skills`);
        if (!container) return;

        skillList.forEach(skill => {
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item';
            skillItem.innerHTML = `
                <div class="skill-info">
                    <span class="skill-name">${skill.name}</span>
                    <span class="skill-level">${skill.level}%</span>
                </div>
                <div class="skill-bar">
                    <div class="skill-progress" style="background-color: ${skill.color}"></div>
                </div>
            `;
            container.appendChild(skillItem);

            // Animate skill progress after a short delay
            setTimeout(() => {
                const progressBar = skillItem.querySelector('.skill-progress');
                progressBar.style.width = `${skill.level}%`;
            }, 200);
        });
    });
}

function renderProjects(projects) {
    const projectGrid = document.getElementById('project-grid');
    if (!projectGrid) return;

    projectGrid.innerHTML = projects.map(project => `
        <div class="project-card fade-in">
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
            <div class="project-links">
                <a href="${project.github}" class="btn" target="_blank">View Project</a>
            </div>
        </div>
    `).join('');

    // Observe project cards for fade-in animation
    document.querySelectorAll('.project-card').forEach(card => {
        observer.observe(card);
    });
}

// Initialize portfolio data when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadPortfolioData();
});

// Initialize EmailJS
(function() {
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
})();

// Contact form handling
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const submitBtn = this.querySelector('.submit-btn');
    const formMessage = document.createElement('div');
    formMessage.className = 'form-message';
    this.appendChild(formMessage);

    // Show loading state
    submitBtn.classList.add('loading');

    // Get form data
    const formData = {
        name: this.name.value,
        email: this.email.value,
        subject: this.subject.value,
        message: this.message.value,
        to_email: 'mehdiboughrara15@gmail.com'
    };

    // Send email using EmailJS
    emailjs.send('default_service', 'template_id', formData) // Replace with your service and template IDs
        .then(() => {
            // Show success message
            formMessage.textContent = 'Message sent successfully!';
            formMessage.classList.add('success', 'show');
            
            // Reset form
            this.reset();
        })
        .catch((error) => {
            // Show error message
            formMessage.textContent = 'Failed to send message. Please try again.';
            formMessage.classList.add('error', 'show');
            console.error('Email error:', error);
        })
        .finally(() => {
            // Hide loading state
            submitBtn.classList.remove('loading');
            
            // Remove message after 5 seconds
            setTimeout(() => {
                formMessage.remove();
            }, 5000);
        });
});
