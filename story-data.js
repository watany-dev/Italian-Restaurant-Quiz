// ストーリーモード用のストーリーデータ
const storyChapters = [
    {
        id: 1,
        title: "第1章：不思議な古い城",
        character: "👧",
        characterName: "ルナ（君）",
        narrative: `
            <p>🏰 むかし、あるところに不思議な古い城がありました。</p>
            <p>その城には３つの大きな塔があり、左の塔には古い金のリングが３つ積み重ねられていました。</p>
            <p>👧「わあ、きれい！」</p>
            <p>君は探検のために城にやってきたのです。</p>
            <p>なんと、その金のリングを右の塔に全部移すことができたら、<strong>魔法の宝が手に入る</strong>という魔法がかかっていたのです！</p>
            <p>では、チャレンジしてみましょう！</p>
        `,
        diskCount: 3,
        minMoves: 7,
        reward: "✨",
        rewardText: "金の小さなリング",
        nextChapterIntro: `👧「よし！３つのリングが全部動かせた！次はどこだろう...」`
    },
    {
        id: 2,
        title: "第2章：魔法の森へ",
        character: "🧙",
        characterName: "魔法使いじいさん",
        narrative: `
            <p>🏰 第１章をクリアしたあと、城から出ると、不思議な森が現れました。</p>
            <p>そこには老い<strong>魔法使いじいさん</strong>がいました。</p>
            <p>🧙「よくぞここまで来たな。今度は、４つのリングの謎を解かねばならん」</p>
            <p>👧「４つですか？難しそう...」</p>
            <p>🧙「だいじょうぶ。君ならできる。ルールは同じじゃ。」</p>
            <p>君は森の別の塔でチャレンジします。難易度が上がったぞ！</p>
        `,
        diskCount: 4,
        minMoves: 15,
        reward: "💎",
        rewardText: "緑の宝石",
        nextChapterIntro: `🧙「すばらしい！本当の勇者だ。さらに奥へ進むなら...」`
    },
    {
        id: 3,
        title: "第3章：竜の巣窟",
        character: "🐉",
        characterName: "古い竜",
        narrative: `
            <p>🏰 森を抜けると、大きな山が見えました。その中腹には竜の巣窟があります。</p>
            <p>巣の中には、<strong>とても古い龍</strong>が眠っていました。</p>
            <p>🐉「だれじゃ...わしの宝を狙う者は...」</p>
            <p>竜は優しい龍でした。じつは、この宝は竜自身が千年前に隠した魔法の宝だったのです。</p>
            <p>🐉「５つのリングの謎が解ければ、真の勇者として宝をくれてやろう」</p>
            <p>👧「がんばります！」</p>
            <p>５つのリング...これはむずかしい...</p>
        `,
        diskCount: 5,
        minMoves: 31,
        reward: "🔥",
        rewardText: "炎の結晶",
        nextChapterIntro: `🐉「ふむ...本当に強い心を持っているのじゃ。最後の試練へ行くとよい」`
    },
    {
        id: 4,
        title: "第4章：星の塔",
        character: "⭐",
        characterName: "星の精霊",
        narrative: `
            <p>🏰 竜の巣窟を出ると、夜空が輝き始めました。</p>
            <p>大きな星が１つ、地上に降りてきたのです。</p>
            <p>⭐「私は星の精霊。君の勇気を見てきたよ」</p>
            <p>👧「わあ！本当の星だ！」</p>
            <p>⭐「では、最後の試練。６つのリングを移すことができたら...」</p>
            <p>⭐「すべての宝が君のものになるだろう」</p>
            <p>星の精霊は、笑顔で君を見つめています。</p>
            <p>君は、これまでで一番難しい謎に挑みます！</p>
        `,
        diskCount: 6,
        minMoves: 63,
        reward: "👑",
        rewardText: "勇者の王冠",
        nextChapterIntro: `⭐「君は本当の勇者だ。最後に、一つの真実を教えよう...」`
    },
    {
        id: 5,
        title: "第5章：真実と祝い",
        character: "🎊",
        characterName: "物語の終わり",
        narrative: `
            <p>🏰 すべての試練をクリアしたあなた。</p>
            <p>星の精霊と竜と魔法使いじいさんと、森の妖精たちが集まってきました。</p>
            <p>⭐「実はね、この塔の謎は...昔、この世界を守るために作られた試験なんだ」</p>
            <p>🧙「勇気と知恵を持つ者を見つけるためのね」</p>
            <p>🐉「そして、君がその者だったというわけじゃ」</p>
            <p>👧「えっ...」</p>
            <p>✨ その時、すべての宝が光り始めました。</p>
            <p>あなたは本当の<strong>勇者</strong>として、この世界を守る力を手に入れたのです！</p>
            <p>🎉 <strong>おめでとう！すべてのチャプターをクリアしました！</strong> 🎉</p>
        `,
        diskCount: 7,
        minMoves: 127,
        reward: "🌟",
        rewardText: "伝説の勇者の証",
        isFinal: true
    }
];

// チャプター情報の取得
function getChapter(chapterId) {
    return storyChapters.find(ch => ch.id === chapterId);
}

// すべてのチャプター数
function getTotalChapters() {
    return storyChapters.length;
}
