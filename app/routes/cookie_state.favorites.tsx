/*
  Use cookie state, because I don't want the favorite 
  list to be empty every time user refreshes.
*/
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { json } from "@remix-run/node";

import { favorites } from "~/cookie_state/favorite";

export async function loader({ request } : LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await favorites.parse(cookieHeader)) || {};
  return json({ favorite: cookie.favorite || [] });
}

export async function action({ request } : ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await favorites.parse(cookieHeader)) || {};
  const { favorite : newFavorites } = await request.json();
  cookie.favorite = newFavorites;

  return json({ favorite: newFavorites }, {
    headers: {
      "Set-Cookie": await favorites.serialize(cookie),
    }
  });
}