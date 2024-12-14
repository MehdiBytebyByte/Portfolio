class Tetris {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.grid = this.createGrid();
        this.pieces = {
            'I': [[1, 1, 1, 1]],
            'L': [[1, 0], [1, 0], [1, 1]],
            'J': [[0, 1], [0, 1], [1, 1]],
            'O': [[1, 1], [1, 1]],
            'Z': [[1, 1, 0], [0, 1, 1]],
            'S': [[0, 1, 1], [1, 1, 0]],
            'T': [[1, 1, 1], [0, 1, 0]]
        };
        this.colors = {
            'I': '#00f0f0',
            'O': '#f0f000',
            'T': '#a000f0',
            'S': '#00f000',
            'Z': '#f00000',
            'J': '#0000f0',
            'L': '#f0a000'
        };
        this.currentPiece = null;
        this.currentPiecePos = { x: 0, y: 0 };
        this.speed = 1000;
        this.lastTime = 0;
        this.accumulator = 0;
        this.isPlaying = true;
        this.score = 0;
        
        this.init();
    }

    createGrid() {
        return Array(20).fill().map(() => Array(10).fill(0));
    }

    init() {
        this.spawnPiece();
        this.animate();
    }

    spawnPiece() {
        const pieces = Object.keys(this.pieces);
        const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
        this.currentPiece = {
            shape: this.pieces[randomPiece],
            color: this.colors[randomPiece]
        };
        this.currentPiecePos = {
            x: Math.floor((10 - this.currentPiece.shape[0].length) / 2),
            y: 0
        };
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        this.grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    this.drawBlock(x, y, value);
                }
            });
        });

        // Draw current piece
        if (this.currentPiece) {
            this.currentPiece.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value) {
                        this.drawBlock(
                            x + this.currentPiecePos.x,
                            y + this.currentPiecePos.y,
                            this.currentPiece.color
                        );
                    }
                });
            });
        }
    }

    drawBlock(x, y, color) {
        const blockSize = this.canvas.width / 10;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x * blockSize, y * blockSize, blockSize - 1, blockSize - 1);
    }

    moveDown() {
        this.currentPiecePos.y++;
        if (this.checkCollision()) {
            this.currentPiecePos.y--;
            this.merge();
            this.spawnPiece();
            if (this.checkCollision()) {
                this.reset();
            }
        }
    }

    checkCollision() {
        return this.currentPiece.shape.some((row, y) => {
            return row.some((value, x) => {
                if (!value) return false;
                const newX = x + this.currentPiecePos.x;
                const newY = y + this.currentPiecePos.y;
                return (
                    newX < 0 ||
                    newX >= 10 ||
                    newY >= 20 ||
                    (newY >= 0 && this.grid[newY][newX])
                );
            });
        });
    }

    merge() {
        this.currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    const newY = y + this.currentPiecePos.y;
                    const newX = x + this.currentPiecePos.x;
                    if (newY >= 0) {
                        this.grid[newY][newX] = this.currentPiece.color;
                    }
                }
            });
        });
        this.clearLines();
    }

    clearLines() {
        let linesCleared = 0;
        outer: for (let y = this.grid.length - 1; y >= 0; y--) {
            for (let x = 0; x < this.grid[y].length; x++) {
                if (!this.grid[y][x]) continue outer;
            }
            this.grid.splice(y, 1);
            this.grid.unshift(Array(10).fill(0));
            linesCleared++;
            y++;
        }
        if (linesCleared > 0) {
            this.score += linesCleared * 100;
            this.speed = Math.max(100, 1000 - (this.score / 100) * 50);
        }
    }

    reset() {
        this.grid = this.createGrid();
        this.score = 0;
        this.speed = 1000;
    }

    animate(time = 0) {
        const deltaTime = time - this.lastTime;
        this.lastTime = time;
        
        this.accumulator += deltaTime;
        if (this.accumulator > this.speed) {
            this.moveDown();
            this.accumulator = 0;
        }

        this.draw();
        requestAnimationFrame(this.animate.bind(this));
    }
}

// Initialize Tetris when the window loads
window.addEventListener('load', () => {
    const canvas = document.getElementById('tetris-bg');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const game = new Tetris(canvas);

    // Add window resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});
