import os
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

CHROMA_PATH = "chroma_db"
DATA_PATH = "sample_code"

def main():
    print("Iniciando o processo de ingestão de código...")
    loader = DirectoryLoader(DATA_PATH, glob="**/*.tsx", loader_cls=TextLoader, silent_errors=True)
    documents = loader.load()
    if not documents:
        print("Nenhum documento .tsx encontrado. Verifique a pasta e o padrão glob.")
        return

    print(f"Carregados {len(documents)} documentos do diretório {DATA_PATH}.")

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_documents(documents)
    print(f"Documentos divididos em {len(chunks)} chunks.")

    print("Gerando embeddings e salvando no ChromaDB. Isso pode levar um tempo...")
    embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    db = Chroma.from_documents(
        chunks, embedding_model, persist_directory=CHROMA_PATH
    )
    print(f"Ingestão concluída! {len(chunks)} chunks foram salvos em '{CHROMA_PATH}'.")

if __name__ == "__main__":
    main()