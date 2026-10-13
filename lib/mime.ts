export const PDF_MIME = 'application/pdf';
export const DOCX_MIME =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export const DOCUMENT_PICKER_TYPES = [PDF_MIME, DOCX_MIME] as const;

export const UNSUPPORTED_DOCUMENT_MESSAGE =
  'Only PDF and DOCX files are supported. Images, videos, and audio are not allowed.';

export function resolveUploadMimeType(
  fileName: string,
  mimeType?: string | null
): typeof PDF_MIME | typeof DOCX_MIME | null {
  const lower = fileName.toLowerCase();

  if (lower.endsWith('.pdf')) {
    return PDF_MIME;
  }
  if (lower.endsWith('.docx')) {
    return DOCX_MIME;
  }

  const mime = (mimeType ?? '').toLowerCase();
  if (
    mime === PDF_MIME ||
    mime === 'application/x-pdf' ||
    (mime.includes('pdf') && !mime.includes('word'))
  ) {
    return PDF_MIME;
  }
  if (
    mime === DOCX_MIME ||
    mime.includes('wordprocessingml') ||
    mime.includes('officedocument.wordprocessingml')
  ) {
    return DOCX_MIME;
  }

  return null;
}

export function isAllowedDocumentUpload(
  fileName: string,
  mimeType?: string | null
): boolean {
  return resolveUploadMimeType(fileName, mimeType) !== null;
}

export function ensureUploadFileName(fileName: string, mimeType: string): string {
  const trimmed = fileName.trim() || 'document';
  const lower = trimmed.toLowerCase();

  if (lower.endsWith('.pdf') || lower.endsWith('.docx')) {
    return trimmed;
  }

  if (mimeType.includes('pdf')) {
    return `${trimmed}.pdf`;
  }
  if (mimeType.includes('word') || mimeType.includes('wordprocessingml')) {
    return `${trimmed}.docx`;
  }

  throw new Error(UNSUPPORTED_DOCUMENT_MESSAGE);
}
