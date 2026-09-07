import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { codeToHtml } from 'shiki';

const ARQUIVOS = [
  { nome: 'index.html', linguagem: 'html' },
  { nome: 'style.css', linguagem: 'css' },
  { nome: 'script.js', linguagem: 'javascript' },
];

// A pasta de cada jogo vive um nível acima do site Next (aulas/<pasta>).
const AULAS_DIR = path.join(process.cwd(), '..');

export async function lerCodigoFonte(jogo) {
  const pastaJogo = path.join(AULAS_DIR, jogo.pasta);
  const arquivos = [];

  for (const { nome, linguagem } of ARQUIVOS) {
    const caminho = path.join(/*turbopackIgnore: true*/ pastaJogo, nome);
    if (!existsSync(/*turbopackIgnore: true*/ caminho)) continue;

    const codigo = readFileSync(/*turbopackIgnore: true*/ caminho, 'utf-8');
    const html = await codeToHtml(codigo, {
      lang: linguagem,
      theme: 'github-dark-default',
    });

    arquivos.push({ nome, linguagem, codigo, html, linhas: codigo.split('\n').length });
  }

  return arquivos;
}
