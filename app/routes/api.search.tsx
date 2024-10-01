import { json, redirect } from "@remix-run/node";
import { getSession } from "~/sessions";
import type { DogFilter, Location } from "~/utils/types";

export const action = async ({ request } : { request: Request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const authToken = session.get("fetch-access-token");
  if (!authToken) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const filters : Partial<DogFilter> = await request.json()
  const { ageMin, ageMax, sort, geoBoundingBox, breeds, size } = filters;
  
  // Fetch zip codes if geoBoundingBox is provided
  let zipCodes : string[] = []
  if (geoBoundingBox) {
    try {
      const zipCodeResponse = await fetch("https://frontend-take-home-service.fetch.com/locations/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `fetch-access-token=${authToken}`,
        },
        body: JSON.stringify({
          geoBoundingBox,
        }),
        credentials: "include",
      });

      if (!zipCodeResponse.ok) {
        throw new Response("Failed to fetch zip codes", { status: zipCodeResponse.status, statusText: 'zip codes' });
      }

      const { results } = await zipCodeResponse.json();
      zipCodes = results.map((location : Location) => {
        return location.zip_code
      });
    } catch (error) {
      return json({ error: error.message }, { status: 500 });
    }
  }

  const query = new URLSearchParams();

  if (breeds?.length) {
    breeds.forEach(breed => query.append('breeds', breed));
  }
  if (zipCodes?.length) {
    zipCodes.forEach(zipCode => query.append('zipCodes', zipCode));
  }
  if (ageMin) {
    query.set('ageMin', ageMin.toString());
  }
  if (ageMax) {
    query.set('ageMax', ageMax.toString());
  }
  if (size) {
    query.set('size', size.toString());
  }
  if (sort) {
    query.set('sort', sort);
  }

  return redirect(`/search?${query.toString()}`);
}