import type { ActionArgs, LoaderArgs } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { Form, Link, useLoaderData, useTransition } from "@remix-run/react";
import classNames from "classnames";
import { useEffect, useRef } from "react";
import Bench from "~/components/Bench";
import Button from "~/components/Button";
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

  const roomUrl = new URL(`/chat/${params.channel}`, url);

  return json({
    channel: params.channel,
    id: context.cf.asn,
    roomLink: roomUrl.toString(),
  });
};

export const action = async ({ request, context, params }: ActionArgs) => {
  const url = new URL(request.url);

  const { message } = Object.fromEntries(await request.formData());

  if (!message) {
    return json({ ok: true });
  }

  await context.EMITTER.fetch(`${url.origin}/send`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      data: { message, sender: context.cf.asn },
      topic: "chatMessageReceived",
      channel: params.channel,
    }),
  });

  return json({ ok: true });
};

export default () => {
  const { channel, id, roomLink } = useLoaderData<typeof loader>();
  console.log(roomLink);

  const { allMessages } = useEventStream<{ message: string; sender: number }>(
    `/chat/${channel}/events`
  );

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

  const copyRoomLink = () => {
    navigator.clipboard.writeText(roomLink);
  };

  return (
    <div className="p-8">
      <div className="absolute bottom-4 left-4 right-4 top-32 flex flex-col items-center">
        <div className="flex h-full w-full max-w-lg flex-col-reverse flex-nowrap p-4">
          <Form
            method="post"
            ref={formRef}
            className="mt-4"
            autoComplete="off"
            replace
          >
            <input
              className="block w-full rounded-md bg-slate-200 px-4 py-2 outline-none ring-black focus:ring-2 dark:bg-slate-600 dark:ring-white"
              type="text"
              name="message"
              required
              ref={inputRef}
            />
          </Form>

          <div
            className="flex flex-1 flex-col gap-4 overflow-y-auto"
            ref={scrollRef}
          >
            {allMessages.map(({ message, sender }, index) => {
              return (
                <p
                  className={classNames(
                    "max-w-[30ch] rounded-md bg-blue-200 px-4 py-2 text-sm dark:bg-blue-800",
                    {
                      "mr-auto": sender !== id,
                      "ml-auto": sender === id,
                    }
                  )}
                  key={index}
                >
                  {message}
                </p>
              );
            })}
          </div>

          <div className="mb-8 flex flex-row flex-nowrap items-center gap-4">
            <span className="overflow-hidden text-ellipsis">{roomLink}</span>
            <Button type="button" onClick={copyRoomLink}>
              Copy room link
            </Button>
          </div>
        </div>
      </div>

      <Link to="/chat">
        <Bench className="inline-block text-3xl" end="at" />
      </Link>
    </div>
  );
};
