import { Suspense } from "solid-js";
import { Outlet } from "solid-start";

export default function RoomLayout() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Outlet />
    </Suspense>
  );
}
