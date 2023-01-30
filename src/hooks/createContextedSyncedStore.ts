import syncedStore from "@syncedstore/core";
import {
  DocTypeDescription,
  MappedTypeDescription
} from "@syncedstore/core/types/doc";
import { useSyncedStore } from "@syncedstore/react";
import React, { useContext, useMemo } from "react";
import { YDocContext } from "../Context/yDocContext";

export default function createContextedSyncedStore<
  T extends DocTypeDescription
>(store: T): MappedTypeDescription<T> {
  const { yDoc } = useContext(YDocContext);
  return syncedStore<T>(store, yDoc.current);
}

export function useContextSyncedStore<T extends DocTypeDescription>(
  store: T,
  deps: React.DependencyList | undefined
) {
  const { yDoc } = useContext(YDocContext);
  const contextStore = useMemo(() => {
    return syncedStore(store, yDoc.current);
  }, [store, yDoc]);
  return useSyncedStore(contextStore, deps);
}
