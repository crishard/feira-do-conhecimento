'use strict';

// ====================== Catálogo de construções ======================
// energia: MW abstratos | agua: mil L/mês | residuo: t/mês de capacidade
// co2: t/mês emitidas (negativo = sequestro) | satis: efeito na satisfação
// custo: R$ mil (uma vez) | mensal: R$ mil de operação | receita: R$ mil/mês

const CATALOGO = {
  // -------- Energia --------
  solar: {
    cat: 'energia', nome: 'Usina Solar', icone: '☀️', ods: 'ODS 7',
    desc: 'Energia limpa e barata de operar. Rende menos em meses nublados, mas não emite nada.',
    custo: 130, mensal: 3, energia: 38, co2: 0, satis: 1,
  },
  eolica: {
    cat: 'energia', nome: 'Parque Eólico', icone: '🌬️', ods: 'ODS 7',
    desc: 'Muita geração sem emissões. Ocupa área e depende do vento.',
    custo: 160, mensal: 4, energia: 55, co2: 0, satis: 0,
  },
  gas: {
    cat: 'energia', nome: 'Termelétrica a Gás', icone: '🔥', ods: 'ODS 13',
    desc: 'Confiável e liga rápido nos picos. Emite menos que o carvão, mas ainda emite.',
    custo: 110, mensal: 8, energia: 80, co2: 24, satis: -1,
  },
  carvao: {
    cat: 'energia', nome: 'Termelétrica a Carvão', icone: '🏭', ods: '—',
    desc: 'A opção mais barata de construir e a mais poluente. Piora a qualidade do ar.',
    custo: 75, mensal: 7, energia: 95, co2: 48, satis: -4,
  },
  hidro: {
    cat: 'energia', nome: 'Hidrelétrica', icone: '💧', ods: 'ODS 7',
    desc: 'Grande geração de baixa emissão. Vulnerável a secas e alaga áreas.',
    custo: 210, mensal: 5, energia: 85, co2: 4, satis: -2,
  },
  nuclear: {
    cat: 'energia', nome: 'Usina Nuclear', icone: '⚛️', ods: 'ODS 7',
    desc: 'Enorme geração estável quase sem CO₂. Cara e gera receio na população.',
    custo: 340, mensal: 12, energia: 170, co2: 1, satis: -3,
  },

  // -------- Água & Resíduos --------
  eta: {
    cat: 'saneamento', nome: 'Estação de Tratamento de Água', icone: '🚰', ods: 'ODS 6',
    desc: 'Amplia o fornecimento de água potável e reduz doenças.',
    custo: 95, mensal: 5, agua: 130, satis: 2,
  },
  reservatorio: {
    cat: 'saneamento', nome: 'Reservatório', icone: '🛢️', ods: 'ODS 6',
    desc: 'Estoca água e segura a cidade durante as secas.',
    custo: 70, mensal: 2, agua: 45, secaProtege: 0.5, satis: 0,
  },
  aterro: {
    cat: 'saneamento', nome: 'Aterro Sanitário', icone: '🗑️', ods: 'ODS 11',
    desc: 'Destino controlado para o lixo. Ocupa espaço e libera gases.',
    custo: 60, mensal: 4, residuo: 110, co2: 9, satis: -3,
  },
  reciclagem: {
    cat: 'saneamento', nome: 'Central de Reciclagem', icone: '♻️', ods: 'ODS 12',
    desc: 'Reduz o lixo enviado ao aterro, gera renda e emprego e melhora o ar.',
    custo: 120, mensal: 6, residuo: 75, co2: -3, satis: 3, receita: 4,
  },
  compostagem: {
    cat: 'saneamento', nome: 'Pátio de Compostagem', icone: '🌱', ods: 'ODS 12',
    desc: 'Transforma resíduo orgânico em adubo. Barato e de baixa emissão.',
    custo: 45, mensal: 2, residuo: 45, co2: -1, satis: 1,
  },

  // -------- Mobilidade & Verde --------
  ciclovia: {
    cat: 'cidade', nome: 'Rede de Ciclovias', icone: '🚲', ods: 'ODS 11',
    desc: 'Tira carros das ruas a baixo custo. Melhora saúde e ar.',
    custo: 35, mensal: 1, satis: 2, co2: -3,
  },
  onibus: {
    cat: 'cidade', nome: 'Corredor de Ônibus', icone: '🚌', ods: 'ODS 11',
    desc: 'Transporte coletivo eficiente. Reduz congestionamento e emissões.',
    custo: 90, mensal: 5, satis: 3, co2: -6,
  },
  metro: {
    cat: 'cidade', nome: 'Linha de Metrô', icone: '🚇', ods: 'ODS 11',
    desc: 'Alta capacidade e zero emissão local. Investimento pesado.',
    custo: 280, mensal: 9, satis: 6, co2: -12,
  },
  parque: {
    cat: 'cidade', nome: 'Parque Urbano', icone: '🌳', ods: 'ODS 15',
    desc: 'Sombra, lazer e absorção de carbono. Ajuda contra enchentes e calor.',
    custo: 50, mensal: 2, satis: 4, co2: -5, drenagem: 1,
  },
  telhadoVerde: {
    cat: 'cidade', nome: 'Programa Telhado Verde', icone: '🏡', ods: 'ODS 13',
    desc: 'Incentiva telhados vegetados: menos calor, menos enchente, cidade mais fresca.',
    custo: 65, mensal: 2, satis: 2, co2: -3, drenagem: 1,
  },
};

// ====================== Estado ======================

