import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Users, 
  Award, 
  Calendar, 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle2, 
  Scale, 
  X,
  ExternalLink,
  Layers
} from 'lucide-react';
import { Party, Politician } from '../types';

interface PartiesDirectoryProps {
  parties: Party[];
  politicians: Politician[];
  selectedParty: Party | null;
  onSelectParty: (p: Party | null) => void;
  onViewPolitician: (p: Politician) => void;
}

export const PartiesDirectory: React.FC<PartiesDirectoryProps> = ({
  parties,
  politicians,
  selectedParty,
  onSelectParty,
  onViewPolitician
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpectrum, setSelectedSpectrum] = useState<string>('TODOS');

  const spectra = ['TODOS', 'Esquerda', 'Centro-Esquerda', 'Centro', 'Centro-Direita', 'Direita'];

  const filteredParties = parties.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.president.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.electoralNumber.toString().includes(searchTerm);

    const matchesSpectrum = selectedSpectrum === 'TODOS' || p.ideologySpectrum === selectedSpectrum;

    return matchesSearch && matchesSpectrum;
  });

  return (
    <div className="space-y-4">
      {/* Header - High Density */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-700 text-[10px] font-bold uppercase tracking-widest mb-0.5">
              <Building2 className="h-3.5 w-3.5" /> Partidos Políticos Brasileiros
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Histórico, Ideologia e Força Parlamentar
            </h2>
            <p className="text-slate-500 text-xs mt-0.5 max-w-3xl leading-relaxed">
              Consulte a história de fundação, fusões partidárias, estatutos, princípios programáticos e o tamanho das bancadas de cada legenda no Congresso Nacional e prefeituras.
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {spectra.map(s => (
              <button
                key={s}
                onClick={() => setSelectedSpectrum(s)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  selectedSpectrum === s
                    ? 'bg-emerald-700 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-3 relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            id="party-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por sigla (PT, PL, PSD...), nome do partido ou presidente..."
            className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 pl-8 pr-3 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>
      </div>

      {/* Parties Grid - High Density */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredParties.map(party => {
          const partyPoliticians = politicians.filter(p => p.party === party.acronym);

          return (
            <div
              key={party.id}
              id={`party-card-${party.id}`}
              className="bg-white border border-slate-200 hover:border-emerald-600 rounded-xl p-3.5 shadow-xs flex flex-col justify-between transition-all group"
            >
              <div className="space-y-2.5">
                {/* Header: Acronym + Electoral Number + Spectrum */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="h-9 w-9 rounded-lg flex items-center justify-center font-black text-sm text-white shadow-xs flex-shrink-0"
                      style={{ backgroundColor: party.colorHex }}
                    >
                      {party.acronym}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                        {party.name}
                      </h3>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Nº <strong className="text-slate-800">{party.electoralNumber}</strong> • Fundado em {party.foundationYear}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 flex-shrink-0">
                    {party.ideologySpectrum}
                  </span>
                </div>

                {/* President and Transparency Rating */}
                <div className="text-[11px] space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Presidência Nacional:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[160px]">{party.president}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Transparência Partidária:</span>
                    <span className="font-bold text-emerald-700">{party.transparencyRating}/100</span>
                  </div>
                </div>

                {/* Congress & Executive Representation Matrix */}
                <div className="grid grid-cols-4 gap-1 text-center text-xs">
                  <div className="bg-slate-50 p-1.5 rounded-md border border-slate-200">
                    <span className="text-[9px] text-slate-500 block">Deputados</span>
                    <span className="font-bold text-emerald-700 text-xs">{party.deputiesCount}</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-md border border-slate-200">
                    <span className="text-[9px] text-slate-500 block">Senadores</span>
                    <span className="font-bold text-blue-700 text-xs">{party.senatorsCount}</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-md border border-slate-200">
                    <span className="text-[9px] text-slate-500 block">Governadores</span>
                    <span className="font-bold text-amber-700 text-xs">{party.governorsCount}</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-md border border-slate-200">
                    <span className="text-[9px] text-slate-500 block">Prefeitos</span>
                    <span className="font-bold text-purple-700 text-xs">{party.mayorsCount}</span>
                  </div>
                </div>

                {/* Principles summary */}
                <div className="text-[11px] text-slate-600 line-clamp-2 leading-tight">
                  {party.historySummary}
                </div>
              </div>

              {/* Action */}
              <div className="mt-3 pt-2.5 border-t border-slate-100">
                <button
                  id={`view-party-details-${party.id}`}
                  onClick={() => onSelectParty(party)}
                  className="w-full bg-slate-100 hover:bg-emerald-700 hover:text-white text-slate-800 text-xs font-bold py-1.5 px-3 rounded-md transition-all flex items-center justify-center gap-1 border border-slate-200"
                >
                  <span>Ver Histórico e Estatuto</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Party Modal */}
      {selectedParty && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-4 bg-[#064E3B] text-white flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="h-12 w-12 rounded-lg flex items-center justify-center font-black text-xl text-white shadow-md border-2 border-yellow-400"
                  style={{ backgroundColor: selectedParty.colorHex }}
                >
                  {selectedParty.acronym}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white leading-tight">
                    {selectedParty.name}
                  </h3>
                  <div className="text-xs text-emerald-100 mt-0.5">
                    Nº Eleitoral <strong>{selectedParty.electoralNumber}</strong> • Espectro: <strong>{selectedParty.ideologySpectrum}</strong>
                  </div>
                  <div className="text-[11px] text-emerald-200/90">
                    Presidente Nacional: <strong>{selectedParty.president}</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectParty(null)}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-[#065F46] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-3.5 text-xs text-slate-700">
              
              {/* Historical Overview */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                <h4 className="font-bold text-emerald-800 uppercase tracking-wider text-[10px]">História e Origem</h4>
                <p className="text-xs leading-relaxed text-slate-700">{selectedParty.historySummary}</p>
                {selectedParty.fusionsHistory && (
                  <div className="text-[11px] text-slate-500 pt-1.5 border-t border-slate-200">
                    <strong>Fusões & Denominações Anteriores:</strong> {selectedParty.fusionsHistory}
                  </div>
                )}
              </div>

              {/* Main Ideological Principles */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">Diretrizes e Princípios Estatutários</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedParty.mainPrinciples.map((pr, idx) => (
                    <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-800 text-[11px]">{pr}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Associated Politicians in Platform */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">
                  Lideranças e Parlamentares Cadastrados ({politicians.filter(p => p.party === selectedParty.acronym).length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {politicians.filter(p => p.party === selectedParty.acronym).map(pol => (
                    <div
                      key={pol.id}
                      onClick={() => {
                        onSelectParty(null);
                        onViewPolitician(pol);
                      }}
                      className="bg-slate-50 hover:bg-slate-100 p-2 rounded-lg border border-slate-200 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <img src={pol.photo} alt={pol.name} className="h-7 w-7 rounded-md object-cover border border-slate-200" />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{pol.popularName}</div>
                          <div className="text-[10px] text-slate-500">{pol.role} ({pol.state})</div>
                        </div>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => onSelectParty(null)}
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
