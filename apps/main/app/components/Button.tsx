import classNames from "classnames";
import type { ElementType } from "react";
import type { WithAsComponent } from "./utils/asComponent";

const Button = <T extends ElementType = "button">({
  as,
  className,
  ...props
}: WithAsComponent<T, {}>) => {
  const Component = as ?? "button";

  return (
    <Component
      className={classNames(
        "whitespace-nowrap rounded bg-slate-300 px-4 py-2 text-black outline-none ring-black ring-offset-2 ring-offset-slate-50 hover:bg-slate-400 focus:ring-2 disabled:bg-slate-500 disabled:text-slate-200 dark:bg-slate-700 dark:text-white dark:ring-white dark:ring-offset-slate-900 dark:hover:bg-slate-600",
        className
      )}
      {...props}
    />
  );
};

export default Button;
