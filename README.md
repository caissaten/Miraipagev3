# 🌸 MiraiPage - Premium Original Novel Library

MiraiPage adalah sebuah website perpustakaan novel orisinal pribadi yang dirancang dengan estetika perpustakaan fantasi modern, minimalis, dan mewah. Terinspirasi dari kenyamanan pembaca di platform besar (Webnovel, RoyalRoad, NovelUpdates, LightNovelPub) namun dibangun dengan kode, tata letak, dan aset orisinal seutuhnya.

Situs ini bertindak sebagai **Perpustakaan Pribadi Tunggal (Satu Admin/Owner)**. Pengunjung umum bertindak sebagai pembaca murni (*read-only*) tanpa pendaftaran akun, rating, komentar, atau iklan yang mengganggu kenyamanan.

---

## ✨ Fitur Unggulan

*   **🎭 Estetika Perpustakaan Fantasi Modern**: Desain gelap premium, aksen gradien ungu-fuchsia misterius, tipografi anggun, transisi halus, dan efek kaca (*glassmorphism*) yang melingkupi seluruh halaman.
*   **📖 Kenyamanan Membaca Premium (Reader Config)**: Panel pengaturan baca yang dapat disesuaikan (ukuran huruf, tinggi baris, lebar halaman, dan 4 tema warna: *Charcoal Dark*, *AMOLED Pure Black*, *Warm Sepia*, dan *Paper Light*).
*   **💾 Riwayat Otomatis & Bookmark Tanpa Login**: Menyimpan progres bab terakhir yang dibaca (*continue reading*) dan bookmark novel favorit pengunjung secara otomatis di peramban lokal (*LocalStorage*).
*   **⚡ Pencarian & Penyaringan Pintar**: Saring novel berdasarkan status (*Ongoing* / *Completed*), genre multi-seleksi, pencarian kata kunci naskah secara dinamis dengan visual transisi halus.
*   **🔒 Panel Admin Blogger/Wordpress-Style**: Kelola novel dan bab secara instan melalui dasbor visual khusus admin.
*   **📤 Kompresor Gambar Otomatis & Drag-Drop Upload**: Unggah cover novel Anda melalui sistem tarik-taruh (*drag-and-drop*). Gambar akan dikompresi di sisi klien menjadi format JPEG 80% berkualitas tinggi sebelum diunggah langsung ke Supabase Storage atau penyimpanan lokal.
*   **💾 Arsitektur Dual-Database Hybrid**: Beroperasi secara cerdas menggunakan penyimpanan lokal terenkripsi jika Supabase belum terkonfigurasi, dan terintegrasi langsung dengan Supabase PostgreSQL/Storage jika kunci `.env` disediakan.

---

## 🛠️ Panduan Instalasi Lokal

### 1. Kloning Repositori & Instalasi Dependensi
```bash
# Install seluruh paket dependensi
npm install
```

### 2. Atur Berkas Lingkungan (`.env`)
Salin berkas contoh `.env.example` menjadi `.env` di direktori utama Anda:
```env
# Kredensial Admin Utama untuk Mode Lokal
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="mirai123"

# Opsional: Integrasi database live Supabase Anda (Jika kosong, sistem menggunakan penyimpanan lokal hybrid otomatis!)
SUPABASE_URL=""
SUPABASE_ANON_KEY=""
```

### 3. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka peramban Anda pada tautan [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Panduan Migrasi Database Supabase (Opsional)

Jika Anda ingin beralih dari database lokal ke **Supabase Live Production Database**, silakan ikuti langkah-langkah mudah berikut:

1.  Buat akun dan proyek baru di [Supabase Console](https://supabase.com).
2.  Buka menu **SQL Editor** pada dasbor proyek Supabase Anda.
3.  Salin seluruh isi berkas dari berkas `/supabase-setup.sql` proyek ini, tempelkan ke SQL Editor Supabase, lalu klik tombol **Run**. Ini akan otomatis mengonfigurasi:
    *   Tabel `novels` dan `chapters` beserta relasi kunci asing (*foreign keys*), batasan (*constraints*), dan indeks performa.
    *   Triger pemutakhiran tanggal otomatis (`updated_at`).
    *   Fungsi internal RPC (`increment_novel_views` & `increment_chapter_views`) untuk pencatatan kunjungan yang akurat.
    *   Kebijakan Keamanan Row Level Security (RLS) agar pengunjung umum hanya dapat membaca konten naskah yang terbit (*Published*), sementara modifikasi hanya dapat dilakukan oleh Admin terverifikasi.
4.  Buka menu **Storage** di Supabase, lalu buat sebuah wadah (*bucket*) baru bernama `covers` dengan status **Public** (agar gambar cover dapat diakses oleh publik).
5.  Salin tautan **Project URL** dan **Anon API Key** dari menu *Project Settings > API*, lalu tempelkan ke berkas `.env` Anda.
6.  Restart server pengembangan Anda. MiraiPage Anda kini telah terhubung ke database cloud global Supabase secara realtime!

---

## 🚀 Panduan Deploy ke Vercel

Situs ini siap dideploy (*production ready*) ke Vercel dalam hitungan menit:

1.  Unggah kode proyek ini ke repositori pribadi Anda di **GitHub**.
2.  Buka [Vercel Dashboard](https://vercel.com) dan buat proyek baru dengan menghubungkannya ke repositori GitHub tersebut.
3.  Pada bagian **Environment Variables** di dasbor Vercel, masukkan parameter berikut:
    *   `ADMIN_USERNAME` = `username_pilihan_anda`
    *   `ADMIN_PASSWORD` = `password_kuat_anda`
    *   `SUPABASE_URL` = `tautan_supabase_anda` (opsional)
    *   `SUPABASE_ANON_KEY` = `anon_key_supabase_anda` (opsional)
4.  Klik tombol **Deploy**. Proyek Anda akan langsung dibangun secara otomatis dan siap diakses secara publik dengan performa tinggi!

---

## 🏛️ Hak Cipta & Lisensi

Seluruh tulisan, novel, dan aset naskah fiksi yang dipublikasikan di MiraiPage merupakan milik sah kekayaan intelektual dari pemilik situs (**MiraiPage Owner**). Pembajakan atau publikasi ulang naskah naskah fiksi tanpa izin tertulis akan diproses sesuai ketentuan hukum digital yang berlaku.
