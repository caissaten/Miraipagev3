import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldAlert, Library } from 'lucide-react';

interface AdminLoginViewProps {
  onLoginSuccess: (token: string) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function AdminLoginView({ onLoginSuccess, showToast }: AdminLoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      showToast('Harap isi username dan password.', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login gagal.');
      }

      showToast('Login berhasil! Selamat datang Admin.', 'success');
      onLoginSuccess(data.token);
    } catch (err: any) {
      showToast(err.message || 'Koneksi gagal atau password salah.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="glass-premium rounded-3xl border border-slate-900 p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Subtle decorative glow in card */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 blur-3xl pointer-events-none rounded-full" />
        
        {/* Header branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 p-[1.5px] mx-auto shadow-lg">
            <div className="w-full h-full rounded-[14px] bg-[#090D1A] flex items-center justify-center">
              <Library className="w-6 h-6 text-violet-400" />
            </div>
          </div>
          <h2 className="font-['Cinzel'] text-xl font-bold text-white tracking-widest pt-2">PORTAL ADMIN</h2>
          <p className="text-xs text-slate-500 font-mono">Hanya pemilik perpustakaan yang dapat mengakses panel ini.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">Username</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username admin..."
                className="w-full pl-10 pr-4 py-3 bg-[#060911] border border-slate-900 focus:border-violet-600 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password..."
                className="w-full pl-10 pr-10 py-3 bg-[#060911] border border-slate-900 focus:border-violet-600 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all"
                disabled={loading}
              />
              <button
                id="btn-login-toggle-password"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Prompt info */}
          <div className="flex items-start gap-2 text-[10px] text-slate-500 bg-slate-950/40 p-3 rounded-xl border border-slate-900">
            <ShieldAlert className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              *Catatan Pengembang: Gunakan kredensial default <strong>admin</strong> dan password <strong>mirai123</strong> untuk masuk dan menguji di preview.
            </p>
          </div>

          {/* Action button */}
          <button
            id="btn-login-submit"
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-sm shadow-xl shadow-violet-600/10 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            disabled={loading}
          >
            <span>{loading ? 'Memverifikasi...' : 'Masuk Panel Admin'}</span>
          </button>

        </form>

      </div>
    </div>
  );
}
