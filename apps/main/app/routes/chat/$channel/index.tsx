import type { ActionArgs, LoaderArgs } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import classNames from "classnames";
import { useEffect, useRef } from "react";
import Button from "~/components/Button";
import { parseUserCookie } from "~/cookies/user-prefs";
import { useClipboardMutation } from "~/hooks/useClipboardMutation";
import { useEventStream } from "~/hooks/useEventStream";

export const loader = async ({ params, context, request }: LoaderArgs) => {
  if (!params.channel) return redirect("/chat", 301);

  const cookieHeader = request.headers.get("Cookie");
  const cookie = await parseUserCookie(cookieHeader);

  if (!cookie.username || !cookie.id) {
    return redirect(`/chat/${params.channel}/join`);
  }

  const url = new URL(request.url);

  const result = await context.EMITTER.fetch(
    `${url.origin}/channel/${params.channel}`
  );

  if (!result.ok) {
    return redirect("/chat", 301);
  }

  const roomUrl = new URL(`/chat/${params.channel}/join`, url);

  return json({
    channel: params.channel,
    id: cookie.id as string,
    roomLink: roomUrl.toString(),
  });
};

export const action = async ({ request, context, params }: ActionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = await parseUserCookie(cookieHeader);

  if (!cookie.username || !cookie.id) {
    return redirect(`/chat/${params.channel}/join`);
  }

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
      data: {
        message,
        senderId: cookie.id as string,
        username: cookie.username as string,
      },
      topic: "chatMessageReceived",
      channel: params.channel,
    }),
  });

  return json({ ok: true });
};

export default () => {
  const { channel, id, roomLink } = useLoaderData<typeof loader>();

  const { allMessages } = useEventStream<{
    message: string;
    senderId: string;
    username: string;
  }>(`/chat/${channel}/events`);

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

  const { mutate } = useClipboardMutation();

  const copyRoomLink = () => {
    mutate({ text: roomLink });
  };

  return (
    <div className="fixed top-16 left-0 right-0 bottom-0">
      <div className="absolute bottom-4 left-4 right-4 mx-auto flex max-w-prose items-center justify-center">
        <Form
          method="post"
          ref={formRef}
          autoComplete="off"
          replace
          className="flex-1"
        >
          <input
            className="block w-full rounded-md bg-slate-200 px-4 py-2 outline-none ring-black focus:ring-2 dark:bg-slate-600 dark:ring-white"
            type="text"
            name="message"
            required
            ref={inputRef}
          />
        </Form>
      </div>
      <div className="absolute top-0 left-0 right-0 bottom-20 mx-auto flex max-w-prose flex-col-reverse flex-nowrap">
        <div
          className="flex w-full max-w-prose flex-1 flex-col gap-4 overflow-y-auto"
          ref={scrollRef}
        >
          {allMessages.map(({ message, senderId, username }, index) => {
            return (
              <div
                className={classNames(
                  "max-w-[30ch] rounded-md px-4 py-2 text-sm first:mt-auto ",
                  {
                    "mr-auto bg-slate-200 dark:bg-slate-800": senderId !== id,
                    "ml-auto bg-blue-200 dark:bg-blue-800": senderId === id,
                  }
                )}
                key={index}
              >
                <div className="flex flex-col flex-nowrap items-start justify-start gap-0">
                  {senderId !== id && (
                    <span className="text-sm text-slate-800 dark:text-slate-200">
                      {username}
                    </span>
                  )}
                  <p>{message}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mb-8 flex flex-row flex-nowrap items-center gap-4">
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {roomLink}
          </span>

          <Button type="button" onClick={copyRoomLink}>
            Share room link
          </Button>
        </div>
      </div>
    </div>
  );
};
