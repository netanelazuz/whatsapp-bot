import TelegramBot from "node-telegram-bot-api";

const token = process.env.TELEGRAM_TOKEN;
if (!token) {
  throw new Error("Missing TELEGRAM_TOKEN env variable");
}

const chatIds = process.env.CHAT_IDS ? process.env.CHAT_IDS.split(",") : [];
if (chatIds.length === 0) {
  console.warn("⚠️ No CHAT_IDS provided, Telegram forwarding will not work");
}

export const bot = new TelegramBot(token, { polling: false });

export function sendToTelegram(message) {
  chatIds.forEach(id => {
    if (id?.trim()) bot.sendMessage(id.trim(), message);
  });
}

// NEW: send QR as PNG buffer
export function sendQrPngToTelegram(pngBuffer, caption = "📱 Scan to link WhatsApp") {
  chatIds.forEach(id => {
    if (id?.trim()) bot.sendPhoto(id.trim(), pngBuffer, { caption });
  });
}
