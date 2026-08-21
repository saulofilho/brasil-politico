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
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-lg border-b border-slate-800">
      {/* Top Banner with Quick Highlights */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-xs py-1.5 px-4 text-emerald-100 flex items-center justify-between border-b border-emerald-800/40">
        <div className="flex items-center gap-2 font-medium">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>🇧🇷 <strong>Brasil Político</strong> — Portal Cívico de Transparência, Dados Oficiais & Guia Eleitoral</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-slate-300">
          <span>Fontes: TSE, STF, Câmara, Senado e TCU</span>
          <span className="text-emerald-400 font-mono">Dados Abertos Governamentais</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div 
            id="brand-logo"
            onClick={() => setActiveTab('mapa')}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-amber-400 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Vote className="h-6 w-6 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                Brasil<span className="text-amber-400">Político</span>
              </span>
              <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Radar Nacional & Cívico
              </span>
            </div>
          </div>

          {/* Search Bar with Intuitive Auto-complete */}
          <div ref={searchRef} className="relative flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                placeholder="Busque por político, partido (ex: PT, PL), estado (ex: SP, MG) ou lei..."
                className="w-full bg-slate-800/90 text-sm text-slate-100 placeholder-slate-400 pl-10 pr-10 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Dropdown Results */}
            {showSearchResults && searchQuery.trim() && (
              <div className="absolute left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto divide-y divide-slate-700/60">
                {!hasResults ? (
                  <div className="p-4 text-center text-sm text-slate-400">
                    Nenhum resultado encontrado para "{searchQuery}".
                  </div>
                ) : (
                  <>
                    {/* Politicians */}
                    {filteredPoliticians.length > 0 && (
                      <div className="p-2">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase px-2 py-1 flex items-center gap-1.5">
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
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-700/70 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <img src={p.photo} alt={p.name} className="h-7 w-7 rounded-full object-cover border border-slate-600" />
                              <div>
                                <div className="text-sm font-medium text-white">{p.popularName}</div>
                                <div className="text-xs text-slate-400">{p.party} • {p.role} ({p.state})</div>
                              </div>
                            </div>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                              Score: {p.integrityScore}/100
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Parties */}
                    {filteredParties.length > 0 && (
                      <div className="p-2">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase px-2 py-1 flex items-center gap-1.5">
                          <Building2 className="h-3 w-3 text-amber-400" /> Partidos
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
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-700/70 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="font-bold text-xs px-2 py-1 rounded bg-slate-900 border border-slate-700" style={{ color: party.colorHex }}>
                                {party.acronym}
                              </span>
                              <div>
                                <div className="text-sm font-medium text-white">{party.name}</div>
                                <div className="text-xs text-slate-400">Nº {party.electoralNumber} • {party.ideologySpectrum}</div>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-500" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* States */}
                    {filteredStates.length > 0 && (
                      <div className="p-2">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase px-2 py-1 flex items-center gap-1.5">
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
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-700/70 cursor-pointer transition-colors"
                          >
                            <div>
                              <div className="text-sm font-medium text-white">{state.name} ({state.uf})</div>
                              <div className="text-xs text-slate-400">Gov. {state.governor} ({state.governorParty}) • Capital: {state.capital}</div>
                            </div>
                            <span className="text-xs text-slate-400">{state.deputiesFederalCount} Dep. Federais</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Laws */}
                    {filteredLaws.length > 0 && (
                      <div className="p-2">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase px-2 py-1 flex items-center gap-1.5">
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
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-700/70 cursor-pointer transition-colors"
                          >
                            <div className="pr-2">
                              <div className="text-sm font-medium text-white">{law.code}: {law.title}</div>
                              <div className="text-xs text-slate-400">{law.status} • {law.category}</div>
                            </div>
                            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300">
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

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            
            {/* AI Civic Chat Advisor Button */}
            <button
              id="open-civic-ai-btn"
              onClick={onOpenCivicChat}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg shadow-md shadow-emerald-700/30 transition-all hover:shadow-lg active:scale-95"
            >
              <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">Assistente Cívico IA</span>
              <span className="sm:hidden">Tira-Dúvidas IA</span>
            </button>

            {/* Notifications Bell */}
            <div ref={notifRef} className="relative">
              <button
                id="notifications-toggle-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Notificações sobre Legislações e Consultas"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-amber-500 text-[10px] font-bold text-slate-950 flex items-center justify-center ring-2 ring-slate-900 animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="p-3 bg-slate-900 border-b border-slate-700/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-amber-400" />
                      <span className="text-sm font-bold text-white">Notificações Cívicas</span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-700/50">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
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
                          className={`p-3 text-left hover:bg-slate-700/60 cursor-pointer transition-colors ${
                            !n.isRead ? 'bg-emerald-950/30 border-l-2 border-emerald-500' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-semibold text-white leading-snug">{n.title}</h4>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.date}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">{n.summary}</p>
                          <div className="mt-1.5 flex items-center gap-2">
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900 text-emerald-400 border border-emerald-900/60">
                              {n.type.replace('_', ' ')}
                            </span>
                            {!n.isRead && (
                              <span className="text-[10px] text-amber-400 font-medium flex items-center gap-1">
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

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
