'use strict';

const canvas = document.getElementById('tabuleiro');
const ctx = canvas.getContext('2d');
const elNiveis = document.getElementById('niveis');
const elConceitoNome = document.getElementById('conceitoNome');
const elConceitoTexto = document.getElementById('conceitoTexto');
const elPrograma = document.getElementById('programa');
const elTrilha = document.getElementById('trilha');
const elFeedback = document.getElementById('feedback');
const elEstrelas = document.getElementById('estrelas');
const elMetaTexto = document.getElementById('metaTexto');
const elVelocidade = document.getElementById('velocidade');

// Direções: 0=Norte 1=Leste 2=Sul 3=Oeste
const DELTA = [[0, -1], [1, 0], [0, 1], [-1, 0]];

const NIVEIS = [
  {
    nome: 'Linha reta',
    conceito: 'Sequência',
    texto: 'Um programa é uma lista de comandos executados em ordem, de cima para baixo.',
    dir: 1,
    meta: 3,
    mapa: [
      '....',
      'R..G',
      '....',
    ],
  },
  {
    nome: 'A curva',
    conceito: 'Sequência + direção',
    texto: 'O robô só anda para a frente. Para mudar de rumo é preciso virar antes de andar.',
    dir: 1,
    meta: 5,
    mapa: [
      '..G',
      '.#.',
      'R..',
    ],
  },
  {
    nome: 'O corredor longo',
    conceito: 'Repetição (laço)',
    texto: 'Repetir o mesmo comando muitas vezes desperdiça blocos. O laço "Repetir" faz o computador contar por você.',
    dir: 1,
    meta: 2,
    mapa: [
      '###########',
      'R.........G',
      '###########',
    ],
  },
  {
    nome: 'Coleta em série',
    conceito: 'Laço com vários comandos',
    texto: 'Dentro de um "Repetir" cabe um bloco inteiro de comandos — um padrão que se repete.',
    dir: 1,
    meta: 4,
    mapa: [
      '#######',
      'R*.*.*G',
      '#######',
    ],
  },
  {
    nome: 'Labirinto',
    conceito: 'Decompor o problema',
    texto: 'Problemas grandes ficam fáceis quando divididos em trechos menores, um de cada vez.',
    dir: 2,
    meta: 8,
    mapa: [
      '#####',
      '#R..#',
      '#.#.#',
      '#.#G#',
      '#...#',
      '#####',
    ],
  },
  {
    nome: 'Conserte o robô',
    conceito: 'Depuração (debug)',
    texto: 'O programa abaixo já está montado, mas tem um erro. Ache o bloco errado, remova ou ajuste e rode de novo.',
    dir: 1,
    meta: 4,
    mapa: [
      '#####',
      '#R..#',
      '#..G#',
      '#####',
    ],
    preprograma: [
      { tipo: 'frente' }, { tipo: 'frente' }, { tipo: 'frente' },
      { tipo: 'dir' }, { tipo: 'frente' },
    ],
  },
];

let idSeq = 1;
const novoId = () => idSeq++;

let nivelAtual = 0;
let nivelCustom = null;
let programa = [];
let containerAtivo = programa;
let caminho = [];
let completos = JSON.parse(localStorage.getItem('trilha_completos') || '[]');

let mapa, robo, inicioRobo, cristais, objetivo, cols, rows;
let rodando = false;
let passos = [];
let indicePasso = 0;
let timer = null;

// ---------- Carregar nível ----------

function nivelInfo() {
  return nivelCustom || NIVEIS[nivelAtual];
}

function carregarNivel() {
  const info = nivelInfo();
  mapa = info.mapa.map(l => l.split(''));
  rows = mapa.length;
  cols = mapa[0].length;
  cristais = new Set();
  robo = null;
  objetivo = null;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const c = mapa[y][x];
      if (c === 'R') { robo = { x, y, dir: info.dir }; mapa[y][x] = '.'; }
      else if (c === '*') { cristais.add(x + ',' + y); mapa[y][x] = '.'; }
      else if (c === 'G') { objetivo = { x, y }; mapa[y][x] = '.'; }
    }
  }
  inicioRobo = { ...robo };
  cristaisIniciais = new Set(cristais);

  programa = [];
  if (info.preprograma) programa = info.preprograma.map(clonarNo);
  containerAtivo = programa;
  caminho = [];

  elConceitoNome.textContent = 'Conceito: ' + info.conceito;
  elConceitoTexto.textContent = info.texto;
  pararExecucao();
  msg('info', info.preprograma ? 'Rode o programa e observe onde o robô trava.' : 'Monte o programa e clique em Rodar.');
  desenharNiveis();
  render();
}

