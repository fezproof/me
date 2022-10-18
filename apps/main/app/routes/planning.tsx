import type { MetaFunction } from "@remix-run/cloudflare";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => ({
  title: "BenCh Planning",
});

export default () => <Outlet />;
