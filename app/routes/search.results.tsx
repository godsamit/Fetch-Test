import { json } from "@remix-run/node";
import type { Dog, DogsSearchResponse } from "~/utils/types";
import { useLoaderData } from "@remix-run/react";
import { getSession } from "~/sessions";
import { DogList } from "~/components/DogList";

export const loader = async ({ request }: { request: Request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const authToken = session.get("fetch-access-token");

  const url = new URL(request.url);
  const apiUrl = new URL("https://frontend-take-home-service.fetch.com/dogs/search");

  apiUrl.search = url.search;

  const idsResponse = await fetch(apiUrl.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `fetch-access-token=${authToken}`,
    },
    credentials: "include"
  });

  const dogSearchMeta = await idsResponse.json();

  const { resultIds } = dogSearchMeta;
  const dogsResponse = await fetch("https://frontend-take-home-service.fetch.com/dogs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `fetch-access-token=${authToken}`,
    },
    body: JSON.stringify(resultIds),
    credentials: "include",
  });

  const dogs = await dogsResponse.json()

  return json({ dogSearchMeta, dogs });
};

export default function Result() {
  const { dogSearchMeta, dogs } = useLoaderData<{ 
    dogSearchMeta: DogsSearchResponse,
    dogs: Dog[]
  }>();

  return (
    <DogList dogs={dogs} dogSearchMeta={dogSearchMeta} />
  );
}
