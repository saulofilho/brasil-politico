import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Scale, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  X, 
  ExternalLink,
  ChevronRight,
  Vote,
  Sparkles,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { Politician, PoliticalRole, Party } from '../types';

interface PoliticiansDirectoryProps {
  politicians: Politician[];
  parties: Party[];
  selectedPolitician: Politician | null;
  onSelectPolitician: (p: Politician | null) => void;
  onCompareWith: (p: Politician) => void;
  filterState?: string;
}

export const PoliticiansDirectory: React.FC<PoliticiansDirectoryProps> = ({
  politicians,
  parties,
  selectedPolitician,
  onSelectPolitician,
  onCompareWith,
  filterState
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParty, setSelectedParty] = useState<string>('TODOS');
  const [selectedRole, setSelectedRole] = useState<string>('TODOS');
  const [selectedUf, setSelectedUf] = useState<string>(filterState || 'TODOS');
  const [onlyCleanRecord, setOnlyCleanRecord] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'integrity' | 'attendance' | 'name'>('integrity');
  const [activeModalTab, setActiveModalTab] = useState<'bio' | 'processos' | 'gastos' | 'votacoes' | 'checagens'>('bio');

  // Filter logic
  const filteredPoliticians = politicians.filter(p => {
    const matchesSearch = p.popularName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.bio.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesParty = selectedParty === 'TODOS' || p.party === selectedParty;
    const matchesRole = selectedRole === 'TODOS' || p.role === selectedRole;
    const matchesUf = selectedUf === 'TODOS' || p.state === selectedUf;
    const matchesCleanRecord = !onlyCleanRecord || p.isCleanRecord;

    return matchesSearch && matchesParty && matchesRole && matchesUf && matchesCleanRecord;
  }).sort((a, b) => {
    if (sortBy === 'integrity') return b.integrityScore - a.integrityScore;
    if (sortBy === 'attendance') return b.attendanceRate - a.attendanceRate;
    return a.popularName.localeCompare(b.popularName);
  });

  const allUfs = Array.from(new Set(politicians.map(p => p.state))).sort();
  const allRoles: PoliticalRole[] = ['Presidente', 'Governador', 'Senador', 'Deputado Federal'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Users className="h-4 w-4" /> Diretório Nacional de Políticos
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Perfil, Transparência e Histórico Público
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Consulte dados consolidados de atuação parlamentar, histórico de votos, gastos de gabinete declarados, evolução de patrimônio no TSE e processos judiciais documentados.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-800 text-slate-300 font-mono px-3 py-1.5 rounded-lg border border-slate-700">
              Exibindo <strong>{filteredPoliticians.length}</strong> de {politicians.length} políticos
            </span>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-5 border-t border-slate-800">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              id="politician-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome..."
              className="w-full bg-slate-950 text-xs text-slate-100 placeholder-slate-400 pl-9 pr-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Party Filter */}
          <select
            id="party-select-filter"
            value={selectedParty}
            onChange={(e) => setSelectedParty(e.target.value)}
            className="bg-slate-950 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="TODOS">Todos os Partidos</option>
            {parties.map(p => (
              <option key={p.id} value={p.acronym}>{p.acronym} - {p.name}</option>
            ))}
          </select>

          {/* Role Filter */}
          <select
            id="role-select-filter"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-slate-950 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="TODOS">Todos os Cargos</option>
            {allRoles.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* UF Filter */}
          <select
            id="uf-select-filter"
            value={selectedUf}
            onChange={(e) => setSelectedUf(e.target.value)}
            className="bg-slate-950 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="TODOS">Todos os Estados (UF)</option>
            {allUfs.map(uf => (
              <option key={uf} value={uf}>{uf === 'BR' ? 'Âmbito Nacional (BR)' : `Estado: ${uf}`}</option>
            ))}
          </select>

          {/* Sort By */}
          <select
            id="sort-select-filter"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="integrity">Ordenar: Índice de Transparência</option>
            <option value="attendance">Ordenar: Presença em Plenário</option>
            <option value="name">Ordenar: Nome Alfabético</option>
          </select>
        </div>

        {/* Clean Record Toggle */}
        <div className="mt-3 flex items-center justify-between flex-wrap gap-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
            <input
              id="clean-record-checkbox"
              type="checkbox"
              checked={onlyCleanRecord}
              onChange={(e) => setOnlyCleanRecord(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Exibir apenas parlamentares <strong>Ficha Limpa</strong> (sem condenações)
            </span>
          </label>

          {(searchTerm || selectedParty !== 'TODOS' || selectedRole !== 'TODOS' || selectedUf !== 'TODOS' || onlyCleanRecord) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedParty('TODOS');
                setSelectedRole('TODOS');
                setSelectedUf('TODOS');
                setOnlyCleanRecord(false);
              }}
              className="text-amber-400 hover:underline flex items-center gap-1 font-medium"
            >
              <X className="h-3 w-3" /> Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Politicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPoliticians.map((p) => {
          const partyObj = parties.find(party => party.acronym === p.party);
          const hasProcesses = p.publicProcesses.length > 0;

          return (
            <div
              key={p.id}
              id={`politician-card-${p.id}`}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all hover:shadow-2xl group"
            >
              <div>
                {/* Top Row: Photo + Identity + Integrity Score */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={p.photo} 
                      alt={p.name} 
                      className="h-14 w-14 rounded-2xl object-cover border-2 border-slate-700 shadow-md group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <h3 className="text-base font-extrabold text-white group-hover:text-emerald-400 transition-colors leading-tight">
                        {p.popularName}
                      </h3>
                      <div className="text-xs text-slate-400 font-medium">{p.role} • {p.state}</div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span 
                          className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-800"
                          style={{ color: partyObj?.colorHex || '#10b981' }}
                        >
                          {p.party}
                        </span>
                        {p.electionNumber && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            Nº {p.electionNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Integrity Badge Meter */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-[9px] uppercase font-bold text-slate-400">Transparência</div>
                    <div className={`text-base font-black flex items-center justify-end gap-1 ${
                      p.integrityScore >= 80 ? 'text-emerald-400' : p.integrityScore >= 65 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {p.integrityScore} <span className="text-[10px] text-slate-400 font-normal">/100</span>
                    </div>
                  </div>
                </div>

                {/* Metrics Pill Matrix */}
                <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Presença Plenário</span>
                    <span className="font-bold text-slate-200">{p.attendanceRate}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Patrimônio Declarado</span>
                    <span className="font-bold text-slate-200">
                      R$ {(p.netWorthDeclared / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Gasto Cota (Ano):</span>
                    <span className="font-mono text-slate-300 font-semibold">
                      {p.cabinetExpensesYear > 0 
                        ? `R$ ${p.cabinetExpensesYear.toLocaleString('pt-BR')}`
                        : 'Não aplicável (Executivo)'}
                    </span>
                  </div>
                </div>

                {/* Status regarding public processes */}
                <div className="mt-3">
                  {hasProcesses ? (
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-950/40 border border-amber-900/60 px-2.5 py-1.5 rounded-lg">
                      <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="text-[11px] truncate">
                        {p.publicProcesses.length} processo(s) público(s) registrado(s)
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-2.5 py-1.5 rounded-lg">
                      <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="text-[11px]">Nenhum processo condenatório</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
                <button
                  id={`btn-view-profile-${p.id}`}
                  onClick={() => onSelectPolitician(p)}
                  className="flex-1 bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-white text-xs font-bold py-2 px-3 rounded-xl transition-colors text-center"
                >
                  Ver Dossiê Completo
                </button>
                <button
                  id={`btn-compare-${p.id}`}
                  onClick={() => onCompareWith(p)}
                  title="Comparar com outro político"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-2 rounded-xl border border-slate-700 transition-colors"
                >
                  <Scale className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPoliticians.length === 0 && (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <Users className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">Nenhum político encontrado com os filtros atuais</h3>
          <p className="text-slate-400 text-xs mt-1">Tente ajustar a busca, remover o filtro de Ficha Limpa ou selecionar outro partido/estado.</p>
        </div>
      )}

      {/* Detailed Politician Dossier Modal */}
      {selectedPolitician && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src={selectedPolitician.photo} 
                  alt={selectedPolitician.name} 
                  className="h-16 w-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-xl"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                      {selectedPolitician.popularName}
                    </h3>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {selectedPolitician.party}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Nome Civil: <strong>{selectedPolitician.name}</strong> • {selectedPolitician.role} ({selectedPolitician.state})
                  </div>
                  <div className="text-xs text-slate-400">
                    Formação: {selectedPolitician.education}
                  </div>
                </div>
              </div>

              <button
                id="close-politician-modal-btn"
                onClick={() => onSelectPolitician(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/40 overflow-x-auto scrollbar-none">
              {[
                { id: 'bio', label: 'Biografia & Carreira' },
                { id: 'processos', label: `Processos Judiciais (${selectedPolitician.publicProcesses.length})` },
                { id: 'gastos', label: 'Patrimônio & Cota' },
                { id: 'votacoes', label: `Votações Nominais (${selectedPolitician.votesHistory.length})` },
                { id: 'checagens', label: `Checagens de Fatos (${selectedPolitician.factChecks.length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveModalTab(tab.id as any)}
                  className={`pb-3 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
                    activeModalTab === tab.id
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
              
              {/* Tab 1: Bio */}
              {activeModalTab === 'bio' && (
                <div className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm text-slate-300 leading-relaxed">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Trajetória e Biografia</h4>
                    {selectedPolitician.bio}
                  </div>

                  {/* Key Tags */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedPolitician.tags.map((t, idx) => (
                      <span key={idx} className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-lg border border-slate-700">
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Proposed Legislation */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Proposições & Projetos Relevantes</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedPolitician.billsProposed.map(b => (
                        <div key={b.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                          <div className="font-bold text-emerald-400">{b.code} ({b.year})</div>
                          <div className="text-slate-300 mt-0.5">{b.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Judicial Processes */}
              {activeModalTab === 'processos' && (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                    <span>Registro com dados públicos oficiais dos tribunais superiores (STF, STJ, TSE, TRFs e TCU).</span>
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  </div>

                  {selectedPolitician.publicProcesses.length === 0 ? (
                    <div className="text-center py-10 bg-slate-950 rounded-2xl border border-slate-800 p-6">
                      <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
                      <h4 className="text-sm font-bold text-white">Nenhum processo condenatório ou investigatório público ativo</h4>
                      <p className="text-xs text-slate-400 mt-1">Este parlamentar possui status 'Ficha Limpa' nos registros consultados.</p>
                    </div>
                  ) : (
                    selectedPolitician.publicProcesses.map(proc => (
                      <div key={proc.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="font-mono font-bold text-white text-sm">{proc.processNumber}</span>
                          <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                            proc.status === 'Absolvido' || proc.status === 'Arquivado / Prescrito'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}>
                            {proc.status}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Tribunal: </span>
                          <strong className="text-slate-200">{proc.court}</strong> • 
                          <span className="text-slate-400"> Ano de Início: </span>
                          <strong className="text-slate-200">{proc.yearStarted}</strong>
                        </div>
                        <div className="text-amber-300 font-medium">
                          Matéria: {proc.crimeType}
                        </div>
                        <p className="text-slate-300 text-[11px] bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          {proc.summary}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                          <span>Última atualização: {proc.lastUpdate}</span>
                          <a href={proc.officialSourceUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1">
                            Acessar Fonte Oficial <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 3: Gastos & Patrimônio */}
              {activeModalTab === 'gastos' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <div className="text-slate-400 uppercase font-semibold text-[10px]">Patrimônio Declarado (TSE 2022)</div>
                      <div className="text-xl font-black text-white mt-1">
                        R$ {selectedPolitician.netWorthDeclared.toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <div className="text-slate-400 uppercase font-semibold text-[10px]">Cota Parlamentar Anual Utilizada</div>
                      <div className="text-xl font-black text-emerald-400 mt-1">
                        {selectedPolitician.cabinetExpensesYear > 0 
                          ? `R$ ${selectedPolitician.cabinetExpensesYear.toLocaleString('pt-BR')}`
                          : 'R$ 0,00 (Cargo Executivo)'}
                      </div>
                      {selectedPolitician.cabinetBudgetLimit > 0 && (
                        <div className="text-[10px] text-slate-400 mt-1">
                          Limite anual disponível: R$ {selectedPolitician.cabinetBudgetLimit.toLocaleString('pt-BR')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Net Worth Evolution */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-slate-300 uppercase">Evolução Patrimonial Declarada em Eleições</h4>
                    <div className="space-y-2">
                      {selectedPolitician.netWorthEvolution.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-xl">
                          <span className="font-bold text-slate-300">Ano {item.year}</span>
                          <span className="font-mono text-emerald-400 font-bold">
                            R$ {item.value.toLocaleString('pt-BR')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Votações Nominais */}
              {activeModalTab === 'votacoes' && (
                <div className="space-y-3 text-xs">
                  {selectedPolitician.votesHistory.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      Nenhum histórico de votação nominal registrado para este cargo.
                    </div>
                  ) : (
                    selectedPolitician.votesHistory.map(v => (
                      <div key={v.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                        <div>
                          <span className="font-bold text-emerald-400">{v.billCode}</span>: {v.billName}
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Data: {v.date} • Orientação do Partido: <strong>{v.partyGuidance}</strong>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-lg font-black text-xs ${
                          v.vote === 'SIM' 
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}>
                          VOTO: {v.vote}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 5: Fact Checks */}
              {activeModalTab === 'checagens' && (
                <div className="space-y-3 text-xs">
                  {selectedPolitician.factChecks.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      Nenhuma checagem de fatos ou boato viral recente registrado sobre este político.
                    </div>
                  ) : (
                    selectedPolitician.factChecks.map(fc => (
                      <div key={fc.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-900">
                            {fc.verdict}
                          </span>
                          <span className="text-[10px] text-slate-500">{fc.checkerSource} • {fc.date}</span>
                        </div>
                        <div className="font-semibold text-white">"{fc.claim}"</div>
                        <p className="text-slate-300 text-[11px] bg-slate-900 p-2.5 rounded-xl">
                          {fc.debunkSummary}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  onCompareWith(selectedPolitician);
                  onSelectPolitician(null);
                }}
                className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-xl border border-slate-700 transition-colors"
              >
                <Scale className="h-4 w-4 text-amber-400" />
                <span>Comparar no Guia Eleitoral</span>
              </button>

              <button
                onClick={() => onSelectPolitician(null)}
                className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-5 rounded-xl transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
