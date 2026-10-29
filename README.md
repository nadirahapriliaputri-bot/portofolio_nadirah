# Portofolio Nadira Putri

Website portofolio satu halaman yang dibuat dengan Nuxt, Vue, dan Tailwind CSS. Menampilkan profil, keahlian, tepat tiga proyek, pendidikan, formulir kontak, dan tautan media sosial.

## Menjalankan di VS Code

Pastikan Node.js sudah terpasang. Buka folder `portofolio` di VS Code, pilih **Terminal → New Terminal**, lalu jalankan:

```bash
npm install
npm run dev
```

Buka alamat yang muncul di terminal (biasanya `http://localhost:3000`).

## Mengganti foto profil

1. Buat folder `public/images` jika belum ada.
2. Simpan foto milik Anda sebagai `public/images/foto-profil.jpg`.
3. Di `app/app.vue`, ubah `const profilePhotoUrl = ref('')` menjadi `const profilePhotoUrl = ref('/images/foto-profil.jpg')`.

Selama belum ada foto, halaman menampilkan placeholder dan tidak menggunakan foto orang lain.

## Mengubah nama dan informasi diri

Ubah teks perkenalan, nama, sekolah, dan informasi lainnya langsung pada bagian template di `app/app.vue`. Bagian kartu Tentang Saya, misalnya, menampilkan nama Nadira Putri dan sekolah SMKN 71 Jakarta.

## Mengatur formulir dan media sosial

Di bagian atas `app/app.vue`, isi konfigurasi berikut dengan data Anda:

- `contactEmail`: alamat Gmail tujuan. Formulir akan membuka draf Gmail dengan nama, email pengirim, subjek, dan pesan yang sudah terisi. Pesan **belum terkirim** sampai Anda meninjau dan menekan **Kirim** di Gmail.
- `socialProfiles.instagram`: nama pengguna Instagram, tanpa URL.
- `socialProfiles.whatsapp`: nomor WhatsApp dengan kode negara, hanya angka (format: `62...`).
- `socialProfiles.tiktok`: nama pengguna TikTok, tanpa URL atau tanda `@`.
- `socialProfiles.github`: nama pengguna GitHub.

Tautan media sosial yang belum dikonfigurasi tidak ditampilkan. Ikon di bagian Beranda dan footer menggunakan konfigurasi yang sama.

Pratinjau proyek dibuat secara ilustratif dengan CSS. Gunakan tombol **Lihat Detail** untuk melihat tujuan, fitur, dan teknologi setiap proyek.

## Build produksi

Jalankan `npm run build` untuk membuat build, lalu `npm run preview` untuk melihatnya secara lokal.
