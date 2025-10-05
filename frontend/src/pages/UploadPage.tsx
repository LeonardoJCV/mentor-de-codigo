import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadPage.css';

function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const handleStartChat = () => {
    if (selectedFiles.length > 0) {
      navigate('/chat');
    }
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles(filesArray);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-box" onClick={handleBoxClick}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          style={{ display: 'none' }}
        />
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
            handleStartChat();
          }}
          disabled={selectedFiles.length === 0}
        >
          Iniciar Chat
        </button>
      </div>

      {selectedFiles.length > 0 && (
        <div className="file-list">
          <h3>Arquivos Selecionados:</h3>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UploadPage;