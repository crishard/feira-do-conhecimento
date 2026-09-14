// ============================================================================
//  BARRAS DO MARATAOÃ — Expedição point & click
//  Jogo educativo sobre a cidade de Barras (PI). HTML + CSS + JS + Canvas 2D.
//  Todo o conteúdo didático está em LOCAIS: é só editar esse array para
//  corrigir, acrescentar ou trocar curiosidades e perguntas.
// ============================================================================

const canvas = document.getElementById('mapa');
const ctx = canvas.getContext('2d');
const L = canvas.width;   // 900
const A = canvas.height;  // 620

// ---------------------------------------------------------------------------
// 1. CONTEÚDO — os 10 pontos do mapa
// ---------------------------------------------------------------------------
const LOCAIS = [
  {
    id: 'marataoa', nome: 'Rio Marataoã', tipo: 'Rio · natureza', emoji: '🛶',
    x: 470, y: 195, cor: '#38bdf8',
    curiosidade: 'É o rio que batiza a cidade. Quando o povoado virou vila, em 1841, o nome oficial era ' +
      '"Barras do Marataoã". "Barras" porque a povoação cresceu exatamente onde ficam as barras — as bocas, ' +
      'os encontros — de rios e riachos da região.',
    sabia: 'Relatos antigos contam que o Marataoã se alargava bem em frente à Igreja Matriz e formava ali ' +
      'uma ilha muito pitoresca.',
    fonte: 'Fontes: IBGE Cidades · Portal Entretextos',
    quiz: {
      pergunta: 'De onde vem o nome "Barras"?',
      opcoes: [
        'De barras de ouro encontradas no rio',
        'Das barras — os encontros de rios e riachos da região',
        'Do sobrenome do primeiro morador'
      ],
      correta: 1,
      explicacao: 'Isso! A cidade nasceu entre barras de rios e riachos, e por isso virou Barras do Marataoã.'
    }
  },
  {
    id: 'longa', nome: 'Rio Longá', tipo: 'Rio · natureza', emoji: '🌊',
    x: 782, y: 268, cor: '#38bdf8',
    curiosidade: 'O Longá é o outro grande rio do município e dá nome a toda uma região: o Vale do Longá. ' +
      'Barras é considerada cidade-polo, ou seja, atende e movimenta outros sete municípios vizinhos.',
    sabia: 'A <b>Academia de Letras do Vale do Longá</b> leva o nome do rio — uma prova de como ele marca ' +
      'a identidade de quem vive aqui.',
    fonte: 'Fontes: Wikipédia (Barras/PI) · Prefeitura Municipal de Barras',
    quiz: {
      pergunta: 'Quais são os dois grandes rios do município de Barras?',
      opcoes: ['Parnaíba e Poti', 'Marataoã e Longá', 'São Francisco e Gurguéia'],
      correta: 1,
      explicacao: 'Exato: Marataoã e Longá. O Parnaíba e o Poti são rios de outras partes do Piauí.'
    }
  },
  {
    id: 'igreja', nome: 'Igreja Matriz de N. Sra. da Conceição', tipo: 'Patrimônio religioso', emoji: '⛪',
    x: 296, y: 243, cor: '#e06c4f',
    curiosidade: 'Tudo começou aqui. A primeira construção do povoado foi uma capela dedicada a ' +
      'Nossa Senhora da Conceição, que se tornou a padroeira da cidade. Com o tempo a capela deu lugar ' +
      'à Igreja Matriz, no coração do centro histórico.',
    sabia: 'Em muitas cidades do Brasil a história é assim: primeiro vem a capela, depois a praça em volta ' +
      'dela e só então as ruas. Barras seguiu exatamente esse caminho.',
    fonte: 'Fontes: IBGE Cidades · Prefeitura Municipal de Barras',
    quiz: {
      pergunta: 'Quem é a padroeira de Barras?',
      opcoes: ['Nossa Senhora dos Remédios', 'Nossa Senhora da Conceição', 'Nossa Senhora do Carmo'],
      correta: 1,
      explicacao: 'Correto! Nossa Senhora da Conceição, desde a capela que deu origem ao povoado.'
    }
  },
  {
    id: 'praca', nome: 'Praça da Matriz', tipo: 'Centro histórico', emoji: '🌳',
    x: 372, y: 318, cor: '#34d399',
    curiosidade: 'A praça em frente à igreja é o coração da cidade: lugar de conversa, feira, festa e ' +
      'encontro de gerações. É ali que a comunidade se reúne nas celebrações da padroeira.',
    sabia: 'A festa de Nossa Senhora da Conceição é celebrada em <b>8 de dezembro</b> — data comemorada ' +
      'pela Igreja no mundo inteiro.',
    fonte: 'Fontes: Prefeitura Municipal de Barras · calendário litúrgico católico',
    quiz: {
      pergunta: 'Em que dia se celebra Nossa Senhora da Conceição?',
      opcoes: ['8 de dezembro', '12 de outubro', '15 de agosto'],
      correta: 0,
      explicacao: 'Isso mesmo: 8 de dezembro, a festa da padroeira barrense.'
    }
  },
  {
    id: 'buritizinho', nome: 'Fazenda Buritizinho — o começo', tipo: 'Marco de fundação', emoji: '🌴',
    x: 140, y: 172, cor: '#fbbf24',
    curiosidade: 'Antes de existir cidade, existia a fazenda Buritizinho. Foi em meados do século XVIII que ' +
      'o coronel baiano <b>Miguel Carvalho de Aguiar</b> chegou a estas terras e mandou erguer a primeira ' +
      'capela — o embrião de Barras.',
    sabia: 'Antes disso, as margens do Marataoã e do Longá já eram habitadas por povos indígenas. ' +
      'A história da cidade não começa com a fazenda: ela começa <b>muito antes</b>.',
    fonte: 'Fontes: IBGE Cidades · Prefeitura Municipal de Barras',
    quiz: {
      pergunta: 'Quem iniciou o povoado que virou Barras?',
      opcoes: [
        'O coronel baiano Miguel Carvalho de Aguiar',
        'O imperador Dom Pedro II',
        'O bandeirante Domingos Jorge Velho'
      ],
      correta: 0,
      explicacao: 'Correto! Ele ergueu a primeira capela na antiga fazenda Buritizinho, no século XVIII.'
    }
  },
  {
    id: 'casario', nome: 'Casario histórico — de vila a cidade', tipo: 'Patrimônio urbano', emoji: '🏚️',
    x: 228, y: 425, cor: '#e06c4f',
    curiosidade: 'Pela lei nº 127, de 24 de setembro de 1841, o povoado foi elevado à condição de vila, ' +
      'com o nome de Barras do Marataoã. Em <b>28 de dezembro de 1889</b> veio a elevação a cidade — e o ' +
      'nome foi encurtado para simplesmente Barras.',
    sabia: 'Hoje Barras tem <b>47.938 habitantes</b> (Censo 2022) e <b>1.722 km²</b> — é o 6º município mais ' +
      'populoso do Piauí. Quem nasce aqui é <b>barrense</b>.',
    fonte: 'Fontes: IBGE Censo 2022 · Wikipédia (Barras/PI)',
    quiz: {
      pergunta: 'Em que ano Barras foi elevada à categoria de cidade?',
      opcoes: ['1841', '1889', '1922'],
      correta: 1,
      explicacao: 'Isso: 28 de dezembro de 1889. Em 1841 ela ainda era apenas vila.'
    }
  },
  {
    id: 'letras', nome: 'Biblioteca Davi Caldas & Academia de Letras', tipo: 'Cultura · Terra dos Poetas', emoji: '📚',
    x: 148, y: 312, cor: '#a78bfa',
    curiosidade: 'Barras é conhecida como a <b>Terra dos Governadores e dos Poetas</b>. A cidade abriga a ' +
      'Academia de Letras do Vale do Longá e a Biblioteca Municipal Davi Caldas, que guardam a produção ' +
      'literária barrense.',
    sabia: 'Entre os nomes das letras barrenses está o escritor <b>Celso Pinheiro</b>, nascido em 1887 e ' +
      'ligado ao Simbolismo — o movimento literário da musicalidade e do mistério.',
    fonte: 'Fontes: Wikipédia (Barras/PI) · Museu Virtual de Barras do Marataoã',
    quiz: {
      pergunta: 'Barras é conhecida como a terra de quê?',
      opcoes: [
        'Terra dos Governadores e dos Poetas',
        'Terra do Sol Nascente',
        'Terra das Cachoeiras'
      ],
      correta: 0,
      explicacao: 'Exato! Muitos governantes e muitos escritores nasceram aqui.'
    }
  },
  {
    id: 'governadores', nome: 'Memória dos Governadores', tipo: 'Personalidades', emoji: '🎖️',
    x: 330, y: 500, cor: '#fbbf24',
    curiosidade: '<b>Gregório Taumaturgo de Azevedo</b>, barrense, foi marechal e governou o Amazonas entre ' +
      '1891 e 1892. Chefiou a comissão de limites entre Brasil e Bolívia, fundou a cidade de Cruzeiro do Sul, ' +
      'no Acre, e participou da criação da Cruz Vermelha Brasileira.',
    sabia: '<b>Fileto Pires Ferreira</b>, também nascido em Barras, governou o Amazonas de 1896 a 1898. ' +
      'Filhos da cidade chegaram ao governo do Piauí, de Pernambuco e do Amazonas.',
    fonte: 'Fontes: Wikipédia (Barras/PI) · Portal Entretextos',
    quiz: {
      pergunta: 'Que cidade do Acre foi fundada pelo barrense Gregório Taumaturgo de Azevedo?',
      opcoes: ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira'],
      correta: 1,
      explicacao: 'Correto! Cruzeiro do Sul, no Acre — a mais de 3.000 km de Barras.'
    }
  },
  {
    id: 'carnaubal', nome: 'Carnaubal', tipo: 'Natureza · economia', emoji: '🌿',
    x: 118, y: 545, cor: '#16a34a',
    curiosidade: 'A carnaúba é chamada de <b>árvore da vida</b> porque quase tudo nela vira alguma coisa: ' +
      'a folha dá cera e palha para chapéu e cesto, o tronco vira madeira de construção, o fruto alimenta ' +
      'os animais.',
    sabia: 'A cera de carnaúba é exportada e usada até em cosméticos, remédios e na cobertura brilhante ' +
      'de balas e frutas. Ela aparece no hino de Barras, composto por Francy Monte.',
    fonte: 'Fontes: Prefeitura Municipal de Barras · Wikipédia (Barras/PI)',
    quiz: {
      pergunta: 'Por que a carnaúba é chamada de "árvore da vida"?',
      opcoes: [
        'Porque vive mais de 500 anos',
        'Porque quase todas as suas partes são aproveitadas',
        'Porque só cresce perto de nascentes'
      ],
      correta: 1,
      explicacao: 'Isso! Folha, tronco, fruto e cera: praticamente nada se perde.'
    }
  },
  {
    id: 'babacual', nome: 'Babaçual', tipo: 'Natureza · economia', emoji: '🥥',
    x: 742, y: 112, cor: '#16a34a',
    curiosidade: 'Grandes áreas do município são cobertas por babaçu, palmeira típica da transição entre ' +
      'o cerrado e a mata dos cocais. Do coco babaçu se extrai óleo, sabão, carvão e ração.',
    sabia: 'O trabalho das <b>quebradeiras de coco babaçu</b> é uma tradição do Piauí e do Maranhão: ' +
      'mulheres que quebram o coco à mão e sustentam a família com a amêndoa.',
    fonte: 'Fontes: Prefeitura Municipal de Barras · Wikipédia (Barras/PI)',
    quiz: {
      pergunta: 'O que se extrai principalmente do coco babaçu?',
      opcoes: ['Borracha', 'Óleo (azeite) da amêndoa', 'Açúcar'],
      correta: 1,
      explicacao: 'Correto! O óleo da amêndoa é o produto mais valioso — além de carvão e sabão.'
    }
  }
];

