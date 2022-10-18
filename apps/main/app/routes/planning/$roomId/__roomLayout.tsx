import type { LoaderArgs } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { Outlet, useLoaderData } from "@remix-run/react";
import { planningClient } from "~/clients/planningClient";
import { parseUserCookie } from "~/cookies/user-prefs";

export const loader = async ({ params, request }: LoaderArgs) => {
  if (typeof params.roomId !== "string") return redirect("/planning", 301);

  const members = await planningClient.room.members.query({
    roomId: params.roomId,
  });

  const cookieHeader = request.headers.get("Cookie");
  const userPrefs = await parseUserCookie(cookieHeader);

  if (!members.find(({ id }) => id === userPrefs.id)) {
    return redirect(`/planning/${params.roomId}/join`);
  }

  return json({
    members,
  });
};

export default () => {
  const { members } = useLoaderData<typeof loader>();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="mt-16 flex flex-1 flex-col justify-center gap-4 p-4 sm:flex-row">
        <main className="w-full max-w-prose flex-1">
          <Outlet />
        </main>

        <nav className="order-first">Sidebar</nav>

        <aside>
          <h3 className="mb-4 text-lg">Members</h3>
          <ul className="list-inside list-disc">
            {members.map(({ id, name }) => (
              <li key={id}>{name}</li>
            ))}
          </ul>
        </aside>
      </div>

      {/* <footer className="">Footer</footer> */}
    </div>
  );
};
