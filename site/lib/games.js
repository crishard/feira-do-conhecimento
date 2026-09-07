// Registro central dos jogos didáticos.
// `pasta` é o nome da pasta em `aulas/<pasta>`, que também vira `public/games/<slug>`.

export const jogos = [
  {
    slug: 'cidade-sustentavel',
    pasta: 'cidade-sustentavel',
    titulo: 'Cidade Sustentável',
    emoji: '🏙️',
    subtitulo: 'Gestão urbana em 36 meses — Agenda 2030',
    descricao:
      'Simulador de gestão urbana por turnos: equilibre orçamento, energia, água, resíduos, CO₂ por habitante e satisfação da população construindo usinas, saneamento, mobilidade e áreas verdes. Eventos aleatórios (seca, onda de calor, crise econômica) testam o planejamento, e o mandato termina com um relatório com medalhas por ODS.',
    tags: ['ODS 6', 'ODS 7', 'ODS 11', 'ODS 13', 'Simulação', 'Canvas 2D'],
    destaque: true,
  },
  {
    slug: 'trilha-do-codigo',
    pasta: 'trilha-do-codigo',
    titulo: 'Trilha do Código',
    emoji: '🤖',
    subtitulo: 'Programe um robô casa por casa',
    descricao:
      'Introdução a pensamento computacional: clique nas casas de um tabuleiro para montar uma sequência de comandos, gere o "código" do percurso e desafie outra pessoa a chegar ao mesmo resultado.',
    tags: ['BNCC CG5', 'Pensamento computacional'],
  },
  {
    slug: 'acerte-a-toupeira',
    pasta: 'acerte-a-toupeira',
    titulo: 'Acerte a Toupeira',
    emoji: '🔨',
    subtitulo: 'Reflexo e tempo de reação',
    descricao:
      'Clássico whack-a-mole: acerte as toupeiras que aparecem em buracos aleatórios e some pontos, mas cuidado — bombas escondidas tiram pontos do placar.',
    tags: ['Eventos DOM', 'Timers'],
  },
  {
    slug: 'cobrinha',
    pasta: 'cobrinha',
    titulo: 'Cobrinha',
    emoji: '🐍',
    subtitulo: 'O clássico Snake em Canvas',
    descricao:
      'Implementação do jogo da cobrinha: coma as maçãs para crescer e não bata nas paredes nem em você mesmo. Bom exemplo de loop de jogo, grade e colisão.',
    tags: ['Canvas 2D', 'Loop de jogo'],
  },
  {
    slug: 'quebra-blocos',
    pasta: 'quebra-blocos',
    titulo: 'Quebra-blocos',
    emoji: '🧱',
    subtitulo: 'Breakout — rebata e destrua',
    descricao:
      'Variação do clássico Breakout: controle a raquete para rebater a bola e destruir todos os blocos da tela. Ensina física simples de colisão em Canvas.',
    tags: ['Canvas 2D', 'Colisão'],
  },
  {
    slug: 'pong',
    pasta: 'pong',
    titulo: 'Pong',
    emoji: '🏓',
    subtitulo: 'Dois jogadores, mesmo teclado',
    descricao:
      'O jogo que começou tudo: duas raquetes, uma bola e um placar. Ótimo primeiro projeto em Canvas para entender coordenadas, teclado e IA simples.',
    tags: ['Canvas 2D', 'Multiplayer local'],
  },
];

export function buscarJogo(slug) {
  return jogos.find((j) => j.slug === slug);
}
