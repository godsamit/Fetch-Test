import { useState } from "react";
import { useLoaderData, useSearchParams, useFetcher } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getSession } from "~/sessions";
import type { Dog, DogsSearchResponse, DogFilter } from "~/utils/types";
import { Filters } from "~/components/Filters";
import { DogList } from "~/components/DogList";
import { searchParamToFilter } from "~/utils/searchParamParser";

export const loader = async ({ request }: { request: Request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const authToken = session.get("fetch-access-token");
  if (!authToken) {
    return redirect("/login");
  }
  const url = new URL(request.url);
  const apiUrl = new URL("https://frontend-take-home-service.fetch.com/dogs/search");

  apiUrl.search = url.search;
  try {
    const idsResponse = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `fetch-access-token=${authToken}`,
      },
      credentials: "include"
    });

    if (!idsResponse.ok) {
      throw new Response("Failed to fetch initial dog search", { status: idsResponse.status, statusText: 'ids' });
    }

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

    if (!dogsResponse.ok) {
      throw new Response("Failed to fetch dog data", { status: dogsResponse.status, statusText: 'dogs' });
    }

    const dogs = await dogsResponse.json()

    return json({ dogSearchMeta, dogs });
  } catch (error) {
    return json({ error: "Failed to fetch initial dog search", status: 500 })
  }
};

export default function Search () {
  const { dogSearchMeta, dogs } = useLoaderData<{ 
    dogSearchMeta: DogsSearchResponse,
    dogs: Dog[]
  }>();

  const [searchParams] = useSearchParams();
  const fetcher = useFetcher<{zipCodes: string[]}>({ key: "zipCodeFetch "});

  const [filters, setFilters] = useState<Partial<DogFilter>>(searchParamToFilter(searchParams));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    fetcher.submit(filters, {
      method: "post", 
      action: "/api/search",
      encType: "application/json",
    });
  };

  return (
    <main className="flex h-screen items-center justify-center">
      <section className="h-full flex-shrink-0x">
        <Filters 
          isLoading={fetcher.state === "submitting" || fetcher.state === "loading"} 
          filters={filters} 
          setFilters={setFilters} 
          handleSubmit={handleSubmit}
        />
      </section>
      <section className="flex-1 h-full bg-muted">
        <DogList dogs={dogs} dogSearchMeta={dogSearchMeta} />
      </section>
    </main>
  );
}