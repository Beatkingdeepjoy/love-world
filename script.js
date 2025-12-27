const countdownPage = document.getElementById('countdownPage');
const proposalPage = document.getElementById('proposalPage');
const enterBtn = document.getElementById('enterBtn');
const liveClock = document.getElementById('liveClock');
const music = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');

// 1. Clock Logic
function updateClock() {
    const now = new Date();
    let h = now.getHours();
    let m = now.getMinutes().toString().padStart(2, '0');
    let ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    liveClock.textContent = `${h}:${m} ${ampm}`;

    if (h === 11 && m === '11') {
        confetti({ particleCount: 5, spread: 360 }); 
    }
}
setInterval(updateClock, 1000);
updateClock();

// 2. Page Transition
enterBtn.addEventListener('click', () => {
    countdownPage.style.opacity = '0';
    setTimeout(() => {
        countdownPage.classList.remove('active');
        countdownPage.classList.add('hidden');
        proposalPage.classList.remove('hidden');
        proposalPage.classList.add('active');
        window.scrollTo(0, 0);
        music.play();
    }, 500);
});

// 3. Optimized Background Hearts
function createHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.classList.add('heart-particle');
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
    document.getElementById('heart-container').appendChild(heart);
    setTimeout(() => heart.remove(), 5000);
}
setInterval(createHeart, 400);

// 4. "No" Button Escape Logic
const noBtn = document.getElementById('noBtn');
noBtn.addEventListener('mouseover', moveButton);
noBtn.addEventListener('touchstart', moveButton);

function moveButton() {
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 100);
    noBtn.style.position = 'fixed';
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
}

// 5. "Yes" Button Logic
document.getElementById('yesBtn').addEventListener('click', () => {
    confetti({ particleCount: 500, spread: 150, origin: { y: 0.6 } });
    document.getElementById('loveNote').style.display = 'block';
    noBtn.style.display = 'none';
});

// 6. Catch the Hearts Game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = Math.min(350, window.innerWidth - 50);
canvas.height = 300;

let score = 0;
let gameHearts = [];
let basketX = canvas.width / 2;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Basket
    ctx.font = '30px Arial';
    ctx.fillText('🧺', basketX - 15, canvas.height - 10);

    gameHearts.forEach((h, i) => {
        h.y += 3;
        ctx.fillText('❤️', h.x, h.y);

        if (h.y > canvas.height - 30 && h.x > basketX - 30 && h.x < basketX + 30) {
            gameHearts.splice(i, 1);
            score++;
            document.getElementById('score').innerText = `Score: ${score} / 10`;
            if (score === 10) document.getElementById('winBtn').style.display = 'block';
        }
        if (h.y > canvas.height) gameHearts.splice(i, 1);
    });
    requestAnimationFrame(draw);
}

setInterval(() => {
    if (score < 10) gameHearts.push({ x: Math.random() * (canvas.width - 20), y: 0 });
}, 1000);

canvas.addEventListener('touchmove', (e) => {
    const rect = canvas.getBoundingClientRect();
    basketX = e.touches[0].clientX - rect.left;
});
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    basketX = e.clientX - rect.left;
});

draw();

// Music Toggle
musicBtn.addEventListener('click', () => {
    if (music.paused) {
        music.play();
        musicBtn.innerText = '🔇 Pause Music';
    } else {
        music.pause();
        musicBtn.innerText = '🔊 Play Music';
    }
});