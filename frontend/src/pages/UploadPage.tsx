import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import JSZip from 'jszip';
import axios from 'axios';
import './UploadPage.css';

const API_URL = 'http://localhost:8000';

function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
      setError(null);
    }
  };
  
  const handleUploadAndChat = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setError(null);

    const zip = new JSZip();
    selectedFiles.forEach((file: File) => {
      zip.file(file.name, file);
    });

    try {
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      const formData = new FormData();
      formData.append('file', zipBlob, 'code.zip');

      await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/chat');

    } catch (err: any) {
      console.error("Erro no upload:", err);
      setError(err.response?.data?.detail || "Falha ao enviar o arquivo. Verifique se o backend está rodando.");
    } finally {
      setUploading(false);
    }
  };

  const handleBoxClick = () => { fileInputRef.current?.click(); };

  return (
    <div className="upload-container">
      <div className="upload-box" onClick={handleBoxClick}>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple style={{ display: 'none' }} />
        
        <svg
          className="upload-icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        <h1>Mentor de Código Pessoal</h1>
        <p>Clique na área para selecionar os arquivos do seu projeto.</p>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleUploadAndChat();
          }}
          disabled={selectedFiles.length === 0 || uploading}
        >
          {uploading ? 'Processando Código...' : 'Analisar e Iniciar Chat'}
        </button>
      </div>

      {error && <p style={{ color: '#ff6b6b', marginTop: '1rem' }}>Erro: {error}</p>}

      {selectedFiles.length > 0 && (
        <div className="file-list">
          <h3>Arquivos Selecionados:</h3>
          <ul>
            {selectedFiles.map((file: File, index: number) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UploadPage;