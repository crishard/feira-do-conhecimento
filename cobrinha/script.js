const canvas = document.getElementById('jogo');
const ctx = canvas.getContext('2d');
const telaFim = document.getElementById('telaFim');
const textoFim = document.getElementById('textoFim');
const botaoReiniciar = document.getElementById('botaoReiniciar');
const elPontos = document.getElementById('pontos');
const elRecorde = document.getElementById('recorde');

const CELULA = 24;
const COLUNAS = canvas.width / CELULA;
const LINHAS = canvas.height / CELULA;
const VELOCIDADE_INICIAL = 140;
const VELOCIDADE_MINIMA = 60;

let cobra, direcao, proximaDirecao, maca, pontos, fimDeJogo, pausado, intervalo;
let recorde = Number(localStorage.getItem('cobrinha_recorde') || 0);

function posicaoLivre() {
  let p;
  do {
    p = { x: Math.floor(Math.random() * COLUNAS), y: Math.floor(Math.random() * LINHAS) };
  } while (cobra.some(s => s.x === p.x && s.y === p.y));
  return p;
}

function estadoInicial() {
  cobra = [
    { x: 5, y: 8 },
    { x: 4, y: 8 },
    { x: 3, y: 8 },
  ];
  direcao = { x: 1, y: 0 };
  proximaDirecao = direcao;
  maca = posicaoLivre();
  pontos = 0;
  fimDeJogo = false;
  pausado = true;
  elPontos.textContent = pontos;
  elRecorde.textContent = recorde;
  telaFim.classList.add('escondido');
  agendarTick();
  desenhar();
}

function velocidadeAtual() {
  return Math.max(VELOCIDADE_MINIMA, VELOCIDADE_INICIAL - pontos * 6);
}

function agendarTick() {
  clearInterval(intervalo);
  intervalo = setInterval(tick, velocidadeAtual());
}

function terminarJogo() {
  fimDeJogo = true;
  clearInterval(intervalo);
  if (pontos > recorde) {
    recorde = pontos;
    localStorage.setItem('cobrinha_recorde', recorde);
  }
  textoFim.textContent = '💥 Fim de jogo — ' + pontos + ' ponto' + (pontos === 1 ? '' : 's');
  telaFim.classList.remove('escondido');
}

function tick() {
  if (pausado || fimDeJogo) return;

  direcao = proximaDirecao;
  const cabeca = { x: cobra[0].x + direcao.x, y: cobra[0].y + direcao.y };

  const bateuParede = cabeca.x < 0 || cabeca.x >= COLUNAS || cabeca.y < 0 || cabeca.y >= LINHAS;
  const bateuCorpo = cobra.some(s => s.x === cabeca.x && s.y === cabeca.y);
  if (bateuParede || bateuCorpo) {
    terminarJogo();
    return;
  }

  cobra.unshift(cabeca);

  if (cabeca.x === maca.x && cabeca.y === maca.y) {
    pontos++;
    elPontos.textContent = pontos;
    elRecorde.textContent = Math.max(pontos, recorde);
    maca = posicaoLivre();
    agendarTick();
  } else {
    cobra.pop();
  }

  desenhar();
}

function celula(x, y, cor, raio = 6) {
  ctx.fillStyle = cor;
  ctx.beginPath();
  ctx.roundRect(x * CELULA + 2, y * CELULA + 2, CELULA - 4, CELULA - 4, raio);
  ctx.fill();
}

function desenhar() {
  ctx.fillStyle = '#050510';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#0e0e1c';
  ctx.lineWidth = 1;
  for (let i = 1; i < COLUNAS; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CELULA, 0);
    ctx.lineTo(i * CELULA, canvas.height);
    ctx.stroke();
  }
  for (let i = 1; i < LINHAS; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * CELULA);
    ctx.lineTo(canvas.width, i * CELULA);
    ctx.stroke();
  }

  celula(maca.x, maca.y, '#f43f5e', 10);

  cobra.forEach((s, i) => {
    const t = i / cobra.length;
    const cor = i === 0 ? '#67e8f9' : `rgb(${124 - t * 40}, ${58 + t * 90}, ${237 - t * 40})`;
    celula(s.x, s.y, cor);
  });

  if (pausado && !fimDeJogo) {
    ctx.fillStyle = 'rgba(5,5,16,0.65)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Pressione ESPAÇO para jogar', canvas.width / 2, canvas.height / 2);
  }
}

const MAPA_TECLAS = {
  ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 },
};

window.addEventListener('keydown', e => {
  if (e.key === ' ') {
    e.preventDefault();
    if (!fimDeJogo) {
      pausado = !pausado;
      desenhar();
    }
    return;
  }

  const nova = MAPA_TECLAS[e.key];
  if (!nova) return;
  e.preventDefault();

  if (pausado && !fimDeJogo) pausado = false;
  const oposta = nova.x === -direcao.x && nova.y === -direcao.y;
  if (!oposta) proximaDirecao = nova;
});

botaoReiniciar.addEventListener('click', estadoInicial);
canvas.addEventListener('click', () => canvas.focus());

estadoInicial();
