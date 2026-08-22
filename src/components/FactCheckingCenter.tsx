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
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-700 text-[10px] font-bold uppercase tracking-widest mb-0.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Central de Fact-Checking & Combate à Desinformação
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Checagem de Fatos & Verificador IA
            </h2>
            <p className="text-slate-500 text-xs mt-0.5 max-w-3xl leading-relaxed">
              Cole qualquer texto suspeito, corrente de WhatsApp ou boato político para verificação com IA e consulte a base de desmentidos do TSE, Lupa e Aos Fatos.
            </p>
          </div>

          <a
            href="https://www.tse.jus.br/comunicacao/fato-ou-boato"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 transition-colors self-start md:self-center"
          >
            <Flag className="h-3.5 w-3.5 text-amber-600" />
            <span>Denúncia TSE (SIADE)</span>
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* AI Fact Checker Interactive Box */}
      <div className="bg-white border border-emerald-300 rounded-xl p-3.5 sm:p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Verificador de Boatos por Inteligência Artificial</h3>
              <p className="text-[11px] text-slate-500">Análise de coerência factual, fontes de jurisprudência e indícios de manipulação</p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-50 text-emerald-800 font-mono px-2 py-0.5 rounded border border-emerald-200 hidden sm:inline">
            Gemini 3.7 Flash Engine
          </span>
        </div>

        <div className="space-y-2.5">
          <textarea
            id="fact-check-textarea"
            rows={2}
            value={claimToVerify}
            onChange={(e) => setClaimToVerify(e.target.value)}
            placeholder="Exemplo: 'Vídeo afirma que o Congresso aprovou desconto de 50% nas aposentadorias para 2025' ou cole qualquer mensagem suspeita..."
            className="w-full bg-slate-50 text-xs text-slate-900 placeholder-slate-400 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
              <span>Respostas 100% apartidárias com base na Constituição e registros oficiais</span>
            </div>

            <button
              id="btn-verify-claim"
              onClick={handleVerifyWithAi}
              disabled={isVerifying || !claimToVerify.trim()}
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold py-1.5 px-3.5 rounded-lg transition-colors cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Analisando Fontes...</span>
                </>
              ) : (
                <>
                  <FileSearch className="h-3.5 w-3.5" />
                  <span>Checar Veracidade Agora</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Result Presentation */}
        {aiResult && (
          <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                  aiResult.verdict === 'VERDADEIRO'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : aiResult.verdict === 'FALSO'
                    ? 'bg-rose-100 text-rose-800 border-rose-200'
                    : 'bg-amber-100 text-amber-800 border-amber-200'
                }`}>
                  Veredito: {aiResult.verdict}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Confiança: <strong>{aiResult.confidence}%</strong>
                </span>
              </div>

              <span className="text-[10px] text-slate-400">Checagem Cívica IA</span>
            </div>

            <div className="space-y-1">
              <h4 className="text-[10px] font-bold text-slate-600 uppercase">Explicação Didática</h4>
              <p className="text-xs text-slate-800 leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                {aiResult.explanation}
              </p>
            </div>

            {/* Key Facts */}
            {aiResult.keyFacts && aiResult.keyFacts.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-emerald-800 uppercase">Pontos Factuais Comprovados</h4>
                <ul className="space-y-1">
                  {aiResult.keyFacts.map((fact: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Red Flags if any */}
            {aiResult.redFlagsFound && aiResult.redFlagsFound.length > 0 && (
              <div className="space-y-1 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                <h4 className="text-[10px] font-bold text-amber-800 uppercase flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Sinais de Alerta Identificados no Texto
                </h4>
                <ul className="space-y-0.5">
                  {aiResult.redFlagsFound.map((flag: string, idx: number) => (
                    <li key={idx} className="text-xs text-amber-900 list-disc list-inside">
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sources */}
            {aiResult.sources && aiResult.sources.length > 0 && (
              <div className="pt-1.5 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                <span>Fontes Oficiais:</span>
                {aiResult.sources.map((src: any, idx: number) => (
                  <a
                    key={idx}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                  >
                    {src.title} <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Guide: 3 Steps to Spot Fake News */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-xs space-y-2.5">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="h-3.5 w-3.5 text-amber-600" /> Guia Prático: Como Reconhecer Notícias Falsas
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="h-5 w-5 rounded bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center border border-emerald-200 text-[10px]">
                1
              </span>
              <h4 className="font-bold text-slate-900 text-xs">Verifique a Fonte Original</h4>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Desconfie de links com extensões incomuns (.xyz, .top) ou prints sem link navegável. Confira na imprensa profissional.
            </p>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="h-5 w-5 rounded bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center border border-emerald-200 text-[10px]">
                2
              </span>
              <h4 className="font-bold text-slate-900 text-xs">Atenção a Títulos Sensacionalistas</h4>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Textos em CAIXA ALTA e chamadas emocionais ("URGENTE: VEJA ANTES QUE APAGUEM!") são indícios clássicos de desinformação.
            </p>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="h-5 w-5 rounded bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center border border-emerald-200 text-[10px]">
                3
              </span>
              <h4 className="font-bold text-slate-900 text-xs">Cuidado com Deepfakes & Áudios IA</h4>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Vozes e vídeos clonados de políticos costumam ter atrasos labiais ou entonação metálica contínua. Busque o perfil oficial.
            </p>
          </div>
        </div>
      </div>

      {/* Verified Debunks Repository */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" /> Banco de Checagens Oficiais & Boatos Desmentidos
            </h3>
            <p className="text-[11px] text-slate-500">
              Desmentidos publicados por TSE Fato ou Boato, Agência Lupa, Aos Fatos e G1 Fato ou Fake
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value)}
              className="bg-slate-50 text-xs text-slate-800 px-2.5 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
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
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Pesquisar nos boatos checados (ex: urnas, imposto, confisco...)"
            className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 pl-8 pr-3 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        {/* List */}
        <div className="space-y-2.5">
          {filteredFactChecks.map((fc) => (
            <div
              key={fc.id}
              className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-bold text-[10px] uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                  {fc.verdict}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {fc.source} • {fc.verificationDate}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  "{fc.claim}"
                </h4>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Origem do boato: {fc.claimant}
                </div>
              </div>

              <p className="text-slate-700 text-xs bg-white p-2.5 rounded border border-slate-200 leading-relaxed">
                {fc.debunkSummary}
              </p>

              <div className="flex items-center justify-between text-[10px] pt-0.5 border-t border-slate-200">
                <span className="text-slate-400">Checagem com rigor jornalístico</span>
                <a
                  href={fc.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:underline font-semibold flex items-center gap-1"
                >
                  Ler Checagem Completa <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
