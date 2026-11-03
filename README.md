# PORTOFOLIO PRIBADI — TYPESCRIPT TSX (TANPA REACT)

Website portofolio pribadi dengan desain modern, responsif, galeri proyek interaktif, filter karya, mode terang/gelap, informasi keahlian, dan kontak.

**Teknologi:** TypeScript + TSX + **SolidJS** + Vite + CSS murni. **Tidak menggunakan React.**

## 1. Cara menjalankan (Windows, VS Code)

1. Ekstrak file ZIP ini terlebih dahulu.
2. Buka **VS Code** → **File → Open Folder** → pilih folder `portfolio-pribadi-tsx`.
3. Buka terminal VS Code: **Terminal → New Terminal**.
4. Jalankan perintah berikut satu per satu:

   ```bash
   npm install
   npm run dev
   ```

5. Buka alamat lokal yang ditampilkan di terminal (biasanya `http://localhost:5173`).

**Penting:** Jalankan `npm install` di dalam folder yang memiliki `package.json`, bukan di Downloads atau folder luarnya.

## 2. Mengubah identitas pribadi

Buka file **`src/data/portfolio.ts`**. Ubah data berikut:

- `name`: nama lengkap
- `shortName`: inisial untuk logo
- `role`: pekerjaan / bidang
- `location`: lokasi umum
- `shortBio`, `about`, `aboutSecond`: deskripsi diri
- `email`: email pribadi
- `social`: tautan GitHub, LinkedIn, Instagram
- `expertise`: keahlian dan teknologi
- `projects`: proyek dan pengalaman asli

**Catatan:** Empat proyek di dalam template adalah **contoh visual**, bukan klaim pengalaman pribadi. Ganti dulu sebelum dipublikasikan.

## 3. Mengganti foto profil

1. Masukkan file foto, contoh `foto-saya.jpg`, ke folder **`public`**.
2. Buka `src/data/portfolio.ts`.
3. Ubah:

   ```ts
   photo: '/foto-saya.jpg',
   ```

   Jika `photo: ''`, website menampilkan ilustrasi default.

## 4. Menambahkan CV

Masukkan `cv-saya.pdf` ke folder **`public`**, lalu ubah di `src/data/portfolio.ts`:

```ts
resume: '/cv-saya.pdf',
```

Link unduh CV akan muncul pada bagian Tentang. Bila kosong (`''`) tombol CV disembunyikan.

## 5. Menambahkan proyek

Buka array `projects` di `src/data/portfolio.ts`. Contoh:

```ts
{
  id: 5,
  title: 'Website Inventaris',
  category: 'Web App', // 'Web App', 'UI/UX', atau 'Data'
  year: '2026',
  summary: 'Website untuk memantau barang secara efisien.',
  description: 'Jelaskan peranmu, masalah, proses, dan hasilnya.',
  stack: ['TypeScript', 'CSS', 'SolidJS'],
  visual: 'dashboard', // dashboard, mobile, branding, analytics
  link: 'https://alamat-website-milikmu.com', // opsional
},
```

Untuk mengganti bentuk ilustrasi pada kartu, edit `VisualCard` di `src/App.tsx` dan CSS-nya di `src/style.css`. Foto proyek asli juga dapat ditambahkan sebagai gambar statis bila diperlukan.

## 6. Mengganti warna

Buka **`src/style.css`**, cari:

```css
.site {
  --accent: #ef6f4d;
}
```

Ubah dengan kode warna favoritmu.

## 7. Build untuk hosting

```bash
npm run build
```

Hasilnya ada di folder **`dist/`**. Bisa diunggah ke Vercel, Netlify, atau hosting statis.

Untuk Vercel: Framework Preset **Other**, Build Command `npm run build`, Output Directory `dist`.

## 8. Struktur folder

```text
portfolio-pribadi-tsx/
├── public/
│   └── favicon.svg
├── src/
│   ├── data/
│   │   └── portfolio.ts  <-- EDIT KONTEN DI SINI
│   ├── App.tsx           <-- TAMPILAN & INTERAKSI
│   ├── index.tsx         <-- ENTRY POINT TSX
│   └── style.css         <-- WARNA & DESAIN
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

**Tip:** Semua konten contoh ditandai dengan kata `Contoh`. Jangan lupa mengganti email, nama, link sosial, foto, dan proyek sebelum membagikan situs.

## 9. Melihat desain tanpa instalasi

Klik dua kali **`LIHAT-TAMPILAN.html`** untuk melihat **pratinjau statis** langsung di Chrome. Fitur penuh (filter, modal karya, mode gelap, dan data yang bisa diubah) tersedia saat website TSX dijalankan menggunakan `npm run dev`. Di Windows kamu juga bisa klik dua kali **`JALANKAN-WEBSITE.bat`** bila Node.js sudah terpasang.
