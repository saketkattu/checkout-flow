import { useRef, useState } from 'react';
import styles from './FileUpload.module.css';
import { formatFileSize, truncateFileName } from '../../../utils/formatters';

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPT = '.pdf,.jpg,.jpeg,.png';

interface FileUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string | null;
}

export function FileUpload({ file, onChange, error }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);

  function handleFile(f: File) {
    if (f.size > MAX_SIZE_BYTES) {
      setSizeError(`File is too large (${formatFileSize(f.size)}). Maximum size is 10 MB.`);
      return;
    }
    setSizeError(null);
    onChange(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    // Reset so same file can be re-selected
    e.target.value = '';
  }

  const displayError = error ?? sizeError;

  if (file) {
    return (
      <div className={styles.filePreview}>
        <svg className={styles.fileIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
        <span className={styles.fileName}>{truncateFileName(file.name)}</span>
        <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
        <button className={styles.removeBtn} onClick={() => onChange(null)} type="button" aria-label="Remove file">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        className={[styles.zone, isDragging ? styles.zoneActive : '', displayError ? styles.zoneError : ''].filter(Boolean).join(' ')}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </svg>
        <p className={styles.prompt}>
          Drag & drop or{' '}
          <span className={styles.promptLink}>browse files</span>
        </p>
        <p className={styles.hint}>PDF, JPG, JPEG, PNG — max 10 MB</p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          onChange={handleInput}
          style={{ display: 'none' }}
        />
      </div>
    </>
  );
}
