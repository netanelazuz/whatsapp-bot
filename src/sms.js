import express from "express";
import { sendToTelegram } from "./bot.js";

export const smsRouter = express.Router();

smsRouter.get("/", (req, res) => {
  const { source, target, text, text_utf8, sm_no } = req.query;

  const decodedText = decodeURIComponent(text_utf8 || text || "");

  const message = `📩 SMS\n#${sm_no}\nFrom: ${source}\nTo: ${target}\n\n${decodedText}`;
  sendToTelegram(message);

  // מחזירים תשובה ריקה (200 OK) → לא חוזר שום דבר ללקוח
  res.status(200).send("");
});
