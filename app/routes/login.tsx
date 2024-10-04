import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { getSession, commitSession } from "~/sessions";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

export const loader = async ({ request }: { request: Request}) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.get("fetch-access-token")) {
    return null;
  }

  return redirect("/search");
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");

  try {
    const response = await fetch("https://frontend-take-home-service.fetch.com/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email}),
      credentials: "include",
    })

    if (response.ok) {
      const setCookieHeader = response.headers.get("set-cookie");

      // Extract token from set-cookie
      const fetchAccessToken = setCookieHeader?.match(/fetch-access-token=([^;]+)/)?.[1];
      const expires = setCookieHeader?.match(/fetch-access-token=[^;]+;.*expires=([^;]+);/i)?.[1];

      if (fetchAccessToken && expires) {
        // Create or retrieve session
        const session = await getSession(request.headers.get("Cookie"));

        // Store token in session
        session.set("fetch-access-token", fetchAccessToken);
        const expiresDate = new Date(expires);

        // Redirect to home page with cookie set in the headers
        return redirect("/", {
          headers: {
            "Set-Cookie": await commitSession(session, {
              maxAge: (expiresDate.getTime() - Date.now()) / 1000,
            }),
          },
        });
      } else {
        return json({ error: "Login failed. No token returned." }, { status: 400 });
      }
    } else {
      const errorMessage = await response.text();
      return json({ errorMessage }, { status: response.status });
    }
  } catch (error) {
    return json({ error: "Login failed. Please try again." }, { status: 500 });
  }
};

export default function Login() {
  const actionData = useActionData();
  const navigation = useNavigation();

  return (
    <main className="flex flex-col h-screen items-center justify-center bg-muted">
      <Card className="w-[clamp(20rem,500px,80vw)] p-10">
        <div className="flex flex-col items-center justify-center my-6 gap-2.5">
          <img className="w-32 h-32" src="/fetch_rewards_logo.jpg" alt="Fetch Rewards Logo" />
          <h1 className="text-3xl text-center font-bold">Fetch Dog Search</h1>
          <p className="text-base text-center">Find the shelter dog of your dreams with this React/Remix app!</p>
        </div>
        {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
        <Form method="post" className="flex flex-col">
          <div className="mb-4">
            <Label htmlFor="name">Name</Label>
            <Input type="text" name="name" placeholder="Your Name" />
          </div>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input type="email" name="email" placeholder="Your Email" />
          </div>
          <Button 
            className="h-10 mt-4 w-full text-lg font-bold" 
            type="submit"
            disabled={navigation.state !== "idle"}
            variant={navigation.state === "idle" ? "default" : "secondary"}
          >
            Login
          </Button>
        </Form>
      </Card>
    </main>
  );
}
