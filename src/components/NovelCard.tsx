import React from 'react';
import { Eye, Star, Sparkles } from 'lucide-react';
import { Novel } from '../types';

interface NovelCardProps {
  novel: Novel;
  onClick: (slug: string) => void;
  isFavorite?: boolean;
}

const NovelCard: React.FC<NovelCardProps> = ({ novel, onClick, isFavorite = false }) => {
  return (
    <div 
      onClick={() => onClick(novel.slug)}
      className="group relative flex flex-col rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/20 transition-all duration-300 overflow-hidden cursor-pointer shadow-md hover:shadow-indigo-950/20 hover:translate-y-[-2px] select-none"
    >
      {/* Favorite Indicator Badge */}
      {isFavorite && (
        <div className="absolute top-3 left-3 z-10 bg-indigo-600/90 text-white p-1.5 rounded-lg backdrop-blur-md border border-indigo-400/20 shadow-md">
          <Star className="w-3.5 h-3.5 fill-current text-white" />
        </div>
      )}

      {/* Featured Badge */}
      {novel.featured && (
        <div className="absolute top-3 right-3 z-10 bg-purple-600/90 text-white text-[9px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md border border-purple-400/20 flex items-center gap-1 shadow-md uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-purple-200" />
          <span>FEATURED</span>
        </div>
      )}

      {/* Novel Cover with smooth zooming and gradient overlay */}
      <div className="aspect-[3/4] w-full bg-[#050507] relative overflow-hidden">
        <img 
          src={novel.cover_url} 
          alt={novel.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-black/10 opacity-70" />
        
        {/* Genre Tags inside Cover */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
          {novel.genre.slice(0, 2).map((g) => (
            <span 
              key={g} 
              className="text-[9px] font-semibold tracking-wider uppercase text-indigo-300 bg-indigo-950/70 border border-indigo-500/15 px-2 py-0.5 rounded-md backdrop-blur-sm"
            >
              {g}
            </span>
          ))}
        </div>
      </div>

      {/* Novel Meta Details */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-gradient-to-b from-transparent to-[#050507]/45">
        <div>
          <span className="text-[10px] text-white/40 font-semibold tracking-wide block mb-1">
            {novel.author}
          </span>
          <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1 leading-tight text-sm sm:text-base">
            {novel.title}
          </h3>
          <p className="text-xs text-white/50 line-clamp-2 mt-1.5 leading-relaxed font-sans">
            {novel.synopsis}
          </p>
        </div>

        {/* Bottom Metrics */}
        <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4 text-[10px] text-white/40 font-mono">
          <span className={`px-2 py-0.5 rounded-full font-sans text-[9px] font-bold tracking-wide ${
            novel.status === 'Ongoing' 
              ? 'text-indigo-400 bg-indigo-950/30 border border-indigo-500/15' 
              : 'text-emerald-400 bg-emerald-950/30 border border-emerald-500/15'
          }`}>
            {novel.status}
          </span>
          
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-white/20" />
              <span>{novel.views >= 1000 ? `${(novel.views / 1000).toFixed(1)}k` : novel.views}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovelCard;
