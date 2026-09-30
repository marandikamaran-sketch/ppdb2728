PANDUAN ADMIN GALERI - SMPIT SAHABAT ALAM

Versi ini memakai Netlify Functions + Netlify Blobs agar galeri dapat dikelola secara online.

FITUR
- Lima galeri sesuai Program Unggulan:
  1. Education Based on the Qur'an and Hadits
  2. Inclusion Islamic School
  3. Arabic and English Habituation
  4. Leadership and Entrepreneurship
  5. Sekolah Berbudaya Lingkungan (SBL)
- Pengunjung umum hanya dapat melihat gambar.
- Admin dapat login, menambah gambar, dan menghapus gambar.
- Gambar yang diunggah tersimpan di Netlify Blobs sehingga dapat terlihat oleh semua pengunjung.
- Admin page: /admin.html

PENTING: KREDENSIAL ADMIN TIDAK DITANAM DI JAVASCRIPT WEBSITE.
Atur Environment Variables di Netlify agar password tidak terbuka di source code.

SET ENVIRONMENT VARIABLES DI NETLIFY
1. Buka Project Settings > Environment Variables.
2. Tambahkan:
   ADMIN_USERNAME = humasppdb
   ADMIN_PASSWORD = ppdb2728
   ADMIN_SESSION_SECRET = buat-string-rahasia-panjang-acak-minimal-32-karakter
3. Pastikan variable tersedia untuk Functions.
4. Deploy ulang website.

LOGIN ADMIN
Alamat: https://DOMAIN-ANDA/admin.html
Username: humasppdb
Password: ppdb2728

BATAS UPLOAD
- JPG, PNG, WEBP, GIF
- Maksimal 4,8 MB per gambar pada versi ini.

DEPLOY
Upload/push seluruh folder project ini ke Netlify. Jangan hanya upload index.html karena folder netlify/functions diperlukan.

CATATAN
Fitur ini membutuhkan Netlify Functions dan Netlify Blobs. Environment variables dipakai agar password tidak berada di kode frontend.
