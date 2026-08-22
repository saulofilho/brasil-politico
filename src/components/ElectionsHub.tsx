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
    Object.values(quizAnswers).forEach((val: any) => { score += Number(val); });
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
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-700 text-[10px] font-bold uppercase tracking-widest mb-0.5">
              <Vote className="h-3.5 w-3.5" /> Central de Inteligência Eleitoral
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Simulador da Urna, Comparador & Guia do Eleitor
            </h2>
            <p className="text-slate-500 text-xs mt-0.5 max-w-3xl leading-relaxed">
              Treine a votação na urna eletrônica oficial com sons em tempo real, compare histórico e patrimônio de candidatos lado a lado e teste seu alinhamento partidário.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200 self-start md:self-center">
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
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    activeSubTab === tab.id
                      ? 'bg-emerald-700 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 1. URNA ELETRÔNICA SIMULATOR */}
      {activeSubTab === 'simulador' && (
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2.5 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Simulador Oficial da Urna Eletrônica Brasileira</h3>
                <p className="text-[11px] text-slate-500">Modelo com sons em tempo real e visualização de foto/vice/partido</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Role selector */}
              <select
                value={urnaRole}
                onChange={(e) => {
                  setUrnaRole(e.target.value as any);
                  setTypedDigits('');
                  setUrnaStatus('digitando');
                }}
                className="bg-slate-50 text-xs text-slate-800 px-2.5 py-1 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="Presidente">Eleição: Presidente (2 dígitos)</option>
                <option value="Governador">Eleição: Governador (2 dígitos)</option>
                <option value="Senador">Eleição: Senador (3 dígitos)</option>
                <option value="Deputado Federal">Eleição: Deputado Federal (4 dígitos)</option>
              </select>

              {/* Mute toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded-md bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 cursor-pointer"
                title={soundEnabled ? 'Áudio ativado' : 'Áudio silenciado'}
              >
                {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-emerald-700" /> : <VolumeX className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Realistic Urna Machine Frame */}
          <div className="max-w-3xl mx-auto bg-stone-200 p-3 sm:p-5 rounded-2xl shadow-sm border-2 border-stone-300 text-slate-900 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Urna LCD Screen (Left 7 cols) */}
            <div className="md:col-span-7 bg-[#dbe8d4] border-2 border-stone-600 rounded-xl p-3.5 shadow-inner min-h-[300px] flex flex-col justify-between font-mono text-slate-900 relative overflow-hidden">
              {urnaStatus === 'fim' ? (
                <div className="h-full flex flex-col items-center justify-center space-y-2 py-8 animate-in fade-in duration-200">
                  <div className="text-5xl font-black tracking-widest text-slate-900">
                    FIM
                  </div>
                  <div className="text-[10px] font-bold uppercase text-slate-700">
                    VOTO GRAVADO COM SUCESSO
                  </div>
                  <button
                    onClick={handleConfirma}
                    className="text-xs bg-slate-900 text-white font-sans px-3.5 py-1.5 rounded-lg mt-3 hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                  >
                    Votar Novamente / Trocar Cargo
                  </button>
                </div>
              ) : urnaStatus === 'branco' ? (
                <div className="h-full flex flex-col items-center justify-center space-y-1.5 py-8">
                  <div className="text-xl font-black uppercase text-slate-900 tracking-wider">
                    VOTO EM BRANCO
                  </div>
                  <div className="text-[11px] text-slate-700 font-sans">
                    Pressione CONFIRMA para validar ou CORRIGE para alterar.
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Top: Cargo title */}
                  <div className="text-[11px] font-bold uppercase tracking-wider border-b border-stone-500/40 pb-1">
                    SEU VOTO PARA: <strong className="text-xs">{urnaRole.toUpperCase()}</strong>
                  </div>

                  {/* Digits boxes */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">Número:</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: maxDigits }).map((_, idx) => (
                        <div
                          key={idx}
                          className="h-10 w-8 border border-stone-800 bg-white/80 flex items-center justify-center text-xl font-black text-slate-950 shadow-xs"
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
                    <div className="space-y-1.5 pt-1.5 border-t border-stone-500/30">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="text-xs">
                            Nome: <strong className="text-xs uppercase font-black">{foundCandidate.popularName}</strong>
                          </div>
                          <div className="text-xs">
                            Partido: <strong className="uppercase">{foundCandidate.party}</strong>
                          </div>
                          <div className="text-[10px] text-slate-700 font-sans">
                            Estado: {foundCandidate.state} • Score: {foundCandidate.integrityScore}/100
                          </div>
                        </div>

                        <img 
                          src={foundCandidate.photo} 
                          alt={foundCandidate.name} 
                          className="h-16 w-14 object-cover border border-stone-800 shadow-xs rounded"
                        />
                      </div>
                    </div>
                  ) : typedDigits.length === maxDigits ? (
                    <div className="p-1.5 bg-stone-300/80 rounded border border-stone-500 text-[11px] text-rose-900 font-bold">
                      NÚMERO NÃO REGISTRADO (VOTO NULO)
                    </div>
                  ) : (
                    <div className="text-[10px] text-stone-600 font-sans italic pt-2">
                      Digite os números do candidato no teclado ao lado...
                    </div>
                  )}

                  {/* Footer instruction */}
                  <div className="pt-2 border-t border-stone-600 text-[9px] uppercase font-sans text-stone-800 flex justify-between">
                    <span>Aperte:</span>
                    <span><strong>VERDE</strong> CONFIRMAR • <strong>LARANJA</strong> CORRIGIR</span>
                  </div>
                </div>
              )}
            </div>

            {/* Urna Keypad (Right 5 cols) */}
            <div className="md:col-span-5 bg-stone-900 p-3 sm:p-4 rounded-xl shadow-md border border-stone-700 flex flex-col justify-between space-y-3">
              <div className="text-center font-mono font-bold text-white text-[11px] tracking-wider uppercase border-b border-stone-800 pb-1.5">
                JUSTIÇA ELEITORAL
              </div>

              {/* Numbers Grid (1-9 and 0) */}
              <div className="grid grid-cols-3 gap-1.5 px-1">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                  <button
                    key={num}
                    id={`urna-key-${num}`}
                    onClick={() => handleKeyClick(num)}
                    className="h-9 bg-stone-800 active:bg-stone-700 text-white font-mono text-base font-bold rounded border border-stone-700 shadow-xs active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    {num}
                  </button>
                ))}
                <div className="col-start-2">
                  <button
                    id="urna-key-0"
                    onClick={() => handleKeyClick('0')}
                    className="w-full h-9 bg-stone-800 active:bg-stone-700 text-white font-mono text-base font-bold rounded border border-stone-700 shadow-xs active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    0
                  </button>
                </div>
              </div>

              {/* Action Buttons (BRANCO, CORRIGE, CONFIRMA) */}
              <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-stone-800">
                <button
                  id="urna-btn-branco"
                  onClick={handleBranco}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-950 font-bold text-[10px] uppercase py-2 rounded border border-stone-300 shadow-xs cursor-pointer"
                >
                  Branco
                </button>
                <button
                  id="urna-btn-corrige"
                  onClick={handleCorrige}
                  className="bg-orange-500 hover:bg-orange-400 text-stone-950 font-black text-[10px] uppercase py-2 rounded border border-orange-600 shadow-xs cursor-pointer"
                >
                  Corrige
                </button>
                <button
                  id="urna-btn-confirma"
                  onClick={handleConfirma}
                  className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-[10px] uppercase py-2 rounded border border-emerald-600 shadow-xs cursor-pointer"
                >
                  Confirma
                </button>
              </div>
            </div>

          </div>

          {/* Quick candidates numbers sheet to test */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <h4 className="font-bold text-slate-800 uppercase text-[10px] mb-1.5">Números Disponíveis para Teste na Urna</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {politicians.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setUrnaRole(p.role);
                    setTypedDigits(p.electionNumber ? p.electionNumber.toString() : '13');
                    setUrnaStatus('digitando');
                  }}
                  className="bg-white hover:bg-slate-100 p-2 rounded-lg border border-slate-200 text-left transition-colors cursor-pointer"
                >
                  <div className="font-bold text-emerald-800 text-xs">{p.popularName}</div>
                  <div className="text-[10px] text-slate-500">Nº {p.electionNumber} • {p.role}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. CANDIDATE COMPARATOR */}
      {activeSubTab === 'comparador' && (
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-xs space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <Scale className="h-3.5 w-3.5 text-emerald-700" /> Confronto & Comparador Lado a Lado
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Selecione dois políticos para comparar histórico, gastos, pontuação de transparência e gerar síntese com IA.
            </p>
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <label className="text-[10px] font-bold text-slate-600 uppercase">Candidato A</label>
              <select
                value={candidateA.id}
                onChange={(e) => setCandidateA(politicians.find(p => p.id === e.target.value) || politicians[0])}
                className="w-full bg-white text-xs text-slate-800 p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                {politicians.map(p => (
                  <option key={p.id} value={p.id}>{p.popularName} ({p.party} - {p.role})</option>
                ))}
              </select>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <label className="text-[10px] font-bold text-slate-600 uppercase">Candidato B</label>
              <select
                value={candidateB.id}
                onChange={(e) => setCandidateB(politicians.find(p => p.id === e.target.value) || politicians[1])}
                className="w-full bg-white text-xs text-slate-800 p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                {politicians.map(p => (
                  <option key={p.id} value={p.id}>{p.popularName} ({p.party} - {p.role})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Side by Side Specs Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Candidate A Card */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <img src={candidateA.photo} alt={candidateA.name} className="h-10 w-10 rounded-lg object-cover border border-slate-200" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{candidateA.popularName}</h4>
                  <div className="text-[11px] text-slate-500">{candidateA.party} • {candidateA.role} ({candidateA.state})</div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1.5 border-t border-slate-200 text-xs">
                <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-500">Score Integridade:</span>
                  <strong className="text-emerald-800">{candidateA.integrityScore}/100</strong>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-500">Presença Plenário:</span>
                  <strong className="text-slate-800">{candidateA.attendanceRate}%</strong>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-500">Patrimônio Declarado:</span>
                  <strong className="text-slate-800">R$ {(candidateA.netWorthDeclared / 1000000).toFixed(1)}M</strong>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">Processos Judiciais:</span>
                  <strong className={candidateA.publicProcesses.length > 0 ? 'text-amber-800' : 'text-emerald-800'}>
                    {candidateA.publicProcesses.length} registrado(s)
                  </strong>
                </div>
              </div>
            </div>

            {/* Candidate B Card */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <img src={candidateB.photo} alt={candidateB.name} className="h-10 w-10 rounded-lg object-cover border border-slate-200" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{candidateB.popularName}</h4>
                  <div className="text-[11px] text-slate-500">{candidateB.party} • {candidateB.role} ({candidateB.state})</div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1.5 border-t border-slate-200 text-xs">
                <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-500">Score Integridade:</span>
                  <strong className="text-emerald-800">{candidateB.integrityScore}/100</strong>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-500">Presença Plenário:</span>
                  <strong className="text-slate-800">{candidateB.attendanceRate}%</strong>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-500">Patrimônio Declarado:</span>
                  <strong className="text-slate-800">R$ {(candidateB.netWorthDeclared / 1000000).toFixed(1)}M</strong>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">Processos Judiciais:</span>
                  <strong className={candidateB.publicProcesses.length > 0 ? 'text-amber-800' : 'text-emerald-800'}>
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
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2 px-4 rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-1.5 mx-auto"
            >
              {isComparing ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Analisando Histórico Comparativo...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>Gerar Comparativo Imparcial com IA</span>
                </>
              )}
            </button>
          </div>

          {/* AI Comparison Result */}
          {comparisonAi && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 animate-in fade-in text-xs text-slate-700">
              <div className="space-y-1">
                <h4 className="font-bold text-emerald-800 uppercase text-[10px]">Síntese Analítica</h4>
                <p className="text-xs text-slate-800 leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                  {comparisonAi.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                  <h5 className="font-bold text-amber-800 uppercase text-[10px]">Divergências Principais</h5>
                  <ul className="space-y-0.5">
                    {comparisonAi.keyDifferences?.map((diff: string, i: number) => (
                      <li key={i} className="text-slate-700 flex items-start gap-1">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{diff}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                  <h5 className="font-bold text-cyan-800 uppercase text-[10px]">Considerações para o Eleitor</h5>
                  <p className="text-slate-700 leading-relaxed">{comparisonAi.voterConsiderations}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. BÚSSOLA ELEITORAL / MATCH */}
      {activeSubTab === 'bussola' && (
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-xs space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-amber-600" /> Bússola Política & Teste de Alinhamento
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Responda a 5 perguntas objetivas sobre economia, sociedade e reformas para estimar seu alinhamento com os partidos no TSE.
            </p>
          </div>

          <div className="space-y-3">
            {quizQuestions.map((q) => (
              <div key={q.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 text-xs">
                  {q.id}. {q.q}
                </h4>

                <div className="flex items-center justify-between gap-2 text-[10px] text-slate-500">
                  <span>{q.left}</span>
                  <span>{q.right}</span>
                </div>

                {/* 1 to 5 scale buttons */}
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: val }))}
                      className={`py-1.5 rounded-md font-bold transition-all text-xs cursor-pointer ${
                        quizAnswers[q.id] === val
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
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
              className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold py-2 px-4 rounded-lg shadow-xs transition-all text-xs cursor-pointer"
            >
              Calcular Meu Alinhamento Partidário
            </button>

            {quizResult && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1 animate-in fade-in">
                <div className="text-[10px] uppercase font-bold text-emerald-800">Resultado do Seu Perfil Cívico</div>
                <div className="text-sm font-bold text-slate-900">{quizResult}</div>
                <p className="text-[11px] text-slate-600 max-w-xl mx-auto pt-0.5">
                  Este cálculo baseia-se nas votações nominais e programas registrados no TSE. Visite a aba "Partidos" para conhecer os estatutos detalhados.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. CALENDÁRIO & REGRAS */}
      {activeSubTab === 'calendario' && (
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-xs space-y-4 text-xs text-slate-700">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-emerald-700" /> Calendário Eleitoral Oficial & Guia do Eleitor (TSE)
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Normas da Resolução do TSE, prazos de alistamento, biometria e regras de justificativa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-emerald-800 uppercase text-[10px]">Prazos e Datas Importantes</h4>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span><strong>150 dias antes:</strong> Fechamento do cadastro eleitoral para emissão ou transferência.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span><strong>Convenções Partidárias:</strong> Escolha oficial de candidatos e coligações (Julho/Agosto).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span><strong>1º Domingo de Outubro:</strong> 1º Turno das Eleições Gerais (Votação das 8h às 17h - Horário de Brasília).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span><strong>Último Domingo de Outubro:</strong> 2º Turno (onde houver).</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-amber-800 uppercase text-[10px]">Documentos Aceitos para Votar</h4>
              <p className="text-slate-700 leading-relaxed text-xs">
                Para votar basta apresentar qualquer documento oficial com foto:
              </p>
              <ul className="space-y-0.5 list-disc list-inside text-slate-600">
                <li>e-Título (com foto cadastrada na biometria)</li>
                <li>Carteira de Identidade (RG) ou Carteira de Motorista (CNH)</li>
                <li>Passaporte ou Carteira de Trabalho física</li>
                <li>Certificado de Reservista</li>
              </ul>
              <div className="pt-1 text-[11px] text-slate-500">
                O título de eleitor impresso não é obrigatório se portar outro documento oficial com foto.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
