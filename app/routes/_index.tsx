import type { MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getAuthToken } from "~/utils/getAuth.server";
import { getSession, commitSession } from "~/sessions";

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
      <p>Logged In</p>
    </div>
  );
}
