import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore, type StoreApi } from "zustand";
import { createExploreStore, type ExploreState } from "./explore";

const ExploreStoreContext = createContext<StoreApi<ExploreState> | null>(null);

type ProviderProps = { kms: number[]; initialPosition: number; children: ReactNode };

export function ExploreStoreProvider({ kms, initialPosition, children }: ProviderProps) {
    const [store] = useState(() => createExploreStore(kms, initialPosition));
    return <ExploreStoreContext.Provider value={store}>{children}</ExploreStoreContext.Provider>;
}

// The store itself, for getState() and subscribe() outside React's render cycle.
export function useExploreApi() {
    const store = useContext(ExploreStoreContext);
    if (!store) throw new Error("useExploreApi must be used inside ExploreStoreProvider");
    return store;
}

// Subscribe a component to one piece of state.
export function useExplore<T>(selector: (state: ExploreState) => T) {
    return useStore(useExploreApi(), selector);
}