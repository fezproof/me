import type { LoaderArgs } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getPlanningClient } from "~/clients/planningClient";

export const loader = async ({ params, context, request }: LoaderArgs) => {
  if (typeof params.roomId !== "string") return redirect("/planning", 301);

  const { id, name } = await getPlanningClient(
    context.PLANNING.fetch
  ).room.get.query(params.roomId);

  return json({
    roomId: id,
    roomName: name,
  });
};

export default () => {
  const { roomId, roomName } = useLoaderData<typeof loader>();

  return (
    <div>
      {roomId}: {roomName}
    </div>
  );
};
