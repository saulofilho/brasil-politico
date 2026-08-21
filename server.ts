import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY environment variable is not set. AI features will use client-side fallback.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      geminiConfigured: !!process.env.GEMINI_API_KEY
    });
  });

  // 1. AI Fact-Checking Endpoint with Google Search Grounding & Structured Rubric
  app.post('/api/gemini/fact-check', async (req, res) => {
    try {
      const { text, contextUrl } = req.body;
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Texto para checagem é obrigatório.' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        // Return structured neutral fallback if no key
        return res.json({
          claim: text,
          verdict: 'EM ANÁLISE / CONSULTE FONTES OFICIAIS',
          confidence: 75,
          explanation: 'Para verificar essa informação em detalhes, consulte o portal do Tribunal Superior Eleitoral (TSE Fato ou Boato), Agência Lupa ou Aos Fatos. Sempre desconfie de mensagens alarmistas ou sem link para o Diário Oficial.',
          sources: [
            { title: 'TSE Fato ou Boato', url: 'https://www.tse.jus.br/comunicacao/fato-ou-boato' },
            { title: 'Portal da Câmara dos Deputados', url: 'https://www.camara.leg.br' }
          ],
          redFlagsFound: ['Linguagem alarmista', 'Ausência de número de processo ou lei citada']
        });
      }

      const prompt = `Você é um verificador de fatos sênior e imparcial especializado em política brasileira, eleições, legislação e combate a fake news (no padrão de agências como Lupa, Aos Fatos e TSE Fato ou Boato).
Analise com rigor factual, imparcialidade e neutralidade a seguinte alegação ou notícia viral:

ALEGAÇÃO A VERIFICAR:
"${text}"
${contextUrl ? `URL CITADA: ${contextUrl}` : ''}

Responda em formato JSON rigorosamente estruturado com:
- verdict: exatamente um de ["VERDADEIRO", "FALSO", "ENGANOSO", "FORA DE CONTEXTO", "SEM PROVAS"]
- confidence: número de 0 a 100
- explanation: explicação clara, didática, acessível ao cidadão comum brasileiro, citando a legislação vigente, dados do TSE, STF, Câmara ou Senado se aplicável.
- keyFacts: lista de 2 a 4 pontos factuais comprovados.
- redFlagsFound: lista de indícios de desinformação encontrados (ex: ausência de fonte, manipulação temporal, deepfake, etc.), se houver.
- sources: lista de objetos { "title": string, "url": string } com sugestões de órgãos oficiais para conferência.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction: 'Você é um assistente de checagem cívica estritamente apartidário e factual no contexto das leis e instituições brasileiras.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              verdict: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              explanation: { type: Type.STRING },
              keyFacts: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              redFlagsFound: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              sources: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    url: { type: Type.STRING }
                  }
                }
              }
            },
            required: ['verdict', 'confidence', 'explanation', 'keyFacts']
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json(parsed);
    } catch (err: any) {
      console.error('Erro na checagem com Gemini:', err);
      res.status(500).json({ error: 'Falha ao processar checagem via IA.', details: err?.message });
    }
  });

  // 2. AI Legislation Summarizer & Impact Analysis
  app.post('/api/gemini/analyze-law', async (req, res) => {
    try {
      const { lawCode, title, rawDescription } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          lawCode: lawCode || 'Projeto de Lei',
          plainSummary: `Este projeto legislativo aborda ${title || 'temas de interesse público'}. A proposta busca alterar normas vigentes no Congresso Nacional.`,
          pros: [
            'Maior regulamentação e clareza de direitos',
            'Modernização de dispositivos legais'
          ],
          cons: [
            'Exigência de adaptação orçamentária ou administrativa',
            'Debate entre diferentes setores da sociedade'
          ],
          citizenImpact: 'Impacta diretamente os serviços públicos e as garantias do cidadão.',
          constitutionalContext: 'Artigos pertinentes da Constituição Federal de 1988.'
        });
      }

      const prompt = `Analise a seguinte proposição legislativa do Congresso Nacional Brasileiro de forma neutra, acessível e objetiva:
CÓDIGO: ${lawCode}
TÍTULO: ${title}
DESCRIÇÃO: ${rawDescription}

Forneça:
1. plainSummary: resumo em linguagem simples (máx 3 parágrafos) para o cidadão entender sem 'juridiquês'.
2. pros: 3 principais argumentos a favor defendidos pelos apoiadores.
3. cons: 3 principais argumentos contrários levantados pelos opositores.
4. citizenImpact: como isso muda na prática a vida diária do cidadão comum.
5. constitutionalContext: fundamentação constitucional (artigos relevantes da CF/88).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              plainSummary: { type: Type.STRING },
              pros: { type: Type.ARRAY, items: { type: Type.STRING } },
              cons: { type: Type.ARRAY, items: { type: Type.STRING } },
              citizenImpact: { type: Type.STRING },
              constitutionalContext: { type: Type.STRING }
            },
            required: ['plainSummary', 'pros', 'cons', 'citizenImpact']
          }
        }
      });

      res.json(JSON.parse(response.text || '{}'));
    } catch (err: any) {
      console.error('Erro na análise de lei com Gemini:', err);
      res.status(500).json({ error: 'Erro ao gerar análise legislativa.' });
    }
  });

  // 3. AI Civic Advisor & Elections Q&A
  app.post('/api/gemini/civic-advisor', async (req, res) => {
    try {
      const { question, history } = req.body;
      if (!question) {
        return res.status(400).json({ error: 'Pergunta obrigatória.' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          answer: 'O sistema eleitoral brasileiro é regulamentado pela Constituição de 1988 e pelo Código Eleitoral (Lei 4.737/1965). O voto é obrigatório para alfabetizados entre 18 e 70 anos e facultativo para jovens de 16 e 17 anos, analfabetos e maiores de 70 anos. Para consultar sua situação eleitoral, acesse o app e-Título ou tse.jus.br.',
          suggestedFollowUps: [
            'Como funciona o quociente eleitoral para deputados?',
            'O que é a Lei da Ficha Limpa (LC 135/2010)?',
            'Como justificar o voto se eu estiver fora do domicílio?'
          ]
        });
      }

      const prompt = `Você é o "Assistente Cívico Brasil", um consultor neutro, enciclopédico e educativo sobre o sistema político e eleitoral brasileiro (Constituição de 1988, TSE, Câmara, Senado, STF, partidos e regras de votação).
Responda de forma didática, respeitosa e rigorosamente imparcial.
Pergunta do cidadão: "${question}"

Formate a resposta em JSON com:
- answer: texto com a resposta completa e clara (pode usar tópicos se ajudar na leitura).
- officialReferences: lista de leis ou links oficiais de referência (ex: CF/88 Art. 14, Lei da Ficha Limpa, etc.).
- suggestedFollowUps: 3 perguntas correlatas interessantes para o cidadão continuar aprendendo.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              answer: { type: Type.STRING },
              officialReferences: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestedFollowUps: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['answer', 'suggestedFollowUps']
          }
        }
      });

      res.json(JSON.parse(response.text || '{}'));
    } catch (err: any) {
      console.error('Erro no assistente cívico:', err);
      res.status(500).json({ error: 'Erro no processamento da consulta cívica.' });
    }
  });

  // 4. Candidate & Party Comparator
  app.post('/api/gemini/compare', async (req, res) => {
    try {
      const { itemA, itemB, comparisonType } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          summary: `Comparativo entre ${itemA?.name || 'Opção A'} e ${itemB?.name || 'Opção B'}. Ambos possuem atuações no cenário político com diferentes diretrizes programáticas.`,
          keyDifferences: [
            'Posicionamento no espectro partidário',
            'Histórico de votos em matérias econômicas e sociais',
            'Prioridades regionais e de bancada'
          ],
          neutralObservation: 'Recomenda-se ao eleitor verificar os relatórios de presença no Congresso e o plano de governo registrado no TSE.'
        });
      }

      const prompt = `Realize uma comparação neutra, equilibrada e 100% apartidária entre:
TIPO: ${comparisonType || 'políticos'}
A: ${JSON.stringify(itemA)}
B: ${JSON.stringify(itemB)}

Responda em JSON com:
- summary: síntese comparativa destacando trajetórias, espectro político e focos de atuação.
- keyDifferences: lista com 3 a 5 diferenças fundamentais de propostas e posicionamentos.
- commonPoints: 2 a 3 pontos em comum ou matérias em que já convergiram.
- voterConsiderations: reflexões neutras para o eleitor considerar ao analisar ambos.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              keyDifferences: { type: Type.ARRAY, items: { type: Type.STRING } },
              commonPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
              voterConsiderations: { type: Type.STRING }
            },
            required: ['summary', 'keyDifferences', 'voterConsiderations']
          }
        }
      });

      res.json(JSON.parse(response.text || '{}'));
    } catch (err: any) {
      console.error('Erro na comparação com Gemini:', err);
      res.status(500).json({ error: 'Erro ao gerar comparativo.' });
    }
  });

  // Vite middleware in dev or static files in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Brasil Político Server rodando na porta ${PORT} (0.0.0.0)`);
  });
}

startServer().catch((err) => {
  console.error('Falha ao iniciar o servidor:', err);
});
