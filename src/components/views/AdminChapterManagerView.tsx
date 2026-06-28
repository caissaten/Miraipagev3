import React, { useState, useEffect } from 'react';
import { Novel, Chapter } from '../../types';
import { FileText, ArrowLeft, Save, Sparkles, BookOpen, Eye, List, HelpCircle, CheckCircle } from 'lucide-react';

interface AdminChapterManagerViewProps {
  onBack: () => void;
  onSaveChapter: (chapterData: Omit<Chapter, 'id' | 'views' | 'created_at' | 'updated_at'>, id?: string) => Promise<void>;
  editingChapter: Chapter | null;
  novels: Novel[];
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function AdminChapterManagerView({
  onBack,
  onSaveChapter,
  editingChapter,
  novels,
  showToast
}: AdminChapterManagerViewProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  // Form Fields
  const [selectedNovelId, setSelectedNovelId] = useState(editingChapter?.novel_id || novels[0]?.id || '');
  const [chapterNumber, setChapterNumber] = useState<number>(editingChapter?.chapter_number || 1);
  const [title, setTitle] = useState(editingChapter?.title || '');
  const [content, setContent] = useState(editingChapter?.content || '');
  const [status, setStatus] = useState<'Draft' | 'Published'>(editingChapter?.status || 'Published');

  // Autosave status state
  const [lastSaved, setLastSaved] = useState<string>('');

  // Handle auto-suggesting next chapter number
  useEffect(() => {
    if (!editingChapter && selectedNovelId) {
      // In a real DB, fetch the latest chapter number.
      // We can estimate by fetching local/API, but since we have local state list, we will look at this.
      // We'll pass some heuristic: find maximum chapter number in the list for this novel and add 1
    }
  }, [selectedNovelId, editingChapter]);

  // Automated Autosave Draft timer (every 40 seconds)
  useEffect(() => {
    if (status === 'Draft' && content.trim() !== '') {
      const interval = setInterval(() => {
        localStorage.setItem(`mirai_draft_autosave_${selectedNovelId}`, JSON.stringify({
          chapterNumber, title, content
        }));
        setLastSaved(new Date().toLocaleTimeString());
      }, 40000);
      return () => clearInterval(interval);
    }
  }, [content, status, title, chapterNumber, selectedNovelId]);

  const loadAutosavedDraft = () => {
    const saved = localStorage.getItem(`mirai_draft_autosave_${selectedNovelId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setChapterNumber(parsed.chapterNumber);
        setTitle(parsed.title);
        setContent(parsed.content);
        showToast('Draf terakhir berhasil dipulihkan!', 'success');
      } catch (e) {
        showToast('Gagal memulihkan draf.', 'error');
      }
    } else {
      showToast('Tidak ada draf tersimpan untuk novel ini.', 'info');
    }
  };

  // Helper to append formatting tags into textarea
  const insertFormatting = (tagOpen: string, tagClose: string) => {
    const textarea = document.getElementById('chapter-editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = tagOpen + selected + tagClose;

    setContent(text.substring(0, start) + replacement + text.substring(end));
    
    // Reset caret
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagOpen.length, start + tagOpen.length + selected.length);
    }, 50);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedNovelId) {
      showToast('Harap pilih novel target terlebih dahulu.', 'error');
      return;
    }
    if (!title) {
      showToast('Harap masukkan judul bab.', 'error');
      return;
    }
    if (!content || content.trim() === '') {
      showToast('Isi konten bab tidak boleh kosong.', 'error');
      return;
    }

    setLoading(true);
    try {
      // Auto formatting content to wrap paragraph-breaks into HTML <p> if they wrote plain double line-breaks
      let formattedContent = content;
      if (!content.includes('<p>') && !content.includes('</p>')) {
        formattedContent = content
          .split('\n\n')
          .filter(para => para.trim() !== '')
          .map(para => `<p>${para.replace(/\n/g, '<br/>')}</p>`)
          .join('\n');
      }

      // Generate slug, e.g. "chapter-1-the-scent-of-ancient-ink"
      const cleanTitleSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const slug = `chapter-${chapterNumber}-${cleanTitleSlug}`;

      const chapterData = {
        novel_id: selectedNovelId,
        chapter_number: Number(chapterNumber),
        title,
        slug,
        content: formattedContent,
        status
      };

      await onSaveChapter(chapterData, editingChapter?.id);
      showToast(editingChapter ? 'Bab berhasil diperbarui!' : 'Bab novel berhasil dirilis!', 'success');
      
      // Clean up draft auto-saves on publish
      localStorage.removeItem(`mirai_draft_autosave_${selectedNovelId}`);
      onBack();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan bab.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div className="flex items-center gap-3">
          <button
            id="btn-ch-form-back"
            onClick={onBack}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-white text-slate-400 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-['Cinzel'] text-xl sm:text-2xl font-bold text-slate-100">
              {editingChapter ? `Edit Bab ${chapterNumber}` : 'Tulis Bab Baru'}
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Formulir penulisan draf dan perilisian bab cerita.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handlePublish} className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Right side controls panel (1 Column on Desktop) */}
        <div className="lg:col-span-1 space-y-6 lg:order-2">
          
          {/* Target Novel Selector */}
          <div className="glass-premium rounded-2xl border border-slate-900 p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono border-b border-slate-900 pb-2">Target Karya</h4>
            
            {/* Choose Novel */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold block">Pilih Novel</label>
              <select
                id="select-ch-target-novel"
                value={selectedNovelId}
                onChange={(e) => setSelectedNovelId(e.target.value)}
                className="w-full bg-[#060911] border border-slate-900 focus:border-violet-600 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none"
                disabled={editingChapter !== null} // Lock target novel if editing
              >
                {novels.map(n => (
                  <option key={n.id} value={n.id}>{n.title}</option>
                ))}
              </select>
            </div>

            {/* Chapter Number */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold block">Nomor Bab (Chapter Number)</label>
              <input
                id="input-ch-form-number"
                type="number"
                min="1"
                value={chapterNumber}
                onChange={(e) => setChapterNumber(Number(e.target.value))}
                className="w-full bg-[#060911] border border-slate-900 px-3.5 py-2.5 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-violet-600"
              />
            </div>
          </div>

          {/* Draf status, Autosave and manual recovery */}
          <div className="glass rounded-2xl border border-slate-900/60 p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono border-b border-slate-900 pb-2">Manajemen Draf</h4>
            
            {/* Status Selector */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold">Status Bab</label>
              <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-lg">
                <button
                  id="btn-ch-status-draft"
                  type="button"
                  onClick={() => setStatus('Draft')}
                  className={`py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                    status === 'Draft' ? 'bg-amber-950/40 text-amber-400 border border-amber-500/10' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Draf (Draft)
                </button>
                <button
                  id="btn-ch-status-publish"
                  type="button"
                  onClick={() => setStatus('Published')}
                  className={`py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                    status === 'Published' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/10' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Terbitkan
                </button>
              </div>
            </div>

            {/* Autosave display */}
            <div className="text-[10px] text-slate-500 space-y-2 border-t border-slate-900/60 pt-3">
              <div className="flex justify-between items-center">
                <span>Autosave Draf:</span>
                <span className="text-cyan-400 font-bold">Aktif (40s)</span>
              </div>
              {lastSaved && (
                <div className="flex justify-between items-center text-emerald-400">
                  <span>Terakhir Disimpan:</span>
                  <span>{lastSaved}</span>
                </div>
              )}
              <button
                id="btn-ch-restore-draft"
                type="button"
                onClick={loadAutosavedDraft}
                className="w-full mt-2 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white text-[10px] font-semibold transition-all cursor-pointer"
              >
                Pulihkan Draf Terakhir
              </button>
            </div>
          </div>

        </div>

        {/* Left main writing frame (3 Columns on Desktop) */}
        <div className="lg:col-span-3 space-y-6 lg:order-1">
          
          {/* Editor Header Tab toggles */}
          <div className="flex border-b border-slate-900">
            <button
              id="tab-edit-write"
              type="button"
              onClick={() => setActiveTab('write')}
              className={`px-5 py-3 text-xs font-bold uppercase tracking-wider font-mono border-b-2 transition-all cursor-pointer ${
                activeTab === 'write' ? 'border-violet-500 text-violet-400' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Tulis Cerita
            </button>
            <button
              id="tab-edit-preview"
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-5 py-3 text-xs font-bold uppercase tracking-wider font-mono border-b-2 transition-all cursor-pointer ${
                activeTab === 'preview' ? 'border-violet-500 text-violet-400' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Pratinjau Tampilan (Preview)
            </button>
          </div>

          {activeTab === 'write' ? (
            /* Writing Space Frame */
            <div className="glass rounded-2xl border border-slate-900/60 p-6 space-y-4">
              {/* Title input */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold block">Judul Bab (Wajib)</label>
                <input
                  id="chapter-form-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: Scent of Ancient Ink, Kebangkitan Sang Naga..."
                  className="w-full bg-[#060911] border border-slate-900 px-4 py-3 rounded-xl text-sm font-semibold text-slate-100 focus:outline-none focus:border-violet-600"
                />
              </div>

              {/* Blogger-like simple WYSIWYG button rail */}
              <div className="bg-[#050811] border border-slate-900 rounded-xl p-2 flex flex-wrap gap-1.5">
                <button
                  id="btn-edit-bold"
                  type="button"
                  onClick={() => insertFormatting('<strong>', '</strong>')}
                  className="px-3 py-1 bg-slate-900 hover:bg-slate-800 rounded text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
                  title="Tebal (Bold)"
                >
                  B (Bold)
                </button>
                <button
                  id="btn-edit-italic"
                  type="button"
                  onClick={() => insertFormatting('<em>', '</em>')}
                  className="px-3 py-1 bg-slate-900 hover:bg-slate-800 rounded text-xs italic font-bold text-slate-300 hover:text-white cursor-pointer"
                  title="Miring (Italic)"
                >
                  I (Italic)
                </button>
                <button
                  id="btn-edit-para"
                  type="button"
                  onClick={() => insertFormatting('<p>', '</p>')}
                  className="px-3 py-1 bg-slate-900 hover:bg-slate-800 rounded text-xs font-mono font-bold text-slate-300 hover:text-white cursor-pointer"
                  title="Paragraf HTML"
                >
                  Paragraph Tag
                </button>
                <button
                  id="btn-edit-divider"
                  type="button"
                  onClick={() => insertFormatting('<hr class="my-6 border-slate-800/80"/>\n', '')}
                  className="px-3 py-1 bg-slate-900 hover:bg-slate-800 rounded text-xs font-mono font-bold text-slate-300 hover:text-white cursor-pointer"
                  title="Pembatas Garis (Divider)"
                >
                  Divider Line
                </button>
                
                <span className="text-slate-850 px-1 font-mono">|</span>

                <div className="text-[10px] text-slate-500 font-medium self-center">
                  *Tip: Gunakan enter ganda untuk membuat paragraf baru otomatis.
                </div>
              </div>

              {/* Core Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold block">Konten Cerita (Teks Bab)</label>
                <textarea
                  id="chapter-editor-textarea"
                  rows={14}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan isi cerita bab Anda di sini..."
                  className="w-full bg-[#060911] border border-slate-900 px-4 py-3 rounded-xl text-sm font-sans text-slate-200 focus:outline-none focus:border-violet-600 leading-relaxed resize-none"
                />
              </div>
            </div>
          ) : (
            /* Preview Space Frame with realistic book font */
            <div className="glass rounded-2xl border border-[#8B5E3C]/10 bg-[#FAF5E6] p-8 text-[#44301B] space-y-6 shadow-xl">
              <div className="text-center space-y-2 pb-6 border-b border-[#E4DCC8]">
                <span className="text-xs font-bold uppercase tracking-widest text-[#8B5E3C] font-mono">Bab {chapterNumber}</span>
                <h2 className="font-['Cinzel'] text-xl sm:text-2xl font-black">{title || 'Judul Bab Kosong'}</h2>
              </div>
              
              {content ? (
                <div 
                  className="reading-content font-['Lora',_serif] leading-relaxed text-md md:text-lg"
                  dangerouslySetInnerHTML={{ 
                    __html: content.includes('<p>') ? content : content.split('\n\n').map(p => `<p>${p}</p>`).join('')
                  }}
                />
              ) : (
                <div className="text-center py-10 text-[#8B5E3C]/50 text-sm font-semibold flex flex-col items-center gap-2">
                  <HelpCircle className="w-8 h-8" />
                  <span>Konten bab masih kosong. Mulai menulis di tab "Tulis Cerita".</span>
                </div>
              )}
            </div>
          )}

          {/* Form Actions footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              id="btn-chapter-form-cancel"
              type="button"
              onClick={onBack}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-sm border border-slate-800 transition-all cursor-pointer"
              disabled={loading}
            >
              Batalkan
            </button>
            <button
              id="btn-chapter-form-submit"
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-sm shadow-xl shadow-violet-600/20 hover:scale-[1.01] transition-all cursor-pointer flex items-center gap-1.5"
              disabled={loading}
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Menyimpan...' : status === 'Draft' ? 'Simpan Draf' : 'Publish Bab'}</span>
            </button>
          </div>

        </div>

      </form>

    </div>
  );
}
