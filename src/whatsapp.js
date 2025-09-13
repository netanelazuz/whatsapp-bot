import qrcodeTerminal from "qrcode-terminal";
import QRCode from "qrcode";
import pkg from "whatsapp-web.js";
import { sendToTelegram, sendQrPngToTelegram } from "./bot.js";

const { Client, LocalAuth } = pkg;

// If you’re on Render, keeping these flags is helpful:
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

client.on("qr", async (qr) => {
  // Optional: still show in terminal (useful for local dev)
  qrcodeTerminal.generate(qr, { small: true });

  try {
    // Create a PNG buffer from the QR string
    const pngBuffer = await QRCode.toBuffer(qr, {
      type: "png",
      width: 512,            // nice and crisp
      errorCorrectionLevel: "M"
    });

    // Send the PNG directly to Telegram
    sendQrPngToTelegram(pngBuffer, "📱 סרקו כדי להתחבר ל־WhatsApp");
  } catch (err) {
    sendToTelegram(`⚠️ Failed to generate/send QR PNG: ${err.message}`);
  }
});

client.on("ready", () => {
  sendToTelegram("✅ WhatsApp מחובר ומוכן!");
});

client.on("message", (msg) => {
  console.log("📥 Incoming WhatsApp message:", msg);
  const from = msg.from;
  const text = msg.body || "<no text>";
  const forward = `💬 WhatsApp\nFrom: ${from}\n\n${text}`;
  sendToTelegram(forward);
});

export function startWhatsApp() {
  client.initialize();
}