const INICIAL = {
  mes: 1,
  orcamento: 240,
  populacao: 5000,
  satisfacao: 62,
  construcoes: { carvao: 1, eta: 1, aterro: 1, reservatorio: 1 },
};

const META_MESES = 36;
const META_CO2 = 6;      // kg por habitante/mês
const META_SATIS = 60;

let estado;
let historico;
let seca = 0;            // meses restantes de seca
let crise = 0;           // meses restantes de crise econômica
let calorEsteMes = false;
let fimDeJogo = false;
let ultimoRelatorio = null;
let catAtual = 'energia';

function reiniciar() {
  estado = JSON.parse(JSON.stringify(INICIAL));
  historico = [];
  seca = 0; crise = 0; calorEsteMes = false; fimDeJogo = false;
  ultimoRelatorio = null;
  gerarSkylineFundo();
  document.getElementById('telaFinal').classList.add('escondido');
  document.getElementById('evento').classList.add('escondido');
  simularMes(true); // calcula balanço inicial sem avançar o tempo
  estado.mes = 1;
  historico = [snapshot()];
  render();
}

// ====================== Simulação ======================

function totais() {
  const t = { energia: 0, agua: 0, residuo: 0, co2: 0, co2Pos: 0, co2Neg: 0, satis: 0, satisPos: 0, satisNeg: 0, mensal: 0, receita: 0, drenagem: 0, secaProtege: 0 };
  for (const [k, q] of Object.entries(estado.construcoes)) {
    const d = CATALOGO[k];
    if (!d || !q) continue;
    t.energia += (d.energia || 0) * q;
    t.agua += (d.agua || 0) * q;
    t.residuo += (d.residuo || 0) * q;
    t.co2 += (d.co2 || 0) * q;
    if (d.co2 > 0) t.co2Pos += d.co2 * q;
    else if (d.co2 < 0) t.co2Neg += -d.co2 * q;
    t.satis += (d.satis || 0) * q;
    if (d.satis > 0) t.satisPos += d.satis * q;
    else if (d.satis < 0) t.satisNeg += -d.satis * q;
    t.mensal += (d.mensal || 0) * q;
    t.receita += (d.receita || 0) * q;
    t.drenagem += (d.drenagem || 0) * q;
    t.secaProtege = Math.max(t.secaProtege, d.secaProtege || 0);
  }
  return t;
}

function demandas() {
  const p = estado.populacao;
  let energia = p * 0.0085;
  let agua = p * 0.017;
  let residuo = p * 0.014;
  // transporte coletivo corta demanda de energia (menos carros/combustível urbano)
  const mob = (estado.construcoes.onibus || 0) + (estado.construcoes.metro || 0) * 2 + (estado.construcoes.ciclovia || 0) * 0.5;
  energia -= mob * 3;
  if (calorEsteMes) energia *= 1.35;
  return { energia: Math.max(1, energia), agua, residuo };
}

function balanco() {
  const t = totais();
  const d = demandas();
  let ofertaEnergia = t.energia;
  let ofertaAgua = t.agua;

  if (seca > 0) {
    ofertaEnergia -= (CATALOGO.hidro.energia * (estado.construcoes.hidro || 0)) * 0.45;
    const perdaAgua = ofertaAgua * 0.30 * (1 - t.secaProtege);
    ofertaAgua -= perdaAgua;
  }
  return { t, d, ofertaEnergia, ofertaAgua };
}

function snapshot() {
  const b = balanco();
  const co2Mensal = co2DoMes(b);
  return {
    mes: estado.mes,
    orcamento: Math.round(estado.orcamento),
    populacao: Math.round(estado.populacao),
    satisfacao: Math.round(estado.satisfacao),
    co2pc: +(co2Mensal * 1000 / estado.populacao).toFixed(1),
    co2Mensal: Math.round(co2Mensal),
  };
}

function co2DoMes(b) {
  const base = estado.populacao * 0.0035;          // trânsito difuso, indústria, consumo
  let brutas = b.t.co2Pos + base;
  // lixo não coletado apodrece e emite
  if (b.t.residuo < b.d.residuo) brutas += (b.d.residuo - b.t.residuo) * 0.4;
  // infraestrutura verde compensa parte das emissões, mas não zera a cidade
  const sequestro = Math.min(b.t.co2Neg, brutas * 0.72);
  return Math.max(brutas * 0.1, brutas - sequestro);
}

