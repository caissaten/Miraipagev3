import { Info, Shield, Scale, Library, Award } from 'lucide-react';

interface StaticViewProps {
  viewType: 'about' | 'privacy' | 'dmca';
}

export default function StaticView({ viewType }: StaticViewProps) {
  if (viewType === 'about') {
    return (
      <div className="max-w-3xl mx-auto space-y-8 pb-16">
        <div className="border-b border-slate-900 pb-4">
          <h1 className="font-['Cinzel'] text-2xl sm:text-3xl font-bold tracking-wider text-slate-100 flex items-center gap-2">
            <Info className="w-6 h-6 text-violet-400" />
            <span>Tentang MiraiPage</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Mengenal platform perpustakaan digital novel orisinal premium kami.</p>
        </div>

        <div className="space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base font-sans">
          <p>
            Selamat datang di <strong>MiraiPage</strong>, portal eksklusif pribadi tempat imajinasi berpadu dengan keindahan sastra fantasi modern. Kami membangun platform ini dengan satu visi utama: menghidupkan kembali pesona ruang baca kuno yang megah dalam balutan antarmuka digital yang bersih, modern, dan bebas dari distraksi visual.
          </p>

          <div className="glass rounded-2xl border border-slate-900 p-6 space-y-4">
            <h3 className="font-['Cinzel'] text-md font-bold text-slate-100 flex items-center gap-2">
              <Library className="w-5 h-5 text-violet-400" />
              <span>Satu Admin, Sastra Murni</span>
            </h3>
            <p className="text-sm">
              MiraiPage bukanlah platform komunitas publik yang penuh dengan jutaan karya setengah jadi. Ini adalah perpustakaan pribadi terkurasi tempat hanya admin utama (owner) yang bertindak sebagai kurator sekaligus penulis tunggal yang memublikasikan novel-novel fantasi orisinal terpilih. Kami percaya pada keajaiban kualitas di atas kuantitas.
            </p>
          </div>

          <div className="glass rounded-2xl border border-slate-900 p-6 space-y-4">
            <h3 className="font-['Cinzel'] text-md font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-400" />
              <span>Pengalaman Baca Tanpa Hambatan</span>
            </h3>
            <p className="text-sm">
              Kami mendesain fitur pembaca (reading panel) agar memberikan kenyamanan maksimal untuk sesi membaca yang lama. Dengan dukungan pengaturan jenis huruf, lebar margin, tinggi baris, dan penanda otomatis (continue reading) via LocalStorage, Anda dapat melanjutkan petualangan Anda kapan saja dengan mulus.
            </p>
          </div>

          <p className="text-slate-400 text-sm">
            Terima kasih telah mengunjungi MiraiPage. Semoga lembaran kisah yang kami sajikan dapat membawa Anda mengarungi alam semesta baru yang penuh dengan keajaiban, misteri, dan legenda tak terlupakan.
          </p>
        </div>
      </div>
    );
  }

  if (viewType === 'privacy') {
    return (
      <div className="max-w-3xl mx-auto space-y-8 pb-16">
        <div className="border-b border-slate-900 pb-4">
          <h1 className="font-['Cinzel'] text-2xl sm:text-3xl font-bold tracking-wider text-slate-100 flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-400" />
            <span>Kebijakan Privasi</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Kebijakan perlindungan data dan privasi pembaca MiraiPage.</p>
        </div>

        <div className="space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base font-sans">
          <p>
            Di <strong>MiraiPage</strong>, kami sangat menghargai privasi para pembaca kami. Karena platform kami didesain sebagai perpustakaan murni tanpa registrasi akun, kami tidak mengumpulkan informasi pribadi yang sensitif dari para pengunjung umum.
          </p>

          <h3 className="text-lg font-bold text-slate-200 mt-6">1. Penggunaan LocalStorage</h3>
          <p>
            Kami menggunakan teknologi <code>LocalStorage</code> pada peramban (browser) Anda murni untuk menyimpan riwayat membaca pribadi Anda, daftar bookmark novel favorit, dan konfigurasi tampilan pembaca Anda. Data ini disimpan sepenuhnya di perangkat lokal Anda dan tidak dikirimkan ke server kami.
          </p>

          <h3 className="text-lg font-bold text-slate-200 mt-6">2. Log Server Standar</h3>
          <p>
            Seperti situs web lainnya, kami mencatat informasi non-pribadi dasar seperti alamat IP anonim, tipe browser, halaman rujukan, dan waktu kunjungan murni untuk kebutuhan pemeliharaan teknis server, keamanan, dan analisis lalu lintas pembaca secara agregat.
          </p>

          <h3 className="text-lg font-bold text-slate-200 mt-6">3. Layanan Pihak Ketiga</h3>
          <p>
            Situs ini mungkin menggunakan penyedia analitik dasar atau penampung eksternal untuk melayani gambar aset. Layanan pihak ketiga ini tunduk pada kebijakan privasi mereka masing-masing.
          </p>

          <p className="text-slate-500 text-xs pt-4 border-t border-slate-900">
            Pembaruan terakhir: Juni 2026. Kebijakan ini dapat diperbarui sewaktu-waktu sesuai pengembangan teknis situs.
          </p>
        </div>
      </div>
    );
  }

  if (viewType === 'dmca') {
    return (
      <div className="max-w-3xl mx-auto space-y-8 pb-16">
        <div className="border-b border-slate-900 pb-4">
          <h1 className="font-['Cinzel'] text-2xl sm:text-3xl font-bold tracking-wider text-slate-100 flex items-center gap-2">
            <Scale className="w-6 h-6 text-rose-400" />
            <span>Pemberitahuan DMCA & Hak Cipta</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Hukum perlindungan hak cipta konten di platform MiraiPage.</p>
        </div>

        <div className="space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base font-sans">
          <p>
            Seluruh konten novel, cerita, bab, dan naskah yang dipublikasikan di <strong>MiraiPage</strong> merupakan karya kekayaan intelektual orisinal dari penulis utama (admin) platform ini, kecuali jika dinyatakan lain secara eksplisit.
          </p>

          <h3 className="text-lg font-bold text-slate-200 mt-6">1. Hak Cipta Orisinal</h3>
          <p>
            Dilarang keras menyalin, membagikan ulang, memublikasikan ulang, menerjemahkan secara ilegal, atau mengomersialkan konten tulisan kami di platform lain mana pun tanpa izin tertulis dari pemilik sah MiraiPage. Tindakan pembajakan naskah akan diproses sesuai hukum digital internasional yang berlaku.
          </p>

          <h3 className="text-lg font-bold text-slate-200 mt-6">2. Klaim Hak Cipta Aset Gambar/Karya</h3>
          <p>
            Kami berupaya menggunakan ilustrasi cover yang berlisensi bebas (seperti Unsplash) atau karya seni berizin. Jika Anda adalah pemilik sah atau pemegang hak cipta atas gambar atau aset apa pun yang digunakan di situs ini, dan tidak menginginkan penggunaannya di platform kami, silakan kirimkan laporan klaim hak cipta Anda.
          </p>

          <h3 className="text-lg font-bold text-slate-200 mt-6">3. Prosedur Pengaduan</h3>
          <p>
            Kirimkan laporan Anda dengan menyertakan bukti kepemilikan hak cipta yang sah dan tautan konten yang dipermasalahkan melalui email resmi kami. Kami akan merespons dan menghapus aset yang diklaim dalam kurun waktu maksimal 2x24 jam kerja.
          </p>

          <p className="text-slate-500 text-xs pt-4 border-t border-slate-900">
            Email Kontak Laporan: <span className="text-violet-400 underline cursor-pointer">caissaten@gmail.com</span>
          </p>
        </div>
      </div>
    );
  }

  return null;
}
