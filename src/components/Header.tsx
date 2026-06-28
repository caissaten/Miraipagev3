import { useState } from 'react';
import { 
  Search, BookOpen, Menu, X, Library, ShieldAlert, LogOut, 
  LayoutDashboard, Home, Clock, Flame, CheckCircle, TrendingUp 
} from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isAdmin: boolean;
  onLogout: () => void;
}

export default function Header({ currentView, onNavigate, isAdmin, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  const isGenreActive = currentView === 'genres' || currentView.startsWith('genre-');

  // Unified items
  const mainNavs = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'search', label: 'Cari Novel', icon: Search },
    { id: 'genres', label: 'Genre', icon: BookOpen, active: isGenreActive },
  ];

  const contentNavs = [
    { id: 'latest', label: 'Terbaru', icon: Clock },
    { id: 'popular', label: 'Populer', icon: TrendingUp },
  ];

  const statusNavs = [
    { id: 'completed', label: 'Tamat', icon: CheckCircle },
    { id: 'ongoing', label: 'Ongoing', icon: Flame },
  ];

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. DESKTOP SIDE BAR NAVIGATION (Sleek Interface Sidebar Theme) */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex w-64 border-r border-white/5 bg-[#08080a] flex-col h-screen sticky top-0 shrink-0 select-none">
        {/* Brand Header */}
        <div className="p-6">
          <button 
            id="btn-logo-header"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 mb-8 group hover:opacity-95 transition-all text-left w-full"
          >
            <div className="w-9 h-9 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/10">
              <span className="text-white font-extrabold text-sm font-sans">M</span>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 uppercase">
                Mirai<span className="text-indigo-400 font-extrabold">Page</span>
              </h1>
              <p className="text-[9px] uppercase tracking-wider text-white/30 font-semibold mt-0.5">Novel Archive</p>
            </div>
          </button>

          <nav className="space-y-6">
            {/* Group 1: Discover */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3 px-2 font-semibold">Discover</p>
              <ul className="space-y-1">
                {mainNavs.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.active !== undefined ? item.active : currentView === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        id={`nav-${item.id}`}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm transition-all ${
                          isActive
                            ? 'bg-white/5 text-white border border-white/5 font-semibold shadow-inner'
                            : 'text-white/50 hover:text-white hover:bg-white/5 font-medium'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-white/30'}`} />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Group 2: Content */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3 px-2 font-semibold">Content</p>
              <ul className="space-y-1">
                {contentNavs.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        id={`nav-${item.id}`}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm transition-all ${
                          isActive
                            ? 'bg-white/5 text-white border border-white/5 font-semibold shadow-inner'
                            : 'text-white/50 hover:text-white hover:bg-white/5 font-medium'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-white/30'}`} />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Group 3: Status */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3 px-2 font-semibold">Status</p>
              <ul className="space-y-1">
                {statusNavs.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        id={`nav-${item.id}`}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm transition-all ${
                          isActive
                            ? 'bg-white/5 text-white border border-white/5 font-semibold shadow-inner'
                            : 'text-white/50 hover:text-white hover:bg-white/5 font-medium'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-white/30'}`} />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Group 4: System / Admin */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3 px-2 font-semibold">System</p>
              <ul className="space-y-1">
                {isAdmin ? (
                  <>
                    <li>
                      <button
                        id="btn-goto-dashboard"
                        onClick={() => handleNavClick('admin-dashboard')}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm font-semibold transition-all ${
                          currentView.startsWith('admin-')
                            ? 'text-indigo-400 border border-indigo-400/20 bg-indigo-400/5'
                            : 'text-white/50 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                        <span>Dashboard Admin</span>
                      </button>
                    </li>
                    <li>
                      <button
                        id="btn-header-logout"
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/5 transition-all"
                      >
                        <LogOut className="w-4 h-4 text-rose-500/50" />
                        <span>Log Out</span>
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <button
                      id="btn-login-sidebar"
                      onClick={() => handleNavClick('admin-login')}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium transition-all ${
                        currentView === 'admin-login'
                          ? 'text-indigo-400 border border-indigo-400/20 bg-indigo-400/5 font-semibold'
                          : 'text-white/40 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <ShieldAlert className="w-4 h-4 text-white/30" />
                      <span>Admin Login</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </nav>
        </div>

        {/* Curator Profile Widget */}
        <div className="mt-auto p-6 border-t border-white/5 bg-[#060608]/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/20 flex items-center justify-center text-indigo-300 text-xs font-bold font-mono">
              OWN
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white leading-tight truncate">Mirai Owner</p>
              <p className="text-[10px] text-white/40 leading-none mt-0.5 truncate">Library Curator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE HEADER BAR & DRAWER (Sleek Interface Mobile Theme) */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-[#08080a]/90 backdrop-blur-md border-b border-white/5 px-4 h-16 flex items-center justify-between md:hidden shrink-0">
        <button 
          id="btn-logo-header-mobile"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
            <span className="text-white font-extrabold text-xs">M</span>
          </div>
          <span className="text-sm font-bold tracking-widest text-white uppercase font-sans">
            MIRAI<span className="text-indigo-400 font-extrabold">PAGE</span>
          </span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id="btn-search-trigger-mobile"
            onClick={() => handleNavClick('search')}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            aria-label="Cari Novel"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <button
            id="btn-mobile-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Drawer menu */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-[#08080a] border-b border-white/5 py-4 px-6 flex flex-col gap-4 animate-fadeIn shadow-2xl z-50">
            <div className="space-y-1">
              <p className="text-[9px] uppercase tracking-widest text-white/30 mb-2 font-bold font-mono">Discover</p>
              {mainNavs.map((item) => {
                const Icon = item.icon;
                const isActive = item.active !== undefined ? item.active : currentView === item.id;
                return (
                  <button
                    id={`mobilenav-${item.id}`}
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-left font-medium text-sm transition-all ${
                      isActive
                        ? 'bg-white/5 text-white border border-white/5 font-semibold'
                        : 'text-white/50 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 opacity-75 text-indigo-400" />
                      <span>{item.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-1">
              <p className="text-[9px] uppercase tracking-widest text-white/30 mb-2 font-bold font-mono">Content</p>
              {contentNavs.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    id={`mobilenav-${item.id}`}
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-left font-medium text-sm transition-all ${
                      isActive
                        ? 'bg-white/5 text-white border border-white/5 font-semibold'
                        : 'text-white/50 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 opacity-75 text-indigo-400" />
                      <span>{item.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-1">
              <p className="text-[9px] uppercase tracking-widest text-white/30 mb-2 font-bold font-mono">Status</p>
              {statusNavs.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    id={`mobilenav-${item.id}`}
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-left font-medium text-sm transition-all ${
                      isActive
                        ? 'bg-white/5 text-white border border-white/5 font-semibold'
                        : 'text-white/50 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 opacity-75 text-indigo-400" />
                      <span>{item.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-white/5 pt-3 mt-1 flex flex-col gap-2">
              {isAdmin ? (
                <>
                  <button
                    id="btn-goto-dashboard-mobile"
                    onClick={() => handleNavClick('admin-dashboard')}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </button>
                  <button
                    id="btn-logout-mobile"
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-medium border border-rose-500/10 hover:bg-rose-500/15 text-rose-400"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </>
              ) : (
                <button
                  id="btn-login-mobile"
                  onClick={() => handleNavClick('admin-login')}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-medium border border-white/10 hover:bg-white/5 text-white/60"
                >
                  <ShieldAlert className="w-4 h-4 opacity-70" />
                  <span>Admin Login</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
