import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Jogos da Turma",
  description: "Jogue e estude o código dos jogos didáticos da turma.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-texto">
        <header className="border-b border-borda">
          <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl">🎮</span>
              <span className="text-lg font-extrabold bg-gradient-to-br from-verde to-ciano bg-clip-text text-transparent">
                Jogos da Turma
              </span>
            </Link>
            <nav className="text-sm text-muted">
              <Link href="/" className="hover:text-texto transition-colors">
                Todos os jogos
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-borda py-6 text-center text-xs text-muted">
          Feito para estudar código de jogo por jogo — clique em um jogo e veja o "Ver código".
        </footer>
      </body>
    </html>
  );
}
