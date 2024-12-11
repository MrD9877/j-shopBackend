import OpenAI from "openai";
import dotenv from "dotenv";
import { Router } from "express";
dotenv.config();
const router = Router();

const openAiClient = new OpenAI({
  organization: "org-xn2pcaNXbvl22q23fW1fxW3i",
  apiKey: process.env.OPENAI_API_KEY,
});
router.post("/openai", async (req, res) => {
  const data = req.body;
  const completeChat = await openAiClient.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `make a description of product with name: ${data.title},price:${data.price},colors:${data.colors},${data.suggestions && `key points:${data.suggestions}`} avoid using any other clothing name`,
      },
    ],
  });
  const reply = completeChat.choices[0].message;

  console.log(data);
  res.status(200).send({ description: reply.content });
});

export default router;
