interface PdfEntry {
  buffer: Buffer;
  expiresAt: number;
}

class PdfStore {
  private store = new Map<string, PdfEntry>();
  private TTL_MS = 10 * 60 * 1000; // 10 minutes

  put(jobId: string, buffer: Buffer): void {
    this.store.set(jobId, {
      buffer,
      expiresAt: Date.now() + this.TTL_MS,
    });
    // Auto-cleanup after TTL
    setTimeout(() => this.store.delete(jobId), this.TTL_MS);
  }

  get(jobId: string): Buffer | null {
    const entry = this.store.get(jobId);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(jobId);
      return null;
    }
    return entry.buffer;
  }
}

export const pdfStore = new PdfStore();