let cristaisIniciais = new Set();

function clonarNo(no) {
  if (no.tipo === 'repetir') {
    return { id: novoId(), tipo: 'repetir', vezes: no.vezes || 2, corpo: (no.corpo || []).map(clonarNo) };
  }
  return { id: novoId(), tipo: no.tipo };
}

// ---------- Programa (árvore de blocos) ----------

const ROTULOS = {
  frente: '⬆️ Andar para a frente',
  esq: '↺ Virar à esquerda',
  dir: '↻ Virar à direita',
  coletar: '💎 Coletar cristal',
};

function adicionarComando(cmd) {
  if (rodando) return;
  if (cmd === 'repetir') {
    const bloco = { id: novoId(), tipo: 'repetir', vezes: 2, corpo: [] };
    containerAtivo.push(bloco);
    caminho.push(bloco);
    containerAtivo = bloco.corpo;
  } else {
    containerAtivo.push({ id: novoId(), tipo: cmd });
  }
  render();
}

function removerNo(id) {
  if (rodando) return;
  const remover = (lista) => {
    const i = lista.findIndex(n => n.id === id);
    if (i >= 0) {
      const [rm] = lista.splice(i, 1);
      if (caminho.includes(rm)) {
        const corte = caminho.indexOf(rm);
        caminho = caminho.slice(0, corte);
        containerAtivo = caminho.length ? caminho[caminho.length - 1].corpo : programa;
      }
      return true;
    }
    return lista.some(n => n.tipo === 'repetir' && remover(n.corpo));
  };
  remover(programa);
  render();
}

function irParaContainer(indice) {
  if (rodando) return;
  caminho = caminho.slice(0, indice);
  containerAtivo = caminho.length ? caminho[caminho.length - 1].corpo : programa;
  render();
}

function entrarNoRepetir(bloco) {
  if (rodando) return;
  const idx = caminho.indexOf(bloco);
  if (idx >= 0) caminho = caminho.slice(0, idx + 1);
  else caminho.push(bloco);
  containerAtivo = bloco.corpo;
  render();
}

function contarBlocos(lista) {
  return lista.reduce((t, n) => t + 1 + (n.tipo === 'repetir' ? contarBlocos(n.corpo) : 0), 0);
}

// ---------- Compilação e execução ----------

function compilar(lista, saida, limite) {
  for (const no of lista) {
    if (saida.length > limite) return;
    if (no.tipo === 'repetir') {
      for (let i = 0; i < no.vezes; i++) compilar(no.corpo, saida, limite);
    } else {
      saida.push(no);
    }
  }
}

function rodar(passoAPasso) {
  if (rodando && !passoAPasso) return;
  if (!rodando) {
    const totalBlocos = contarBlocos(programa);
    if (totalBlocos === 0) { msg('erro', 'O programa está vazio.'); return; }
    passos = [];
    compilar(programa, passos, 600);
    if (passos.length === 0) { msg('erro', 'Nenhum comando para executar.'); return; }
    indicePasso = 0;
    robo = { ...inicioRobo };
    cristais = new Set(cristaisIniciais);
    rodando = true;
    msg('info', 'Executando...');
  }

  if (passoAPasso) {
    executarUm();
    render();
    if (indicePasso >= passos.length) finalizar();
  } else {
    iniciarLoop();
  }
}

function iniciarLoop() {
  clearInterval(timer);
  timer = setInterval(() => {
    executarUm();
    render();
    if (indicePasso >= passos.length || !rodando) {
      clearInterval(timer);
      if (rodando) finalizar();
    }
  }, Number(elVelocidade.value));
}

function executarUm() {
  if (indicePasso >= passos.length) return;
  const no = passos[indicePasso];
  indicePasso++;

  if (no.tipo === 'esq') robo.dir = (robo.dir + 3) % 4;
  else if (no.tipo === 'dir') robo.dir = (robo.dir + 1) % 4;
  else if (no.tipo === 'frente') {
    const [dx, dy] = DELTA[robo.dir];
    const nx = robo.x + dx, ny = robo.y + dy;
    if (nx < 0 || ny < 0 || nx >= cols || ny >= rows || mapa[ny][nx] === '#') {
      rodando = false;
      indicePasso = passos.length;
      msg('erro', '💥 O robô bateu na parede! Reveja a sequência de comandos.');
      return;
    }
    robo.x = nx; robo.y = ny;
  } else if (no.tipo === 'coletar') {
    const chave = robo.x + ',' + robo.y;
    if (cristais.has(chave)) cristais.delete(chave);
    else msg('info', 'Não havia cristal nessa casa — o comando "Coletar" foi ignorado.');
  }
}

