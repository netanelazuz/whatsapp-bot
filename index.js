// index.js
const { Client, LocalAuth } = require('whatsapp-web.js');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');

// בתוך client.on('qr', ...) נוסיף:
const qrcode = require('qrcode-terminal');
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('📱 סרוק את הקוד הזה עם WhatsApp בטלפון שלך:');
});

// ====== הגדרות מ-Environment Variables ======
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_IDS = process.env.TELEGRAM_CHAT_IDS ? process.env.TELEGRAM_CHAT_IDS.split(',') : [];

// יצירת בוט טלגרם
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

// יצירת לקוח WhatsApp
const client = new Client({
    authStrategy: new LocalAuth({
        // Render Free Disk
        dataPath: path.resolve('./whatsapp-session')
    }),
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

// התחברות
client.on('ready', () => {
    console.log('✅ WhatsApp Bot מוכן');
});

// קבלת הודעות חדשות
client.on('message', message => {
    console.log(`📩 הודעה מ-${message.from}: ${me
