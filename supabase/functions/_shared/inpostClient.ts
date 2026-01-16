const DEFAULT_TIMEOUT_MS = 10000;

export interface InpostClientOptions {
  baseUrl: string;
  token: string;
  orgId?: string;
}

export interface RetryOptions {
  retries?: number;
  backoffMs?: number;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const withTimeout = async (timeoutMs: number, fn: () => Promise<Response>) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fn();
  } finally {
    clearTimeout(timeout);
  }
};

export class InpostClient {
  private baseUrl: string;
  private token: string;
  private orgId?: string;

  constructor(options: InpostClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, "");
    this.token = options.token;
    this.orgId = options.orgId;
  }

  private headers(extra?: HeadersInit) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token}`,
    };
    if (this.orgId) {
      headers["X-Organization-Id"] = this.orgId;
    }
    return { ...headers, ...(extra as Record<string, string> | undefined) };
  }

  async request(path: string, init: RequestInit = {}, retry: RetryOptions = {}) {
    const url = `${this.baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
    const retries = retry.retries ?? 2;
    const backoffMs = retry.backoffMs ?? 400;

    let attempt = 0;
    while (attempt <= retries) {
      try {
        const response = await withTimeout(DEFAULT_TIMEOUT_MS, () =>
          fetch(url, {
            ...init,
            headers: this.headers(init.headers),
          })
        );
        if (response.ok || response.status < 500) {
          return response;
        }
      } catch (error) {
        if (attempt >= retries) {
          throw error;
        }
      }
      await sleep(backoffMs * Math.pow(2, attempt));
      attempt += 1;
    }
    throw new Error("InPost request failed after retries");
  }
}
