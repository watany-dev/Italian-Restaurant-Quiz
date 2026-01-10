// ストーリーモードのコントローラー
class StoryModeController {
    constructor() {
        this.currentChapter = 1;
        this.storyGame = null;
        this.totalChapters = getTotalChapters();
        
        this.initializeUI();
        this.attachEventListeners();
    }

    initializeUI() {
        // DOM要素の取得
        this.modeSelectScreen = document.getElementById('modeSelect');
        this.storyModeScreen = document.getElementById('storyMode');
        this.normalModeScreen = document.getElementById('normalMode');
        this.gameplayStoryScreen = document.getElementById('gameplayStory');
        
        // ボタン
        this.storyModeBtn = document.getElementById('storyModeBtn');
        this.normalModeBtn = document.getElementById('normalModeBtn');
        this.backToModeSelectBtn = document.getElementById('backToModeSelect');
        this.backToModeSelect2Btn = document.getElementById('backToModeSelect2');
        this.storyStartBtn = document.getElementById('storyStartBtn');
    }

    attachEventListeners() {
        this.storyModeBtn.addEventListener('click', () => this.showStoryMode());
        this.normalModeBtn.addEventListener('click', () => this.showNormalMode());
        this.backToModeSelectBtn.addEventListener('click', () => this.backToModeSelect());
        this.backToModeSelect2Btn.addEventListener('click', () => this.backToModeSelect());
        this.storyStartBtn.addEventListener('click', () => this.startStoryGame());
    }

    showStoryMode() {
        this.hideAllScreens();
        this.modeSelectScreen.classList.add('hidden');
        this.storyModeScreen.classList.remove('hidden');
        this.currentChapter = 1;
        this.updateStoryDisplay();
    }

    showNormalMode() {
        this.hideAllScreens();
        this.modeSelectScreen.classList.add('hidden');
        this.normalModeScreen.classList.remove('hidden');
    }

    backToModeSelect() {
        this.hideAllScreens();
        this.modeSelectScreen.classList.remove('hidden');
    }

    hideAllScreens() {
        this.modeSelectScreen.classList.add('hidden');
        this.storyModeScreen.classList.add('hidden');
        this.normalModeScreen.classList.add('hidden');
        this.gameplayStoryScreen.classList.add('hidden');
    }

    updateStoryDisplay() {
        const chapter = getChapter(this.currentChapter);
        if (!chapter) return;

        // プログレスバーの更新
        const progress = (this.currentChapter / this.totalChapters) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('chapterInfo').textContent = 
            `チャプター ${this.currentChapter} / ${this.totalChapters}`;

        // ストーリーコンテンツの更新
        const storyContent = document.getElementById('storyContent');
        storyContent.innerHTML = `
            <div class="story-chapter-header">
                <h2>${chapter.title}</h2>
            </div>
            ${chapter.narrative}
        `;

        // ボタンのテキスト更新
        if (this.currentChapter === this.totalChapters) {
            this.storyStartBtn.textContent = '🌟 ラストチャレンジへ！';
        } else {
            this.storyStartBtn.textContent = '✨ チャプターをはじめる';
        }
    }

    startStoryGame() {
        const chapter = getChapter(this.currentChapter);
        if (!chapter) return;

        this.hideAllScreens();
        this.gameplayStoryScreen.classList.remove('hidden');

        // ストーリーゲームの初期化
        this.storyGame = new StoryHanoiGame(chapter);
    }
}

// ストーリーモード用のハノイゲーム
class StoryHanoiGame {
    constructor(chapter) {
        this.chapter = chapter;
        this.towers = [[], [], []];
        this.moves = 0;
        this.history = [];
        this.draggedDisk = null;
        this.draggedFromTower = null;
        this.diskCount = chapter.diskCount;
        
        this.initializeElements();
        this.attachEventListeners();
        this.setupCharacter();
        this.startGame();
    }

