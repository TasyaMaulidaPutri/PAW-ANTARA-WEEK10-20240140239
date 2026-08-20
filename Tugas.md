# Tugas Week 10 — Message History (Chat with AI)

Nama : Tasya Maulida Putri
NIM  : 20240140239
Kelas: A

Fitur yang ditambahkan: **penyimpanan riwayat percakapan (message history)**
pada halaman *Chat with AI*, aktif hanya kalau user menyetujui (centang
consent "Simpan riwayat percakapan").

---

## 1. Apa yang ditambahkan

| Bagian | File | Keterangan |
|---|---|---|
| Model | `models/message.model.js` | Tabel `messages`: `sessionId`, `role` (`user`/`bot`), `content`, timestamps |
| Model | `models/index.js` | Registrasi model `Message` |
| Controller | `controllers/chat.controller.js` | `chat()` — simpan pesan kalau `saveHistory: true`; `getHistory()` — baca riwayat by `sessionId` |
| Route | `routes/chat.routes.js` | Tambah `GET /api/chat/history/:sessionId` |
| Tampilan | `public/index.html` | Halaman test Chat with AI (HTML + CSS + vanilla JS, tanpa framework) |
| Server | `app.js` | Tambah `express.static('public')` biar halaman testnya bisa diakses lewat browser |

Struktur dasar (`config/`, `middlewares/`, `auth`) **tidak diubah** sama sekali.

---

## 2. Kontrak API

### POST `/api/chat`
Kirim pesan ke bot. Riwayat percakapan **hanya disimpan** kalau `saveHistory: true`.

**Request body**
```json
{
  "message": "kaos polos ada warna apa aja dan harganya berapa?",
  "sessionId": null,
  "saveHistory": true
}
```

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `message` | string | ya | Pertanyaan user ke bot |
| `sessionId` | string \| null | tidak | ID percakapan. Kosongkan di pesan pertama; server akan generate otomatis |
| `saveHistory` | boolean | tidak (default `false`) | `true` = user setuju riwayatnya disimpan ke database |

**Response 200**
```json
{
  "code": 200,
  "success": true,
  "message": "Berhasil dapat balasan",
  "data": {
    "reply": "Halo kak! Kaos Polos Cotton Combed kami tersedia dengan harga Rp75.000...",
    "sessionId": "b6e2a3f0-7c4e-4e2a-9d31-4a8f2e0c9b7d",
    "historySaved": true
  }
}
```

> Kalau `saveHistory` tidak dikirim / `false`, maka `data.sessionId` bernilai
> `null` dan `data.historySaved` bernilai `false` — **tidak ada baris yang
> ditulis ke database**.

---

### GET `/api/chat/history/:sessionId`
Nampilin kembali riwayat percakapan yang sebelumnya disimpan.

**Contoh request**
```
GET /api/chat/history/b6e2a3f0-7c4e-4e2a-9d31-4a8f2e0c9b7d
```

**Response 200**
```json
{
  "code": 200,
  "success": true,
  "message": "Berhasil ambil riwayat percakapan",
  "data": [
    {
      "id": 1,
      "sessionId": "b6e2a3f0-7c4e-4e2a-9d31-4a8f2e0c9b7d",
      "role": "user",
      "content": "kaos polos ada warna apa aja dan harganya berapa?",
      "createdAt": "2026-08-20T06:40:12.000Z",
      "updatedAt": "2026-08-20T06:40:12.000Z"
    },
    {
      "id": 2,
      "sessionId": "b6e2a3f0-7c4e-4e2a-9d31-4a8f2e0c9b7d",
      "role": "bot",
      "content": "Halo kak! Kaos Polos Cotton Combed kami tersedia dengan harga Rp75.000...",
      "createdAt": "2026-08-20T06:40:12.500Z",
      "updatedAt": "2026-08-20T06:40:12.500Z"
    }
  ]
}
```

**Response kalau `sessionId` gak ditemukan / kosong (200, `data: []`)**
```json
{
  "code": 200,
  "success": true,
  "message": "Riwayat percakapan tidak ditemukan atau masih kosong",
  "data": []
}
```

---

## 3. Tampilan

Halaman test dibuat pakai **HTML + CSS + vanilla JavaScript** (tanpa Tailwind/Bootstrap,
tanpa build step) dalam bentuk widget chat modern, dibungkus dengan brand toko
"Toko Kita". Diakses langsung di `http://localhost:3000` setelah server jalan.

### Sebelum ada percakapan
Checkbox consent belum dicentang, `No. Sesi` masih kosong karena belum ada
riwayat yang tersimpan.

![Tampilan awal, belum ada percakapan](docs/chat-empty-state.png)

### Setelah chat dengan consent aktif + riwayat dimuat ulang
User mencentang "Saya setuju riwayat percakapan ini disimpan", ngobrol dengan
bot, lalu klik **"Muat riwayat sesi ini"** untuk membuktikan data beneran
kesimpen di database dan bisa diambil lagi lewat endpoint `GET /api/chat/history/:sessionId`.

![Percakapan tersimpan dan riwayat berhasil dimuat ulang](docs/chat-with-history.png)

---

## 4. Cara menjalankan & mencoba fitur ini

1. `npm install`
2. Copy `.env.example` → `.env`, isi kredensial database + `GEMINI_API_KEY`
3. `npm run seed`
4. `npm run dev`
5. Buka `http://localhost:3000` di browser
6. Centang **"Saya setuju riwayat percakapan ini disimpan di server"**
7. Kirim beberapa pesan ke bot
8. Klik **"Muat riwayat sesi ini"** — riwayat yang tampil berarti berhasil
   diambil dari database lewat `GET /api/chat/history/:sessionId`
9. (Opsional) Klik **"Sesi baru"**, lalu kirim pesan **tanpa** centang consent
   → cek ke database, tidak ada baris baru yang tersimpan untuk sesi tersebut
