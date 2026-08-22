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
  Calendar,
  Clock,
  GitCommit,
  Building2,
  ChevronDown,
  ChevronUp,
  Award,
  Vote
} from 'lucide-react';
import { Legislation } from '../types';
import { LegislationTimelineStepper } from './LegislationTimelineStepper';

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
  const [expandedTimelineLawId, setExpandedTimelineLawId] = useState<string | null>(laws[0]?.id || null);

  const categories = ['TODAS', 'Economia', 'Tecnologia', 'Trabalho', 'Política', 'Saúde', 'Educação', 'Segurança'];

  const filteredLaws = laws.filter(l => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      l.title.toLowerCase().includes(searchLower) ||
      l.code.toLowerCase().includes(searchLower) ||
      (l.plainTextSummary || '').toLowerCase().includes(searchLower) ||
      l.author.toLowerCase().includes(searchLower);

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
          rawDescription: law.plainTextSummary || law.title
        })
      });

      if (!res.ok) throw new Error('Falha no resumo IA');
      const data = await res.json();
      setAiAnalysisData(data);
    } catch (err) {
      console.warn('Fallback para resumo analítico:', err);
      setAiAnalysisData({
        plainSummary: `A proposta ${law.code} trata de ${law.title}. Seu objetivo central é atualizar os parâmetros legais sobre ${law.category.toLowerCase()}, estabelecendo novas responsabilidades para o setor público e privado.`,
        pros: law.aiAnalysis?.pros || [
          'Maior transparência e padronização de procedimentos',
          'Atendimento a demandas históricas da sociedade civil'
        ],
        cons: law.aiAnalysis?.cons || [
          'Exigência de prazo de adequação e custos operacionais',
          'Divergência entre bancadas temáticas no Congresso'
        ],
        citizenImpact: law.aiAnalysis?.citizenImpact || 'Modifica diretamente direitos e deveres dos cidadãos e simplifica a prestação de serviços essenciais.',
        constitutionalContext: 'Fundamentado nos artigos da Constituição de 1988 referentes à ordem econômica e direitos fundamentais.'
      });
    } finally {
      setAnalyzingLawId(null);
    }
  };

  const toggleTimeline = (lawId: string) => {
    setExpandedTimelineLawId(prev => prev === lawId ? null : lawId);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-800 text-[10px] font-bold uppercase tracking-widest mb-0.5">
              <FileText className="h-3.5 w-3.5 text-emerald-700" /> 
              <span>Portal de Legislação & Linha do Tempo Interativa</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Projetos no Congresso & Tramitação Histórica
            </h2>
            <p className="text-slate-500 text-xs mt-0.5 max-w-3xl leading-relaxed">
              Acompanhe a linha do tempo histórica de cada proposta (comissões, votações nominais em plenário e sanção), vote nas enquetes populares e gere resumos sem juridiquês com IA.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                id={`cat-filter-${cat}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white font-bold shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mt-3 relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            id="law-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código (ex: PEC 45, PL 2630), tema ou autor..."
            className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 pl-8 pr-3 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>
      </div>

      {/* Active Featured Law Timeline (if one is selected or expanded) */}
      {expandedTimelineLawId && (() => {
        const featuredLaw = laws.find(l => l.id === expandedTimelineLawId);
        if (!featuredLaw) return null;

        return (
          <div className="animate-in fade-in duration-200">
            <LegislationTimelineStepper law={featuredLaw} />
          </div>
        );
      })()}

      {/* Laws List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {filteredLaws.map(law => {
          const userVote = userVotes[law.id];
          const isSubscribed = subscribedLaws.includes(law.id);
          const votesFavor = law.publicConsultation?.votesFavor ?? 0;
          const votesContra = law.publicConsultation?.votesContra ?? 0;
          const totalVotes = votesFavor + votesContra;
          const proPercent = totalVotes > 0 ? Math.round((votesFavor / totalVotes) * 100) : 50;
          const againstPercent = 100 - proPercent;
          const isTimelineOpen = expandedTimelineLawId === law.id;
          const timelineStepsCount = law.timeline?.length || 0;
          const completedStepsCount = law.timeline?.filter(s => s.status === 'completed').length || 0;

          return (
            <div
              key={law.id}
              id={`law-card-${law.id}`}
              className={`bg-white border rounded-xl p-3.5 shadow-xs flex flex-col justify-between space-y-3 transition-all ${
                isTimelineOpen 
                  ? 'border-emerald-500 ring-1 ring-emerald-300' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-2.5">
                {/* Header: Code + Chamber + Category */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-800 text-sm">{law.code}</span>
                      <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {law.category}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug mt-1">
                      {law.title}
                    </h3>
                  </div>

                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
                    {law.chamber}
                  </span>
                </div>

                {/* Author, Status and Timeline Progress Pills */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-1.5">
                  <span>Autoria: <strong className="text-slate-800">{law.author} ({law.authorParty})</strong></span>
                  
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                      law.status === 'Sancionado' || law.status === 'Aprovado'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}>
                      {law.status}
                    </span>
                  </div>
                </div>

                {/* Plain Text Description */}
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {law.plainTextSummary || law.title}
                </p>

                {/* Timeline Stepper Toggle Trigger */}
                {timelineStepsCount > 0 && (
                  <button
                    id={`toggle-timeline-btn-${law.id}`}
                    onClick={() => toggleTimeline(law.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isTimelineOpen
                        ? 'bg-emerald-800 text-white'
                        : 'bg-slate-100 hover:bg-emerald-50 text-emerald-950 border border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Clock className={`h-3.5 w-3.5 ${isTimelineOpen ? 'text-amber-300' : 'text-emerald-700'}`} />
                      <span>Linha do Tempo de Tramitação ({completedStepsCount}/{timelineStepsCount} Etapas)</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px]">
                      <span>{isTimelineOpen ? 'Recolher Linha' : 'Visualizar Etapas'}</span>
                      {isTimelineOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </div>
                  </button>
                )}

                {/* Popular Consultation Section */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1 text-[11px]">
                      <Users className="h-3 w-3 text-emerald-700" /> Consulta Popular Cidadã
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {totalVotes.toLocaleString('pt-BR')} votos computados
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden flex border border-slate-200">
                    <div 
                      style={{ width: `${proPercent}%` }} 
                      className="bg-emerald-600 transition-all duration-300" 
                      title={`A Favor: ${proPercent}%`}
                    />
                    <div 
                      style={{ width: `${againstPercent}%` }} 
                      className="bg-rose-600 transition-all duration-300" 
                      title={`Contra: ${againstPercent}%`}
                    />
                  </div>

                  {/* Percentages and Vote Buttons */}
                  <div className="flex items-center justify-between pt-0.5 text-xs">
                    <button
                      id={`vote-pro-${law.id}`}
                      onClick={() => onVoteLaw(law.id, 'pro')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        userVote === 'pro'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-300'
                      }`}
                    >
                      <ThumbsUp className="h-3 w-3" />
                      <span>A Favor ({proPercent}%)</span>
                    </button>

                    <button
                      id={`vote-against-${law.id}`}
                      onClick={() => onVoteLaw(law.id, 'against')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        userVote === 'against'
                          ? 'bg-rose-700 text-white shadow-xs'
                          : 'bg-white text-rose-800 hover:bg-rose-50 border border-rose-300'
                      }`}
                    >
                      <ThumbsDown className="h-3 w-3" />
                      <span>Contra ({againstPercent}%)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions: AI Explainer & Notification Toggle */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2 text-xs">
                <button
                  id={`ai-explain-${law.id}`}
                  onClick={() => handleAnalyzeWithAi(law)}
                  disabled={analyzingLawId === law.id}
                  className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-1.5 px-3 rounded-lg shadow-xs transition-colors cursor-pointer text-xs"
                >
                  {analyzingLawId === law.id ? (
                    <>
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      <span>Descomplicando...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3 text-amber-300" />
                      <span>Explicar com IA</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    id={`notify-law-${law.id}`}
                    onClick={() => onToggleSubscription(law.id)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      isSubscribed
                        ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                        : 'bg-slate-50 text-slate-500 hover:text-slate-800 border-slate-200'
                    }`}
                    title={isSubscribed ? 'Notificações ativadas para esta lei' : 'Receber notificações sobre o andamento desta lei'}
                  >
                    <Bell className="h-3.5 w-3.5" />
                  </button>

                  <a
                    href={law.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:text-slate-800 border border-slate-200 hover:bg-slate-100 transition-colors"
                    title="Acessar Íntegra no Portal do Congresso"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Law Breakdown Modal */}
      {aiAnalysisData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-xl overflow-hidden flex flex-col animate-in fade-in duration-150">
            
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="h-4 w-4 text-emerald-700" />
                <span>Descomplicador Legislativo IA</span>
              </div>
              <button
                onClick={() => setAiAnalysisData(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-3 text-xs text-slate-700">
              {/* Plain language summary */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <h4 className="font-bold text-emerald-800 uppercase tracking-wider text-[10px]">
                  Resumo em Linguagem Simples (Sem Juridiquês)
                </h4>
                <p className="text-xs text-slate-800 leading-relaxed">
                  {aiAnalysisData.plainSummary}
                </p>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 space-y-1">
                  <h5 className="font-bold text-emerald-800 uppercase text-[10px]">Argumentos Favoráveis</h5>
                  <ul className="space-y-1">
                    {aiAnalysisData.pros?.map((pro: string, i: number) => (
                      <li key={i} className="text-emerald-900 flex items-start gap-1.5">
                        <CheckCircle2 className="h-3 w-3 flex-shrink-0 mt-0.5 text-emerald-700" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-50 p-3 rounded-lg border border-rose-200 space-y-1">
                  <h5 className="font-bold text-rose-800 uppercase text-[10px]">Argumentos Contrários</h5>
                  <ul className="space-y-1">
                    {aiAnalysisData.cons?.map((con: string, i: number) => (
                      <li key={i} className="text-rose-900 flex items-start gap-1.5">
                        <span className="text-rose-700 font-bold">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Practical Citizen Impact */}
              {aiAnalysisData.citizenImpact && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                  <h4 className="font-bold text-amber-800 uppercase text-[10px]">Impacto no Dia a Dia do Cidadão</h4>
                  <p className="text-slate-700 leading-relaxed">{aiAnalysisData.citizenImpact}</p>
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setAiAnalysisData(null)}
                className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-1.5 px-4 rounded-lg transition-colors cursor-pointer"
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
