# 🎮 StartNews Mobile

StartNews Mobile adalah **aplikasi mobile berita games** yang dibangun dengan **React Native** dan **Firebase**.  
Aplikasi ini menghadirkan pengalaman membaca berita yang modern dengan fitur otentikasi, kategori berita, artikel, video, dan pencarian.

---

## ✨ Fitur

- 🔑 **Authentication** – Login & registrasi dengan Firebase.  
- 📂 **Categories** – Menampilkan berita berdasarkan kategori.  
- 📰 **Articles** – CRUD artikel (create, read, update, delete).  
- 🎥 **Videos** – Integrasi video YouTube untuk konten gaming.  
- 📊 **Dashboard** – Kelola konten berita & video dengan mudah.  
- 🔍 **Search** – Cari artikel dan video berdasarkan kata kunci.  

---

## 🛠️ Tech Stack

- **React Native** – Framework utama untuk aplikasi mobile  
- **Firebase** – Digunakan untuk authentication, database, dan storage  
- **YouTube API** – Untuk menampilkan video berita game  

---

## 🚀 Instalasi & Setup

1. **Clone repository**
   ```bash
   git clone https://github.com/MR-Munggaran/startnews-mobile.git
   cd startnews-mobile```
2. **Install dependencies**
npm install
# atau
yarn install
4. **Konfigurasi Firebase**
Buat project di Firebase Console
.

Tambahkan konfigurasi Firebase di file firebaseConfig.js:
```bash
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};```
5. **Jalankan aplikasi**
```bash
npx react-native run-android
# atau
npx react-native run-ios
```
## 🤝 Kontribusi

Kontribusi sangat terbuka!
Silakan fork repository ini dan ajukan pull request untuk perbaikan atau penambahan fitur.


⚡ Saran: kamu bisa bikin folder `assets/screenshots/` untuk menaruh screenshot aplikasi supaya README lebih menarik.  

Mau saya tambahin **badge GitHub** (misalnya status build, stars, atau teknologi yang dipakai) biar README kamu lebih keren?

