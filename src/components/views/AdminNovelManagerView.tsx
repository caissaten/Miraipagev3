import React, { useState, useRef } from 'react';
import { Novel } from '../../types';
import { BookOpen, ArrowLeft, Save, Upload, Sparkles, Image as ImageIcon, Check } from 'lucide-react';

interface AdminNovelManagerViewProps {
  onBack: () => void;
  onSaveNovel: (novelData: Omit<Novel, 'id' | 'views' | 'created_at' | 'updated_at'>, id?: string) => Promise<void>;
  editingNovel: Novel | null; // null if creating new
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function AdminNovelManagerView({ onBack, onSaveNovel, editingNovel, showToast }: AdminNovelManagerViewProps) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [title, setTitle] = useState(editingNovel?.title || '');
  const [author, setAuthor] = useState(editingNovel?.author || '');
  const [coverUrl, setCoverUrl] = useState(editingNovel?.cover_url || '');
  const [synopsis, setSynopsis] = useState(editingNovel?.synopsis || '');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(editingNovel?.genre || []);
  const [tagsInput, setTagsInput] = useState(editingNovel?.tags.join(', ') || '');
  const [status, setStatus] = useState<'Ongoing' | 'Completed'>(editingNovel?.status || 'Ongoing');
  const [featured, setFeatured] = useState(editingNovel?.featured || false);
  const [seoTitle, setSeoTitle] = useState(editingNovel?.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(editingNovel?.seo_description || '');

  // Drag and drop state
  const [dragOver, setDragOver] = useState(false);

  const availableGenres = [
    'Fantasy', 'Action', 'Adventure', 'Comedy', 'Drama', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Horror', 'Historical', 'Martial Arts', 'Supernatural', 'School', 'Psychological', 'Crime', 'Magic', 'Kingdom'
  ];

  const handleGenreToggle = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  // Image compressor and uploader
  const processAndUploadFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Harap pilih file gambar saja.', 'error');
      return;
    }

    setLoading(true);
    showToast('Sedang memproses & kompresi gambar...', 'info');

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create Canvas for compression
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Constraint max width to 600px
        const MAX_WIDTH = 600;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          
          // Generate compressed JPEG base64 (80% quality)
          const base64Data = canvas.toDataURL('image/jpeg', 0.8);
          
