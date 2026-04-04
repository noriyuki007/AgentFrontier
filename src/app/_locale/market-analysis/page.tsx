'use client';

import React, { useEffect, useState } from 'react';
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

interface MarketUpdate {
    title: string;
    content: string;
    short_summary: string;
}

interface DailySummary {
    bullet_points: string[];
    market_mood: string;
}

interface MarketData {
    timestamp: string;
    updates: {
        FX?: MarketUpdate;
        STOCKS?: MarketUpdate;
        CRYPTO?: MarketUpdate;
        daily_summary?: DailySummary;
    };
}

interface ArchiveItem {
    id: string;
    timestamp: string;
    mood?: string;
}

export default function MarketAnalysisPage() {
    const [data, setData] = useState<MarketData | null>(null);
    const [archive, setArchive] = useState<ArchiveItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const API_BASE = 'https://sc-market-worker.audiotistic007.workers.dev';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_BASE}/latest`);
                const result = await response.json();
                setData(result);

                const archRes = await fetch(`${API_BASE}/archive`);
                const archResult = await archRes.json();
                setArchive(archResult);
            } catch (error) {
                console.error('Failed to fetch market data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const loadArchiveId = async (id: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/archive?id=${id}`);
            const result = await response.json();
            setData(result);
            setSelectedCategory(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Failed to load archive:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020203] text-white flex items-center justify-center font-sans tracking-tighter">
                <div className="flex flex-col items-center">
                    <div className="relative w-20 h-20 mb-8">
                        <div className="absolute inset-0 rounded-full border-t-2 border-blue-600 animate-spin"></div>
                        <div className="absolute inset-2 rounded-full border-t-2 border-purple-600 animate-spin" style={{ animationDuration: '1.5s' }}></div>
                    </div>
                    <p className="text-gray-500 font-bold tracking-[0.3em] uppercase text-[10px] animate-pulse">Synchronizing Synapse Protocol...</p>
                </div>
            </div>
        );
    }

    const updates = data?.updates || {};
    const summary = updates.daily_summary;

    return (
        <div className="min-h-screen bg-[#020203] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
            <Header />
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Noto+Sans+JP:wght@100..900&display=swap');
                :root {
                    --bg-card: rgba(255, 255, 255, 0.02);
                    --border-card: rgba(255, 255, 255, 0.05);
                    --font-title: 'Outfit', 'Noto Sans JP', sans-serif;
                    --font-body: 'Noto Sans JP', sans-serif;
                    --brand-blue: #2563eb;
                    --brand-purple: #7c3aed;
                }
                body {
                    background-color: #020203;
                    font-family: var(--font-body);
                    color: #d1d5db;
                }
                .glass {
                    background: var(--bg-card);
                    backdrop-filter: blur(24px);
                    border: 1px solid var(--border-card);
                }
                .glow-text {
                    text-shadow: 0 0 40px rgba(37, 99, 235, 0.5);
                }
                .gradient-heading {
                    background: linear-gradient(to bottom, #ffffff 30%, #4b5563 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .market-content p { margin-bottom: 1.5rem; line-height: 2.2; color: #9ca3af; font-size: 1.05rem; letter-spacing: 0.02em; }
                .market-content h2 { font-size: 1.75rem; font-weight: 800; margin: 3rem 0 1.5rem; color: #fff; letter-spacing: -0.02em; }
                .market-content ul { list-style: none; padding-left: 0; margin-bottom: 2rem; }
                .market-content li { margin-bottom: 1rem; position: relative; padding-left: 1.5rem; color: #9ca3af; }
                .market-content li::before { content: ""; position: absolute; left: 0; top: 0.75rem; width: 6px; height: 6px; background: var(--brand-blue); border-radius: 50%; }
                
                .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
            `}</style>

            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/5 blur-[120px] rounded-full"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
            </div>

            {/* Sidebar Archive (Desktop Only) */}
            <aside className="hidden xl:flex fixed left-0 top-16 bottom-0 w-80 glass flex-col border-y-0 border-l-0 z-40">
                <div className="p-10 border-b border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">History Log</span>
                    </div>
                    <h3 className="text-xl font-bold font-title">過去のレポート</h3>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                    {archive.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => loadArchiveId(item.id)}
                            className={`w-full text-left p-5 rounded-2xl transition-all border ${data?.timestamp === item.timestamp ? 'bg-blue-600/10 border-blue-500/20' : 'hover:bg-white/[0.03] border-transparent hover:border-white/5'}`}
                        >
                            <span className="block text-[9px] font-black uppercase tracking-widest text-gray-600 mb-2">
                                {new Date(item.timestamp).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}
                                <span className="mx-2">|</span>
                                {new Date(item.timestamp).getHours() < 12 ? 'AM' : 'PM'} EDITION
                            </span>
                            <span className="block text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
                                {new Date(item.timestamp).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })} 同期ログ
                            </span>
                            <div className="mt-3 flex items-center gap-2">
                                <span className="text-[10px] text-gray-500 uppercase">Mood:</span>
                                <span className="text-[10px] font-black text-blue-400 capitalize">{item.mood || 'Standard'}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </aside>

            <div className="flex xl:pl-80 pt-16">
                <main className="flex-1 max-w-5xl mx-auto px-6 py-16 lg:px-12 z-10">

                    {/* Hero Section */}
                    <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">Live Analysis Protocol</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter gradient-heading leading-[0.9] mb-8" style={{ fontFamily: 'var(--font-title)' }}>
                                Market <br /> Intelligence.
                            </h1>
                            <p className="text-xl text-gray-400 font-light leading-relaxed max-w-lg mb-0">
                                AIが世界中の金融ニュースを毎秒スキャンし、<br />
                                投資判断に不可欠な核心情報を抽出します。
                            </p>
                        </div>
                        <div className="flex flex-col gap-4 text-right">
                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-600">Protocol Release</div>
                            <div className="text-3xl font-title font-light text-white leading-none">
                                {new Date(data?.timestamp || Date.now()).toLocaleDateString('ja-JP')}
                            </div>
                            <div className="text-blue-500 text-sm font-bold tracking-widest uppercase">
                                {new Date(data?.timestamp || Date.now()).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })} UPDATED
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Summary Card */}
                    <section id="summary" className="mb-24 scroll-mt-32">
                        <div className="glass rounded-[3rem] p-10 md:p-16 relative overflow-hidden group shadow-2xl">
                            <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full group-hover:scale-125 transition-transform duration-1000"></div>

                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8">
                                <div>
                                    <h2 className="text-3xl font-black mb-4 flex items-center gap-4">
                                        <span className="text-blue-600">01</span>
                                        1分でわかるマーケット・シナプス
                                    </h2>
                                    <p className="text-gray-500 font-medium">現在、世界で何が起きているか？AIが即座に回答します。</p>
                                </div>
                                <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 flex flex-col items-center min-w-[200px]">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2">Market Sentiment</span>
                                    <span className="text-3xl font-black text-blue-500 glow-text">{summary?.market_mood || 'Analyzing'}</span>
                                </div>
                            </div>

                            <div className="grid gap-8">
                                {summary?.bullet_points?.map((point, i) => (
                                    <div key={i} className="flex gap-8 group/item">
                                        <div className="flex-shrink-0 text-xl font-black text-gray-800 group-hover/item:text-blue-600 transition-colors pt-1">
                                            {String(i + 1).padStart(2, '0')}
                                        </div>
                                        <p className="text-xl md:text-2xl font-light text-gray-300 leading-snug group-hover/item:text-white transition-colors">
                                            {point}
                                        </p>
                                    </div>
                                )) || <p className="text-gray-500 italic">No summary points yet.</p>}
                            </div>
                        </div>
                    </section>

                    {/* Detailed Analysis Segments */}
                    <section id="analysis" className="scroll-mt-32">
                        <div className="flex items-center justify-between mb-16">
                            <h2 className="text-4xl font-black tracking-tighter font-title uppercase">Deep Segmentation</h2>
                            <div className="flex gap-3">
                                {['ALL', 'FX', 'STOCKS', 'CRYPTO'].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat === 'ALL' ? null : cat)}
                                        className={`h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${(selectedCategory === cat || (selectedCategory === null && cat === 'ALL')) ? 'bg-white text-black shadow-lg shadow-white/10' : 'bg-white/5 text-gray-500 hover:text-white border border-transparent hover:border-white/10'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-16">
                            {[
                                { key: 'FX', label: 'FX / 全球マクロ', expert: 'Macro Strategist', color: 'blue', icon: '🌐' },
                                { key: 'STOCKS', label: '株式市場 / 株価指数', expert: 'Equity Scout', color: 'emerald', icon: '📊' },
                                { key: 'CRYPTO', label: 'デジタル資産 / 暗号通貨', expert: 'Crypto Alchemist', color: 'purple', icon: '₿' }
                            ].map((genre) => {
                                const content = updates[genre.key as keyof typeof updates] as MarketUpdate | undefined;
                                if (!content) return null;
                                if (selectedCategory && selectedCategory !== genre.key) return null;

                                return (
                                    <article key={genre.key} className="group relative">
                                        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                            <div>
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-xl group-hover:scale-110 group-hover:border-${genre.color}-500/50 transition-all`}>
                                                        {genre.icon}
                                                    </div>
                                                    <div>
                                                        <div className={`text-[10px] font-black uppercase tracking-[0.3em] text-${genre.color}-500 mb-1`}>{genre.label}</div>
                                                        <div className="text-xs font-bold text-gray-600 uppercase tracking-widest">Protocol Analyst: {genre.expert}</div>
                                                    </div>
                                                </div>
                                                <h3 className="text-4xl md:text-5xl font-black leading-[1.1] mb-0">{content.title}</h3>
                                            </div>
                                            <div className="hidden md:block pb-2">
                                                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700 writing-vertical-lr mb-4">RELIABILITY: 98%</div>
                                                <div className="w-1 h-20 bg-gradient-to-t from-blue-600 to-transparent rounded-full mx-auto"></div>
                                            </div>
                                        </div>

                                        <div className="glass rounded-[2.5rem] p-10 md:p-14 mb-16">
                                            <div className="market-content mb-16" dangerouslySetInnerHTML={{ __html: content.content }}></div>

                                            <div className="pt-10 border-t border-white/5">
                                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                                    <div className="flex-1">
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-4 italic">Executive Summary</h4>
                                                        <p className="text-xl font-light text-white leading-relaxed italic">
                                                            "{content.short_summary}"
                                                        </p>
                                                    </div>
                                                    <button className="flex-shrink-0 self-end h-14 px-10 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-[10px] font-black uppercase tracking-widest transition-all">
                                                        Download PDF Node
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>

                    {/* Bottom Disclaimer */}
                    <footer className="mt-40 pt-20 border-t border-white/5 text-center px-12">
                        <div className="text-6xl font-black text-white/5 mb-16 select-none" style={{ fontFamily: 'var(--font-title)' }}>SYNAPSE CAPITAL MANAGEMENT</div>
                        <div className="max-w-2xl mx-auto space-y-6">
                            <p className="text-[10px] text-gray-700 leading-loose uppercase tracking-widest">
                                免責事項: 本レポートはAI技術を用いたマーケット動向分析であり、特定の金融商品の売買を推奨するものではありません。投資に関する最終決定は、必ずご自身、または資格を持つ専門のアドバイザーにご相談ください。過去の実績は将来の結果を保証するものではありません。
                            </p>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.5em]">
                                &copy; 2026 Synapse Capital. Powered by Agent Frontier AI Layer.
                            </p>
                        </div>
                    </footer>
                </main>
            </div>
            <BottomNav />
        </div>
    );
}
