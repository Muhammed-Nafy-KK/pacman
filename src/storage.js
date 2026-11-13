
const STORAGE_KEY = "pixelTreasureHighScores";

export function getScores() {

    try {
        const data = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );

        return Array.isArray(data) ? data : [];

    } catch {
        return [];
    }
}

export function saveScore(score, level) {

    const scores = getScores();

    scores.push({
        score,
        level,
        date: new Date().toISOString()
    });

    scores.sort((a, b) => b.score - a.score);

    const topScores = scores.slice(0, 10);

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(topScores)
    );

    return topScores;
}

export function getBestScore() {

    const scores = getScores();

    return scores.length
        ? scores[0].score
        : 0;
}