    initializeElements() {
        // ゲーム関連
        this.undoBtn2 = document.getElementById('undoBtn2');
        this.resetBtn2 = document.getElementById('resetBtn2');
        this.movesDisplay = document.getElementById('storyMoves');
        this.minMovesDisplay = document.getElementById('storyMinMoves');
        this.victoryScreen = document.getElementById('storyVictory');
        this.storyNextBtn = document.getElementById('storyNextBtn');
        this.victoryMessage = document.getElementById('victoryMessage');
        
        // ストーリー関連
        this.storyCharacterDiv = document.getElementById('storyCharacter');
        this.towerNames = [
            document.getElementById('towerName0'),
            document.getElementById('towerName1'),
            document.getElementById('towerName2')
        ];
        
        this.towersDOM = [
            document.getElementById('disks0-story'),
            document.getElementById('disks1-story'),
            document.getElementById('disks2-story')
        ];
    }

    attachEventListeners() {
        this.undoBtn2.addEventListener('click', () => this.undo());
        this.resetBtn2.addEventListener('click', () => this.startGame());
        this.storyNextBtn.addEventListener('click', () => this.nextChapter());

        this.towersDOM.forEach((tower, index) => {
            tower.addEventListener('dragover', (e) => this.handleDragOver(e, index));
            tower.addEventListener('drop', (e) => this.handleDrop(e, index));
            tower.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        });
    }

    setupCharacter() {
        const chapter = this.chapter;
        let characterEmoji = chapter.character || '👧';
        let characterName = chapter.characterName || '不明';
        let dialogue = chapter.narrative.split('<p>')[1] || '頑張ってね！';

        // HTMLをテキストに変換（簡易版）
        dialogue = dialogue.replace(/<[^>]+>/g, '').slice(0, 60) + '...';

        this.storyCharacterDiv.innerHTML = `
            <div class="character-emoji">${characterEmoji}</div>
            <div class="character-name">${characterName}</div>
            <div class="character-dialogue">
                <p>${characterName}の声：</p>
                <p id="characterDialogue">チャレンジしてね！</p>
            </div>
        `;

        // チャプターごとのセリフ
        this.updateCharacterDialogue();
    }

    updateCharacterDialogue() {
        const dialogueElements = {
            1: "３つのリングを右の塔に移してね。だいじょうぶ、君ならできる！",
            2: "４つのリングか...難しくなってきたね。でもここが勝負だ！",
            3: "５つ...これはむずかしい。けど君ならきっと大丈夫！",
            4: "６つだ。これが本当の力を試す時だ。頑張れ！",
            5: "７つ...すべての謎を解く最後のチャレンジ。君を信じてる！"
        };

        const dialogue = dialogueElements[this.chapter.id] || "頑張ってね！";
        const elem = document.getElementById('characterDialogue');
        if (elem) elem.textContent = dialogue;
    }

    startGame() {
        this.towers = [[], [], []];
        this.moves = 0;
        this.history = [];
        
        // リングを初期化
        for (let i = this.diskCount; i >= 1; i--) {
            this.towers[0].push(i);
        }
        
        this.minMoves = Math.pow(2, this.diskCount) - 1;
        this.minMovesDisplay.textContent = this.minMoves;
        this.movesDisplay.textContent = '0';
        this.victoryScreen.classList.add('hidden');
        
        this.updateDisplay();
    }

    updateDisplay() {
        this.towersDOM.forEach((tower, index) => {
            tower.innerHTML = '';
            this.towers[index].forEach(diskSize => {
                const disk = document.createElement('div');
                disk.className = `disk disk-${diskSize}`;
                disk.draggable = true;
                disk.textContent = diskSize;
                
                disk.addEventListener('dragstart', (e) => this.handleDragStart(e, index, diskSize));
                disk.addEventListener('dragend', (e) => this.handleDragEnd(e));
                
                tower.appendChild(disk);
            });
        });
    }

