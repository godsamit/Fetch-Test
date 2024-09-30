import { redirect } from "@remix-run/node";
import { getSession } from "~/sessions";


export const loader = async ({ request }: { request: Request}) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.get("fetch-access-token")) {
    return redirect("/login");
  }

  return redirect("/search/results");
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
    </div>
  );
}
