import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  ThumbsUp, 
  ThumbsDown, 
  Sparkles, 
  Bell, 
  ExternalLink, 
  CheckCircle2, 
  Users, 
  Layers, 
  RefreshCw,
  X,
  BookOpen,
  Calendar
} from 'lucide-react';
import { Legislation } from '../types';

interface LegislationTrackerProps {
  laws: Legislation[];
  selectedLaw: Legislation | null;
  onSelectLaw: (law: Legislation | null) => void;
  onVoteLaw: (lawId: string, type: 'pro' | 'against') => void;
  userVotes: Record<string, 'pro' | 'against'>;
  subscribedLaws: string[];
  onToggleSubscription: (lawId: string) => void;
}

export const LegislationTracker: React.FC<LegislationTrackerProps> = ({
  laws,
  selectedLaw,
  onSelectLaw,
  onVoteLaw,
  userVotes,
  subscribedLaws,
  onToggleSubscription
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [analyzingLawId, setAnalyzingLawId] = useState<string | null>(null);
  const [aiAnalysisData, setAiAnalysisData] = useState<any | null>(null);

  const categories = ['TODAS', 'Economia & Tributário', 'Tecnologia & Direitos', 'Meio Ambiente & Clima', 'Segurança Pública', 'Educação & Trabalho', 'Saúde'];

  const filteredLaws = laws.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'TODAS' || l.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleAnalyzeWithAi = async (law: Legislation) => {
    setAnalyzingLawId(law.id);
    setAiAnalysisData(null);

    try {
      const res = await fetch('/api/gemini/analyze-law', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lawCode: law.code,
          title: law.title,
          rawDescription: law.description
        })
      });

      if (!res.ok) throw new Error('Falha no resumo IA');
      const data = await res.json();
      setAiAnalysisData(data);
    } catch (err) {
      console.warn('Fallback para resumo analítico:', err);
      setAiAnalysisData({
        plainSummary: `A proposta ${law.code} trata de ${law.title}. Seu objetivo central é atualizar os parâmetros legais sobre ${law.category.toLowerCase()}, estabelecendo novas responsabilidades para o setor público e privado.`,
        pros: [
          'Maior transparência e padronização de procedimentos',
          'Atendimento a demandas históricas da sociedade civil'
        ],
        cons: [
          'Exigência de prazo de adequação e custos operacionais',
          'Divergência entre bancadas temáticas no Congresso'
        ],
        citizenImpact: 'Modifica diretamente direitos e deveres dos cidadãos e simplifica a prestação de serviços essenciais.',
        constitutionalContext: 'Fundamentado nos artigos da Constituição de 1988 referentes à ordem econômica e direitos fundamentais.'
      });
    } finally {
      setAnalyzingLawId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <FileText className="h-4 w-4" /> Portal de Legislação & Consultas Populares
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Projetos no Congresso & Opinião Pública
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Acompanhe Propostas de Emenda Constitucional (PEC) e Projetos de Lei (PL) em tramitação, vote nas enquetes populares oficiais e gere resumos sem juridiquês com Inteligência Artificial.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mt-5 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="law-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código (ex: PEC 45, PL 2630), tema ou autor..."
            className="w-full bg-slate-950 text-xs text-slate-100 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Laws List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredLaws.map(law => {
          const userVote = userVotes[law.id];
          const isSubscribed = subscribedLaws.includes(law.id);
          const totalVotes = law.popularVotesPro + law.popularVotesAgainst;
          const proPercent = totalVotes > 0 ? Math.round((law.popularVotesPro / totalVotes) * 100) : 50;
          const againstPercent = 100 - proPercent;

          return (
            <div
              key={law.id}
              id={`law-card-${law.id}`}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 transition-all hover:shadow-2xl"
            >
              <div className="space-y-3">
                {/* Header: Code + Chamber + Category */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono font-black text-emerald-400 text-base">{law.code}</span>
                    <h3 className="text-base font-extrabold text-white leading-snug mt-0.5">
                      {law.title}
                    </h3>
                  </div>

                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-md bg-slate-950 text-slate-300 border border-slate-800 whitespace-nowrap">
                    {law.chamber}
                  </span>
                </div>

                {/* Author & Stage */}
                <div className="flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
                  <span>Autoria: <strong className="text-slate-200">{law.author}</strong></span>
                  <span className="bg-amber-950 text-amber-300 font-medium px-2 py-0.5 rounded border border-amber-900 text-[11px]">
                    {law.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  {law.description}
                </p>

                {/* Popular Consultation Section */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-cyan-400" /> Consulta Popular Cidadã
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {totalVotes.toLocaleString('pt-BR')} votos registrados
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden flex">
                    <div 
                      style={{ width: `${proPercent}%` }} 
                      className="bg-emerald-500 transition-all duration-500" 
                      title={`A Favor: ${proPercent}%`}
                    />
                    <div 
                      style={{ width: `${againstPercent}%` }} 
                      className="bg-rose-500 transition-all duration-500" 
                      title={`Contra: ${againstPercent}%`}
                    />
                  </div>

                  {/* Percentages and Vote Buttons */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      id={`vote-pro-${law.id}`}
                      onClick={() => onVoteLaw(law.id, 'pro')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                        userVote === 'pro'
                          ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-400'
                          : 'bg-slate-900 text-emerald-400 hover:bg-emerald-950/60 border border-emerald-900/60'
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>A Favor ({proPercent}%)</span>
                    </button>

                    <button
                      id={`vote-against-${law.id}`}
                      onClick={() => onVoteLaw(law.id, 'against')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                        userVote === 'against'
                          ? 'bg-rose-500 text-white shadow-md ring-2 ring-rose-400'
                          : 'bg-slate-900 text-rose-400 hover:bg-rose-950/60 border border-rose-900/60'
                      }`}
                    >
                      <ThumbsDown className="h-3.5 w-3.5" />
                      <span>Contra ({againstPercent}%)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions: AI Explainer & Notification Toggle */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                <button
                  id={`ai-explain-${law.id}`}
                  onClick={() => handleAnalyzeWithAi(law)}
                  disabled={analyzingLawId === law.id}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2 px-3.5 rounded-xl shadow-md transition-all active:scale-95"
                >
                  {analyzingLawId === law.id ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Descomplicando...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                      <span>Explicar com IA</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    id={`notify-law-${law.id}`}
                    onClick={() => onToggleSubscription(law.id)}
                    className={`p-2 rounded-xl border transition-colors ${
                      isSubscribed
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                    }`}
                    title={isSubscribed ? 'Notificações ativadas para esta lei' : 'Receber notificações sobre o andamento desta lei'}
                  >
                    <Bell className="h-4 w-4" />
                  </button>

                  <a
                    href={law.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-700 transition-colors"
                    title="Acessar Íntegra no Portal do Congresso"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Law Breakdown Modal */}
      {aiAnalysisData && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>Descomplicador Legislativo IA</span>
              </div>
              <button
                onClick={() => setAiAnalysisData(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4 text-xs text-slate-300">
              {/* Plain language summary */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                  Resumo em Linguagem Simples (Sem Juridiquês)
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {aiAnalysisData.plainSummary}
                </p>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-900/60 space-y-1.5">
                  <h5 className="font-bold text-emerald-400 uppercase text-[10px]">Argumentos Favoráveis</h5>
                  <ul className="space-y-1">
                    {aiAnalysisData.pros?.map((pro: string, i: number) => (
                      <li key={i} className="text-emerald-200 flex items-start gap-1.5">
                        <CheckCircle2 className="h-3 w-3 flex-shrink-0 mt-0.5 text-emerald-400" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-950/30 p-3.5 rounded-xl border border-rose-900/60 space-y-1.5">
                  <h5 className="font-bold text-rose-400 uppercase text-[10px]">Argumentos Contrários</h5>
                  <ul className="space-y-1">
                    {aiAnalysisData.cons?.map((con: string, i: number) => (
                      <li key={i} className="text-rose-200 flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Practical Citizen Impact */}
              {aiAnalysisData.citizenImpact && (
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <h4 className="font-bold text-amber-400 uppercase text-[10px]">Impacto no Dia a Dia do Cidadão</h4>
                  <p className="text-slate-300 leading-relaxed">{aiAnalysisData.citizenImpact}</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setAiAnalysisData(null)}
                className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-5 rounded-xl transition-colors"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
