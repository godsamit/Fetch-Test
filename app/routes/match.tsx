import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import type { Dog } from "~/utils/types";
import { json, redirect } from "@remix-run/node";
import { favorite } from "~/cookie_state/favorite";
import { Link, Form, useLoaderData } from "@remix-run/react";
import { MatchCard } from "~/components/Match";
import { Button } from "~/components/ui/button";
import { ResetIcon, AvatarIcon } from "@radix-ui/react-icons";

// Load the page with matched dog
export const loader = async({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await favorite.parse(cookieHeader)) || {};

  if (cookie.matchedDog) {
    cookie.favorite = [];
  }
  
  return json({ matchedDog: cookie.matchedDog }, {
    headers: {
      "Set-Cookie": await favorite.serialize(cookie),
    },
  });
};

// Clear the matched dog from the cookie
export const action = async ({ request }: ActionFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await favorite.parse(cookieHeader)) || {};

  delete cookie.matchedDog;

  return redirect("/search", {
    headers: {
      "Set-Cookie": await favorite.serialize(cookie),
    },
  });
};

export default function Match() {

  const { matchedDog } = useLoaderData<{ matchedDog: Dog }>();
  return (
    <main className="flex items-center justify-center h-screen bg-muted">
      <div className="w-[clamp(20rem,500px,80vw)] flex flex-col gap-6 items-center justify-center ">
        {matchedDog && <h1 className="text-4xl font-bold text-primary">Match Found!</h1>}
        <MatchCard matchedDog={matchedDog} />
        <section className="w-full flex justify-between">
          {matchedDog 
            ? <>
              <Form method="POST">
                <Button variant="outline" className="flex items-center gap-2">
                  <ResetIcon />
                  <span>Start another search</span>
                </Button>
              </Form>
              <a target="_blank" rel="noreferrer" href="https://samsonliu.me">
                <Button className="flex items-center gap-2">
                  <AvatarIcon />
                  <span>Contact owner</span>
                </Button>
              </a>
            </>
            : <Link to="/search" className="ml-auto">
              <Button className="flex items-center gap-2">
                <ResetIcon /> <span>Return to search!</span>
              </Button>
            </Link>
          }

        </section>
      </div>
    </main>
  )
}