import { FileText, X, Loader2 } from 'lucide-react';
import type { Document } from '../../types/conversation';

interface DocumentBarProps {
  documents: Document[];
  isUploading: boolean;
  onRemove: (id: number) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentBar({ documents, isUploading, onRemove }: DocumentBarProps) {
  if (documents.length === 0 && !isUploading) return null;

  return (
    <div className="document-bar">
      {documents.map((doc) => (
        <div key={doc.id} className="document-chip">
          <div className="document-chip-icon">
            <FileText size={14} />
          </div>
          <div className="document-chip-info">
            <span className="document-chip-name">{doc.filename}</span>
            <span className="document-chip-size">
              {formatFileSize(doc.file_size)} · {doc.chunk_count} chunks
            </span>
          </div>
          <button
            className="document-chip-remove"
            onClick={() => onRemove(doc.id)}
            title="Remove document"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      {isUploading && (
        <div className="document-chip document-chip-uploading">
          <div className="document-chip-icon">
            <Loader2 size={14} className="spin" />
          </div>
          <div className="document-chip-info">
            <span className="document-chip-name">Uploading...</span>
          </div>
        </div>
      )}
    </div>
  );
}
