import { Library, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  isAdmin: boolean;
}

export default function Footer({ onNavigate, isAdmin }: FooterProps) {
  return (
    <footer className="border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8 mt-auto w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <button 
            id="btn-footer-logo"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/10">
              <Library className="w-4 h-4 text-indigo-400 group-hover:scale-105 transition-transform" />
            </div>
            <span className="font-serif text-base font-bold tracking-wide text-white">
              Mirai<span className="text-indigo-400 font-sans text-xs tracking-wider uppercase ml-0.5">Page</span>
            </span>
          </button>
          <p className="text-white/40 text-xs leading-relaxed max-w-sm font-sans">
            Perpustakaan fantasi imersif pribadi. Menghadirkan petualangan, sihir, dan takdir legendaris dalam format bacaan modern yang murni dan premium.
          </p>
        </div>

        {/* Navigation / Discover Column */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-white/60">Navigasi</h4>
          <ul className="space-y-2 text-xs text-white/45">
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-indigo-400 transition-colors cursor-pointer text-left">Beranda</button>
            </li>
            <li>
              <button onClick={() => onNavigate('genres')} className="hover:text-indigo-400 transition-colors cursor-pointer text-left">Pilih Genre</button>
            </li>
            <li>
              <button onClick={() => onNavigate('search')} className="hover:text-indigo-400 transition-colors cursor-pointer text-left">Pencarian Cepat</button>
            </li>
          </ul>
        </div>

        {/* Legal Column */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-white/60">Legalitas</h4>
          <ul className="space-y-2 text-xs text-white/45">
            <li>
              <button onClick={() => onNavigate('about')} className="hover:text-indigo-400 transition-colors cursor-pointer text-left">Tentang Kami</button>
            </li>
            <li>
              <button onClick={() => onNavigate('privacy')} className="hover:text-indigo-400 transition-colors cursor-pointer text-left">Kebijakan Privasi</button>
            </li>
            <li>
              <button onClick={() => onNavigate('dmca')} className="hover:text-indigo-400 transition-colors cursor-pointer text-left">DMCA & Hak Cipta</button>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/30">
        <p>© 2026 MiraiPage. Seluruh hak cipta dilindungi. Dibuat untuk kenyamanan membaca premium.</p>
        
        <div className="flex items-center gap-4">
          <button 
            id="btn-footer-admin-link"
            onClick={() => onNavigate(isAdmin ? 'admin-dashboard' : 'admin-login')}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-left border border-white/5 px-3 py-1 rounded-full bg-white/5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isAdmin ? 'Dashboard Admin' : 'Portal Admin'}</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
