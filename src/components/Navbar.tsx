import React, { useState, useRef, useEffect } from 'react';
import { 
  Vote, 
  Search, 
  Bell, 
  Scale, 
  ShieldCheck, 
  MapPin, 
  Users, 
  FileText, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Building2,
  X,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { NotificationItem, Politician, Party, StateData, Legislation } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: NotificationItem[];
  onMarkNotificationAsRead: (id: string) => void;
  onOpenCivicChat: () => void;
  allPoliticians: Politician[];
  allParties: Party[];
  allStates: StateData[];
  allLaws: Legislation[];
  onSelectPolitician: (p: Politician) => void;
  onSelectParty: (party: Party) => void;
  onSelectState: (state: StateData) => void;
  onSelectLaw: (law: Legislation) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  notifications,
  onMarkNotificationAsRead,
  onOpenCivicChat,
  allPoliticians,
  allParties,
  allStates,
  allLaws,
  onSelectPolitician,
  onSelectParty,
  onSelectState,
  onSelectLaw
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search results across all entities
  const filteredPoliticians = searchQuery.trim()
    ? allPoliticians.filter(p => 
        p.popularName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.party.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.state.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const filteredParties = searchQuery.trim()
    ? allParties.filter(p => 
        p.acronym.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const filteredStates = searchQuery.trim()
    ? allStates.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.uf.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.capital.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const filteredLaws = searchQuery.trim()
    ? allLaws.filter(l => 
        l.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.title.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const hasResults = filteredPoliticians.length > 0 || filteredParties.length > 0 || filteredStates.length > 0 || filteredLaws.length > 0;

  const navItems = [
    { id: 'mapa', label: 'Mapa & Estados', icon: MapPin },
    { id: 'politicos', label: 'Políticos', icon: Users },
    { id: 'partidos', label: 'Partidos', icon: Building2 },
    { id: 'integridade', label: 'Integridade & Processos', icon: Scale },
    { id: 'fakenews', label: 'Combate a Fake News', icon: ShieldCheck },
    { id: 'leis', label: 'Leis & Consultas', icon: FileText },
    { id: 'eleicoes', label: 'Eleições & Simulador', icon: Vote },
    { id: 'forum', label: 'Fórum Cívico', icon: MessageSquare }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#064E3B] text-white shadow-md border-b border-emerald-900/60">
      {/* Top Banner with Quick Highlights - High Density */}
      <div className="bg-[#043d2e] text-[11px] py-1 px-4 text-emerald-100 flex items-center justify-between border-b border-emerald-800/50">
        <div className="flex items-center gap-2 font-medium">
          <span className="flex h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
          <span><strong>Vigília Cidadã / Brasil Político</strong> — Radar Cívico & Transparência Pública</span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-[10px] text-emerald-200/90">
          <span>TSE • STF • Câmara • Senado • TCU</span>
          <span className="bg-emerald-950/80 text-yellow-300 px-1.5 py-0.5 rounded border border-emerald-800 text-[9px] font-bold uppercase tracking-wider">
            Dados Abertos
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 gap-3">
          
          {/* Logo */}
          <div 
            id="brand-logo"
            onClick={() => setActiveTab('mapa')}
            className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
          >
            <div className="w-8 h-8 bg-yellow-400 rounded-md flex items-center justify-center font-black text-[#064E3B] text-sm shadow-sm group-hover:scale-105 transition-transform">
              BR
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1 leading-none">
                Brasil<span className="text-yellow-400">Político</span>
              </span>
              <span className="block text-[9px] text-emerald-200/80 font-semibold tracking-wider uppercase mt-0.5">
                Vigília Cidadã
              </span>
            </div>
          </div>

          {/* Search Bar with High Density Auto-complete */}
          <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-emerald-200" />
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                placeholder="Busque políticos, partidos (ex: PT, PL), estados ou leis..."
                className="w-full bg-[#065F46] border border-emerald-700/80 text-white rounded-full py-1.5 pl-8 pr-8 placeholder-emerald-200/70 text-xs focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-200 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown Results */}
            {showSearchResults && searchQuery.trim() && (
              <div className="absolute left-0 right-0 mt-1.5 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto divide-y divide-slate-800">
                {!hasResults ? (
                  <div className="p-3 text-center text-xs text-slate-400">
                    Nenhum resultado encontrado para "{searchQuery}".
                  </div>
                ) : (
                  <>
                    {/* Politicians */}
                    {filteredPoliticians.length > 0 && (
                      <div className="p-1.5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-0.5 flex items-center gap-1">
                          <Users className="h-3 w-3 text-emerald-400" /> Políticos
                        </div>
                        {filteredPoliticians.map(p => (
                          <div
                            key={p.id}
                            onClick={() => {
                              onSelectPolitician(p);
                              setShowSearchResults(false);
                              setSearchQuery('');
                              setActiveTab('politicos');
                            }}
                            className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <img src={p.photo} alt={p.name} className="h-6 w-6 rounded-full object-cover border border-slate-700" />
                              <div>
                                <div className="text-xs font-semibold text-white">{p.popularName}</div>
                                <div className="text-[10px] text-slate-400">{p.party} • {p.role} ({p.state})</div>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                              {p.integrityScore}/100
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Parties */}
                    {filteredParties.length > 0 && (
                      <div className="p-1.5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-0.5 flex items-center gap-1">
                          <Building2 className="h-3 w-3 text-yellow-400" /> Partidos
                        </div>
                        {filteredParties.map(party => (
                          <div
                            key={party.id}
                            onClick={() => {
                              onSelectParty(party);
                              setShowSearchResults(false);
                              setSearchQuery('');
                              setActiveTab('partidos');
                            }}
                            className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[10px] px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700" style={{ color: party.colorHex }}>
                                {party.acronym}
                              </span>
                              <div>
                                <div className="text-xs font-medium text-white">{party.name}</div>
                                <div className="text-[10px] text-slate-400">Nº {party.electoralNumber} • {party.ideologySpectrum}</div>
                              </div>
                            </div>
                            <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* States */}
                    {filteredStates.length > 0 && (
                      <div className="p-1.5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-0.5 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-cyan-400" /> Estados / UF
                        </div>
                        {filteredStates.map(state => (
                          <div
                            key={state.uf}
                            onClick={() => {
                              onSelectState(state);
                              setShowSearchResults(false);
                              setSearchQuery('');
                              setActiveTab('mapa');
                            }}
                            className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800 cursor-pointer transition-colors"
                          >
                            <div>
                              <div className="text-xs font-medium text-white">{state.name} ({state.uf})</div>
                              <div className="text-[10px] text-slate-400">Gov. {state.governor} ({state.governorParty})</div>
                            </div>
                            <span className="text-[10px] text-slate-400">{state.deputiesFederalCount} Dep.</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Laws */}
                    {filteredLaws.length > 0 && (
                      <div className="p-1.5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-0.5 flex items-center gap-1">
                          <FileText className="h-3 w-3 text-purple-400" /> Legislação & Projetos
                        </div>
                        {filteredLaws.map(law => (
                          <div
                            key={law.id}
                            onClick={() => {
                              onSelectLaw(law);
                              setShowSearchResults(false);
                              setSearchQuery('');
                              setActiveTab('leis');
                            }}
                            className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800 cursor-pointer transition-colors"
                          >
                            <div className="pr-2">
                              <div className="text-xs font-medium text-white">{law.code}: {law.title}</div>
                              <div className="text-[10px] text-slate-400">{law.status}</div>
                            </div>
                            <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-slate-950 text-slate-300">
                              {law.chamber.includes('Senado') ? 'Senado' : 'Câmara'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons & Election Status Badge */}
          <div className="flex items-center gap-2.5">
            
            {/* Election Status Badge */}
            <div className="hidden lg:flex flex-col items-end pr-2 border-r border-emerald-700/60">
              <span className="text-[9px] uppercase tracking-wider text-emerald-200/80 leading-none">Próxima Eleição</span>
              <span className="text-xs font-black text-yellow-400 tracking-tight">OUT 2026</span>
            </div>

            {/* AI Civic Chat Advisor Button */}
            <button
              id="open-civic-ai-btn"
              onClick={onOpenCivicChat}
              className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-[#064E3B] text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-sm transition-all active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#064E3B] animate-pulse" />
              <span className="hidden sm:inline">Assistente Cívico IA</span>
              <span className="sm:hidden">IA</span>
            </button>

            {/* Notifications Bell */}
            <div ref={notifRef} className="relative">
              <button
                id="notifications-toggle-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-800 transition-colors"
                title="Notificações sobre Legislações e Consultas"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-yellow-400 text-[9px] font-black text-[#064E3B] flex items-center justify-center ring-1 ring-emerald-950">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-50">
                  <div className="p-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Bell className="h-3.5 w-3.5 text-yellow-400" />
                      <span className="text-xs font-bold text-white">Notificações Cívicas</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/80">
                    {notifications.length === 0 ? (
                      <div className="p-3 text-center text-xs text-slate-400">
                        Nenhuma notificação no momento.
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            onMarkNotificationAsRead(n.id);
                            if (n.type === 'consulta_popular' || n.type === 'legislacao') {
                              setActiveTab('leis');
                            } else if (n.type === 'fake_news') {
                              setActiveTab('fakenews');
                            } else if (n.type === 'eleicoes') {
                              setActiveTab('eleicoes');
                            }
                            setShowNotifications(false);
                          }}
                          className={`p-2.5 text-left hover:bg-slate-800/80 cursor-pointer transition-colors ${
                            !n.isRead ? 'bg-emerald-950/40 border-l-2 border-yellow-400' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-semibold text-white leading-snug">{n.title}</h4>
                            <span className="text-[9px] text-slate-400 whitespace-nowrap">{n.date}</span>
                          </div>
                          <p className="text-[10px] text-slate-300 mt-0.5 line-clamp-2">{n.summary}</p>
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-slate-950 text-emerald-400 border border-emerald-900/60">
                              {n.type.replace('_', ' ')}
                            </span>
                            {!n.isRead && (
                              <span className="text-[9px] text-yellow-400 font-bold flex items-center gap-1">
                                • Nova
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar - High Density Compact */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-1.5 scrollbar-none border-t border-emerald-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-yellow-400 text-[#064E3B] font-bold shadow-xs'
                    : 'text-emerald-100 hover:text-white hover:bg-[#065F46]'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#064E3B]' : 'text-emerald-200'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
