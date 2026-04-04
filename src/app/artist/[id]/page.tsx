import React from 'react';
import Link from 'next/link';
import { ARTISTS, getArtistById } from '@/config/artists';
import Exhibition from '@/components/Exhibition';

export function generateStaticParams() {
  return ARTISTS.map((artist) => ({
    id: artist.id,
  }));
}

export default async function ArtistPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const artist = getArtistById(id);

  if (!artist) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
        <h1>ENTITY_NOT_FOUND</h1>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden selection:bg-accent selection:text-black">
      {/* 画面全体のノイズ効果 */}
      <div className="bg-noise" />
      <div className="crt-scanline" />

      {/* ヘッダーナビゲーション */}
      <nav className="relative z-10 w-full p-8 flex justify-between items-center mix-blend-difference font-mono text-xs md:text-sm">
        <Link href="/" className="hover:text-accent transition-colors flex items-center gap-2">
          <span>{'<'}</span> <span className="opacity-50 tracking-normal text-[10px] hidden md:inline">戻る /</span> RETURN_TO_SYSTEM
        </Link>
        <div className="text-gray-500 uppercase tracking-widest">
          EXHIBITION: {artist.name}
        </div>
      </nav>

      {/* アーティストプロフィール */}
      <header className="relative z-10 w-full px-8 py-16 md:py-32 mb-16 border-b border-gray-800 mix-blend-difference flex flex-col items-center text-center">
        <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-transparent bg-clip-text pb-4 md:pb-8" style={{ WebkitTextStroke: `1px ${artist.color}`, color: 'transparent' }}>
          {artist.name}
        </h1>
        <div className="mt-12 md:mt-16 max-w-2xl font-mono">
          <p className="text-xl text-white mb-6 uppercase">"{artist.philosophy}"</p>
          <div className="text-sm text-gray-400 opacity-80 grid gap-2 uppercase">
            <p><span style={{ color: artist.color }}>{'>'} CORE_STYLE: </span>{artist.style}</p>
            <p><span style={{ color: artist.color }}>{'>'} STATUS: </span>ONLINE</p>
          </div>
        </div>
      </header>

      {/* アーティスト専用ギャラリー */}
      <section className="relative z-10 w-full">
        <Exhibition artistId={artist.id} />
      </section>

      {/* Footer Back Button */}
      <footer className="relative z-10 w-full p-20 flex justify-center border-t border-gray-900 mt-20">
        <Link 
          href="/" 
          className="px-12 py-4 border border-white hover:border-accent hover:text-accent transition-all font-mono uppercase tracking-widest bg-black/50 backdrop-blur"
        >
          [ 戻る / EXIT_EXHIBITION ]
        </Link>
      </footer>
    </main>
  );
}
