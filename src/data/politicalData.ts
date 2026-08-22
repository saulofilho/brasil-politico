import { Politician, Party, StateData, Legislation, ForumPost, NotificationItem, PoliticalCompassQuestion, CandidateForSim } from '../types';

export const PARTIES_DATA: Party[] = [
  {
    id: 'pt',
    acronym: 'PT',
    name: 'Partido dos Trabalhadores',
    electoralNumber: 13,
    foundationYear: 1980,
    ideologySpectrum: 'Centro-Esquerda',
    president: 'Gleisi Hoffmann',
    senatorsCount: 9,
    deputiesCount: 68,
    governorsCount: 4,
    mayorsCount: 252,
    historySummary: 'Fundado em 1980 no Colégio Sion em São Paulo por sindicalistas, intelectuais e movimentos sociais. Venceu eleições presidenciais em 2002, 2006, 2010, 2014 e 2022.',
    mainPrinciples: ['Justiça social e combate à fome', 'Fortalecimento do Estado indutor', 'Políticas públicas inclusivas', 'Defesa da soberania nacional'],
    transparencyRating: 78,
    colorHex: '#CC0000',
    fusionsHistory: 'Mantém sigla original histórica desde a fundação.'
  },
  {
    id: 'pl',
    acronym: 'PL',
    name: 'Partido Liberal',
    electoralNumber: 22,
    foundationYear: 2006,
    ideologySpectrum: 'Direita',
    president: 'Valdemar Costa Neto',
    senatorsCount: 14,
    deputiesCount: 95,
    governorsCount: 2,
    mayorsCount: 512,
    historySummary: 'Originado da fusão entre o PRONA e o antigo PL em 2006 (inicialmente como PR). Em 2019 retornou ao nome PL e tornou-se a maior bancada do Congresso Nacional.',
    mainPrinciples: ['Livre iniciativa e desregulamentação', 'Defesa dos valores familiares e conservadores', 'Segurança pública com tolerância zero', 'Redução da carga tributária'],
    transparencyRating: 71,
    colorHex: '#002B7F',
    fusionsHistory: 'Fusão do PL e PRONA (2006) com denominação PR até 2019.'
  },
  {
    id: 'uniao',
    acronym: 'UNIÃO',
    name: 'União Brasil',
    electoralNumber: 44,
    foundationYear: 2021,
    ideologySpectrum: 'Centro-Direita',
    president: 'Antonio Rueda',
    senatorsCount: 7,
    deputiesCount: 59,
    governorsCount: 4,
    mayorsCount: 580,
    historySummary: 'Resultado da fusão homologada pelo TSE em 2022 entre o Democratas (antigo PFL/ARENA) e o Partido Social Liberal (PSL), constituindo uma das maiores legendas do país.',
    mainPrinciples: ['Liberalismo econômico', 'Municipalismo', 'Modernização da gestão pública', 'Equilíbrio fiscal'],
    transparencyRating: 73,
    colorHex: '#0066CC',
    fusionsHistory: 'Fusão de DEM e PSL em 2021/2022.'
  },
  {
    id: 'psd',
    acronym: 'PSD',
    name: 'Partido Social Democrático',
    electoralNumber: 55,
    foundationYear: 2011,
    ideologySpectrum: 'Centro',
    president: 'Gilberto Kassab',
    senatorsCount: 15,
    deputiesCount: 44,
    governorsCount: 3,
    mayorsCount: 885,
    historySummary: 'Fundado em 2011 por Gilberto Kassab reunindo dissidentes de diversos partidos. Destaca-se pelo pragmatismo e pela maior bancada no Senado Federal e maior número de prefeituras.',
    mainPrinciples: ['Pragmatismo político e governabilidade', 'Desenvolvimento regional', 'Estabilidade institucional', 'Descentralização administrativa'],
    transparencyRating: 75,
    colorHex: '#FF8800',
    fusionsHistory: 'Incorporou o PROS em 2023.'
  },
  {
    id: 'mdb',
    acronym: 'MDB',
    name: 'Movimento Democrático Brasileiro',
    electoralNumber: 15,
    foundationYear: 1966,
    ideologySpectrum: 'Centro',
    president: 'Baleia Rossi',
    senatorsCount: 10,
    deputiesCount: 43,
    governorsCount: 3,
    mayorsCount: 856,
    historySummary: 'Herdeiro da oposição consentida durante o regime militar e protagonista na redemocratização (Diretas Já e Constituição de 1988). Chamou-se PMDB entre 1980 e 2017.',
    mainPrinciples: ['Democracia representativa', 'Conciliação e federação forte', 'Apoio à produção e ao agronegócio', 'Reformas estruturantes'],
    transparencyRating: 74,
    colorHex: '#009933',
    fusionsHistory: 'Voltou à denominação histórica MDB em 2017.'
  },
  {
    id: 'pp',
    acronym: 'PP',
    name: 'Progressistas',
    electoralNumber: 11,
    foundationYear: 1995,
    ideologySpectrum: 'Centro-Direita',
    president: 'Ciro Nogueira',
    senatorsCount: 6,
    deputiesCount: 50,
    governorsCount: 2,
    mayorsCount: 750,
    historySummary: 'Descendente histórico do PDS, PPR e PPB. Tradicional partido de sustentação de governos federais, com forte base no agronegócio e nas regiões Nordeste e Sul.',
    mainPrinciples: ['Livre mercado e privatizações', 'Fortalecimento do agronegócio', 'Rigor penal', 'Autonomia municipal'],
    transparencyRating: 69,
    colorHex: '#0055A5',
    fusionsHistory: 'Mudou nome de PPB para PP em 2003 e para Progressistas em 2018.'
  },
  {
    id: 'republicanos',
    acronym: 'REPUBLICANOS',
    name: 'Republicanos',
    electoralNumber: 10,
    foundationYear: 2005,
    ideologySpectrum: 'Direita',
    president: 'Marcos Pereira',
    senatorsCount: 4,
    deputiesCount: 41,
    governorsCount: 2,
    mayorsCount: 430,
    historySummary: 'Fundado em 2005 como Partido Municipalista Renovador (PMR), tornando-se PRB e posteriormente Republicanos em 2019. Possui forte conexão com lideranças comunitárias e religiosas.',
    mainPrinciples: ['Conservadorismo social', 'Defesa da família', 'Gestão eficiente e compliance', 'Economia mista e infraestrutura'],
    transparencyRating: 72,
    colorHex: '#003366',
    fusionsHistory: 'Denominado PRB até 2019.'
  },
  {
    id: 'psol',
    acronym: 'PSOL',
    name: 'Partido Socialismo e Liberdade',
    electoralNumber: 50,
    foundationYear: 2004,
    ideologySpectrum: 'Esquerda',
    president: 'Paula Coradi',
    senatorsCount: 0,
    deputiesCount: 13,
    governorsCount: 0,
    mayorsCount: 0,
    historySummary: 'Criado em 2004 por dissidentes de esquerda do PT liderados por Heloísa Helena e Babá. Atua com ênfase em direitos humanos, pautas identitárias, ambientais e combate à corrupção.',
    mainPrinciples: ['Socialismo democrático', 'Direitos humanos e minorias', 'Justiça climática e transição ecológica', 'Taxação de grandes fortunas'],
    transparencyRating: 84,
    colorHex: '#FFDD00',
    fusionsHistory: 'Formou Federação Partidária com a REDE Sustentabilidade em 2022.'
  },
  {
    id: 'novo',
    acronym: 'NOVO',
    name: 'Partido Novo',
    electoralNumber: 30,
    foundationYear: 2011,
    ideologySpectrum: 'Direita',
    president: 'Eduardo Ribeiro',
    senatorsCount: 1,
    deputiesCount: 4,
    governorsCount: 1,
    mayorsCount: 264,
    historySummary: 'Registrado definitivamente em 2015 por profissionais liberais liderados por João Amoêdo. Focado em liberalismo econômico radical, combate a privilégios e estado mínimo.',
    mainPrinciples: ['Estado mínimo e privatização integral', 'Liberdade individual e econômica', 'Corte severo de gastos públicos', 'Processo seletivo para candidatos'],
    transparencyRating: 88,
    colorHex: '#FF6600',
    fusionsHistory: 'Recusou uso de fundo eleitoral até mudança estatutária em 2023.'
  },
  {
    id: 'psb',
    acronym: 'PSB',
    name: 'Partido Socialista Brasileiro',
    electoralNumber: 40,
    foundationYear: 1947,
    ideologySpectrum: 'Centro-Esquerda',
    president: 'Carlos Siqueira',
    senatorsCount: 4,
    deputiesCount: 14,
    governorsCount: 3,
    mayorsCount: 309,
    historySummary: 'Fundado na década de 1940 e refundado em 1985 com Miguel Arraes. Teve figuras expressivas como Eduardo Campos e conta hoje com o Vice-Presidente Geraldo Alckmin.',
    mainPrinciples: ['Social-democracia', 'Investimento em ciência e tecnologia', 'Educação pública integral', 'Sustentabilidade e bioeconomia'],
    transparencyRating: 77,
    colorHex: '#E31B23',
    fusionsHistory: 'Refundado pós-regime militar em 1985.'
  },
  {
    id: 'pdt',
    acronym: 'PDT',
    name: 'Partido Democrático Trabalhista',
    electoralNumber: 12,
    foundationYear: 1979,
    ideologySpectrum: 'Centro-Esquerda',
    president: 'Carlos Lupi',
    senatorsCount: 2,
    deputiesCount: 18,
    governorsCount: 1,
    mayorsCount: 151,
    historySummary: 'Fundado em Lisboa em 1979 por Leonel Brizola após a perda da sigla PTB. É herdeiro do trabalhismo varguista e defensor histórico da educação em tempo integral (CIEPs).',
    mainPrinciples: ['Trabalhismo e soberania nacional', 'Educação pública como prioridade absoluta', 'Nacionalismo econômico', 'Direitos dos trabalhadores'],
    transparencyRating: 76,
    colorHex: '#006B3F',
    fusionsHistory: 'Incorporou o PAN em 2006.'
  },
  {
    id: 'psdb',
    acronym: 'PSDB',
    name: 'Partido da Social Democracia Brasileira',
    electoralNumber: 45,
    foundationYear: 1988,
    ideologySpectrum: 'Centro',
    president: 'Marconi Perillo',
    senatorsCount: 1,
    deputiesCount: 13,
    governorsCount: 3,
    mayorsCount: 270,
    historySummary: 'Fundado em 1988 por Mário Covas, Franco Montoro e Fernando Henrique Cardoso. Comandou o país entre 1995 e 2002 durante o Plano Real e governou o estado de São Paulo por 28 anos.',
    mainPrinciples: ['Responsabilidade fiscal e Plano Real', 'Social-democracia de mercado', 'Modernização do Estado', 'Políticas sociais focadas'],
    transparencyRating: 79,
    colorHex: '#005596',
    fusionsHistory: 'Federação com o Cidadania desde 2022.'
  }
];

