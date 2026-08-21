import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  RefreshCw, 
  HelpCircle, 
  ShieldCheck, 
  BookOpen,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface CivicAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
  references?: string[];
  followUps?: string[];
}

export const CivicAssistantModal: React.FC<CivicAssistantModalProps> = ({
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Olá, cidadão! Sou o seu **Assistente Cívico Brasil**. Posso responder qualquer dúvida sobre a Constituição de 1988, eleições, como funcionam as votações no Congresso, a Lei da Ficha Limpa ou regras do TSE. Como posso ajudar hoje?',
      followUps: [
        'Como funciona o quociente eleitoral para deputados?',
        'O que diz a Lei da Ficha Limpa?',
        'Qual a diferença entre PEC, PL e Medida Provisória?',
        'Como justificar o voto pelo aplicativo e-Título?'
      ]
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = { sender: 'user', text: query.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/civic-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query.trim() })
      });

      if (!res.ok) throw new Error('Erro na API');
      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: data.answer || 'Informação processada com base nas leis brasileiras.',
          references: data.officialReferences,
          followUps: data.suggestedFollowUps
        }
      ]);
    } catch (err) {
      console.warn('Fallback do assistente cívico:', err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'No Brasil, o sistema político é representativo e democrático. As regras eleitorais são ditadas pela Constituição Federal de 1988 e pelo Código Eleitoral. Para informações em tempo real, você também pode consultar o portal oficial do TSE (tse.jus.br) ou da Câmara dos Deputados (camara.leg.br).',
          followUps: [
            'O que é quociente eleitoral?',
            'Como funciona a Lei da Ficha Limpa?'
          ]
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-2xl w-full h-[600px] max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-b border-emerald-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                Assistente Cívico IA Brasil
              </h3>
              <span className="text-[10px] text-emerald-300 font-mono">Tira-Dúvidas Constitucional & Eleitoral</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white font-medium shadow-md rounded-br-none'
                    : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>

              {/* References if present */}
              {m.references && m.references.length > 0 && (
                <div className="mt-1.5 flex items-center gap-1.5 flex-wrap text-[10px] text-slate-400">
                  <span className="font-bold text-emerald-400">Base Legal:</span>
                  {m.references.map((ref, rIdx) => (
                    <span key={rIdx} className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {ref}
                    </span>
                  ))}
                </div>
              )}

              {/* Follow-up suggestion buttons */}
              {m.followUps && m.followUps.length > 0 && (
                <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                  {m.followUps.map((fu, fuIdx) => (
                    <button
                      key={fuIdx}
                      onClick={() => handleSendMessage(fu)}
                      className="text-[11px] bg-slate-950 hover:bg-slate-800 text-emerald-300 hover:text-emerald-200 px-3 py-1 rounded-xl border border-emerald-900/60 transition-colors text-left"
                    >
                      💡 {fu}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <RefreshCw className="h-4 w-4 animate-spin text-emerald-400" />
              <span>Consultando Constituição e jurisprudência...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Digite sua dúvida cívica ou eleitoral..."
              className="flex-1 bg-slate-900 text-xs text-slate-100 placeholder-slate-500 px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white p-2.5 rounded-xl transition-colors shadow-md"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
