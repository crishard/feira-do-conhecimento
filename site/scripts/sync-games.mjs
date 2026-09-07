// Copia cada pasta de jogo (aulas/<pasta>) para public/games/<slug>,
// para que o iframe do site consiga jogar os arquivos estáticos.
// Roda automaticamente antes de `dev` e `build` (ver package.json).

import { existsSync, rmSync, cpSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { jogos } from '../lib/games.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.join(__dirname, '..');
const aulasDir = path.join(siteDir, '..');
const destDir = path.join(siteDir, 'public', 'games');

let copiados = 0;

for (const jogo of jogos) {
  const origem = path.join(aulasDir, jogo.pasta);
  const destino = path.join(destDir, jogo.slug);

  if (!existsSync(origem)) {
    console.warn(`[sync-games] pasta não encontrada, pulando: ${origem}`);
    continue;
  }

  rmSync(destino, { recursive: true, force: true });
  cpSync(origem, destino, { recursive: true });
  copiados++;
}

console.log(`[sync-games] ${copiados}/${jogos.length} jogos sincronizados em public/games/`);

// aviso simples se algum jogo referenciado não tem arquivos que a página espera
for (const jogo of jogos) {
  const destino = path.join(destDir, jogo.slug);
  if (!existsSync(destino)) continue;
  const arquivos = readdirSync(destino);
  if (!arquivos.includes('index.html')) {
    console.warn(`[sync-games] ${jogo.slug}: não encontrei index.html`);
  }
}