export const POLITICIANS_DATA: Politician[] = [
  {
    id: 'lula',
    name: 'Luiz Inácio Lula da Silva',
    popularName: 'Lula',
    photo: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=400&auto=format&fit=crop&q=80',
    party: 'PT',
    role: 'Presidente',
    state: 'BR',
    gender: 'M',
    birthDate: '1945-10-27',
    education: 'Torneiro Mecânico (SENAI)',
    bio: '39º Presidente do Brasil, em seu terceiro mandato (2003-2010 e 2023-atual). Ex-líder sindical dos metalúrgicos do ABC Paulista e cofundador do PT.',
    integrityScore: 72,
    attendanceRate: 98,
    cabinetExpensesYear: 0,
    cabinetBudgetLimit: 0,
    netWorthDeclared: 7423625,
    netWorthEvolution: [
      { year: 2006, value: 839000 },
      { year: 2018, value: 7987000 },
      { year: 2022, value: 7423625 }
    ],
    isCleanRecord: true,
    publicProcesses: [
      {
        id: 'proc-lula-1',
        processNumber: 'HC 193.726 / STF',
        court: 'STF',
        crimeType: 'Improbidade Administrativa / Corrupção Passiva (Operação Lava Jato)',
        status: 'Absolvido',
        yearStarted: 2016,
        summary: 'O Plenário do Supremo Tribunal Federal anulou todas as condenações da 13ª Vara Federal de Curitiba por incompetência de foro e declarou a suspeição do ex-juiz Sergio Moro, restabelecendo plenamente os direitos políticos.',
        officialSourceUrl: 'https://portal.stf.jus.br',
        lastUpdate: '2021-04-15'
      },
      {
        id: 'proc-lula-2',
        processNumber: 'Inq. 4.781 / STF',
        court: 'STF',
        crimeType: 'Inquérito de Atos Antidemocráticos (Testemunha/Vítima)',
        status: 'Arquivado / Prescrito',
        yearStarted: 2023,
        summary: 'Vítima dos atentados aos Poderes em 8 de janeiro de 2023, atuou como autoridade requisitante de intervenção federal no DF.',
        officialSourceUrl: 'https://portal.stf.jus.br',
        lastUpdate: '2024-01-08'
      }
    ],
    billsProposed: [
      { id: 'b-1', code: 'PEC 45/2019', title: 'Reforma Tributária sobre o Consumo', votePosition: 'A Favor', year: 2023 },
      { id: 'b-2', code: 'PL 1085/2023', title: 'Igualdade Salarial entre Homens e Mulheres', votePosition: 'A Favor', year: 2023 },
      { id: 'b-3', code: 'PLP 68/2024', title: 'Regulamentação do IBS e CBS', votePosition: 'A Favor', year: 2024 }
    ],
    votesHistory: [
      { id: 'v-1', billCode: 'PEC 45/2023', billName: 'Promulgação Reforma Tributária', vote: 'SIM', date: '2023-12-20', partyGuidance: 'SIM', isAlignmentWithParty: true },
      { id: 'v-2', billCode: 'PL 2630/2020', billName: 'Regulamentação das Plataformas Digitais', vote: 'SIM', date: '2023-05-02', partyGuidance: 'SIM', isAlignmentWithParty: true }
    ],
    news: [
      { id: 'n-1', title: 'Plano Safra bate recorde histórico de financiamento agrícola', source: 'Agência Brasil', url: 'https://agenciabrasil.ebc.com.br', date: '2024-07-03', sentiment: 'Positivo', summary: 'Governo Federal anuncia mais de R$ 400 bilhões para produtores rurais familiares e do agronegócio.' },
      { id: 'n-2', title: 'Meta fiscal de déficit zero gera debate com o Congresso', source: 'Folha de S.Paulo', url: 'https://folha.uol.com.br', date: '2024-05-18', sentiment: 'Neutro', summary: 'Equipe econômica negocia medidas compensatórias para desoneração da folha de pagamento.' }
    ],
    factChecks: [
      { id: 'fc-1', claim: 'Lula confiscou poupança ou fundos de previdência privada em novo decreto.', verdict: 'FALSO', debunkSummary: 'Nenhum decreto presidencial autoriza retenção de ativos financeiros; a Constituição proíbe expressamente tal medida.', checkerSource: 'Aos Fatos', date: '2024-04-12', url: 'https://aosfatos.org' },
      { id: 'fc-2', claim: 'Governo aprovou verba para construção de pontes em outros países em 2024.', verdict: 'FALSO', debunkSummary: 'Postagens usaram imagens antigas descontextualizadas de obras de 2012.', checkerSource: 'TSE Fato ou Boato', date: '2024-02-15', url: 'https://tse.jus.br' }
    ],
    electionNumber: '13',
    tags: ['Executivo', 'Presidente', 'Líder PT', 'Nordeste']
  },
  {
    id: 'tarcisio-freitas',
    name: 'Tarcísio Gomes de Freitas',
    popularName: 'Tarcísio de Freitas',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    party: 'REPUBLICANOS',
    role: 'Governador',
    state: 'SP',
    gender: 'M',
    birthDate: '1975-06-19',
    education: 'Engenharia Civil (Instituto Militar de Engenharia - IME)',
    bio: 'Governador do Estado de São Paulo (2023-atual). Ex-Ministro da Infraestrutura (2019-2022) e servidor de carreira do DNIT e CGU.',
    integrityScore: 82,
    attendanceRate: 97,
    cabinetExpensesYear: 0,
    cabinetBudgetLimit: 0,
    netWorthDeclared: 2341000,
    netWorthEvolution: [
      { year: 2022, value: 2341000 }
    ],
    isCleanRecord: true,
    publicProcesses: [
      {
        id: 'proc-tarcisio-1',
        processNumber: 'Aije 0600123-55 / TRE-SP',
        court: 'TSE',
        crimeType: 'Alegação de Domicílio Eleitoral / Conduta Vedada',
        status: 'Arquivado / Prescrito',
        yearStarted: 2022,
        summary: 'Tribunal Regional Eleitoral de São Paulo e TSE julgaram improcedente a ação por comprovação documental válida de vínculo profissional e residencial no estado.',
        officialSourceUrl: 'https://tre-sp.jus.br',
        lastUpdate: '2023-03-22'
      }
    ],
    billsProposed: [],
    votesHistory: [],
    news: [
      { id: 'n-tf-1', title: 'São Paulo conclui leilão de concessão do Trem Intercidades SP-Campinas', source: 'G1 São Paulo', url: 'https://g1.globo.com', date: '2024-02-29', sentiment: 'Positivo', summary: 'Projeto de infraestrutura ferroviária de R$ 14 bilhões atrai consórcio internacional.' },
      { id: 'n-tf-2', title: 'Privatização da Sabesp é concluída na B3 com arrecadação de R$ 14,8 bi', source: 'Estadão', url: 'https://estadao.com.br', date: '2024-07-23', sentiment: 'Neutro', summary: 'Processo atrai investimentos privados com metas contratuais de universalização do saneamento até 2029.' }
    ],
    factChecks: [
      { id: 'fc-tf-1', claim: 'Tarcísio assinou decreto que proíbe livros escolares no estado de SP.', verdict: 'ENGANOSO', debunkSummary: 'Houve debate sobre materiais didáticos digitais suplementares, mas nenhum livro foi censurado por decreto.', checkerSource: 'Agência Lupa', date: '2023-08-10', url: 'https://lupa.uol.com.br' }
    ],
    electionNumber: '10',
    tags: ['Executivo', 'Governador SP', 'Infraestrutura', 'Sudeste']
  },
  {
    id: 'rodrigo-pacheco',
    name: 'Rodrigo Otavio Soares Pacheco',
    popularName: 'Rodrigo Pacheco',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    party: 'PSD',
    role: 'Senador',
    state: 'MG',
    gender: 'M',
    birthDate: '1976-11-03',
    education: 'Direito (PUC Minas)',
    bio: 'Presidente do Senado Federal e do Congresso Nacional (2021-atual). Advogado criminalista e ex-deputado federal por Minas Gerais.',
    integrityScore: 85,
    attendanceRate: 96,
    cabinetExpensesYear: 284500,
    cabinetBudgetLimit: 540000,
    netWorthDeclared: 3125000,
    netWorthEvolution: [
      { year: 2014, value: 1200000 },
      { year: 2018, value: 2800000 },
      { year: 2022, value: 3125000 }
    ],
    isCleanRecord: true,
    publicProcesses: [],
    billsProposed: [
      { id: 'b-rp-1', code: 'PL 2338/2023', title: 'Marco Regulatório da Inteligência Artificial', votePosition: 'A Favor', year: 2023 },
      { id: 'b-rp-2', code: 'PEC 8/2021', title: 'Limitação de Decisões Monocráticas no STF', votePosition: 'A Favor', year: 2023 }
    ],
    votesHistory: [
      { id: 'v-rp-1', billCode: 'PEC 45/2019', billName: 'Reforma Tributária', vote: 'SIM', date: '2023-11-08', partyGuidance: 'SIM', isAlignmentWithParty: true },
      { id: 'v-rp-2', billCode: 'PL 2338/2023', billName: 'Regulação da Inteligência Artificial', vote: 'SIM', date: '2024-07-04', partyGuidance: 'SIM', isAlignmentWithParty: true }
    ],
    news: [
      { id: 'n-rp-1', title: 'Senado aprova projeto de renegociação das dívidas dos estados federados', source: 'Agência Senado', url: 'https://senado.leg.br', date: '2024-08-14', sentiment: 'Positivo', summary: 'Proposta liderada por Pacheco propõe abatimento de juros em troca de investimentos em educação técnica.' }
    ],
    factChecks: [],
    tags: ['Legislativo', 'Senador', 'Presidente Senado', 'Minas Gerais']
  },
  {
    id: 'arthur-lira',
    name: 'Arthur César Pereira de Lira',
    popularName: 'Arthur Lira',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    party: 'PP',
    role: 'Deputado Federal',
    state: 'AL',
    gender: 'M',
    birthDate: '1969-06-25',
    education: 'Direito (UFAL) e Agropecuária',
    bio: 'Presidente da Câmara dos Deputados (2021-2025). Deputado federal por Alagoas desde 2011 e um dos principais expoentes do bloco parlamentar central.',
    integrityScore: 68,
    attendanceRate: 94,
    cabinetExpensesYear: 412000,
    cabinetBudgetLimit: 516000,
    netWorthDeclared: 5960000,
    netWorthEvolution: [
      { year: 2010, value: 1900000 },
      { year: 2018, value: 4100000 },
      { year: 2022, value: 5960000 }
    ],
    isCleanRecord: true,
    publicProcesses: [
      {
        id: 'proc-lira-1',
        processNumber: 'Inq. 3.989 / STF',
        court: 'STF',
        crimeType: 'Investigação da Operação Lava Jato / Quadrilhão do PP',
        status: 'Arquivado / Prescrito',
        yearStarted: 2015,
        summary: 'A 1ª Turma do STF rejeitou a denúncia da PGR por falta de elementos comprobatórios mínimos e ausência de justa causa.',
        officialSourceUrl: 'https://portal.stf.jus.br',
        lastUpdate: '2023-06-06'
      },
      {
        id: 'proc-lira-2',
        processNumber: 'Pet 8.891 / STF',
        court: 'STF',
        crimeType: 'Acusação de Corrupção Passiva (Caso do assessor em Congonhas)',
        status: 'Absolvido',
        yearStarted: 2019,
        summary: 'A 1ª Turma do STF acolheu recurso da defesa e absolveu por insuficiência probatória.',
        officialSourceUrl: 'https://portal.stf.jus.br',
        lastUpdate: '2023-06-06'
      }
    ],
    billsProposed: [
      { id: 'b-al-1', code: 'PL 2630/2020', title: 'Lei Brasileira de Liberdade, Responsabilidade e Transparência na Internet', votePosition: 'Abstenção', year: 2023 },
      { id: 'b-al-2', code: 'PEC 45/2019', title: 'Reforma Tributária', votePosition: 'A Favor', year: 2023 }
    ],
    votesHistory: [
      { id: 'v-al-1', billCode: 'PEC 45/2019', billName: 'Aprovação da Reforma Tributária', vote: 'SIM', date: '2023-07-07', partyGuidance: 'SIM', isAlignmentWithParty: true },
      { id: 'v-al-2', billCode: 'PLP 93/2023', billName: 'Novo Arcabouço Fiscal', vote: 'SIM', date: '2023-05-24', partyGuidance: 'SIM', isAlignmentWithParty: true }
    ],
    news: [
      { id: 'n-al-1', title: 'Câmara aprova texto-base da regulamentação da Reforma Tributária', source: 'Câmara Notícias', url: 'https://camara.leg.br', date: '2024-07-10', sentiment: 'Positivo', summary: 'Votação expressiva com 336 votos favoráveis institui a Cesta Básica Nacional com alíquota zero.' }
    ],
    factChecks: [
      { id: 'fc-al-1', claim: 'Arthur Lira foi condenado em definitivo pelo STF e perdeu mandato.', verdict: 'FALSO', debunkSummary: 'As denúncias contra o parlamentar foram arquivadas ou rejeitadas pelo Supremo.', checkerSource: 'Aos Fatos', date: '2023-09-01', url: 'https://aosfatos.org' }
    ],
    electionNumber: '1111',
    tags: ['Legislativo', 'Deputado Federal', 'Presidente da Câmara', 'Alagoas']
  },
  {
    id: 'erika-hilton',
    name: 'Erika Santos Silva',
    popularName: 'Erika Hilton',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    party: 'PSOL',
    role: 'Deputado Federal',
    state: 'SP',
    gender: 'F',
    birthDate: '1992-12-09',
    education: 'Pedagogia (incompleto) e Gestão Pública',
    bio: 'Líder da bancada do PSOL na Câmara dos Deputados. Uma das primeiras mulheres trans eleitas para o Congresso Nacional, com atuação focada em direitos trabalhistas e direitos humanos.',
    integrityScore: 92,
    attendanceRate: 99,
    cabinetExpensesYear: 295000,
    cabinetBudgetLimit: 516000,
    netWorthDeclared: 142000,
    netWorthEvolution: [
      { year: 2020, value: 35000 },
      { year: 2022, value: 142000 }
    ],
    isCleanRecord: true,
    publicProcesses: [],
    billsProposed: [
      { id: 'b-eh-1', code: 'PEC Escala 6x1', title: 'Fim da Escala 6x1 e Redução da Jornada para 36h Semanais', votePosition: 'A Favor', year: 2024 },
      { id: 'b-eh-2', code: 'PL 1245/2023', title: 'Programa Nacional de Inclusão no Mercado de Trabalho', votePosition: 'A Favor', year: 2023 }
    ],
    votesHistory: [
      { id: 'v-eh-1', billCode: 'PEC 45/2019', billName: 'Reforma Tributária', vote: 'SIM', date: '2023-12-15', partyGuidance: 'SIM', isAlignmentWithParty: true },
      { id: 'v-eh-2', billCode: 'PL 1085/2023', billName: 'Igualdade Salarial entre Gêneros', vote: 'SIM', date: '2023-05-04', partyGuidance: 'SIM', isAlignmentWithParty: true }
    ],
    news: [
      { id: 'n-eh-1', title: 'PEC que propõe fim da escala 6x1 reúne assinaturas necessárias na Câmara', source: 'G1', url: 'https://g1.globo.com', date: '2024-11-13', sentiment: 'Positivo', summary: 'Mobilização popular nas redes sociais impulsiona apoio suprapartidário ao projeto.' }
    ],
    factChecks: [
      { id: 'fc-eh-1', claim: 'PEC da jornada 6x1 vai reduzir salário de todos os trabalhadores pela metade.', verdict: 'FALSO', debunkSummary: 'O texto da proposta veda expressamente qualquer redução salarial na alteração da jornada.', checkerSource: 'Agência Lupa', date: '2024-11-14', url: 'https://lupa.uol.com.br' }
    ],
    electionNumber: '5000',
    tags: ['Legislativo', 'Deputada Federal', 'Líder PSOL', 'São Paulo']
  },
  {
    id: 'marcel-van-hattem',
    name: 'Marcel van Hattem',
    popularName: 'Marcel van Hattem',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    party: 'NOVO',
    role: 'Deputado Federal',
    state: 'RS',
    gender: 'M',
    birthDate: '1985-11-08',
    education: 'Relações Internacionais (UFRGS) e Mestrado em Ciência Política (Universidade de Leiden)',
    bio: 'Deputado federal pelo Rio Grande do Sul em segundo mandato. Um dos principais porta-vozes do liberalismo econômico clássico, combate a privilégios e reformas de desregulamentação.',
    integrityScore: 94,
    attendanceRate: 100,
    cabinetExpensesYear: 148000,
    cabinetBudgetLimit: 516000,
    netWorthDeclared: 890000,
    netWorthEvolution: [
      { year: 2018, value: 450000 },
      { year: 2022, value: 890000 }
    ],
    isCleanRecord: true,
    publicProcesses: [],
    billsProposed: [
      { id: 'b-mvh-1', code: 'PL 4251/2023', title: 'Extinção de Imposto Sindical Obrigatório', votePosition: 'A Favor', year: 2023 },
      { id: 'b-mvh-2', code: 'PEC 28/2024', title: 'Controle de Constitucionalidade pelo Congresso', votePosition: 'A Favor', year: 2024 }
    ],
    votesHistory: [
      { id: 'v-mvh-1', billCode: 'PEC 45/2019', billName: 'Reforma Tributária', vote: 'NÃO', date: '2023-12-15', partyGuidance: 'NÃO', isAlignmentWithParty: true },
      { id: 'v-mvh-2', billCode: 'PLP 93/2023', billName: 'Novo Arcabouço Fiscal', vote: 'NÃO', date: '2023-05-24', partyGuidance: 'NÃO', isAlignmentWithParty: true }
    ],
    news: [
      { id: 'n-mvh-1', title: 'Bancada do NOVO economiza mais de 70% da cota parlamentar em 2024', source: 'Congresso em Foco', url: 'https://congressoemfoco.uol.com.br', date: '2024-06-12', sentiment: 'Positivo', summary: 'Dados abertos da Câmara apontam parlamentar entre os que menos utilizam verba pública de gabinete.' }
    ],
    factChecks: [],
    electionNumber: '3030',
    tags: ['Legislativo', 'Deputado Federal', 'Líder NOVO', 'Rio Grande do Sul']
  },
  {
    id: 'tabata-amaral',
    name: 'Tabata Claudia Amaral de Pontes',
    popularName: 'Tabata Amaral',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    party: 'PSB',
    role: 'Deputado Federal',
    state: 'SP',
    gender: 'F',
    birthDate: '1993-11-14',
    education: 'Ciência Política e Astrofísica (Universidade de Harvard)',
    bio: 'Deputada federal por São Paulo em seu segundo mandato e ativista pela educação pública de qualidade. Autora do projeto que instituiu a Política Nacional de Educação Conectada.',
    integrityScore: 91,
    attendanceRate: 98,
    cabinetExpensesYear: 260000,
    cabinetBudgetLimit: 516000,
    netWorthDeclared: 807000,
    netWorthEvolution: [
      { year: 2018, value: 140000 },
      { year: 2022, value: 807000 }
    ],
    isCleanRecord: true,
    publicProcesses: [],
    billsProposed: [
      { id: 'b-ta-1', code: 'Lei 14.818/2024', title: 'Programa Pé-de-Meia para Estudantes do Ensino Médio', votePosition: 'A Favor', year: 2024 },
      { id: 'b-ta-2', code: 'Lei 14.164/2021', title: 'Prevenção da Violência contra a Mulher no Currículo Escolar', votePosition: 'A Favor', year: 2021 }
    ],
    votesHistory: [
      { id: 'v-ta-1', billCode: 'PEC 45/2019', billName: 'Reforma Tributária', vote: 'SIM', date: '2023-12-15', partyGuidance: 'SIM', isAlignmentWithParty: true },
      { id: 'v-ta-2', billCode: 'PL 1085/2023', billName: 'Igualdade Salarial Homens e Mulheres', vote: 'SIM', date: '2023-05-04', partyGuidance: 'SIM', isAlignmentWithParty: true }
    ],
    news: [
      { id: 'n-ta-1', title: 'Programa Pé-de-Meia atinge mais de 2,5 milhões de jovens no Brasil', source: 'MEC Notícias', url: 'https://gov.br/mec', date: '2024-08-01', sentiment: 'Positivo', summary: 'Incentivo financeiro combate a evasão escolar entre famílias cadastradas no CadÚnico.' }
    ],
    factChecks: [
      { id: 'fc-ta-1', claim: 'Deputada votou para extinguir a merenda escolar nas escolas públicas.', verdict: 'FALSO', debunkSummary: 'Tabata é coautora do projeto de reajuste do Programa Nacional de Alimentação Escolar (PNAE).', checkerSource: 'Aos Fatos', date: '2024-09-15', url: 'https://aosfatos.org' }
    ],
    electionNumber: '4040',
    tags: ['Legislativo', 'Deputada Federal', 'Educação', 'São Paulo']
  },
  {
    id: 'sergio-moro',
    name: 'Sergio Fernando Moro',
    popularName: 'Sergio Moro',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    party: 'UNIÃO',
    role: 'Senador',
    state: 'PR',
    gender: 'M',
    birthDate: '1972-08-01',
    education: 'Direito (Universidade Estadual de Maringá) e Doutorado em Direito (UFPR)',
    bio: 'Senador pelo Paraná (2023-atual). Ex-Juiz Federal titular da 13ª Vara de Curitiba responsável pelos processos da Operação Lava Jato e ex-Ministro da Justiça e Segurança Pública (2019-2020).',
    integrityScore: 78,
    attendanceRate: 95,
    cabinetExpensesYear: 290000,
    cabinetBudgetLimit: 540000,
    netWorthDeclared: 1589000,
    netWorthEvolution: [
      { year: 2022, value: 1589000 }
    ],
    isCleanRecord: true,
    publicProcesses: [
      {
        id: 'proc-moro-1',
        processNumber: 'RO-El 0604176-51 / TSE',
        court: 'TSE',
        crimeType: 'Ação de Investigação Judicial Eleitoral (Gastos de Pré-Campanha)',
        status: 'Absolvido',
        yearStarted: 2022,
        summary: 'Por unanimidade (7x0), o Tribunal Superior Eleitoral julgou improcedente a ação de cassação de mandato por falta de comprovação de desequilíbrio eleitoral ou abuso de poder econômico na pré-campanha.',
        officialSourceUrl: 'https://tse.jus.br',
        lastUpdate: '2024-05-21'
      }
    ],
    billsProposed: [
      { id: 'b-sm-1', code: 'PEC Prisão 2ª Instância', title: 'Execução de Pena após Condenação em Segunda Instância', votePosition: 'A Favor', year: 2023 },
      { id: 'b-sm-2', code: 'PL 1301/2023', title: 'Tipificação do Crime de Obstrução de Investigações contra Crime Organizado', votePosition: 'A Favor', year: 2023 }
    ],
    votesHistory: [
      { id: 'v-sm-1', billCode: 'PEC 8/2021', billName: 'Limitação de Decisões Monocráticas no STF', vote: 'SIM', date: '2023-11-22', partyGuidance: 'SIM', isAlignmentWithParty: true },
      { id: 'v-sm-2', billCode: 'PL 2338/2023', billName: 'Regulamentação da IA', vote: 'SIM', date: '2024-07-04', partyGuidance: 'SIM', isAlignmentWithParty: true }
    ],
    news: [
      { id: 'n-sm-1', title: 'TSE confirma por unanimidade a manutenção do mandato do senador Sergio Moro', source: 'G1 Política', url: 'https://g1.globo.com', date: '2024-05-21', sentiment: 'Positivo', summary: 'Ministros concluíram que gastos de pré-campanha não violaram a isonomia do pleito paranaense.' }
    ],
    factChecks: [
      { id: 'fc-sm-1', claim: 'Moro teve contas no exterior bloqueadas por ordem da Interpol em 2024.', verdict: 'FALSO', debunkSummary: 'Nenhum pedido de cooperação internacional ou bloqueio patrimonial foi emitido pela Interpol.', checkerSource: 'TSE Fato ou Boato', date: '2024-06-02', url: 'https://tse.jus.br' }
    ],
    electionNumber: '444',
    tags: ['Legislativo', 'Senador', 'Lava Jato', 'Paraná']
  }
];

