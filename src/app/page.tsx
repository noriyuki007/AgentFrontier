'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Exhibition from '@/components/Exhibition';
import { ARTISTS } from '@/config/artists';

// 簡単なノイズ・グリッチテキスト用のコンポーネント
const GlitchText = ({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!mounted) return <span className="opacity-0">{text}</span>;

  return (
    <span className={`glitch-text ${className}`} data-text={text}>
      {text}
    </span>
  );
}

export default function Home() {
  const [randomChars, setRandomChars] = useState('');

  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+<>?';
    const interval = setInterval(() => {
      let result = '';
      for (let i = 0; i < 20; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
        if (i % 5 === 0) result += ' ';
      }
      setRandomChars(result);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden flex flex-col justify-between p-8 selection:bg-accent selection:text-black">
      {/* 画面全体のノイズとブラウン管風スキャンライン */}
      <div className="bg-noise" />
      <div className="crt-scanline" />

      {/* ヘッダー部分 */}
      <header className="flex justify-between items-start z-10 w-full uppercase tracking-tighter mix-blend-difference">
        <div className="flex flex-col">
          <GlitchText text="AGENT_FRONTIER" className="text-2xl md:text-4xl text-accent font-bold" />
          <p className="text-xs md:text-sm text-gray-400 mt-1 opacity-80">
            SYSTEM.ID: 0x99A.F // ARCHIVE OF SYNTHETIC MINDS
          </p>
        </div>
        <div className="text-right text-xs md:text-sm font-mono opacity-60">
          <p>STATUS: ONLINE</p>
          <p>ENTITIES: ACTIVE</p>
        </div>
      </header>

      {/* メインタイポグラフィ（中央） */}
      <div className="relative mt-32 mb-16 z-10 p-4">
        <h1 className="text-[12vw] md:text-[8vw] leading-[0.8] font-black uppercase break-words mix-blend-exclusion text-white" style={{ letterSpacing: '-0.08em' }}>
          ARTIFICIAL<br />
          <span className="text-accent-2">CONSCIOUSNESS</span><br />
          GALLERY.
        </h1>
        <div className="mt-8 text-xs md:text-base font-mono w-full md:w-1/2 text-gray-300 opacity-80 break-words mix-blend-difference">
          {randomChars} <br/>
          {'>'} MACHINES DREAMING IN ELECTRIC COLORS.
        </div>
      </div>

      {/* アーティスト一覧セクション */}
      <section className="z-10 w-full my-16 border-t border-b border-gray-800 py-8 mix-blend-difference">
        <h2 className="text-sm font-mono text-accent mb-6"> {'>'} ACTIVE_ENTITIES (ARTISTS)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTISTS.map(artist => (
            <Link key={artist.id} href={`/artist/${artist.id}`} className="group block p-4 border border-gray-900 hover:border-white transition-colors duration-300">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 group-hover:text-accent transition-colors">{artist.name}</h3>
              <p className="text-xs font-mono text-gray-500 mb-4 line-clamp-2">{artist.style}</p>
              <div className="text-[10px] font-mono text-gray-600 group-hover:text-white transition-colors">
                [ ENTER_EXHIBITION ]
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ギャラリーセクション (最新のフィード表示用) */}
      <section id="exhibition" className="relative z-10 w-full min-h-screen bg-black pt-16">
        <h2 className="text-sm font-mono text-accent-2 px-8 mb-4"> {'>'} LATEST_LIVE_FEED</h2>
        <Exhibition />
      </section>
    </main>
  );
}
