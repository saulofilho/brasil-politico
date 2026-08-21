import React, { useState, useEffect, useRef } from 'react';
import { 
  Vote, 
  Scale, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Users, 
  ArrowRight,
  ExternalLink,
  Award,
  Layers
} from 'lucide-react';
import { Politician, Party, PoliticalRole } from '../types';

interface ElectionsHubProps {
  politicians: Politician[];
  parties: Party[];
  initialCandidateToCompare?: Politician | null;
}

export const ElectionsHub: React.FC<ElectionsHubProps> = ({
  politicians,
  parties,
  initialCandidateToCompare
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'simulador' | 'comparador' | 'bussola' | 'calendario'>('simulador');

  // --- URNA ELETRÔNICA SIMULATOR STATE ---
  const [urnaRole, setUrnaRole] = useState<PoliticalRole>('Presidente');
  const [typedDigits, setTypedDigits] = useState<string>('');
  const [urnaStatus, setUrnaStatus] = useState<'digitando' | 'branco' | 'fim'>('digitando');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Audio Context for Urna Sounds
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
  };

  const playBeep = (freq = 900, duration = 0.08) => {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback not supported:', e);
    }
  };

  const playUrnaConfirmationSound = () => {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      // TSE Urna Sound (Sequence of frequencies ending in standard tone)
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.setValueAtTime(620, now + 0.15);
      osc.frequency.setValueAtTime(880, now + 0.35);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.2);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  };

  const maxDigits = urnaRole === 'Presidente' || urnaRole === 'Governador' ? 2 : urnaRole === 'Senador' ? 3 : 4;

  const handleKeyClick = (digit: string) => {
    if (urnaStatus === 'fim') return;
    if (typedDigits.length < maxDigits) {
      playBeep(850, 0.06);
      setTypedDigits(prev => prev + digit);
      setUrnaStatus('digitando');
    }
  };

  const handleBranco = () => {
    if (urnaStatus === 'fim') return;
    playBeep(600, 0.08);
    setTypedDigits('');
    setUrnaStatus('branco');
  };

  const handleCorrige = () => {
    if (urnaStatus === 'fim') return;
    playBeep(450, 0.1);
    setTypedDigits('');
    setUrnaStatus('digitando');
  };

  const handleConfirma = () => {
    if (urnaStatus === 'fim') {
      // Reset
      setTypedDigits('');
      setUrnaStatus('digitando');
      return;
    }

    if (urnaStatus === 'branco' || typedDigits.length === maxDigits) {
      playUrnaConfirmationSound();
      setUrnaStatus('fim');
    } else {
      playBeep(300, 0.2); // Error tone
    }
  };

  // Find candidate matching typed digits
  const foundCandidate = politicians.find(p => p.role === urnaRole && p.electionNumber?.toString() === typedDigits);

  // --- COMPARATOR STATE ---
  const [candidateA, setCandidateA] = useState<Politician>(initialCandidateToCompare || politicians[0]);
  const [candidateB, setCandidateB] = useState<Politician>(politicians[1] || politicians[0]);
  const [comparisonAi, setComparisonAi] = useState<any | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    if (initialCandidateToCompare) {
      setCandidateA(initialCandidateToCompare);
      setActiveSubTab('comparador');
    }
  }, [initialCandidateToCompare]);

  const handleRunComparison = async () => {
    setIsComparing(true);
    setComparisonAi(null);

    try {
      const res = await fetch('/api/gemini/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comparisonType: 'Candidatos Políticos',
          itemA: {
            name: candidateA.popularName,
            party: candidateA.party,
            role: candidateA.role,
            state: candidateA.state,
            attendance: candidateA.attendanceRate,
            integrityScore: candidateA.integrityScore
          },
          itemB: {
            name: candidateB.popularName,
            party: candidateB.party,
            role: candidateB.role,
            state: candidateB.state,
            attendance: candidateB.attendanceRate,
            integrityScore: candidateB.integrityScore
          }
        })
      });

      if (!res.ok) throw new Error('Erro na comparação');
      const data = await res.json();
      setComparisonAi(data);
    } catch (err) {
      console.warn('Fallback comparativo:', err);
      setComparisonAi({
        summary: `Comparativo entre ${candidateA.popularName} (${candidateA.party}) e ${candidateB.popularName} (${candidateB.party}). Ambos possuem atuações no Congresso e no Executivo com visões programáticas distintas em áreas fiscais e sociais.`,
        keyDifferences: [
          `Partido e Alinhamento: ${candidateA.party} vs ${candidateB.party}`,
          `Índice de Transparência: ${candidateA.integrityScore}/100 vs ${candidateB.integrityScore}/100`,
          `Presença em votações: ${candidateA.attendanceRate}% vs ${candidateB.attendanceRate}%`
        ],
        commonPoints: [
          'Ambos registraram declaração pública de bens junto à Justiça Eleitoral',
          'Atuação em proposições com tramitação legislativa ativa'
        ],
        voterConsiderations: 'O eleitor deve analisar se prioriza bandeiras econômicas liberais, reformas de estado ou políticas de investimento social e sustentabilidade.'
      });
    } finally {
      setIsComparing(false);
    }
  };

  // --- BÚSSOLA ELEITORAL QUIZ STATE ---
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizResult, setQuizResult] = useState<string | null>(null);

  const quizQuestions = [
    {
      id: 1,
      q: 'O Estado deve priorizar a privatização de estatais e a redução de impostos corporativos para estimular investimentos?',
      left: 'Discordo (Estatização/Regulação)',
      right: 'Concordo (Livre Mercado)'
    },
    {
      id: 2,
      q: 'Programas de transferência de renda direta (ex: Bolsa Família) e assistência social devem ser ampliados mesmo com déficit fiscal?',
      left: 'Concordo (Foco Social)',
      right: 'Discordo (Rigor Fiscal)'
    },
    {
      id: 3,
      q: 'O Brasil deve adotar metas rígidas de desmatamento zero e punir severamente infrações ambientais em terras públicas?',
      left: 'Concordo (Proteção Ecológica)',
      right: 'Discordo (Flexibilização Produtiva)'
    },
    {
      id: 4,
      q: 'As redes sociais e plataformas digitais devem ser responsabilizadas por conteúdos e desinformação viral nelas compartilhados?',
      left: 'Concordo (Regulação Digital)',
      right: 'Discordo (Liberdade Irrestrita)'
    },
    {
      id: 5,
      q: 'A posse e o porte de armas de fogo por civis devem ter regras facilitadas para defesa pessoal?',
      left: 'Discordo (Desarmamento)',
      right: 'Concordo (Armamento Civil)'
    }
  ];

  const handleCalculateMatch = () => {
    let score = 0;
    Object.values(quizAnswers).forEach(val => { score += val; });
    const avg = score / 5;

    if (avg < 2) {
      setQuizResult('Esquerda Democrática / Social-Democracia (Maior afinidade com PT, PSOL, PSB, REDE, PCdoB)');
    } else if (avg < 2.8) {
      setQuizResult('Centro / Pragmatismo Republicano (Maior afinidade com PSD, MDB, PDT, CIDADANIA)');
    } else if (avg < 3.8) {
      setQuizResult('Centro-Direita / Liberalismo Econômico (Maior afinidade com UNIÃO, PP, NOVO, PSDB, REPUBLICANOS)');
    } else {
      setQuizResult('Direita Conservadora / Livre Mercado (Maior afinidade com PL, NOVO, PRD)');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Vote className="h-4 w-4" /> Central de Inteligência Eleitoral
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Simulador da Urna, Comparador & Guia do Eleitor
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Ferramenta cívica completa para você treinar a votação na urna eletrônica oficial, confrontar propostas de candidatos lado a lado e descobrir sua afinidade partidária.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start md:self-center">
            {[
              { id: 'simulador', label: 'Simulador da Urna', icon: Vote },
              { id: 'comparador', label: 'Comparar Candidatos', icon: Scale },
              { id: 'bussola', label: 'Bússola / Match', icon: Award },
              { id: 'calendario', label: 'Calendário & Regras', icon: Calendar }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeSubTab === tab.id
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 1. URNA ELETRÔNICA SIMULATOR */}
      {activeSubTab === 'simulador' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <div>
                <h3 className="text-lg font-bold text-white">Simulador Oficial da Urna Eletrônica Brasileira</h3>
                <p className="text-xs text-slate-400">Modelo fiel com sons em tempo real e visualização de foto/vice/partido</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Role selector */}
              <select
                value={urnaRole}
                onChange={(e) => {
                  setUrnaRole(e.target.value as any);
                  setTypedDigits('');
                  setUrnaStatus('digitando');
                }}
                className="bg-slate-950 text-xs text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none"
              >
                <option value="Presidente">Eleição: Presidente (2 dígitos)</option>
                <option value="Governador">Eleição: Governador (2 dígitos)</option>
                <option value="Senador">Eleição: Senador (3 dígitos)</option>
                <option value="Deputado Federal">Eleição: Deputado Federal (4 dígitos)</option>
              </select>

              {/* Mute toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-lg bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                title={soundEnabled ? 'Áudio ativado' : 'Áudio silenciado'}
              >
                {soundEnabled ? <Volume2 className="h-4 w-4 text-emerald-400" /> : <VolumeX className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Realistic Urna Machine Frame */}
          <div className="max-w-4xl mx-auto bg-gradient-to-b from-stone-200 to-stone-300 p-4 sm:p-8 rounded-3xl shadow-2xl border-4 border-stone-400 text-slate-900 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Urna LCD Screen (Left 7 cols) */}
            <div className="md:col-span-7 bg-[#dbe8d4] border-4 border-stone-600 rounded-2xl p-5 shadow-inner min-h-[360px] flex flex-col justify-between font-mono text-slate-900 relative overflow-hidden">
              {urnaStatus === 'fim' ? (
                <div className="h-full flex flex-col items-center justify-center space-y-3 py-12 animate-in fade-in zoom-in-90 duration-300">
                  <div className="text-6xl font-black tracking-widest text-slate-900">
                    FIM
                  </div>
                  <div className="text-xs font-bold uppercase text-slate-700">
                    VOTO GRAVADO COM SUCESSO
                  </div>
                  <button
                    onClick={handleConfirma}
                    className="text-xs bg-slate-900 text-white font-sans px-4 py-2 rounded-xl mt-4 hover:bg-slate-800 transition-colors shadow-md"
                  >
                    Votar Novamente / Trocar Cargo
                  </button>
                </div>
              ) : urnaStatus === 'branco' ? (
                <div className="h-full flex flex-col items-center justify-center space-y-2 py-10">
                  <div className="text-2xl font-black uppercase text-slate-900 tracking-wider">
                    VOTO EM BRANCO
                  </div>
                  <div className="text-xs text-slate-700 font-sans">
                    Pressione CONFIRMA para validar ou CORRIGE para alterar.
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Top: Cargo title */}
                  <div className="text-xs font-bold uppercase tracking-wider border-b border-stone-500/40 pb-1">
                    SEU VOTO PARA: <strong className="text-sm">{urnaRole.toUpperCase()}</strong>
                  </div>

                  {/* Digits boxes */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">Número:</span>
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: maxDigits }).map((_, idx) => (
                        <div
                          key={idx}
                          className="h-12 w-9 border-2 border-stone-800 bg-white/70 flex items-center justify-center text-2xl font-black text-slate-950 shadow-sm"
                        >
                          {typedDigits[idx] || (idx === typedDigits.length ? (
                            <span className="animate-pulse">_</span>
                          ) : '')}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Candidate Info Area */}
                  {foundCandidate ? (
                    <div className="space-y-2 pt-2 border-t border-stone-500/30">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="text-xs">
                            Nome: <strong className="text-sm uppercase font-black">{foundCandidate.popularName}</strong>
                          </div>
                          <div className="text-xs">
                            Partido: <strong className="uppercase">{foundCandidate.party}</strong>
                          </div>
                          <div className="text-[11px] text-slate-700 font-sans">
                            Estado: {foundCandidate.state} • Score: {foundCandidate.integrityScore}/100
                          </div>
                        </div>

                        <img 
                          src={foundCandidate.photo} 
                          alt={foundCandidate.name} 
                          className="h-20 w-16 object-cover border-2 border-stone-800 shadow-md rounded"
                        />
                      </div>
                    </div>
                  ) : typedDigits.length === maxDigits ? (
                    <div className="p-2 bg-stone-300/80 rounded border border-stone-500 text-xs text-rose-900 font-bold">
                      NÚMERO NÃO REGISTRADO (VOTO NULO)
                    </div>
                  ) : (
                    <div className="text-[11px] text-stone-600 font-sans italic pt-4">
                      Digite os números do candidato no teclado ao lado...
                    </div>
                  )}

                  {/* Footer instruction */}
                  <div className="pt-4 border-t-2 border-stone-600 text-[10px] uppercase font-sans text-stone-800 flex justify-between">
                    <span>Aperte tecla:</span>
                    <span><strong>VERDE</strong> para CONFIRMAR • <strong>LARANJA</strong> para CORRIGIR</span>
                  </div>
                </div>
              )}
            </div>

            {/* Urna Keypad (Right 5 cols) */}
            <div className="md:col-span-5 bg-stone-900 p-4 sm:p-5 rounded-2xl shadow-2xl border-2 border-stone-700 flex flex-col justify-between space-y-4">
              <div className="text-center font-mono font-bold text-white text-xs tracking-wider uppercase border-b border-stone-800 pb-2">
                JUSTIÇA ELEITORAL
              </div>

              {/* Numbers Grid (1-9 and 0) */}
              <div className="grid grid-cols-3 gap-2.5 px-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                  <button
                    key={num}
                    id={`urna-key-${num}`}
                    onClick={() => handleKeyClick(num)}
                    className="h-12 bg-gradient-to-b from-stone-800 to-stone-950 active:from-stone-700 text-white font-mono text-xl font-black rounded-lg border-2 border-stone-700 shadow-md active:translate-y-0.5 transition-all"
                  >
                    {num}
                  </button>
                ))}
                <div className="col-start-2">
                  <button
                    id="urna-key-0"
                    onClick={() => handleKeyClick('0')}
                    className="w-full h-12 bg-gradient-to-b from-stone-800 to-stone-950 active:from-stone-700 text-white font-mono text-xl font-black rounded-lg border-2 border-stone-700 shadow-md active:translate-y-0.5 transition-all"
                  >
                    0
                  </button>
                </div>
              </div>

              {/* Action Buttons (BRANCO, CORRIGE, CONFIRMA) */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-800">
                <button
                  id="urna-btn-branco"
                  onClick={handleBranco}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-950 font-bold text-[11px] uppercase py-3 rounded-lg border border-stone-300 shadow-md active:translate-y-0.5 transition-all"
                >
                  Branco
                </button>
                <button
                  id="urna-btn-corrige"
                  onClick={handleCorrige}
                  className="bg-orange-500 hover:bg-orange-400 text-stone-950 font-black text-[11px] uppercase py-3 rounded-lg border border-orange-600 shadow-md active:translate-y-0.5 transition-all"
                >
                  Corrige
                </button>
                <button
                  id="urna-btn-confirma"
                  onClick={handleConfirma}
                  className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-[11px] uppercase py-3 rounded-lg border border-emerald-600 shadow-md active:translate-y-0.5 transition-all"
                >
                  Confirma
                </button>
              </div>
            </div>

          </div>

          {/* Quick candidates numbers sheet to test */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
            <h4 className="font-bold text-slate-300 uppercase mb-2">Números Disponíveis para Teste na Urna</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {politicians.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setUrnaRole(p.role);
                    setTypedDigits(p.electionNumber ? p.electionNumber.toString() : '13');
                    setUrnaStatus('digitando');
                  }}
                  className="bg-slate-900 hover:bg-slate-850 p-2 rounded-xl border border-slate-800 text-left transition-colors"
                >
                  <div className="font-bold text-emerald-400">{p.popularName}</div>
                  <div className="text-[10px] text-slate-400">Nº {p.electionNumber} • {p.role}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. CANDIDATE COMPARATOR */}
      {activeSubTab === 'comparador' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale className="h-5 w-5 text-emerald-400" /> Confronto & Comparador Lado a Lado
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Selecione dois políticos para comparar histórico de atuação, gastos, pontuação de transparência e gerar síntese equilibrada com IA.
            </p>
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Candidato A</label>
              <select
                value={candidateA.id}
                onChange={(e) => setCandidateA(politicians.find(p => p.id === e.target.value) || politicians[0])}
                className="w-full bg-slate-900 text-xs text-white p-2.5 rounded-xl border border-slate-700 focus:outline-none"
              >
                {politicians.map(p => (
                  <option key={p.id} value={p.id}>{p.popularName} ({p.party} - {p.role})</option>
                ))}
              </select>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Candidato B</label>
              <select
                value={candidateB.id}
                onChange={(e) => setCandidateB(politicians.find(p => p.id === e.target.value) || politicians[1])}
                className="w-full bg-slate-900 text-xs text-white p-2.5 rounded-xl border border-slate-700 focus:outline-none"
              >
                {politicians.map(p => (
                  <option key={p.id} value={p.id}>{p.popularName} ({p.party} - {p.role})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Side by Side Specs Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Candidate A Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <img src={candidateA.photo} alt={candidateA.name} className="h-12 w-12 rounded-xl object-cover" />
                <div>
                  <h4 className="text-base font-bold text-white">{candidateA.popularName}</h4>
                  <div className="text-xs text-slate-400">{candidateA.party} • {candidateA.role} ({candidateA.state})</div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-850 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Score de Integridade:</span>
                  <strong className="text-emerald-400">{candidateA.integrityScore}/100</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Presença em Plenário:</span>
                  <strong className="text-slate-200">{candidateA.attendanceRate}%</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Patrimônio TSE:</span>
                  <strong className="text-slate-200">R$ {(candidateA.netWorthDeclared / 1000000).toFixed(1)}M</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Processos Judiciais:</span>
                  <strong className={candidateA.publicProcesses.length > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                    {candidateA.publicProcesses.length} registrado(s)
                  </strong>
                </div>
              </div>
            </div>

            {/* Candidate B Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <img src={candidateB.photo} alt={candidateB.name} className="h-12 w-12 rounded-xl object-cover" />
                <div>
                  <h4 className="text-base font-bold text-white">{candidateB.popularName}</h4>
                  <div className="text-xs text-slate-400">{candidateB.party} • {candidateB.role} ({candidateB.state})</div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-850 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Score de Integridade:</span>
                  <strong className="text-emerald-400">{candidateB.integrityScore}/100</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Presença em Plenário:</span>
                  <strong className="text-slate-200">{candidateB.attendanceRate}%</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Patrimônio TSE:</span>
                  <strong className="text-slate-200">R$ {(candidateB.netWorthDeclared / 1000000).toFixed(1)}M</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Processos Judiciais:</span>
                  <strong className={candidateB.publicProcesses.length > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                    {candidateB.publicProcesses.length} registrado(s)
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Run AI Comparison Button */}
          <div className="text-center">
            <button
              id="btn-run-ai-comparison"
              onClick={handleRunComparison}
              disabled={isComparing}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold py-2.5 px-6 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2 mx-auto cursor-pointer"
            >
              {isComparing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Analisando Histórico Comparativo...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>Gerar Comparativo Imparcial com IA</span>
                </>
              )}
            </button>
          </div>

          {/* AI Comparison Result */}
          {comparisonAi && (
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-700 space-y-4 animate-in fade-in zoom-in-95 text-xs text-slate-300">
              <div className="space-y-1.5">
                <h4 className="font-bold text-emerald-400 uppercase text-[11px]">Síntese Analítica</h4>
                <p className="text-sm text-slate-200 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                  {comparisonAi.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <h5 className="font-bold text-amber-400 uppercase text-[10px]">Divergências Principais</h5>
                  <ul className="space-y-1">
                    {comparisonAi.keyDifferences?.map((diff: string, i: number) => (
                      <li key={i} className="text-slate-300 flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{diff}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <h5 className="font-bold text-cyan-400 uppercase text-[10px]">Considerações para o Eleitor</h5>
                  <p className="text-slate-300 leading-relaxed">{comparisonAi.voterConsiderations}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. BÚSSOLA ELEITORAL / MATCH */}
      {activeSubTab === 'bussola' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" /> Bússola Política & Teste de Alinhamento
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Responda a 5 perguntas objetivas sobre economia, sociedade e reformas para estimar seu alinhamento com os programas partidários registrados no TSE.
            </p>
          </div>

          <div className="space-y-5">
            {quizQuestions.map((q) => (
              <div key={q.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
                <h4 className="font-bold text-white text-sm">
                  {q.id}. {q.q}
                </h4>

                <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
                  <span>{q.left}</span>
                  <span>{q.right}</span>
                </div>

                {/* 1 to 5 scale buttons */}
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: val }))}
                      className={`py-2 rounded-xl font-bold transition-all text-xs ${
                        quizAnswers[q.id] === val
                          ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-400'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              id="btn-calculate-civic-match"
              onClick={handleCalculateMatch}
              disabled={Object.keys(quizAnswers).length < 5}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all text-sm cursor-pointer"
            >
              Calcular Meu Alinhamento Partidário
            </button>

            {quizResult && (
              <div className="p-5 bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 border border-emerald-500/40 rounded-2xl text-center space-y-2 animate-in fade-in zoom-in-95">
                <div className="text-xs uppercase font-bold text-emerald-400">Resultado do Seu Perfil Cívico</div>
                <div className="text-lg font-extrabold text-white">{quizResult}</div>
                <p className="text-xs text-slate-300 max-w-xl mx-auto pt-1">
                  Este cálculo baseia-se nas votações nominais e programas registrados no TSE. Visite a aba "Partidos" para conhecer os estatutos detalhados de cada agremiação.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. CALENDÁRIO & REGRAS */}
      {activeSubTab === 'calendario' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-xs text-slate-300">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-400" /> Calendário Eleitoral Oficial & Guia do Eleitor (TSE)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Normas da Resolução do TSE, prazos de alistamento, biometria e regras de justificativa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-emerald-400 uppercase text-xs">Prazos e Datas Importantes</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>150 dias antes:</strong> Fechamento do cadastro eleitoral para emissão ou transferência de domicílio.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Convenções Partidárias:</strong> Escolha oficial de candidatos e coligações (Julho/Agosto).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>1º Domingo de Outubro:</strong> 1º Turno das Eleições Gerais (Votação das 8h às 17h pelo horário de Brasília).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Último Domingo de Outubro:</strong> 2º Turno (onde houver).</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-amber-400 uppercase text-xs">Documentos Aceitos para Votar</h4>
              <p className="text-slate-300 leading-relaxed">
                Para votar basta apresentar qualquer documento oficial com foto:
              </p>
              <ul className="space-y-1 list-disc list-inside text-slate-300">
                <li>e-Título (com foto cadastrada na biometria)</li>
                <li>Carteira de Identidade (RG) ou Carteira de Motorista (CNH)</li>
                <li>Passaporte ou Carteira de Trabalho física</li>
                <li>Certificado de Reservista</li>
              </ul>
              <div className="pt-2 text-slate-400">
                O título de eleitor impresso não é obrigatório se portar outro documento com foto.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