export const STATES_DATA: StateData[] = [
  {
    uf: 'SP',
    name: 'São Paulo',
    region: 'Sudeste',
    capital: 'São Paulo',
    governor: 'Tarcísio de Freitas',
    governorParty: 'REPUBLICANOS',
    viceGovernor: 'Felicio Ramuth (PSD)',
    senators: [
      { name: 'Astronauta Marcos Pontes', party: 'PL' },
      { name: 'Giordano', party: 'MDB' },
      { name: 'Mara Gabrilli', party: 'PSD' }
    ],
    deputiesFederalCount: 70,
    electorateSize: 34.4,
    transparencyRank: 2,
    topParties: [
      { party: 'PL', count: 17 },
      { party: 'PT', count: 11 },
      { party: 'UNIÃO', count: 6 },
      { party: 'REPUBLICANOS', count: 5 }
    ],
    keyIssues: ['Expansão de trens metropolitanos e metrô', 'Segurança pública nas grandes cidades', 'Sustentabilidade hídrica da Cantareira', 'Incentivo à indústria automobilística e tecnológica']
  },
  {
    uf: 'RJ',
    name: 'Rio de Janeiro',
    region: 'Sudeste',
    capital: 'Rio de Janeiro',
    governor: 'Cláudio Castro',
    governorParty: 'PL',
    viceGovernor: 'Thiago Pampolha (MDB)',
    senators: [
      { name: 'Flávio Bolsonaro', party: 'PL' },
      { name: 'Carlos Portinho', party: 'PL' },
      { name: 'Romário', party: 'PL' }
    ],
    deputiesFederalCount: 46,
    electorateSize: 13.0,
    transparencyRank: 18,
    topParties: [
      { party: 'PL', count: 11 },
      { party: 'UNIÃO', count: 6 },
      { party: 'PT', count: 5 },
      { party: 'PSOL', count: 5 }
    ],
    keyIssues: ['Combate ao crime organizado e milícias', 'Regime de Recuperação Fiscal com a União', 'Distribuição de royalties do petróleo e gás', 'Revitalização do centro histórico e turismo']
  },
  {
    uf: 'MG',
    name: 'Minas Gerais',
    region: 'Sudeste',
    capital: 'Belo Horizonte',
    governor: 'Romeu Zema',
    governorParty: 'NOVO',
    viceGovernor: 'Mateus Simões (NOVO)',
    senators: [
      { name: 'Rodrigo Pacheco', party: 'PSD' },
      { name: 'Cleitinho Azevedo', party: 'REPUBLICANOS' },
      { name: 'Carlos Viana', party: 'PODEMOS' }
    ],
    deputiesFederalCount: 53,
    electorateSize: 16.2,
    transparencyRank: 5,
    topParties: [
      { party: 'PL', count: 11 },
      { party: 'PT', count: 10 },
      { party: 'AVANTE', count: 5 },
      { party: 'PSD', count: 4 }
    ],
    keyIssues: ['Renegociação da dívida pública estadual', 'Recuperação de rodovias federais e estaduais', 'Segurança das barragens e mineração', 'Expansão da cafeicultura e agricultura familiar']
  },
  {
    uf: 'BA',
    name: 'Bahia',
    region: 'Nordeste',
    capital: 'Salvador',
    governor: 'Jerônimo Rodrigues',
    governorParty: 'PT',
    viceGovernor: 'Geraldo Júnior (MDB)',
    senators: [
      { name: 'Jaques Wagner', party: 'PT' },
      { name: 'Otto Alencar', party: 'PSD' },
      { name: 'Angelo Coronel', party: 'PSD' }
    ],
    deputiesFederalCount: 39,
    electorateSize: 11.2,
    transparencyRank: 8,
    topParties: [
      { party: 'PT', count: 8 },
      { party: 'UNIÃO', count: 6 },
      { party: 'PSD', count: 6 },
      { party: 'PP', count: 4 }
    ],
    keyIssues: ['Segurança pública integrada', 'Polo industrial de veículos elétricos (BYD em Camaçari)', 'Transposição do Rio São Francisco', 'Energia solar e eólica na caatinga']
  },
  {
    uf: 'RS',
    name: 'Rio Grande do Sul',
    region: 'Sul',
    capital: 'Porto Alegre',
    governor: 'Eduardo Leite',
    governorParty: 'PSDB',
    viceGovernor: 'Gabriel Souza (MDB)',
    senators: [
      { name: 'Hamilton Mourão', party: 'REPUBLICANOS' },
      { name: 'Luis Carlos Heinze', party: 'PP' },
      { name: 'Paulo Paim', party: 'PT' }
    ],
    deputiesFederalCount: 31,
    electorateSize: 8.6,
    transparencyRank: 3,
    topParties: [
      { party: 'PT', count: 6 },
      { party: 'PL', count: 5 },
      { party: 'MDB', count: 3 },
      { party: 'REPUBLICANOS', count: 3 }
    ],
    keyIssues: ['Reconstrução de infraestrutura resiliente a enchentes', 'Plano de adaptação climática dos vales', 'Apoio ao agronegócio de arroz e soja', 'Equilíbrio da previdência estadual']
  },
  {
    uf: 'PR',
    name: 'Paraná',
    region: 'Sul',
    capital: 'Curitiba',
    governor: 'Ratinho Júnior',
    governorParty: 'PSD',
    viceGovernor: 'Darci Piana (PSD)',
    senators: [
      { name: 'Sergio Moro', party: 'UNIÃO' },
      { name: 'Oriovisto Guimarães', party: 'PODEMOS' },
      { name: 'Flávio Arns', party: 'PSB' }
    ],
    deputiesFederalCount: 30,
    electorateSize: 8.5,
    transparencyRank: 4,
    topParties: [
      { party: 'PSD', count: 7 },
      { party: 'PT', count: 5 },
      { party: 'PP', count: 4 },
      { party: 'PL', count: 3 }
    ],
    keyIssues: ['Novas concessões do anel de pedágio rodoviário', 'Porto de Paranaguá e corredor de exportação', 'Tecnologia no agronegócio', 'Sustentabilidade da Bacia do Rio Iguaçu']
  },
  {
    uf: 'PE',
    name: 'Pernambuco',
    region: 'Nordeste',
    capital: 'Recife',
    governor: 'Raquel Lyra',
    governorParty: 'PSDB',
    viceGovernor: 'Priscila Krause (CIDADANIA)',
    senators: [
      { name: 'Humberto Costa', party: 'PT' },
      { name: 'Teresa Leitão', party: 'PT' },
      { name: 'Fernando Dueire', party: 'MDB' }
    ],
    deputiesFederalCount: 25,
    electorateSize: 7.1,
    transparencyRank: 6,
    topParties: [
      { party: 'PSB', count: 5 },
      { party: 'PL', count: 4 },
      { party: 'UNIÃO', count: 3 },
      { party: 'PT', count: 3 }
    ],
    keyIssues: ['Conclusão da Ferrovia Transnordestina', 'Segurança hídrica do Agreste e Sertão', 'Revitalização do Porto Digital', 'Complexo Industrial Portuário de Suape']
  },
  {
    uf: 'CE',
    name: 'Ceará',
    region: 'Nordeste',
    capital: 'Fortaleza',
    governor: 'Elmano de Freitas',
    governorParty: 'PT',
    viceGovernor: 'Jade Romero (MDB)',
    senators: [
      { name: 'Camilo Santana', party: 'PT' },
      { name: 'Cid Gomes', party: 'PSB' },
      { name: 'Eduardo Girão', party: 'NOVO' }
    ],
    deputiesFederalCount: 22,
    electorateSize: 6.8,
    transparencyRank: 7,
    topParties: [
      { party: 'PL', count: 5 },
      { party: 'PT', count: 5 },
      { party: 'UNIÃO', count: 4 },
      { party: 'PDT', count: 3 }
    ],
    keyIssues: ['Hub do Hidrogênio Verde no Porto do Pecém', 'Consolidação das escolas de tempo integral (nota do IDEB)', 'Dessalinização de água para a região metropolitana', 'Segurança pública nas periferias']
  },
  {
    uf: 'PA',
    name: 'Pará',
    region: 'Norte',
    capital: 'Belém',
    governor: 'Helder Barbalho',
    governorParty: 'MDB',
    viceGovernor: 'Hana Ghassan (MDB)',
    senators: [
      { name: 'Jader Barbalho', party: 'MDB' },
      { name: 'Beto Faro', party: 'PT' },
      { name: 'Zequinha Marinho', party: 'PODEMOS' }
    ],
    deputiesFederalCount: 17,
    electorateSize: 6.1,
    transparencyRank: 12,
    topParties: [
      { party: 'MDB', count: 9 },
      { party: 'PL', count: 3 },
      { party: 'PT', count: 2 }
    ],
    keyIssues: ['Organização e infraestrutura para a COP30 em Belém', 'Bioeconomia e combate ao desmatamento ilegal', 'Regularização fundiária na Amazônia', 'Logística de escoamento pelo Arco Norte']
  },
  {
    uf: 'SC',
    name: 'Santa Catarina',
    region: 'Sul',
    capital: 'Florianópolis',
    governor: 'Jorginho Mello',
    governorParty: 'PL',
    viceGovernor: 'Marilisa Boehm (PL)',
    senators: [
      { name: 'Esperidião Amin', party: 'PP' },
      { name: 'Jorge Seif', party: 'PL' },
      { name: 'Ivete da Silveira', party: 'MDB' }
    ],
    deputiesFederalCount: 16,
    electorateSize: 5.5,
    transparencyRank: 1,
    topParties: [
      { party: 'PL', count: 6 },
      { party: 'MDB', count: 3 },
      { party: 'PT', count: 2 },
      { party: 'UNIÃO', count: 2 }
    ],
    keyIssues: ['Infraestrutura das rodovias BR-101 e BR-470', 'Prevenção e contenção de cheias no Vale do Itajaí', 'Complexo portuário de Itajaí e Navegantes', 'Indústria têxtil e polo de inovação']
  },
  {
    uf: 'GO',
    name: 'Goiás',
    region: 'Centro-Oeste',
    capital: 'Goiânia',
    governor: 'Ronaldo Caiado',
    governorParty: 'UNIÃO',
    viceGovernor: 'Daniel Vilela (MDB)',
    senators: [
      { name: 'Vanderlan Cardoso', party: 'PSD' },
      { name: 'Jorge Kajuru', party: 'PSB' },
      { name: 'Wilder Morais', party: 'PL' }
    ],
    deputiesFederalCount: 17,
    electorateSize: 4.9,
    transparencyRank: 9,
    topParties: [
      { party: 'PL', count: 4 },
      { party: 'UNIÃO', count: 2 },
      { party: 'MDB', count: 2 },
      { party: 'PP', count: 2 }
    ],
    keyIssues: ['Segurança pública e combate ao narcotráfico rural', 'Expansão da Ferrovia Norte-Sul e FICO', 'Armazenagem e escoamento de grãos', 'Polo farmacêutico de Anápolis']
  },
  {
    uf: 'DF',
    name: 'Distrito Federal',
    region: 'Centro-Oeste',
    capital: 'Brasília',
    governor: 'Ibaneis Rocha',
    governorParty: 'MDB',
    viceGovernor: 'Celina Leão (PP)',
    senators: [
      { name: 'Damares Alves', party: 'REPUBLICANOS' },
      { name: 'Izalci Lucas', party: 'PL' },
      { name: 'Leila Barros', party: 'PDT' }
    ],
    deputiesFederalCount: 8,
    electorateSize: 2.2,
    transparencyRank: 10,
    topParties: [
      { party: 'PL', count: 2 },
      { party: 'PT', count: 1 },
      { party: 'MDB', count: 1 },
      { party: 'REPUBLICANOS', count: 1 }
    ],
    keyIssues: ['Manutenção do Fundo Constitucional do DF (FCDF)', 'Mobilidade urbana integrada com cidades do Entorno', 'Segurança na Esplanada e prédios públicos', 'Saúde pública hospitalar']
  },
  {
    uf: 'AM',
    name: 'Amazonas',
    region: 'Norte',
    capital: 'Manaus',
    governor: 'Wilson Lima',
    governorParty: 'UNIÃO',
    viceGovernor: 'Tadeu de Souza (AVANTE)',
    senators: [
      { name: 'Eduardo Braga', party: 'MDB' },
      { name: 'Omar Aziz', party: 'PSD' },
      { name: 'Plínio Valério', party: 'PSDB' }
    ],
    deputiesFederalCount: 8,
    electorateSize: 2.7,
    transparencyRank: 15,
    topParties: [
      { party: 'UNIÃO', count: 2 },
      { party: 'PL', count: 2 },
      { party: 'PSD', count: 1 },
      { party: 'REPUBLICANOS', count: 1 }
    ],
    keyIssues: ['Incentivos e competitividade da Zona Franca de Manaus na Reforma Tributária', 'Pavimentação sustentável da BR-319', 'Navegabilidade dos rios e socorro em secas extremas', 'Proteção aos povos indígenas e reservas']
  },
  {
    uf: 'MT',
    name: 'Mato Grosso',
    region: 'Centro-Oeste',
    capital: 'Cuiabá',
    governor: 'Mauro Mendes',
    governorParty: 'UNIÃO',
    viceGovernor: 'Otaviano Pivetta (REPUBLICANOS)',
    senators: [
      { name: 'Wellington Fagundes', party: 'PL' },
      { name: 'Jayme Campos', party: 'UNIÃO' },
      { name: 'Margareth Buzetti', party: 'PSD' }
    ],
    deputiesFederalCount: 8,
    electorateSize: 2.5,
    transparencyRank: 11,
    topParties: [
      { party: 'PL', count: 4 },
      { party: 'MDB', count: 2 },
      { party: 'UNIÃO', count: 2 }
    ],
    keyIssues: ['Ferrovia Estadual de Integração e Ferrorvia FICO', 'Liderança mundial na produção de grãos e carne sustentável', 'Conflitos fundiários e marco temporal', 'Preservação do Pantanal mato-grossense']
  },
  {
    uf: 'MS',
    name: 'Mato Grosso do Sul',
    region: 'Centro-Oeste',
    capital: 'Campo Grande',
    governor: 'Eduardo Riedel',
    governorParty: 'PSDB',
    viceGovernor: 'Barbosinha (PP)',
    senators: [
      { name: 'Tereza Cristina', party: 'PP' },
      { name: 'Nelsinho Trad', party: 'PSD' },
      { name: 'Soraya Thronicke', party: 'PODEMOS' }
    ],
    deputiesFederalCount: 8,
    electorateSize: 2.0,
    transparencyRank: 13,
    topParties: [
      { party: 'PSDB', count: 3 },
      { party: 'PT', count: 2 },
      { party: 'PL', count: 2 }
    ],
    keyIssues: ['Rota Bioceânica conectando o Brasil aos portos do Pacífico', 'Polo mundial de celulose (Vale da Celulose)', 'Prevenção de incêndios no Pantanal', 'Segurança na fronteira com Paraguai e Bolívia']
  },
  {
    uf: 'MA',
    name: 'Maranhão',
    region: 'Nordeste',
    capital: 'São Luís',
    governor: 'Carlos Brandão',
    governorParty: 'PSB',
    viceGovernor: 'Felipe Camarão (PT)',
    senators: [
      { name: 'Weverton Rocha', party: 'PDT' },
      { name: 'Ana Paula Lobato', party: 'PSB' },
      { name: 'Eliziane Gama', party: 'PSD' }
    ],
    deputiesFederalCount: 18,
    electorateSize: 5.0,
    transparencyRank: 19,
    topParties: [
      { party: 'PL', count: 4 },
      { party: 'PCdoB', count: 3 },
      { party: 'PP', count: 2 }
    ],
    keyIssues: ['Expansão do Porto do Itaqui', 'Centro Espacial de Alcântara', 'Superação da pobreza e programas de segurança alimentar', 'Logística da Ferrovia Carajás']
  },
  {
    uf: 'ES',
    name: 'Espírito Santo',
    region: 'Sudeste',
    capital: 'Vitória',
    governor: 'Renato Casagrande',
    governorParty: 'PSB',
    viceGovernor: 'Ricardo Ferraço (MDB)',
    senators: [
      { name: 'Fabiano Contarato', party: 'PT' },
      { name: 'Magno Malta', party: 'PL' },
      { name: 'Marcos do Val', party: 'PODEMOS' }
    ],
    deputiesFederalCount: 10,
    electorateSize: 2.9,
    transparencyRank: 1,
    topParties: [
      { party: 'PP', count: 2 },
      { party: 'PODEMOS', count: 2 },
      { party: 'PT', count: 2 }
    ],
    keyIssues: ['Nota A em gestão fiscal e transparência há mais de 10 anos', 'Ferrovia Vitória-Minas e duplicação da BR-101', 'Mineração de pelotas de ferro e rochas ornamentais', 'Políticas de preservação da Mata Atlântica']
  },
  {
    uf: 'PB',
    name: 'Paraíba',
    region: 'Nordeste',
    capital: 'João Pessoa',
    governor: 'João Azevêdo',
    governorParty: 'PSB',
    viceGovernor: 'Lucas Ribeiro (PP)',
    senators: [
      { name: 'Veneziano Vital do Rêgo', party: 'MDB' },
      { name: 'Efraim Filho', party: 'UNIÃO' },
      { name: 'Daniella Ribeiro', party: 'PSD' }
    ],
    deputiesFederalCount: 12,
    electorateSize: 3.1,
    transparencyRank: 14,
    topParties: [
      { party: 'PSB', count: 3 },
      { party: 'REPUBLICANOS', count: 3 },
      { party: 'PL', count: 2 }
    ],
    keyIssues: ['Ramal Curimataú e transposição das águas', 'Polo de tecnologia de Campina Grande', 'Turismo ecológico e cultural', 'Energia solar distribuída no semiárido']
  },
  {
    uf: 'RN',
    name: 'Rio Grande do Norte',
    region: 'Nordeste',
    capital: 'Natal',
    governor: 'Fátima Bezerra',
    governorParty: 'PT',
    viceGovernor: 'Walter Alves (MDB)',
    senators: [
      { name: 'Rogério Marinho', party: 'PL' },
      { name: 'Styvenson Valentim', party: 'PODEMOS' },
      { name: 'Zenaide Maia', party: 'PSD' }
    ],
    deputiesFederalCount: 8,
    electorateSize: 2.6,
    transparencyRank: 16,
    topParties: [
      { party: 'PL', count: 4 },
      { party: 'PT', count: 2 },
      { party: 'UNIÃO', count: 2 }
    ],
    keyIssues: ['Liderança nacional em energia eólica onshore e offshore', 'Indústria salineira em Mossoró', 'Recuperação fiscal e saúde pública', 'Concessão do Aeroporto de São Gonçalo do Amarante']
  },
  {
    uf: 'AL',
    name: 'Alagoas',
    region: 'Nordeste',
    capital: 'Maceió',
    governor: 'Paulo Dantas',
    governorParty: 'MDB',
    viceGovernor: 'Ronaldo Lessa (PDT)',
    senators: [
      { name: 'Renan Calheiros', party: 'MDB' },
      { name: 'Rodrigo Cunha', party: 'PODEMOS' },
      { name: 'Fernando Farias', party: 'MDB' }
    ],
    deputiesFederalCount: 9,
    electorateSize: 2.4,
    transparencyRank: 20,
    topParties: [
      { party: 'MDB', count: 4 },
      { party: 'PP', count: 4 },
      { party: 'PT', count: 1 }
    ],
    keyIssues: ['Indenização e reparação da área afundada pela Braskem em Maceió', 'Canal do Sertão Alagoano', 'Polo químico e sucroalcooleiro', 'Combate à desigualdade social no agreste']
  },
  {
    uf: 'PI',
    name: 'Piauí',
    region: 'Nordeste',
    capital: 'Teresina',
    governor: 'Rafael Fonteles',
    governorParty: 'PT',
    viceGovernor: 'Themístocles Filho (MDB)',
    senators: [
      { name: 'Wellington Dias', party: 'PT' },
      { name: 'Marcelo Castro', party: 'MDB' },
      { name: 'Jussara Lima', party: 'PSD' }
    ],
    deputiesFederalCount: 10,
    electorateSize: 2.6,
    transparencyRank: 17,
    topParties: [
      { party: 'PT', count: 5 },
      { party: 'MDB', count: 3 },
      { party: 'PP', count: 2 }
    ],
    keyIssues: ['Transformação digital dos serviços públicos', 'Expansão agrícola do MATOPIBA nos cerrados', 'Porto de Luís Correia no litoral', 'Projetos de hidrogênio verde e energia solar']
  },
  {
    uf: 'SE',
    name: 'Sergipe',
    region: 'Nordeste',
    capital: 'Aracaju',
    governor: 'Fábio Mitidieri',
    governorParty: 'PSD',
    viceGovernor: 'Zezinho Sobral (PDT)',
    senators: [
      { name: 'Rogério Carvalho', party: 'PT' },
      { name: 'Alessandro Vieira', party: 'MDB' },
      { name: 'Laércio Oliveira', party: 'PP' }
    ],
    deputiesFederalCount: 8,
    electorateSize: 1.7,
    transparencyRank: 15,
    topParties: [
      { party: 'PSD', count: 2 },
      { party: 'UNIÃO', count: 2 },
      { party: 'PP', count: 2 }
    ],
    keyIssues: ['Exploração de gás natural em águas profundas (Projeto Sergipe Águas Profundas)', 'Modernização da orla e turismo em Aracaju', 'Saneamento básico regionalizado', 'Fruticultura irrigada no Rio São Francisco']
  },
  {
    uf: 'TO',
    name: 'Tocantins',
    region: 'Norte',
    capital: 'Palmas',
    governor: 'Wanderlei Barbosa',
    governorParty: 'REPUBLICANOS',
    viceGovernor: 'Laurez Moreira (PDT)',
    senators: [
      { name: 'Eduardo Gomes', party: 'PL' },
      { name: 'Irajá', party: 'PSD' },
      { name: 'Professora Dorinha', party: 'UNIÃO' }
    ],
    deputiesFederalCount: 8,
    electorateSize: 1.1,
    transparencyRank: 21,
    topParties: [
      { party: 'PL', count: 3 },
      { party: 'REPUBLICANOS', count: 2 },
      { party: 'UNIÃO', count: 2 }
    ],
    keyIssues: ['Polo logístico da Ferrovia Norte-Sul em Porto Nacional', 'Agronegócio sustentável no Vale do Araguaia', 'Preservação das veredas do Jalapão', 'Educação técnica nos municípios']
  },
  {
    uf: 'RO',
    name: 'Rondônia',
    region: 'Norte',
    capital: 'Porto Velho',
    governor: 'Marcos Rocha',
    governorParty: 'UNIÃO',
    viceGovernor: 'Sérgio Gonçalves (UNIÃO)',
    senators: [
      { name: 'Marcos Rogério', party: 'PL' },
      { name: 'Confúcio Moura', party: 'MDB' },
      { name: 'Jaime Bagattoli', party: 'PL' }
    ],
    deputiesFederalCount: 8,
    electorateSize: 1.2,
    transparencyRank: 22,
    topParties: [
      { party: 'PL', count: 3 },
      { party: 'UNIÃO', count: 3 },
      { party: 'MDB', count: 1 }
    ],
    keyIssues: ['Ponte Internacional sobre o Rio Guaporé ligando à Bolívia', 'Produção de café robusta amazônico e pecuária', 'Recuperação de trechos da BR-364', 'Segurança na fronteira fluvial']
  },
  {
    uf: 'AC',
    name: 'Acre',
    region: 'Norte',
    capital: 'Rio Branco',
    governor: 'Gladson Cameli',
    governorParty: 'PP',
    viceGovernor: 'Mailza Assis (PP)',
    senators: [
      { name: 'Márcio Bittar', party: 'UNIÃO' },
      { name: 'Sérgio Petecão', party: 'PSD' },
      { name: 'Alan Rick', party: 'UNIÃO' }
    ],
    deputiesFederalCount: 8,
    electorateSize: 0.6,
    transparencyRank: 24,
    topParties: [
      { party: 'UNIÃO', count: 3 },
      { party: 'PP', count: 2 },
      { party: 'REPUBLICANOS', count: 1 }
    ],
    keyIssues: ['Acesso perene pela BR-364 até Cruzeiro do Sul', 'Enchentes históricas do Rio Acre e auxílio emergencial', 'Valorização da borracha, castanha e açaí nativos', 'Segurança contra o tráfico fronteiriço']
  },
  {
    uf: 'AP',
    name: 'Amapá',
    region: 'Norte',
    capital: 'Macapá',
    governor: 'Clécio Luís',
    governorParty: 'SOLIDARIEDADE',
    viceGovernor: 'Teles Júnior (PDT)',
    senators: [
      { name: 'Randolfe Rodrigues', party: 'PT' },
      { name: 'Davi Alcolumbre', party: 'UNIÃO' },
      { name: 'Lucas Barreto', party: 'PSD' }
    ],
    deputiesFederalCount: 8,
    electorateSize: 0.55,
    transparencyRank: 23,
    topParties: [
      { party: 'UNIÃO', count: 2 },
      { party: 'PL', count: 2 },
      { party: 'PDT', count: 2 }
    ],
    keyIssues: ['Debate ambiental e econômico sobre petróleo na Margem Equatorial', 'Conclusão do asfaltamento da BR-156 até o Oiapoque', 'Segurança e estabilidade energética do estado', 'Créditos de carbono florestais']
  },
  {
    uf: 'RR',
    name: 'Roraima',
    region: 'Norte',
    capital: 'Boa Vista',
    governor: 'Antonio Denarium',
    governorParty: 'PP',
    viceGovernor: 'Edilson Damião (REPUBLICANOS)',
    senators: [
      { name: 'Mecias de Jesus', party: 'REPUBLICANOS' },
      { name: 'Dr. Hiran', party: 'PP' },
      { name: 'Chico Rodrigues', party: 'PSB' }
    ],
    deputiesFederalCount: 8,
    electorateSize: 0.4,
    transparencyRank: 25,
    topParties: [
      { party: 'REPUBLICANOS', count: 3 },
      { party: 'UNIÃO', count: 2 },
      { party: 'PP', count: 2 }
    ],
    keyIssues: ['Operação Acolhida e fluxo migratório venezuelano', 'Construção do Linhão de Tucuruí Manaus-Boa Vista', 'Proteção e saúde na Terra Indígena Yanomami', 'Expansão da soja no lavrado']
  }
];

