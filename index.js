const { Client, LocalAuth } = require('whatsapp-web.js');
const TelegramBot = require('node-telegram-bot-api');
const qrcode = require('qrcode-terminal');
const path = require('path');
const express = require('express');

// ====== Environment Variables ======
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_IDS = process.env.TELEGRAM_CHAT_IDS ? process.env.TELEGRAM_CHAT_IDS.split(',') : [];

// ====== Telegram Bot ======
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

// ====== WhatsApp Client ======
const client = new Client({
    authStrategy: new LocalAuth({ dataPath: path.resolve('./whatsapp-session') }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
        ]
    }
});

// QR code
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('📱 סרוק את הקוד הזה עם WhatsApp בטלפון שלך:');
});

// Ready
client.on('ready', () => {
    console.log('✅ WhatsApp Bot מוכן');
});

// הודעות
client.on('message', message => {
    console.log(`📩 הודעה מ-${message.from}: ${message.body}`);
    TELEGRAM_CHAT_IDS.forEach(id => bot.sendMessage(id, `📩 הודעת WhatsApp חדשה מ-${message.from}:\n${message.body}`));
});

// Initialize
client.initialize();

// ====== Dummy HTTP server ל-Render ======
const PORT = process.env.PORT || 3000;
const app = express();
app.get('/', (req, res) => res.send('WhatsApp bot running ✅'));
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
