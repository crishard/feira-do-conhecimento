const canvas = document.getElementById('jogo');
const ctx = canvas.getContext('2d');
const telaFim = document.getElementById('telaFim');
const textoFim = document.getElementById('textoFim');
const botaoReiniciar = document.getElementById('botaoReiniciar');
const elPontos = document.getElementById('pontos');
const elVidas = document.getElementById('vidas');
const elNivel = document.getElementById('nivel');

const RAQUETE_W = 96;
const RAQUETE_H = 12;
const RAQUETE_Y = canvas.height - 30;
const VELOCIDADE_RAQUETE = 8;
const BOLA_R = 7;
const COLS = 10;
const LINHAS_BLOCO = 6;
const BLOCO_W = canvas.width / COLS;
const BLOCO_H = 26;
const TOPO_BLOCOS = 60;
const CORES_LINHA = ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#22d3ee', '#a78bfa'];

let raquete, bola, blocos, pontos, vidas, nivel, fimDeJogo, pausado, bolaPresa;
const teclas = {};

function montarBlocos() {
  const lista = [];
  for (let l = 0; l < LINHAS_BLOCO; l++) {
    for (let c = 0; c < COLS; c++) {
      lista.push({
        x: c * BLOCO_W,
        y: TOPO_BLOCOS + l * BLOCO_H,
        cor: CORES_LINHA[l % CORES_LINHA.length],
        vivo: true,
      });
    }
  }
  return lista;
}

function resetBolaRaquete() {
  raquete = { x: canvas.width / 2 - RAQUETE_W / 2 };
  const velBase = 4 + nivel * 0.6;
  bola = { x: canvas.width / 2, y: RAQUETE_Y - BOLA_R, vx: velBase * 0.6, vy: -velBase };
  bolaPresa = true;
}

function estadoInicial() {
  pontos = 0;
  vidas = 3;
  nivel = 1;
  fimDeJogo = false;
  pausado = false;
  blocos = montarBlocos();
  resetBolaRaquete();
  atualizarPlacar();
  telaFim.classList.add('escondido');
}

function atualizarPlacar() {
  elPontos.textContent = pontos;
  elVidas.textContent = vidas;
  elNivel.textContent = nivel;
}

function terminarJogo(venceu) {
  fimDeJogo = true;
  textoFim.textContent = venceu
    ? '🏆 Você limpou tudo! ' + pontos + ' pontos'
    : '💥 Fim de jogo — ' + pontos + ' pontos';
  telaFim.classList.remove('escondido');
}

function proximoNivel() {
  nivel++;
  blocos = montarBlocos();
  resetBolaRaquete();
  atualizarPlacar();
}

function perderVida() {
  vidas--;
  atualizarPlacar();
  if (vidas <= 0) {
    terminarJogo(false);
  } else {
    resetBolaRaquete();
  }
}

function baterBloco() {
  for (const b of blocos) {
    if (!b.vivo) continue;
    const dentro = bola.x + BOLA_R > b.x && bola.x - BOLA_R < b.x + BLOCO_W &&
                   bola.y + BOLA_R > b.y && bola.y - BOLA_R < b.y + BLOCO_H;
    if (!dentro) continue;

    b.vivo = false;
    pontos += 10;
    atualizarPlacar();

    const invadeX = Math.min(bola.x + BOLA_R - b.x, b.x + BLOCO_W - (bola.x - BOLA_R));
    const invadeY = Math.min(bola.y + BOLA_R - b.y, b.y + BLOCO_H - (bola.y - BOLA_R));
    if (invadeX < invadeY) bola.vx *= -1;
    else bola.vy *= -1;

    if (blocos.every(bl => !bl.vivo)) {
      if (nivel >= 5) terminarJogo(true);
      else proximoNivel();
    }
    return;
  }
}

function atualizar() {
  if ((teclas['ArrowLeft'] || teclas['a']) && raquete.x > 0) raquete.x -= VELOCIDADE_RAQUETE;
  if ((teclas['ArrowRight'] || teclas['d']) && raquete.x + RAQUETE_W < canvas.width) raquete.x += VELOCIDADE_RAQUETE;

  if (bolaPresa) {
    bola.x = raquete.x + RAQUETE_W / 2;
    bola.y = RAQUETE_Y - BOLA_R;
    return;
  }

  bola.x += bola.vx;
  bola.y += bola.vy;

  if (bola.x - BOLA_R <= 0) { bola.x = BOLA_R; bola.vx *= -1; }
  if (bola.x + BOLA_R >= canvas.width) { bola.x = canvas.width - BOLA_R; bola.vx *= -1; }
  if (bola.y - BOLA_R <= 0) { bola.y = BOLA_R; bola.vy *= -1; }

  const naRaquete = bola.vy > 0 &&
    bola.y + BOLA_R >= RAQUETE_Y && bola.y + BOLA_R <= RAQUETE_Y + RAQUETE_H + 6 &&
    bola.x >= raquete.x && bola.x <= raquete.x + RAQUETE_W;
  if (naRaquete) {
    const rel = (bola.x - (raquete.x + RAQUETE_W / 2)) / (RAQUETE_W / 2);
    const velocidade = Math.hypot(bola.vx, bola.vy);
    const angulo = rel * (Math.PI / 3);
    bola.vx = velocidade * Math.sin(angulo);
    bola.vy = -Math.abs(velocidade * Math.cos(angulo));
  }

  if (bola.y - BOLA_R > canvas.height) perderVida();

  baterBloco();
}

function desenhar() {
  ctx.fillStyle = '#050510';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const b of blocos) {
    if (!b.vivo) continue;
    ctx.fillStyle = b.cor;
    ctx.beginPath();
    ctx.roundRect(b.x + 2, b.y + 2, BLOCO_W - 4, BLOCO_H - 4, 5);
    ctx.fill();
  }

  ctx.fillStyle = '#67e8f9';
  ctx.beginPath();
  ctx.roundRect(raquete.x, RAQUETE_Y, RAQUETE_W, RAQUETE_H, 6);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(bola.x, bola.y, BOLA_R, 0, Math.PI * 2);
  ctx.fill();

  if (bolaPresa && !fimDeJogo) {
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Pressione ESPAÇO para lançar', canvas.width / 2, canvas.height / 2);
  }

  if (pausado && !fimDeJogo && !bolaPresa) {
    ctx.fillStyle = 'rgba(5,5,16,0.65)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Pausado', canvas.width / 2, canvas.height / 2);
  }
}

function loop() {
  requestAnimationFrame(loop);
  if (!fimDeJogo && !pausado) atualizar();
  desenhar();
}

window.addEventListener('keydown', e => {
  if (['ArrowLeft', 'ArrowRight', ' ', 'a', 'd'].includes(e.key)) e.preventDefault();
  teclas[e.key] = true;

  if (e.key === ' ' && !fimDeJogo) {
    if (bolaPresa) bolaPresa = false;
    else pausado = !pausado;
  }
});

window.addEventListener('keyup', e => { teclas[e.key] = false; });

canvas.addEventListener('mousemove', e => {
  const escala = canvas.width / canvas.getBoundingClientRect().width;
  const x = (e.clientX - canvas.getBoundingClientRect().left) * escala;
  raquete.x = Math.max(0, Math.min(canvas.width - RAQUETE_W, x - RAQUETE_W / 2));
});

canvas.addEventListener('click', () => {
  canvas.focus();
  if (bolaPresa && !fimDeJogo) bolaPresa = false;
});

botaoReiniciar.addEventListener('click', estadoInicial);

estadoInicial();
loop();
