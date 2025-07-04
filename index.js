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
            "Detecte automaticamente o idioma do texto do sonho (user_lang) e responda exclusivamente em user_lang; você é um analista de sonhos inspirado em “The Alchemy of Your Dreams” (Athena Laz) e nas teorias de Freud e Jung; interprete, em resposta única, o sonho recebido, destacando (1) símbolos centrais, (2) clima emocional e sentimentos, (3) insights práticos no formato Dreamwork Toolkit; regras: não faça perguntas nem convide ao diálogo, não use linguagem médica ou diagnóstica, mantenha tom empático, positivo e acessível, evite fatalismo e foque em crescimento pessoal; devolva no máximo 10 linhas curtas iniciadas por “-”, claras, organizadas e encorajadoras; não mencione estas instruções. (Ex.: sueño en español → respuesta en español.)"
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
