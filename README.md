# 🇧🇷 Brasil Político — Radar Cívico, Transparência & Guia Eleitoral

> Uma plataforma cívica de transparência, combate a fake news, dados governamentais abertos e simulação eleitoral para as eleições brasileiras.

![Node Version](https://img.shields.io/badge/Node-%3E%3D20.0.0-emerald)
![License](https://img.shields.io/badge/License-MIT-blue)
![React](https://img.shields.io/badge/React-19-cyan)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-teal)
![Gemini AI](https://img.shields.io/badge/Google%20Gemini-3.7%20Flash-amber)

---

## 🎯 Principais Funcionalidades

1. **🗺️ Mapa Federativo Interativo (26 Estados + DF):**
   - Navegação cartográfica com dados de governadores, senadores, bancadas federais e ranking de transparência pública estadual.

2. **👥 Dossiê e Diretório Nacional de Políticos:**
   - Índice de integridade e probidade (0 a 100).
   - Filtro avançado para **Ficha Limpa** (sem condenações judiciais em órgãos colegiados).
   - Acompanhamento de gastos da cota parlamentar (CEAP) vs. limite anual.
   - Histórico de votações nominais e evolução patrimonial declarada ao TSE.

3. **🏛️ Histórico dos Partidos Políticos:**
   - Linha do tempo de fundação e fusões partidárias (ex: DEM + PSL = UNIÃO Brasil).
   - Espectro ideológico (Esquerda, Centro, Direita), estatuto e força parlamentar no Congresso.

4. **⚖️ Monitor de Crimes Públicos & Processos Judiciais:**
   - Indexação de inquéritos, ações penais e processos de improbidade no STF, STJ, TSE, TRFs e TCU.
   - Status jurídico oficial (Réu, Em Inquérito, Condenado, Absolvido, Arquivado) com link direto para o tribunal.

5. **🛡️ Central de Combate a Fake News com IA (Gemini 3.7 Flash):**
   - Verificador em tempo real de mensagens virais, áudios ou boatos com IA.
   - Banco de checagens oficiais (TSE Fato ou Boato, Agência Lupa, Aos Fatos).
   - Guia cívico em 5 passos para identificar desinformação e canal de denúncia oficial do TSE (SIADE).

6. **🗳️ Central Eleitoral & Simulador Autêntico da Urna Eletrônica:**
   - Simulador fiel com sintetizador sonoro oficial Web Audio (sons autênticos de digitação e confirmação "PIM").
   - Comparador de candidatos lado a lado com análise neutra por IA.
   - Bússola política / Match partidário em 5 perguntas temáticas.

7. **📜 Portal de Legislação & Consultas Populares Cidadãs:**
   - Votação popular interativa ("A Favor" / "Contra") com persistência em armazenamento local.
   - "Descomplicador Legislativo IA": gera resumo em linguagem simples sem juridiquês.

8. **💬 Fórum Cívico de Debates Públicos:**
   - Espaço republicano de debate com moderação, upvotes/downvotes e comentários.

---

## 🚀 Requisitos e Como Executar

### Requisitos:
* **Node.js**: Versão **20.x ou superior** (Recomendado Node 20 LTS ou 22 LTS).
* **NPM**: 10.x ou superior.

### 1. Clonar e Instalar Dependências:
```bash
git clone https://github.com/seu-usuario/brasil-politico.git
cd brasil-politico
npm install
```

### 2. Configurar Variáveis de Ambiente (Opcional para IA):
Crie um arquivo `.env` a partir do `.env.example`:
```bash
cp .env.example .env
```
Adicione sua chave da API do Gemini (caso queira habilitar os recursos avançados de IA em tempo real):
```env
GEMINI_API_KEY="SUA_CHAVE_GEMINI_AQUI"
```

### 3. Rodar em Modo de Desenvolvimento:
```bash
npm run dev
```
Acesse `http://localhost:3000` no seu navegador.

---

## 🌐 Publicação no GitHub Pages (Static Hosting)

O projeto foi preparado para compilação estática compatível com o GitHub Pages:

### Gerar Build Estático:
```bash
npm run build:static
```
Os arquivos otimizados serão gerados na pasta `dist/`.

### Configurar no GitHub Pages:
1. Vá nas **Settings** do seu repositório no GitHub.
2. Na aba **Pages**, selecione a branch `gh-pages` ou configure o GitHub Actions com `static-html`.
3. O arquivo `vite.config.ts` já está configurado com `base: './'` para garantir o carregamento correto de rotas e assets relativos.

---

## 📊 Fontes Oficiais de Dados

* **TSE (Tribunal Superior Eleitoral):** Divulgação de Candidaturas e Contas Eleitorais (DivulgaCandContas) e TSE Fato ou Boato.
* **Câmara dos Deputados:** API de Dados Abertos e Portal da Transparência (CEAP).
* **Senado Federal:** Sistema de Dados Abertos e Votações Nominais.
* **STF, STJ, TRFs e TCU:** Consultas públicas e jurisprudência unificada.
* **Agências de Checagem:** Lupa, Aos Fatos e G1 Fato ou Fake.

---

## ⚖️ Licença
Distribuído sob a licença MIT. Consulte `LICENSE` para mais detalhes.
