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

Data disimpan sebagai satu dokumen `portfolio/main`, sesuai skala portofolio kecil. Dokumen Firestore memiliki batas ukuran; jangan menaruh isi file atau base64 di dalamnya. Gambar dapat diunggah melalui admin setelah Firebase Storage diaktifkan sesuai petunjuk di bawah. URL atau path file publik tetap didukung untuk gambar dan CV. Untuk file di `public`, gunakan `/nama-file.ext`.

Website publik mendengarkan perubahan Firestore. Jika database belum dapat diakses atau datanya tidak valid, konten lokal tetap tampil sebagai cadangan. Jangan masukkan data rahasia ke dokumen portofolio karena dokumen tersebut publik. Konfigurasi Firebase web merupakan identitas aplikasi publik; akses data dikontrol Security Rules, bukan menyembunyikan API key.

Analytics belum diaktifkan karena CMS tidak memerlukannya.

## Deployment

### Upload gambar dari admin

1. Buka Firebase Console proyek `portofolio-9568a`, lalu Storage. Aktifkan bucket default yang sesuai konfigurasi `src/firebase.ts`.
2. Firebase Storage memerlukan paket Blaze dan akun billing. Aktivasi billing dilakukan pemilik akun di Console, bukan otomatis oleh aplikasi. Dokumentasi: https://firebase.google.com/docs/storage/web/start
3. Di Storage → Rules (bukan Firestore Rules), terapkan isi `storage.rules`, lalu Publish. Saat diminta, aktifkan izin Storage Rules membaca Firestore untuk memeriksa dokumen admin. Dokumentasi: https://firebase.google.com/docs/storage/security/rules-conditions
4. Alternatif setelah Firebase CLI terautentikasi: `firebase deploy --only storage`.
5. Login admin, pilih gambar JPG/PNG/WebP/GIF maksimal 5 MB. Tunggu upload selesai, simpan item ke draf, lalu Simpan & terbitkan. Profil cukup langsung disimpan dan diterbitkan.

File disimpan di Storage; URL-nya disimpan di Firestore saat penerbitan. Upload tidak memerlukan deploy ulang. Membatalkan draf setelah upload tidak menghapus file dari Storage; file yang tidak digunakan dapat dibersihkan manual lewat Console. Upload baru selalu memakai nama unik sehingga tidak menimpa file lama. Rules membatasi upload pada admin, membatasi jenis dan ukuran file, serta membuka pembacaan media publik. File lama di folder `public` tetap dapat digunakan.

Verifikasi setelah aktivasi: upload gambar dari akun admin, terbitkan, lalu buka website melalui incognito. Akun non-admin harus ditolak saat mencoba upload. Aktivasi bucket, billing, dan pengujian upload online belum dilakukan oleh perubahan kode ini.

`npm run build` menghasilkan folder `dist`. Konfigurasi rewrite `/admin` untuk Vercel tersedia di `vercel.json`. Untuk Firebase Hosting, konfigurasi SPA tersedia di `firebase.json`. Hosting lain perlu fallback `/admin` ke `index.html`.

Opsional dengan Firebase CLI yang sudah login:

```sh
firebase deploy --only firestore:rules
firebase deploy --only hosting
```

Build lokal tidak mengaktifkan layanan, menerapkan rules, atau melakukan deployment secara otomatis. Login dan simpan online perlu diuji setelah langkah Console selesai.
