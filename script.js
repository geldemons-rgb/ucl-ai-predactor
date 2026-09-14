// Команды с ИИ-силой (на основе твоей картинки)
const teamRatings = {
    "PSG": 88, "Chelsea": 85,
    "Galatasaray": 79, "Liverpool": 91,
    "Real Madrid": 93, "Man City": 92,
    "Atalanta": 83, "Bayern": 90,
    "Newcastle": 84, "Barcelona": 89,
    "Atletico": 86, "Tottenham": 83,
    "Bodø/Glimt": 76, "Sporting CP": 82,
    "Bayer Leverkusen": 87, "Arsenal": 88
};

const delay = 1000; // Пауза между матчами (1 сек)

function playMatch(t1Name, t2Name) {
    const r1 = teamRatings[t1Name] || 80;
    const r2 = teamRatings[t2Name] || 80;

    const chance1 = r1 / (r1 + r2);
    let score1 = 0;
    let score2 = 0;

    for (let i = 0; i < 5; i++) {
        if (Math.random() < chance1 * 0.45) score1++;
        if (Math.random() < (1 - chance1) * 0.45) score2++;
    }

    if (score1 === score2) {
        Math.random() < chance1 ? score1++ : score2++;
    }

    return {
        score1, score2,
        winner: score1 > score2 ? t1Name : t2Name,
        loser: score1 > score2 ? t2Name : t1Name
    };
}

async function processMatch(matchId, nextMatchId, nextSlot) {
    const matchEl = document.getElementById(matchId);
    matchEl.classList.add('active');

    const t1El = matchEl.querySelector('.t1');
    const t2El = matchEl.querySelector('.t2');

    const t1Name = t1El.querySelector('span').innerText;
    const t2Name = t2El.querySelector('span').innerText;

    await new Promise(r => setTimeout(r, delay));

    const result = playMatch(t1Name, t2Name);

    t1El.querySelector('.score').innerText = result.score1;
    t2El.querySelector('.score').innerText = result.score2;

    if (result.winner === t1Name) {
        t1El.classList.add('win');
        t2El.classList.add('loss');
    } else {
        t2El.classList.add('win');
        t1El.classList.add('loss');
    }

    matchEl.classList.remove('active');

    // Переносим победителя в следующий раунд
    if (nextMatchId) {
        const nextMatch = document.getElementById(nextMatchId);
        const nextTeamSlot = nextMatch.querySelector('.' + nextSlot);
        nextTeamSlot.querySelector('span').innerText = result.winner;
    }

    return result.winner;
}

async function startSimulation() {
    document.getElementById('start-btn').disabled = true;
    document.getElementById('champ-title').innerText = '';

    // Сброс старых результатов
    document.querySelectorAll('.team').forEach(el => {
        el.classList.remove('win', 'loss');
    });

    // --- 1/8 ФИНАЛА ---
    await processMatch('m1', 'm9', 't1');
    await processMatch('m2', 'm9', 't2');
    await processMatch('m3', 'm10', 't1');
    await processMatch('m4', 'm10', 't2');

    await processMatch('m5', 'm11', 't1');
    await processMatch('m6', 'm11', 't2');
    await processMatch('m7', 'm12', 't1');
    await processMatch('m8', 'm12', 't2');

    // --- 1/4 ФИНАЛА ---
    await processMatch('m9', 'm13', 't1');
    await processMatch('m10', 'm13', 't2');

    await processMatch('m11', 'm14', 't1');
    await processMatch('m12', 'm14', 't2');

    // --- 1/2 ФИНАЛА ---
    await processMatch('m13', 'm15', 't1');
    await processMatch('m14', 'm15', 't2');

    // --- ФИНАЛ ---
    const champion = await processMatch('m15', null, null);

    document.getElementById('champ-title').innerText = '👑 ЧЕМПИОН: ' + champion;
    document.getElementById('start-btn').disabled = false;
}
