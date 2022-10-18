import type { LoaderArgs } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { planningClient } from "~/clients/planningClient";

export const loader = async ({ params, context, request }: LoaderArgs) => {
  if (typeof params.roomId !== "string") return redirect("/planning", 301);

  const { id, name } = await planningClient.room.get.query({
    roomId: params.roomId,
  });

  return json({
    roomId: id,
    roomName: name,
  });
};

export default () => {
  const { roomName } = useLoaderData<typeof loader>();

  return (
    <>
      <h2 className="mb-8">{roomName}</h2>
    </>
  );
};

export function ErrorBoundary() {
  const { roomId } = useParams();
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
      <p>
        There was an error loading room by the id{" "}
        <span className="font-mono">{roomId}</span>.
      </p>
      <p className="mb-8">Sorry.</p>
      <Link
        to="/planning"
        className="rounded border border-black py-2 px-4 ring-black hover:ring-2 dark:border-white dark:ring-white"
      >
        Go back to Planning
      </Link>
    </div>
  );
}
