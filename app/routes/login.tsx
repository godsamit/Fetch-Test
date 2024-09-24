import type { MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { getSession, commitSession } from "~/sessions";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "Fetch Take Home Test" },
    { name: "description", content: "Fetch Take Home Test Submission by Yushan Liu" },
  ];
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");

  // Send POST request to API
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
}

export default function Index() {
  const actionData = useActionData();

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center my-10">
        <img src="/fetch_rewards_logo.jpg" alt="Fetch Rewards Logo" />
        <h1 className="text-3xl font-bold">Fetch Dog Search!</h1>
        <p className="text-base">This is a dog search engine built with React/Remix.</p>
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
        <Button className="w-full" type="submit">Login</Button>
      </Form>
    </div>
  );
}
