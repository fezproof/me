import { Link } from "@remix-run/react";
import Bench from "~/components/Bench";
import Button from "~/components/Button";

export default function Index() {
  return (
    <div className="fixed inset-0 flex h-full w-full flex-row flex-nowrap items-center justify-center">
      <div className="text-center">
        <header className="mb-12">
          <Bench end=".codes" className="mb-4 text-5xl" />
          <h2>More coming soon...</h2>
        </header>
        <main>
          <div className="mb-8 flex flex-row flex-nowrap items-center justify-center gap-8">
            <Button as={Link} to="/chat">
              BenChat
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
