import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react'
import type { Message } from '../types';
import axios from 'axios';
import './ChatPage.css';

const API_URL = 'http://localhost:8000';

function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: 'Olá! Seu código foi processado. Faça uma pergunta sobre ele.',
            sender: 'ai',
        },
    ]);
    const [inputValue, setInputValue] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const messageListRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const userText = inputValue.trim();
        if (!userText || isLoading) return;

        const userMessage: Message = {
            id: Date.now(),
            text: userText,
            sender: 'user',
        };
        setMessages(currentMessages => [...currentMessages, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/chat`, {
                question: userText,
            });

            const aiResponse: Message = {
                id: Date.now() + 1,
                text: response.data.answer,
                sender: 'ai',
            };
            setMessages(currentMessages => [...currentMessages, aiResponse]);

        } catch (error: any) {
            console.error("Erro ao buscar resposta:", error);
            const errorMessage: Message = {
                id: Date.now() + 1,
                text: `Ocorreu um erro ao buscar a resposta. Detalhes: ${error.response?.data?.detail || error.message}`,
                sender: 'ai',
            };
            setMessages(currentMessages => [...currentMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-container">
            <div className="message-list" ref={messageListRef}>
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
                    >
                        {message.text}
                    </div>
                ))}
                {isLoading && (
                    <div className="message ai-message">
                        <span className="typing-indicator"></span>
                        <span className="typing-indicator"></span>
                        <span className="typing-indicator"></span>
                    </div>
                )}
            </div>
            <form className="chat-input-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder={isLoading ? "Aguarde a resposta..." : "Digite sua pergunta..."}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>Enviar</button>
            </form>
        </div>
    );
}

export default ChatPage;