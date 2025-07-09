const allNumbers = generateCandidates();
let history = [];

function generateCandidates() {
  let nums = [];
  for (let i = 0; i < 1000; i++) {
    const s = i.toString().padStart(3, '0');
    if (new Set(s).size === 3) nums.push(s);
  }
  return nums;
}

function judge(a, b) {
  let hit = 0, blow = 0;
  for (let i = 0; i < 3; i++) {
    if (a[i] === b[i]) {
      hit++;
    } else if (b.includes(a[i])) {
      blow++;
    }
  }
  return { hit, blow };
}

function addResult() {
  const guess = document.getElementById('guess').value;
  const hit = parseInt(document.getElementById('hit').value);
  const blow = parseInt(document.getElementById('blow').value);

  if (!/^\d{3}$/.test(guess) || new Set(guess).size !== 3) {
    alert("3桁の異なる数字を入力してください（例: 123）");
    return;
  }
  if (isNaN(hit) || isNaN(blow)) {
    alert("HitとBlowは数値で入力してください");
    return;
  }

  history.push({ guess, hit, blow });
  updateCandidates();
  updateHistory();
  document.getElementById('guess').value = '';
  document.getElementById('hit').value = '';
  document.getElementById('blow').value = '';
}

function updateCandidates() {
  let filtered = allNumbers.filter(candidate => {
    return history.every(({ guess, hit, blow }) => {
      const result = judge(candidate, guess);
      return result.hit === hit && result.blow === blow;
    });
  });

  let scores = filtered.map(n => {
    let score = 0;
    for (let c of filtered) {
      const r = judge(n, c);
      score += r.hit * 3 + r.blow;
    }
    return { num: n, score };
  });

  scores.sort((a, b) => b.score - a.score);
  const list = document.getElementById("candidates");
  list.innerHTML = "";

  const maxScore = scores.length > 0 ? scores[0].score : 1;

  for (let i = 0; i < Math.min(10, scores.length); i++) {
    const { num, score } = scores[i];
    const percent = ((score / maxScore) * 100).toFixed(1);
    const li = document.createElement("li");
    li.textContent = `${num}（期待値: ${percent}%）`;
    list.appendChild(li);
  }

  if (filtered.length === 1) {
    const li = document.createElement("li");
    li.textContent = `正解 が${filtered[0]} の可能性が高い！`;
    li.style.color = 'green';
    list.appendChild(li);
  } else if (filtered.length === 0) {
    const li = document.createElement("li");
    li.textContent = `条件を満たす候補が存在しません。入力ミスの可能性があります。`;
    li.style.color = 'red';
    list.appendChild(li);
  }
}

function updateHistory() {
  const list = document.getElementById("history");
  list.innerHTML = "";
  for (let { guess, hit, blow } of history) {
    const li = document.createElement("li");
    li.textContent = `推測: ${guess} → ${hit} Hit / ${blow} Blow`;
    list.appendChild(li);
  }
}
