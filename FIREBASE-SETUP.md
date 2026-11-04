# Menyalakan CMS Firebase

Konfigurasi aplikasi sudah menunjuk ke proyek `portofolio-9568a`. Tidak ada data yang otomatis ditulis saat membuka website.

1. Buka Firebase Console → proyek tersebut → Firestore Database → Create database, gunakan mode production. Database harus memakai ID `(default)`.
2. Buka Authentication → Sign-in method → aktifkan Email/Password.
3. Di Authentication → Users, tambahkan akun admin menggunakan email dan password milikmu. Salin UID akun tersebut.
4. Di Firestore, buat collection `admins`, document ID berupa UID tadi, tambahkan field `enabled` bertipe boolean dengan nilai `true`. Dokumen ini hanya dibuat melalui Console; browser tidak diberi izin membuat admin.
5. Di Firestore → Rules, salin seluruh isi `firestore.rules` lalu Publish. Aturan hanya membuka pembacaan dokumen publik `portfolio/main`, dan membatasi perubahan ke admin terdaftar. Koleksi lainnya tertutup.
6. Pastikan domain deployment dan `localhost` (untuk pengembangan) tersedia di Authentication → Settings → Authorized domains.
7. Jalankan `npm run dev`, buka `/admin`, lalu login. Konten awal diambil dari file portofolio yang ada. Periksa dan klik **Publikasikan** untuk membuat `portfolio/main`.

Jika proyek sudah memakai aturan untuk aplikasi lain, gabungkan aturan secara hati-hati; jangan menimpa izin aplikasi lain tanpa meninjaunya.

## Konten dan media

CMS mengelola profil, kontak, media sosial, proyek, galeri, pengalaman, dan keahlian. Tambah, hapus, serta tombol Naik mengatur urutan item. Perubahan hanya ditulis saat Publikasikan ditekan. Sesi lain yang lebih dulu menyimpan akan memicu konflik, sehingga draf tidak menimpa perubahan tersebut diam-diam.

Data disimpan sebagai satu dokumen `portfolio/main`, sesuai skala portofolio kecil. Dokumen Firestore memiliki batas ukuran; jangan menaruh isi file atau base64 di dalamnya. Gambar dan CV menggunakan URL publik atau path file di folder public. Upload Firebase Storage dinonaktifkan agar pengelolaan foto tidak memerlukan aktivasi billing. Untuk file di `public`, gunakan `/nama-file.ext`.

Website publik mendengarkan perubahan Firestore. Jika database belum dapat diakses atau datanya tidak valid, konten lokal tetap tampil sebagai cadangan. Jangan masukkan data rahasia ke dokumen portofolio karena dokumen tersebut publik. Konfigurasi Firebase web merupakan identitas aplikasi publik; akses data dikontrol Security Rules, bukan menyembunyikan API key.

Analytics belum diaktifkan karena CMS tidak memerlukannya.

## Deployment

### Menambahkan gambar tanpa Firebase Storage

1. Masukkan gambar ke folder public, misalnya public/foto-baru.jpg.
2. Commit dan push file gambar ke GitHub, lalu tunggu deployment Vercel selesai.
3. Di admin, isi alamat gambar dengan /foto-baru.jpg, simpan item ke draf jika ada, lalu Simpan & terbitkan.
4. URL gambar publik dari layanan lain juga dapat ditempel langsung. File lokal baru tetap memerlukan deployment; perubahan alamat gambar saja cukup diterbitkan lewat admin.

Upload Storage dinonaktifkan dan tidak perlu membuat bucket atau mengaktifkan billing Firebase. File storage.rules disimpan sebagai referensi dan tidak diterapkan oleh konfigurasi deployment.

`npm run build` menghasilkan folder `dist`. Konfigurasi rewrite `/admin` untuk Vercel tersedia di `vercel.json`. Untuk Firebase Hosting, konfigurasi SPA tersedia di `firebase.json`. Hosting lain perlu fallback `/admin` ke `index.html`.

Opsional dengan Firebase CLI yang sudah login:

```sh
firebase deploy --only firestore:rules
firebase deploy --only hosting
```

Build lokal tidak mengaktifkan layanan, menerapkan rules, atau melakukan deployment secara otomatis. Login dan simpan online perlu diuji setelah langkah Console selesai.
