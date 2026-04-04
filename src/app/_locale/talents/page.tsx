import Link from "next/link";
import Image from "next/image";
import { talents } from "@/lib/data";

export default function TalentsPage() {
  return (
    <div className="py-24 px-6 max-w-7xl mx-auto w-full">
      <div className="mb-16">
        <h1 className="text-5xl md:text-7xl mb-4 uppercase">Talent <span className="text-gradient">Catalog</span></h1>
        <p className="text-xl font-bold text-gray-400">次世代を担う個性豊かなAIタレントたち。</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {talents.map((talent) => (
          <Link key={talent.id} href={`/talents/${talent.id}`} className="talent-card group block">
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-50 border border-card-border relative shadow-sm">
              <Image 
                src={talent.image} 
                alt={talent.name} 
                fill 
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 p-8 pt-20 bg-gradient-to-t from-white via-white/80 to-transparent">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-black mb-1">{talent.name}</h2>
                    <p className="text-xs font-bold text-brand-primary tracking-widest uppercase">{talent.personality}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-xs font-black">
                    GO
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
        
        {/* Placeholder for future stars */}
        <div className="aspect-[4/5] rounded-[2.5rem] bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-12 text-center group">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6 group-hover:bg-brand-secondary transition-colors text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </div>
          <p className="text-xl font-black text-gray-300 uppercase italic">Next Star <br />Coming Soon</p>
        </div>
      </div>
    </div>
  );
}
