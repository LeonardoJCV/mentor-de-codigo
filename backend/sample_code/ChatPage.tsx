import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Message } from '../types';
import './ChatPage.css';

const initialMessages: Message[] = [
  {
    id: 1,
    text: 'Olá! Eu sou seu Mentor de Código Pessoal. Me faça uma pergunta sobre o seu projeto.',
    sender: 'ai',
  },
];

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState<string>('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userText = inputValue.trim();
    if (!userText) return;

    const userMessage: Message = {
      id: Date.now(),
      text: userText,
      sender: 'user',
    };
    setMessages(currentMessages => [...currentMessages, userMessage]);

    setInputValue('');

    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: 'Obrigado pela sua pergunta! No momento, sou apenas uma simulação, mas no futuro, eu analisaria seu código para dar uma resposta completa.',
        sender: 'ai',
      };
      setMessages(currentMessages => [...currentMessages, aiResponse]);
    }, 1000);
  };

  return (
    <div className="chat-container">
      <div className="message-list">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite sua pergunta..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default ChatPage;