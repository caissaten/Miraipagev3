import { useState, useEffect } from 'react';
import { Novel, Chapter } from '../../types';
import NovelCard from '../NovelCard';
import { BookOpen, Eye, Calendar, User, Star, ArrowRight, Sparkles, Check, Bookmark, List, Share2 } from 'lucide-react';

interface NovelDetailViewProps {
  novel: Novel;
  chapters: Chapter[];
  onChapterClick: (novelSlug: string, chapterSlug: string) => void;
  onNavigate: (view: string) => void;
  allNovels: Novel[];
  favorites: string[];
  onToggleFavorite: (novelId: string) => void;
  readingHistory: { [novelSlug: string]: string }; // novelSlug -> chapterSlug
}

export default function NovelDetailView({ 
  novel, 
  chapters, 
  onChapterClick, 
  onNavigate, 
  allNovels,
  favorites,
  onToggleFavorite,
  readingHistory
}: NovelDetailViewProps) {
  const [copied, setCopied] = useState(false);

  // Filter only published chapters for readers
  const publishedChapters = chapters
    .filter(c => c.novel_id === novel.id && c.status === 'Published')
    .sort((a, b) => a.chapter_number - b.chapter_number);

  const isFavorite = favorites.includes(novel.id);
  const continueChapterSlug = readingHistory[novel.slug];

  // Increment views on mount
  useEffect(() => {
    fetch(`/api/novels/${novel.id}/increment-view`, { method: 'POST' })
      .catch(err => console.error("Failed to increment novel view", err));
  }, [novel.id]);

  // Find continue reading chapter object
  const continueChapter = continueChapterSlug 
    ? publishedChapters.find(c => c.slug === continueChapterSlug)
    : null;

  // Filter related novels sharing at least 1 genre (excluding current novel)
  const relatedNovels = allNovels
    .filter(n => n.id !== novel.id && n.genre.some(g => novel.genre.includes(g)))
    .slice(0, 3);

  const handleShare = () => {
    // Elegant copy-link fallback
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. Top Immersive Header Banner */}
      <section className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-end border border-slate-900/60 shadow-2xl">
        {/* Background Blur */}
        <div className="absolute inset-0 z-0">
          <img 
            src={novel.cover_url} 
            alt=""
            className="w-full h-full object-cover scale-105 filter blur-3xl opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080B11] via-[#080B11]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080B11] to-transparent" />
        </div>

        {/* Info Grid Content */}
        <div className="relative z-10 p-6 sm:p-10 grid grid-cols-1 md:grid-cols-4 gap-8 items-center w-full">
          {/* Left Large Cover Artwork */}
          <div className="col-span-1 mx-auto w-full max-w-[220px] aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/5 shadow-2xl relative">
            <img 
              src={novel.cover_url} 
              alt={novel.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Novel Main Meta */}
          <div className="col-span-1 md:col-span-3 space-y-5 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                novel.status === 'Ongoing' 
                  ? 'text-cyan-400 bg-cyan-950/30 border border-cyan-500/10' 
                  : 'text-emerald-400 bg-emerald-950/30 border border-emerald-500/10'
              }`}>
                {novel.status}
              </span>
              
              {novel.genre.map((g) => (
                <span 
                  key={g} 
                  className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900/60 border border-slate-800 text-slate-300"
                >
                  {g}
                </span>
              ))}
            </div>

            <h1 className="font-['Cinzel'] text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
              {novel.title}
            </h1>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-violet-400" />
                <span className="font-sans font-semibold text-slate-200">{novel.author}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-slate-500" />
                <span>{novel.views} Pembaca</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>Update: {new Date(novel.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </span>
            </div>

            {/* Main CTA buttons */}
            <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-3">
              {publishedChapters.length > 0 ? (
                <>
                  <button
                    id="btn-detail-start"
                    onClick={() => onChapterClick(novel.slug, publishedChapters[0].slug)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold text-sm shadow-xl shadow-violet-600/20 hover:shadow-violet-600/30 transition-all cursor-pointer transform hover:translate-y-[-1px] flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Mulai Membaca</span>
                  </button>

                  {continueChapter && (
                    <button
                      id="btn-detail-continue"
                      onClick={() => onChapterClick(novel.slug, continueChapter.slug)}
                      className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-800 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <ArrowRight className="w-4 h-4 text-cyan-400" />
                      <span>Lanjut: Bab {continueChapter.chapter_number}</span>
                    </button>
                  )}
                </>
              ) : (
                <div className="text-sm font-semibold text-slate-500 bg-[#060911] border border-slate-900 px-4 py-3 rounded-xl">
                  Segera Rilis: Belum ada bab yang dipublikasikan.
                </div>
              )}

              {/* Bookmark Button */}
              <button
                id="btn-detail-favorite"
                onClick={() => onToggleFavorite(novel.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isFavorite 
                    ? 'bg-violet-600/25 border-violet-500 text-violet-400' 
                    : 'bg-[#0B0F19]/60 border-slate-900 text-slate-400 hover:text-white'
                }`}
                title={isFavorite ? "Hapus dari Favorit" : "Tambah ke Favorit"}
              >
                <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                <span className="text-xs font-semibold">{isFavorite ? 'Tersimpan' : 'Bookmark'}</span>
              </button>

              {/* Copy URL share */}
              <button
                id="btn-detail-share"
                onClick={handleShare}
                className="p-3 rounded-xl border border-slate-900 bg-[#0B0F19]/60 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                title="Bagikan Novel"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span className="text-xs font-semibold">{copied ? 'Tersalin' : 'Bagikan'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Synopsis & Chapters split */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Synopsis & Content Info */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Synopsis */}
          <div className="glass rounded-2xl border border-slate-900/60 p-6 space-y-4">
            <h3 className="font-['Cinzel'] text-lg font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>Sinopsis Cerita</span>
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-sans">
              {novel.synopsis}
            </p>

            {/* Tags Box */}
            {novel.tags && novel.tags.length > 0 && (
              <div className="pt-4 border-t border-slate-900/60">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono mb-2">Tag Cerita</h4>
                <div className="flex flex-wrap gap-1.5">
                  {novel.tags.map(t => (
                    <span 
                      key={t}
                      className="text-[10px] font-semibold text-violet-400 bg-violet-950/15 border border-violet-900 px-2 py-0.5 rounded"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Published Chapters Listing */}
          <div className="glass rounded-2xl border border-slate-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <h3 className="font-['Cinzel'] text-lg font-bold text-slate-100 flex items-center gap-2">
                <List className="w-4 h-4 text-cyan-400" />
                <span>Daftar Bab Terbit</span>
              </h3>
              <span className="text-xs font-mono text-slate-500">{publishedChapters.length} Bab</span>
            </div>

            {publishedChapters.length > 0 ? (
              <div className="divide-y divide-slate-900/60 max-h-[480px] overflow-y-auto pr-2">
                {publishedChapters.map((ch) => (
                  <div 
                    id={`ch-list-item-${ch.id}`}
                    key={ch.id}
                    onClick={() => onChapterClick(novel.slug, ch.slug)}
                    className="flex items-center justify-between py-3 hover:bg-white/3 px-3 rounded-xl cursor-pointer group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-900 flex items-center justify-center font-mono text-xs font-bold text-slate-500 group-hover:text-violet-400 group-hover:border-violet-500/20 transition-all">
                        {ch.chapter_number}
                      </div>
                      <span className="text-sm text-slate-300 group-hover:text-slate-100 font-medium transition-colors">
                        {ch.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                      <span>{new Date(ch.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                      <ArrowRight className="w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-500 py-6 text-center">Belum ada bab yang dirilis untuk umum.</div>
            )}
          </div>

        </div>

        {/* Right Column: Related Recommendations */}
        <div className="space-y-6">
          <div className="border-b border-slate-900 pb-3">
            <h3 className="font-['Cinzel'] text-md font-bold text-slate-300">Rekomendasi Terkait</h3>
          </div>
          <div className="space-y-5">
            {relatedNovels.length > 0 ? (
              relatedNovels.map((rel) => (
                <NovelCard 
                  key={rel.id} 
                  novel={rel} 
                  onClick={(slug) => onNavigate(`novel-${slug}`)} 
                  isFavorite={favorites.includes(rel.id)} 
                />
              ))
            ) : (
              <div className="text-xs text-slate-500 font-mono py-4">Belum ada rekomendasi terkait dengan genre yang sama.</div>
            )}
          </div>
        </div>

      </section>

    </div>
  );
}
