import { logDevReady } from "@remix-run/cloudflare";
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";
import { queue } from "~/queue/consumer";

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

    if (url.pathname.startsWith("/images/")) {
      const object = await env.BUCKET.get(
        url.pathname.replace("/images", "").slice(1)
      );
      if (object === null) {
        return new Response("Object Not Found", { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);

      return new Response(object.body, {
        headers,
      });
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
  queue,
};

export default handler;
