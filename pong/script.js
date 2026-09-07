const canvas = document.getElementById('jogo');
const ctx = canvas.getContext('2d');
const telaFim = document.getElementById('telaFim');
const textoVencedor = document.getElementById('textoVencedor');
const botaoReiniciar = document.getElementById('botaoReiniciar');

const RAQUETE_W = 12;
const RAQUETE_H = 90;
const MARGEM = 20;
const VELOCIDADE_RAQUETE = 7;
const LIMITE_PONTOS = 7;

let r1, r2, bola, pts1, pts2, fimDeJogo, pausado;
const teclas = {};

function estadoInicial() {
  r1 = { x: MARGEM, y: canvas.height / 2 - RAQUETE_H / 2, w: RAQUETE_W, h: RAQUETE_H };
  r2 = { x: canvas.width - MARGEM - RAQUETE_W, y: canvas.height / 2 - RAQUETE_H / 2, w: RAQUETE_W, h: RAQUETE_H };
  bola = { x: canvas.width / 2, y: canvas.height / 2, r: 8, velX: 5, velY: 3 };
  pts1 = 0;
  pts2 = 0;
  fimDeJogo = false;
  pausado = true;
  telaFim.classList.add('escondido');
}

function resetBola() {
  bola.x = canvas.width / 2;
  bola.y = canvas.height / 2;
  bola.velX = (Math.random() > 0.5 ? 1 : -1) * 5;
  bola.velY = (Math.random() - 0.5) * 6;
}

function colide(r) {
  return bola.x - bola.r <= r.x + r.w && bola.x + bola.r >= r.x &&
         bola.y + bola.r >= r.y && bola.y - bola.r <= r.y + r.h;
}

function desenhar() {
  ctx.fillStyle = '#050510';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.setLineDash([10, 10]);
  ctx.strokeStyle = '#1e1e3a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#60a5fa';
  ctx.fillRect(r1.x, r1.y, r1.w, r1.h);

  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(r2.x, r2.y, r2.w, r2.h);

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(bola.x, bola.y, bola.r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 32px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(pts1 + '   ' + pts2, canvas.width / 2, 50);

  if (pausado && !fimDeJogo) {
    ctx.fillStyle = 'rgba(5,5,16,0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('Pressione ESPAÇO para jogar', canvas.width / 2, canvas.height / 2);
  }
}

function terminarJogo(vencedor) {
  fimDeJogo = true;
  textoVencedor.textContent = '🏆 ' + (vencedor === 1 ? 'Jogador 1 🔵' : 'Jogador 2 🟡') + ' venceu!';
  telaFim.classList.remove('escondido');
}

function gameLoop() {
  requestAnimationFrame(gameLoop);
  if (fimDeJogo || pausado) {
    desenhar();
    return;
  }

  if ((teclas['w'] || teclas['W']) && r1.y > 0) r1.y -= VELOCIDADE_RAQUETE;
  if ((teclas['s'] || teclas['S']) && r1.y + RAQUETE_H < canvas.height) r1.y += VELOCIDADE_RAQUETE;
  if (teclas['ArrowUp'] && r2.y > 0) r2.y -= VELOCIDADE_RAQUETE;
  if (teclas['ArrowDown'] && r2.y + RAQUETE_H < canvas.height) r2.y += VELOCIDADE_RAQUETE;

  bola.x += bola.velX;
  bola.y += bola.velY;

  if (bola.y - bola.r <= 0 || bola.y + bola.r >= canvas.height) bola.velY *= -1;

  if (colide(r1) && bola.velX < 0) bola.velX = Math.min(Math.abs(bola.velX) * 1.05, 14);
  if (colide(r2) && bola.velX > 0) bola.velX = -Math.min(Math.abs(bola.velX) * 1.05, 14);

  if (bola.x < 0) {
    pts2++;
    if (pts2 >= LIMITE_PONTOS) terminarJogo(2);
    resetBola();
  } else if (bola.x > canvas.width) {
    pts1++;
    if (pts1 >= LIMITE_PONTOS) terminarJogo(1);
    resetBola();
  }

  desenhar();
}

window.addEventListener('keydown', e => {
  teclas[e.key] = true;
  if ([' ', 'ArrowUp', 'ArrowDown', 'w', 'W', 's', 'S'].includes(e.key)) e.preventDefault();
  if (e.key === ' ' && !fimDeJogo) pausado = !pausado;
});
window.addEventListener('keyup', e => {
  teclas[e.key] = false;
});

botaoReiniciar.addEventListener('click', () => {
  estadoInicial();
});

canvas.addEventListener('click', () => canvas.focus());

estadoInicial();
gameLoop();
