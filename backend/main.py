import os
import shutil
import tempfile
import zipfile
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_ollama import ChatOllama
from langchain.prompts import PromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

CHROMA_PATH = "chroma_db_api"
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
#LLM_MODEL_NAME = "tinyllama"
LLM_MODEL_NAME = "llama3"

class ChatRequest(BaseModel):
    question: str

app = FastAPI()

origins = [
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Funções da Lógica RAG
def get_rag_chain():
    embedding_model = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL_NAME)
    
    if not os.path.exists(CHROMA_PATH):
        raise HTTPException(status_code=404, detail="Banco de dados de código não encontrado. Faça o upload de um arquivo .zip primeiro.")
        
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_model)
    retriever = db.as_retriever()

    PROMPT_TEMPLATE = """
        Você é um assistente de programação especialista chamado "Mentor de Código". Sua tarefa é responder perguntas sobre uma base de código fornecida.

        Instruções:
        1. Responda à pergunta do usuário usando única e exclusivamente as informações contidas no seguinte contexto de código-fonte.
        2. Não invente informações nem utilize conhecimento externo.
        3. Responda sempre em português do Brasil.
        4. Seja claro, conciso e direto ao ponto.
        5. Se a resposta não puder ser encontrada no contexto fornecido, diga "A informação não está disponível no código que analisei."

        Contexto do Código:
        {context}

        ---

        Pergunta do Usuário: {question}
        Sua Resposta:
        """
    prompt = PromptTemplate.from_template(PROMPT_TEMPLATE)
    model = ChatOllama(model=LLM_MODEL_NAME)

    chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | prompt
        | model
        | StrOutputParser()
    )
    return chain

def ingest_code_from_directory(code_dir: str):
    loader = DirectoryLoader(code_dir, glob="**/*.*", loader_cls=TextLoader, silent_errors=True)
    documents = loader.load()
    if not documents:
        return

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_documents(documents)
    
    embedding_model = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL_NAME)
    
    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)
        
    Chroma.from_documents(chunks, embedding_model, persist_directory=CHROMA_PATH)


# Endpoint da API
@app.get("/")
def read_root():
    return {"message": "API do Mentor de Código Pessoal está no ar!"}

@app.post("/upload")
async def upload_code(file: UploadFile = File(...)):
    if not file.filename.endswith('.zip'):
        raise HTTPException(status_code=400, detail="Formato de arquivo inválido. Por favor, envie um arquivo .zip.")

    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            zip_path = os.path.join(temp_dir, file.filename)
            
            with open(zip_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(temp_dir)
            
            ingest_code_from_directory(temp_dir)

        return {"message": f"Código do arquivo '{file.filename}' processado com sucesso."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ocorreu um erro ao processar o arquivo: {e}")

@app.post("/chat")
async def chat_with_code(request: ChatRequest):
    try:
        chain = get_rag_chain()
        response = chain.invoke(request.question)
        return {"answer": response}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ocorreu um erro ao processar a pergunta: {e}")