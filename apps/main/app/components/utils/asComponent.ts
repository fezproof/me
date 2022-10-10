import type { ComponentPropsWithoutRef, ElementType } from "react";

interface AsComponentProps<T extends ElementType> {
  as?: T;
}

export type WithAsComponent<
  T extends ElementType,
  P extends unknown
> = AsComponentProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof P>;
