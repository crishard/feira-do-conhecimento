"use client";

import { useState } from "react";

export default function CodeViewer({ arquivos }) {
  const [ativo, setAtivo] = useState(0);
  const [copiado, setCopiado] = useState(false);

  if (!arquivos.length) {
    return (
      <p className="text-sm text-muted">
        Não encontrei os arquivos-fonte deste jogo.
      </p>
    );
  }

  const arquivo = arquivos[ativo];

  async function copiar() {
    try {
      await navigator.clipboard.writeText(arquivo.codigo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      // clipboard indisponível (ex: contexto não seguro) — ignora silenciosamente
    }
  }

  return (
    <div className="rounded-2xl border border-borda bg-painel overflow-hidden">
      <div className="flex items-center justify-between border-b border-borda bg-painel2 px-2">
        <div className="flex gap-1 overflow-x-auto scroll-fino">
          {arquivos.map((a, i) => (
            <button
              key={a.nome}
              onClick={() => setAtivo(i)}
              className={`shrink-0 px-3 py-2 text-sm font-mono border-b-2 transition-colors ${
                i === ativo
                  ? "border-ciano text-texto"
                  : "border-transparent text-muted hover:text-texto"
              }`}
            >
              {a.nome}
            </button>
          ))}
        </div>
        <button
          onClick={copiar}
          className="shrink-0 m-1.5 rounded-md border border-borda px-2.5 py-1 text-xs text-muted hover:text-texto hover:border-ciano/60 transition-colors"
        >
          {copiado ? "copiado ✓" : "copiar"}
        </button>
      </div>
      <div className="visor-codigo max-h-[70vh] overflow-auto scroll-fino">
        <div dangerouslySetInnerHTML={{ __html: arquivo.html }} />
      </div>
      <div className="border-t border-borda px-3 py-1.5 text-[11px] text-muted">
        {arquivo.linhas} linhas · {arquivo.linguagem}
      </div>
    </div>
  );
}
