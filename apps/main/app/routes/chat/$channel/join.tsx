import type { ActionArgs, LoaderArgs } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { v4 as uuid } from "uuid";
import Button from "~/components/Button";
import { parseUserCookie, serializeUserPrefs } from "~/cookies/user-prefs";

export const loader = async ({ request }: LoaderArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const userPrefs = await parseUserCookie(cookieHeader);
  return json({ username: userPrefs.username });
};

export async function action({ request, params }: ActionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const userPrefs = await parseUserCookie(cookieHeader);
  const formData = await request.formData();

  const username = formData.get("username");

  if (typeof username !== "string" || !username?.length) {
    return json({ error: "Username is requried" });
  }

  userPrefs.username = username;

  if (!userPrefs.id) {
    userPrefs.id = uuid();
  }

  return redirect(`/chat/${params.channel}`, {
    headers: {
      "Set-Cookie": await serializeUserPrefs(userPrefs),
    },
  });
}

export default function Home() {
  const { username } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="fixed inset-0 flex h-full w-full flex-col items-center justify-center">
      <div className="m-8">
        <Form
          method="post"
          className="flex flex-col flex-nowrap items-center justify-center gap-6"
        >
          <label>
            <span className="mb-2 block">Username</span>
            <input
              className="block w-full rounded-md bg-slate-200 px-4 py-2 outline-none ring-black focus:ring-2 dark:bg-slate-600 dark:ring-white"
              type="text"
              required
              name="username"
              defaultValue={username}
            />
          </label>
          <Button type="submit">Join</Button>

          {actionData?.error ? (
            <p className="text-red-500">{actionData.error}</p>
          ) : (
            <span className="block h-6" />
          )}
        </Form>
      </div>
    </div>
  );
}
