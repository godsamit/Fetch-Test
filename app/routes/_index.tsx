import type { MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSession } from "~/sessions";
import { Home } from "~/components/Home";

export const meta: MetaFunction = () => {
  return [
    { title: "Fetch Take Home Test" },
    { name: "description", content: "Fetch Take Home Test Submission by Yushan Liu" },
  ];
};

export const loader = async ({ request }: { request: Request}) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.get("fetch-access-token")) {
    return redirect("/login");
  }

  return null;
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Home />
    </div>
  );
}
