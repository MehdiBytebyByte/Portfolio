// Admin Authentication and Management
const ADMIN_USERNAME = 'mboughra'; // Change this to your desired username
const ADMIN_PASSWORD = 'Xwwwrr00123//'; // Change this to your desired password

class AdminPanel {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.loginSection = document.getElementById('loginSection');
        this.adminPanel = document.getElementById('adminPanel');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.projectForm = document.getElementById('projectForm');
        this.skillForm = document.getElementById('skillForm');
        this.projectsList = document.getElementById('projectsList');
        this.skillsList = document.getElementById('skillsList');

        this.init();
    }

    init() {
        this.checkAuth();
        this.setupEventListeners();
        if (this.isAuthenticated()) {
            this.loadProjects();
            this.loadSkills();
        }
    }

    setupEventListeners() {
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        this.logoutBtn.addEventListener('click', () => this.handleLogout());
        this.projectForm.addEventListener('submit', (e) => this.handleProjectSubmit(e));
        this.skillForm.addEventListener('submit', (e) => this.handleSkillSubmit(e));
    }

    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            localStorage.setItem('adminAuth', 'true');
            this.showAdminPanel();
            this.loadProjects();
            this.loadSkills();
        } else {
            alert('Invalid credentials');
        }
    }

    handleLogout() {
        localStorage.removeItem('adminAuth');
        this.showLoginForm();
    }

    isAuthenticated() {
        return localStorage.getItem('adminAuth') === 'true';
    }

    checkAuth() {
        if (this.isAuthenticated()) {
            this.showAdminPanel();
        } else {
            this.showLoginForm();
        }
    }

    showLoginForm() {
        this.loginSection.style.display = 'flex';
        this.adminPanel.style.display = 'none';
    }

    showAdminPanel() {
        this.loginSection.style.display = 'none';
        this.adminPanel.style.display = 'block';
    }

    handleProjectSubmit(e) {
        e.preventDefault();
        const project = {
            id: Date.now(),
            title: document.getElementById('projectTitle').value,
            description: document.getElementById('projectDescription').value,
            link: document.getElementById('projectLink').value,
            technologies: document.getElementById('projectTech').value.split(',').map(tech => tech.trim())
        };

        this.saveProject(project);
        this.projectForm.reset();
        this.loadProjects();
    }

    handleSkillSubmit(e) {
        e.preventDefault();
        const skill = {
            id: Date.now(),
            name: document.getElementById('skillName').value,
            level: document.getElementById('skillLevel').value
        };

        this.saveSkill(skill);
        this.skillForm.reset();
        this.loadSkills();
    }

    saveProject(project) {
        const projects = this.getProjects();
        projects.push(project);
        localStorage.setItem('projects', JSON.stringify(projects));
    }

    saveSkill(skill) {
        const skills = this.getSkills();
        skills.push(skill);
        localStorage.setItem('skills', JSON.stringify(skills));
    }

    getProjects() {
        return JSON.parse(localStorage.getItem('projects') || '[]');
    }

    getSkills() {
        return JSON.parse(localStorage.getItem('skills') || '[]');
    }

    deleteProject(id) {
        const projects = this.getProjects().filter(project => project.id !== id);
        localStorage.setItem('projects', JSON.stringify(projects));
        this.loadProjects();
    }

    deleteSkill(id) {
        const skills = this.getSkills().filter(skill => skill.id !== id);
        localStorage.setItem('skills', JSON.stringify(skills));
        this.loadSkills();
    }

    loadProjects() {
        const projects = this.getProjects();
        this.projectsList.innerHTML = projects.map(project => `
            <div class="project-item">
                <div>
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <small>${project.technologies.join(', ')}</small>
                </div>
                <button class="delete-btn" onclick="adminPanel.deleteProject(${project.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    loadSkills() {
        const skills = this.getSkills();
        this.skillsList.innerHTML = skills.map(skill => `
            <div class="skill-item">
                <div>
                    <h3>${skill.name}</h3>
                    <span class="skill-level">${skill.level}%</span>
                </div>
                <button class="delete-btn" onclick="adminPanel.deleteSkill(${skill.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        // Update skills graph on main page if it exists
        this.updateMainPageSkills(skills);
    }

    updateMainPageSkills(skills) {
        const event = new CustomEvent('skillsUpdated', { detail: skills });
        window.dispatchEvent(event);
    }
}

// Initialize Admin Panel
const adminPanel = new AdminPanel();
