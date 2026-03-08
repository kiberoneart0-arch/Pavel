// --- ЛОГИКА ПАДАЮЩИХ ЛЕПЕСТКОВ ---
function createPetals() {
    const container = document.getElementById('petals-container');
    const petalCount = 30; // Количество лепестков

    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        // Случайная позиция и размер
        const size = Math.random() * 15 + 10;
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.left = `${Math.random() * 100}vw`;
        petal.style.animationDuration = `${Math.random() * 3 + 4}s`; // Скорость падения
        petal.style.animationDelay = `${Math.random() * 5}s`;
        
        // Разные цвета лепестков
        const colors = ['#ffb7b2', '#ffdac1', '#e2f0cb', '#b5ead7'];
        petal.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        container.appendChild(petal);
    }
}

// Запускаем лепестки при загрузке
createPetals();


// --- ЛОГИКА ИГРЫ "Собери букет" ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreBoard = document.getElementById('scoreBoard');
const startBtn = document.getElementById('startBtn');
const finalGift = document.getElementById('final-gift');

// Настройки игры
let gameRunning = false;
let score = 0;
let basketX = 0;
let basketWidth = 80;
let basketHeight = 50;
let flowers = [];
let animationId;

// Настройка размера канваса (адаптивность)
function resizeCanvas() {
    // Ограничиваем ширину для мобильных
    const maxWidth = window.innerWidth > 500 ? 500 : window.innerWidth - 40;
    canvas.width = maxWidth;
    canvas.height = 300;
    basketY = canvas.height - 60;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let basketY = canvas.height - 60;

// Управление мышкой
canvas.addEventListener('mousemove', (e) => {
    if (!gameRunning) return;
    const rect = canvas.getBoundingClientRect();
    basketX = e.clientX - rect.left - basketWidth / 2;
});

// Управление тачем (для телефона)
canvas.addEventListener('touchmove', (e) => {
    if (!gameRunning) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    basketX = e.touches[0].clientX - rect.left - basketWidth / 2;
}, { passive: false });

// Класс Цветка
class Flower {
    constructor() {
        this.x = Math.random() * (canvas.width - 20);
        this.y = -20;
        this.speed = Math.random() * 2 + 2; // Скорость падения
        this.color = `hsl(${Math.random() * 360}, 70%, 60%)`; // Случайный цвет
        this.size = 15;
    }

    update() {
        this.y += this.speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // Рисуем простой тюльпан (круг + лепестки)
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        // Стебелек
        ctx.strokeStyle = "#4CAF50";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.size);
        ctx.lineTo(this.x, this.y + this.size + 10);
        ctx.stroke();
    }
}

function drawBasket() {
    ctx.fillStyle = "#8D6E63"; // Коричневая корзинка
    ctx.fillRect(basketX, basketY, basketWidth, basketHeight);
    
    // Ручка корзинки
    ctx.strokeStyle = "#8D6E63";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(basketX + basketWidth/2, basketY, basketWidth/2, Math.PI, 0);
    ctx.stroke();
}

function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Создаем цветы с шансом 5% каждый кадр
    if (Math.random() < 0.05) {
        flowers.push(new Flower());
    }

    // Отрисовка и движение цветов
    for (let i = 0; i < flowers.length; i++) {
        flowers[i].update();
        flowers[i].draw();

        // Проверка столкновения (поймал ли цветок)
        if (
            flowers[i].y + flowers[i].size >= basketY &&
            flowers[i].x >= basketX &&
            flowers[i].x <= basketX + basketWidth
        ) {
            score++;
            scoreBoard.innerText = `Счет: ${score} / 20`;
            flowers.splice(i, 1);
            i--;
            
            // Эффект конфетти при поимке (упрощенно - меняем цвет фона)
            canvas.style.background = `hsl(${Math.random()*360}, 70%, 90%)`;
            setTimeout(() => canvas.style.background = "#e0f7fa", 100);
        }
        
        // Удаление цветов, улетевших вниз
        else if (flowers[i].y > canvas.height) {
            flowers.splice(i, 1);
            i--;
        }
    }

    drawBasket();

    // Проверка победы
    if (score >= 20) {
        endGame();
    } else {
        animationId = requestAnimationFrame(gameLoop);
    }
}

function startGame() {
    score = 0;
    flowers = [];
    scoreBoard.innerText = `Счет: 0 / 20`;
    gameRunning = true;
    startBtn.style.display = 'none'; // Скрываем кнопку
    gameLoop();
}

function endGame() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    alert("Ура! Ты собрала полный букет! ❤️");
    
    // Показываем финальную гифку
    finalGift.classList.remove('hidden');
    finalGift.scrollIntoView({ behavior: 'smooth' });
    
    // Запускаем салют из лепестков
    createPetals(); 
}
