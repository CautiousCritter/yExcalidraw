import { useEffect } from "react";
import { observeDeep } from "@syncedstore/core";
import { initStore } from "./store";
import createContextedSyncedStore from "../hooks/createContextedSyncedStore";

export default function useDiceHistoryWatcher(onRoll: (roll: any) => void) {
  const { rolls } = createContextedSyncedStore(initStore);
  useEffect(() => {
    observeDeep(rolls, () => {
      if (rolls.length === 0) {
        return;
      }
      const topRoll = rolls[0];
      onRoll(topRoll);
    });
  }, [onRoll, rolls]);
}
