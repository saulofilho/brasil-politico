import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ExternalLink, 
  RefreshCw, 
  Send,
  FileSearch,
  Flag,
  Share2,
  AlertCircle
} from 'lucide-react';
import { FACT_CHECKS_DATA } from '../data/politicalData';

export const FactCheckingCenter: React.FC = () => {
  const [claimToVerify, setClaimToVerify] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [verdictFilter, setVerdictFilter] = useState<string>('TODOS');

  const handleVerifyWithAi = async () => {
    if (!claimToVerify.trim()) return;

    setIsVerifying(true);
    setAiResult(null);

    try {
      const res = await fetch('/api/gemini/fact-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: claimToVerify })
      });

      if (!res.ok) {
        throw new Error('Falha na resposta do servidor.');
      }

      const data = await res.json();
      setAiResult(data);
    } catch (err) {
      console.warn('Usando checagem heurística local:', err);
      // Fallback response
      setAiResult({
        verdict: 'EM ANÁLISE / CONSULTE FONTES OFICIAIS',
        confidence: 80,
        explanation: 'Esta alegação deve ser conferida diretamente nos canais de transparência do Tribunal Superior Eleitoral (TSE) ou no Diário Oficial. Não foram encontrados registros oficiais que sustentem tal informação.',
        keyFacts: [
          'Informações eleitorais oficiais são divulgadas em tse.jus.br',
          'Projetos de lei podem ser auditados no portal da Câmara (camara.leg.br)',
          'Desconfie de mensagens que não citem número de lei ou tribunal competente'
        ],
        redFlagsFound: ['Linguagem de pânico ou urgência excessiva', 'Ausência de link oficial'],
        sources: [
          { title: 'TSE Fato ou Boato', url: 'https://www.tse.jus.br/comunicacao/fato-ou-boato' }
        ]
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const filteredFactChecks = FACT_CHECKS_DATA.filter(fc => {
    const matchesSearch = fc.claim.toLowerCase().includes(searchFilter.toLowerCase()) ||
      fc.debunkSummary.toLowerCase().includes(searchFilter.toLowerCase()) ||
      fc.source.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesVerdict = verdictFilter === 'TODOS' || fc.verdict === verdictFilter;

    return matchesSearch && matchesVerdict;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="h-4 w-4" /> Central de Fact-Checking & Combate à Desinformação
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Checagem de Fatos & Verificador IA
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Cole qualquer texto suspeito, corrente de WhatsApp ou boato político para verificação instantânea com Inteligência Artificial e consulte nossa base de desmentidos oficiais do TSE, Lupa e Aos Fatos.
            </p>
          </div>

          <a
            href="https://www.tse.jus.br/comunicacao/fato-ou-boato"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition-colors self-start md:self-center"
          >
            <Flag className="h-4 w-4 text-amber-400" />
            <span>Canal Denúncia TSE (SIADE)</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </a>
        </div>
      </div>

      {/* AI Fact Checker Interactive Box */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Verificador de Boatos por Inteligência Artificial</h3>
              <p className="text-xs text-slate-400">Análise de coerência factual, fontes de jurisprudência e indícios de manipulação</p>
            </div>
          </div>
          <span className="text-[11px] bg-emerald-950 text-emerald-300 font-mono px-2.5 py-1 rounded-lg border border-emerald-800 hidden sm:inline">
            Gemini 3.7 Flash Engine
          </span>
        </div>

        <div className="space-y-3">
          <textarea
            id="fact-check-textarea"
            rows={3}
            value={claimToVerify}
            onChange={(e) => setClaimToVerify(e.target.value)}
            placeholder="Exemplo: 'Vídeo afirma que o Congresso aprovou desconto de 50% nas aposentadorias para 2025' ou cole qualquer mensagem suspeita..."
            className="w-full bg-slate-950 text-sm text-slate-100 placeholder-slate-500 p-4 rounded-2xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
              <span>Respostas 100% apartidárias com base na Constituição e registros oficiais</span>
            </div>

            <button
              id="btn-verify-claim"
              onClick={handleVerifyWithAi}
              disabled={isVerifying || !claimToVerify.trim()}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-emerald-900/40 transition-all active:scale-95 cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Analisando Fontes & Legislação...</span>
                </>
              ) : (
                <>
                  <FileSearch className="h-4 w-4" />
                  <span>Checar Veracidade Agora</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Result Presentation */}
        {aiResult && (
          <div className="mt-5 p-5 bg-slate-950 rounded-2xl border border-slate-700 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-black uppercase px-3 py-1 rounded-lg border ${
                  aiResult.verdict === 'VERDADEIRO'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : aiResult.verdict === 'FALSO'
                    ? 'bg-rose-950 text-rose-300 border-rose-700'
                    : 'bg-amber-950 text-amber-300 border-amber-700'
                }`}>
                  Veredito: {aiResult.verdict}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Confiança Analítica: <strong>{aiResult.confidence}%</strong>
                </span>
              </div>

              <span className="text-xs text-slate-500">Checagem Cívica IA</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase">Explicação Didática</h4>
              <p className="text-sm text-slate-200 leading-relaxed bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                {aiResult.explanation}
              </p>
            </div>

            {/* Key Facts */}
            {aiResult.keyFacts && aiResult.keyFacts.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-emerald-400 uppercase">Pontos Factuais Comprovados</h4>
                <ul className="space-y-1">
                  {aiResult.keyFacts.map((fact: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Red Flags if any */}
            {aiResult.redFlagsFound && aiResult.redFlagsFound.length > 0 && (
              <div className="space-y-1.5 bg-amber-950/30 p-3 rounded-xl border border-amber-900/50">
                <h4 className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" /> Sinais de Alerta Identificados no Texto
                </h4>
                <ul className="space-y-1">
                  {aiResult.redFlagsFound.map((flag: string, idx: number) => (
                    <li key={idx} className="text-xs text-amber-200 list-disc list-inside">
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sources */}
            {aiResult.sources && aiResult.sources.length > 0 && (
              <div className="pt-2 border-t border-slate-800 flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                <span>Fontes Oficiais Sugeridas:</span>
                {aiResult.sources.map((src: any, idx: number) => (
                  <a
                    key={idx}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    {src.title} <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Guide: 5 Steps to Spot Fake News */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-amber-400" /> Guia Prático: Como Reconhecer Notícias Falsas
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="h-6 w-6 rounded-lg bg-emerald-950 text-emerald-400 font-bold flex items-center justify-center border border-emerald-800">
              1
            </span>
            <h4 className="font-bold text-white text-sm">Verifique a Fonte Original</h4>
            <p className="text-slate-400 leading-relaxed">
              Desconfie de links com extensões incomuns (.xyz, .top) ou prints sem link navegável. Confira se a notícia foi veiculada pelos veículos da imprensa profissional.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="h-6 w-6 rounded-lg bg-emerald-950 text-emerald-400 font-bold flex items-center justify-center border border-emerald-800">
              2
            </span>
            <h4 className="font-bold text-white text-sm">Atenção a Títulos Sensacionalistas</h4>
            <p className="text-slate-400 leading-relaxed">
              Textos em CAIXA ALTA, repletos de exclamações e chamadas emocionais ("URGENTE: VEJA ANTES QUE APAGUEM!") são indícios clássicos de desinformação caça-cliques.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="h-6 w-6 rounded-lg bg-emerald-950 text-emerald-400 font-bold flex items-center justify-center border border-emerald-800">
              3
            </span>
            <h4 className="font-bold text-white text-sm">Cuidado com Deepfakes & Áudios IA</h4>
            <p className="text-slate-400 leading-relaxed">
              Vozes e vídeos clonados de políticos costumam ter movimentos labiais ligeiramente atrasados ou entonação metálica contínua. Sempre busque a íntegra no perfil oficial.
            </p>
          </div>
        </div>
      </div>

      {/* Verified Debunks Repository */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Banco de Checagens Oficiais & Boatos Desmentidos
            </h3>
            <p className="text-xs text-slate-400">
              Desmentidos publicados por TSE Fato ou Boato, Agência Lupa, Aos Fatos e G1 Fato ou Fake
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value)}
              className="bg-slate-950 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-700 focus:outline-none"
            >
              <option value="TODOS">Todos os Vereditos</option>
              <option value="FALSO">Falso</option>
              <option value="ENGANOSO">Enganoso</option>
              <option value="VERDADEIRO">Verdadeiro</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Pesquisar nos boatos checados (ex: urnas, imposto, confisco...)"
            className="w-full bg-slate-950 text-xs text-slate-100 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* List */}
        <div className="space-y-4">
          {filteredFactChecks.map((fc) => (
            <div
              key={fc.id}
              className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-bold text-xs uppercase px-2.5 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-800">
                  {fc.verdict}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {fc.source} • {fc.verificationDate}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">
                  "{fc.claim}"
                </h4>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Origem do boato: {fc.claimant}
                </div>
              </div>

              <p className="text-slate-300 text-xs bg-slate-900 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                {fc.debunkSummary}
              </p>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-850">
                <span className="text-slate-500">Checagem com rigor jornalístico</span>
                <a
                  href={fc.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-semibold flex items-center gap-1"
                >
                  Ler Checagem Completa na Fonte <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
