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
    <div className="space-y-4">
      {/* Header - High Density */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-700 text-[10px] font-bold uppercase tracking-widest mb-0.5">
              <Users className="h-3.5 w-3.5" /> Diretório Nacional de Políticos
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Perfil, Transparência e Histórico Público
            </h2>
            <p className="text-slate-500 text-xs mt-0.5 max-w-3xl leading-relaxed">
              Consulte dados consolidados de atuação parlamentar, histórico de votos, gastos de gabinete declarados, evolução de patrimônio no TSE e processos judiciais documentados.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-slate-100 text-slate-700 font-mono px-2.5 py-1 rounded-md border border-slate-200">
              Exibindo <strong>{filteredPoliticians.length}</strong> de {politicians.length} políticos
            </span>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-3 border-t border-slate-100">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              id="politician-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome..."
              className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 pl-8 pr-2.5 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Party Filter */}
          <select
            id="party-select-filter"
            value={selectedParty}
            onChange={(e) => setSelectedParty(e.target.value)}
            className="bg-slate-50 text-xs text-slate-800 px-2.5 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
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
            className="bg-slate-50 text-xs text-slate-800 px-2.5 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
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
            className="bg-slate-50 text-xs text-slate-800 px-2.5 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          >
            <option value="TODOS">Todos os Estados (UF)</option>
            {allUfs.map(uf => (
              <option key={uf} value={uf}>{uf === 'BR' ? 'Nacional (BR)' : `Estado: ${uf}`}</option>
            ))}
          </select>

          {/* Sort By */}
          <select
            id="sort-select-filter"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 text-xs text-slate-800 px-2.5 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          >
            <option value="integrity">Ordem: Transparência</option>
            <option value="attendance">Ordem: Presença Plenário</option>
            <option value="name">Ordem: Nome Alfabético</option>
          </select>
        </div>

        {/* Clean Record Toggle */}
        <div className="mt-2.5 flex items-center justify-between flex-wrap gap-2 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 hover:text-slate-900 select-none">
            <input
              id="clean-record-checkbox"
              type="checkbox"
              checked={onlyCleanRecord}
              onChange={(e) => setOnlyCleanRecord(e.target.checked)}
              className="rounded bg-slate-100 border-slate-300 text-emerald-700 focus:ring-emerald-600"
            />
            <span className="flex items-center gap-1 text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
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
              className="text-amber-700 hover:underline flex items-center gap-1 text-[11px] font-semibold"
            >
              <X className="h-3 w-3" /> Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Politicians Grid - High Density Compact */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredPoliticians.map((p) => {
          const partyObj = parties.find(party => party.acronym === p.party);
          const hasProcesses = p.publicProcesses.length > 0;

          return (
            <div
              key={p.id}
              id={`politician-card-${p.id}`}
              className="bg-white border border-slate-200 hover:border-emerald-600 rounded-xl p-3.5 shadow-xs flex flex-col justify-between transition-all group"
            >
              <div>
                {/* Top Row: Photo + Identity + Integrity Score */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={p.photo} 
                      alt={p.name} 
                      className="h-11 w-11 rounded-lg object-cover border border-slate-200 shadow-xs group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                        {p.popularName}
                      </h3>
                      <div className="text-[11px] text-slate-500 font-medium">{p.role} • {p.state}</div>
                      <div className="mt-0.5 flex items-center gap-1">
                        <span 
                          className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200"
                          style={{ color: partyObj?.colorHex || '#064e3b' }}
                        >
                          {p.party}
                        </span>
                        {p.electionNumber && (
                          <span className="text-[9px] text-slate-500 font-mono">
                            Nº {p.electionNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Integrity Badge Meter */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-[9px] uppercase font-bold text-slate-400">Score</div>
                    <div className={`text-sm font-black flex items-center justify-end gap-0.5 ${
                      p.integrityScore >= 80 ? 'text-emerald-700' : p.integrityScore >= 65 ? 'text-amber-600' : 'text-rose-600'
                    }`}>
                      {p.integrityScore} <span className="text-[9px] text-slate-400 font-normal">/100</span>
                    </div>
                  </div>
                </div>

                {/* Metrics Pill Matrix */}
                <div className="mt-2.5 grid grid-cols-2 gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-200/80 text-[11px]">
                  <div>
                    <span className="text-[9px] text-slate-500 block">Presença Plenário</span>
                    <span className="font-bold text-slate-800">{p.attendanceRate}%</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block">Patrimônio Declarado</span>
                    <span className="font-bold text-slate-800">
                      R$ {(p.netWorthDeclared / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[9px] text-slate-500">Gasto Cota (Ano):</span>
                    <span className="font-mono text-slate-700 font-semibold text-[10px]">
                      {p.cabinetExpensesYear > 0 
                        ? `R$ ${p.cabinetExpensesYear.toLocaleString('pt-BR')}`
                        : 'Não aplicável (Executivo)'}
                    </span>
                  </div>
                </div>

                {/* Status regarding public processes */}
                <div className="mt-2">
                  {hasProcesses ? (
                    <div className="flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded">
                      <AlertTriangle className="h-3 w-3 flex-shrink-0 text-amber-600" />
                      <span className="truncate">
                        {p.publicProcesses.length} processo(s) público(s)
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded">
                      <CheckCircle2 className="h-3 w-3 flex-shrink-0 text-emerald-600" />
                      <span>Ficha Limpa</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Actions */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5">
                <button
                  id={`btn-view-profile-${p.id}`}
                  onClick={() => onSelectPolitician(p)}
                  className="flex-1 bg-slate-100 hover:bg-emerald-700 hover:text-white text-slate-800 text-xs font-bold py-1.5 px-2.5 rounded-md transition-colors text-center border border-slate-200"
                >
                  Ver Dossiê
                </button>
                <button
                  id={`btn-compare-${p.id}`}
                  onClick={() => onCompareWith(p)}
                  title="Comparar com outro político"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 p-1.5 rounded-md border border-slate-200 transition-colors"
                >
                  <Scale className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPoliticians.length === 0 && (
        <div className="text-center py-10 bg-white border border-slate-200 rounded-xl p-6">
          <Users className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-900">Nenhum político encontrado com os filtros atuais</h3>
          <p className="text-slate-500 text-xs mt-0.5">Tente ajustar a busca, remover o filtro de Ficha Limpa ou selecionar outro partido/estado.</p>
        </div>
      )}

      {/* Detailed Politician Dossier Modal */}
      {selectedPolitician && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl max-w-3xl w-full max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-4 bg-[#064E3B] text-white flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedPolitician.photo} 
                  alt={selectedPolitician.name} 
                  className="h-12 w-12 rounded-lg object-cover border-2 border-yellow-400 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                      {selectedPolitician.popularName}
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-yellow-400 text-[#064E3B]">
                      {selectedPolitician.party}
                    </span>
                  </div>
                  <div className="text-xs text-emerald-100 mt-0.5">
                    Nome Civil: <strong>{selectedPolitician.name}</strong> • {selectedPolitician.role} ({selectedPolitician.state})
                  </div>
                  <div className="text-[11px] text-emerald-200/90">
                    Formação: {selectedPolitician.education}
                  </div>
                </div>
              </div>

              <button
                id="close-politician-modal-btn"
                onClick={() => onSelectPolitician(null)}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-[#065F46] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-1 px-4 pt-2 border-b border-slate-200 bg-slate-50 overflow-x-auto scrollbar-none">
              {[
                { id: 'bio', label: 'Biografia' },
                { id: 'processos', label: `Processos (${selectedPolitician.publicProcesses.length})` },
                { id: 'gastos', label: 'Patrimônio & Cota' },
                { id: 'votacoes', label: `Votações (${selectedPolitician.votesHistory.length})` },
                { id: 'checagens', label: `Checagens (${selectedPolitician.factChecks.length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveModalTab(tab.id as any)}
                  className={`pb-2 px-2.5 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
                    activeModalTab === tab.id
                      ? 'border-emerald-700 text-emerald-800'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body Content */}
            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-3 text-xs">
              
              {/* Tab 1: Bio */}
              {activeModalTab === 'bio' && (
                <div className="space-y-3">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
                    <h4 className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">Trajetória e Atuação</h4>
                    {selectedPolitician.bio}
                  </div>

                  {/* Key Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedPolitician.tags.map((t, idx) => (
                      <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Proposed Legislation */}
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Proposições & Projetos Relevantes</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedPolitician.billsProposed.map(b => (
                        <div key={b.id} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                          <div className="font-bold text-emerald-800">{b.code} ({b.year})</div>
                          <div className="text-slate-600 mt-0.5">{b.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Judicial Processes */}
              {activeModalTab === 'processos' && (
                <div className="space-y-2.5">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 flex items-center justify-between">
                    <span>Registro oficial consolidado de tribunais superiores (STF, STJ, TSE, TRFs e TCU).</span>
                    <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  </div>

                  {selectedPolitician.publicProcesses.length === 0 ? (
                    <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-200 p-4">
                      <CheckCircle2 className="h-8 w-8 text-emerald-700 mx-auto mb-1" />
                      <h4 className="text-xs font-bold text-slate-800">Nenhum processo condenatório registrado</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Parlamentar com status 'Ficha Limpa' nos registros consultados.</p>
                    </div>
                  ) : (
                    selectedPolitician.publicProcesses.map(proc => (
                      <div key={proc.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between flex-wrap gap-1.5">
                          <span className="font-mono font-bold text-slate-900 text-xs">{proc.processNumber}</span>
                          <span className={`px-2 py-0.2 rounded font-bold uppercase text-[9px] ${
                            proc.status === 'Absolvido' || proc.status === 'Arquivado / Prescrito'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}>
                            {proc.status}
                          </span>
                        </div>
                        <div className="text-slate-600 text-[11px]">
                          <span>Tribunal: </span><strong className="text-slate-800">{proc.court}</strong> • 
                          <span> Ano: </span><strong className="text-slate-800">{proc.yearStarted}</strong>
                        </div>
                        <div className="text-amber-800 font-semibold text-xs">
                          Matéria: {proc.crimeType}
                        </div>
                        <p className="text-slate-700 text-[11px] bg-white p-2 rounded border border-slate-200">
                          {proc.summary}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                          <span>Atualização: {proc.lastUpdate}</span>
                          <a href={proc.officialSourceUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold">
                            Fonte Oficial <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 3: Gastos & Patrimônio */}
              {activeModalTab === 'gastos' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div className="text-slate-500 uppercase font-semibold text-[9px]">Patrimônio Declarado (TSE 2022)</div>
                      <div className="text-lg font-black text-slate-900 mt-0.5">
                        R$ {selectedPolitician.netWorthDeclared.toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div className="text-slate-500 uppercase font-semibold text-[9px]">Cota Parlamentar Anual</div>
                      <div className="text-lg font-black text-emerald-700 mt-0.5">
                        {selectedPolitician.cabinetExpensesYear > 0 
                          ? `R$ ${selectedPolitician.cabinetExpensesYear.toLocaleString('pt-BR')}`
                          : 'R$ 0,00 (Cargo Executivo)'}
                      </div>
                    </div>
                  </div>

                  {/* Net Worth Evolution */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                    <h4 className="text-[10px] font-bold text-slate-700 uppercase">Evolução Patrimonial Declarada</h4>
                    <div className="space-y-1">
                      {selectedPolitician.netWorthEvolution.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-slate-200">
                          <span className="font-semibold text-slate-700">Ano {item.year}</span>
                          <span className="font-mono text-emerald-700 font-bold">
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
                <div className="space-y-2">
                  {selectedPolitician.votesHistory.length === 0 ? (
                    <div className="text-center py-6 text-slate-500">
                      Nenhum histórico de votação nominal registrado para este cargo.
                    </div>
                  ) : (
                    selectedPolitician.votesHistory.map(v => (
                      <div key={v.id} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between gap-2">
                        <div>
                          <span className="font-bold text-emerald-800">{v.billCode}</span>: <span className="text-slate-800">{v.billName}</span>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Data: {v.date} • Bancada: <strong>{v.partyGuidance}</strong>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded font-black text-[11px] ${
                          v.vote === 'SIM' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          {v.vote}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 5: Fact Checks */}
              {activeModalTab === 'checagens' && (
                <div className="space-y-2">
                  {selectedPolitician.factChecks.length === 0 ? (
                    <div className="text-center py-6 text-slate-500">
                      Nenhuma checagem de fatos ou boato viral recente registrado sobre este político.
                    </div>
                  ) : (
                    selectedPolitician.factChecks.map(fc => (
                      <div key={fc.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-800 bg-rose-100 px-1.5 py-0.2 rounded border border-rose-200 text-[10px]">
                            {fc.verdict}
                          </span>
                          <span className="text-[10px] text-slate-500">{fc.checkerSource} • {fc.date}</span>
                        </div>
                        <div className="font-semibold text-slate-900">"{fc.claim}"</div>
                        <p className="text-slate-700 text-[11px] bg-white p-2 rounded border border-slate-200">
                          {fc.debunkSummary}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  onCompareWith(selectedPolitician);
                  onSelectPolitician(null);
                }}
                className="flex items-center gap-1.5 text-xs bg-white hover:bg-slate-200 text-slate-800 font-bold py-1.5 px-3 rounded-lg border border-slate-300 transition-colors"
              >
                <Scale className="h-3.5 w-3.5 text-amber-600" />
                <span>Comparar Candidato</span>
              </button>

              <button
                onClick={() => onSelectPolitician(null)}
                className="text-xs bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-1.5 px-4 rounded-lg transition-colors"
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