const RAIO = 27;

// ---------------------------------------------------------------------------
// 2. ESTADO DO JOGO
// ---------------------------------------------------------------------------
const estado = {
  visitados: new Set(),   // locais já lidos
  selos: new Set(),       // locais com desafio respondido corretamente
  atual: null,            // local aberto no painel
  hover: null,
  respondido: false
};

// ---------------------------------------------------------------------------
// 3. GEOMETRIA DO MAPA (rios, quarteirões, vegetação)
// ---------------------------------------------------------------------------

// Spline Catmull-Rom: transforma poucos pontos de controle numa curva suave.
function spline(pontos, passos = 16) {
  const saida = [];
  const p = [pontos[0], ...pontos, pontos[pontos.length - 1]];
  for (let i = 0; i < p.length - 3; i++) {
    const [p0, p1, p2, p3] = [p[i], p[i + 1], p[i + 2], p[i + 3]];
    for (let t = 0; t < passos; t++) {
      const s = t / passos, s2 = s * s, s3 = s2 * s;
      saida.push({
        x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * s + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * s2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * s3),
        y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * s + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * s2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * s3)
      });
    }
  }
  return saida;
}

const RIO_MARATAOA = spline([
  { x: 355, y: -30 }, { x: 420, y: 90 }, { x: 468, y: 210 },
  { x: 508, y: 330 }, { x: 570, y: 440 }, { x: 640, y: 560 }, { x: 700, y: 650 }
]);

