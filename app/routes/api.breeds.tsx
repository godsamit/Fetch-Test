import { json } from "@remix-run/node";
import { getSession } from "~/sessions";

export const loader = async ({ request }: { request: Request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const authToken = session.get("fetch-access-token");

  if (!authToken) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const response = await fetch("https://frontend-take-home-service.fetch.com/dogs/breeds", {
    headers: {
      "Content-Type": "application/json",
      Cookie: `fetch-access-token=${authToken}`,
    },
    credentials: "include", // Ensure cookies are sent with the request
  });

  console.log(response);

  if (!response.ok) {
    throw new Response("Failed to fetch breeds", { status: response.status, statusText: 'breeds' });
  }

  const breeds = await response.json();

  return json({ breeds });
};