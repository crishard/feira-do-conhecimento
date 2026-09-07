import { notFound } from "next/navigation";
import { jogos, buscarJogo } from "@/lib/games";
import { lerCodigoFonte } from "@/lib/read-source";
import CodeViewer from "@/components/CodeViewer";

export function generateStaticParams() {
  return jogos.map((jogo) => ({ slug: jogo.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const jogo = buscarJogo(slug);
  if (!jogo) return {};
  return {
    title: `${jogo.titulo} — Jogos da Turma`,
    description: jogo.descricao,
  };
}

export default async function PaginaJogo({ params }) {
  const { slug } = await params;
  const jogo = buscarJogo(slug);
  if (!jogo) notFound();

  const arquivos = await lerCodigoFonte(jogo);

  return (
    <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{jogo.emoji}</span>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">{jogo.titulo}</h1>
            <p className="text-muted text-sm">{jogo.subtitulo}</p>
          </div>
        </div>
        <p className="max-w-3xl text-texto/85">{jogo.descricao}</p>
        <div className="flex flex-wrap gap-1.5">
          {jogo.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-borda bg-painel2 px-2 py-0.5 text-[11px] text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Jogar</h2>
          <a
            href={`/games/${jogo.slug}/index.html`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-ciano hover:underline"
          >
            abrir em tela cheia ↗
          </a>
        </div>
        <div className="rounded-2xl border border-borda overflow-hidden bg-black">
          <iframe
            src={`/games/${jogo.slug}/index.html`}
            title={jogo.titulo}
            className="w-full aspect-[16/10] block"
          />
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-bold">Ver código</h2>
        <CodeViewer arquivos={arquivos} />
      </section>
    </div>
  );
}
