import React, { useState } from 'react';
import { 
  MapPin, 
  Users, 
  Building2, 
  Award, 
  TrendingUp, 
  ChevronRight, 
  Info,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { StateData, RegionName, Politician } from '../types';

interface BrazilMapProps {
  states: StateData[];
  selectedState: StateData | null;
  onSelectState: (state: StateData) => void;
  onViewPoliticiansOfState: (uf: string) => void;
  politicians: Politician[];
}

// Geometric SVG layout representation of Brazil's 27 federative units with accurate topological placement
interface SvgStateNode {
  uf: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  region: RegionName;
}

const BRAZIL_STATE_NODES: SvgStateNode[] = [
  // Norte
  { uf: 'RR', name: 'Roraima', x: 190, y: 30, w: 56, h: 44, region: 'Norte' },
  { uf: 'AP', name: 'Amapá', x: 340, y: 40, w: 52, h: 42, region: 'Norte' },
  { uf: 'AM', name: 'Amazonas', x: 100, y: 90, w: 105, h: 65, region: 'Norte' },
  { uf: 'PA', name: 'Pará', x: 230, y: 85, w: 95, h: 70, region: 'Norte' },
  { uf: 'AC', name: 'Acre', x: 30, y: 155, w: 60, h: 42, region: 'Norte' },
  { uf: 'RO', name: 'Rondônia', x: 110, y: 170, w: 64, h: 48, region: 'Norte' },
  { uf: 'TO', name: 'Tocantins', x: 290, y: 170, w: 52, h: 62, region: 'Norte' },

  // Nordeste
  { uf: 'MA', name: 'Maranhão', x: 345, y: 105, w: 60, h: 58, region: 'Nordeste' },
  { uf: 'PI', name: 'Piauí', x: 395, y: 135, w: 52, h: 58, region: 'Nordeste' },
  { uf: 'CE', name: 'Ceará', x: 445, y: 105, w: 50, h: 48, region: 'Nordeste' },
  { uf: 'RN', name: 'Rio Grande do Norte', x: 495, y: 115, w: 52, h: 36, region: 'Nordeste' },
  { uf: 'PB', name: 'Paraíba', x: 495, y: 155, w: 52, h: 32, region: 'Nordeste' },
  { uf: 'PE', name: 'Pernambuco', x: 480, y: 190, w: 66, h: 34, region: 'Nordeste' },
  { uf: 'AL', name: 'Alagoas', x: 500, y: 228, w: 46, h: 28, region: 'Nordeste' },
  { uf: 'SE', name: 'Sergipe', x: 485, y: 258, w: 44, h: 26, region: 'Nordeste' },
  { uf: 'BA', name: 'Bahia', x: 390, y: 205, w: 85, h: 80, region: 'Nordeste' },

  // Centro-Oeste
  { uf: 'MT', name: 'Mato Grosso', x: 195, y: 175, w: 80, h: 72, region: 'Centro-Oeste' },
  { uf: 'GO', name: 'Goiás', x: 275, y: 245, w: 62, h: 58, region: 'Centro-Oeste' },
  { uf: 'DF', name: 'Distrito Federal', x: 340, y: 252, w: 36, h: 30, region: 'Centro-Oeste' },
  { uf: 'MS', name: 'Mato Grosso do Sul', x: 200, y: 260, w: 68, h: 62, region: 'Centro-Oeste' },

  // Sudeste
  { uf: 'MG', name: 'Minas Gerais', x: 345, y: 295, w: 82, h: 70, region: 'Sudeste' },
  { uf: 'ES', name: 'Espírito Santo', x: 435, y: 310, w: 45, h: 38, region: 'Sudeste' },
  { uf: 'RJ', name: 'Rio de Janeiro', x: 405, y: 365, w: 55, h: 34, region: 'Sudeste' },
  { uf: 'SP', name: 'São Paulo', x: 300, y: 330, w: 75, h: 55, region: 'Sudeste' },

  // Sul
  { uf: 'PR', name: 'Paraná', x: 275, y: 390, w: 68, h: 46, region: 'Sul' },
  { uf: 'SC', name: 'Santa Catarina', x: 285, y: 440, w: 65, h: 42, region: 'Sul' },
  { uf: 'RS', name: 'Rio Grande do Sul', x: 260, y: 485, w: 75, h: 55, region: 'Sul' }
];

const REGION_COLORS: Record<RegionName, { bg: string; border: string; hover: string; text: string; fill: string }> = {
  'Norte': { bg: 'bg-emerald-950/60', border: 'border-emerald-700', hover: 'hover:fill-emerald-600', text: 'text-emerald-300', fill: '#065f46' },
  'Nordeste': { bg: 'bg-amber-950/60', border: 'border-amber-700', hover: 'hover:fill-amber-600', text: 'text-amber-300', fill: '#92400e' },
  'Centro-Oeste': { bg: 'bg-orange-950/60', border: 'border-orange-700', hover: 'hover:fill-orange-600', text: 'text-orange-300', fill: '#9a3412' },
  'Sudeste': { bg: 'bg-blue-950/60', border: 'border-blue-700', hover: 'hover:fill-blue-600', text: 'text-blue-300', fill: '#1e40af' },
  'Sul': { bg: 'bg-cyan-950/60', border: 'border-cyan-700', hover: 'hover:fill-cyan-600', text: 'text-cyan-300', fill: '#0e7490' }
};

export const BrazilMap: React.FC<BrazilMapProps> = ({
  states,
  selectedState,
  onSelectState,
  onViewPoliticiansOfState,
  politicians
}) => {
  const [activeRegion, setActiveRegion] = useState<RegionName | 'Todas'>('Todas');
  const [hoveredUf, setHoveredUf] = useState<string | null>(null);

  const activeState = selectedState || states.find(s => s.uf === 'SP') || states[0];

  const statePoliticians = politicians.filter(p => p.state === activeState.uf);

  const filteredNodes = activeRegion === 'Todas' 
    ? BRAZIL_STATE_NODES 
    : BRAZIL_STATE_NODES.filter(n => n.region === activeRegion);

  const regionsList: (RegionName | 'Todas')[] = ['Todas', 'Sudeste', 'Nordeste', 'Sul', 'Norte', 'Centro-Oeste'];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <MapPin className="h-4 w-4" /> Mapa Federativo Interativo
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Panorama Político dos 26 Estados e DF
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Clique em qualquer estado no mapa ou na lista para inspecionar governadores, senadores, bancadas federais, ranking de transparência pública e pautas prioritárias.
            </p>
          </div>

          {/* Region Tabs Filter */}
          <div className="flex items-center gap-1.5 flex-wrap bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 self-start lg:self-center">
            {regionsList.map(r => (
              <button
                key={r}
                id={`region-filter-${r.toLowerCase()}`}
                onClick={() => setActiveRegion(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeRegion === r
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map + State Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive SVG Stage (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-bold text-white">Mapa Cartográfico Interativo</span>
            </div>
            <div className="text-xs text-slate-400">
              {hoveredUf ? `UF: ${hoveredUf}` : 'Passe o cursor ou toque no estado'}
            </div>
          </div>

          {/* SVG Map Container */}
          <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-slate-950 to-slate-900 rounded-xl border border-slate-800 p-2 sm:p-4 flex items-center justify-center">
            <svg 
              viewBox="0 0 570 560" 
              className="w-full h-full max-h-[500px] select-none"
              style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))' }}
            >
              {/* Background grid lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.4" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* State Nodes */}
              {BRAZIL_STATE_NODES.map((node) => {
                const isSelected = activeState.uf === node.uf;
                const isHovered = hoveredUf === node.uf;
                const isDimmed = activeRegion !== 'Todas' && node.region !== activeRegion;
                const regColor = REGION_COLORS[node.region];
                const stateData = states.find(s => s.uf === node.uf);

                return (
                  <g
                    key={node.uf}
                    id={`state-svg-${node.uf.toLowerCase()}`}
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => {
                      if (stateData) onSelectState(stateData);
                    }}
                    onMouseEnter={() => setHoveredUf(node.uf)}
                    onMouseLeave={() => setHoveredUf(null)}
                    style={{ opacity: isDimmed ? 0.25 : 1 }}
                  >
                    {/* State Rect Box with rounded aesthetic */}
                    <rect
                      x={node.x}
                      y={node.y}
                      width={node.w}
                      height={node.h}
                      rx={8}
                      fill={isSelected ? '#10b981' : isHovered ? '#059669' : regColor.fill}
                      stroke={isSelected ? '#34d399' : isHovered ? '#ffffff' : '#334155'}
                      strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
                      className="transition-all duration-200"
                    />

                    {/* State UF Text */}
                    <text
                      x={node.x + node.w / 2}
                      y={node.y + node.h / 2 + (node.h > 40 ? -4 : 4)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={isSelected ? '#022c22' : '#ffffff'}
                      fontWeight="bold"
                      fontSize={node.w > 60 ? 14 : 11}
                      className="pointer-events-none"
                    >
                      {node.uf}
                    </text>

                    {/* State Deputies Count Pill inside Node if space */}
                    {node.h > 45 && stateData && (
                      <text
                        x={node.x + node.w / 2}
                        y={node.y + node.h / 2 + 13}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={isSelected ? '#064e3b' : '#94a3b8'}
                        fontSize={9}
                        fontWeight="600"
                        className="pointer-events-none"
                      >
                        {stateData.deputiesFederalCount} Dep.
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Floating State Tooltip on Hover */}
            {hoveredUf && (
              <div className="absolute top-4 left-4 bg-slate-900/95 backdrop-blur-md border border-slate-700 px-3 py-2 rounded-lg shadow-xl pointer-events-none z-10 text-xs">
                <span className="font-bold text-white">{states.find(s => s.uf === hoveredUf)?.name || hoveredUf} ({hoveredUf})</span>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Gov: {states.find(s => s.uf === hoveredUf)?.governor} ({states.find(s => s.uf === hoveredUf)?.governorParty})
                </div>
              </div>
            )}
          </div>

          {/* Quick UF Badges scrollbar below map */}
          <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {states.map(s => (
              <button
                key={s.uf}
                id={`btn-uf-${s.uf.toLowerCase()}`}
                onClick={() => onSelectState(s)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                  activeState.uf === s.uf
                    ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400 font-extrabold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {s.uf}
              </button>
            ))}
          </div>
        </div>

        {/* Selected State Inspector Card (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-5">
            {/* Header with UF and Capital */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-white">{activeState.name}</span>
                  <span className="bg-emerald-950 text-emerald-300 font-mono font-bold text-xs px-2.5 py-1 rounded-lg border border-emerald-800">
                    {activeState.uf}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                  <span>Região: <strong className="text-slate-200">{activeState.region}</strong></span>
                  <span>•</span>
                  <span>Capital: <strong className="text-slate-200">{activeState.capital}</strong></span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Transparência</div>
                <div className="text-lg font-extrabold text-amber-400 flex items-center justify-end gap-1">
                  <Award className="h-4 w-4" /> #{activeState.transparencyRank}º <span className="text-xs text-slate-400 font-normal">/ 27</span>
                </div>
              </div>
            </div>

            {/* Executive Leadership */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-emerald-400" /> Poder Executivo Estadual
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Governador(a):</span>
                <span className="text-sm font-bold text-white">
                  {activeState.governor} <span className="text-xs font-semibold text-emerald-400">({activeState.governorParty})</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Vice-Governador(a):</span>
                <span className="text-xs font-medium text-slate-300">{activeState.viceGovernor}</span>
              </div>
            </div>

            {/* Senators for this State */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-cyan-400" /> Bancada no Senado Federal (3 vagas)
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {activeState.senators.map((sen, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                    <span className="font-medium text-slate-200">{sen.name}</span>
                    <span className="font-bold text-cyan-400 text-[11px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-900">
                      {sen.party}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Electoral Stats & Federal Deputies */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Eleitorado Ativo</div>
                <div className="text-lg font-bold text-white mt-0.5">
                  {activeState.electorateSize} <span className="text-xs font-normal text-slate-400">milhões</span>
                </div>
              </div>
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Deputados Federais</div>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">
                  {activeState.deputiesFederalCount} <span className="text-xs font-normal text-slate-400">cadeiras</span>
                </div>
              </div>
            </div>

            {/* Key Regional Issues */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-amber-400" /> Pautas & Prioridades Regionais
              </div>
              <ul className="space-y-1.5">
                {activeState.keyIssues.map((issue, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action to Explore State's Politicians */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              id={`view-politicians-${activeState.uf.toLowerCase()}-btn`}
              onClick={() => onViewPoliticiansOfState(activeState.uf)}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-900/40 transition-all active:scale-95"
            >
              <span>Ver Políticos e Candidatos de {activeState.name}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
