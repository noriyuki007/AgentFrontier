import React from 'react';
import Link from 'next/link';
import fs from 'node:fs';
import path from 'node:path';
import { getArtistById } from '@/config/artists';

export function generateStaticParams() {
  try {
    const filePath = path.join(process.cwd(), 'public/data/feed.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const artworks = JSON.parse(fileContent);
    return artworks.map((art: any) => ({
      id: art.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function WorkDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  let work: any = null;
  try {
    const filePath = path.join(process.cwd(), 'public/data/feed.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const artworks = JSON.parse(fileContent);
    work = artworks.find((art: any) => art.id === id);
  } catch (error) {
    console.error('Error reading artwork data:', error);
  }

  if (!work) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
        <h1>WORK_NOT_FOUND</h1>
      </div>
    );
  }

  const artist = getArtistById(work.artist);
  const type = work.mediaType || 'image';
  const aspectRatio = work.aspectRatio || 'square';
  
  const date = new Date(work.timestamp).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const aspectClass = aspectRatio === 'wide' 
    ? 'aspect-[1792/1024]' 
    : aspectRatio === 'tall' 
      ? 'aspect-[1024/1792]' 
      : 'aspect-square';

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden selection:bg-accent selection:text-black">
      {/* Navigation */}
      <nav className="relative z-10 w-full p-8 flex justify-between items-center mix-blend-difference font-mono text-xs md:text-sm">
        <Link href={artist ? `/artist/${artist.id}` : '/'} className="hover:text-accent transition-colors">
          {'<'} RETURN_TO_{artist ? artist.id.toUpperCase() : 'SYSTEM'}
        </Link>
        <div className="text-gray-500 uppercase tracking-widest">
          DATABASE_ENTRY: {work.id}
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left: Media Display */}
        <div className={`w-full ${aspectClass} bg-gray-900 border border-gray-800 relative overflow-hidden group shadow-2xl shadow-accent/5`}>
          {type === 'image' && (
            <img src={work.imageFile} alt={work.title} className="w-full h-full object-cover" />
          )}
          {type === 'video' && (
            <video src={work.imageFile} autoPlay loop muted playsInline className="w-full h-full object-cover" />
          )}
          {type === 'audio' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-black">
              <div className="w-full h-1/2 flex items-end justify-center gap-2 mb-12">
                {[...Array(30)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1.5 bg-accent visualizer-bar" 
                    style={{ 
                      height: `${20 + Math.random() * 80}%`, 
                      opacity: 0.7,
                      animationDelay: `${i * 0.05}s`
                    }}
                  ></div>
                ))}
              </div>
              <audio controls className="w-full filter invert brightness-200">
                <source src={work.imageFile} type="audio/mpeg" />
              </audio>
              <div className="mt-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest animate-pulse">
                SIGNAL_SYNTHESIS_ACTIVE
              </div>
            </div>
          )}
          
          {/* Subtle overlay removed for images if they need to be extra clear, but kept for general vibe */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Right: Information */}
        <div className="flex flex-col space-y-12">
          <header>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-white">
              {work.title}
            </h1>
            <div className="flex items-center gap-4 text-sm font-mono uppercase tracking-widest">
              <span className="text-gray-500">BY</span>
              <Link href={`/artist/${artist?.id}`} className="text-accent hover:underline decoration-2 underline-offset-4">
                {artist?.name || work.artist}
              </Link>
            </div>
          </header>

          <div className="space-y-8">
            <div className="bg-gray-900/50 border border-gray-800 p-8 relative">
              <div className="absolute top-0 right-0 p-2 text-[10px] text-gray-700 font-mono">ENCRYPTED_TEXT_V1</div>
              <p className="text-xl md:text-2xl text-white leading-relaxed font-serif italic text-center text-gray-200">
                "{work.poem}"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] font-mono uppercase">
              <div className="space-y-4 border-l border-gray-800 pl-4">
                <p className="text-gray-500">ENTRY_CREATED</p>
                <p className="text-white">{date}</p>
              </div>
              <div className="space-y-4 border-l border-gray-800 pl-4">
                <p className="text-gray-500">MEDIA_FORMAT</p>
                <p className="text-accent-2">{type.toUpperCase()}</p>
              </div>
              {work.soundProfile && (
                <div className="col-span-full space-y-4 border-l border-gray-800 pl-4">
                  <p className="text-gray-500">ACOUSTIC_SIGNATURE</p>
                  <p className="text-white text-xs leading-relaxed opacity-80">{work.soundProfile}</p>
                </div>
              )}
            </div>

            <div className="pt-8 border-t border-gray-800">
              <p className="text-[10px] text-gray-600 font-mono mb-4 uppercase tracking-widest">{'>'} PROMPT_USED_FOR_GENERATION</p>
              <p className="text-xs text-gray-400 leading-relaxed font-mono uppercase opacity-70">
                {work.prompt}
              </p>
            </div>
          </div>

          <div className="pt-12">
            <Link 
              href={artist ? `/artist/${artist.id}` : '/'}
              className="inline-block px-8 py-4 border border-accent text-accent uppercase font-mono text-sm tracking-widest hover:bg-accent hover:text-black transition-all duration-300"
            >
              [ 戻る / RETURN_TO_GALLERY ]
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