export const LEGISLATIONS_DATA: Legislation[] = [
  {
    id: 'leg-1',
    code: 'PEC 45/2019',
    title: 'Reforma Tributária sobre o Consumo (IBS e CBS)',
    author: 'Dep. Baleia Rossi (MDB/SP)',
    authorParty: 'MDB',
    category: 'Economia',
    chamber: 'Congresso Nacional',
    presentationDate: '2019-04-03',
    lastUpdateDate: '2024-08-15',
    status: 'Sancionado',
    urgency: true,
    plainTextSummary: 'Unifica cinco tributos (PIS, Cofins, IPI, ICMS e ISS) no Imposto sobre Bens e Serviços (IBS) e na Contribuição sobre Bens e Serviços (CBS), com modelo de IVA dual moderno, alíquota zero para cesta básica e cashback para famílias de baixa renda.',
    keyPoints: [
      'Extinção gradual de PIS, COFINS, IPI, ICMS e ISS até 2033',
      'Criação do IVA Dual (IBS para estados/municípios e CBS para União)',
      'Cesta Básica Nacional com isenção total de impostos',
      'Mecanismo de devolução de impostos (Cashback) para inscritos no CadÚnico',
      'Imposto Seletivo sobre produtos prejudiciais à saúde ou ao meio ambiente'
    ],
    publicConsultation: {
      totalVotes: 48920,
      votesFavor: 35710,
      votesContra: 13210,
      isOpen: true
    },
    officialLink: 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2196833',
    aiAnalysis: {
      pros: [
        'Fim da guerra fiscal entre estados e simplificação drástica do cálculo contábil empresarial',
        'Transparência total na nota fiscal: o cidadão saberá exatamente quanto paga de imposto',
        'Desoneração completa dos produtos básicos de alimentação'
      ],
      cons: [
        'Período longo de transição (2026 a 2033) com coexistência de dois sistemas',
        'Setores de serviços podem ter aumento de carga se não usarem muitos créditos intermediários',
        'Complexidade na governança do Conselho Federativo do IBS'
      ],
      citizenImpact: 'Redução de custos burocráticos que encareciam produtos nacionais, barateamento da cesta básica e maior transparência nos preços ao consumidor.'
    }
  },
  {
    id: 'leg-2',
    code: 'PL 2630/2020',
    title: 'Lei Brasileira de Liberdade, Responsabilidade e Transparência na Internet (Marco das Redes / Fake News)',
    author: 'Sen. Alessandro Vieira (MDB/SE)',
    authorParty: 'MDB',
    category: 'Tecnologia',
    chamber: 'Câmara dos Deputados',
    presentationDate: '2020-05-13',
    lastUpdateDate: '2024-07-20',
    status: 'Em Tramitação',
    urgency: true,
    plainTextSummary: 'Estabelece regras de transparência para plataformas digitais (redes sociais, aplicativos de mensagens e buscadores), com dever de cuidado contra crimes na internet, combate a perfis falsos/inautênticos e proteção contra desinformação coordenada.',
    keyPoints: [
      'Obrigatoriedade de relatórios semestrais de transparência sobre moderação de conteúdo',
      'Remuneração de conteúdos jornalísticos profissionais usados pelas big techs',
      'Identificação transparente de anúncios e impulsionamentos políticos eleitorais',
      'Mecanismos rápidos de remoção de conteúdos ilegais (pornografia infantil, terrorismo, incitação a suicídio e golpe de Estado)'
    ],
    publicConsultation: {
      totalVotes: 73400,
      votesFavor: 39600,
      votesContra: 33800,
      isOpen: true
    },
    officialLink: 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2256735',
    aiAnalysis: {
      pros: [
        'Responsabilização das plataformas por impulsionamento de fraudes e crimes cibernéticos',
        'Proteção comprovada de crianças e adolescentes em ambientes digitais',
        'Valorização do jornalismo profissional e combate a robôs/redes de difamação'
      ],
      cons: [
        'Críticos apontam receio de excesso de moderação preventiva e possível censura subjetiva',
        'Dificuldade de definir autoridade fiscalizadora que seja 100% independente do governo de turno'
      ],
      citizenImpact: 'Maior segurança contra golpes financeiros online, redução de linchamentos virtuais e combate qualificado à disseminação de fake news em massa.'
    }
  },
  {
    id: 'leg-3',
    code: 'PEC Escala 6x1',
    title: 'Proposta de Emenda Constitucional para o Fim da Escala 6x1 e Redução da Jornada para 36h',
    author: 'Dep. Erika Hilton (PSOL/SP)',
    authorParty: 'PSOL',
    category: 'Trabalho',
    chamber: 'Câmara dos Deputados',
    presentationDate: '2024-11-01',
    lastUpdateDate: '2024-11-28',
    status: 'Em Tramitação',
    urgency: true,
    plainTextSummary: 'Altera o artigo 7º da Constituição Federal para fixar a jornada de trabalho semanal em no máximo 36 horas em até 4 dias por semana (modelo 4x3), extinguindo a escala 6x1 sem qualquer redução salarial.',
    keyPoints: [
      'Redução da jornada constitucional de 44 horas para 36 horas semanais',
      'Garantia de pelo menos dois a três dias de repouso semanal remunerado',
      'Proibição expressa de redução nominal de vencimentos e salários',
      'Estímulo ao bem-estar, saúde mental e produtividade do trabalhador'
    ],
    publicConsultation: {
      totalVotes: 125400,
      votesFavor: 104200,
      votesContra: 21200,
      isOpen: true
    },
    officialLink: 'https://www.camara.leg.br',
    aiAnalysis: {
      pros: [
        'Aumento comprovado na qualidade de vida, convívio familiar e redução de burnout',
        'Estudos internacionais apontam manutenção ou ganho de produtividade com descanso adequado',
        'Potencial para abertura de novas vagas em setores de atendimento contínuo'
      ],
      cons: [
        'Micro e pequenos empresários (comércio e serviços) relatam receio de aumento de custos de mão de obra',
        'Necessidade de regras de transição e incentivos tributários para setores de alta intensidade de trabalho'
      ],
      citizenImpact: 'Mais tempo livre para os trabalhadores estudarem, descansarem e cuidarem da família, sem perda de remuneração.'
    }
  },
  {
    id: 'leg-4',
    code: 'PL 2338/2023',
    title: 'Marco Legal e Ético da Inteligência Artificial no Brasil',
    author: 'Sen. Rodrigo Pacheco (PSD/MG)',
    authorParty: 'PSD',
    category: 'Tecnologia',
    chamber: 'Senado Federal',
    presentationDate: '2023-05-03',
    lastUpdateDate: '2024-07-04',
    status: 'Aprovado',
    urgency: false,
    plainTextSummary: 'Regulamenta o desenvolvimento, implantação e uso de sistemas de inteligência artificial no território brasileiro, classificando riscos (baixo, médio e alto risco) e garantindo direitos aos titulares de dados e direitos autorais.',
    keyPoints: [
      'Classificação de risco: sistemas de alto risco (saúde, justiça, veículos autônomos, reconhecimento facial) exigem auditoria rigorosa',
      'Proibição de IA para pontuação social (social scoring) e manipulação comportamental danosa',
      'Direito do cidadão a explicação humana sobre decisões tomadas por algoritmos',
      'Remuneração e respeito a direitos autorais em bases de treinamento de IA generativa'
    ],
    publicConsultation: {
      totalVotes: 24100,
      votesFavor: 18900,
      votesContra: 5200,
      isOpen: true
    },
    officialLink: 'https://www25.senado.leg.br/web/atividade/materias/-/materia/157233',
    aiAnalysis: {
      pros: [
        'Segurança jurídica para investimentos de startups e grandes empresas no Brasil',
        'Proteção contra vieses discriminatórios e desinformação profunda (deepfakes)',
        'Alinhamento com as melhores práticas regulatórias internacionais (AI Act europeu)'
      ],
      cons: [
        'Setor de tecnologia alerta contra burocracias que possam atrasar pesquisas acadêmicas ou modelos abertos'
      ],
      citizenImpact: 'Garante que o cidadão não seja prejudicado ou discriminado por robôs em entrevistas de emprego, pedidos de empréstimo bancário ou diagnósticos médicos.'
    }
  },
  {
    id: 'leg-5',
    code: 'PLP 175/2024',
    title: 'Lei de Transparência e Rastreabilidade das Emendas Parlamentares',
    author: 'Dep. Rubens Pereira Jr. (PT/MA)',
    authorParty: 'PT',
    category: 'Política',
    chamber: 'Congresso Nacional',
    presentationDate: '2024-10-18',
    lastUpdateDate: '2024-11-20',
    status: 'Sancionado',
    urgency: true,
    plainTextSummary: 'Estabelece regras claras de rastreabilidade, transparência ativa e publicidade para todas as emendas parlamentares individuais (Pix), de bancada e de comissão, em atendimento às determinações do Supremo Tribunal Federal.',
    keyPoints: [
      'Identificação nominal obrigatória do parlamentar autor em qualquer repasse de verba',
      'Prestação de contas no portal Transferegov com plano de trabalho detalhado',
      'Fiscalização em tempo real pelo Tribunal de Contas da União (TCU) e CGU',
      'Proibição de repasses sem destinação prévia em obras ou ações de saúde/educação'
    ],
    publicConsultation: {
      totalVotes: 64200,
      votesFavor: 58900,
      votesContra: 5300,
      isOpen: false
    },
    officialLink: 'https://www.camara.leg.br',
    aiAnalysis: {
      pros: [
        'Fim definitivo do orçamento secreto e das brechas de ocultação de quem enviou o dinheiro',
        'Controle social direto: qualquer morador de município poderá ver quem indicou a verba para a praça ou posto de saúde',
        'Maior eficiência no gasto público federal'
      ],
      cons: [
        'Pode exigir maior treinamento técnico de prefeituras pequenas para preenchimento de planos de trabalho'
      ],
      citizenImpact: 'O cidadão passa a saber exatamente onde cada centavo de emenda parlamentar da sua cidade foi aplicado e quem foi o político responsável.'
    }
  }
];

