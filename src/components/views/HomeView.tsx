import React, { useState, useEffect } from 'react';
import { Novel, Chapter } from '../../types';
import NovelCard from '../NovelCard';
import { BookOpen, Sparkles, TrendingUp, Zap, Award, CheckCircle2, RefreshCcw, Dice5, HelpCircle, Flame } from 'lucide-react';

interface HomeViewProps {
  novels: Novel[];
  chapters: Chapter[];
  onNovelClick: (slug: string) => void;
  onNavigate: (view: string) => void;
  favorites: string[]; // novel ids
}

export default function HomeView({ novels, chapters, onNovelClick, onNavigate, favorites }: HomeViewProps) {
  const [randomNovel, setRandomNovel] = useState<Novel | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  // Filter novels
  const featuredNovels = novels.filter(n => n.featured);
  const trendingNovels = [...novels].sort((a, b) => b.views - a.views).slice(0, 4);
  const completedNovels = novels.filter(n => n.status === 'Completed');
  const ongoingNovels = novels.filter(n => n.status === 'Ongoing');

  // Get latest updates
  const latestUpdates = [...chapters]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6)
    .map(ch => {
      const novel = novels.find(n => n.id === ch.novel_id);
      return {
        ...ch,
        novel
      };
    });

  // Roll a random novel
  const rollRandomNovel = () => {
    if (novels.length === 0) return;
    setIsRolling(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * novels.length);
      setRandomNovel(novels[randomIndex]);
      setIsRolling(false);
    }, 600);
  };

  useEffect(() => {
    if (novels.length > 0) {
      setRandomNovel(novels[0]);
    }
  }, [novels]);

  // Main banner novel (first featured or just first novel)
  const heroNovel = featuredNovels[0] || novels[0];

  const genres = [
    'Fantasy', 'Action', 'Adventure', 'Comedy', 'Drama', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Kingdom'
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Hero Banner Section */}
      {heroNovel && (
        <section className="relative rounded-2xl overflow-hidden min-h-[440px] flex items-center shadow-2xl border border-white/5 mt-4 mx-4 sm:mx-0">
          {/* Background Blurred Cover */}
          <div className="absolute inset-0 z-0">
            <img 
              src={heroNovel.cover_url} 
              alt=""
              className="w-full h-full object-cover scale-105 filter blur-2xl opacity-15"
            />
            {/* Dark Radial Shading */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#050507] via-[#050507]/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-center w-full">
            {/* Left Cover Artwork */}
            <div className="hidden md:block col-span-1 mx-auto w-full max-w-[260px] aspect-[3/4] rounded-xl overflow-hidden border border-white/10 shadow-2xl group">
              <img 
                src={heroNovel.cover_url} 
                alt={heroNovel.title}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
            </div>

            {/* Right Novel Info */}
            <div className="col-span-1 md:col-span-2 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500 text-white text-[9px] font-bold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
                {heroNovel.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/60">
                <span className="font-semibold text-white">{heroNovel.author}</span>
                <span className="w-1 h-1 bg-white/10 rounded-full" />
                <span className="text-indigo-400 font-semibold">{heroNovel.status}</span>
                <span className="w-1 h-1 bg-white/10 rounded-full" />
                <span className="font-mono">{heroNovel.views} Views</span>
              </div>

              <p className="text-white/60 leading-relaxed text-sm line-clamp-3 max-w-lg font-sans">
                {heroNovel.synopsis}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {heroNovel.genre.map((g) => (
                  <span 
                    key={g} 
                    className="text-[10px] font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-colors"
                  >
                    {g}
                  </span>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  id="btn-hero-read"
                  onClick={() => onNovelClick(heroNovel.slug)}
                  className="px-8 py-3 bg-white text-black font-bold text-xs rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:bg-indigo-50 transition-all cursor-pointer uppercase tracking-wider"
                >
                  Read Now
                </button>
                <button
                  id="btn-hero-detail"
                  onClick={() => onNovelClick(heroNovel.slug)}
                  className="px-8 py-3 bg-white/10 text-white backdrop-blur-md font-bold text-xs rounded-full hover:bg-white/20 transition-all border-0 cursor-pointer uppercase tracking-wider"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Featured & Trending Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Featured Novels Grid (2 Columns equivalent) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold tracking-tight text-white/80">Koleksi Pilihan</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {featuredNovels.slice(0, 4).map((novel) => (
              <NovelCard 
                key={novel.id} 
                novel={novel} 
                onClick={onNovelClick}
                isFavorite={favorites.includes(novel.id)}
              />
            ))}
          </div>
        </div>

        {/* Right: Trending List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold tracking-tight text-white/80">Sedang Populer</h3>
            </div>
          </div>
          <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
            {trendingNovels.map((novel, index) => (
              <div 
                id={`trending-card-${index}`}
                key={novel.id}
                onClick={() => onNovelClick(novel.slug)}
                className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-white/5 transition-all cursor-pointer group"
              >
                {/* Ranking Number */}
                <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-mono font-black text-xs border border-white/5 bg-white/5">
                  <span className={index === 0 ? 'text-indigo-400' : index === 1 ? 'text-purple-400' : index === 2 ? 'text-purple-500' : 'text-white/30'}>
                    0{index + 1}
                  </span>
                </div>

                {/* Cover Thumbnail */}
                <div className="w-11 h-15 rounded overflow-hidden flex-shrink-0 bg-[#050507] border border-white/5">
                  <img src={novel.cover_url} alt="" className="w-full h-full object-cover" />
                </div>

                {/* Text Metadata */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors text-sm truncate">
                    {novel.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-white/40">
                    <span className="font-medium text-white/60">{novel.author}</span>
                    <span className="w-1 h-1 bg-white/10 rounded-full" />
                    <span className="flex items-center gap-0.5 text-indigo-400">
                      <Flame className="w-3 h-3 text-indigo-400 fill-indigo-400/20" />
                      <span>{novel.views}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* 3. Latest Update List */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold tracking-tight text-white/80">Rilis Bab Terbaru</h2>
          </div>
          <button 
            id="btn-home-see-latest"
            onClick={() => onNavigate('latest')} 
            className="text-[10px] text-white/30 uppercase tracking-widest cursor-pointer hover:text-white transition-colors"
          >
            <span>Lihat Semua</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {latestUpdates.map((ch) => (
            <div 
              id={`latest-ch-card-${ch.id}`}
              key={ch.id}
              onClick={() => ch.novel && onNovelClick(ch.novel.slug)}
              className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all duration-200 cursor-pointer group"
            >
              {/* Novel Mini Cover */}
              {ch.novel && (
                <div className="w-14 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#050507] border border-white/5 shadow-md">
                  <img src={ch.novel.cover_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Text Meta */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] font-bold tracking-wide uppercase text-indigo-400 bg-indigo-950/20 px-2 py-0.5 rounded border border-indigo-500/10">
                    {ch.novel?.status}
                  </span>
                  <span className="text-xs text-white/45 font-mono">
                    {new Date(ch.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                
                <h3 className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors truncate">
                  {ch.novel?.title}
                </h3>
                
                {/* Chapter link */}
                <p className="text-xs font-semibold text-white/50 mt-2 hover:text-indigo-400 transition-colors leading-tight inline-flex items-center gap-1 font-sans">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Bab {ch.chapter_number}: {ch.title}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Interactive Random Recommendation (Fun Dice!) */}
      {randomNovel && (
        <section className="bg-white/5 p-8 rounded-xl border border-white/5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto">
          <div className="space-y-4 max-w-md text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500 text-white text-[9px] font-bold uppercase tracking-wider">
              <Dice5 className="w-3.5 h-3.5" />
              <span>Dice of Destiny</span>
            </div>
            <h3 className="text-sm font-bold tracking-tight text-white/80">
              Buntu Ingin Baca Apa?
            </h3>
            <p className="text-xs text-white/50 leading-relaxed font-sans">
              Biarkan takdir ajaib menentukan petualangan fantasi Anda hari ini! Klik tombol dadu di samping untuk memilih satu novel secara acak dari perpustakaan rahasia kami.
            </p>
            <div className="pt-2">
              <button
                id="btn-roll-dice"
                onClick={rollRandomNovel}
                disabled={isRolling}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <Dice5 className={`w-4 h-4 ${isRolling ? 'animate-spin' : ''}`} />
                <span>{isRolling ? 'Mengocok Takdir...' : 'Acak Novel!'}</span>
              </button>
            </div>
          </div>

          {/* Target Novel Showcase */}
          <div 
            onClick={() => onNovelClick(randomNovel.slug)}
            className="w-full max-w-xs p-4 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/20 transition-all cursor-pointer flex gap-4 items-center group shadow-2xl"
          >
            <div className="w-16 h-22 rounded overflow-hidden flex-shrink-0 bg-[#050507] border border-white/5">
              <img src={randomNovel.cover_url} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">Takdir Terpilih</span>
              <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors text-sm sm:text-base line-clamp-1 leading-tight">
                {randomNovel.title}
              </h4>
              <p className="text-xs text-white/40 mt-1.5 font-medium">{randomNovel.author}</p>
              <div className="flex items-center gap-1.5 mt-2 text-[10px] text-white/35 font-mono">
                <span className="text-indigo-400">{randomNovel.status}</span>
                <span>•</span>
                <span>{randomNovel.genre[0]}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Ongoing & Completed Sections */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left: Ongoing Series */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <RefreshCcw className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold tracking-tight text-white/80">Kisah Berjalan (Ongoing)</h2>
            </div>
            <button 
              id="btn-see-ongoing"
              onClick={() => onNavigate('ongoing')} 
              className="text-[10px] text-white/30 uppercase tracking-widest cursor-pointer hover:text-white transition-colors"
            >
              Lihat Semua
            </button>
          </div>
          <div className="space-y-4">
            {ongoingNovels.slice(0, 3).map((novel) => (
              <div 
                id={`ongoing-item-${novel.id}`}
                key={novel.id}
                onClick={() => onNovelClick(novel.slug)}
                className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer group transition-all duration-200"
              >
                <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0 bg-[#050507] border border-white/5">
                  <img src={novel.cover_url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors text-sm truncate leading-tight">
                    {novel.title}
                  </h4>
                  <p className="text-xs text-white/50 mt-1 truncate">{novel.synopsis}</p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-white/30 font-mono">
                    <span>Oleh {novel.author}</span>
                    <span>•</span>
                    <span className="text-indigo-400">{novel.genre[0]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Completed Series */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold tracking-tight text-white/80">Seri Tamat (Completed)</h2>
            </div>
            <button 
              id="btn-see-completed"
              onClick={() => onNavigate('completed')} 
              className="text-[10px] text-white/30 uppercase tracking-widest cursor-pointer hover:text-white transition-colors"
            >
              Lihat Semua
            </button>
          </div>
          <div className="space-y-4">
            {completedNovels.slice(0, 3).map((novel) => (
              <div 
                id={`completed-item-${novel.id}`}
                key={novel.id}
                onClick={() => onNovelClick(novel.slug)}
                className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer group transition-all duration-200"
              >
                <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0 bg-[#050507] border border-white/5">
                  <img src={novel.cover_url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors text-sm truncate leading-tight">
                    {novel.title}
                  </h4>
                  <p className="text-xs text-white/50 mt-1 truncate">{novel.synopsis}</p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-white/30 font-mono">
                    <span>Oleh {novel.author}</span>
                    <span>•</span>
                    <span className="text-emerald-400">{novel.genre[0]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* 6. Genre Quick Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold tracking-tight text-white/80">Kategori Genre</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {genres.map((g) => (
            <button
              id={`btn-genre-${g}`}
              key={g}
              onClick={() => onNavigate(`genre-${g.toLowerCase()}`)}
              className="px-4 py-3 rounded-xl bg-white/5 hover:bg-indigo-600/10 border border-white/5 hover:border-indigo-500/20 text-center text-xs font-semibold tracking-wide text-white/50 hover:text-indigo-300 transition-all cursor-pointer shadow-sm"
            >
              {g}
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}
