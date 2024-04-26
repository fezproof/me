import type { LoaderFunctionArgs } from "@remix-run/cloudflare";

export const loader = async ({
  request,
  context,
  params,
}: LoaderFunctionArgs) => {
  const res = await context.octokit.request(
    "GET /repos/{owner}/{repo}/commits",
    {
      owner: "fezproof",
      repo: "me",
      path: "apps/blog",
    }
  );
  return res.data.map((d) => d.commit.committer?.date);
};

export default function Index() {
  return (
    <div className="flex-1 px-2 md:px-4 max-w-xl mx-auto w-full">
      Hello index
    </div>
  );
}
