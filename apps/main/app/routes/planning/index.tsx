import type { ActionArgs, LoaderArgs } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { planningClient } from "~/clients/planningClient";
import Bench from "~/components/Bench";
import Button from "~/components/Button";
import TextInput from "~/components/TextInput";
import { getUserPrefs } from "~/cookies/user-prefs";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUserPrefs(request);

  return json({ username: user.username });
};

const formSchema = z.object({ name: z.string().max(32).min(1) });

export const action = async ({ request }: ActionArgs) => {
  const formData = Object.fromEntries(await request.formData());

  const { name } = formSchema.parse(formData);

  const { id } = await planningClient.room.new.mutate({
    name,
  });

  return redirect(`/planning/${id}`);
};

export default () => {
  const { username } = useLoaderData<typeof loader>();
  const actionData = useActionData();
  return (
    <div className="mx-auto max-w-prose p-8">
      <header>
        <Bench end=" planning" className="mb-8 text-3xl" />
      </header>

      <Form method="post" className="mb-4" autoComplete="off">
        <label>
          <span className="mb-2 block">Room name</span>
          <TextInput
            name="name"
            required
            defaultValue={username ? `${username}'s room` : undefined}
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
