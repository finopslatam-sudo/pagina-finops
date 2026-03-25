'use client';

import { useEffect, useRef, useState } from 'react';
import { IAMessage } from '../../hooks/useFinopsIA';

// ── Preguntas sugeridas basadas en datos reales ──────────────
const SUGGESTED_QUESTIONS = [
  '¿Por qué subió mi cuenta este mes?',
  '¿Cuánto puedo ahorrar en total?',
  '¿Cuáles son mis hallazgos críticos?',
  '¿Tengo recursos sin usar?',
  '¿Cuál es mi nivel de riesgo actual?',
  '¿Qué servicios AWS estoy usando?',
  '¿Cuáles son mis recursos más costosos?',
  '¿Qué cambió vs el snapshot anterior?',
  '¿En qué regiones tengo recursos?',
  '¿Qué debo resolver primero?',
  '¿Cómo reduzco el costo de EC2?',
  '¿Conviene migrar a Savings Plans?',
];

interface Props {
  messages: IAMessage[];
  isLoading: boolean;
  error: string | null;
  onSend: (text: string) => void;
  onClose: () => void;
  onClear: () => void;
}

export default function FinopsIAChat({ messages, isLoading, error, onSend, onClose, onClear }: Props) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Solo el primer mensaje del asistente + ningún mensaje de usuario aún
  const showSuggestions = messages.length === 1 && messages[0].role === 'assistant';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  }

  function handleSuggestion(q: string) {
    onSend(q);
  }

  return (
    <div className="fixed bottom-24 right-4 sm:right-6 z-50 flex flex-col w-[calc(100vw-2rem)] max-w-sm sm:max-w-md h-[75vh] max-h-[640px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-700 to-blue-600 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold text-white">
            Bot
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-none">Finops.ia</p>
            <p className="text-blue-200 text-xs">Arquitecto AWS · datos reales de tu cuenta</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            title="Nueva conversación"
            className="text-blue-200 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/10 transition-colors"
          >
            Nueva
          </button>
          <button onClick={onClose} className="text-blue-200 hover:text-white transition-colors p-1 rounded hover:bg-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap break-words ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-slate-800 text-slate-100 rounded-bl-sm border border-slate-700'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* ── Preguntas sugeridas ── */}
        {showSuggestions && !isLoading && (
          <div className="space-y-2">
            <p className="text-xs text-slate-500 text-center">Preguntas frecuentes sobre tu cuenta</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSuggestion(q)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-blue-500 text-slate-300 hover:text-white rounded-full px-3 py-1.5 transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs text-red-400 text-center px-2">{error}</p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <form onSubmit={handleSubmit} className="px-3 py-3 border-t border-slate-700 bg-slate-900 shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Pregúntame sobre tu cuenta AWS..."
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none bg-slate-800 text-slate-100 placeholder-slate-500 text-sm rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500 disabled:opacity-50 max-h-28 overflow-y-auto"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="shrink-0 w-9 h-9 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-slate-600 mt-1 text-center">Enter para enviar · Shift+Enter para nueva línea</p>
      </form>

    </div>
  );
}
