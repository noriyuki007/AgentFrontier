'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

type ExhibitionProps = {
  artistId?: string; // 指定がない場合は全件表示
};

function ExhibitionItem({ art, index }: { art: any; index: number }) {
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsPromptExpanded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const type = art.mediaType || 'image';
  // Use thumbnail for grid view if available, fallback to main image
  const displayMedia = art.thumbnail || art.imageFile;

  return (
    <div ref={itemRef} className="relative group flex flex-col items-center">
      <Link 
        href={`/work/${art.id}`}
        className="w-full flex flex-col items-center cursor-crosshair"
      >
        {/* Labeling */}
        <div className="w-full text-left mb-2 border-b border-gray-800 pb-2 mix-blend-difference z-10">
          <h2 className="text-xl md:text-3xl font-black uppercase text-white tracking-tighter">
            {art.title}
          </h2>
          <div className="text-xs text-accent mt-1 font-mono uppercase font-bold flex justify-between">
            <span>ARTIST: {art.artist} // ID: {art.id}</span>
            <span className="text-accent-2">FORMAT: {type.toUpperCase()}</span>
          </div>
        </div>

        {/* Media Rendering */}
        <div className="relative w-full aspect-square overflow-hidden bg-gray-900 border border-gray-800 group-hover:border-accent transition-colors duration-500 flex items-center justify-center">
          
          {type === 'image' && (
            <img 
              src={displayMedia} 
              alt={art.title} 
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
            />
          )}

          {type === 'video' && (
            <video 
              src={art.imageFile} 
              autoPlay loop muted playsInline
              preload="none"
              poster={art.thumbnail}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
            />
          )}

          {type === 'audio' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center w-full h-full bg-black p-4">
              {/* Audio visualizer mockup */}
              <div className="w-full h-1/2 flex items-end justify-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-2 bg-accent" style={{ height: `${Math.random() * 100}%`, animation: `pulse ${0.5 + Math.random()}s infinite alternate` }}></div>
                ))}
              </div>
              <div className="mt-8 font-mono text-center">
                <p className="text-accent-2 mb-2 animate-pulse">[ AUDIO STREAM ACTIVE ]</p>
                <audio controls className="w-full grayscale opacity-50 group-hover:opacity-100" preload="none">
                  <source src={art.imageFile} type="audio/mpeg" />
                </audio>
              </div>
            </div>
          )}

          {/* Hover overlay text */}
          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-8 pointer-events-none">
            <p className="text-white font-mono text-xs md:text-sm text-center leading-relaxed">
              {art.poem}
            </p>
          </div>
        </div>
      </Link>
      
      {/* Prompt metadata - Scroll-triggered Accordion behavior */}
      <div 
        className={`w-full mt-4 text-[10px] text-gray-600 font-mono uppercase break-words transition-all duration-700 overflow-hidden ${
          isPromptExpanded ? 'line-clamp-none opacity-100' : 'line-clamp-3 opacity-60'
        } hover:line-clamp-none hover:opacity-100 cursor-help`}
      >
        <span className="text-accent-2">{'>'} PROMPT_DATA: </span>{art.prompt}
      </div>
    </div>
  );
}

export default function Exhibition({ artistId }: ExhibitionProps) {
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(12);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/data/feed.json?t=' + new Date().getTime())
      .then(res => res.json())
      .then(data => {
        let filtered = data || [];
        if (artistId) {
          const targetId = artistId.replace(/_/g, ' ').toUpperCase();
          filtered = filtered.filter((art: any) => 
            art.artist.replace(/_/g, ' ').toUpperCase() === targetId
          );
        }
        setArtworks(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setArtworks([]);
        setLoading(false);
      });
  }, [artistId]);

  // Infinite Scroll / Auto-expand trigger
  useEffect(() => {
    if (!loadMoreRef.current || displayLimit >= artworks.length) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Increase limit incrementally
          setDisplayLimit(prev => Math.min(prev + 12, artworks.length));
        }
      },
      { threshold: 0.1, rootMargin: '200px' } // Load earlier for smoother feel
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [displayLimit, artworks.length]);

  if (loading) {
    return (
      <div className="w-full text-center p-20 font-mono text-accent animate-pulse">
        [ LOADING EXHIBITION DATA... ]
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <div className="w-full text-center p-20 font-mono text-gray-500">
        NO ARTWORKS FOUND IN ARCHIVE.
      </div>
    );
  }

  const displayedArtworks = artworks.slice(0, displayLimit);

  return (
    <>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-16 py-20 px-8">
        {displayedArtworks.map((art, idx) => (
          <ExhibitionItem key={art.id} art={art} index={idx} />
        ))}
      </div>

      {artworks.length > displayLimit && (
        <div ref={loadMoreRef} className="w-full flex justify-center pb-20">
          <button 
            onClick={() => setDisplayLimit(prev => Math.min(prev + 12, artworks.length))}
            className="px-12 py-4 border border-accent text-accent font-mono text-xs uppercase tracking-widest hover:bg-accent hover:text-black transition-all duration-300"
          >
            [ ACCESS_MORE_ARCHIVES ]
          </button>
        </div>
      )}
    </>
  );
}
