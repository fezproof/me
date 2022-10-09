import type { LoaderArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";

export const loader = async ({ request, context }: LoaderArgs) => {
  return json({
    position: {
      latitude: context.cf.latitude,
      longitude: context.cf.longitude,
    },
    location: {
      city: context.cf.city,
      country: context.cf.country,
    },
  });
};

export default function Index() {
  return (
    <div className="fixed inset-0 h-full w-full flex flex-row flex-nowrap items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl mb-4">
          <span className="text-white font-bold">Ben Ch</span>
          <span className="text-gray-200">idlow</span>
        </h1>
        <h2 className="text-white">More coming soon...</h2>
      </div>
    </div>
  );
}
