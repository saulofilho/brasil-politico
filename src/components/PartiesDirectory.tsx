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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Building2 className="h-4 w-4" /> Partidos Políticos Brasileiros
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Histórico, Ideologia e Força Parlamentar
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Consulte a história de fundação, fusões partidárias, estatutos, princípios programáticos e o tamanho das bancadas de cada legenda no Congresso Nacional e prefeituras.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {spectra.map(s => (
              <button
                key={s}
                onClick={() => setSelectedSpectrum(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedSpectrum === s
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-5 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="party-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por sigla (PT, PL, PSD...), nome do partido ou presidente..."
            className="w-full bg-slate-950 text-xs text-slate-100 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Parties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParties.map(party => {
          const partyPoliticians = politicians.filter(p => p.party === party.acronym);

          return (
            <div
              key={party.id}
              id={`party-card-${party.id}`}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between transition-all hover:shadow-2xl group"
            >
              <div className="space-y-4">
                {/* Header: Acronym + Electoral Number + Spectrum */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-lg"
                      style={{ backgroundColor: party.colorHex }}
                    >
                      {party.acronym}
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                        {party.name}
                      </h3>
                      <div className="text-xs text-slate-400 font-mono">
                        Nº Eleitoral: <strong className="text-slate-200">{party.electoralNumber}</strong> • Fundado em {party.foundationYear}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-950 text-slate-300 border border-slate-800">
                    {party.ideologySpectrum}
                  </span>
                </div>

                {/* President and Transparency Rating */}
                <div className="text-xs space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Presidência Nacional:</span>
                    <span className="font-bold text-slate-200">{party.president}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Transparência Partidária:</span>
                    <span className="font-bold text-emerald-400">{party.transparencyRating}/100</span>
                  </div>
                </div>

                {/* Congress & Executive Representation Matrix */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Deputados</span>
                    <span className="font-bold text-emerald-400 text-sm">{party.deputiesCount}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Senadores</span>
                    <span className="font-bold text-cyan-400 text-sm">{party.senatorsCount}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Governadores</span>
                    <span className="font-bold text-amber-400 text-sm">{party.governorsCount}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Prefeitos</span>
                    <span className="font-bold text-purple-400 text-sm">{party.mayorsCount}</span>
                  </div>
                </div>

                {/* Principles summary */}
                <div className="text-xs text-slate-400 line-clamp-2">
                  {party.historySummary}
                </div>
              </div>

              {/* Action */}
              <div className="mt-5 pt-3 border-t border-slate-800">
                <button
                  id={`view-party-details-${party.id}`}
                  onClick={() => onSelectParty(party)}
                  className="w-full bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Ver Histórico e Estatuto Completo</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Party Modal */}
      {selectedParty && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 border-b border-slate-800 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div 
                  className="h-16 w-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-xl"
                  style={{ backgroundColor: selectedParty.colorHex }}
                >
                  {selectedParty.acronym}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    {selectedParty.name}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Nº Eleitoral <strong>{selectedParty.electoralNumber}</strong> • Espectro: <strong>{selectedParty.ideologySpectrum}</strong>
                  </div>
                  <div className="text-xs text-slate-400">
                    Presidente Nacional: <strong>{selectedParty.president}</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectParty(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-5 text-xs text-slate-300">
              
              {/* Historical Overview */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-xs">História e Origem</h4>
                <p className="text-sm leading-relaxed text-slate-300">{selectedParty.historySummary}</p>
                {selectedParty.fusionsHistory && (
                  <div className="text-xs text-slate-400 pt-2 border-t border-slate-900">
                    <strong>Fusões & Denominações Anteriores:</strong> {selectedParty.fusionsHistory}
                  </div>
                )}
              </div>

              {/* Main Ideological Principles */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-400 uppercase tracking-wider text-xs">Diretrizes e Princípios Estatutários</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedParty.mainPrinciples.map((pr, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-200">{pr}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Associated Politicians in Platform */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-400 uppercase tracking-wider text-xs">
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
                      className="bg-slate-950 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <img src={pol.photo} alt={pol.name} className="h-8 w-8 rounded-full object-cover" />
                        <div>
                          <div className="font-bold text-white text-xs">{pol.popularName}</div>
                          <div className="text-[10px] text-slate-400">{pol.role} ({pol.state})</div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => onSelectParty(null)}
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