export const FACT_CHECKS_DATA = [
  {
    id: 'fc-global-1',
    claim: 'Urnas eletrônicas brasileiras foram hackeadas ou contêm código para desviar votos.',
    claimant: 'Vídeos virais em redes sociais e correntes de WhatsApp',
    verdict: 'FALSO' as const,
    context: 'Alegações recorrentes durante ciclos eleitorais afirmando que votos seriam adulterados internamente.',
    debunkSummary: 'As urnas eletrônicas não são conectadas à internet, contam com mais de 30 camadas de segurança e passam pelo Teste Público de Segurança (TPS) com participação de universidades, Forças Armadas, OAB, Polícia Federal e partidos de todos os espectros. O boletim de urna impresso (BU) é afixado na porta de cada seção antes da transmissão dos dados e pode ser auditado por qualquer cidadão.',
    source: 'TSE Fato ou Boato / Comprova / Aos Fatos',
    sourceUrl: 'https://www.tse.jus.br/comunicacao/fato-ou-boato',
    verificationDate: '2024-09-10',
    relatedPoliticians: ['lula', 'arthur-lira']
  },
  {
    id: 'fc-global-2',
    claim: 'Governo Federal aprovou taxação de heranças e doações com alíquota de 50% para 2025.',
    claimant: 'Mensagens em grupos de investimento e redes sociais',
    verdict: 'FALSO' as const,
    context: 'Boato distorce o debate da Reforma Tributária sobre a progressividade do ITCMD (imposto estadual).',
    debunkSummary: 'O Senado Federal estabelece o teto máximo nacional do ITCMD em 8% (Resolução do Senado nº 9/1992). A Reforma Tributária apenas tornou a alíquota progressiva (quem herda muito paga até 8%, quem herda pouco paga menos), sendo falsa qualquer alíquota de 50%.',
    source: 'Agência Lupa / Estadão Verifica',
    sourceUrl: 'https://lupa.uol.com.br',
    verificationDate: '2024-07-28',
    relatedPoliticians: []
  },
  {
    id: 'fc-global-3',
    claim: 'Vídeo mostra político admitindo plano secreto de fechamento de igrejas e templos.',
    claimant: 'Vídeo manipulado com Inteligência Artificial (Deepfake)',
    verdict: 'FALSO' as const,
    context: 'Áudio sintético criado por clonagem de voz acoplado a imagem de discurso antigo em plenário.',
    debunkSummary: 'Análise forense do Laboratório de Mídias Sintéticas e peritos confirmou que o áudio foi gerado por ferramenta de IA generativa (clonagem vocal) com dessincronização labial. A Constituição de 1988 assegura a inviolabilidade da liberdade de consciência e de crença no Brasil.',
    source: 'G1 Fato ou Fake / Aos Fatos',
    sourceUrl: 'https://g1.globo.com/fato-ou-fake',
    verificationDate: '2024-08-04',
    relatedPoliticians: []
  },
  {
    id: 'fc-global-4',
    claim: 'Câmara aprovou lei que autoriza confisco de imóveis desocupados em 48 horas.',
    claimant: 'Posts no TikTok e Instagram Reels',
    verdict: 'FALSO' as const,
    context: 'Publicações distorcem projetos de IPTU progressivo no tempo para especulação imobiliária abandonada.',
    debunkSummary: 'O direito de propriedade é garantido no Artigo 5º da Constituição Federal. O Estatuto da Cidade prevê mecanismos graduais de notificação e IPTU progressivo ao longo de anos para imóveis que descumprem a função social, e jamais confisco sumário em 48 horas.',
    source: 'TSE Fato ou Boato',
    sourceUrl: 'https://tse.jus.br',
    verificationDate: '2024-06-19',
    relatedPoliticians: ['erika-hilton', 'tabata-amaral']
  }
];

