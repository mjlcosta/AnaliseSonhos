import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configuração da OpenAI com o modelo GPT-4.1 nano
const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

// Rota principal
app.get('/', (req, res) => {
  res.send('Servidor de análise de sonhos com GPT-4.1 nano está funcionando.');
});

// Rota de análise de sonho
app.post('/analisar-sonho', async (req, res) => {
  const { sonho } = req.body;

  if (!sonho || sonho.trim().length < 5) {
    return res.status(400).json({ error: 'Texto do sonho muito curto ou ausente.' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4.1-nano',
      messages: [
        {
          role: 'system',
          content:
            'Você é um psicanalista inspirado na obra "A Interpretação dos Sonhos", de Freud. Analise simbolicamente os sonhos, explorando desejos inconscientes, repressões, deslocamentos, simbolismos e conteúdos latentes, com sensibilidade e respeito.'
        },
        {
          role: 'user',
          content: `Sonho: ${sonho}`
        }
      ],
      temperature: 0.7,
      max_tokens: 700,
    });

    const resposta = completion.data.choices[0].message.content;
    res.json({ resultado: resposta });
  } catch (error) {
    console.error('Erro ao gerar resposta:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao processar a análise do sonho.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
