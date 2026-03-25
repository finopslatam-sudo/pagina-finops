'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';

export interface IAMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function useFinopsIA() {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<IAMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Abre el chat y dispara la presentación si es la primera vez ──
  const openChat = useCallback(async () => {
    setIsOpen(true);
    if (messages.length > 0) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await apiFetch<{ response: string }>(
        '/api/client/assistant/chat',
        { method: 'POST', token, body: { messages: [], is_new_conversation: true } }
      );
      setMessages([{ role: 'assistant', content: data.response }]);
    } catch {
      setError('No se pudo conectar con Finops.ia. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  }, [token, messages.length]);

  const closeChat = useCallback(() => setIsOpen(false), []);

  // ── Envía un mensaje del usuario ──
  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const updated: IAMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(updated);
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiFetch<{ response: string }>(
        '/api/client/assistant/chat',
        { method: 'POST', token, body: { messages: updated, is_new_conversation: false } }
      );
      setMessages([...updated, { role: 'assistant', content: data.response }]);
    } catch {
      setError('Error al obtener respuesta. Intenta nuevamente.');
      // Revertir el último mensaje del usuario
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  }, [token, messages, isLoading]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { isOpen, messages, isLoading, error, openChat, closeChat, sendMessage, clearChat };
}
