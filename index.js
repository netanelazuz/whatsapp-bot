// index.js
const { Client, LocalAuth } = require('whatsapp-web.js');
const TelegramBot = require('node-telegram-bot-api');
const QRCode = require('qrcode');
const path = require('path');
const express = require('express');

// ====== Environment Variables ======
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_IDS = process.env.TELEGRAM_CHAT_IDS
  ? process.env.TELEGRAM_CHAT_IDS.split(',')
  : [];

// ====== Telegram Bot ======
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

// ====== WhatsApp Client ======
const client = new Client({
  authStrategy: new LocalAuth({ dataPath: path.resolve('./whatsapp-session') }),
  puppeteer: {
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
  }
});


// ====== QR Code → שולח כ-Image ל-Telegram ======
client.on('qr', async (qr) => {
  try {
    const qrImage = await QRCode.toBuffer(qr, { type: 'png', width: 300 });
    TELEGRAM_CHAT_IDS.forEach((id) => {
      bot.sendPhoto(id, qrImage, {
        caption: '📱 סרוק את ה-QR הזה כדי להתחבר ל-WhatsApp',
      });
    });
  } catch (err) {
    console.error('שגיאה ביצירת QR:', err);
  }
});

// ====== Ready ======
client.on('ready', () => console.log('✅ WhatsApp Bot מוכן'));

// ====== הודעות נכנסות מ-WhatsApp ======
client.on('message', (message) => {
  TELEGRAM_CHAT_IDS.forEach((id) => {
    bot.sendMessage(
      id,
      `📩 הודעת WhatsApp חדשה מ-${message.from}:\n${message.body}`
    );
  });
});

// ====== התחלת הלקוח ======
client.initialize();

// ====== Express Server ======
const PORT = process.env.PORT || 3000;
const app = express();

// Middleware JSON (חובה לפני ה־routes)
app.use(express.json());

// Route ראשי
app.get('/', (req, res) => res.send('WhatsApp bot running ✅'));

app.post('/incoming-sms', (req, res) => {
  const { from, message } = req.body;
  if (!from || !message) {
    return res.status(400).json({ success: false, error: 'Missing "from" or "message"' });
  }

  TELEGRAM_CHAT_IDS.forEach((id) => {
    bot.sendMessage(id, `📩 SMS חדש מ-${from}:\n${message}`);
  });

  // במקום res.send('OK');
  res.json({ success: true, status: "SMS forwarded to Telegram" });
});


// ====== הפעלת השרת ======
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
