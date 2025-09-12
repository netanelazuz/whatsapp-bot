import express from "express";
import { startWhatsApp } from "./whatsapp.js";
import { smsRouter } from "./sms.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/sms", smsRouter);

app.get("/", (req, res) => res.send("🚀 WhatsApp + SMS Bridge is running"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startWhatsApp();
});
