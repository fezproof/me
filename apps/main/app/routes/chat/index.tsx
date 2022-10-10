import type { ActionArgs } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { Form, useActionData, useTransition } from "@remix-run/react";
import Bench from "~/components/Bench";
import Button from "~/components/Button";

export const action = async ({ request, context }: ActionArgs) => {
  const url = new URL(request.url);

  const result = await context.EMITTER.fetch(`${url.origin}/channel/new`);

  if (!result.ok) {
    return json({
      error: result.statusText,
    });
  }

  const channel = await result.text();

  return redirect(`/chat/${channel}`);
};

export default () => {
  const actionData = useActionData<typeof action>();

  const transition = useTransition();
  return (
    <div className="fixed inset-0 flex h-full w-full flex-col items-center justify-center">
      <div className="m-8">
        <header>
          <Bench end="at" className="mb-4 text-5xl" />
          <h2 className="mb-6 text-3xl font-bold">
            A fully serverless chat app
          </h2>

          <div className="mb-8 flex flex-col gap-4 text-xl">
            <p>
              This basic chat system is built on durable objects and cloudflare
              workers.
            </p>
            <p>
              That chat messages is not retained. Instead they are broadcasted
              to all other room members using Server Sent Events.
            </p>
          </div>
        </header>

        <main>
          <Form method="post" className="mb-4">
            <Button type="submit" disabled={transition.state === "submitting"}>
              Create new room
            </Button>
          </Form>

          {actionData?.error ? (
            <p className="text-red-500">{actionData.error}</p>
          ) : (
            <span className="block h-6" />
          )}
        </main>
      </div>
    </div>
  );
};