const RIO_LONGA = spline([
  { x: 950, y: 180 }, { x: 840, y: 232 }, { x: 740, y: 292 },
  { x: 650, y: 372 }, { x: 592, y: 452 }
]);

// distância de um ponto até a linha de um rio (usada para não construir na água)
function distanciaAoRio(x, y, rio) {
  let min = Infinity;
  for (const p of rio) {
    const d = Math.hypot(p.x - x, p.y - y);
    if (d < min) min = d;
  }
  return min;
}

function distanciaAgua(x, y) {
  return Math.min(distanciaAoRio(x, y, RIO_MARATAOA), distanciaAoRio(x, y, RIO_LONGA));
}

// Ponto do rio na altura `y` e a direção local da correnteza — usados para
// encaixar a ponte e a ilha exatamente sobre o leito, sem chutar coordenadas.
function pontoRio(rio, y) {
  let melhor = rio[0], idx = 0;
  rio.forEach((p, i) => {
    if (Math.abs(p.y - y) < Math.abs(melhor.y - y)) { melhor = p; idx = i; }
  });
  const a = rio[Math.max(0, idx - 2)], b = rio[Math.min(rio.length - 1, idx + 2)];
  return { x: melhor.x, y: melhor.y, ang: Math.atan2(b.y - a.y, b.x - a.x) };
}