function finalizar() {
  rodando = false;
  clearInterval(timer);
  const noObjetivo = robo.x === objetivo.x && robo.y === objetivo.y;
  const tudoColetado = cristais.size === 0;

  if (noObjetivo && tudoColetado) {
    const blocos = contarBlocos(programa);
    const meta = nivelInfo().meta;
    let estrelas = 1;
    if (blocos <= meta) estrelas = 3;
    else if (blocos <= meta + 2) estrelas = 2;
    mostrarEstrelas(estrelas);
    msg('ok', `✅ Chegou! Usou ${blocos} bloco(s). ` +
      (estrelas === 3 ? 'Solução ótima! ★★★' : `A meta é ${meta}. Tente deixar mais enxuto.`));
    if (!nivelCustom && !completos.includes(nivelAtual)) {
      completos.push(nivelAtual);
      localStorage.setItem('trilha_completos', JSON.stringify(completos));
      desenharNiveis();
    }
  } else if (noObjetivo && !tudoColetado) {
    msg('erro', `Chegou ao objetivo, mas faltaram ${cristais.size} cristal(is).`);
  } else {
    msg('erro', 'O programa terminou longe do objetivo 🏁. Ajuste os comandos.');
  }
}

function pararExecucao() {
  rodando = false;
  clearInterval(timer);
  passos = [];
  indicePasso = 0;
}

function reiniciar() {
  pararExecucao();
  robo = { ...inicioRobo };
  cristais = new Set(cristaisIniciais);
  mostrarEstrelas(0);
  msg('info', 'Tabuleiro reiniciado.');
  render();
}

function limpar() {
  if (rodando) return;
  programa = [];
  containerAtivo = programa;
  caminho = [];
  render();
}

// ---------- Render ----------

function msg(tipo, texto) {
  elFeedback.className = 'feedback ' + tipo;
  elFeedback.textContent = texto;
}

function mostrarEstrelas(n) {
  elEstrelas.textContent = '★★★☆☆☆'.slice(3 - n, 6 - n);
}

function desenharNiveis() {
  elNiveis.innerHTML = '';
  NIVEIS.forEach((n, i) => {
    const b = document.createElement('button');
    b.textContent = (i + 1) + '. ' + n.nome;
    if (i === nivelAtual && !nivelCustom) b.classList.add('atual');
    if (completos.includes(i)) b.classList.add('completo');
    b.onclick = () => { nivelCustom = null; nivelAtual = i; carregarNivel(); };
    elNiveis.appendChild(b);
  });
  if (nivelCustom) {
    const b = document.createElement('button');
    b.textContent = '★ Desafio criado';
    b.classList.add('atual');
    elNiveis.appendChild(b);
  }
}

function render() {
  renderTrilha();
  renderPrograma();
  renderCanvas();
  elMetaTexto.textContent = 'meta: ' + nivelInfo().meta + ' blocos · seu programa: ' + contarBlocos(programa);
}

function renderTrilha() {
  elTrilha.innerHTML = '';
  const add = (txt, fn, atual) => {
    const s = document.createElement('span');
    s.textContent = txt;
    if (atual) s.classList.add('atual');
    else if (fn) s.onclick = fn;
    elTrilha.appendChild(s);
  };
  add('Programa', () => irParaContainer(0), caminho.length === 0);
  caminho.forEach((bloco, i) => {
    const sep = document.createElement('span');
    sep.textContent = ' › ';
    sep.className = 'sep';
    elTrilha.appendChild(sep);
    add('Repetir ×' + bloco.vezes, () => irParaContainer(i + 1), i === caminho.length - 1);
  });
}

function noAtivoId() {
  return rodando && indicePasso > 0 && indicePasso <= passos.length
    ? passos[indicePasso - 1].id : null;
}

