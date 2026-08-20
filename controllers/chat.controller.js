const crypto = require('crypto');
const { askGemini } = require('../services/gemini.service');
const { Message } = require('../models');
const sendResponse = require('../utils/response');

/**
 * POST /api/chat
 * Kirim pesan ke bot. Kalau user setuju nyimpen riwayat percakapan
 * (`saveHistory: true` di body), pesan user & balasan bot bakal
 * disimpan ke database, dikelompokin pake `sessionId`.
 *
 * Kalau `sessionId` gak dikirim tapi `saveHistory` true, server bakal
 * bikinin sessionId baru (percakapan baru) dan ngembaliin di response
 * biar dipake lagi buat request-request selanjutnya (multi-turn).
 */
async function chat(req, res) {
  try {
    const { message, sessionId, saveHistory } = req.body;
    const wantsToSaveHistory = saveHistory === true;

    const reply = await askGemini(message);

    let currentSessionId = sessionId || null;

    // Fitur riwayat percakapan HANYA aktif kalau user menyetujui
    if (wantsToSaveHistory) {
      if (!currentSessionId) {
        currentSessionId = crypto.randomUUID();
      }

      await Message.bulkCreate([
        { sessionId: currentSessionId, role: 'user', content: message },
        { sessionId: currentSessionId, role: 'bot', content: reply },
      ]);
    }

    return sendResponse(res, {
      message: 'Berhasil dapat balasan',
      data: {
        reply,
        sessionId: wantsToSaveHistory ? currentSessionId : null,
        historySaved: wantsToSaveHistory,
      },
    });
  } catch (err) {
    console.error('Gemini error:', err.message);
    return sendResponse(res, {
      code: 500,
      success: false,
      message: 'Gagal menghubungi AI, coba lagi nanti',
    });
  }
}

/**
 * GET /api/chat/history/:sessionId
 * Nampilin kembali riwayat percakapan (yang sebelumnya disimpan
 * karena user setuju) berdasarkan sessionId, urut dari yang paling lama.
 */
async function getHistory(req, res) {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return sendResponse(res, {
        code: 400,
        success: false,
        message: 'sessionId wajib diisi',
      });
    }

    const messages = await Message.findAll({
      where: { sessionId },
      order: [['createdAt', 'ASC']],
    });

    return sendResponse(res, {
      code: 200,
      message: messages.length
        ? 'Berhasil ambil riwayat percakapan'
        : 'Riwayat percakapan tidak ditemukan atau masih kosong',
      data: messages,
    });
  } catch (err) {
    return sendResponse(res, { code: 500, success: false, message: err.message });
  }
}

module.exports = { chat, getHistory };
