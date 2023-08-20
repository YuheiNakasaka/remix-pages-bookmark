import { LoaderArgs, json } from "@remix-run/cloudflare";
import { Form, useLoaderData } from "@remix-run/react";
import { getAuthenticator } from "~/services/auth.server";

export async function loader({ request, context }: LoaderArgs) {
  const authenticator = getAuthenticator(context);
  const user = await authenticator.isAuthenticated(request);
  return json({ user });
}

export default function Index() {
  const { user } = useLoaderData<typeof loader>();
  if (user) {
    return (
      <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
        <h1>Home</h1>
        <p>Welcome! {user.displayName}</p>
        <Form method="post" action="/auth/logout">
          <button type="submit">Logout</button>
        </Form>
      </div>
    );
  }
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Home</h1>
      <a href="/login">Login</a>
    </div>
  );
}
