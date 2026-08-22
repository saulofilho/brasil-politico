export type RegionName = 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul';

export type PoliticalRole = 
  | 'Presidente'
  | 'Vice-Presidente'
  | 'Governador'
  | 'Senador'
  | 'Deputado Federal'
  | 'Deputado Estadual'
  | 'Prefeito'
  | 'Vereador'
  | 'Ministro';

export type ProcessStatus = 
  | 'Em Julgamento'
  | 'Inquérito Policial / MP'
  | 'Denúncia Aceita (Réu)'
  | 'Condenado 1ª Instância (Recurso)'
  | 'Condenado Colegiado (Ficha Suja)'
  | 'Absolvido'
  | 'Arquivado / Prescrito'
  | 'Ficha Limpa / Sem Processos';

export interface JudicialProcess {
  id: string;
  processNumber: string;
  court: 'STF' | 'STJ' | 'TSE' | 'TRF1' | 'TRF2' | 'TRF3' | 'TRF4' | 'TRF5' | 'TJ' | 'TCU';
  crimeType: string;
  status: ProcessStatus;
  yearStarted: number;
  summary: string;
  officialSourceUrl: string;
  lastUpdate: string;
}

export interface BillSummary {
  id: string;
  code: string; // Ex: PL 2630/2020
  title: string;
  votePosition?: 'A Favor' | 'Contra' | 'Abstenção' | 'Ausente';
  year: number;
}

export interface VoteRecord {
  id: string;
  billCode: string;
  billName: string;
  vote: 'SIM' | 'NÃO' | 'ABSTENÇÃO' | 'OBSTRUÇÃO' | 'AUSENTE';
  date: string;
  partyGuidance: 'SIM' | 'NÃO' | 'LIBERADO';
  isAlignmentWithParty: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  date: string;
  sentiment: 'Positivo' | 'Neutro' | 'Crítico';
  summary: string;
}

export interface FactCheckItem {
  id: string;
  claim: string;
  verdict: 'VERDADEIRO' | 'FALSO' | 'ENGANOSO' | 'EXAGERADO' | 'FORA DE CONTEXTO' | 'SEM PROVAS';
  debunkSummary: string;
  checkerSource: string; // Ex: 'Aos Fatos', 'Agência Lupa', 'TSE Fato ou Boato', 'G1 Fato ou Fake'
  date: string;
  url: string;
}

export interface Politician {
  id: string;
  name: string;
  popularName: string;
  photo: string;
  party: string;
  role: PoliticalRole;
  state: string; // UF (ex: 'SP', 'RJ', 'BR')
  city?: string;
  gender: 'M' | 'F';
  birthDate: string;
  education: string;
  bio: string;
  integrityScore: number; // 0 - 100
  attendanceRate: number; // % presença em plenário
  cabinetExpensesYear: number; // R$ cota parlamentar gasta no ano
  cabinetBudgetLimit: number; // R$ cota total disponível
  netWorthDeclared: number; // R$ declarado ao TSE
  netWorthEvolution: { year: number; value: number }[];
  isCleanRecord: boolean; // Ficha Limpa?
  publicProcesses: JudicialProcess[];
  billsProposed: BillSummary[];
  votesHistory: VoteRecord[];
  news: NewsItem[];
  factChecks: FactCheckItem[];
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    officialWebsite?: string;
  };
  electionNumber?: string;
  tags: string[];
}

export interface Party {
  id: string;
  acronym: string;
  name: string;
  electoralNumber: number;
  foundationYear: number;
  ideologySpectrum: 'Esquerda' | 'Centro-Esquerda' | 'Centro' | 'Centro-Direita' | 'Direita';
  president: string;
  senatorsCount: number;
  deputiesCount: number;
  governorsCount: number;
  mayorsCount: number;
  historySummary: string;
  mainPrinciples: string[];
  transparencyRating: number; // 0 - 100
  colorHex: string;
  logoUrl?: string;
  fusionsHistory?: string;
}

export interface StateData {
  uf: string;
  name: string;
  region: RegionName;
  capital: string;
  governor: string;
  governorParty: string;
  viceGovernor: string;
  senators: { name: string; party: string }[];
  deputiesFederalCount: number;
  electorateSize: number; // Milhões de eleitores
  transparencyRank: number; // 1 a 27
  topParties: { party: string; count: number }[];
  keyIssues: string[];
  mapSvgPath?: string;
}

export interface LegislationTimelineStep {
  id: string;
  stageNumber: number;
  stageName: string;
  chamberOrBody: 'Câmara dos Deputados' | 'Senado Federal' | 'Congresso Nacional' | 'Presidência da República' | 'STF' | 'Sociedade Civil';
  date: string;
  status: 'completed' | 'current' | 'upcoming';
  summary: string;
  voteResult?: {
    favor: number;
    contra: number;
    abstencoes?: number;
    quorumRequired?: string;
    approved: boolean;
  };
  reporter?: string; // Relator(a)
  officialDocNumber?: string;
  keyMilestone?: string;
  details?: string;
}

export interface Legislation {
  id: string;
  code: string;
  title: string;
  author: string;
  authorParty: string;
  category: 'Economia' | 'Saúde' | 'Educação' | 'Segurança' | 'Tecnologia' | 'Trabalho' | 'Meio Ambiente' | 'Política';
  chamber: 'Câmara dos Deputados' | 'Senado Federal' | 'Congresso Nacional';
  presentationDate: string;
  lastUpdateDate: string;
  status: 'Em Tramitação' | 'Aprovado na Comissão' | 'Votação em Plenário' | 'Aprovado' | 'Sancionado' | 'Vetado';
  urgency: boolean;
  plainTextSummary: string;
  keyPoints: string[];
  timeline?: LegislationTimelineStep[];
  publicConsultation: {
    totalVotes: number;
    votesFavor: number;
    votesContra: number;
    userVote?: 'favor' | 'contra';
    isOpen: boolean;
  };
  officialLink: string;
  aiAnalysis?: {
    pros: string[];
    cons: string[];
    citizenImpact: string;
  };
}

export interface ForumComment {
  id: string;
  authorName: string;
  authorState: string;
  date: string;
  content: string;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down';
}

export interface ForumPost {
  id: string;
  title: string;
  category: string;
  author?: string;
  authorName?: string;
  authorState?: string;
  date?: string;
  createdAt?: string;
  content: string;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down';
  commentsCount: number;
  comments: any[];
  pinned?: boolean;
  tags: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  type: 'legislacao' | 'consulta_popular' | 'alerta_urgente' | 'fake_news' | 'eleicoes';
  isRead: boolean;
  relatedId?: string;
}

export interface PoliticalCompassQuestion {
  id: number;
  category: string;
  statement: string;
  options: {
    label: string;
    economicScore: number; // -2 (esquerda econômica) a +2 (direita econômica)
    socialScore: number;   // -2 (progressista/libertário) a +2 (conservador/autoritário)
  }[];
}

export interface CandidateForSim {
  id: string;
  number: string;
  name: string;
  ballotName: string;
  party: string;
  role: PoliticalRole;
  state: string;
  photo: string;
  vice?: string;
  proposals: string[];
}
