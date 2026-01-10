class HanoiGame {
    constructor() {
        this.towers = [[], [], []];
        this.moves = 0;
        this.history = [];
        this.draggedDisk = null;
        this.draggedFromTower = null;
        this.diskCount = 3;
        
        this.initializeElements();
        this.attachEventListeners();
        this.startGame();
    }

    initializeElements() {
        this.difficultySelect = document.getElementById('difficulty');
        this.startBtn = document.getElementById('startBtn');
        this.undoBtn = document.getElementById('undoBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.movesDisplay = document.getElementById('moves');
        this.minMovesDisplay = document.getElementById('minMoves');
        this.victoryScreen = document.getElementById('victory');
        this.nextBtn = document.getElementById('nextBtn');
        
        this.towersDOM = [
            document.getElementById('disks0'),
            document.getElementById('disks1'),
            document.getElementById('disks2')
        ];
    }

    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.undoBtn.addEventListener('click', () => this.undo());
        this.resetBtn.addEventListener('click', () => this.startGame());
        this.nextBtn.addEventListener('click', () => this.startGame());
        document.getElementById('autoBtn').addEventListener('click', () => this.autoSolve());

        this.towersDOM.forEach((tower, index) => {
            tower.addEventListener('dragover', (e) => this.handleDragOver(e, index));
            tower.addEventListener('drop', (e) => this.handleDrop(e, index));
            tower.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        });
    }

    startGame() {
        this.diskCount = parseInt(this.difficultySelect.value);
        this.towers = [[], [], []];
        this.moves = 0;
        this.history = [];
        this.draggedDisk = null;
        this.draggedFromTower = null;
        this.victoryScreen.classList.add('hidden');

        // Initialize disks on first tower
        for (let i = this.diskCount; i >= 1; i--) {
            this.towers[0].push(i);
        }

        this.updateDisplay();
        this.calculateMinMoves();
    }

    calculateMinMoves() {
        const minMoves = Math.pow(2, this.diskCount) - 1;
        this.minMovesDisplay.textContent = minMoves;
    }

    handleDragOver(e, towerIndex) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        this.towersDOM[towerIndex].style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
    }

    handleDragLeave(e) {
        if (e.target.classList.contains('disks-area')) {
            e.target.style.backgroundColor = '';
        }
    }

    handleDrop(e, toTower) {
        e.preventDefault();
        e.target.style.backgroundColor = '';
        
        if (this.draggedFromTower !== null) {
            this.moveDisk(this.draggedFromTower, toTower);
        }
        
        this.draggedDisk = null;
        this.draggedFromTower = null;
        this.updateDisplay();
    }

    moveDisk(fromTower, toTower) {
        // Check if move is valid
        if (this.towers[fromTower].length === 0) {
            return;
        }

        const disk = this.towers[fromTower][this.towers[fromTower].length - 1];
        
        if (this.towers[toTower].length > 0 && 
            this.towers[toTower][this.towers[toTower].length - 1] < disk) {
            // Invalid move - larger disk on smaller disk
            return;
        }

        // Valid move
        this.history.push([
            [...this.towers[0]],
            [...this.towers[1]],
            [...this.towers[2]]
        ]);

        this.towers[fromTower].pop();
        this.towers[toTower].push(disk);
        this.moves++;

        this.updateDisplay();
        this.checkVictory();
    }

    undo() {
        if (this.history.length > 0) {
            const previous = this.history.pop();
            this.towers[0] = previous[0];
            this.towers[1] = previous[1];
            this.towers[2] = previous[2];
            this.moves--;
            this.draggedDisk = null;
            this.draggedFromTower = null;
            this.updateDisplay();
        }
    }

    checkVictory() {
        if (this.towers[2].length === this.diskCount) {
            this.showVictory();
        }
    }

    showVictory() {
        document.getElementById('finalMoves').textContent = this.moves;
        const minMoves = Math.pow(2, this.diskCount) - 1;
        document.getElementById('finalMinMoves').textContent = minMoves;
        this.victoryScreen.classList.remove('hidden');
    }

    updateDisplay() {
        this.movesDisplay.textContent = this.moves;

        this.towersDOM.forEach((towerDOM, towerIndex) => {
            towerDOM.innerHTML = '';
            this.towers[towerIndex].forEach((disk) => {
                const diskElement = document.createElement('div');
                diskElement.className = `disk disk-${disk}`;
                diskElement.textContent = disk;
                diskElement.draggable = true;
                
                diskElement.addEventListener('dragstart', (e) => {
                    this.draggedDisk = disk;
                    this.draggedFromTower = towerIndex;
                    diskElement.classList.add('dragging');
                });
                
                diskElement.addEventListener('dragend', (e) => {
                    diskElement.classList.remove('dragging');
                });
                
                towerDOM.appendChild(diskElement);
            });
        });
    }

    autoSolve() {
        // Get the current state of towers
        const moves = [];
        this.generateMoves(this.diskCount, 0, 2, 1, moves);
        
        // Execute moves with animation delay
        let moveIndex = 0;
        const executeNextMove = () => {
            if (moveIndex < moves.length) {
                const [from, to] = moves[moveIndex];
                this.moveDisk(from, to);
                moveIndex++;
                setTimeout(executeNextMove, 800); // 0.8 second delay between moves
            }
        };
        
        executeNextMove();
    }

    generateMoves(n, source, destination, auxiliary, moves) {
        if (n === 1) {
            moves.push([source, destination]);
            return;
        }
        
        // Move n-1 disks from source to auxiliary using destination
        this.generateMoves(n - 1, source, auxiliary, destination, moves);
        
        // Move the largest disk from source to destination
        moves.push([source, destination]);
        
        // Move n-1 disks from auxiliary to destination using source
        this.generateMoves(n - 1, auxiliary, destination, source, moves);
    }
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new HanoiGame();
});
