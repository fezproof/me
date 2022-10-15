import { Link, Outlet } from "@remix-run/react";
import Bench from "~/components/Bench";

export default () => (
  <div>
    <Outlet />

    <header className="fixed left-0 top-0 p-4">
      <Link to="/chat">
        <Bench className="inline-block text-3xl" end="at" />
      </Link>
    </header>
  </div>
);
