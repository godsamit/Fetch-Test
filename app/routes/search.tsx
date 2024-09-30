import { useState } from "react";
import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getSession } from "~/sessions";
import type { Dog, DogsSearchResponse, DogFilter } from "~/utils/types";
import { Filters } from "~/components/Filters";
import { DogList } from "~/components/DogList";
import { DEFAULT_SORT } from "~/utils/constants";

export const loader = async ({ request }: { request: Request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const authToken = session.get("fetch-access-token");
  if (!authToken) {
    return redirect("/login");
  }
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
};

export default function Search () {
  const { dogSearchMeta, dogs } = useLoaderData<{ 
    dogSearchMeta: DogsSearchResponse,
    dogs: Dog[]
  }>();

  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<Partial<DogFilter>>({
    breeds: searchParams.getAll("breeds") || [],
    zipCodes: searchParams.getAll("zipCodes") || [],
    ageMin: searchParams.get("ageMin") ? parseInt(searchParams.get("ageMin")!) : undefined,
    ageMax: searchParams.get("ageMax") ? parseInt(searchParams.get("ageMax")!) : undefined,
    size: searchParams.get("size") ? parseInt(searchParams.get("size")!) : undefined,
    sort: searchParams.get("sort") || DEFAULT_SORT,
  });

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, filters: Partial<DogFilter>) => {
    e.preventDefault();
    const query = new URLSearchParams();

    if (filters.breeds?.length) {
      filters.breeds.forEach(breed => query.append('breeds', breed));
    }
    if (filters.zipCodes?.length) {
      filters.zipCodes.forEach(zipCode => query.append('zipCodes', zipCode));
    }
    if (filters.ageMin) {
      query.set('ageMin', filters.ageMin.toString());
    }
    if (filters.ageMax) {
      query.set('ageMax', filters.ageMax.toString());
    }
    if (filters.size) {
      query.set('size', filters.size.toString());
    }
    if (filters.sort) {
      query.set('sort', filters.sort);
    }

    navigate(`?${query.toString()}`, { replace: true });
  };

  return (
    <main className="flex h-screen items-center justify-center">
      <section className="h-full flex-shrink-0x">
        <Filters filters={filters} setFilters={setFilters} handleSubmit={handleSubmit}/>
      </section>
      <section className="flex-1 h-full bg-muted">
        <DogList dogs={dogs} dogSearchMeta={dogSearchMeta} />
      </section>
    </main>
  );
}