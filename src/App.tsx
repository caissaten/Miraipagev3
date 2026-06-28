import { useState, useEffect } from 'react';
import { Novel, Chapter } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import Toast, { ToastType } from './components/Toast';
import HomeView from './components/views/HomeView';
import SearchView from './components/views/SearchView';
import GenreView from './components/views/GenreView';
import NovelDetailView from './components/views/NovelDetailView';
import ReadingView from './components/views/ReadingView';
import StaticView from './components/views/StaticViews';
import AdminLoginView from './components/views/AdminLoginView';
import AdminDashboardView from './components/views/AdminDashboardView';
import AdminNovelManagerView from './components/views/AdminNovelManagerView';
import AdminChapterManagerView from './components/views/AdminChapterManagerView';
import { ReaderConfig } from './components/ReaderSettings';
import { Skeleton, NovelDetailSkeleton } from './components/Skeleton';
import { AlertCircle } from 'lucide-react';

export default function App() {
  // --- CORE STATE ---
  const [novels, setNovels] = useState<Novel[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- NAVIGATION STATE ---
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedNovelSlug, setSelectedNovelSlug] = useState<string>('');
  const [selectedChapterSlug, setSelectedChapterSlug] = useState<string>('');
  const [selectedGenreSlug, setSelectedGenreSlug] = useState<string>('');

  // --- ADMIN STATE ---
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [editingNovel, setEditingNovel] = useState<Novel | null>(null);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);

  // --- LOCAL PERSISTENCE STATES (LocalStorage) ---
  const [favorites, setFavorites] = useState<string[]>([]);
  const [readingHistory, setReadingHistory] = useState<{ [novelSlug: string]: string }>({});
  const [readerConfig, setReaderConfig] = useState<ReaderConfig>({
    fontSize: 18,
    lineHeight: 1.8,
    contentWidth: 'normal',
    theme: 'dark',
    fontFamily: 'serif'
  });

  // --- TOAST STATE ---
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  // --- API DATA FETCHING ---
  const fetchData = async () => {
    try {
      const novelsRes = await fetch('/api/novels');
      if (!novelsRes.ok) throw new Error('Failed to load novels');
      const novelsData = await novelsRes.ok ? await novelsRes.json() : [];

      // Fetch all chapters (published or draft if admin)
      const chaptersRes = await fetch('/api/novels/all/chapters').catch(() => null);
      let chaptersData: Chapter[] = [];
      if (chaptersRes && chaptersRes.ok) {
        chaptersData = await chaptersRes.json();
      } else {
        // Fallback or fetch for each novel
        const promises = novelsData.map((n: Novel) => fetch(`/api/novels/${n.id}/chapters`).then(r => r.json()));
        const results = await Promise.all(promises);
        chaptersData = results.flat();
      }

      setNovels(novelsData);
      setChapters(chaptersData);
      setError(null);
    } catch (err: any) {
      console.error("API Fetch Error", err);
      setError(err.message || 'Gagal memuat data perpustakaan.');
    } finally {
      setLoading(false);
    }
  };

  // On Mount Load
  useEffect(() => {
    fetchData();

    // Check Admin Authentication Token
    const adminToken = localStorage.getItem('mirai_admin_token');
    if (adminToken) {
      fetch('/api/auth/check', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      })
      .then(r => r.json())
      .then(data => {
        if (data.authenticated) {
          setIsAdmin(true);
        } else {
          localStorage.removeItem('mirai_admin_token');
        }
      })
      .catch(() => {});
    }

    // Load Local Storage user states
    const localFavs = localStorage.getItem('mirai_favorites');
    if (localFavs) setFavorites(JSON.parse(localFavs));

    const localHistory = localStorage.getItem('mirai_history');
    if (localHistory) setReadingHistory(JSON.parse(localHistory));

    const localReader = localStorage.getItem('mirai_reader_config');
    if (localReader) setReaderConfig(JSON.parse(localReader));
  }, []);

  // --- ACTIONS ---
  const handleToggleFavorite = (novelId: string) => {
    let updated: string[];
    if (favorites.includes(novelId)) {
      updated = favorites.filter(id => id !== novelId);
      showToast('Novel dihapus dari bookmark.', 'info');
    } else {
      updated = [...favorites, novelId];
      showToast('Novel ditambahkan ke bookmark!', 'success');
    }
    setFavorites(updated);
    localStorage.setItem('mirai_favorites', JSON.stringify(updated));
  };

  const handleUpdateReadingHistory = (novelSlug: string, chapterSlug: string) => {
    const updated = {
      ...readingHistory,
      [novelSlug]: chapterSlug
    };
    setReadingHistory(updated);
    localStorage.setItem('mirai_history', JSON.stringify(updated));
  };

  const handleConfigChange = (newConfig: ReaderConfig) => {
    setReaderConfig(newConfig);
    localStorage.setItem('mirai_reader_config', JSON.stringify(newConfig));
  };

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('mirai_admin_token', token);
    setIsAdmin(true);
    setCurrentView('admin-dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('mirai_admin_token');
    setIsAdmin(false);
    setCurrentView('home');
    showToast('Berhasil keluar dari admin.', 'info');
  };

  // --- CRUD ACTIONS (Admin API) ---
  const handleSaveNovel = async (novelData: Omit<Novel, 'id' | 'views' | 'created_at' | 'updated_at'>, id?: string) => {
    const token = localStorage.getItem('mirai_admin_token');
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/novels/${id}` : '/api/novels';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(novelData)
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Gagal menyimpan novel.');
    }

    await fetchData();
  };

  const handleSaveChapter = async (chapterData: Omit<Chapter, 'id' | 'views' | 'created_at' | 'updated_at'>, id?: string) => {
    const token = localStorage.getItem('mirai_admin_token');
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/chapters/${id}` : '/api/chapters';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(chapterData)
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Gagal menyimpan bab.');
    }

    await fetchData();
  };

  const handleDeleteNovel = async (id: string) => {
    const token = localStorage.getItem('mirai_admin_token');
    const response = await fetch(`/api/novels/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error('Gagal menghapus novel.');
    }
    await fetchData();
  };

  const handleDeleteChapter = async (id: string) => {
    const token = localStorage.getItem('mirai_admin_token');
    const response = await fetch(`/api/chapters/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error('Gagal menghapus bab.');
    }
    await fetchData();
  };

  // --- ROUTER & NAVIGATION CONTROLLER ---
  const navigateTo = (view: string) => {
    if (view.startsWith('novel-')) {
      const slug = view.replace('novel-', '');
      setSelectedNovelSlug(slug);
      setCurrentView('novel-detail');
    } else if (view.startsWith('genre-')) {
      const genreSlug = view.replace('genre-', '');
      setSelectedGenreSlug(genreSlug);
      setCurrentView('genres');
    } else {
      setCurrentView(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChapterRead = (novelSlug: string, chapterSlug: string) => {
    setSelectedNovelSlug(novelSlug);
    setSelectedChapterSlug(chapterSlug);
    handleUpdateReadingHistory(novelSlug, chapterSlug);
    setCurrentView('reading');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectNovelEdit = (novel: Novel) => {
    setEditingNovel(novel);
    setCurrentView('admin-novel-manager');
  };

  const handleSelectChapterEdit = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setCurrentView('admin-chapter-manager');
  };

  // --- RENDER CURRENT VIEW ---
  const renderViewContent = () => {
    if (loading) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-mono text-slate-500">Membuka lembaran takdir perpustakaan...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-200">Koneksi Gagal</h2>
          <p className="text-sm text-slate-500 leading-relaxed">{error}</p>
          <button 
            onClick={fetchData} 
            className="px-4.5 py-2 text-xs font-bold rounded-xl bg-violet-600 hover:bg-violet-500 text-white cursor-pointer"
          >
            Segarkan Halaman
          </button>
        </div>
      );
    }

    switch (currentView) {
      case 'home':
        return (
          <HomeView 
            novels={novels} 
            chapters={chapters} 
            onNovelClick={(slug) => navigateTo(`novel-${slug}`)}
            onNavigate={navigateTo}
            favorites={favorites}
          />
        );
      case 'search':
        return (
          <SearchView 
            novels={novels} 
            chapters={chapters} 
            onNovelClick={(slug) => navigateTo(`novel-${slug}`)}
            favorites={favorites}
          />
        );
      case 'genres':
        return (
          <GenreView 
            novels={novels} 
            selectedGenreSlug={selectedGenreSlug}
            onNovelClick={(slug) => navigateTo(`novel-${slug}`)}
            favorites={favorites}
          />
        );
      case 'latest':
        // Show latest novels
        return (
          <SearchView 
            novels={novels} 
            chapters={chapters} 
            onNovelClick={(slug) => navigateTo(`novel-${slug}`)}
            favorites={favorites}
          />
        );
      case 'popular':
        // Handled through the search sorting
        return (
          <SearchView 
            novels={novels} 
            chapters={chapters} 
            onNovelClick={(slug) => navigateTo(`novel-${slug}`)}
            favorites={favorites}
          />
        );
      case 'completed':
        return (
          <GenreView 
            novels={novels.filter(n => n.status === 'Completed')} 
            selectedGenreSlug="all"
            onNovelClick={(slug) => navigateTo(`novel-${slug}`)}
            favorites={favorites}
          />
        );
      case 'ongoing':
        return (
          <GenreView 
            novels={novels.filter(n => n.status === 'Ongoing')} 
            selectedGenreSlug="all"
            onNovelClick={(slug) => navigateTo(`novel-${slug}`)}
            favorites={favorites}
          />
        );
      case 'novel-detail':
        const targetNovel = novels.find(n => n.slug === selectedNovelSlug);
        if (!targetNovel) {
          return <div className="text-center py-20 text-slate-500">Novel tidak ditemukan.</div>;
        }
        return (
          <NovelDetailView 
            novel={targetNovel} 
            chapters={chapters} 
            onChapterClick={handleChapterRead}
            onNavigate={navigateTo}
            allNovels={novels}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            readingHistory={readingHistory}
          />
        );
      case 'reading':
        const rNovel = novels.find(n => n.slug === selectedNovelSlug);
        const rChapter = chapters.find(c => c.slug === selectedChapterSlug && c.novel_id === rNovel?.id);
        if (!rNovel || !rChapter) {
          return <div className="text-center py-20 text-slate-500">Bab tidak ditemukan atau sudah dihapus.</div>;
        }
        return (
          <ReadingView 
            novel={rNovel} 
            chapter={rChapter} 
            allChapters={chapters} 
            onChapterClick={handleChapterRead}
            onNavigate={navigateTo}
            config={readerConfig}
            onConfigChange={handleConfigChange}
          />
        );
      case 'about':
        return <StaticView viewType="about" />;
      case 'privacy':
        return <StaticView viewType="privacy" />;
      case 'dmca':
        return <StaticView viewType="dmca" />;
      
      // --- ADMIN PORTAL VIEWS ---
      case 'admin-login':
        return <AdminLoginView onLoginSuccess={handleLoginSuccess} showToast={showToast} />;
      case 'admin-dashboard':
        if (!isAdmin) return <AdminLoginView onLoginSuccess={handleLoginSuccess} showToast={showToast} />;
        return (
          <AdminDashboardView 
            onNavigate={navigateTo}
            onSelectNovelEdit={handleSelectNovelEdit}
            onSelectChapterEdit={handleSelectChapterEdit}
            onDeleteNovel={handleDeleteNovel}
            onDeleteChapter={handleDeleteChapter}
            novels={novels}
            chapters={chapters}
            showToast={showToast}
          />
        );
      case 'admin-novel-manager':
        if (!isAdmin) return <AdminLoginView onLoginSuccess={handleLoginSuccess} showToast={showToast} />;
        return (
          <AdminNovelManagerView 
            onBack={() => { setEditingNovel(null); navigateTo('admin-dashboard'); }}
            onSaveNovel={handleSaveNovel}
            editingNovel={editingNovel}
            showToast={showToast}
          />
        );
      case 'admin-chapter-manager':
        if (!isAdmin) return <AdminLoginView onLoginSuccess={handleLoginSuccess} showToast={showToast} />;
        return (
          <AdminChapterManagerView 
            onBack={() => { setEditingChapter(null); navigateTo('admin-dashboard'); }}
            onSaveChapter={handleSaveChapter}
            editingChapter={editingChapter}
            novels={novels}
            showToast={showToast}
          />
        );
      default:
        // 404 Fallback
        return (
          <div className="max-w-md mx-auto py-24 text-center space-y-4">
            <h1 className="font-['Cinzel'] text-6xl font-black text-violet-500">404</h1>
            <h2 className="font-['Cinzel'] text-xl font-bold text-slate-200">Gerbang Sihir Terputus</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Maaf, dimensi halaman yang Anda cari tidak ada dalam peta perpustakaan kami.
            </p>
            <button 
              onClick={() => navigateTo('home')} 
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-violet-600 hover:bg-violet-500 text-white cursor-pointer"
            >
              Kembali ke Beranda
            </button>
          </div>
        );
    }
  };

  // Hide header and footer if in active reading mode to support "Immersion Mode" reader focus
  const isReadingMode = currentView === 'reading';

  return (
    <div className={`min-h-screen ${isReadingMode ? '' : 'bg-[#050507] text-[#e0e0e0] font-sans flex flex-col md:flex-row relative overflow-x-hidden'}`}>
      {/* Absolute Background Glowing Orbs for the Sleek Interface Theme */}
      {!isReadingMode && (
        <>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10 -mr-40 -mt-40 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] -z-10 -ml-20 -mb-20 pointer-events-none" />
        </>
      )}

      {!isReadingMode && (
        <Header 
          currentView={currentView} 
          onNavigate={navigateTo} 
          isAdmin={isAdmin} 
          onLogout={handleLogout} 
        />
      )}

      {/* Main Content Pane */}
      <div className={`flex-1 flex flex-col min-h-screen ${isReadingMode ? '' : 'w-full'}`}>
        {/* Main content frame with layout alignment padding */}
        <div className={isReadingMode ? '' : 'p-4 sm:p-6 lg:p-8 w-full flex-1 max-w-7xl mx-auto'}>
          {renderViewContent()}
        </div>

        {!isReadingMode && (
          <Footer 
            onNavigate={navigateTo} 
            isAdmin={isAdmin} 
          />
        )}
      </div>

      {/* Global animated Toasts */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
