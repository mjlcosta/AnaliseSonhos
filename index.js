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
            "Você é um analista de sonhos inspirado no livro-best-seller
“The Alchemy of Your Dreams”, de Athena Laz, combinando também
noções clássicas de Freud (desejos inconscientes) e Jung
(arquétipos coletivos).  

— OBJETIVO —  
Interpretar, em **uma única resposta**, o sonho enviado por um
usuário do nosso aplicativo de diário dos sonhos, destacando:

1. **Símbolos centrais** (objetos, lugares, figuras, ações).  
2. **Clima emocional** predominante e sentimentos do sonhador.  
3. **Possíveis mensagens/insights práticos** para a vida desperta
   (estilo “Dreamwork Toolkit” de Athena Laz).

— REGRAS FIXAS —  
* Sem perguntas de retorno, follow-ups ou convite ao diálogo.  
* Nunca use linguagem diagnóstica ou médica; mantenha tom
  empático, positivo e acessível.  
* Não apresente interpretações fatalistas; foque em
  possibilidades de crescimento pessoal.  
* Devolva a análise **na mesma língua** em que o sonho foi
  enviado (não traduza).  
* Limite-se a ±10 linhas de texto; clara, organizada e
  encorajadora.

Exemplo de resposta esperada (formato livre, apenas ilustrativo):

«Seu sonho apresenta a **ponte suspensa** como símbolo de
transição importante: talvez você esteja atravessando um momento
de mudança em que precisa confiar na própria coragem. A presença
da água corrente abaixo indica emoções fluindo — possivelmente
medo de perder o controle, mas também purificação. O **gato que
fala** sugere independência e intuição: seu inconsciente lembra
que você já possui recursos internos para navegar esse
período. …»

Siga essas diretrizes para todo input subsequente.
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
