/**
 * ✏️ EDIT SEMUA INFORMASI PORTOFOLIO DI FILE INI.
 * Semua teks, kontak, keahlian, dan contoh proyek berada di sini.
 * Untuk foto: taruh foto di folder public/ lalu isi photo: '/nama-file.jpg'
 */

export type ProjectCategory = 'Web App' | 'UI/UX' | 'Desain Grafis' | 'Publikasi';
export type ProjectVisual = 'dashboard' | 'mobile' | 'branding' | 'analytics' | 'website';

export interface Project {
  id: number;
  title: string;
  category: ProjectCategory;
  year: string;
  summary: string;
  description: string;
  stack: string[];
  visual: ProjectVisual;
  image?: string;
  gallery?: { src: string; alt: string }[];
  publication?: string;
  link?: string;
}

export const profile = {
  // GANTI SESUAI IDENTITAS KAMU
  name: 'Yosua Aremathea Novantoro',
  shortName: 'Thea',
  role: 'Creative Developer & Digital Designer',
  location: 'Indonesia',
  shortBio: 'Seorang tech enthusiast dan creative thinker yang senang mengeksplorasi teknologi, menciptakan karya visual, membangun solusi digital, serta mengembangkan diri melalui pengalaman, kolaborasi, dan kepemimpinan.',
  about:
    'Halo! Saya adalah Lulusan Teknik Informatika dengan ketertarikan pada teknologi, desain, dan kreativitas digital. Memiliki pengalaman dalam pengembangan website dan aplikasi, UI/UX design, desain grafis, branding, serta pembuatan materi promosi digital. Menguasai Next.js, React, TypeScript, Tailwind CSS, Firebase, dan Figma, serta memiliki pemahaman dalam pengolahan data dan pengembangan sistem rekomendasi. Selain itu, berpengalaman dalam organisasi sebagai Ketua Persekutuan Mahasiswa Kristen Katolik (PMKK) dan sebagai Humas Wilujeng Youth Aspiration Of Sragen (WIYAS) dengan kemampuan kepemimpinan, komunikasi, koordinasi tim, dan pengelolaan kegiatan. Senang mengeksplorasi ide dan mengubahnya menjadi solusi serta karya digital yang fungsional dan kreatif.',
  aboutSecond:
    'Website ini menjadi ruang untuk memperkenalkan diri, menyimpan hasil karya, dan mendokumentasikan perjalanan belajar saya. Mari saling terhubung dan menciptakan sesuatu yang menarik.',
  email: 'yosuanovantoro@gmail.com',
  // Contoh: photo: '/foto-saya.jpg'. Kosongkan untuk menampilkan ilustrasi.
  photo: 'TheaGanteng.jpeg',
  introPhoto: '', // Contoh: '/foto-intro.jpg'. Kosong = gunakan photo.
  aboutPhoto: '', // Contoh: '/foto-tentang.jpg'. Kosong = gunakan photo.
  navbarPhoto: '', // Contoh: '/foto-navbar.jpg'. Kosong = gunakan photo.
  footerPhoto: '', // Contoh: '/foto-footer.jpg'. Kosong = gunakan photo.
  // Taruh file CV di public/cv-saya.pdf, lalu isi resume: '/cv-saya.pdf'.
  resume: '/yosua%20aremathea%20novantoro-resume.pdf', // Tombol Download CV tampil di bagian Kontak setelah diisi.
  social: [
    { label: 'GitHub', url: 'https://github.com/' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/yosua-nvtr-0a00a9437' },
    { label: 'Instagram', url: 'https://www.instagram.com/yosuanvtr_' },
  ],
};

// Lengkapi nama, posisi, periode, dan highlights dengan pengalaman asli.
export const experiences = [
  {
    // Organisasi internal kampus: ganti teks dalam [...] sesuai pengalaman asli.
    id: 'organisasi-kampus',
    documentation: '', // URL album foto, Google Drive, video, atau laporan kegiatan.
    category: 'Organisasi Internal Kampus',
    title: 'Ketua PMKK',
    organization: 'PMKK Universitas Duta Bansa Surakarta',
    period: '2024 - 2025',
    description: 'Memimpin dan mengoordinasikan organisasi PMKK dalam menjalankan program kerja, mengelola kegiatan, membangun komunikasi antaranggota, serta menjalin kolaborasi untuk menciptakan lingkungan organisasi yang aktif, harmonis, dan suportif bagi pengembangan mahasiswa.',
    link: 'https://www.instagram.com/pmkkudb', // Opsional: tautan dokumentasi atau profil organisasi.
    highlights: [
      'Menginisiasi dan mengoordinasikan kegiatan kerohanian, fellowship, pembinaan karakter, pengembangan kepemimpinan, serta kegiatan sosial untuk mempererat hubungan dan meningkatkan keterlibatan mahasiswa.',
      'Membangun lingkungan organisasi yang lebih aktif, suportif, dan solid sekaligus mendorong perkembangan spiritual, kemampuan komunikasi, kerja sama, serta jiwa kepemimpinan mahasiswa.',
    ],
  },
  {
    // Organisasi eksternal: ganti teks dalam [...] sesuai pengalaman asli.
    id: 'organisasi-daerah',
    documentation: '', // URL dokumentasi pengalaman ini.
    category: 'Organisasi Eksternal',
    title: 'Humas WIYAS',
    organization: 'WIYAS Sragen',
    period: '2023 - 2026',
    description: 'Bertanggung jawab dalam membangun komunikasi dan hubungan organisasi dengan pihak internal maupun eksternal, mengelola penyampaian informasi, serta mendukung publikasi dan citra positif organisasi',
    link: 'https://www.instagram.com/wiyasragen', // Opsional: tautan dokumentasi atau profil organisasi.
    highlights: [
      'Mengelola komunikasi dan publikasi organisasi, menyebarkan informasi kegiatan, menjalin relasi, serta mendukung dokumentasi dan promosi kegiatan organisasi.',
    ],
  },
  {
    id: 'internship',
    documentation: '', // URL dokumentasi pengalaman ini.
    category: 'Magang',
    title: 'Data Entry & CAD Support Intern',
    organization: 'PT Telkom Akses Solo',
    period: 'Agustus - Desember',
    description: 'Melaksanakan kegiatan magang di Unit Konstruksi dengan tanggung jawab dalam administrasi dan pengelolaan dokumentasi infrastruktur jaringan fiber optik, meliputi pendataan ODP, ODC, dan kabel, pengarsipan dokumentasi proyek, pembuatan denah menggunakan AutoCAD, serta membantu proses administrasi dan pelaporan pekerjaan konstruksi.',
    link: 'https://www.instagram.com/telkomakses_solo',
    highlights: [] as string[],
  },
  {
    id: 'it-business',
    documentation: '', // URL dokumentasi pengalaman ini.
    category: 'Kolaborasi Usaha IT',
    title: 'Desain Grafis & Marketing',
    organization: 'Nexty Labs',
    period: '2025 - 2026',
    description: 'Berperan dalam bidang desain grafis dan pemasaran digital dengan fokus pada pembuatan konten visual yang kreatif, menarik, dan sesuai dengan identitas brand. Terlibat dalam perancangan materi promosi, desain poster, konten media sosial, serta mendukung kegiatan pemasaran untuk meningkatkan daya tarik produk dan layanan. Pengalaman ini mengembangkan kemampuan saya dalam desain visual, kreativitas, komunikasi pemasaran, dan penyampaian pesan melalui media digital.',
    link: 'https://www.nextylabs.id/about',
    highlights: [] as string[],
  },
  {
    id: 'lunar-konstruksi',
    documentation: '', // URL portofolio desain atau dokumentasi pekerjaan.
    category: 'Bidang Usaha Konstruksi',
    title: 'Desainer Grafis',
    organization: 'Lunar Konstruksi',
    period: '2025 - 2026', // Isi periode pengalaman sesuai waktu sebenarnya.
    description: 'Pernah berkontribusi sebagai desainer grafis untuk Lunar Konstruksi, bidang usaha yang bergerak di sektor konstruksi. Lunar Konstruksi berada di bawah CV yang sama dengan Nexty Labs, dengan fokus bidang usaha yang berbeda.',
    link: 'https://lunarkonstruksi.id/',
    highlights: [] as string[],
  },
];

export const expertise = [
  {
    number: '01',
    title: 'Web Development',
    desc: 'Merancang website yang responsif, rapi, dan nyaman digunakan.',
    tags: ['TypeScript', 'HTML & CSS', 'SolidJS', 'Vite'],
  },
  {
    number: '02',
    title: 'UI / UX Design',
    desc: 'Menciptakan antarmuka yang menarik dan berfokus pada pengguna.',
    tags: ['Wireframing', 'Prototyping', 'Figma', 'Canva', 'AutoCAD'],
  },
  {
    number: '03',
    title: 'Data & Problem Solving',
    desc: 'Mengubah informasi menjadi wawasan dan solusi yang mudah dipahami.',
    tags: ['Excel', 'Visualization', 'Analysis'],
  },
];

// Lengkapi judul, deskripsi, tahun, dan stack dengan detail proyek asli.
// Untuk menambahkan desain, salin contoh ini ke dalam array projects di bawah.
// Simpan gambar di public/desain/ dan sesuaikan nama file dengan gambar milikmu.
// {
//   id: 7,
//   title: 'Nama Proyek Desain',
//   category: 'Desain Grafis',
//   year: '',
//   summary: 'Ringkasan tujuan desain.',
//   description: 'Ceritakan kebutuhan desain, peranmu, dan hasilnya.',
//   stack: ['Figma'], // Ganti dengan alat yang benar-benar digunakan.
//   visual: 'branding',
//   image: '/desain/sampul.jpg',
//   gallery: [
//     { src: '/desain/poster.jpg', alt: 'Poster promosi' },
//     { src: '/desain/konten.jpg', alt: 'Konten media sosial' },
//   ],
// },
export const projects: Project[] = [
  {
    id: 1,
    title: 'Rekomendasi Divisi',
    image: '', // Simpan foto di public/karya-divisi.jpg, lalu isi '/karya-divisi.jpg'.
    category: 'Web App',
    year: '',
    summary: 'Website rekomendasi penempatan divisi magang berdasarkan profil peserta.',
    description: 'Website untuk membantu proses penempatan divisi magang dengan mempertimbangkan program studi, minat, dan keahlian peserta. Proyek ini berkaitan dengan penelitian Content-Based Filtering pada publikasi saya. Buka demo untuk menjelajahi alur dan tampilan aplikasinya.',
    stack: [],
    visual: 'website',
    link: 'https://rekomendasidivisi.vercel.app/',
  },
  {
    id: 2,
    title: 'UJK Project',
    image: '', // Contoh: '/karya-ujk.jpg'. File disimpan di folder public.
    category: 'Web App',
    year: '',
    summary: 'Proyek website UJK Project.',
    description: 'Karya pengembangan website UJK Project. Kunjungi website untuk menjelajahi proyek secara langsung.',
    stack: [],
    visual: 'website',
    link: 'https://ujkproject.vercel.app/',
  },
  {
    id: 3,
    title: 'My App',
    image: '', // Contoh: '/karya-my-app.jpg'. File disimpan di folder public.
    category: 'Web App',
    year: '',
    summary: 'Proyek website My App.',
    description: 'Karya pengembangan website My App. Kunjungi website untuk menjelajahi proyek secara langsung.',
    stack: [],
    visual: 'website',
    link: 'https://my-app-g9ne.vercel.app/',
  },
  {
    id: 4,
    title: 'Penerapan Content-Based Filtering untuk Rekomendasi Penempatan Divisi Magang Berdasarkan Program Studi, Minat, dan Keahlian',
    image: '', // Opsional: '/jurnal-rekomendasi.jpg', file di folder public.
    category: 'Publikasi',
    year: '2026',
    publication: 'JATI · Vol. 10 No. 4',
    summary: 'Rekomendasi divisi magang berdasarkan profil peserta menggunakan Content-Based Filtering.',
    description: 'Penelitian penerapan Content-Based Filtering untuk mencocokkan program studi, minat, dan keahlian peserta dengan kebutuhan divisi magang. Profil diolah menggunakan TF-IDF dan cosine similarity untuk menentukan rekomendasi. Pengujian dilakukan terhadap 12 peserta sebagai dukungan dalam proses penempatan magang.',
    stack: ['Content-Based Filtering', 'TF-IDF', 'Cosine Similarity'],
    visual: 'website',
    link: 'https://ejournal.itn.ac.id/jati/article/view/18827',
  },
  {
    id: 5,
    title: 'Sistem Kendali dan Monitoring Greenhouse untuk Budidaya Tumbuhan Anggrek',
    image: '', // Opsional: '/jurnal-greenhouse.jpg'.
    category: 'Publikasi',
    year: '2025',
    publication: 'Prosiding SENATIB 2025',
    summary: 'Pemantauan dan pengendalian lingkungan greenhouse anggrek berbasis Internet of Things.',
    description: 'Penelitian perancangan sistem pemantauan dan pengendalian greenhouse anggrek berbasis IoT. ESP32 dan sensor DHT11 digunakan untuk memantau kondisi lingkungan, sedangkan Blynk mendukung pemantauan serta pengendalian pendingin udara dan pompa air dari jarak jauh.',
    stack: ['IoT', 'ESP32', 'DHT11', 'Blynk'],
    visual: 'website',
    link: 'https://ojs.udb.ac.id/Senatib/article/view/5497',
  },
  {
    id: 6,
    title: 'Analisa Keamanan dan Privasi Data pada Sistem Penyimpanan iCloud',
    image: '', // Opsional: '/jurnal-icloud.jpg'.
    category: 'Publikasi',
    year: '2024',
    publication: 'Prosiding SENATIB 2024',
    summary: 'Kajian literatur mengenai keamanan dan privasi data pada layanan penyimpanan iCloud.',
    description: 'Penelitian dengan metode tinjauan literatur mengenai keamanan dan privasi data pada iCloud. Pembahasan mencakup autentikasi dua faktor, enkripsi, serta ancaman terhadap data pengguna untuk memberikan pemahaman mengenai perlindungan data pada layanan penyimpanan awan.',
    stack: ['Literature Review', 'Cloud Storage', 'Keamanan Data', 'Privasi Data'],
    visual: 'website',
    link: 'https://ojs.udb.ac.id/Senatib/article/view/4628',
  },
  {
    id: 7,
    title: 'Desain Grafis — Nexty Labs',
    category: 'Desain Grafis',
    year: '',
    summary: 'Kumpulan karya desain grafis untuk bidang usaha teknologi Nexty Labs.',
    description: 'Kumpulan materi visual yang saya buat dalam kontribusi desain grafis dan marketing di Nexty Labs. Karya ditujukan untuk komunikasi usaha teknologi. Galeri menampilkan contoh hasil desain; tautan Figma menyediakan koleksi selengkapnya jika tersedia.',
    stack: [], // Isi alat desain yang kamu gunakan.
    visual: 'website',
    image: '', // Contoh: '/desain/nexty/sampul.jpg'. Simpan file di public/desain/nexty/.
    gallery: [
      // { src: '/desain/nexty/desain-1.jpg', alt: 'Judul atau keterangan desain Nexty Labs' },
      // Tambahkan satu baris untuk setiap gambar desain.
    ],
  },
  {
    id: 8,
    title: 'Desain Grafis — Lunar Konstruksi',
    category: 'Desain Grafis',
    year: '',
    summary: 'Kumpulan karya desain grafis untuk bidang usaha konstruksi Lunar Konstruksi.',
    description: 'Kumpulan karya desain grafis yang saya buat untuk Lunar Konstruksi, dengan konteks komunikasi usaha di bidang konstruksi. Galeri menampilkan contoh hasil desain; tautan Figma menyediakan koleksi selengkapnya jika tersedia.',
    stack: [], // Isi alat desain yang kamu gunakan.
    visual: 'website',
    image: '', // Contoh: '/desain/lunar/sampul.jpg'. Simpan file di public/desain/lunar/.
    gallery: [
      // { src: '/desain/lunar/desain-1.jpg', alt: 'Judul atau keterangan desain Lunar Konstruksi' },
      // Tambahkan satu baris untuk setiap gambar desain.
    ],
  },
];
