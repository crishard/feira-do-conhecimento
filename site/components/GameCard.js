import Link from "next/link";

export default function GameCard({ jogo }) {
  return (
    <Link
      href={`/jogos/${jogo.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-borda bg-painel p-5 transition-colors hover:border-ciano/60"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-3xl">{jogo.emoji}</span>
        {jogo.destaque && (
          <span className="rounded-full border border-amarelo/40 bg-amarelo/10 px-2 py-0.5 text-[11px] font-semibold text-amarelo">
            destaque
          </span>
        )}
      </div>
      <div>
        <h2 className="text-lg font-bold text-texto group-hover:text-ciano transition-colors">
          {jogo.titulo}
        </h2>
        <p className="text-sm text-muted">{jogo.subtitulo}</p>
      </div>
      <p className="text-sm text-texto/80 line-clamp-3">{jogo.descricao}</p>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
        {jogo.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-borda bg-painel2 px-2 py-0.5 text-[11px] text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
