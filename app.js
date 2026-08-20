require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { sequelize } = require('./models');

const adminRoutes = require('./routes/admin.routes');
const productRoutes = require('./routes/product.routes');
const chatRoutes = require('./routes/chat.routes');

const app = express();

app.use(express.json());
app.use(express.static('public')); // buat nyajiin halaman test Chat with AI (public/index.html)

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret-default',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 hari
      httpOnly: true,
    },
  })
);

app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'CS Bot API jalan bre 🤖' });
});

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Koneksi database berhasil');

    await sequelize.sync();
    console.log('Sync model selesai');

    app.listen(PORT, () => {
      console.log(`Server jalan di http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Gagal konek ke database:', err.message);
  }
}

start();
