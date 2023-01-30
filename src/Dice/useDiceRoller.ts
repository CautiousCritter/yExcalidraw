import createContextedSyncedStore from "../hooks/createContextedSyncedStore";
import type { rollResult } from "./store";
import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import { initStore } from "./store";

export default function useDiceRoller() {
  const { rolls } = createContextedSyncedStore(initStore);

  function roll(notation: string): rollResult {
    const result = new DiceRoll(notation);
    rolls.unshift(JSON.parse(result.export())); // required to get the entire object pushed to the yjs document
    return result;
  }

  return {
    roll
  };
}