// Construções desenhadas à mão: as casas geradas não podem nascer em cima delas.
const IGREJA_POS = { x: 240, y: 262 };
const PRACA_POS = { x: 424, y: 322 };
const RESERVAS = [
  { x: IGREJA_POS.x, y: IGREJA_POS.y - 16, r: 48 },
  { x: PRACA_POS.x, y: PRACA_POS.y, r: 36 }
];

// gerador pseudoaleatório com semente fixa: o mapa é sempre igual
function criarRandom(semente) {
  let s = semente;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const rand = criarRandom(2025);

// --- quarteirões da cidade (margem esquerda do Marataoã) ---
const CASAS = [];
const TELHADOS = ['#c2593f', '#d97757', '#a84a36', '#e08a63', '#b95a45'];
for (let gx = 70; gx < 460; gx += 34) {
  for (let gy = 140; gy < 580; gy += 30) {
    const x = gx + rand() * 8;
    const y = gy + rand() * 6;
    if (distanciaAgua(x, y) < 52) continue;                 // não constrói dentro do rio
    if (LOCAIS.some(l => Math.hypot(l.x - x, l.y - y) < 44)) continue; // nem em cima dos marcadores
    if (RESERVAS.some(r => Math.hypot(r.x - x, r.y - y) < r.r)) continue; // nem sobre igreja/praça
    if (rand() < 0.22) continue;                            // vazios = ruas e quintais
    CASAS.push({
      x, y,
      w: 15 + rand() * 9,
      h: 11 + rand() * 6,
      cor: TELHADOS[Math.floor(rand() * TELHADOS.length)]
    });
  }
}

// --- palmeiras: carnaúbas e babaçus ---
const PALMEIRAS = [];
for (let i = 0; i < 190; i++) {
  const x = rand() * L;
  const y = 60 + rand() * (A - 60);
  if (distanciaAgua(x, y) < 30) continue;
  const naCidade = x < 470 && y > 130 && y < 585;
  if (naCidade && rand() < 0.88) continue;                  // pouca palmeira no centro urbano
  if (LOCAIS.some(l => Math.hypot(l.x - x, l.y - y) < 38)) continue;
  PALMEIRAS.push({ x, y, tipo: x > 470 ? 'babacu' : 'carnauba', esc: 0.75 + rand() * 0.5, fase: rand() * 6.28 });
}

// --- manchas de vegetação de fundo ---
const MANCHAS = [];
for (let i = 0; i < 46; i++) {
  MANCHAS.push({
    x: rand() * L, y: rand() * A,
    r: 40 + rand() * 90,
    tom: rand() < 0.5 ? 'rgba(22,101,52,.35)' : 'rgba(101,163,13,.16)'
  });
}

// ---------------------------------------------------------------------------
// 4. DESENHO
// ---------------------------------------------------------------------------

function desenharTerreno() {
  const g = ctx.createLinearGradient(0, 0, 0, A);
  g.addColorStop(0, '#1d4d33');
  g.addColorStop(0.55, '#20583a');
  g.addColorStop(1, '#2a5f3c');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, L, A);

  for (const m of MANCHAS) {
    ctx.fillStyle = m.tom;
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function tracarRio(rio) {
  ctx.beginPath();
  ctx.moveTo(rio[0].x, rio[0].y);
  for (let i = 1; i < rio.length; i++) ctx.lineTo(rio[i].x, rio[i].y);
}

function desenharRio(rio, largura, t) {
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // margem arenosa
  tracarRio(rio);
  ctx.strokeStyle = '#c9a227';
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = largura + 14;
  ctx.stroke();
  ctx.globalAlpha = 1;

  // água
  tracarRio(rio);
  const g = ctx.createLinearGradient(0, 0, L, A);
  g.addColorStop(0, '#1d6fa5');
  g.addColorStop(0.5, '#2f92c9');
  g.addColorStop(1, '#1b7fa8');
  ctx.strokeStyle = g;
  ctx.lineWidth = largura;
  ctx.stroke();

  // brilho que escorre com o tempo (correnteza)
  ctx.save();
  tracarRio(rio);
  ctx.strokeStyle = 'rgba(186, 230, 253, .55)';
  ctx.lineWidth = 2;
  ctx.setLineDash([16, 30]);
  ctx.lineDashOffset = -t * 26;
  ctx.stroke();
  ctx.setLineDash([9, 40]);
  ctx.lineDashOffset = -t * 18 + 12;
  ctx.strokeStyle = 'rgba(224, 242, 254, .3)';
  ctx.stroke();
  ctx.restore();
}

function desenharIlha() {
  // a "ilha muito pitoresca" citada nos relatos antigos, em frente à matriz
  const p = pontoRio(RIO_MARATAOA, 288);
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.ang);
  ctx.fillStyle = '#e8c87f';
  ctx.strokeStyle = 'rgba(80, 60, 20, .45)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(0, 0, 31, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#3f9457';
  ctx.beginPath();
  ctx.ellipse(0, -1, 23, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1f6b3a';   // moitas de mato na ilha
  for (const [dx, dy] of [[-11, 0], [0, -3], [10, 1], [4, 3], [-5, 3]]) {
    ctx.beginPath();
    ctx.arc(dx, dy, 3.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function desenharPonte() {
  const p = pontoRio(RIO_MARATAOA, 432);
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.ang);   // eixo x acompanha a correnteza; a ponte cruza na perpendicular
  ctx.fillStyle = '#8b6b4a';
  ctx.fillRect(-9, -34, 18, 68);
  ctx.strokeStyle = '#6b4f36';
  ctx.lineWidth = 2;
  for (let i = -30; i <= 30; i += 10) {
    ctx.beginPath();
    ctx.moveTo(-9, i);
    ctx.lineTo(9, i);
    ctx.stroke();
  }
  ctx.restore();
}

function desenharCasa(c) {
  ctx.fillStyle = '#e8e0d2';
  ctx.fillRect(c.x, c.y, c.w, c.h);
  ctx.fillStyle = c.cor;
  ctx.beginPath();
  ctx.moveTo(c.x - 2, c.y);
  ctx.lineTo(c.x + c.w / 2, c.y - 6);
  ctx.lineTo(c.x + c.w + 2, c.y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,.18)';
  ctx.fillRect(c.x, c.y + c.h, c.w, 2);
}

function desenharIgreja(x, y) {
  ctx.fillStyle = '#f2ece0';
  ctx.fillRect(x - 20, y - 8, 40, 26);
  ctx.fillStyle = '#b8462f';
  ctx.beginPath();
  ctx.moveTo(x - 24, y - 8);
  ctx.lineTo(x, y - 20);
  ctx.lineTo(x + 24, y - 8);
  ctx.closePath();
  ctx.fill();
  // torre
  ctx.fillStyle = '#f7f2e8';
  ctx.fillRect(x - 6, y - 44, 12, 30);
  ctx.fillStyle = '#b8462f';
  ctx.beginPath();
  ctx.moveTo(x - 9, y - 44);
  ctx.lineTo(x, y - 58);
  ctx.lineTo(x + 9, y - 44);
  ctx.closePath();
  ctx.fill();
  // cruz
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(x, y - 58); ctx.lineTo(x, y - 68);
  ctx.moveTo(x - 4, y - 64); ctx.lineTo(x + 4, y - 64);
  ctx.stroke();
}

function desenharPalmeira(p, t) {
  const balanco = Math.sin(t * 1.2 + p.fase) * 0.06;
  const alt = (p.tipo === 'carnauba' ? 20 : 15) * p.esc;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(balanco);
  ctx.strokeStyle = '#6b5136';
  ctx.lineWidth = 2 * p.esc;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -alt);
  ctx.stroke();
  ctx.fillStyle = p.tipo === 'carnauba' ? '#2f8f4e' : '#1f7a3f';
  const folhas = p.tipo === 'carnauba' ? 6 : 7;
  const raio = (p.tipo === 'carnauba' ? 8 : 10) * p.esc;
  for (let i = 0; i < folhas; i++) {
    const ang = (Math.PI * 2 * i) / folhas + balanco;
    ctx.beginPath();
    ctx.ellipse(Math.cos(ang) * raio * 0.55, -alt + Math.sin(ang) * raio * 0.35,
                raio, raio * 0.3, ang, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function desenharPracaVerde(x, y) {
  ctx.fillStyle = '#3f8f57';
  ctx.beginPath();
  ctx.arc(x, y, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#d6c9a8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, 26, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#24713f';
  for (const [dx, dy] of [[-12, -8], [11, -9], [-10, 10], [12, 9], [0, 0]]) {
    ctx.beginPath();
    ctx.arc(x + dx, y + dy, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function desenharMarcador(local, t) {
  const visitado = estado.visitados.has(local.id);
  const temSelo = estado.selos.has(local.id);
  const ativo = estado.hover === local.id || estado.atual === local.id;
  const esc = ativo ? 1.16 : 1;

  // pulso nos ainda não visitados: convida o clique
  if (!visitado) {
    const pulso = (Math.sin(t * 2.4) + 1) / 2;
    ctx.strokeStyle = `rgba(251, 191, 36, ${0.12 + pulso * 0.35})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(local.x, local.y, RAIO + 5 + pulso * 9, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.5)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = temSelo ? '#0f2d20' : '#0f1a22';
  ctx.beginPath();
  ctx.arc(local.x, local.y, RAIO * esc, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = temSelo ? '#34d399' : local.cor;
  ctx.lineWidth = ativo ? 3.5 : 2.5;
  ctx.beginPath();
  ctx.arc(local.x, local.y, RAIO * esc, 0, Math.PI * 2);
  ctx.stroke();

  ctx.font = `${Math.round(21 * esc)}px system-ui, "Segoe UI Emoji", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(local.emoji, local.x, local.y + 1);

  if (temSelo) {
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.arc(local.x + RAIO * esc - 4, local.y - RAIO * esc + 4, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#05261a';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillText('✓', local.x + RAIO * esc - 4, local.y - RAIO * esc + 5);
  }

  // rótulo só no marcador sob o cursor, para não poluir o mapa
  if (ativo) {
    ctx.font = 'bold 13px system-ui, sans-serif';
    const larg = ctx.measureText(local.nome).width + 18;
    const bx = Math.min(Math.max(local.x - larg / 2, 6), L - larg - 6);
    const by = local.y + RAIO * esc + 8;
    ctx.fillStyle = 'rgba(10, 18, 24, .92)';
    ctx.beginPath();
    ctx.roundRect(bx, by, larg, 24, 8);
    ctx.fill();
    ctx.strokeStyle = local.cor;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#e6edf3';
    ctx.fillText(local.nome, bx + larg / 2, by + 13);
  }
}

function desenharTituloMapa() {
  ctx.save();
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = 'rgba(10, 18, 24, .6)';
  ctx.beginPath();
  ctx.roundRect(14, 14, 268, 46, 10);
  ctx.fill();
  ctx.fillStyle = '#e6edf3';
  ctx.fillText('BARRAS — PIAUÍ', 26, 36);
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('entre o Marataoã e o Longá · 126 km de Teresina', 26, 52);

  // rosa dos ventos
  ctx.translate(L - 46, 46);
  ctx.strokeStyle = 'rgba(230, 237, 243, .7)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(0, -16); ctx.lineTo(5, 2); ctx.lineTo(-5, 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e6edf3';
  ctx.font = 'bold 10px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('N', 0, -20);
  ctx.restore();
}

function desenhar(t) {
  ctx.clearRect(0, 0, L, A);
  desenharTerreno();
  desenharRio(RIO_MARATAOA, 30, t);
  desenharRio(RIO_LONGA, 24, t);
  desenharIlha();
  desenharPonte();
  desenharPracaVerde(PRACA_POS.x, PRACA_POS.y);
  for (const c of CASAS) desenharCasa(c);
  desenharIgreja(IGREJA_POS.x, IGREJA_POS.y);
  for (const p of PALMEIRAS) desenharPalmeira(p, t);
  for (const l of LOCAIS) desenharMarcador(l, t);
  desenharTituloMapa();
}

let inicio = performance.now();
function loop(agora) {
  desenhar((agora - inicio) / 1000);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// ---------------------------------------------------------------------------
// 5. INTERAÇÃO COM O MAPA
// ---------------------------------------------------------------------------

// converte a posição do mouse/dedo para as coordenadas internas do canvas
function posicaoNoCanvas(evento) {
  const r = canvas.getBoundingClientRect();
  const fonte = evento.touches ? evento.touches[0] : evento;
  return {
    x: (fonte.clientX - r.left) * (L / r.width),
    y: (fonte.clientY - r.top) * (A / r.height)
  };
}

function localEm(x, y) {
  return LOCAIS.find(l => Math.hypot(l.x - x, l.y - y) <= RAIO + 4) || null;
}

canvas.addEventListener('mousemove', e => {
  const p = posicaoNoCanvas(e);
  const l = localEm(p.x, p.y);
  estado.hover = l ? l.id : null;
  canvas.style.cursor = l ? 'pointer' : 'default';
});

canvas.addEventListener('mouseleave', () => { estado.hover = null; });

canvas.addEventListener('click', e => {
  const p = posicaoNoCanvas(e);
  const l = localEm(p.x, p.y);
  if (l) abrirLocal(l.id);
});

// ---------------------------------------------------------------------------
// 6. PAINEL, QUIZ E PROGRESSO
// ---------------------------------------------------------------------------
const painelVazio = document.getElementById('painelVazio');
const ficha = document.getElementById('ficha');
const quizBox = document.getElementById('quiz');
const quizOpcoes = document.getElementById('quizOpcoes');
const quizFeedback = document.getElementById('quizFeedback');
const btnDesafio = document.getElementById('btnDesafio');

function abrirLocal(id) {
  const l = LOCAIS.find(x => x.id === id);
  if (!l) return;

  estado.atual = id;
  estado.visitados.add(id);
  estado.respondido = estado.selos.has(id);

  document.getElementById('fichaEmoji').textContent = l.emoji;
  document.getElementById('fichaNome').textContent = l.nome;
  document.getElementById('fichaTipo').textContent = l.tipo;
  document.getElementById('fichaTexto').innerHTML = l.curiosidade;
  document.getElementById('fichaSabia').innerHTML = '<b>Você sabia?</b> ' + l.sabia;
  document.getElementById('fichaFonte').textContent = l.fonte;

  quizBox.classList.add('escondido');
  quizFeedback.classList.add('escondido');
  btnDesafio.classList.remove('escondido');
  btnDesafio.disabled = false;
  btnDesafio.textContent = estado.selos.has(id) ? 'Selo já conquistado ✅' : 'Encarar o desafio 🎯';
  btnDesafio.disabled = estado.selos.has(id);

  painelVazio.classList.add('escondido');
  ficha.classList.remove('escondido');
  atualizarPlacar();
  if (window.innerWidth <= 1000) ficha.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

btnDesafio.addEventListener('click', () => {
  const l = LOCAIS.find(x => x.id === estado.atual);
  if (!l) return;
  montarQuiz(l);
});

function montarQuiz(l) {
  quizBox.classList.remove('escondido');
  quizFeedback.classList.add('escondido');
  btnDesafio.classList.add('escondido');
  document.getElementById('quizPergunta').textContent = l.quiz.pergunta;
  quizOpcoes.innerHTML = '';

  l.quiz.opcoes.forEach((texto, i) => {
    const b = document.createElement('button');
    b.textContent = texto;
    b.addEventListener('click', () => responder(l, i, b));
    quizOpcoes.appendChild(b);
  });
}

function responder(l, escolha, botao) {
  const botoes = [...quizOpcoes.children];
  botoes.forEach(b => b.disabled = true);
  botoes[l.quiz.correta].classList.add('certa');

  const acertou = escolha === l.quiz.correta;
  if (!acertou) botao.classList.add('errada');

  quizFeedback.classList.remove('escondido');
  quizFeedback.className = 'feedback ' + (acertou ? 'acerto' : 'erro');

  if (acertou) {
    estado.selos.add(l.id);
    quizFeedback.innerHTML = '🏅 <b>Selo conquistado!</b> ' + l.quiz.explicacao;
  } else {
    quizFeedback.innerHTML = '🤔 <b>Quase!</b> A resposta certa está destacada em verde. ' +
      l.quiz.explicacao + '<br><br>Releia a curiosidade e tente de novo — o selo continua esperando por você.';
    const tentar = document.createElement('button');
    tentar.className = 'btn-fantasma';
    tentar.style.marginTop = '10px';
    tentar.textContent = 'Tentar de novo 🔄';
    tentar.addEventListener('click', () => montarQuiz(l));
    quizFeedback.appendChild(tentar);
  }

  atualizarPlacar();
  if (estado.selos.size === LOCAIS.length) setTimeout(mostrarFinal, 900);
}

document.getElementById('btnVoltar').addEventListener('click', () => {
  estado.atual = null;
  ficha.classList.add('escondido');
  painelVazio.classList.remove('escondido');
});

// --- placar e lista de checagem ---
const checklist = document.getElementById('checklist');

function montarChecklist() {
  checklist.innerHTML = '';
  for (const l of LOCAIS) {
    const li = document.createElement('li');
    const feito = estado.selos.has(l.id);
    li.className = feito ? 'feito' : '';
    li.innerHTML = `<span class="marca">${feito ? '🏅' : '○'}</span><span>${l.emoji} ${l.nome}</span>`;
    li.addEventListener('click', () => abrirLocal(l.id));
    checklist.appendChild(li);
  }
}

function atualizarPlacar() {
  const n = estado.selos.size;
  document.getElementById('selos').textContent = `${n} / ${LOCAIS.length} selos`;
  document.getElementById('progresso').style.width = (n / LOCAIS.length) * 100 + '%';
  const v = estado.visitados.size;
  document.getElementById('subPlacar').textContent =
    v === 0 ? 'nenhum lugar visitado ainda'
            : `${v} de ${LOCAIS.length} lugares visitados`;
  montarChecklist();
}

// ---------------------------------------------------------------------------
// 7. TELA FINAL — certificado
// ---------------------------------------------------------------------------
const telaFinal = document.getElementById('telaFinal');
const nomeAluno = document.getElementById('nomeAluno');

function mostrarFinal() {
  document.getElementById('resumoFinal').textContent =
    `Você conquistou os ${LOCAIS.length} selos e conheceu os rios, o centro histórico, ` +
    'as palmeiras e a gente de Barras do Marataoã.';
  document.getElementById('dataDiploma').textContent =
    'Feira de Conhecimento · ' + new Date().toLocaleDateString('pt-BR');
  telaFinal.classList.remove('escondido');
  nomeAluno.focus();
}

nomeAluno.addEventListener('input', () => {
  document.getElementById('nomeDiploma').textContent = nomeAluno.value.trim() || '—';
});

document.getElementById('btnReiniciar').addEventListener('click', () => {
  estado.visitados.clear();
  estado.selos.clear();
  estado.atual = null;
  estado.hover = null;
  telaFinal.classList.add('escondido');
  ficha.classList.add('escondido');
  painelVazio.classList.remove('escondido');
  nomeAluno.value = '';
  document.getElementById('nomeDiploma').textContent = '—';
  atualizarPlacar();
});

// ---------------------------------------------------------------------------
atualizarPlacar();
