import { logDevReady } from "@remix-run/cloudflare";
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";

if (process.env.NODE_ENV === "development") {
  logDevReady(build);
}

const handleRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (context) => ({ env: context.env }),
  mode: process.env.NODE_ENV,
});

const handler: ExportedHandler<Env> = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (
      url.pathname.startsWith("/build/") ||
      url.pathname.startsWith("/favicon.ico")
    ) {
      return env.ASSETS.fetch(request);
    }

    return handleRequest({
      request: new Request(request),
      functionPath: "",
      waitUntil: ctx.waitUntil,
      next: () => {
        throw new Error("next() called in Worker");
      },
      env: env,
      params: {},
      data: undefined,
    });
  },
  async queue(batch: MessageBatch<any>, env: Env): Promise<void> {
    let messages = JSON.stringify(batch.messages);
    console.log(`consumed from our queue on Pages Function: ${messages}`);
  },
};

export default handler;
