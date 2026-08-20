# Tugas Week 10 — Message History (Chat with AI)

Nama : _(isi nama kamu)_
NIM  : _(isi NIM kamu)_
Kelas: _(A/B)_

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

**Bukti testing di Thunder Client**
<img width="1394" height="977" alt="Screenshot 2026-08-20 150419" src="https://github.com/user-attachments/assets/32134afd-6027-4572-b06e-bbf2eb8312ae" />

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

**Bukti testing di Thunder Client**
<img width="1413" height="993" alt="image" src="https://github.com/user-attachments/assets/74132d39-b235-458f-9023-59ece2c9d3e7" />

<img width="1401" height="999" alt="image" src="https://github.com/user-attachments/assets/d9f5146d-09ca-4d2c-a8a6-cf833159e537" />

---

## Endpoint

### Admin

| Method | Endpoint | Body | Keterangan |
|---|---|---|---|
| POST | `/api/admin/login` | `{ username, password }` | Login admin (session) |
| POST | `/api/admin/logout` | - | Logout |

> Catatan: sengaja **tidak ada endpoint public buat register admin**. Admin dibikin lewat
> `npm run seed` aja. Ini contoh prinsip keamanan: jangan expose kemampuan bikin akun
> privileged ke publik.

**Bukti testing di Thunder Client**
> Login
<img width="1916" height="1010" alt="Screenshot 2026-08-20 152607" src="https://github.com/user-attachments/assets/db560053-14d7-4601-83b5-6e582262d7cb" />

>Logout
<img width="1904" height="1000" alt="Screenshot 2026-08-20 152652" src="https://github.com/user-attachments/assets/02a55a9c-5820-4c10-9d09-7011b32c3b0f" />


### Product

| Method | Endpoint | Auth | Body | Keterangan |
|---|---|---|---|---|
| GET | `/api/products` | publik | - | List semua produk |
| POST | `/api/products` | admin | `{ name, description, price, stock }` | Tambah produk |
| PUT | `/api/products/:id` | admin | `{ name?, description?, price?, stock? }` | Update produk |
| DELETE | `/api/products/:id` | admin | - | Hapus produk |

**Bukti testing di Thunder Client**
>GET
<img width="1413" height="989" alt="image" src="https://github.com/user-attachments/assets/b72a4dbd-de59-418e-85aa-2a54be897632" />

>POST
<img width="1919" height="1001" alt="Screenshot 2026-08-20 152929" src="https://github.com/user-attachments/assets/338465b8-c234-4167-aee3-c9544793458b" />

>PUT
<img width="1903" height="1005" alt="Screenshot 2026-08-20 153011" src="https://github.com/user-attachments/assets/5d341990-f9aa-46de-bf43-e28aee861010" />

>DELETE
<img width="1908" height="1011" alt="Screenshot 2026-08-20 153024" src="https://github.com/user-attachments/assets/16f9b5c4-a136-4904-9beb-8e3d9d6de532" />


### Chat (CS Bot)

| Method | Endpoint | Auth | Body | Keterangan |
|---|---|---|---|---|
| POST | `/api/chat` | publik | `{ message }` | Kirim pertanyaan ke bot |

Contoh request:
```
POST /api/chat
{ "message": "kaos polos ada warna apa aja dan harganya berapa?" }
```

Contoh kalo user coba keluar konteks:
```
POST /api/chat
{ "message": "buatin saya kode HTML buat landing page dong" }
```

Bot bakal nolak dan ngarahin balik ke topik produk — ini yang kejadian karena aturan
di `services/gemini.service.js` (`buildSystemInstruction`).

**Bukti testing di Thunder Client**
>Pertanyaan sesuai dgn konteks
<img width="1394" height="977" alt="Screenshot 2026-08-20 150419" src="https://github.com/user-attachments/assets/cbb669e1-8be0-4fa0-aec0-efa389bdce1f" />

>Pertanyaan diluar konteks
<img width="1397" height="959" alt="image" src="https://github.com/user-attachments/assets/341647e7-5fc8-4137-a26f-8ee02ba985d9" />

---

## 3. Tampilan

Halaman test dibuat pakai **HTML + CSS + vanilla JavaScript** (tanpa Tailwind/Bootstrap,
tanpa build step) dalam bentuk widget chat modern, dibungkus dengan brand toko
"Toko Kita". Diakses langsung di `http://localhost:3000` setelah server jalan.

### Sebelum ada percakapan
Checkbox consent belum dicentang, `No. Sesi` masih kosong karena belum ada
riwayat yang tersimpan.

<img width="1904" height="951" alt="image" src="https://github.com/user-attachments/assets/1ff35bf2-1645-4e2b-aff0-8d43f6ac520d" />


### Setelah chat dengan consent aktif + riwayat dimuat ulang
User mencentang "Saya setuju riwayat percakapan ini disimpan", ngobrol dengan
bot, lalu klik **"Muat riwayat sesi ini"** untuk membuktikan data beneran
kesimpen di database dan bisa diambil lagi lewat endpoint `GET /api/chat/history/:sessionId`.

<img width="1916" height="955" alt="image" src="https://github.com/user-attachments/assets/00944938-8f7b-4cd3-8b5d-8a055f704eae" />

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
