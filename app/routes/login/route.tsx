import { LoaderArgs } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";
import { getAuthenticator } from "~/services/auth.server";

export async function loader({ request, context }: LoaderArgs) {
  const authenticator = getAuthenticator(context);
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
}

export default function Login() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Login</h1>
      <Form method="post" action="/auth/google">
        <button type="submit">Login with Google</button>
      </Form>
    </div>
  );
}