function simularMes(soBalanco) {
  const b = balanco();
  const t = b.t, d = b.d;

  // ---- Finanças ----
  let receitaImpostos = estado.populacao * 0.0068;
  if (crise > 0) receitaImpostos *= 0.74;
  const receita = receitaImpostos + t.receita;
  const despesa = t.mensal;

  // ---- Déficits de serviço ----
  let apagao = false, racionamento = false, lixao = false;
  if (b.ofertaEnergia < d.energia) apagao = true;
  if (b.ofertaAgua < d.agua) racionamento = true;
  if (t.residuo < d.residuo) lixao = true;

  const co2Mensal = co2DoMes(b);
  const co2pc = co2Mensal * 1000 / estado.populacao;
  const verde = (estado.construcoes.parque || 0) + (estado.construcoes.telhadoVerde || 0);

  // Satisfação tende a um "alvo" definido pela qualidade da cidade
  let alvo = 52;
  alvo += Math.min(24, t.satisPos * 0.95);
  alvo -= t.satisNeg * 0.85;
  alvo += verde * 0.7;
  alvo -= clamp((co2pc - META_CO2) * 1.1, 0, 16);   // ar sujo pesa
  if (apagao) alvo -= 26;
  if (racionamento) alvo -= 22;
  if (lixao) alvo -= 14;
  alvo = clamp(alvo, 0, 94);

  if (soBalanco) { render(); return; }

  // ---- Aplica o mês ----
  estado.orcamento += receita - despesa;
  estado.satisfacao = clamp(estado.satisfacao + (alvo - estado.satisfacao) * 0.27, 0, 100);

  // ---- População ----
  const servicosOk = !apagao && !racionamento && !lixao;
  let cresc = 0;
  if (estado.satisfacao >= 72 && servicosOk) cresc = 0.028;
  else if (estado.satisfacao >= 58 && servicosOk) cresc = 0.016;
  else if (estado.satisfacao < 42 || !servicosOk) cresc = -0.012;
  estado.populacao = Math.max(1500, estado.populacao * (1 + cresc));

  // ---- Contadores de evento ----
  if (seca > 0) seca--;
  if (crise > 0) crise--;
  calorEsteMes = false;

  estado.mes++;
  const evt = sortearEvento();
  historico.push(snapshot());

  verificarFim();
  return { apagao, racionamento, lixao, evt };
}

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

// ====================== Eventos ======================

function sortearEvento() {
  const t = totais();
  const renovaveis = (estado.construcoes.solar || 0) + (estado.construcoes.eolica || 0) + (estado.construcoes.hidro || 0);
  const fosseis = (estado.construcoes.carvao || 0) + (estado.construcoes.gas || 0);
  const co2pc = co2DoMes(balanco()) * 1000 / estado.populacao;
  const drenagem = t.drenagem;

  const baralho = [];

  if (estado.mes % 7 === 0 || Math.random() < 0.12) {
    baralho.push({ tipo: 'ruim', texto: '☀️ Onda de calor no próximo mês: a demanda de energia dispara 35%.', efeito: () => { calorEsteMes = true; } });
  }
  if (Math.random() < 0.15 && seca === 0) {
    baralho.push({ tipo: 'ruim', texto: '🏜️ Seca chegando: pelos próximos 3 meses a água cai e as hidrelétricas geram menos.', efeito: () => { seca = 3; } });
  }
  if (Math.random() < 0.12 && crise === 0) {
    baralho.push({ tipo: 'ruim', texto: '📉 Crise econômica: a arrecadação de impostos cai por 3 meses.', efeito: () => { crise = 3; } });
  }
  if (Math.random() < 0.13 && drenagem < 2) {
    baralho.push({ tipo: 'ruim', texto: '🌧️ Chuva forte e a cidade tem pouca área verde: alagamentos derrubam a satisfação.', efeito: () => { estado.satisfacao = clamp(estado.satisfacao - 9, 0, 100); } });
  }
  if (renovaveis >= 2 && Math.random() < 0.18) {
    baralho.push({ tipo: 'bom', texto: '🌍 Fundo Clima aprovou financiamento para a sua matriz renovável: +R$ 130 mil no caixa.', efeito: () => { estado.orcamento += 130; } });
  }
  if (co2pc <= META_CO2 && Math.random() < 0.25) {
    baralho.push({ tipo: 'bom', texto: '🏆 Prêmio Cidade de Baixo Carbono: +R$ 90 mil e +5 de satisfação.', efeito: () => { estado.orcamento += 90; estado.satisfacao = clamp(estado.satisfacao + 5, 0, 100); } });
  }
  if (fosseis >= 3 && Math.random() < 0.2) {
    baralho.push({ tipo: 'ruim', texto: '🫁 Ministério Público cobra plano de qualidade do ar: multa de R$ 60 mil pela dependência de fósseis.', efeito: () => { estado.orcamento -= 60; } });
  }
  if (estado.populacao > 11000 && !estado.construcoes.metro && !estado.construcoes.onibus && Math.random() < 0.3) {
    baralho.push({ tipo: 'ruim', texto: '🚗 Trânsito no limite e sem transporte coletivo: população protesta (−6 de satisfação).', efeito: () => { estado.satisfacao = clamp(estado.satisfacao - 6, 0, 100); } });
  }

  if (!baralho.length) return null;
  const evt = baralho[Math.floor(Math.random() * baralho.length)];
  evt.efeito();
  return evt;
}

// ====================== Fim de jogo ======================

function verificarFim() {
  if (estado.orcamento < -150) return encerrar(false, 'A cidade faliu. Sem caixa para manter os serviços, a gestão foi afastada.');
  if (estado.satisfacao <= 12) return encerrar(false, 'A satisfação despencou e a população perdeu a confiança na administração.');
  if (estado.mes > META_MESES) {
    const s = historico[historico.length - 1];
    const ok = s.satisfacao >= META_SATIS && s.co2pc <= META_CO2 && estado.orcamento >= 0 && estado.populacao >= INICIAL.populacao;
    return encerrar(ok, ok
      ? 'Três anos depois, a cidade cresceu com ar limpo, contas no azul e gente satisfeita. Mandato renovado!'
      : 'O mandato terminou sem cumprir todas as metas de sustentabilidade. Faltou pouco — revise as decisões e tente de novo.');
  }
}

