import { useState, useEffect } from 'react';
import { Novel, Chapter } from '../../types';
import NovelCard from '../NovelCard';
import { Search, SlidersHorizontal, BookOpen, AlertCircle, RefreshCcw } from 'lucide-react';

interface SearchViewProps {
  novels: Novel[];
  chapters: Chapter[];
  onNovelClick: (slug: string) => void;
  favorites: string[];
}

type SortOption = 'latest' | 'popular' | 'a-z' | 'chapter-count';

export default function SearchView({ novels, chapters, onNovelClick, favorites }: SearchViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [showFilters, setShowFilters] = useState(false);

  // Debouncing Search Term (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const allGenres = ['All', ...Array.from(new Set(novels.flatMap(n => n.genre)))];
  const statuses = ['All', 'Ongoing', 'Completed'];

  // Helper to get chapter count for each novel
  const getChapterCount = (novelId: string) => {
    return chapters.filter(c => c.novel_id === novelId && c.status === 'Published').length;
  };

  // Filter novels
  const filteredNovels = novels.filter((novel) => {
    const term = debouncedSearch.toLowerCase();
    
    // 1. Text Search matching multi-criteria: Title, Author, Tags, Synopsis
    const matchesText = 
      novel.title.toLowerCase().includes(term) ||
      novel.author.toLowerCase().includes(term) ||
      novel.synopsis.toLowerCase().includes(term) ||
      novel.tags.some(tag => tag.toLowerCase().includes(term));

    // 2. Genre Match
    const matchesGenre = selectedGenre === 'All' || novel.genre.includes(selectedGenre);

    // 3. Status Match
    const matchesStatus = selectedStatus === 'All' || novel.status === selectedStatus;

    return matchesText && matchesGenre && matchesStatus;
  });

  // Sort novels
  const sortedNovels = [...filteredNovels].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortBy === 'popular') {
      return b.views - a.views;
    }
    if (sortBy === 'a-z') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'chapter-count') {
      return getChapterCount(b.id) - getChapterCount(a.id);
    }
    return 0;
  });

  // Clean all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedGenre('All');
    setSelectedStatus('All');
    setSortBy('latest');
  };

  // Helper to highlight matched query text in strings safely
  const renderHighlightedText = (text: string, query: string) => {
    if (!query) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, index) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <mark key={index} className="bg-yellow-500/30 text-yellow-200 px-0.5 rounded-sm">{part}</mark>
            : part
        )}
      </span>
    );
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title & Stats */}
      <div className="border-b border-slate-900 pb-4">
        <h1 className="font-['Cinzel'] text-2xl sm:text-3xl font-bold tracking-wider text-slate-100">Pencarian Novel</h1>
        <p className="text-slate-500 text-sm mt-1">
          Dapatkan akses instan ke seluruh khazanah cerita. Menampilkan {sortedNovels.length} dari {novels.length} novel.
        </p>
      </div>

      {/* Main Search Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Text Input Box */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              id="search-input-box"
              type="text"
              placeholder="Cari berdasarkan judul, penulis, tag, atau sinopsis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-[#0B0F19]/60 hover:bg-[#0B0F19]/80 focus:bg-[#0B0F19] border border-slate-900 focus:border-violet-600 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all font-sans"
            />
          </div>

          {/* Toggle Advanced Filters Button */}
          <button
            id="btn-toggle-filters"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-5 py-3.5 rounded-2xl border flex items-center justify-center gap-2 font-semibold text-sm cursor-pointer transition-all ${
              showFilters || selectedGenre !== 'All' || selectedStatus !== 'All'
                ? 'bg-violet-600/15 border-violet-500/30 text-violet-400'
                : 'bg-[#0B0F19]/60 border-slate-900 text-slate-400 hover:text-white hover:bg-[#0B0F19]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter Lanjutan</span>
          </button>
        </div>

        {/* Expandable Advanced Filters Drawer */}
        {showFilters && (
          <div className="glass rounded-2xl border border-slate-900/60 p-5 grid grid-cols-1 sm:grid-cols-3 gap-5 animate-slideDown">
            {/* Genre Filter */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono block">Genre</label>
              <select
                id="select-filter-genre"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full bg-[#060911] border border-slate-900 focus:border-violet-600 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                {allGenres.map(g => (
                  <option key={g} value={g}>{g === 'All' ? 'Semua Genre' : g}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono block">Status Publikasi</label>
              <select
                id="select-filter-status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-[#060911] border border-slate-900 focus:border-violet-600 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                {statuses.map(s => (
                  <option key={s} value={s}>{s === 'All' ? 'Semua Status' : s}</option>
                ))}
              </select>
            </div>

            {/* Sorting Criteria */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono block">Urutan Berdasarkan</label>
              <select
                id="select-filter-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full bg-[#060911] border border-slate-900 focus:border-violet-600 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                <option value="latest">Terbaru Diunggah</option>
                <option value="popular">Tingkat Populer (Views)</option>
                <option value="a-z">Nama Abjad (A-Z)</option>
                <option value="chapter-count">Jumlah Bab Terbanyak</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Listing Area */}
      {sortedNovels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedNovels.map((novel) => (
            <div key={novel.id} className="relative group">
              <NovelCard 
                novel={novel} 
                onClick={onNovelClick} 
                isFavorite={favorites.includes(novel.id)}
              />
              {/* Highlight helper beneath the card during search term match */}
              {debouncedSearch && novel.title.toLowerCase().includes(debouncedSearch.toLowerCase()) && (
                <div className="absolute bottom-20 left-4 z-10 pointer-events-none text-xs font-semibold px-2 py-0.5 bg-yellow-500 text-slate-950 rounded shadow-lg animate-pulse">
                  Judul Cocok!
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Highly elegant empty search state */
        <div className="flex flex-col items-center justify-center py-20 bg-[#0B0F19]/10 rounded-3xl border border-dashed border-slate-900 text-center p-6">
          <AlertCircle className="w-12 h-12 text-slate-600 mb-4 animate-bounce" />
          <h3 className="font-['Cinzel'] text-lg font-bold text-slate-300">Novel Tidak Ditemukan</h3>
          <p className="text-sm text-slate-500 max-w-sm mt-2 leading-relaxed">
            Maaf, kami tidak dapat menemukan novel yang cocok dengan kriteria "{searchTerm || debouncedSearch || selectedGenre}". Silakan coba kata kunci lain.
          </p>
          <button
            id="btn-reset-filters-empty"
            onClick={resetFilters}
            className="mt-6 flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-slate-400 hover:text-white border border-slate-800 transition-all cursor-pointer"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Reset Pencarian</span>
          </button>
        </div>
      )}

    </div>
  );
}
