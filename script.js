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

// Game Manager
const gameManager = {
    init() {
        this.setupGameSelector();
        memoryGame.init();
        puzzleGame.init();
    },

    setupGameSelector() {
        const gameButtons = document.querySelectorAll('.game-type-btn');
        const gameContainers = document.querySelectorAll('.game-container');

        gameButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const gameType = btn.dataset.game;
                
                // Update buttons
                gameButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update containers
                gameContainers.forEach(container => {
                    container.classList.remove('active');
                    if (container.id === `${gameType}-game`) {
                        container.classList.add('active');
                    }
                });

                // Reset current game
                if (gameType === 'memory') {
                    memoryGame.restartGame();
                } else {
                    puzzleGame.restartGame();
                }
            });
        });
    }
};

// Memory Game Logic
const memoryGame = {
    gameContainer: document.querySelector('.memory-game'),
    difficultyBtns: document.querySelectorAll('.difficulty-btn'),
    hasFlippedCard: false,
    lockBoard: false,
    firstCard: null,
    secondCard: null,
    moves: 0,
    timeStarted: false,
    timer: null,
    seconds: 0,
    currentDifficulty: 'easy',

    cardSets: {
        easy: ['🎮', '🎲', '🎯', '🎨'],
        medium: ['🎮', '🎲', '🎯', '🎨', '🎭', '🎪', '🎟️', '🎪'],
        hard: ['🎮', '🎲', '🎯', '🎨', '🎭', '🎪', '🎟️', '🎪', '🎨', '🎭', '🎪', '🎟️']
    },

    createCard(emoji) {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.framework = emoji;
        
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">${emoji}</div>
            </div>
        `;
        
        card.addEventListener('click', () => this.flipCard(card));
        return card;
    },

    init() {
        this.setupDifficultyButtons();
        this.setupGame('easy');
        this.addEventListeners();
        this.updateStats();
    },

    setupDifficultyButtons() {
        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.difficultyBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.setupGame(btn.dataset.difficulty);
            });
        });
    },

    setupGame(difficulty) {
        this.currentDifficulty = difficulty;
        this.gameContainer.innerHTML = '';
        this.resetGame();

        const emojis = [...this.cardSets[difficulty], ...this.cardSets[difficulty]];
        const shuffledEmojis = this.shuffle(emojis);

        // Set grid columns based on difficulty
        const columns = difficulty === 'easy' ? 4 : (difficulty === 'medium' ? 4 : 6);
        this.gameContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

        shuffledEmojis.forEach(emoji => {
            const card = this.createCard(emoji);
            this.gameContainer.appendChild(card);
        });
    },

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    addEventListeners() {
        document.querySelector('.restart-button').addEventListener('click', () => this.restartGame());
    },

    flipCard(card) {
        if (this.lockBoard || card === this.firstCard) return;
        
        if (!this.timeStarted) {
            this.startTimer();
            this.timeStarted = true;
        }

        card.classList.add('flipped');

        if (!this.hasFlippedCard) {
            this.hasFlippedCard = true;
            this.firstCard = card;
            return;
        }

        this.secondCard = card;
        this.moves++;
        this.updateStats();
        this.checkForMatch();
    },

    checkForMatch() {
        const isMatch = this.firstCard.dataset.framework === this.secondCard.dataset.framework;
        isMatch ? this.disableCards() : this.unflipCards();
    },

    disableCards() {
        this.firstCard.removeEventListener('click', () => this.flipCard);
        this.secondCard.removeEventListener('click', () => this.flipCard);
        this.resetBoard();
        
        // Check if game is complete
        const allMatched = [...document.querySelectorAll('.memory-card')]
            .every(card => card.classList.contains('flipped'));
        
        if (allMatched) {
            clearInterval(this.timer);
            setTimeout(() => {
                alert(`🎉 Congratulations! You won on ${this.currentDifficulty} difficulty in ${this.moves} moves and ${this.seconds} seconds! 🎉`);
            }, 500);
        }
    },

    unflipCards() {
        this.lockBoard = true;
        setTimeout(() => {
            this.firstCard.classList.remove('flipped');
            this.secondCard.classList.remove('flipped');
            this.resetBoard();
        }, 1000);
    },

    resetBoard() {
        [this.hasFlippedCard, this.lockBoard] = [false, false];
        [this.firstCard, this.secondCard] = [null, null];
    },

    startTimer() {
        this.timer = setInterval(() => {
            this.seconds++;
            this.updateStats();
        }, 1000);
    },

    updateStats() {
        document.querySelector('.moves').textContent = `Moves: ${this.moves}`;
        document.querySelector('.timer').textContent = `Time: ${this.seconds}s`;
    },

    resetGame() {
        clearInterval(this.timer);
        this.timeStarted = false;
        this.seconds = 0;
        this.moves = 0;
        this.resetBoard();
        this.updateStats();
    },

    restartGame() {
        this.setupGame(this.currentDifficulty);
    }
};

// Puzzle Game Logic
const puzzleGame = {
    board: document.querySelector('.puzzle-board'),
    difficultyBtns: document.querySelectorAll('#puzzle-game .difficulty-btn'),
    moves: 0,
    timeStarted: false,
    timer: null,
    seconds: 0,
    currentDifficulty: 'easy',
    tiles: [],
    emptyTile: null,

    init() {
        this.setupDifficultyButtons();
        this.setupGame('easy');
        this.addEventListeners();
        this.updateStats();
    },

    setupDifficultyButtons() {
        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.difficultyBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.setupGame(btn.dataset.difficulty);
            });
        });
    },

    setupGame(difficulty) {
        this.currentDifficulty = difficulty;
        this.resetGame();

        const size = this.getDifficultySize(difficulty);
        this.board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        
        // Create tiles
        const totalTiles = size * size;
        const numbers = Array.from({length: totalTiles - 1}, (_, i) => i + 1);
        this.shuffle(numbers);
        
        this.board.innerHTML = '';
        numbers.forEach(num => {
            const tile = this.createTile(num);
            this.board.appendChild(tile);
            this.tiles.push(tile);
        });

        // Add empty tile
        const emptyTile = this.createTile('', true);
        this.board.appendChild(emptyTile);
        this.emptyTile = emptyTile;
        this.tiles.push(emptyTile);

        this.updateTilePositions();
    },

    getDifficultySize(difficulty) {
        return difficulty === 'easy' ? 3 : (difficulty === 'medium' ? 4 : 5);
    },

    createTile(number, isEmpty = false) {
        const tile = document.createElement('div');
        tile.className = `puzzle-tile${isEmpty ? ' empty' : ''}`;
        if (!isEmpty) {
            tile.textContent = number;
            tile.addEventListener('click', () => this.moveTile(tile));
        }
        return tile;
    },

    moveTile(tile) {
        if (!this.isAdjacent(tile)) return;

        if (!this.timeStarted) {
            this.startTimer();
            this.timeStarted = true;
        }

        // Swap positions
        const tileIndex = this.tiles.indexOf(tile);
        const emptyIndex = this.tiles.indexOf(this.emptyTile);
        this.tiles[emptyIndex] = tile;
        this.tiles[tileIndex] = this.emptyTile;

        this.updateTilePositions();
        this.moves++;
        this.updateStats();
        
        if (this.checkWin()) {
            clearInterval(this.timer);
            setTimeout(() => {
                alert(`🎉 Congratulations! You solved the ${this.currentDifficulty} puzzle in ${this.moves} moves and ${this.seconds} seconds! 🎉`);
            }, 500);
        }
    },

    isAdjacent(tile) {
        const size = this.getDifficultySize(this.currentDifficulty);
        const tileIndex = this.tiles.indexOf(tile);
        const emptyIndex = this.tiles.indexOf(this.emptyTile);
        
        const row = Math.floor(tileIndex / size);
        const col = tileIndex % size;
        const emptyRow = Math.floor(emptyIndex / size);
        const emptyCol = emptyIndex % size;

        return (
            (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
            (Math.abs(col - emptyCol) === 1 && row === emptyRow)
        );
    },

    updateTilePositions() {
        this.tiles.forEach((tile, index) => {
            tile.style.order = index;
        });
    },

    checkWin() {
        return this.tiles.every((tile, index) => {
            if (tile === this.emptyTile) return true;
            return parseInt(tile.textContent) === index + 1;
        });
    },

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    startTimer() {
        this.timer = setInterval(() => {
            this.seconds++;
            this.updateStats();
        }, 1000);
    },

    updateStats() {
        document.querySelector('#puzzle-game .moves').textContent = `Moves: ${this.moves}`;
        document.querySelector('#puzzle-game .timer').textContent = `Time: ${this.seconds}s`;
    },

    resetGame() {
        clearInterval(this.timer);
        this.timeStarted = false;
        this.seconds = 0;
        this.moves = 0;
        this.tiles = [];
        this.emptyTile = null;
        this.updateStats();
    },

    restartGame() {
        this.setupGame(this.currentDifficulty);
    },

    addEventListeners() {
        document.querySelector('#puzzle-game .restart-button').addEventListener('click', () => this.restartGame());
    }
};

// Initialize games
document.addEventListener('DOMContentLoaded', () => {
    gameManager.init();
});