function renderPrograma() {
  elPrograma.innerHTML = '';
  const ativo = noAtivoId();
  const montarLista = (lista, alvo, numeracaoRaiz) => {
    lista.forEach((no, i) => {
      const li = document.createElement('li');
      if (no.tipo === 'repetir') {
        li.className = 'bloco bloco-repetir';
        if (no.corpo === containerAtivo) li.classList.add('container-ativo');
        const cabeca = document.createElement('div');
        cabeca.className = 'cabeca selecionavel';
        cabeca.onclick = (e) => { if (e.target.tagName !== 'BUTTON') entrarNoRepetir(no); };
        cabeca.innerHTML = `<span class="num">${numeracaoRaiz ? i + 1 : ''}</span>
          <span class="rotulo">🔁 Repetir</span>`;
        const contador = document.createElement('span');
        contador.className = 'contador';
        const menos = document.createElement('button');
        menos.textContent = '−';
        menos.onclick = () => { if (no.vezes > 1) { no.vezes--; render(); } };
        const vezes = document.createElement('strong');
        vezes.textContent = '×' + no.vezes;
        const mais = document.createElement('button');
        mais.textContent = '+';
        mais.onclick = () => { if (no.vezes < 20) { no.vezes++; render(); } };
        contador.append(menos, vezes, mais);
        const x = document.createElement('button');
        x.className = 'x';
        x.textContent = '✕';
        x.onclick = () => removerNo(no.id);
        cabeca.append(contador, x);
        li.appendChild(cabeca);

        const corpo = document.createElement('ol');
        corpo.className = 'corpo';
        corpo.onclick = (e) => { if (e.target === corpo) entrarNoRepetir(no); };
        montarLista(no.corpo, corpo, false);
        li.appendChild(corpo);
      } else {
        li.className = 'bloco';
        if (no.id === ativo) li.classList.add('ativo');
        li.innerHTML = `<span class="num">${numeracaoRaiz ? i + 1 : '•'}</span>
          <span class="rotulo">${ROTULOS[no.tipo]}</span>`;
        const x = document.createElement('button');
        x.className = 'x';
        x.textContent = '✕';
        x.onclick = () => removerNo(no.id);
        li.appendChild(x);
      }
      alvo.appendChild(li);
    });
  };
  montarLista(programa, elPrograma, true);
}