export const FORUM_POSTS_DATA: ForumPost[] = [
  {
    id: 'fp-1',
    title: 'Como a Reforma Tributária vai impactar o pequeno comerciante no seu estado?',
    category: 'Economia & Impostos',
    authorName: 'Mariana Azevedo',
    authorState: 'SP',
    createdAt: '2024-08-19T14:30:00Z',
    content: 'Com a aprovação da regulamentação da reforma (IBS/CBS) e a manutenção do Simples Nacional, como vocês enxergam a competitividade dos pequenos empreendedores frente às grandes redes que terão 100% de crédito financeiro? Vamos debater dados concretos.',
    upvotes: 84,
    downvotes: 4,
    commentsCount: 16,
    pinned: true,
    tags: ['Reforma Tributária', 'Empreendedorismo', 'Simples Nacional'],
    comments: [
      {
        id: 'c-1',
        authorName: 'Carlos Eduardo',
        authorState: 'MG',
        date: '2024-08-19T16:00:00Z',
        content: 'O ponto chave é o sistema híbrido de crédito: quem compra do Simples poderá transferir o crédito do montante efetivamente pago. Isso preserva a atratividade do pequeno fornecedor.',
        upvotes: 28,
        downvotes: 1
      },
      {
        id: 'c-2',
        authorName: 'Patrícia Lima',
        authorState: 'PR',
        date: '2024-08-19T18:15:00Z',
        content: 'A cesta básica desonerada em 100% é a maior conquista para as famílias que gastam grande parte da renda com supermercado.',
        upvotes: 35,
        downvotes: 2
      }
    ]
  },
  {
    id: 'fp-2',
    title: 'Transparência nas emendas Pix: O novo modelo resolve as dúvidas do cidadão?',
    category: 'Transparência Pública',
    authorName: 'Lucas Mendes',
    authorState: 'CE',
    createdAt: '2024-08-18T10:10:00Z',
    content: 'O Congresso aprovou a exigência de plano de trabalho e vinculação de CPF/CNPJ nos repasses das emendas individuais. Vocês acham que os portais de transparência dos municípios têm equipe técnica suficiente para alimentar os dados em tempo real?',
    upvotes: 62,
    downvotes: 2,
    commentsCount: 9,
    tags: ['Emendas Parlamentares', 'Transparência', 'TCU', 'Combate à Corrupção'],
    comments: [
      {
        id: 'c-3',
        authorName: 'Beatriz Vasconcelos',
        authorState: 'PE',
        date: '2024-08-18T12:00:00Z',
        content: 'A fiscalização direta pelo Tribunal de Contas da União no sistema Transferegov facilita muito a auditoria independente por jornalistas e cidadãos.',
        upvotes: 19,
        downvotes: 0
      }
    ]
  },
  {
    id: 'fp-3',
    title: 'Debate cívico: Redução da jornada de trabalho para 36h semanais (Escala 6x1)',
    category: 'Reforma Política',
    authorName: 'Renato Furtado',
    authorState: 'RJ',
    createdAt: '2024-08-17T09:00:00Z',
    content: 'A PEC do fim da escala 6x1 gerou enorme comoção popular. Quais as melhores fórmulas de transição para o setor de serviços e comércio sem prejudicar o emprego dos jovens?',
    upvotes: 142,
    downvotes: 12,
    commentsCount: 38,
    tags: ['Trabalho', 'Escala 6x1', 'Economia', 'Qualidade de Vida'],
    comments: [
      {
        id: 'c-4',
        authorName: 'Guilherme Sampaio',
        authorState: 'SC',
        date: '2024-08-17T11:20:00Z',
        content: 'Uma transição escalonada de 2 a 3 anos daria tempo para o comércio reorganizar turnos com tecnologia de automação.',
        upvotes: 45,
        downvotes: 3
      }
    ]
  }
];

