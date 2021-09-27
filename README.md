# Final-Project-Adonisjs-JCC-Bacth-1
Kelas : Nodejs Backend Dev With Adonis 

Batch : 1

Teknis Pengerjaan: Individu

Deadline: Minggu, 26 September 2021 23.59 WIB

Restful API Main Bareng 
Overview
Aplikasi Main Bareng untuk mempertemukan pemuda-pemuda yang ingin berolahraga tim (futsal/voli/basket/minisoccer/soccer) dan booking tempat bersama. 
Definisi: 
User
Atribut tabel users: id, name, password, email, role
Data pengguna aplikasi. Terdapat 2 role: ‘user’, ‘owner’. 
user : pengguna biasa yang dapat melakukan booking ke satu field. Dapat melakukan join/unjoin ke booking tertentu.
owner: pemilik venue yang menyewakan lapangan (field) untuk dibooking.
Venue
Atribut tabel venues: id, name, address, phone
Data tempat sarana olahraga. Dapat berupa kompleks olahraga yang memiliki lebih dari satu lapangan (field) dan jenis olahraga. 
Field
Atribut tabel fields: id, name, type
Field adalah bagian dari Venue. Setiap field akan memiliki type yaitu jenis olahraga yang dimainkan di antaranya : soccer, minisoccer, futsal, basketball, volleyball 
Booking
Atribut tabel bookings: id, user_id, play_date_start, play_date_end, field_id
Booking adalah jadwal penyewaan atau jadwal main user di field/venue tertentu.


 
Minimum Viable Product(MVP): 
User dapat melakukan pemesanan booking baru (create), lalu update, read dan delete Booking tersebut.  Satu Booking bisa diikuti oleh banyak user.
User dapat join atau cancel join(unjoin) ke banyak Booking.
Terdapat endpoint khusus admin tempat penyewaan venue olahraga (user ‘owner’) yang dapat membuat (create), melihat (read) dan mengubah (update) data venue. 
Membuat dokumentasi API
Deploy aplikasi API (heroku)
Restful API
Menggunakan Adonis v5
Berikut endpoint api yang bisa jadi contoh: 
Base-url : /api/v1


Group endpoint
endpoint
Keterangan
Authentication
POST /register
Melakukan pendaftaran user baru dengan memasukan data name, email, dan password. Aplikasi mengirimkan kode OTP ke email user pendaftar.
POST /login
Melakukan login dengan memasukkan email dan password. Response : token API (Bearer Token)
POST /otp-confirmation
Memverifikasi user baru
Venues
GET /venues
List semua venue/tempat booking olahraga
POST /venues
Mendaftarkan venue baru
GET /venues/:id
Detail venue dan jadwal booking pada tanggal tertentu (default hari ini)
POST /venues/:id/bookings
Membuat jadwal booking di venue untuk tanggal tertentu 
PUT/PATCH
/venue/:id
Mengubah data venue
Bookings
GET /bookings
Menampilkan list booking semuanya
GET /bookings/:id
Menampilkan detail booking dengan id tertentu beseta list pemain yang sudah mendaftar.
PUT /bookings/:id/join
Mendaftarkan diri untuk jadwal booking tertentu
PUT /bookings/:id/unjoin
Tidak jadi mengikuti jadwal booking tertentu
GET /schedules
Menampilkan list booking yang diikuti oleh user yang sedang melakukan login

Contoh ERD

Referensi (contoh) Dokumentasi API
Contoh Dokumentasi API Main Bersama bisa dilihat di : link berikut https://sanbercode-mobile.gitbook.io/mobile-app-development/challenges/intensive/api-main-bersama

