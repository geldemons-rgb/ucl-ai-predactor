const initialTeams = [
    { name: "Реал Мадрид", rating: 92 },
    { name: "Манчестер Сити", rating: 93 },
    { name: "Бавария", rating: 89 },
    { name: "ПСЖ", rating: 87 },
    { name: "Барселона", rating: 88 },
    { name: "Арсенал", rating: 87 },
    { name: "Интер", rating: 86 },
    { name: "Атлетико", rating: 84 },
    { name: "Боруссия Д", rating: 83 },
    { name: "Ювентус", rating: 82 },
    { name: "Ливерпуль", rating: 90 },
    { name: "Челси", rating: 81 },
    { name: "Байер Леверкузен", rating: 86 },
    { name: "Милан", rating: 82 },
    { name: "Бенфика", rating: 80 },
    { name: "Спортинг", rating: 79 }
];

let delay = 1000;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function getAiPrediction(team1, team2) {
    const form1 = (Math.random() * 10 - 5);
    const form2 = (Math.random() * 10 - 5);
    
    const power1 = team1.rating + form1;
    const power2 = team2.rating + form2;

    const total = power1 + power2;
    const prob1 = Math.round((power1 / total) * 100);
    const prob2 = 100 - prob1;

    const predictedWinner = prob1 >= prob2 ? team1.name : team2.name;
    return { prob1, prob2, predictedWinner };
}

function simulateMatch(team1, team2) {
    const chance1 = team1.rating / (team1.rating + team2.rating);
    let score1 = 0;
    let score2 = 0;

    for(let i = 0; i < 5; i++) {
        if (Math.random() < chance1 * 0.4) score1++;
        if (Math.random() < (1 - chance1) * 0.4) score2++;
    }

    if (score1 === score2) {
        Math.random() < chance1 ? score1++ : score2++;
    }

    const winner = score1 > score2 ? team1 : team2;
    return { score1, score2, winner };
}

async function startTournament() {
    document.getElementById('start-btn').disabled = true;
    document.getElementById('winner-box').style.display = 'none';

    ['1/8', '1/4', '1/2', 'final'].forEach(r => {
        const el = document.getElementById(`round-${r}`);
        el.innerHTML = `<div class="round-title">${r === 'final' ? 'Финал' : r + ' Финала'}</div>`;
    });

    let currentTeams = shuffle([...initialTeams]);
    const rounds = ['1/8', '1/4', '1/2', 'final'];

    for (let rIndex = 0; rIndex < rounds.length; rIndex++) {
        const roundName = rounds[rIndex];
        const roundEl = document.getElementById(`round-${roundName}`);
        const nextTeams = [];

        for (let i = 0; i < currentTeams.length; i += 2) {
            const t1 = currentTeams[i];
            const t2 = currentTeams[i+1];

            const pred = getAiPrediction(t1, t2);

            const matchCard = document.createElement('div');
            matchCard.className = 'match-card active';
            matchCard.innerHTML = `
                <div class="team" id="t1-${roundName}-${i}">
                    <span>${t1.name}</span>
                    <span class="score">-</span>
                </div>
                <div class="team" id="t2-${roundName}-${i}">
                    <span>${t2.name}</span>
                    <span class="score">-</span>
                </div>
                <div class="ai-predict">
                    <span>🤖 ИИ:</span>
                    <span><b>${pred.predictedWinner}</b> (${Math.max(pred.prob1, pred.prob2)}%)</span>
                </div>
            `;
            roundEl.appendChild(matchCard);

            await new Promise(res => setTimeout(res, delay));

            const res = simulateMatch(t1, t2);

            const t1El = matchCard.querySelector(`#t1-${roundName}-${i}`);
            const t2El = matchCard.querySelector(`#t2-${roundName}-${i}`);

            t1El.querySelector('.score').innerText = res.score1;
            t2El.querySelector('.score').innerText = res.score2;

            if (res.winner.name === t1.name) {
                t1El.classList.add('winner');
            } else {
                t2El.classList.add('winner');
            }

            matchCard.classList.remove('active');
            nextTeams.push(res.winner);
        }

        currentTeams = nextTeams;
    }

    document.getElementById('winner-name').innerText = currentTeams[0].name;
    document.getElementById('winner-box').style.display = 'block';
    document.getElementById('start-btn').disabled = false;
}
