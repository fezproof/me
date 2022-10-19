import type { LoaderArgs } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { Outlet, useFetcher, useLoaderData } from "@remix-run/react";
import classNames from "classnames";
import { useEffect } from "react";
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
    roomId: params.roomId,
    userId: userPrefs.id as string,
  });
};

export default () => {
  const { members, roomId, userId } = useLoaderData<typeof loader>();

  useEffect(() => {
    const handle = (event?: Event) => {
      if (event && document.visibilityState === "visible") {
        navigator.sendBeacon(`/planning/${roomId}/${userId}/avaliable`);
      } else {
        navigator.sendBeacon(`/planning/${roomId}/${userId}/away`);
      }
    };

    addEventListener("visibilitychange", handle);

    return () => {
      handle();
      removeEventListener("visibilitychange", handle);
    };
  }, [roomId, userId]);

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
            {members.map(({ id, name, here }) => {
              const kick = useFetcher();

              return (
                <li
                  className={classNames("list-item", {
                    "text-black dark:text-white": here,
                    "text-slate-300 dark:text-slate-700": !here,
                  })}
                  key={id}
                >
                  <kick.Form
                    className="inline"
                    action={`/planning/${roomId}/${id}/kick`}
                    method="post"
                    replace
                  >
                    <span>{name} </span>
                    <button
                      title={`Kick '${name}'`}
                      className="inline h-8 w-8 text-red-500"
                      type="submit"
                    >
                      x
                    </button>
                  </kick.Form>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>

      {/* <footer className="">Footer</footer> */}
    </div>
  );
};
