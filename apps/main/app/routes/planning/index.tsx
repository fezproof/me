import type { ActionArgs } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { Form, useActionData } from "@remix-run/react";
import Bench from "~/components/Bench";
import Button from "~/components/Button";

export const action = async ({ request, context }: ActionArgs) => {
  const url = new URL(request.url);

  const data = Object.fromEntries(await request.formData());

  const result = await context.EMITTER.fetch(`${url.origin}/channel/new`);

  if (!result.ok) return json({ error: result.statusText });

  const channel = await result.text();

  return redirect(`/planning/${channel}`);
};

export default () => {
  const actionData = useActionData();
  return (
    <div className="mx-auto max-w-prose p-8">
      <header>
        <Bench end=" planning" className="mb-8 text-3xl" />
      </header>

      <Form method="post" className="mb-4">
        <label>
          <span className="mb-2 block">Room name</span>
          <input
            className="mb-4 block w-full rounded-md bg-slate-200 px-4 py-2 outline-none ring-black focus:ring-2 dark:bg-slate-600 dark:ring-white"
            type="text"
            name="message"
            required
          />
        </label>

        <Button type="submit">Create new room</Button>
      </Form>

      {actionData && actionData.error && (
        <p className="text-red-500">{actionData.error}</p>
      )}
    </div>
  );
};
