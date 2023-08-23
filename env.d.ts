// Queue types is not supported by @remix-run/cloudflare.
// @remix-run/cloudflare must use @cloudflare/workers-types >= 4. But it's only supporting 2 or 3.
// https://github.com/remix-run/remix/blob/main/packages/remix-cloudflare/package.json
declare type QueueContentType = "text" | "bytes" | "json" | "v8";
declare interface Queue<Body = unknown> {
  send(message: Body, options?: QueueSendOptions): Promise<void>;
  sendBatch(messages: Iterable<MessageSendRequest<Body>>): Promise<void>;
}
declare interface QueueSendOptions {
  contentType?: QueueContentType;
}
declare interface MessageSendRequest<Body = unknown> {
  body: Body;
  contentType?: QueueContentType;
}
declare interface Message<Body = unknown> {
  readonly id: string;
  readonly timestamp: Date;
  readonly body: Body;
  retry(): void;
  ack(): void;
}
declare interface QueueEvent<Body = unknown> extends ExtendableEvent {
  readonly messages: readonly Message<Body>[];
  readonly queue: string;
  retryAll(): void;
  ackAll(): void;
}
declare interface MessageBatch<Body = unknown> {
  readonly messages: readonly Message<Body>[];
  readonly queue: string;
  retryAll(): void;
  ackAll(): void;
}

export interface Env {
  SESSION_SECRET: string;
  GOOGLE_AUTH_CALLBACK_URL: string;
  GOOGLE_AUTH_CLIENT_ID: string;
  GOOGLE_AUTH_CLIENT_SECRET: string;
  SESSION_KV: KVNamespace;
  DB: D1Database;
  QUEUE: Queue<any>;
}