function encerrar(venceu, resumo) {
  fimDeJogo = true;
  const s = historico[historico.length - 1];
  const medalhas = [
    { nome: 'ODS 13 · Clima', ok: s.co2pc <= META_CO2 },
    { nome: 'ODS 11 · Cidade', ok: s.satisfacao >= META_SATIS },
    { nome: 'Contas no azul', ok: estado.orcamento >= 0 },
    { nome: 'Cidade que cresce', ok: estado.populacao >= INICIAL.populacao },
  ];
  ultimoRelatorio = { venceu, resumo, medalhas, s };

  document.getElementById('finalTitulo').textContent = venceu ? '🎉 Cidade Sustentável!' : '📋 Fim do mandato';
  document.getElementById('finalResumo').textContent = resumo;
  document.getElementById('finalMedalhas').innerHTML = medalhas
    .map(m => `<span class="medalha ${m.ok ? 'ok' : 'no'}">${m.ok ? '✅' : '⬜'} ${m.nome}</span>`).join('');
  document.getElementById('finalNumeros').innerHTML = `
    <div>População final<strong>${s.populacao.toLocaleString('pt-BR')}</strong></div>
    <div>Satisfação<strong>${s.satisfacao}/100</strong></div>
    <div>CO₂ por habitante<strong>${s.co2pc} kg/mês</strong></div>
    <div>Caixa<strong>R$ ${s.orcamento} mil</strong></div>`;
  desenharGrafico(document.getElementById('graficoFinal').getContext('2d'),
    document.getElementById('graficoFinal'), true);
  document.getElementById('telaFinal').classList.remove('escondido');
}

// ====================== Ações do jogador ======================

function construir(chave) {
  if (fimDeJogo) return;
  const d = CATALOGO[chave];
  if (estado.orcamento < d.custo) { flashDica('Caixa insuficiente para ' + d.nome + '.'); return; }
  estado.orcamento -= d.custo;
  estado.construcoes[chave] = (estado.construcoes[chave] || 0) + 1;
  simularMes(true);
  render();
}

function desativar(chave) {
  if (fimDeJogo || !estado.construcoes[chave]) return;
  const d = CATALOGO[chave];
  estado.construcoes[chave]--;
  estado.orcamento += Math.round(d.custo * 0.2); // sucata / reaproveitamento
  flashDica(d.nome + ' desativada. A transição também é feita desligando o que polui.');
  simularMes(true);
  render();
}

function avancar() {
  if (fimDeJogo) return;
  const r = simularMes(false);
  render();
  if (r && r.evt) mostrarEvento(r.evt);
  else if (r && (r.apagao || r.racionamento || r.lixao)) {
    const probs = [];
    if (r.apagao) probs.push('apagões');
    if (r.racionamento) probs.push('racionamento de água');
    if (r.lixao) probs.push('lixo acumulado');
    mostrarEvento({ tipo: 'ruim', texto: '⚠️ A cidade sofreu com ' + probs.join(' e ') + ' neste mês. Amplie a capacidade.' });
  } else {
    document.getElementById('evento').classList.add('escondido');
  }
}

function mostrarEvento(evt) {
  const el = document.getElementById('evento');
  el.className = 'evento ' + (evt.tipo || '');
  el.textContent = evt.texto;
}

let dicaTimer = null;
function flashDica(txt) {
  const el = document.getElementById('dica');
  el.textContent = txt;
  el.style.color = 'var(--vermelho)';
  clearTimeout(dicaTimer);
  dicaTimer = setTimeout(() => { el.style.color = ''; el.textContent = DICA_PADRAO; }, 3200);
}
const DICA_PADRAO = 'Cada construção tem custo único e custo mensal. Equilibre oferta e demanda antes de avançar o mês.';

// ====================== Render ======================

function classe(valor, bom, alerta) {
  if (valor >= bom) return 'bom';
  if (valor >= alerta) return 'alerta';
  return 'ruim';
}

function render() {
  const b = balanco();
  const s = snapshot();
  const anoMes = `Mês ${Math.min(estado.mes, META_MESES)} · Ano ${Math.ceil(Math.min(estado.mes, META_MESES) / 12)}`;
  document.getElementById('dataJogo').textContent = anoMes;
  document.getElementById('prazo').textContent = `meta em ${Math.max(0, META_MESES - estado.mes + 1)} meses`;

  const oOrc = document.getElementById('iOrcamento');
  oOrc.textContent = 'R$ ' + Math.round(estado.orcamento) + ' mil';
  oOrc.className = estado.orcamento >= 60 ? 'bom' : estado.orcamento >= 0 ? 'alerta' : 'ruim';
  const receita = estado.populacao * (crise > 0 ? 0.0068 * 0.74 : 0.0068) + b.t.receita;
  const fluxo = receita - b.t.mensal;
  document.getElementById('iFluxo').textContent = (fluxo >= 0 ? '+' : '') + fluxo.toFixed(0) + ' /mês' + (crise > 0 ? ' · crise' : '');

  document.getElementById('iPopulacao').textContent = Math.round(estado.populacao).toLocaleString('pt-BR');
  const varPop = historico.length > 1 ? estado.populacao - historico[historico.length - 2].populacao : 0;
  document.getElementById('iPopVar').textContent = (varPop >= 0 ? '▲ ' : '▼ ') + Math.abs(Math.round(varPop)) + '/mês';

  const oSat = document.getElementById('iSatisfacao');
  oSat.textContent = Math.round(estado.satisfacao) + '/100';
  oSat.className = classe(estado.satisfacao, 60, 40);

  const barra = (of, dm) => `${Math.round(of)} / ${Math.round(dm)}`;
  const oEne = document.getElementById('iEnergia');
  oEne.textContent = barra(b.ofertaEnergia, b.d.energia);
  oEne.className = b.ofertaEnergia >= b.d.energia * 1.15 ? 'bom' : b.ofertaEnergia >= b.d.energia ? 'alerta' : 'ruim';
  document.getElementById('iEnergiaSub').textContent = seca > 0 ? 'seca ativa' : (calorEsteMes ? 'calor extremo' : 'oferta / demanda');

  const oAgu = document.getElementById('iAgua');
  oAgu.textContent = barra(b.ofertaAgua, b.d.agua);
  oAgu.className = b.ofertaAgua >= b.d.agua * 1.15 ? 'bom' : b.ofertaAgua >= b.d.agua ? 'alerta' : 'ruim';

  const oRes = document.getElementById('iResiduos');
  oRes.textContent = barra(b.t.residuo, b.d.residuo);
  oRes.className = b.t.residuo >= b.d.residuo * 1.15 ? 'bom' : b.t.residuo >= b.d.residuo ? 'alerta' : 'ruim';

  const oCo2 = document.getElementById('iCo2');
  oCo2.textContent = s.co2pc + ' kg';
  oCo2.className = s.co2pc <= META_CO2 ? 'bom' : s.co2pc <= 10 ? 'alerta' : 'ruim';

  document.getElementById('btnAvancar').disabled = fimDeJogo;
  document.getElementById('btnAvancar').textContent = estado.mes >= META_MESES ? 'Encerrar mandato ▶' : 'Avançar mês ▶';

  renderCatalogo();
  desenharGrafico(document.getElementById('grafico').getContext('2d'), document.getElementById('grafico'), false);
}