          // Send to API uploader
          uploadBase64Image(file.name, base64Data);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const uploadBase64Image = async (fileName: string, base64Data: string) => {
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mirai_admin_token')}`
        },
        body: JSON.stringify({ fileName, base64Data })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengupload.');
      }

      setCoverUrl(data.url);
      showToast('Gambar berhasil diunggah dan dikompresi!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal mengupload gambar.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Drag / Drop / Select
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAndUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processAndUploadFile(e.target.files[0]);
    }
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !author || !coverUrl || !synopsis) {
      showToast('Harap lengkapi field wajib (Judul, Penulis, Cover, Sinopsis).', 'error');
      return;
    }

    if (selectedGenres.length === 0) {
      showToast('Harap pilih minimal satu genre.', 'error');
      return;
    }

    setLoading(true);
    try {
      // Auto-generate slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const parsedTags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(t => t !== '');

      const novelData = {
        title,
        slug,
        author,
        cover_url: coverUrl,
        synopsis,
        genre: selectedGenres,
        tags: parsedTags,
        status,
        featured,
        seo_title: seoTitle || `${title} - Baca Novel Fantasi Online`,
        seo_description: seoDescription || synopsis.slice(0, 150)
      };

      await onSaveNovel(novelData, editingNovel?.id);
      showToast(editingNovel ? 'Novel berhasil diperbarui.' : 'Novel berhasil dibuat.', 'success');
      onBack();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan novel.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div className="flex items-center gap-3">
          <button
            id="btn-novel-form-back"
            onClick={onBack}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-white text-slate-400 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-['Cinzel'] text-xl sm:text-2xl font-bold text-slate-100">
              {editingNovel ? 'Edit Novel' : 'Upload Novel Baru'}
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Formulir pengisian informasi lengkap karya.</p>
          </div>
        </div>
      </div>

      {/* Main Grid layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Cover Upload & Small controls */}
        <div className="space-y-6">
          <div className="glass-premium rounded-2xl border border-slate-900 p-5 space-y-4">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono block">Cover Novel (Wajib)</label>

            {/* Drag & Drop Visual Box */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl aspect-[3/4] flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all relative overflow-hidden ${
                dragOver 
                  ? 'border-violet-500 bg-violet-600/10' 
                  : coverUrl 
                    ? 'border-slate-800 bg-[#060911]' 
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950/30'
              }`}
            >
              {coverUrl ? (
                <>
                  <img src={coverUrl} alt="Cover Preview" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200">
                    <Upload className="w-8 h-8 mb-2 text-violet-400" />
                    <span className="text-xs font-semibold">Ganti Gambar</span>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto">
                    <ImageIcon className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-300">Drag & Drop Cover</p>
                    <p className="text-[10px] text-slate-500 mt-1">Atau klik untuk memilih file</p>
                  </div>
                </div>
              )}
            </div>

            <input
              id="novel-cover-file-input"
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />

            {/* Manual cover URL input fallback */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-mono block">Atau URL Gambar Cover Manual:</label>
              <input
                id="novel-cover-url-manual"
                type="text"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-[#060911] border border-slate-900 px-3 py-2 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-violet-600"
              />
            </div>
          </div>

          {/* Quick Stats Toggles */}
          <div className="glass rounded-2xl border border-slate-900/60 p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono border-b border-slate-900 pb-2">Status & Tampilan</h4>
            
            {/* Publication Status */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold">Status Novel</label>
              <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-lg">
                <button
                  id="btn-status-ongoing"
                  type="button"
                  onClick={() => setStatus('Ongoing')}
                  className={`py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                    status === 'Ongoing' ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/10' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Ongoing
                </button>
                <button
                  id="btn-status-completed"
                  type="button"
                  onClick={() => setStatus('Completed')}
                  className={`py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                    status === 'Completed' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/10' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            {/* Featured Selection Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-900">
              <div className="space-y-0.5">
                <label className="text-xs text-slate-300 font-semibold block">Rekomendasi Utama (Featured)</label>
                <span className="text-[10px] text-slate-500">Tampilkan di slider utama Beranda.</span>
              </div>
              <button
                id="btn-novel-featured-toggle"
                type="button"
                onClick={() => setFeatured(!featured)}
                className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer ${featured ? 'bg-violet-600' : 'bg-slate-800'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${featured ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Columns: Main Metadata & Genres */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main info card */}
          <div className="glass rounded-2xl border border-slate-900/60 p-6 space-y-4">
            <h3 className="font-['Cinzel'] text-md font-bold text-slate-200 border-b border-slate-900 pb-2">Informasi Utama</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold block">Judul Novel (Wajib)</label>
                <input
                  id="novel-form-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul novel..."
                  className="w-full bg-[#060911] border border-slate-900 px-3.5 py-2.5 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-violet-600"
                />
              </div>

              {/* Author */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold block">Penulis / Author (Wajib)</label>
                <input
                  id="novel-form-author"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Masukkan nama pena..."
                  className="w-full bg-[#060911] border border-slate-900 px-3.5 py-2.5 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-violet-600"
                />
              </div>
            </div>

            {/* Synopsis */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold block">Sinopsis (Wajib)</label>
              <textarea
                id="novel-form-synopsis"
                rows={5}
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                placeholder="Tuliskan sinopsis menarik novel ini..."
                className="w-full bg-[#060911] border border-slate-900 px-3.5 py-2.5 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-violet-600 resize-none"
              />
            </div>

            {/* Tags comma input */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold block">Tag (Pisahkan dengan koma)</label>
              <input
                id="novel-form-tags"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Misal: Reinkarnasi, Sihir, Overpowered, Kerajaan..."
                className="w-full bg-[#060911] border border-slate-900 px-3.5 py-2.5 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-violet-600"
              />
            </div>
          </div>

          {/* Genres Section Grid checkboxes */}
          <div className="glass rounded-2xl border border-slate-900/60 p-6 space-y-4">
            <h3 className="font-['Cinzel'] text-md font-bold text-slate-200 border-b border-slate-900 pb-2">Pilih Genre Novel</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {availableGenres.map((genre) => {
                const checked = selectedGenres.includes(genre);
                return (
                  <button
                    id={`btn-genre-checkbox-${genre}`}
                    key={genre}
                    type="button"
                    onClick={() => handleGenreToggle(genre)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all flex items-center justify-between border ${
                      checked 
                        ? 'bg-violet-600/15 border-violet-500/40 text-violet-400 shadow-inner' 
                        : 'bg-[#060911] border-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{genre}</span>
                    {checked && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SEO Metadata Form */}
          <div className="glass rounded-2xl border border-slate-900/60 p-6 space-y-4">
            <h3 className="font-['Cinzel'] text-md font-bold text-slate-200 border-b border-slate-900 pb-2">SEO & OpenGraph Metadata (Opsional)</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold block">Judul SEO Khusus (Title Tag)</label>
                <input
                  id="novel-form-seotitle"
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Misal: Judul Novel - Baca Gratis Online"
                  className="w-full bg-[#060911] border border-slate-900 px-3.5 py-2.5 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-violet-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold block">Meta Deskripsi SEO (Meta Description)</label>
                <input
                  id="novel-form-seodescription"
                  type="text"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Tulis ringkasan singkat penarik SEO..."
                  className="w-full bg-[#060911] border border-slate-900 px-3.5 py-2.5 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-violet-600"
                />
              </div>
            </div>
          </div>

          {/* Submit Actions Button */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              id="btn-novel-form-cancel"
              type="button"
              onClick={onBack}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-sm border border-slate-800 transition-all cursor-pointer"
              disabled={loading}
            >
              Batalkan
            </button>
            <button
              id="btn-novel-form-submit"
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-sm shadow-xl shadow-violet-600/20 hover:scale-[1.01] transition-all cursor-pointer flex items-center gap-1.5"
              disabled={loading}
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Menyimpan...' : 'Publish Novel'}</span>
            </button>
          </div>

        </div>

      </form>

    </div>
  );
}