    handleDragStart(e, towerIndex, diskSize) {
        // 一番上のディスクだけドラッグ可能
        if (this.towers[towerIndex][this.towers[towerIndex].length - 1] === diskSize) {
            this.draggedDisk = diskSize;
            this.draggedFromTower = towerIndex;
            e.target.classList.add('dragging');
        } else {
            e.preventDefault();
        }
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    handleDragOver(e, towerIndex) {
        e.preventDefault();
        document.getElementById(`disks${towerIndex}-story`).style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
    }

    handleDragLeave(e) {
        e.target.style.backgroundColor = '';
    }

    handleDrop(e, towerIndex) {
        e.preventDefault();
        document.getElementById(`disks${towerIndex}-story`).style.backgroundColor = '';

        if (this.draggedDisk === null) return;

        // ルールチェック
        const topDisk = this.towers[towerIndex].length > 0 
            ? this.towers[towerIndex][this.towers[towerIndex].length - 1]
            : Infinity;

        if (this.draggedDisk < topDisk) {
            // 移動実行
            this.towers[this.draggedFromTower].pop();
            this.towers[towerIndex].push(this.draggedDisk);
            this.moves++;
            this.movesDisplay.textContent = this.moves;
            this.history.push({
                from: this.draggedFromTower,
                to: towerIndex,
                disk: this.draggedDisk
            });

            this.updateDisplay();

            // クリア判定
            if (this.towers[2].length === this.diskCount) {
                this.showVictory();
            }
        }

        this.draggedDisk = null;
        this.draggedFromTower = null;
    }

    undo() {
        if (this.history.length === 0) return;

        const lastMove = this.history.pop();
        this.towers[lastMove.to].pop();
        this.towers[lastMove.from].push(lastMove.disk);
        this.moves--;
        this.movesDisplay.textContent = this.moves;

        this.updateDisplay();
    }

    showVictory() {
        const chapter = this.chapter;
        
        // クリア時のセリフ
        const victoryDialogues = {
            1: "👧「やった！できた！」✨",
            2: "🧙「見事じゃ！本当に勇者の力を持っているのか...」",
            3: "🐉「ほほう...本当に強い者よ。」",
            4: "⭐「素晴らしい...君の光は本物だ。」",
            5: "🌟「君は本当の勇者だ。おめでとう！」"
        };

        this.victoryMessage.textContent = victoryDialogues[chapter.id] || chapter.rewardText;

        // 最終成績
        document.getElementById('storyFinalMoves').textContent = this.moves;
        document.getElementById('storyFinalMinMoves').textContent = this.minMoves;

        // クリア時の表情（絵文字キャラクター）
        let victoryEmoji = chapter.character;
        if (chapter.id === 1) victoryEmoji = "😄";
        else if (chapter.id === 2) victoryEmoji = "🧙";
        else if (chapter.id === 3) victoryEmoji = "🐉";
        else if (chapter.id === 4) victoryEmoji = "⭐";
        else if (chapter.id === 5) victoryEmoji = "👑";

        document.getElementById('victoryCharacter').innerHTML = 
            `<div style="font-size: 5em;">${victoryEmoji}</div><p>${chapter.reward}</p>`;

        // ボタン更新
        if (chapter.isFinal) {
            this.storyNextBtn.textContent = '🎉 ゲーム完了！';
        } else {
            this.storyNextBtn.textContent = 'つぎのチャプターへ →';
        }

        this.victoryScreen.classList.remove('hidden');
    }

    nextChapter() {
        const storyController = window.storyController;
        if (!storyController) return;

        if (this.chapter.isFinal) {
            // ゲーム完了
            storyController.showStoryMode();
            alert('🎉 すべてのチャプターをクリアしました！おめでとう！');
        } else {
            // 次のチャプターへ
            storyController.currentChapter++;
            storyController.updateStoryDisplay();
            
            // ストーリーモード画面に戻す
            document.getElementById('gameplayStory').classList.add('hidden');
            document.getElementById('storyMode').classList.remove('hidden');
        }
    }
}

// グローバルで ストーリーコントローラーのインスタンスを保持
window.storyController = null;

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    window.storyController = new StoryModeController();
});
