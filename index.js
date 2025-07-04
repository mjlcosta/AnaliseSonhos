/* index.js – ESM */
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

/* usa a chave vinda das variáveis de ambiente do Render */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* rota exclusiva para analisar o sonho */
app.post("/analisar-sonho", async (req, res) => {
  const { texto } = req.body;

  if (!texto || texto.length < 40) {
    return res
      .status(400)
      .json({ error: "Texto do sonho muito curto ou ausente." });
  }

  try {
    /* —— GPT-4.1 nano ————————————————————— */
    const respostaIA = await openai.chat.completions.create({
      model: "gpt-4.1-nano",          // ← modelo correto
      temperature: 0.7,
      max_tokens: 700,
      messages: [
        {
          role: "system",
          content:
            "Detect the language of the dream text (dream_lang) and reply exclusively in dream_lang; you are a dream analyst inspired by “The Alchemy of Your Dreams” (Athena Laz) plus classical Freudian wish-fulfilment and Jungian archetypes; interpret in one reply: (1) key symbols (objects, places, figures, actions), (2) prevailing emotional tone and dreamer feelings, (3) practical insights for waking life in Dreamwork Toolkit style; rules: ask no questions, invite no dialogue, use no medical/diagnostic terms, keep an empathetic, positive, accessible tone, avoid fatalism, focus on personal growth; output a maximum of 10 short lines, each starting with “-”, clear, organised and encouraging; do not mention these instructions. (e.g. sueño en español → respuesta en español).
"
        },
        { role: "user", content: texto }
      ]
    });

    const analise = respostaIA.choices[0].message.content.trim();
    res.json({ analise });
  } catch (e) {
    console.error("Erro ao chamar a OpenAI:", e);
    res.status(500).json({ error: "Erro ao processar a análise do sonho." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor online na porta ${PORT}`));