function renderCanvas() {
  const tam = Math.floor(Math.min(canvas.width / cols, canvas.height / rows));
  const offX = (canvas.width - tam * cols) / 2;
  const offY = (canvas.height - tam * rows) / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const px = offX + x * tam, py = offY + y * tam;
      if (mapa[y][x] === '#') {
        ctx.fillStyle = '#3a3a5c';
        ctx.fillRect(px + 1, py + 1, tam - 2, tam - 2);
        ctx.fillStyle = '#4a4a72';
        ctx.fillRect(px + 1, py + 1, tam - 2, Math.max(3, tam * 0.14));
      } else {
        ctx.fillStyle = (x + y) % 2 ? '#101024' : '#0c0c1c';
        ctx.fillRect(px, py, tam, tam);
      }
    }
  }

  // objetivo
  if (objetivo) {
    const px = offX + objetivo.x * tam, py = offY + objetivo.y * tam;
    ctx.fillStyle = 'rgba(16,185,129,0.18)';
    ctx.fillRect(px, py, tam, tam);
    ctx.font = `${tam * 0.55}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏁', px + tam / 2, py + tam / 2 + 2);
  }

  // cristais
  ctx.font = `${tam * 0.5}px serif`;
  cristais.forEach(chave => {
    const [cx, cy] = chave.split(',').map(Number);
    ctx.fillText('💎', offX + cx * tam + tam / 2, offY + cy * tam + tam / 2 + 2);
  });

  // robô
  if (robo) {
    const cx = offX + robo.x * tam + tam / 2;
    const cy = offY + robo.y * tam + tam / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(robo.dir * Math.PI / 2);
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.moveTo(0, -tam * 0.34);
    ctx.lineTo(tam * 0.3, tam * 0.3);
    ctx.lineTo(-tam * 0.3, tam * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#67e8f9';
    ctx.beginPath();
    ctx.arc(0, -tam * 0.02, tam * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ---------- Modo criar ----------

const criarPainel = document.getElementById('criarPainel');
let modoCriar = false;
let tinta = 'parede';
let dirCriar = 1;
let mapaCriar;

function abrirCriar() {
  modoCriar = true;
  criarPainel.classList.remove('escondido');
  mapaCriar = Array.from({ length: 7 }, () => Array(9).fill('.'));
  mapaCriar[3][0] = 'R';
  mapaCriar[3][8] = 'G';
  dirCriar = 1;
  aplicarMapaCriar();
  msg('info', 'Modo criar: pinte o tabuleiro e gere um código para compartilhar.');
}

function sairCriar() {
  modoCriar = false;
  criarPainel.classList.add('escondido');
  if (!nivelCustom) carregarNivel();
}

function aplicarMapaCriar() {
  nivelCustom = {
    nome: 'Desafio criado',
    conceito: 'Desafio da turma',
    texto: 'Um desafio montado por estudantes. Resolva com o menor número de blocos.',
    dir: dirCriar,
    meta: 6,
    mapa: mapaCriar.map(l => l.join('')),
  };
  carregarNivel();
}

function cliqueCanvas(ev) {
  if (!modoCriar) return;
  const r = canvas.getBoundingClientRect();
  const escala = canvas.width / r.width;
  const mx = (ev.clientX - r.left) * escala;
  const my = (ev.clientY - r.top) * escala;
  const tam = Math.floor(Math.min(canvas.width / 9, canvas.height / 7));
  const offX = (canvas.width - tam * 9) / 2;
  const offY = (canvas.height - tam * 7) / 2;
  const gx = Math.floor((mx - offX) / tam);
  const gy = Math.floor((my - offY) / tam);
  if (gx < 0 || gy < 0 || gx >= 9 || gy >= 7) return;

  const limparTipo = (t) => mapaCriar.forEach(row => row.forEach((c, i) => { if (c === t) row[i] = '.'; }));

  if (tinta === 'apagar') mapaCriar[gy][gx] = '.';
  else if (tinta === 'parede') mapaCriar[gy][gx] = mapaCriar[gy][gx] === '#' ? '.' : '#';
  else if (tinta === 'cristal') mapaCriar[gy][gx] = mapaCriar[gy][gx] === '*' ? '.' : '*';
  else if (tinta === 'objetivo') { limparTipo('G'); mapaCriar[gy][gx] = 'G'; }
  else if (tinta === 'robo') { limparTipo('R'); mapaCriar[gy][gx] = 'R'; }
  aplicarMapaCriar();
}

function gerarCodigo() {
  const bruto = dirCriar + '|' + mapaCriar.map(l => l.join('')).join('/');
  const codigo = 'TC' + btoa(unescape(encodeURIComponent(bruto))).replace(/=/g, '');
  document.getElementById('codigoDesafio').value = codigo;
  navigator.clipboard?.writeText(codigo).catch(() => {});
  msg('ok', 'Código gerado e copiado! Cole no campo de outra máquina para carregar o desafio.');
}

function carregarCodigo() {
  const codigo = document.getElementById('codigoDesafio').value.trim();
  try {
    if (!codigo.startsWith('TC')) throw new Error();
    const bruto = decodeURIComponent(escape(atob(codigo.slice(2))));
    const [d, corpo] = bruto.split('|');
    const linhas = corpo.split('/');
    if (linhas.length < 2) throw new Error();
    dirCriar = Number(d) % 4;
    mapaCriar = linhas.map(l => l.split(''));
    aplicarMapaCriar();
    msg('ok', 'Desafio carregado! Agora resolva.');
  } catch (e) {
    msg('erro', 'Código inválido. Confira se copiou tudo.');
  }
}

// ---------- Eventos ----------

document.getElementById('paleta').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (b) adicionarComando(b.dataset.cmd);
});

document.getElementById('btnRodar').onclick = () => rodar(false);
document.getElementById('btnPasso').onclick = () => rodar(true);
document.getElementById('btnReiniciar').onclick = reiniciar;
document.getElementById('btnLimpar').onclick = limpar;
document.getElementById('btnCriar').onclick = abrirCriar;
document.getElementById('btnSairCriar').onclick = sairCriar;
document.getElementById('btnTestar').onclick = () => { aplicarMapaCriar(); msg('info', 'Testando o desafio criado.'); };
document.getElementById('btnGerar').onclick = gerarCodigo;
document.getElementById('btnCarregar').onclick = carregarCodigo;

document.getElementById('criarFerramentas').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.girar) {
    dirCriar = (dirCriar + 1) % 4;
    aplicarMapaCriar();
    return;
  }
  document.querySelectorAll('#criarFerramentas [data-tinta]').forEach(x => x.classList.remove('ativo'));
  b.classList.add('ativo');
  tinta = b.dataset.tinta;
});

canvas.addEventListener('pointerdown', cliqueCanvas);

elVelocidade.addEventListener('input', () => {
  if (rodando) iniciarLoop();
});

carregarNivel();
