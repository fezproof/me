import type { ActionArgs } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { Form, useActionData } from "@remix-run/react";

export const action = async ({ request, context }: ActionArgs) => {
  const url = new URL(request.url);

  const result = await context.EMITTER.fetch(`${url.origin}/channel/new`);

  if (!result.ok) return json({ error: result.statusText });

  const channel = await result.text();

  return redirect(`/planning/${channel}`);
};

export default () => {
  const actionData = useActionData();
  return (
    <div className="p-8 text-white">
      <h1 className="mb-4 text-lg">Chat app</h1>

      <Form method="post" className="mb-4">
        <input type="text" name="name" />
        <button type="submit" className="rounded bg-gray-700 px-4 py-2">
          Create new game
        </button>
      </Form>

      {actionData && actionData.error && (
        <p className="text-red-500">{actionData.error}</p>
      )}
    </div>
  );
};
