# Mentor de Código Pessoal - Chat com IA 100% Local 🚀

Este projeto apresenta o **Mentor de Código Pessoal**, uma aplicação web que permite a desenvolvedores fazerem o upload de um projeto de código-fonte e "conversarem" com ele através de uma interface de chat, recebendo respostas geradas por um Large Language Model (LLM) que roda 100% offline na sua máquina.

⚠️ **Disclaimer:** Este é um projeto de portfólio para demonstrar habilidades em desenvolvimento full-stack e, principalmente, na implementação de uma arquitetura RAG (Retrieval-Augmented Generation) de ponta a ponta com ferramentas open-source.

---

## ✅ Funcionalidades

-   🧠 **Arquitetura RAG Local:** Implementação completa de Retrieval-Augmented Generation para fornecer respostas contextuais e precisas sobre o código.
-   📂 **Upload Dinâmico de Projetos:** Interface para fazer o upload de múltiplos arquivos de código-fonte, que são processados e vetorizados em tempo real.
-   🤖 **Chat Interativo com IA:** Converse com sua base de código para entender funcionalidades, explicar componentes ou depurar lógicas complexas.
-   🔒 **100% Privado e Offline:** Todo o processamento, desde a vetorização até a geração de texto pelo LLM, acontece localmente. Nenhum dado ou código é enviado para APIs externas.
-   ⚡ **Stack Moderna Full-Stack:** Construído com as tecnologias mais atuais do ecossistema Python/FastAPI e React/TypeScript.

---

## 🚀 Tecnologias Utilizadas

Este projeto é um **monorepo** com frontend e backend desacoplados.

#### **Frontend**

-   **Framework:** React com TypeScript
-   **Build Tool:** Vite
-   **Estilização:** CSS puro
-   **Requisições HTTP:** Axios
-   **Roteamento:** React Router
-   **Empacotamento de Arquivos:** JSZip

#### **Backend & IA**

-   **Framework:** Python com FastAPI
-   **Servidor:** Uvicorn
-   **Orquestração de IA:** LangChain
-   **LLM Local:** Ollama (executando Llama 3)
-   **Banco de Dados Vetorial:** ChromaDB
-   **Modelo de Embedding:** Hugging Face `all-MiniLM-L6-v2`
-   **Validação de Dados:** Pydantic

---

## ⚙️ Como Executar

### Pré-requisitos

Antes de começar, garanta que você possui:

-   [Node.js e npm](https://nodejs.org/en/) (v18+)
-   [Python](https://www.python.org/downloads/) (v3.8+)
-   [Ollama](https://ollama.com/)
    -   Após instalar o Ollama, baixe o Llama 3 (isso pode levar um tempo):
      ```bash
      ollama pull llama3
      ```

### Instalação e Execução

1.  Clone este repositório:
    ```bash
    git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
    cd SEU_REPOSITORIO
    ```

2.  **Inicie o Ollama** (em um terminal dedicado):
    ```bash
    ollama serve
    ```

3.  **Configure e execute o Backend** (em um segundo terminal):
    ```bash
    cd backend
    python -m venv venv
    # Ative o ambiente virtual (.\venv\Scripts\activate no Windows)
    source venv/bin/activate
    pip install -r requirements.txt
    uvicorn main:app --reload
    ```

4.  **Configure e execute o Frontend** (em um terceiro terminal):
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

5.  Acesse a aplicação no seu navegador: **[http://localhost:5173](http://localhost:5173)**

---

## 🎨 Visão do Projeto

Criado como um estudo aprofundado para dominar a construção de sistemas de IA locais e privados. Este projeto serve como uma prova de conceito.

© 2025 - LeonardoJCV
