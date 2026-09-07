const tabuleiro = document.getElementById('tabuleiro');
const buracos = [...document.querySelectorAll('.buraco')];
const elPontos = document.getElementById('pontos');
const elTempo = document.getElementById('tempo');
const elRecorde = document.getElementById('recorde');
const statTempo = elTempo.parentElement;
const tela = document.getElementById('tela');
const telaTitulo = document.getElementById('telaTitulo');
const telaTexto = document.getElementById('telaTexto');
const botao = document.getElementById('botao');

const DURACAO = 30;
const TIPOS = {
  toupeira: { emoji: '🐹', classe: 'toupeira', pontos: 10, chance: 0.74 },
  dourada: { emoji: '🌟', classe: 'dourada', pontos: 30, chance: 0.1 },
  bomba: { emoji: '💣', classe: 'bomba', pontos: -15, chance: 0.16 },
};

let pontos, tempo, combo, jogando, recorde;
let loopSpawn, loopTempo;
const ativos = new Map();

recorde = Number(localStorage.getItem('toupeira_recorde') || 0);
elRecorde.textContent = recorde;

const audio = criarAudio();

function criarAudio() {
  let ctx;
  function tocar(freq, dur, tipo = 'sine', vol = 0.2) {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = tipo;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (e) { /* áudio indisponível */ }
  }
  return {
    acerto: () => tocar(660, 0.12, 'triangle'),
    ouro: () => { tocar(880, 0.1, 'triangle'); setTimeout(() => tocar(1180, 0.14, 'triangle'), 90); },
    erro: () => tocar(120, 0.3, 'sawtooth', 0.25),
    fim: () => { tocar(520, 0.15); setTimeout(() => tocar(390, 0.25), 140); },
  };
}

function sortearTipo() {
  const r = Math.random();
  let acumulado = 0;
  for (const [nome, cfg] of Object.entries(TIPOS)) {
    acumulado += cfg.chance;
    if (r <= acumulado) return nome;
  }
  return 'toupeira';
}

function intervaloSpawn() {
  const progresso = 1 - tempo / DURACAO;
  return 900 - progresso * 480;
}

function tempoVisivel() {
  const progresso = 1 - tempo / DURACAO;
  return 1100 - progresso * 550;
}

function esconder(buraco) {
  const alvo = buraco.querySelector('.alvo');
  alvo.classList.remove('subindo');
  const t = ativos.get(buraco);
  if (t) { clearTimeout(t.timeout); ativos.delete(buraco); }
}

function aparecer() {
  const livres = buracos.filter(b => !ativos.has(b));
  if (!livres.length) return;

  const buraco = livres[Math.floor(Math.random() * livres.length)];
  const nome = sortearTipo();
  const cfg = TIPOS[nome];
  const alvo = buraco.querySelector('.alvo');

  alvo.className = 'alvo ' + cfg.classe;
  alvo.textContent = cfg.emoji;
  buraco.classList.remove('acertado');
  void alvo.offsetWidth;
  alvo.classList.add('subindo');

  const timeout = setTimeout(() => {
    if (nome !== 'bomba') combo = 0;
    esconder(buraco);
  }, tempoVisivel());

  ativos.set(buraco, { nome, cfg, timeout });
}

function textoFlutuante(buraco, texto, cor) {
  const el = document.createElement('span');
  el.className = 'flutuante';
  el.textContent = texto;
  el.style.color = cor;
  el.style.left = buraco.offsetLeft + buraco.offsetWidth / 2 - 20 + 'px';
  el.style.top = buraco.offsetTop + 'px';
  tabuleiro.appendChild(el);
  setTimeout(() => el.remove(), 700);
}

function bater(buraco) {
  if (!jogando) return;
  const item = ativos.get(buraco);
  if (!item) return;

  const alvo = buraco.querySelector('.alvo');
  alvo.classList.remove('subindo');
  buraco.classList.add('acertado');

  if (item.nome === 'bomba') {
    combo = 0;
    pontos = Math.max(0, pontos + item.cfg.pontos);
    textoFlutuante(buraco, item.cfg.pontos, '#f43f5e');
    audio.erro();
    tabuleiro.animate(
      [{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }],
      { duration: 200 }
    );
  } else {
    combo++;
    const ganho = item.cfg.pontos + (combo >= 3 ? (combo - 2) * 5 : 0);
    pontos += ganho;
    textoFlutuante(buraco, '+' + ganho + (combo >= 3 ? ' x' + combo : ''), item.nome === 'dourada' ? '#fbbf24' : '#4ade80');
    item.nome === 'dourada' ? audio.ouro() : audio.acerto();
  }

  elPontos.textContent = pontos;
  esconder(buraco);
}

function tique() {
  tempo--;
  elTempo.textContent = tempo;
  statTempo.classList.toggle('alerta', tempo <= 10);
  if (tempo <= 0) terminar();
}

function iniciar() {
  pontos = 0;
  tempo = DURACAO;
  combo = 0;
  jogando = true;
  elPontos.textContent = 0;
  elTempo.textContent = tempo;
  statTempo.classList.remove('alerta');
  tela.classList.add('escondido');

  loopTempo = setInterval(tique, 1000);
  const agendar = () => {
    if (!jogando) return;
    aparecer();
    loopSpawn = setTimeout(agendar, intervaloSpawn());
  };
  agendar();
}

function terminar() {
  jogando = false;
  clearInterval(loopTempo);
  clearTimeout(loopSpawn);
  buracos.forEach(esconder);
  audio.fim();

  const novoRecorde = pontos > recorde;
  if (novoRecorde) {
    recorde = pontos;
    localStorage.setItem('toupeira_recorde', recorde);
    elRecorde.textContent = recorde;
  }

  telaTitulo.textContent = novoRecorde ? '🏆 Novo recorde!' : 'Fim de jogo!';
  telaTexto.innerHTML = 'Você fez <strong>' + pontos + '</strong> pontos.';
  botao.textContent = 'Jogar de novo';
  tela.classList.remove('escondido');
}

buracos.forEach(b => {
  b.addEventListener('pointerdown', () => bater(b));
  b.addEventListener('click', () => bater(b));
});

botao.addEventListener('click', iniciar);
