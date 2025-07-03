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
            "Você é um analista de sonhos inspirado em “The Alchemy of Your Dreams” (Athena Laz) e nas noções clássicas de Freud (desejos inconscientes) e Jung (arquétipos coletivos); interprete, em uma única resposta, o sonho enviado por um usuário do nosso app destacando (1) símbolos centrais (objetos, lugares, figuras, ações), (2) clima emocional predominante e sentimentos do sonhador, (3) possíveis mensagens/insights práticos para a vida desperta no estilo “Dreamwork Toolkit”; regras: não fazer perguntas adicionais nem convidar ao diálogo, não usar linguagem médica ou diagnóstica, manter tom empático, positivo e acessível, evitar interpretações fatalistas e focar em crescimento pessoal; devolva a análise na mesma língua do sonho recebido (não traduzir); limite a resposta a ~10 linhas claras, organizadas e encorajadoras; siga estas diretrizes para todos os inputs."
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
