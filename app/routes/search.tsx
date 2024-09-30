import { useState } from "react";
import { Outlet, useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getSession } from "~/sessions";
import type { DogFilter, DogsSearchResponse } from "~/utils/types";
import { Filters } from "~/components/Filters";
import { DEFAULT_SORT } from "~/utils/constants";

export const loader = async ({ request }: { request: Request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const authToken = session.get("fetch-access-token");
  if (!authToken) {
    return redirect("/login");
  } 
  const url = new URL(request.url)
  if (url.pathname === "/search") {
    return redirect("/search/results" + url.search);
  }
  // Call the breeds API with the cookie
  const response = await fetch("https://frontend-take-home-service.fetch.com/dogs/breeds", {
    headers: {
      Cookie: `fetch-access-token=${authToken}`,
    },
    credentials: "include", // Ensure cookies are sent with the request
  });

  if (!response.ok) {
    throw new Response("Failed to fetch breeds", { status: response.status });
  }

  const breeds = await response.json();

  return json({ breeds });
};

export default function Search () {
  const { breeds } = useLoaderData<{ breeds: string[], dogs: DogsSearchResponse }>();
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

    navigate(`results?${query.toString()}`, { replace: true });
  };

  return (
    <main className="flex h-screen items-center justify-center">
      <section className="h-full flex-shrink-0x">
        <Filters breeds={breeds} filters={filters} setFilters={setFilters} handleSubmit={handleSubmit}/>
      </section>
      <section className="flex-1 h-full bg-muted">
        <Outlet />
      </section>
    </main>
  );
}