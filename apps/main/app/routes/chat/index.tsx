import type { ActionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { Form, useActionData } from "@remix-run/react";

export const meta: MetaFunction = () => ({
  title: "BenChat",
});

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
  return (
    <div className="fixed inset-0 h-full w-full flex flex-col items-center justify-center">
      <div className="m-8">
        <header>
          <h1 className="text-6xl mb-4">
            <span className="font-bold">BenCh</span>
            <span className="text-gray-700 dark:text-gray-200">at</span>
          </h1>
          <h2 className="mb-6 text-3xl font-bold">
            A fully serverless chat app
          </h2>

          <div className="mb-8 text-xl flex flex-col gap-4">
            <p>
              This basic chat system is built on durable objects and cloudflare
              workers.
            </p>
            <p>
              That chat messages is not retained currently. Instead they are
              broadcasted to all other chat members using Server Sent Events.
            </p>
          </div>
        </header>

        <main>
          <Form method="post" className="mb-4">
            <button
              type="submit"
              className="px-4 py-2 text-white bg-gray-700 rounded"
            >
              Create new room
            </button>
          </Form>

          {actionData?.error ? (
            <p className="text-red-500">{actionData.error}</p>
          ) : (
            <span className="h-6 block" />
          )}
        </main>
      </div>
    </div>
  );
};
