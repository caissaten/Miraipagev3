import { useState, useEffect, useRef } from 'react';
import { Novel, Chapter } from '../../types';
import ReaderSettings, { ReaderConfig } from '../ReaderSettings';
import { ArrowLeft, ArrowRight, Settings2, BookOpen, Clock, List, Home, MessageSquare } from 'lucide-react';

interface ReadingViewProps {
  novel: Novel;
  chapter: Chapter;
  allChapters: Chapter[];
  onChapterClick: (novelSlug: string, chapterSlug: string) => void;
  onNavigate: (view: string) => void;
  config: ReaderConfig;
  onConfigChange: (newConfig: ReaderConfig) => void;
}

export default function ReadingView({
  novel,
  chapter,
  allChapters,
  onChapterClick,
  onNavigate,
  config,
  onConfigChange
}: ReadingViewProps) {
  const [showSettings, setShowSettings] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // Filter only published chapters and sort them
  const publishedChapters = allChapters
    .filter(c => c.novel_id === novel.id && c.status === 'Published')
    .sort((a, b) => a.chapter_number - b.chapter_number);

  const currentIndex = publishedChapters.findIndex(c => c.id === chapter.id);
  const prevChapter = currentIndex > 0 ? publishedChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < publishedChapters.length - 1 ? publishedChapters[currentIndex + 1] : null;

  // Calculate words count and estimated reading time
  const cleanText = chapter.content.replace(/<[^>]*>/g, '');
  const wordsCount = cleanText.trim() === '' ? 0 : cleanText.trim().split(/\s+/).length;
  const estimatedMinutes = Math.max(1, Math.ceil(wordsCount / 220)); // Avg 220 words per min

  // Increment chapter views
  useEffect(() => {
    fetch(`/api/chapters/${chapter.id}/increment-view`, { method: 'POST' })
      .catch(err => console.error("Failed to increment chapter view", err));
  }, [chapter.id]);

  // Keyboard Navigation: ← and →
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && prevChapter) {
        onChapterClick(novel.slug, prevChapter.slug);
      } else if (e.key === 'ArrowRight' && nextChapter) {
        onChapterClick(novel.slug, nextChapter.slug);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevChapter, nextChapter, novel.slug, onChapterClick]);

  // Scroll to top on chapter load
  useEffect(() => {
    scrollToTop();
  }, [chapter.id]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Map theme variables to CSS styles
  const themeStyles = {
    dark: {
      bg: 'bg-[#0F1420]',
      card: 'bg-[#151B2C]',
      text: 'text-slate-200',
      border: 'border-slate-800/80',
      accent: 'text-violet-400'
    },
    black: {
      bg: 'bg-black',
      card: 'bg-zinc-950',
      text: 'text-[#C8C8C8]',
      border: 'border-zinc-900',
      accent: 'text-violet-500'
    },
    sepia: {
      bg: 'bg-[#F4ECD8]',
      card: 'bg-[#FAF5E6]',
      text: 'text-[#44301B]',
      border: 'border-[#E4DCC8]',
      accent: 'text-[#8B5E3C]'
    },
    light: {
      bg: 'bg-slate-50',
      card: 'bg-white',
      text: 'text-slate-900',
      border: 'border-slate-200',
      accent: 'text-violet-600'
    }
  };

  const currentTheme = themeStyles[config.theme] || themeStyles.dark;

  const fontFamilies = {
    serif: "font-['Lora',_serif]",
    sans: "font-['Space_Grotesk',_sans-serif]",
    mono: "font-mono text-sm"
  };

  const contentWidths = {
    narrow: 'max-w-xl',
    normal: 'max-w-3xl',
    wide: 'max-w-5xl'
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${currentTheme.bg} pb-20`}>
      <div ref={topRef} />

      {/* 1. Sticky Navigation Bar for reader comfort */}
      <nav className={`sticky top-0 z-30 w-full border-b backdrop-blur-md h-14 flex items-center justify-between px-4 sm:px-6 shadow-sm transition-all duration-300 ${currentTheme.card} ${currentTheme.border}`}>
        <div className="flex items-center gap-3">
          <button
            id="btn-reader-back-novel"
            onClick={() => onNavigate(`novel-${novel.slug}`)}
            className="p-1.5 rounded-lg hover:bg-black/5 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali</span>
          </button>
          
          <span className="text-xs text-slate-500 hidden sm:inline">|</span>

          <h2 className="font-['Cinzel'] text-xs sm:text-sm font-bold truncate max-w-[140px] sm:max-w-[240px] text-slate-300">
            {novel.title}
          </h2>
        </div>

        {/* Middle: Dropdown Jump */}
        <div className="flex items-center gap-2">
          <select
            id="select-reader-chapter-jump"
            value={chapter.slug}
            onChange={(e) => onChapterClick(novel.slug, e.target.value)}
            className="bg-[#080B11] border border-slate-900 text-xs text-slate-300 rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer max-w-[120px] sm:max-w-[200px]"
          >
            {publishedChapters.map((ch) => (
              <option key={ch.id} value={ch.slug}>
                Bab {ch.chapter_number}: {ch.title}
              </option>
            ))}
          </select>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1.5">
          <button
            id="btn-reader-home"
            onClick={() => onNavigate('home')}
            className="p-2 rounded-lg hover:bg-black/5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Kembali ke Beranda"
          >
            <Home className="w-4 h-4" />
          </button>
          
          <button
            id="btn-reader-toggle-settings"
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg hover:bg-black/5 transition-all cursor-pointer ${
              showSettings ? 'text-violet-500' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Buka Pengaturan Baca"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Floating Settings Widget Panel */}
      {showSettings && (
        <div className="fixed top-16 right-4 sm:right-6 z-40 w-[280px] max-w-full shadow-2xl animate-fadeIn">
          <ReaderSettings 
            config={config} 
            onChange={onConfigChange} 
            onScrollToTop={scrollToTop} 
          />
        </div>
      )}

      {/* 2. Main Text Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className={`${contentWidths[config.contentWidth]} mx-auto space-y-8`}>
          
          {/* Header Title Section inside reader frame */}
          <div className="text-center space-y-3 pb-8 border-b border-dashed border-slate-900/40">
            <span className={`text-xs font-bold tracking-widest uppercase font-mono ${currentTheme.accent}`}>
              Bab {chapter.chapter_number}
            </span>
            <h1 className={`font-['Cinzel'] text-xl sm:text-2xl md:text-3xl font-bold leading-tight ${currentTheme.text}`}>
              {chapter.title}
            </h1>
            
            <div className="flex items-center justify-center gap-4 text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Est. {estimatedMinutes} mnt baca</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{wordsCount} kata</span>
              </span>
            </div>
          </div>

          {/* Actual Novel Content Paragraphs */}
          <article 
            id="reading-text-body"
            className={`reading-content leading-relaxed selection:bg-violet-500/30 selection:text-white transition-all duration-300 ${fontFamilies[config.fontFamily]} ${currentTheme.text}`}
            style={{ 
              fontSize: `${config.fontSize}px`,
              lineHeight: config.lineHeight
            }}
            dangerouslySetInnerHTML={{ __html: chapter.content }}
          />

          {/* Bottom Pagination controls */}
          <div className="pt-12 border-t border-slate-900/60 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Prev */}
            <button
              id="btn-reader-prev"
              onClick={() => prevChapter && onChapterClick(novel.slug, prevChapter.slug)}
              disabled={!prevChapter}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border font-semibold text-xs w-full sm:w-auto transition-all cursor-pointer ${
                prevChapter 
                  ? `${currentTheme.card} ${currentTheme.border} ${currentTheme.text} hover:scale-101`
                  : 'opacity-30 cursor-not-allowed border-slate-900/20 text-slate-600'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Bab Sebelumnya</span>
            </button>

            {/* Middle chapter index button */}
            <button
              id="btn-reader-index"
              onClick={() => onNavigate(`novel-${novel.slug}`)}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border font-semibold text-xs w-full sm:w-auto transition-all cursor-pointer ${currentTheme.card} ${currentTheme.border} ${currentTheme.text}`}
            >
              <List className="w-4 h-4 text-violet-500" />
              <span>Daftar Bab Cerita</span>
            </button>

            {/* Next */}
            <button
              id="btn-reader-next"
              onClick={() => nextChapter && onChapterClick(novel.slug, nextChapter.slug)}
              disabled={!nextChapter}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border font-semibold text-xs w-full sm:w-auto transition-all cursor-pointer ${
                nextChapter 
                  ? 'bg-violet-600 border-violet-500 text-white hover:bg-violet-500 shadow-lg shadow-violet-600/20 hover:scale-101'
                  : 'opacity-30 cursor-not-allowed border-slate-900/20 text-slate-600'
              }`}
            >
              <span>Bab Berikutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </main>

    </div>
  );
}
