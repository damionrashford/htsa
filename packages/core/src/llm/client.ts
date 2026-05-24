export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatClientOptions {
  baseUrl: string;
  apiKey?: string;
  model: string;
  temperature?: number;
  timeoutMs?: number;
  headers?: Record<string, string>;
}

export class ChatCompletionsClient {
  private readonly endpoint: string;
  private readonly apiKey: string;
  private readonly model: string;
  private readonly temperature: number;
  private readonly timeoutMs: number;
  private readonly extraHeaders: Record<string, string>;

  constructor(opts: ChatClientOptions) {
    this.endpoint = opts.baseUrl.replace(/\/$/, "") + "/chat/completions";
    this.apiKey = opts.apiKey ?? "";
    this.model = opts.model;
    this.temperature = opts.temperature ?? 0.3;
    this.timeoutMs = opts.timeoutMs ?? 120_000;
    this.extraHeaders = opts.headers ?? {};
  }

  async complete(
    messages: ChatMessage[],
    opts: { temperature?: number; jsonMode?: boolean; model?: string } = {},
  ): Promise<string> {
    const body: Record<string, unknown> = {
      model: opts.model ?? this.model,
      messages,
      temperature: opts.temperature ?? this.temperature,
    };
    if (opts.jsonMode) {
      body["response_format"] = { type: "json_object" };
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...this.extraHeaders,
    };
    if (this.apiKey) headers["Authorization"] = `Bearer ${this.apiKey}`;

    for (let attempt = 0; attempt < 2; attempt++) {
      const res = await fetch(this.endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      if (!res.ok) {
        if (attempt === 0 && (res.status === 429 || res.status >= 500)) {
          await new Promise(r => setTimeout(r, 2000));
          continue;
        }
        const text = await res.text().catch(() => "");
        throw new Error(`Chat completions error ${res.status}: ${text}`);
      }

      const data = await res.json() as { choices: Array<{ message: { content: string } }> };
      return data.choices[0]!.message.content;
    }

    throw new Error("Max retries exceeded");
  }
}
