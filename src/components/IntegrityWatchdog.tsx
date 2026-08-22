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
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-700 text-[10px] font-bold uppercase tracking-widest mb-0.5">
              <Scale className="h-3.5 w-3.5" /> Monitor de Probidade & Transparência
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Processos Judiciais Públicos & Uso de Verba
            </h2>
            <p className="text-slate-500 text-xs mt-0.5 max-w-3xl leading-relaxed">
              Acompanhamento de inquéritos, ações penais e processos de improbidade perante o STF, STJ, TSE, TRFs e TCU, além do monitoramento de gastos da cota parlamentar (CEAP).
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 self-start md:self-center">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            <div className="text-[11px]">
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Critério Jurídico</span>
              <span className="text-slate-800 font-semibold">Fontes Oficiais & Presunção de Inocência</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Highlights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        
        {/* Top Integrity Index */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-emerald-700" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Maiores Índices de Transparência & Probidade
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Score 0-100</span>
          </div>

          <div className="space-y-1.5">
            {topIntegrity.map(pol => (
              <div 
                key={pol.id}
                onClick={() => onViewPolitician(pol)}
                className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200/80 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <img src={pol.photo} alt={pol.name} className="h-7 w-7 rounded-md object-cover border border-slate-200" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{pol.popularName}</div>
                    <div className="text-[10px] text-slate-500">{pol.party} • {pol.role} ({pol.state})</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-emerald-700">{pol.integrityScore}</span>
                  <span className="text-[9px] text-slate-400 block">Presença: {pol.attendanceRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Cabinet Savers */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-amber-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Maior Economia de Cota Parlamentar (Gabinete)
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Dados Abertos</span>
          </div>

          <div className="space-y-1.5">
            {topSavers.map(pol => {
              const savedAmount = pol.cabinetBudgetLimit - pol.cabinetExpensesYear;
              const savedPct = Math.round((savedAmount / pol.cabinetBudgetLimit) * 100);

              return (
                <div 
                  key={pol.id}
                  onClick={() => onViewPolitician(pol)}
                  className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200/80 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <img src={pol.photo} alt={pol.name} className="h-7 w-7 rounded-md object-cover border border-slate-200" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{pol.popularName}</div>
                      <div className="text-[10px] text-slate-500">Gasto: R$ {pol.cabinetExpensesYear.toLocaleString('pt-BR')}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-200">
                      Economizou {savedPct}%
                    </span>
                    <span className="text-[9px] text-slate-500 block mt-0.5">
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
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Scale className="h-4 w-4 text-emerald-700" /> Registro de Processos Judiciais Públicos
            </h3>
            <p className="text-[11px] text-slate-500">
              {filteredProcesses.length} registro(s) indexado(s) nos tribunais superiores
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Court Select */}
            <select
              value={selectedCourt}
              onChange={(e) => setSelectedCourt(e.target.value)}
              className="bg-slate-50 text-xs text-slate-800 px-2.5 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              {courts.map(c => (
                <option key={c} value={c}>{c === 'TODOS' ? 'Todos os Tribunais' : `Tribunal: ${c}`}</option>
              ))}
            </select>

            {/* Status Select */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 text-xs text-slate-800 px-2.5 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s === 'TODOS' ? 'Todos os Status' : s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Process Search Input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por número do processo, político envolvido ou tipo de crime/improbidade..."
            className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 pl-8 pr-3 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        {/* Processes List */}
        <div className="space-y-2.5">
          {filteredProcesses.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200 p-4 text-slate-500 text-xs">
              Nenhum processo judicial encontrado para os filtros selecionados.
            </div>
          ) : (
            filteredProcesses.map(({ process, politician }) => (
              <div 
                key={process.id}
                className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={politician.photo} 
                      alt={politician.name} 
                      className="h-8 w-8 rounded-lg object-cover border border-slate-200" 
                    />
                    <div>
                      <div 
                        onClick={() => onViewPolitician(politician)}
                        className="font-bold text-xs text-slate-900 hover:text-emerald-700 cursor-pointer"
                      >
                        {politician.popularName} ({politician.party} - {politician.state})
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Número no Tribunal: <strong>{process.processNumber}</strong>
                      </span>
                    </div>
                  </div>

                  <span className={`self-start sm:self-center px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                    process.status === 'Absolvido' || process.status === 'Arquivado / Prescrito'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}>
                    {process.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 bg-white p-2 rounded-md border border-slate-200 text-[11px]">
                  <div>
                    <span className="text-slate-500">Órgão Judicial: </span>
                    <strong className="text-slate-800">{process.court}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Ano de Abertura: </span>
                    <strong className="text-slate-800">{process.yearStarted}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Última Movimentação: </span>
                    <strong className="text-slate-800">{process.lastUpdate}</strong>
                  </div>
                </div>

                <div>
                  <div className="text-amber-800 font-semibold text-[11px] mb-0.5">
                    Tipo Penal / Matéria: {process.crimeType}
                  </div>
                  <p className="text-slate-700 text-xs bg-white p-2.5 rounded border border-slate-200 leading-relaxed">
                    {process.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-0.5">
                  <span className="text-slate-400">Consulta pública oficial indexada</span>
                  <a
                    href={process.officialSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                  >
                    Acessar Processo no {process.court} <ExternalLink className="h-3 w-3" />
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
