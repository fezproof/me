import type { ActionArgs, LoaderArgs } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { useEventStream } from "~/hooks/useEventStream";

export const loader = async ({ params, context, request }: LoaderArgs) => {
  if (!params.channel) return redirect("/chat", 301);

  const url = new URL(request.url);

  const result = await context.EMITTER.fetch(
    `${url.origin}/channel/${params.channel}`
  );

  if (!result.ok) {
    return redirect("/chat", 301);
  }

  return json({ channel: params.channel });
};

export const action = async ({ request, context, params }: ActionArgs) => {
  const url = new URL(request.url);

  const { message } = Object.fromEntries(await request.formData());

  await context.EMITTER.fetch(`${url.origin}/send`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      data: message,
      topic: "chatMessageReceived",
      channel: params.channel,
    }),
  });

  return json({ ok: true });
};

export default () => {
  const { channel } = useLoaderData<typeof loader>();
  const { allMessages } = useEventStream(`/chat/${channel}/events`);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const transition = useTransition();

  useEffect(() => {
    if (transition.state !== "submitting") {
      formRef.current?.reset();
      inputRef.current?.focus();
    }
  }, [transition.state]);

  useEffect(() => {
    scrollRef.current?.scroll({ top: scrollRef.current.scrollHeight });
  }, [allMessages.length]);

  return (
    <div className="text-white p-8">
      <h1 className="mb-4 text-lg">Chat app</h1>
      <div className="absolute bottom-4 left-4 right-4 flex flex-col items-center">
        <div className="w-full max-w-lg border-2 border-gray-800 rounded-2xl p-4 h-96 flex flex-col flex-nowrap">
          <div
            className="flex-1 flex flex-col gap-4 overflow-y-auto"
            ref={scrollRef}
          >
            {allMessages.map((message, index) => {
              return (
                <p
                  className="bg-red-300 text-black px-4 py-2 rounded-md"
                  key={index}
                >
                  {message}
                </p>
              );
            })}
          </div>

          <Form
            method="post"
            ref={formRef}
            className="mt-4"
            autoComplete="off"
            replace
          >
            <input
              className="bg-gray-800 block w-full px-4 py-2 rounded-md"
              type="text"
              name="message"
              ref={inputRef}
            />
          </Form>
        </div>
      </div>
    </div>
  );
};
