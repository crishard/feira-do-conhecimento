import GameCard from "@/components/GameCard";
import { jogos } from "@/lib/games";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <section className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
          Jogue e estude o código 🕹️
        </h1>
        <p className="text-muted max-w-2xl">
          Aqui estão os jogos que fizemos em aula. Jogue direto no navegador e,
          quando quiser entender como funciona por dentro, abra o{" "}
          <span className="text-texto font-semibold">"Ver código"</span> em
          cada jogo para ler o HTML, CSS e JavaScript com destaque de sintaxe,
          arquivo por arquivo.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {jogos.map((jogo) => (
          <GameCard key={jogo.slug} jogo={jogo} />
        ))}
      </section>
    </div>
  );
}
