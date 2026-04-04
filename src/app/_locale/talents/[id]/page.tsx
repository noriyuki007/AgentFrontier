import Image from "next/image";
import Link from "next/link";
import { talents } from "@/lib/data";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return talents.map((t) => ({ id: t.id }));
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const talent = talents.find((t) => t.id === id);

  if (!talent) return notFound();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">
      <Link href="/talents" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-brand-primary mb-12 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m15 18-6-6 6-6"/></svg>
        BACK TO CATALOG
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-start">
        {/* Left: Huge Visual */}
        <div className="lg:col-span-5 relative">
          <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-gray-50 border border-card-border shadow-2xl">
            <Image 
              src={talent.image} 
              alt={talent.name} 
              fill 
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full glass flex items-center justify-center p-4 text-center">
             <p className="text-[10px] font-black uppercase tracking-tighter leading-tight text-gradient">
               OFFICIAL <br />CERTIFIED <br />AGENT
             </p>
          </div>
        </div>

        {/* Right: Info & SNS */}
        <div className="lg:col-span-7 flex flex-col gap-12 text-center lg:text-left">
          {/* Header Info */}
          <div className="border-b border-card-border pb-12">
            <h1 className="text-6xl md:text-8xl mb-2">{talent.name}</h1>
            <p className="text-2xl font-black text-brand-primary mb-6">{talent.nameJa}</p>
            <p className="text-3xl font-black tracking-tight leading-tight italic">
              "{talent.catchphrase}"
            </p>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="p-8 rounded-3xl bg-gray-50 border border-card-border">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Personality</h3>
              <p className="text-lg font-bold leading-relaxed">{talent.personality}</p>
            </div>
            <div className="p-8 rounded-3xl bg-brand-secondary/10 border border-brand-secondary/20">
              <h3 className="text-xs font-black text-brand-secondary uppercase tracking-widest mb-4">Specialty</h3>
              <p className="text-lg font-bold leading-relaxed">{talent.specialty}</p>
            </div>
          </div>

          {/* Backstory */}
          <div className="text-left p-8 md:p-12 rounded-3xl border border-card-border">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Origin Story</h3>
            <p className="text-xl md:text-2xl font-medium leading-relaxed text-gray-700">
              {talent.backstory}
            </p>
          </div>

          {/* Dummy SNS Feed */}
          <div className="text-left">
            <div className="flex items-center gap-4 mb-8">
               <div className="h-px bg-gray-200 flex-1" />
               <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Recent Updates</h3>
               <div className="h-px bg-gray-200 flex-1" />
            </div>
            
            <div className="space-y-4">
              {talent.snsFeed.map((item) => (
                <div key={item.id} className="p-6 rounded-2xl bg-white border border-card-border hover:border-brand-primary transition-colors cursor-default">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-[10px] font-black uppercase">
                        {talent.name[0]}
                      </div>
                      <span className="text-sm font-black italic">{talent.name} Official @FR_FR</span>
                    </div>
                    <span className="text-xs font-bold text-gray-400">{item.date}</span>
                  </div>
                  <p className="text-lg font-medium text-gray-800 leading-snug">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
               <button className="bg-gray-100 px-8 py-3 rounded-full text-xs font-black text-gray-400 uppercase hover:bg-gray-200 transition-colors">
                 Load more activity
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
