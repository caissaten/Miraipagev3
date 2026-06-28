import React, { useState, useEffect } from 'react';
import { Novel } from '../../types';
import NovelCard from '../NovelCard';
import { HelpCircle } from 'lucide-react';

interface GenreViewProps {
  novels: Novel[];
  selectedGenreSlug: string; // e.g. "fantasy", "all"
  onNovelClick: (slug: string) => void;
  favorites: string[];
}

export default function GenreView({ novels, selectedGenreSlug, onNovelClick, favorites }: GenreViewProps) {
  const genresList = [
    { id: 'all', label: 'Semua Genre' },
    { id: 'fantasy', label: 'Fantasy' },
    { id: 'action', label: 'Action' },
    { id: 'adventure', label: 'Adventure' },
    { id: 'comedy', label: 'Comedy' },
    { id: 'drama', label: 'Drama' },
    { id: 'mystery', label: 'Mystery' },
    { id: 'romance', label: 'Romance' },
    { id: 'sci-fi', label: 'Sci-Fi' },
    { id: 'slice of life', label: 'Slice of Life' },
    { id: 'horror', label: 'Horror' },
    { id: 'historical', label: 'Historical' },
    { id: 'martial arts', label: 'Martial Arts' },
    { id: 'supernatural', label: 'Supernatural' },
    { id: 'school', label: 'School' },
    { id: 'psychological', label: 'Psychological' },
    { id: 'crime', label: 'Crime' },
    { id: 'magic', label: 'Magic' },
    { id: 'kingdom', label: 'Kingdom' }
  ];

  const [activeGenreId, setActiveGenreId] = useState('all');

  useEffect(() => {
    if (selectedGenreSlug) {
      const found = genresList.find(g => g.id === selectedGenreSlug.toLowerCase());
      if (found) {
        setActiveGenreId(found.id);
      }
    }
  }, [selectedGenreSlug]);

  // Filter novels
  const filteredNovels = novels.filter((novel) => {
    if (activeGenreId === 'all') return true;
    const label = genresList.find(g => g.id === activeGenreId)?.label || '';
    return novel.genre.some(g => g.toLowerCase() === label.toLowerCase());
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Genre Title Banner */}
      <div className="border-b border-slate-900 pb-4">
        <h1 className="font-['Cinzel'] text-2xl sm:text-3xl font-bold tracking-wider text-slate-100">Katalog Genre</h1>
        <p className="text-slate-500 text-sm mt-1">
          Saring cerita berdasarkan esensi legenda dan takdir yang paling Anda minati.
        </p>
      </div>

      {/* Genre Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {genresList.map((g) => (
          <button
            id={`tab-genre-${g.id}`}
            key={g.id}
            onClick={() => setActiveGenreId(g.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${
              activeGenreId === g.id
                ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-600/10'
                : 'bg-[#0B0F19]/60 border-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Grid listing */}
      {filteredNovels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredNovels.map((novel) => (
            <NovelCard 
              key={novel.id} 
              novel={novel} 
              onClick={onNovelClick} 
              isFavorite={favorites.includes(novel.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-[#0B0F19]/10 rounded-3xl border border-dashed border-slate-900 text-center p-6">
          <HelpCircle className="w-12 h-12 text-slate-600 mb-3" />
          <h3 className="font-['Cinzel'] text-lg font-bold text-slate-300">Belum Ada Novel</h3>
          <p className="text-sm text-slate-500 max-w-sm mt-1.5 leading-relaxed">
            Maaf, saat ini belum ada karya novel orisinal yang dipublikasikan dalam genre "{genresList.find(g => g.id === activeGenreId)?.label}". Admin akan mengupload novel baru segera!
          </p>
        </div>
      )}

    </div>
  );
}
