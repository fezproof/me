import type { ActionArgs, LoaderArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Form, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { useEventSource } from "~/hooks/useEventSource";
import { useRevalidator } from "~/hooks/useRevalidator";
import { emitter, EVENTS } from "~/services/emitter";

export const loader = async ({ params: { roomId } }: LoaderArgs) => {
  if (typeof roomId !== "string") return redirect("/");

  return json({ now: Date.now(), roomId });
};

export const action = async ({ request, params: { roomId } }: ActionArgs) => {
  if (typeof roomId !== "string") return redirect("/");

  const formData = await request.formData();

  const message = formData.get("message");

  if (typeof message !== "string") {
    return json(
      {
        ok: false,
        error: "Message must be a string",
      },
      400
    );
  }

  await emitter.emit(roomId, EVENTS.CHANGED, { message });

  return json({ ok: true });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  const eventData = useEventSource(data.roomId, EVENTS.CHANGED);

  const revalidator = useRevalidator();
  useEffect(() => {
    revalidator.revalidate();
  }, [eventData, revalidator]);

  return (
    <>
      <header>
        <h1>Chat app scaffold</h1>
      </header>
      <main className="p-8">
        <Form method="post" className="mb-4" autoComplete="off">
          <input
            type="text"
            name="message"
            className="px-3 py-2 border border-black"
          />
        </Form>
        <div className="grid grid-cols-2">
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <pre>{JSON.stringify(eventData, null, 2)}</pre>
        </div>
      </main>
    </>
  );
}