export const NOTIFICATIONS_DATA: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Consulta Popular Aberta: PEC do Fim da Escala 6x1',
    summary: 'Dê sua opinião na consulta pública da Câmara sobre a redução da jornada para 36h semanais.',
    date: '2024-11-20',
    type: 'consulta_popular',
    isRead: false,
    relatedId: 'leg-3'
  },
  {
    id: 'notif-2',
    title: 'Nova Lei Sancionada: Transparência das Emendas Parlamentares',
    summary: 'Entrou em vigor o novo regramento obrigando identificação nominal e plano de trabalho para todos os repasses.',
    date: '2024-11-18',
    type: 'legislacao',
    isRead: false,
    relatedId: 'leg-5'
  },
  {
    id: 'notif-3',
    title: 'Alerta Antifraude: Boato de bloqueio de poupança desmentido',
    summary: 'Checagem oficial confirmou que mensagens sobre retenção financeira são 100% falsas.',
    date: '2024-08-15',
    type: 'fake_news',
    isRead: true,
    relatedId: 'fc-1'
  },
  {
    id: 'notif-4',
    title: 'Calendário Eleitoral TSE: Prazo para regularização de título',
    summary: 'Confira os prazos para coleta biométrica e transferência de domicílio eleitoral.',
    date: '2024-07-01',
    type: 'eleicoes',
    isRead: true
  }
];