function renderCatalogo() {
  const wrap = document.getElementById('catalogo');
  wrap.innerHTML = '';
  for (const [chave, d] of Object.entries(CATALOGO)) {
    if (d.cat !== catAtual) continue;
    const qtd = estado.construcoes[chave] || 0;
    const efeitos = [];
    const add = (txt, pos) => efeitos.push(`<span class="chip ${pos ? 'pos' : 'neg'}">${txt}</span>`);
    if (d.energia) add('⚡ +' + d.energia, true);
    if (d.agua) add('💧 +' + d.agua, true);
    if (d.residuo) add('🗑️ +' + d.residuo, true);
    if (d.co2) add('CO₂ ' + (d.co2 > 0 ? '+' + d.co2 : d.co2), d.co2 < 0);
    if (d.satis) add('😊 ' + (d.satis > 0 ? '+' : '') + d.satis, d.satis > 0);
    if (d.receita) add('R$ +' + d.receita + '/mês', true);
    efeitos.push(`<span class="chip">💸 ${d.mensal}/mês</span>`);

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-topo">
        <span class="card-nome">${d.icone} ${d.nome}${qtd ? `<span class="qtd">×${qtd}</span>` : ''}</span>
        <span class="card-ods">${d.ods}</span>
      </div>
      <p class="card-desc">${d.desc}</p>
      <div class="card-efeitos">${efeitos.join('')}</div>
      <div class="card-botoes">
        <button class="card-comprar" ${estado.orcamento < d.custo || fimDeJogo ? 'disabled' : ''}>Construir · R$ ${d.custo} mil</button>
        ${qtd ? `<button class="card-desativar" title="Desativar (recupera 20%)" ${fimDeJogo ? 'disabled' : ''}>−</button>` : ''}
      </div>`;
    card.querySelector('.card-comprar').onclick = () => construir(chave);
    const bd = card.querySelector('.card-desativar');
    if (bd) bd.onclick = () => desativar(chave);
    wrap.appendChild(card);
  }
}

// -------- Cidade em cena vetorial animada --------

let skylineFundo = [];

function hash(i) {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function gerarSkylineFundo() {
  skylineFundo = [];
  const n = 22;
  for (let i = 0; i < n; i++) {
    skylineFundo.push({ w: 22 + hash(i * 3.1) * 30, h: 40 + hash(i * 7.7) * 90, x: i / n });
  }
}

function mix(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const r = Math.round((pa >> 16) * (1 - t) + (pb >> 16) * t);
  const gg = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t);
  const bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
  return `rgb(${r},${gg},${bl})`;
}

function desenharCidade(t) {
  t = t || 0;
  const cv = document.getElementById('cidade');
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const s = snapshot();
  const poluicao = clamp((s.co2pc - 3) / 16, 0, 1);
  const horizonY = H * 0.60;
  const groundY = H * 0.78;
  const roadH = 30;
  const foreY = groundY + roadH;

  desenharCeu(ctx, W, H, horizonY, poluicao, t);
  desenharColinas(ctx, W, horizonY, poluicao);
  desenharFundoCidade(ctx, W, groundY, poluicao);
  desenharPredios(ctx, W, groundY, poluicao);
  desenharRua(ctx, W, groundY, roadH, t);
  desenharEspeciais(ctx, W, foreY, H, t);
  desenharClima(ctx, W, H, poluicao, t);
  desenharStatus(ctx, W, s, poluicao);
}

function desenharCeu(ctx, W, H, horizonY, poluicao, t) {
  const g = ctx.createLinearGradient(0, 0, 0, horizonY);
  g.addColorStop(0, mix('#1c3a5e', '#5b5140', poluicao));
  g.addColorStop(1, mix('#7ea3c9', '#a4926f', poluicao));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  const sunX = W - 80, sunY = 56;
  ctx.save();
  ctx.globalAlpha = 1 - poluicao * 0.5;
  const halo = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, 46);
  halo.addColorStop(0, 'rgba(255,224,138,0.55)');
  halo.addColorStop(1, 'rgba(255,224,138,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(sunX - 46, sunY - 46, 92, 92);
  ctx.fillStyle = mix('#ffe08a', '#c9a86b', poluicao);
  ctx.beginPath(); ctx.arc(sunX, sunY, 22, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  ctx.fillStyle = `rgba(255,255,255,${0.22 + poluicao * 0.15})`;
  for (let i = 0; i < 4; i++) {
    const cx = ((t * (8 + i * 4) + i * 220) % (W + 160)) - 80;
    const cy = 30 + i * 26;
    nuvem(ctx, cx, cy, 26 + i * 4);
  }
}

function nuvem(ctx, x, y, s) {
  ctx.beginPath();
  ctx.ellipse(x, y, s, s * 0.55, 0, 0, Math.PI * 2);
  ctx.ellipse(x + s * 0.7, y + s * 0.12, s * 0.7, s * 0.42, 0, 0, Math.PI * 2);
  ctx.ellipse(x - s * 0.6, y + s * 0.15, s * 0.6, s * 0.38, 0, 0, Math.PI * 2);
  ctx.fill();
}

function desenharColinas(ctx, W, horizonY, poluicao) {
  ctx.save();
  ctx.fillStyle = mix('#16324a', '#4a4030', poluicao);
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  for (let x = 0; x <= W; x += 40) ctx.lineTo(x, horizonY - 14 - Math.sin(x * 0.02) * 10);
  ctx.lineTo(W, horizonY + 20); ctx.lineTo(0, horizonY + 20); ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function desenharFundoCidade(ctx, W, groundY, poluicao) {
  if (!skylineFundo.length) gerarSkylineFundo();
  ctx.save();
  ctx.fillStyle = mix('#0f2338', '#3a3226', poluicao);
  ctx.globalAlpha = 0.55;
  skylineFundo.forEach(b => ctx.fillRect(b.x * W, groundY - b.h, b.w, b.h));
  ctx.restore();
}

function desenharPredios(ctx, W, groundY, poluicao) {
  const casas = Math.max(3, Math.round(estado.populacao / 700));
  const cols = Math.min(24, casas);
  const gap = W / cols;
  for (let i = 0; i < casas; i++) {
    const col = i % cols;
    const camada = Math.floor(i / cols);
    const h = 34 + hash(i * 2.3) * 70 + camada * 18;
    const w = gap * 0.62;
    const x = col * gap + gap * 0.19 - camada * 6;
    const y = groundY - h;
    ctx.fillStyle = mix('#27314a', '#4a4536', poluicao * 0.6);
    ctx.fillRect(x, y, w, h);
    if (estado.construcoes.telhadoVerde && hash(i * 5.1) < 0.5) {
      ctx.fillStyle = 'rgba(74,222,128,0.35)';
      ctx.fillRect(x, y, w, 4);
    }
    const jc = Math.max(1, Math.floor(w / 10));
    const jl = Math.max(1, Math.floor(h / 12));
    for (let jy = 0; jy < jl; jy++) {
      for (let jx = 0; jx < jc; jx++) {
        const aceso = hash(i * 31 + jx * 7 + jy * 13) > 0.45;
        ctx.fillStyle = aceso ? 'rgba(253,224,138,0.85)' : 'rgba(10,12,20,0.5)';
        ctx.fillRect(x + 3 + jx * 9, y + 5 + jy * 11, 5, 6);
      }
    }
  }
}

function desenharRua(ctx, W, groundY, roadH, t) {
  ctx.fillStyle = '#1b1b26';
  ctx.fillRect(0, groundY, W, roadH);

  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 3;
  ctx.setLineDash([16, 14]);
  ctx.lineDashOffset = -t * 40;
  ctx.beginPath();
  ctx.moveTo(0, groundY + roadH / 2);
  ctx.lineTo(W, groundY + roadH / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  if (estado.construcoes.ciclovia) {
    ctx.fillStyle = 'rgba(16,185,129,0.55)';
    ctx.fillRect(0, groundY - 8, W, 8);
  }
  if (estado.construcoes.onibus) {
    ctx.fillStyle = 'rgba(251,191,36,0.25)';
    ctx.fillRect(0, groundY, W, 8);
    const bx = (t * 60) % (W + 60) - 30;
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(bx, groundY + 1, 34, 10);
    ctx.fillStyle = '#1b1b26';
    ctx.fillRect(bx + 3, groundY + 8, 6, 4);
    ctx.fillRect(bx + 24, groundY + 8, 6, 4);
  }
  if (estado.construcoes.metro) {
    const my = groundY - 26;
    ctx.strokeStyle = '#3b3b5c'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, my); ctx.lineTo(W, my); ctx.stroke();
    for (let x = 20; x < W; x += 70) { ctx.beginPath(); ctx.moveTo(x, my); ctx.lineTo(x, my + 14); ctx.stroke(); }
    const tx = (t * 90) % (W + 80) - 40;
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(tx, my - 10, 46, 10);
  }
}

const ORDEM_ICONES = ['solar', 'eolica', 'gas', 'carvao', 'hidro', 'nuclear', 'eta', 'reservatorio', 'aterro', 'reciclagem', 'compostagem', 'parque', 'telhadoVerde'];

function desenharEspeciais(ctx, W, foreY, H, t) {
  const ativos = ORDEM_ICONES.filter(k => estado.construcoes[k]);
  if (!ativos.length) return;
  const gap = W / (ativos.length + 1);
  const baseY = H - 8;
  ativos.forEach((k, i) => {
    const cx = gap * (i + 1);
    const qtd = estado.construcoes[k];
    desenharIcone(ctx, k, cx, baseY, t, qtd);
    if (qtd > 1) {
      ctx.fillStyle = '#0a0a14';
      ctx.beginPath(); ctx.arc(cx + 20, baseY - 46, 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#67e8f9';
      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('×' + qtd, cx + 20, baseY - 45);
      ctx.textBaseline = 'alphabetic';
    }
  });
}

function desenharIcone(ctx, k, cx, baseY, t, qtd) {
  const esc = Math.min(1.4, 1 + (qtd - 1) * 0.12);
  ctx.save();
  ctx.translate(cx, baseY);
  ctx.scale(esc, esc);
  switch (k) {
    case 'solar': iconeSolar(ctx, t); break;
    case 'eolica': iconeEolica(ctx, t); break;
    case 'gas': iconeChamine(ctx, t, '#94a3b8', 0.5); break;
    case 'carvao': iconeChamine(ctx, t, '#3f3f46', 1); break;
    case 'hidro': iconeHidro(ctx, t); break;
    case 'nuclear': iconeNuclear(ctx, t); break;
    case 'eta': iconeTorreAgua(ctx); break;
    case 'reservatorio': iconeReservatorio(ctx); break;
    case 'aterro': iconeAterro(ctx); break;
    case 'reciclagem': iconeReciclagem(ctx); break;
    case 'compostagem': iconeComposta(ctx); break;
    case 'parque': iconeArvores(ctx); break;
    case 'telhadoVerde': iconeTelhadoVerde(ctx); break;
  }
  ctx.restore();
}

function iconeSolar(ctx, t) {
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-16, -6, 32, 6);
  ctx.save();
  ctx.translate(0, -6);
  ctx.rotate(-0.25);
  const g = ctx.createLinearGradient(-18, -10, 18, 0);
  g.addColorStop(0, '#1d4ed8'); g.addColorStop(1, '#3b82f6');
  ctx.fillStyle = g;
  ctx.fillRect(-18, -12, 36, 14);
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1;
  for (let i = -18; i <= 18; i += 9) { ctx.beginPath(); ctx.moveTo(i, -12); ctx.lineTo(i, 2); ctx.stroke(); }
  const glow = 0.4 + Math.sin(t * 2) * 0.15;
  ctx.fillStyle = `rgba(255,255,255,${glow * 0.3})`;
  ctx.fillRect(-18, -12, 36, 5);
  ctx.restore();
}

function iconeEolica(ctx, t) {
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -46); ctx.stroke();
  ctx.save();
  ctx.translate(0, -46);
  ctx.rotate(t * 3);
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2.5;
  for (let i = 0; i < 3; i++) {
    ctx.save(); ctx.rotate((Math.PI * 2 / 3) * i);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(4, -10, 2, -20); ctx.stroke();
    ctx.restore();
  }
  ctx.fillStyle = '#94a3b8'; ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function iconeChamine(ctx, t, corFumaca, intensidade) {
  ctx.fillStyle = '#3a3a4a';
  ctx.fillRect(-20, -22, 40, 22);
  ctx.fillRect(6, -40, 8, 20);
  for (let i = 0; i < 5; i++) {
    const p = (t * 0.4 + i * 0.22) % 1;
    const y = -40 - p * 40;
    const x = 10 + Math.sin(p * 8 + i) * 8 * p;
    ctx.save();
    ctx.globalAlpha = intensidade * (1 - p) * 0.6;
    ctx.fillStyle = corFumaca;
    ctx.beginPath(); ctx.arc(x, y, 5 + p * 8, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

function iconeHidro(ctx, t) {
  ctx.fillStyle = '#475569';
  ctx.fillRect(-24, -30, 48, 30);
  ctx.fillStyle = '#38bdf8';
  const onda = Math.sin(t * 3) * 2;
  ctx.fillRect(-24, -8 + onda, 48, 8);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  for (let i = 0; i < 3; i++) {
    const y = -6 + Math.sin(t * 4 + i) * 2;
    ctx.fillRect(-20 + i * 16, y, 10, 2);
  }
}

function iconeNuclear(ctx, t) {
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.moveTo(-18, 0); ctx.quadraticCurveTo(-24, -24, -10, -44);
  ctx.lineTo(10, -44); ctx.quadraticCurveTo(24, -24, 18, 0);
  ctx.closePath(); ctx.fill();
  for (let i = 0; i < 3; i++) {
    const p = (t * 0.3 + i * 0.3) % 1;
    ctx.save();
    ctx.globalAlpha = (1 - p) * 0.5;
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath(); ctx.arc(0, -44 - p * 30, 6 + p * 10, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

function iconeTorreAgua(ctx) {
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-6, -26); ctx.moveTo(10, 0); ctx.lineTo(6, -26); ctx.stroke();
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath(); ctx.ellipse(0, -30, 16, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(-16, -30, 32, 14);
}

function iconeReservatorio(ctx) {
  ctx.fillStyle = '#0ea5e9';
  ctx.beginPath(); ctx.ellipse(0, -14, 20, 14, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(-20, -14, 40, 14);
  ctx.beginPath(); ctx.ellipse(0, 0, 20, 7, 0, 0, Math.PI); ctx.fill();
}

function iconeAterro(ctx) {
  ctx.fillStyle = '#5b4636';
  ctx.beginPath(); ctx.moveTo(-24, 0); ctx.quadraticCurveTo(0, -30, 24, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#78716c';
  ctx.fillRect(-6, -22, 5, 5); ctx.fillRect(4, -18, 6, 6);
}

function iconeReciclagem(ctx) {
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(-14, -26, 28, 26);
  ctx.strokeStyle = '#dcfce7'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, -13, 9, 0.3, Math.PI * 1.5); ctx.stroke();
}

function iconeComposta(ctx) {
  ctx.fillStyle = '#4d3b25';
  ctx.beginPath(); ctx.ellipse(0, -4, 20, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-4, -10); ctx.lineTo(-6, -22); ctx.moveTo(4, -10); ctx.lineTo(7, -20); ctx.stroke();
}

function iconeArvores(ctx) {
  for (let i = -1; i <= 1; i++) {
    ctx.fillStyle = '#065f46';
    ctx.beginPath(); ctx.arc(i * 16, -28, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#3f2a17';
    ctx.fillRect(i * 16 - 2, -14, 4, 14);
  }
}

function iconeTelhadoVerde(ctx) {
  ctx.fillStyle = '#334155';
  ctx.fillRect(-18, -20, 36, 20);
  ctx.fillStyle = '#4ade80';
  ctx.fillRect(-18, -22, 36, 5);
}

function desenharClima(ctx, W, H, poluicao, t) {
  if (poluicao > 0.05) {
    ctx.fillStyle = `rgba(120,110,90,${poluicao * 0.4})`;
    ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 6; i++) {
      const x = ((t * 15 + i * 130) % (W + 100)) - 50;
      const y = 60 + (i % 3) * 40;
      ctx.fillStyle = `rgba(90,90,80,${poluicao * 0.2})`;
      ctx.beginPath(); ctx.ellipse(x, y, 40, 14, 0, 0, Math.PI * 2); ctx.fill();
    }
  }
  if (seca > 0) {
    ctx.fillStyle = 'rgba(180,140,60,0.12)';
    ctx.fillRect(0, 0, W, H);
  }
  if (crise > 0) {
    const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.75);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(120,10,20,0.25)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  if (calorEsteMes) {
    ctx.fillStyle = `rgba(255,140,40,${0.08 + Math.sin(t * 4) * 0.03})`;
    ctx.fillRect(0, 0, W, H);
  }
}

function desenharStatus(ctx, W, s, poluicao) {
  ctx.fillStyle = 'rgba(6,6,18,0.55)';
  ctx.fillRect(0, 0, W, 26);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '13px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`Mês ${Math.min(estado.mes, META_MESES)}/${META_MESES}` +
    (seca > 0 ? '  · 🏜️ seca' : '') + (crise > 0 ? '  · 📉 crise' : ''), 12, 14);
  ctx.textAlign = 'right';
  ctx.fillText(poluicao < 0.25 ? 'ar limpo 🌿' : poluicao < 0.6 ? 'ar moderado 😐' : 'ar poluído 🏭', W - 12, 14);
}

function iniciarAnimacaoCidade() {
  const passo = (agora) => {
    desenharCidade(agora / 1000);
    requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
}

// -------- Gráfico de linha --------

function desenharGrafico(ctx, cv, grande) {
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const pad = grande ? 34 : 26;
  const dados = historico;
  if (dados.length < 1) return;

  const maxCo2 = Math.max(META_CO2 * 1.6, ...dados.map(d => d.co2pc), 8);
  const px = i => pad + (W - pad * 2) * (dados.length === 1 ? 0.5 : i / (dados.length - 1));
  const pyCo2 = v => H - pad - (H - pad * 2) * (v / maxCo2);
  const pySat = v => H - pad - (H - pad * 2) * (v / 100);

  // grade
  ctx.strokeStyle = '#20203a';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad + (H - pad * 2) * i / 4;
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke();
  }

  // linha da meta de CO2
  ctx.strokeStyle = 'rgba(16,185,129,0.5)';
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.moveTo(pad, pyCo2(META_CO2));
  ctx.lineTo(W - pad, pyCo2(META_CO2));
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(16,185,129,0.8)';
  ctx.font = '10px system-ui';
  ctx.textAlign = 'left';
  ctx.fillText('meta CO₂', pad + 3, pyCo2(META_CO2) - 4);

  const traca = (fn, cor, chave) => {
    ctx.strokeStyle = cor;
    ctx.lineWidth = grande ? 2.5 : 2;
    ctx.beginPath();
    dados.forEach((d, i) => {
      const x = px(i), y = fn(d[chave]);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.stroke();
    const ud = dados[dados.length - 1];
    ctx.fillStyle = cor;
    ctx.beginPath();
    ctx.arc(px(dados.length - 1), fn(ud[chave]), grande ? 4 : 3, 0, Math.PI * 2);
    ctx.fill();
  };
  traca(pySat, '#06b6d4', 'satisfacao');
  traca(pyCo2, '#fb923c', 'co2pc');

  ctx.fillStyle = '#6b7280';
  ctx.font = '10px system-ui';
  ctx.textAlign = 'left';
  ctx.fillText('mês ' + dados[0].mes, pad, H - 8);
  ctx.textAlign = 'right';
  ctx.fillText('mês ' + dados[dados.length - 1].mes, W - pad, H - 8);
}

// ====================== Eventos de UI ======================

document.getElementById('abas').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  catAtual = b.dataset.cat;
  document.querySelectorAll('#abas button').forEach(x => x.classList.toggle('ativa', x === b));
  renderCatalogo();
});

document.getElementById('btnAvancar').onclick = avancar;
document.getElementById('btnReiniciar').onclick = reiniciar;
document.getElementById('btnJogarDeNovo').onclick = reiniciar;

reiniciar();
iniciarAnimacaoCidade();
