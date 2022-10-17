import type { ActionArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { Form, useActionData } from "@remix-run/react";
import { z } from "zod";
import { planningClient } from "~/clients/planningClient";
import Bench from "~/components/Bench";
import Button from "~/components/Button";
import TextInput from "~/components/TextInput";

const formSchema = z.object({ name: z.string().max(32).min(1) });

export const action = async ({ request, context }: ActionArgs) => {
  const formData = Object.fromEntries(await request.formData());

  const { name } = formSchema.parse(formData);

  const { id } = await planningClient.room.new.mutate({
    name,
  });

  return redirect(`/planning/${id}`);
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
          <TextInput name="name" required />
        </label>

        <Button type="submit">Create new room</Button>
      </Form>

      {actionData && actionData.error && (
        <p className="text-red-500">{actionData.error}</p>
      )}
    </div>
  );
};
