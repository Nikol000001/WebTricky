// --- Estado del Componente (Simulando React) ---
let clickCount = 0;
let history = [{ squares: Array(9).fill(null) }];
let currentMove = 0;

// --- Referencias al DOM ---
const counterBtn = document.getElementById('counter-btn');
const counterText = document.getElementById('counter-text');
const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const historyListEl = document.getElementById('history-list');
const winnerOverlay = document.getElementById('winner-overlay');
const winnerText = document.getElementById('winner-text');

// --- Lógica del Contador Extra ---
counterBtn.addEventListener('click', () => {
    clickCount++;
    counterText.textContent = `Has hecho clic ${clickCount} veces.`;
});

// --- Inicialización del Tablero ---
const squaresEls = [];
for (let i = 0; i < 9; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.addEventListener('click', () => handleSquareClick(i));
    // Insertar antes del overlay
    boardEl.insertBefore(square, winnerOverlay);
    squaresEls.push(square);
}

// --- Función Principal de Renderizado ---
function render() {
    const current = history[currentMove];
    const winnerInfo = calculateWinner(current.squares);
    const winner = winnerInfo ? winnerInfo.winner : null;

    // 1. Actualizar casillas
    current.squares.forEach((val, idx) => {
        squaresEls[idx].textContent = val ? val : '';
        squaresEls[idx].className = 'square'; // reset classes
        if (val === 'X') {
            squaresEls[idx].classList.add('x-mark');
        } else if (val === 'O') {
            squaresEls[idx].classList.add('o-mark');
        }
    });

    // 2. Actualizar Estado y Overlay de Ganador
    if (winner) {
        const winnerColor = winner === 'X' ? 'var(--basket-orange)' : 'var(--purple-light)';
        statusEl.innerHTML = `Ganador: <span style="color: ${winnerColor}">${winner}</span>`;
        
        let winMessage = winner === 'X' ? '¡Ganaste con 🏀!' : '¡Ganó la O! 🏆';
        winnerText.innerHTML = winMessage;
        winnerOverlay.classList.add('active');
    } else if (!current.squares.includes(null)) {
        statusEl.textContent = `¡Es un empate!`;
        winnerText.innerHTML = '¡Empate! 🤝<br><span style="font-size:1.2rem; color: #fff;">Buen juego defensivo</span>';
        winnerOverlay.classList.add('active');
    } else {
        const nextPlayer = currentMove % 2 === 0 ? 'X' : 'O';
        const nextColor = nextPlayer === 'X' ? 'var(--basket-orange)' : 'var(--purple-light)';
        statusEl.innerHTML = `Siguiente jugador: <span style="color: ${nextColor}">${nextPlayer}</span>`;
        winnerOverlay.classList.remove('active');
    }

    // 3. Actualizar Lista de Historial
    historyListEl.innerHTML = '';
    history.forEach((_, move) => {
        const desc = move ? `Ir a la jugada #${move}` : 'Ir al inicio del juego';
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.classList.add('btn');
        if (move === currentMove) {
            btn.classList.add('current-move');
        }
        btn.textContent = desc;
        btn.addEventListener('click', () => jumpTo(move));
        li.appendChild(btn);
        historyListEl.appendChild(li);
    });
}

// --- Manejador de Clic en Casilla ---
function handleSquareClick(i) {
    const current = history[currentMove];
    
    // Si hay ganador o la casilla ya está ocupada, no hacer nada
    if (calculateWinner(current.squares) || current.squares[i]) {
        return;
    }

    // Crear una copia del array de casillas
    const nextSquares = current.squares.slice();
    nextSquares[i] = currentMove % 2 === 0 ? 'X' : 'O';

    // Actualizar historial recortando el futuro si viajamos en el tiempo
    history = history.slice(0, currentMove + 1);
    history.push({ squares: nextSquares });
    currentMove = history.length - 1;
    
    render();
}

// --- Viaje en el Tiempo ---
function jumpTo(move) {
    currentMove = move;
    render();
}

// --- Reiniciar Juego ---
function resetGame() {
    history = [{ squares: Array(9).fill(null) }];
    currentMove = 0;
    render();
}

// --- Lógica de Ganador ---
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontales
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticales
        [0, 4, 8], [2, 4, 6]             // Diagonales
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line: lines[i] };
        }
    }
    return null;
}
