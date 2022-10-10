import type { ReactNode } from "react";

interface BenchProps {
  start?: ReactNode;
  end: ReactNode;
  className?: string;
}

const Bench = ({ start = "BenCh", end, className }: BenchProps) => (
  <h1 className={className}>
    <span className="font-bold">{start}</span>
    <span className="text-gray-700 dark:text-gray-200">{end}</span>
  </h1>
);

export default Bench;
