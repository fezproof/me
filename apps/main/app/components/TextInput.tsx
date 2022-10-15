import classNames from "classnames";
import type { ElementType } from "react";
import type { WithAsComponent } from "./utils/asComponent";

const TextInput = <T extends ElementType = "input">({
  as,
  className,
  type,
  ...props
}: WithAsComponent<T, {}>) => {
  const Component = as ?? "input";

  return (
    <Component
      className={classNames(
        "mb-4 block w-full rounded-md bg-slate-200 px-4 py-2 outline-none ring-black focus:ring-2 dark:bg-slate-600 dark:ring-white",
        className
      )}
      type={type ?? "text"}
      {...props}
    />
  );
};

export default TextInput;
