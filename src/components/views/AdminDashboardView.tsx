import { useState, useEffect } from 'react';
import { Novel, Chapter, Stats } from '../../types';
import { LayoutDashboard, BookOpen, FileText, Eye, Plus, ArrowRight, Edit, Trash2, Settings, Sparkles } from 'lucide-react';

interface AdminDashboardViewProps {
  onNavigate: (view: string) => void;
  onSelectNovelEdit: (novel: Novel) => void;
  onSelectChapterEdit: (chapter: Chapter) => void;
  onDeleteNovel: (id: string) => Promise<void>;
  onDeleteChapter: (id: string) => Promise<void>;
  novels: Novel[];
  chapters: Chapter[];
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function AdminDashboardView({
  onNavigate,
  onSelectNovelEdit,
  onSelectChapterEdit,
  onDeleteNovel,
  onDeleteChapter,
  novels,
  chapters,
  showToast
}: AdminDashboardViewProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('mirai_admin_token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to load dashboard statistics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [novels, chapters]);

  const handleDeleteNovelClick = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus novel "${name}" beserta seluruh bab di dalamnya? Tindakan ini tidak dapat dibatalkan.`)) {
      try {
        await onDeleteNovel(id);
        showToast('Novel berhasil dihapus.', 'success');
        fetchStats();
      } catch (err) {
        showToast('Gagal menghapus novel.', 'error');
      }
    }
  };

  const handleDeleteChapterClick = async (id: string, number: number) => {
    if (confirm(`Apakah Anda yakin ingin menghapus Bab ${number}?`)) {
      try {
        await onDeleteChapter(id);
        showToast('Bab berhasil dihapus.', 'success');
        fetchStats();
      } catch (err) {
        showToast('Gagal menghapus bab.', 'error');
      }
    }
  };

  const cards = [
    { 
      title: 'Total Novel', 
      value: stats?.totalNovels ?? novels.length, 
      icon: <BookOpen className="w-5 h-5 text-violet-400" />,
      color: 'border-violet-500/10 hover:border-violet-500/25'
    },
    { 
      title: 'Total Bab Terbit', 
      value: stats?.totalChapters ?? chapters.length, 
      icon: <FileText className="w-5 h-5 text-cyan-400" />,
      color: 'border-cyan-500/10 hover:border-cyan-500/25'
    },
    { 
      title: 'Akumulasi Kunjungan', 
      value: stats?.totalViews ?? novels.reduce((acc, curr) => acc + curr.views, 0), 
      icon: <Eye className="w-5 h-5 text-fuchsia-400" />,
      color: 'border-fuchsia-500/10 hover:border-fuchsia-500/25'
    }
  ];

  return (
    <div className="space-y-10 pb-16 animate-fadeIn">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
        <div>
          <h1 className="font-['Cinzel'] text-2xl sm:text-3xl font-bold tracking-wider text-slate-100 flex items-center gap-2.5">
            <LayoutDashboard className="w-6 h-6 text-violet-400" />
            <span>Panel Utama Admin</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Selamat datang kembali! Kelola perpustakaan novel fantasi orisinal Anda.</p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            id="btn-dash-new-novel"
            onClick={() => onNavigate('admin-novel-manager')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-violet-600/10"
          >
            <Plus className="w-4 h-4" />
            <span>Novel Baru</span>
          </button>
          <button
            id="btn-dash-new-chapter"
            onClick={() => onNavigate('admin-chapter-manager')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-800 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Tambah Bab Baru</span>
          </button>
        </div>
      </div>

      {/* 2. Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((c, idx) => (
          <div 
            key={idx}
            className={`glass-premium p-6 rounded-2xl border flex items-center justify-between shadow-md transition-all duration-300 ${c.color}`}
          >
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider font-mono">{c.title}</span>
              <p className="text-2xl sm:text-3xl font-black text-white font-mono">{loading ? '...' : c.value}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-950/60 border border-slate-900 flex items-center justify-center">
              {c.icon}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Novels & Chapters Management Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Novels Table */}
        <div className="glass rounded-2xl border border-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <h3 className="font-['Cinzel'] text-md font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-violet-400" />
              <span>Daftar Novel ({novels.length})</span>
            </h3>
          </div>

          <div className="divide-y divide-slate-900/60 max-h-[360px] overflow-y-auto pr-1">
            {novels.map((novel) => (
              <div 
                id={`dash-novel-item-${novel.id}`}
                key={novel.id}
                className="flex items-center justify-between py-3.5 hover:bg-white/3 px-3 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={novel.cover_url} alt="" className="w-9 h-12 rounded-lg object-cover bg-slate-950 border border-slate-900 flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-200 truncate group-hover:text-violet-400 duration-200">{novel.title}</h4>
                    <span className="text-[10px] text-slate-500 font-mono block mt-1">Status: {novel.status} | {novel.views} Views</span>
                  </div>
                </div>

                {/* Edit Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    id={`btn-edit-novel-${novel.id}`}
                    onClick={() => onSelectNovelEdit(novel)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/15 transition-all cursor-pointer"
                    title="Edit Novel"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    id={`btn-del-novel-${novel.id}`}
                    onClick={() => handleDeleteNovelClick(novel.id, novel.title)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 transition-all cursor-pointer"
                    title="Hapus Novel"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Latest Chapters Table */}
        <div className="glass rounded-2xl border border-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <h3 className="font-['Cinzel'] text-md font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Daftar Bab ({chapters.length})</span>
            </h3>
          </div>

          <div className="divide-y divide-slate-900/60 max-h-[360px] overflow-y-auto pr-1">
            {chapters.map((ch) => {
              const associatedNovel = novels.find(n => n.id === ch.novel_id);
              return (
                <div 
                  id={`dash-chapter-item-${ch.id}`}
                  key={ch.id}
                  className="flex items-center justify-between py-3.5 hover:bg-white/3 px-3 rounded-xl transition-all group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-bold text-violet-400 truncate max-w-[120px] block font-mono">
                        {associatedNovel?.title || 'Novel Terhapus'}
                      </span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                        ch.status === 'Published' 
                          ? 'text-emerald-400 bg-emerald-950/20 border border-emerald-500/10' 
                          : 'text-amber-400 bg-amber-950/20 border border-amber-500/10'
                      }`}>
                        {ch.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-cyan-400 duration-200">
                      Bab {ch.chapter_number}: {ch.title}
                    </h4>
                  </div>

                  {/* Edit Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
                    <button
                      id={`btn-edit-chapter-${ch.id}`}
                      onClick={() => onSelectChapterEdit(ch)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/15 transition-all cursor-pointer"
                      title="Edit Bab"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      id={`btn-del-chapter-${ch.id}`}
                      onClick={() => handleDeleteChapterClick(ch.id, ch.chapter_number)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 transition-all cursor-pointer"
                      title="Hapus Bab"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
