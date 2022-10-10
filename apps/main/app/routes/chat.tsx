import type { MetaFunction } from "@remix-run/cloudflare";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => ({
  title: "BenChat",
});

export default () => <Outlet />;
