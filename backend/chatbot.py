from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_ollama import ChatOllama

from langchain.prompts import PromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
import sys

CHROMA_PATH = "chroma_db"

PROMPT_TEMPLATE = """
Responda à pergunta com base apenas no seguinte contexto:

{context}

---

Responda à pergunta com base no contexto acima: {question}
"""

def main():
    embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_model)
    retriever = db.as_retriever()

    print("Banco de dados vetorial carregado.")

    prompt = PromptTemplate(
        template=PROMPT_TEMPLATE, input_variables=["context", "question"]
    )

    try:
        print("Carregando o modelo 'tinyllama'...")
        model = ChatOllama(model="tinyllama")
        print("Modelo 'tinyllama' carregado com sucesso.")
    except Exception as e:
        print(f"Falha ao carregar 'tinyllama': {e}")
        print("Certifique-se de que o Ollama está rodando e que você executou 'ollama pull tinyllama'.")
        sys.exit(1)

    chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | prompt
        | model
        | StrOutputParser()
    )

    print("Chatbot pronto! Digite 'sair' para terminar.")

    while True:
        query_text = input("\nSua pergunta: ")
        if query_text.lower() == "sair":
            break

        try:
            response = chain.invoke(query_text)
            print("\nResposta:", response)
        except Exception as e:
            print(f"\nOcorreu um erro ao gerar a resposta: {e}")

if __name__ == "__main__":
    main()