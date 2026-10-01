import { useSyncExternalStore, type ReactNode } from "react";

const subscribe = () => () => {};

export function ClientOnly({
    children,
    fallback,
}: {
    children: () => ReactNode;
    fallback: ReactNode;
}) {
    const isClient = useSyncExternalStore(subscribe, () => true, () => false);
    return isClient ? children() : fallback;
}