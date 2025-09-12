import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
import { sendToTelegram, sendQrToTelegram } from "./bot.js";

const { Client, LocalAuth } = pkg;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-zygote",
      "--single-process"
    ]
  }
});


client.on("qr", qr => {
  qrcode.generate(qr, { small: true });
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr)}`;
  sendQrToTelegram(qrUrl);
});

client.on("ready", () => {
  sendToTelegram("✅ WhatsApp מחובר ומוכן!");
});

client.on("message", msg => {
  const from = msg.from;
  const text = msg.body;
  const forward = `💬 WhatsApp\nFrom: ${from}\n\n${text}`;
  sendToTelegram(forward);
});

export function startWhatsApp() {
  client.initialize();
}
