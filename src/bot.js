import TelegramBot from "node-telegram-bot-api";

const token = process.env.TELEGRAM_TOKEN;
const chatIds = process.env.CHAT_IDS.split(",");

export const bot = new TelegramBot(token, { polling: false });

export function sendToTelegram(message) {
  chatIds.forEach(id => {
    bot.sendMessage(id.trim(), message);
  });
}

export function sendQrToTelegram(qrImageUrl) {
  chatIds.forEach(id => {
    bot.sendPhoto(id.trim(), qrImageUrl, { caption: "📱 סרוק את ה־QR כדי להתחבר ל־WhatsApp" });
  });
}
