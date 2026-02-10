import React, { type JSX } from 'react';
import styles from './PDFViewer.module.css';

interface PDFViewerProps {
  src: string;
  title: string;
}

/**
 * PDFViewer Component
 * Displays PDF documents embedded in documentation pages
 * Supports both viewing and downloading PDFs
 */
export default function PDFViewer({ src, title }: PDFViewerProps): JSX.Element {
  return (
    <div className={styles.pdfContainer}>
      <div className={styles.pdfHeader}>
        <h2>{title}</h2>
        <a
          href={src}
          download={title}
          className={styles.downloadButton}
          title={`Download ${title}`}
        >
          📥 Download PDF
        </a>
      </div>
      <div className={styles.pdfViewer}>
        <iframe
          src={src}
          title={title}
          className={styles.pdfFrame}
          frameBorder="0"
          onError={() => console.error(`Failed to load PDF: ${title}`)}
        />
        <p style={{ marginTop: '1rem', color: 'var(--ifm-color-danger)' }}>
          If PDF doesn't load, try using the download button above.
        </p>
      </div>
    </div>
  );
}
