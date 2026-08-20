const express = require('express');
const router = express.Router();
const validateChatInput = require('../middlewares/validateChatInput.middleware');
const { chat, getHistory } = require('../controllers/chat.controller');

// endpoint public, user gak perlu login buat nanya ke CS bot
router.post('/', validateChatInput, chat);

// endpoint public buat liat lagi riwayat percakapan yang udah tersimpan
// (cuma ada isinya kalau sebelumnya user setuju saveHistory: true)
router.get('/history/:sessionId', getHistory);

module.exports = router;
