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
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white border border-slate-300 rounded-xl max-w-xl w-full h-[520px] max-h-[90vh] shadow-xl overflow-hidden flex flex-col animate-in fade-in duration-150">
        
        {/* Header */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                Assistente Cívico IA Brasil
              </h3>
              <span className="text-[10px] text-emerald-800 font-mono">Tira-Dúvidas Constitucional & Eleitoral</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs bg-slate-50/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-2.5 rounded-lg leading-relaxed whitespace-pre-line text-xs ${
                  m.sender === 'user'
                    ? 'bg-emerald-700 text-white font-medium shadow-xs rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-bl-none'
                }`}
              >
                {m.text}
              </div>

              {/* References if present */}
              {m.references && m.references.length > 0 && (
                <div className="mt-1 flex items-center gap-1 flex-wrap text-[10px] text-slate-500">
                  <span className="font-bold text-emerald-800">Base Legal:</span>
                  {m.references.map((ref, rIdx) => (
                    <span key={rIdx} className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">
                      {ref}
                    </span>
                  ))}
                </div>
              )}

              {/* Follow-up suggestion buttons */}
              {m.followUps && m.followUps.length > 0 && (
                <div className="mt-1.5 flex items-center gap-1 flex-wrap">
                  {m.followUps.map((fu, fuIdx) => (
                    <button
                      key={fuIdx}
                      onClick={() => handleSendMessage(fu)}
                      className="text-[10px] bg-white hover:bg-slate-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200 shadow-xs transition-colors text-left cursor-pointer"
                    >
                      💡 {fu}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 p-1.5">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-700" />
              <span className="text-[11px]">Consultando Constituição e jurisprudência...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-2.5 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-1.5"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Digite sua dúvida cívica ou eleitoral..."
              className="flex-1 bg-slate-50 text-xs text-slate-900 placeholder-slate-400 px-3 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white p-1.5 rounded-md transition-colors shadow-xs cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
