import { Settings2, Type, AlignLeft, Eye, Keyboard, ArrowUp } from 'lucide-react';

export interface ReaderConfig {
  fontSize: number;      // 14 - 26
  lineHeight: number;    // 1.5, 1.8, 2.1
  contentWidth: 'narrow' | 'normal' | 'wide';
  theme: 'dark' | 'black' | 'sepia' | 'light';
  fontFamily: 'serif' | 'sans' | 'mono';
}

interface ReaderSettingsProps {
  config: ReaderConfig;
  onChange: (newConfig: ReaderConfig) => void;
  onScrollToTop?: () => void;
}

export default function ReaderSettings({ config, onChange, onScrollToTop }: ReaderSettingsProps) {
  const updateField = (key: keyof ReaderConfig, value: any) => {
    onChange({
      ...config,
      [key]: value
    });
  };

  const themes = [
    { id: 'dark', label: 'Indigo', bg: 'bg-[#0F1420]', text: 'text-slate-200', border: 'border-slate-800' },
    { id: 'black', label: 'Pure Black', bg: 'bg-black', text: 'text-slate-300', border: 'border-zinc-900' },
    { id: 'sepia', label: 'Sepia', bg: 'bg-[#F4ECD8]', text: 'text-[#5C4033]', border: 'border-[#E4DCC8]' },
    { id: 'light', label: 'Kertas', bg: 'bg-white', text: 'text-slate-900', border: 'border-slate-200' },
  ];

  const fontFamilies = [
    { id: 'serif', label: 'Serif (Lora)' },
    { id: 'sans', label: 'Sans (Modern)' },
    { id: 'mono', label: 'Monospace' }
  ];

  const widths = [
    { id: 'narrow', label: 'Ramping' },
    { id: 'normal', label: 'Sedang' },
    { id: 'wide', label: 'Lebar' }
  ];

  return (
    <div className="glass-premium rounded-2xl border border-slate-900 p-5 space-y-5 shadow-2xl">
      <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
        <Settings2 className="w-4 h-4 text-violet-400" />
        <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">Pengaturan Baca</h4>
      </div>

      {/* Font Family Selector */}
      <div className="space-y-2">
        <label className="text-xs text-slate-400 font-semibold block">Gaya Huruf</label>
        <div className="grid grid-cols-3 gap-1 bg-[#060911] p-1 rounded-xl">
          {fontFamilies.map((font) => (
            <button
              id={`font-${font.id}`}
              key={font.id}
              onClick={() => updateField('fontFamily', font.id)}
              className={`text-xs py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                config.fontFamily === font.id
                  ? 'bg-violet-600/20 text-violet-400 border border-violet-500/20 shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {font.label}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size Control */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs text-slate-400 font-semibold">Ukuran Huruf</label>
          <span className="text-xs font-mono text-violet-400 font-bold">{config.fontSize}px</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="btn-font-dec"
            onClick={() => updateField('fontSize', Math.max(14, config.fontSize - 1))}
            className="w-8 h-8 rounded-lg bg-[#060911] border border-slate-900 flex items-center justify-center font-bold text-slate-400 hover:text-white cursor-pointer"
          >
            A-
          </button>
          <input
            id="slider-font-size"
            type="range"
            min="14"
            max="26"
            value={config.fontSize}
            onChange={(e) => updateField('fontSize', parseInt(e.target.value))}
            className="flex-1 accent-violet-600"
          />
          <button
            id="btn-font-inc"
            onClick={() => updateField('fontSize', Math.min(26, config.fontSize + 1))}
            className="w-8 h-8 rounded-lg bg-[#060911] border border-slate-900 flex items-center justify-center font-bold text-slate-400 hover:text-white cursor-pointer"
          >
            A+
          </button>
        </div>
      </div>

      {/* Content Width Control */}
      <div className="space-y-2">
        <label className="text-xs text-slate-400 font-semibold block">Lebar Konten</label>
        <div className="grid grid-cols-3 gap-1 bg-[#060911] p-1 rounded-xl">
          {widths.map((w) => (
            <button
              id={`width-${w.id}`}
              key={w.id}
              onClick={() => updateField('contentWidth', w.id)}
              className={`text-xs py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                config.contentWidth === w.id
                  ? 'bg-violet-600/20 text-violet-400 border border-violet-500/20 shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      {/* Line Height Control */}
      <div className="space-y-2">
        <label className="text-xs text-slate-400 font-semibold block">Jarak Baris (Line Height)</label>
        <div className="grid grid-cols-3 gap-1 bg-[#060911] p-1 rounded-xl">
          {[
            { id: 1.5, label: 'Rapat' },
            { id: 1.8, label: 'Normal' },
            { id: 2.1, label: 'Renggang' }
          ].map((h) => (
            <button
              id={`height-${h.id}`}
              key={h.id}
              onClick={() => updateField('lineHeight', h.id)}
              className={`text-xs py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                config.lineHeight === h.id
                  ? 'bg-violet-600/20 text-violet-400 border border-violet-500/20 shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reader Mode Theme Select */}
      <div className="space-y-2">
        <label className="text-xs text-slate-400 font-semibold block">Tema Latar</label>
        <div className="grid grid-cols-4 gap-1.5">
          {themes.map((t) => (
            <button
              id={`theme-${t.id}`}
              key={t.id}
              onClick={() => updateField('theme', t.id)}
              className={`text-[10px] py-2 rounded-xl border flex flex-col items-center gap-1 font-semibold transition-all cursor-pointer ${t.bg} ${t.text} ${
                config.theme === t.id
                  ? 'border-violet-500 ring-2 ring-violet-500/20 shadow-lg'
                  : 'border-slate-900/40 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-current opacity-80" />
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Help and scroll action */}
      <div className="border-t border-slate-900/80 pt-3 space-y-2.5">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
          <Keyboard className="w-3.5 h-3.5" />
          <span>Navigasi: Tombol ← / →</span>
        </div>
        
        {onScrollToTop && (
          <button
            id="btn-scroll-top-settings"
            onClick={onScrollToTop}
            className="flex items-center justify-center gap-1.5 w-full py-2 bg-slate-900/45 hover:bg-slate-900 text-xs text-slate-400 hover:text-slate-200 rounded-xl transition-all border border-slate-800/80 cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Scroll ke Atas</span>
          </button>
        )}
      </div>
    </div>
  );
}
