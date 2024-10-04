import type { Dog } from "~/utils/types";
import { json, redirect } from "@remix-run/node";
import { getSession } from "~/sessions";
import { favorite } from "~/cookie_state/favorite";

export const action = async ({ request }: { request: Request }) => {
  const cookieHeader = request.headers.get("Cookie")
  const session = await getSession(cookieHeader);
  const authToken = session.get("fetch-access-token");

  if (!authToken) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const { favorites } = await request.json()

  if (favorites) {
    try {
      const matchResponse = await fetch("https://frontend-take-home-service.fetch.com/dogs/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `fetch-access-token=${authToken}`,
        },
        body: JSON.stringify(favorites.map((dog: Dog) => dog.id)),
        credentials: "include",
      });

      if (!matchResponse.ok) {
        throw new Response("Failed to generate match", { status: matchResponse.status, statusText: 'Failed to generate match' });
      }

      const { match } = await matchResponse.json();
      const cookie = await favorite.parse(cookieHeader);
      const matchedDog = favorites.find((dog: Dog) => dog.id === match);
      cookie.matchedDog = matchedDog;

      return redirect("/match", { 
        headers: { 
          "Set-Cookie": await favorite.serialize(cookie) 
        } 
      });
    } catch (error) {
      return json({ error: error.message }, { status: 500 });
    }
  }
};