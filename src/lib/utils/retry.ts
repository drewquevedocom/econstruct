interface RetryOptions {
  attempts?: number;
  backoffMs?: number;
  /** Status codes that are transient and worth retrying */
  retryOn?: number[];
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { attempts = 3, backoffMs = 500, retryOn = [429, 502, 503, 504] } = options;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const status = err?.status ?? err?.response?.status ?? 0;
      const isTransient =
        retryOn.includes(status) ||
        err?.code === "ECONNRESET" ||
        err?.code === "ECONNREFUSED" ||
        err?.code === "ETIMEDOUT";

      if (!isTransient || attempt === attempts) throw err;

      const delay = backoffMs * Math.pow(2, attempt - 1);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw lastError;
}