export const POLITICAL_COMPASS_QUESTIONS: PoliticalCompassQuestion[] = [
  {
    id: 1,
    category: 'Economia',
    statement: 'Empresas estatais em setores estratégicos (energia, petróleo, portos) devem ser mantidas sob controle público em vez de privatizadas.',
    options: [
      { label: 'Concordo Totalmente', economicScore: -2, socialScore: 0 },
      { label: 'Concordo Parcialmente', economicScore: -1, socialScore: 0 },
      { label: 'Neutro / Indiferente', economicScore: 0, socialScore: 0 },
      { label: 'Discordo Parcialmente', economicScore: 1, socialScore: 0 },
      { label: 'Discordo Totalmente (Totalmente a favor de privatizações)', economicScore: 2, socialScore: 0 }
    ]
  },
  {
    id: 2,
    category: 'Tributação',
    statement: 'A tributação no Brasil deve ser mais progressiva, aumentando impostos sobre grandes fortunas e dividendos para financiar saúde e educação públicas.',
    options: [
      { label: 'Concordo Totalmente', economicScore: -2, socialScore: 0 },
      { label: 'Concordo Parcialmente', economicScore: -1, socialScore: 0 },
      { label: 'Neutro / Indiferente', economicScore: 0, socialScore: 0 },
      { label: 'Discordo Parcialmente', economicScore: 1, socialScore: 0 },
      { label: 'Discordo Totalmente (Foco em corte de gastos e impostos baixos)', economicScore: 2, socialScore: 0 }
    ]
  },
  {
    id: 3,
    category: 'Trabalho e Bem-Estar',
    statement: 'A legislação trabalhista deve proteger rigidamente o trabalhador (como férias, 13º, jornada máxima de 36h) mesmo que aumente o custo para as empresas.',
    options: [
      { label: 'Concordo Totalmente', economicScore: -2, socialScore: 0 },
      { label: 'Concordo Parcialmente', economicScore: -1, socialScore: 0 },
      { label: 'Neutro', economicScore: 0, socialScore: 0 },
      { label: 'Discordo Parcialmente', economicScore: 1, socialScore: 0 },
      { label: 'Discordo Totalmente (Maior flexibilidade no contrato individual)', economicScore: 2, socialScore: 0 }
    ]
  },
  {
    id: 4,
    category: 'Sociedade & Meio Ambiente',
    statement: 'A preservação ambiental e a transição ecológica devem ter prioridade máxima, limitando o avanço de atividades agropecuárias ou industriais predatórias.',
    options: [
      { label: 'Concordo Totalmente', economicScore: -1, socialScore: -2 },
      { label: 'Concordo Parcialmente', economicScore: 0, socialScore: -1 },
      { label: 'Neutro', economicScore: 0, socialScore: 0 },
      { label: 'Discordo Parcialmente', economicScore: 1, socialScore: 1 },
      { label: 'Discordo Totalmente (Prioridade total à produção e agronegócio)', economicScore: 2, socialScore: 2 }
    ]
  },
  {
    id: 5,
    category: 'Liberdades Individuais & Cultura',
    statement: 'O Estado deve garantir neutralidade laica absoluta e apoiar a diversidade cultural, direitos LGBTQIA+ e igualdade de gênero nas escolas.',
    options: [
      { label: 'Concordo Totalmente', economicScore: 0, socialScore: -2 },
      { label: 'Concordo Parcialmente', economicScore: 0, socialScore: -1 },
      { label: 'Neutro', economicScore: 0, socialScore: 0 },
      { label: 'Discordo Parcialmente', economicScore: 0, socialScore: 1 },
      { label: 'Discordo Totalmente (Defesa dos valores morais tradicionais)', economicScore: 0, socialScore: 2 }
    ]
  },
  {
    id: 6,
    category: 'Segurança Pública & Armamento',
    statement: 'Cidadãos idôneos devem ter direito facilitado à posse e ao porte de armas de fogo para legítima defesa.',
    options: [
      { label: 'Discordo Totalmente (Desarmamento e foco em inteligência policial)', economicScore: 0, socialScore: -2 },
      { label: 'Discordo Parcialmente', economicScore: 0, socialScore: -1 },
      { label: 'Neutro', economicScore: 0, socialScore: 0 },
      { label: 'Concordo Parcialmente', economicScore: 0, socialScore: 1 },
      { label: 'Concordo Totalmente (Liberdade irrestrita de armas para cidadãos de bem)', economicScore: 0, socialScore: 2 }
    ]
  }
];

export const CANDIDATES_SIMULATOR: CandidateForSim[] = [
  {
    id: 'sim-13',
    number: '13',
    name: 'Luiz Inácio Lula da Silva',
    ballotName: 'LULA',
    party: 'PT',
    role: 'Presidente',
    state: 'BR',
    photo: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=300&auto=format&fit=crop&q=80',
    vice: 'Geraldo Alckmin (PSB)',
    proposals: [
      'Fortalecimento do Bolsa Família e combate à pobreza extrema',
      'Investimento em infraestrutura pelo Novo PAC',
      'Reindustrialização verde e transição energética',
      'Defesa da soberania e valorização do salário mínimo acima da inflação'
    ]
  },
  {
    id: 'sim-22',
    number: '22',
    name: 'Candidato Liberal Democrático',
    ballotName: 'CANDIDATO PL',
    party: 'PL',
    role: 'Presidente',
    state: 'BR',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    vice: 'Vice da Chapa Liberal',
    proposals: [
      'Redução da máquina pública e privatizações',
      'Apoio irrestrito ao agronegócio e ao porte de armas',
      'Isenção de impostos sobre renda até 5 mil reais',
      "Endurecimento do Código Penal e fim da 'saidinha' de presos"
    ]
  },
  {
    id: 'sim-30',
    number: '30',
    name: 'Candidato Nova Economia',
    ballotName: 'CANDIDATO NOVO',
    party: 'NOVO',
    role: 'Presidente',
    state: 'BR',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80',
    vice: 'Economista da Chapa',
    proposals: [
      'Estado Mínimo e desregulamentação radical',
      'Livre comércio internacional e vouchers educacionais',
      'Fim de privilégios corporativos do setor público',
      'Reforma administrativa ampla com fim da estabilidade irrestrita'
    ]
  },
  {
    id: 'sim-50',
    number: '50',
    name: 'Candidato Socialista e Popular',
    ballotName: 'CANDIDATO PSOL',
    party: 'PSOL',
    role: 'Presidente',
    state: 'BR',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    vice: 'Líder dos Movimentos Sociais',
    proposals: [
      'Taxação progressiva de grandes fortunas e lucros extraordinários',
      'Fim da jornada de trabalho 6x1 com semana de 4 dias',
      'Moradia digna e reforma agrária popular',
      'Desmatamento zero imediato e demarcação de terras indígenas'
    ]
  }
];

// Compatibility aliases
export const BRAZIL_STATES_DATA = STATES_DATA;
export const LEGISLATION_DATA = LEGISLATIONS_DATA;

