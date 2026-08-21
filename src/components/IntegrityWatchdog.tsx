import React, { useState } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Filter, 
  ExternalLink, 
  Info, 
  DollarSign, 
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
  FileCheck
} from 'lucide-react';
import { Politician, JudicialProcess } from '../types';

interface IntegrityWatchdogProps {
  politicians: Politician[];
  onViewPolitician: (p: Politician) => void;
}

export const IntegrityWatchdog: React.FC<IntegrityWatchdogProps> = ({
  politicians,
  onViewPolitician
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourt, setSelectedCourt] = useState<string>('TODOS');
  const [selectedStatus, setSelectedStatus] = useState<string>('TODOS');

  // Collect all processes across all politicians
  const allProcessesWithPolitician: { process: JudicialProcess; politician: Politician }[] = [];
  politicians.forEach(p => {
    p.publicProcesses.forEach(proc => {
      allProcessesWithPolitician.push({ process: proc, politician: p });
    });
  });

  const filteredProcesses = allProcessesWithPolitician.filter(item => {
    const matchesSearch = item.process.processNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.process.crimeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.process.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.politician.popularName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.politician.party.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourt = selectedCourt === 'TODOS' || item.process.court === selectedCourt;
    const matchesStatus = selectedStatus === 'TODOS' || item.process.status === selectedStatus;

    return matchesSearch && matchesCourt && matchesStatus;
  });

  const courts = ['TODOS', 'STF', 'STJ', 'TSE', 'TRF1', 'TRF2', 'TRF3', 'TRF4', 'TCU'];
  const statuses = [
    'TODOS',
    'Em Julgamento',
    'Inquérito Policial / MP',
    'Denúncia Aceita (Réu)',
    'Condenado 1ª Instância (Recurso)',
    'Condenado Colegiado (Ficha Suja)',
    'Absolvido',
    'Arquivado / Prescrito'
  ];

  // Top Transparent Politicians
  const topIntegrity = [...politicians].sort((a, b) => b.integrityScore - a.integrityScore).slice(0, 4);

  // Highest Cabinet Savers (least money spent)
  const parliamentarians = politicians.filter(p => p.cabinetBudgetLimit > 0);
  const topSavers = [...parliamentarians].sort((a, b) => a.cabinetExpensesYear - b.cabinetExpensesYear).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Scale className="h-4 w-4" /> Monitor de Probidade & Transparência
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Processos Judiciais Públicos & Uso de Verba
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Acompanhamento detalhado de inquéritos, ações penais e processos de improbidade perante o STF, STJ, TSE, TRFs e TCU, além do monitoramento de gastos da cota parlamentar (CEAP).
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 self-start md:self-center">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <div className="text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Critério Jurídico</span>
              <span className="text-white font-semibold">Fontes Oficiais & Presunção de Inocência</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Highlights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Integrity Index */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Maiores Índices de Transparência & Probidade
              </h3>
            </div>
            <span className="text-[10px] text-slate-400">Score 0-100</span>
          </div>

          <div className="space-y-2">
            {topIntegrity.map(pol => (
              <div 
                key={pol.id}
                onClick={() => onViewPolitician(pol)}
                className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 hover:bg-slate-800/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <img src={pol.photo} alt={pol.name} className="h-9 w-9 rounded-xl object-cover" />
                  <div>
                    <div className="text-xs font-bold text-white">{pol.popularName}</div>
                    <div className="text-[10px] text-slate-400">{pol.party} • {pol.role} ({pol.state})</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-emerald-400">{pol.integrityScore}</span>
                  <span className="text-[10px] text-slate-500 block">Presença: {pol.attendanceRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Cabinet Savers */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Maior Economia de Cota Parlamentar (Gabinete)
              </h3>
            </div>
            <span className="text-[10px] text-slate-400">Dados Abertos Câmara/Senado</span>
          </div>

          <div className="space-y-2">
            {topSavers.map(pol => {
              const savedAmount = pol.cabinetBudgetLimit - pol.cabinetExpensesYear;
              const savedPct = Math.round((savedAmount / pol.cabinetBudgetLimit) * 100);

              return (
                <div 
                  key={pol.id}
                  onClick={() => onViewPolitician(pol)}
                  className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 hover:bg-slate-800/60 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={pol.photo} alt={pol.name} className="h-9 w-9 rounded-xl object-cover" />
                    <div>
                      <div className="text-xs font-bold text-white">{pol.popularName}</div>
                      <div className="text-[10px] text-slate-400">Gasto: R$ {pol.cabinetExpensesYear.toLocaleString('pt-BR')}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">
                      Economizou {savedPct}%
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      R$ {savedAmount.toLocaleString('pt-BR')} poupados
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Judicial Processes Search and List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale className="h-5 w-5 text-emerald-400" /> Registro de Processos Judiciais Públicos
            </h3>
            <p className="text-xs text-slate-400">
              {filteredProcesses.length} registro(s) encontrado(s) nos tribunais superiores
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Court Select */}
            <select
              value={selectedCourt}
              onChange={(e) => setSelectedCourt(e.target.value)}
              className="bg-slate-950 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-700 focus:outline-none"
            >
              {courts.map(c => (
                <option key={c} value={c}>{c === 'TODOS' ? 'Todos os Tribunais' : `Tribunal: ${c}`}</option>
              ))}
            </select>

            {/* Status Select */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-950 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-700 focus:outline-none"
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s === 'TODOS' ? 'Todos os Status' : s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Process Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por número do processo, político envolvido ou tipo de crime/improbidade..."
            className="w-full bg-slate-950 text-xs text-slate-100 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Processes List */}
        <div className="space-y-4">
          {filteredProcesses.length === 0 ? (
            <div className="text-center py-10 bg-slate-950 rounded-xl border border-slate-800 p-6 text-slate-400 text-xs">
              Nenhum processo judicial encontrado para os filtros selecionados.
            </div>
          ) : (
            filteredProcesses.map(({ process, politician }) => (
              <div 
                key={process.id}
                className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-2.5">
                  <div className="flex items-center gap-3">
                    <img 
                      src={politician.photo} 
                      alt={politician.name} 
                      className="h-10 w-10 rounded-xl object-cover border border-slate-700" 
                    />
                    <div>
                      <div 
                        onClick={() => onViewPolitician(politician)}
                        className="font-extrabold text-sm text-white hover:text-emerald-400 cursor-pointer"
                      >
                        {politician.popularName} ({politician.party} - {politician.state})
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Número no Tribunal: <strong>{process.processNumber}</strong>
                      </span>
                    </div>
                  </div>

                  <span className={`self-start sm:self-center px-3 py-1 rounded-full font-bold uppercase text-[10px] ${
                    process.status === 'Absolvido' || process.status === 'Arquivado / Prescrito'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {process.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-900/60 p-2.5 rounded-xl text-[11px]">
                  <div>
                    <span className="text-slate-400">Órgão Judicial: </span>
                    <strong className="text-slate-200">{process.court}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Ano de Abertura: </span>
                    <strong className="text-slate-200">{process.yearStarted}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Última Movimentação: </span>
                    <strong className="text-slate-200">{process.lastUpdate}</strong>
                  </div>
                </div>

                <div>
                  <div className="text-amber-300 font-semibold mb-1">
                    Tipo Penal / Matéria: {process.crimeType}
                  </div>
                  <p className="text-slate-300 text-xs bg-slate-900 p-3 rounded-xl border border-slate-800 leading-relaxed">
                    {process.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-500">Consulta pública oficial indexada</span>
                  <a
                    href={process.officialSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                  >
                    Acessar Processo no {process.court} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
