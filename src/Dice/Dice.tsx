import "./Dice.css";
import useDiceRoller from "./useDiceRoller";
import History from "./History";
import { initStore } from "./store";
import { useSyncedStore } from "@syncedstore/react";
import createContextedSyncedStore from "../hooks/createContextedSyncedStore";

export default function Dice() {
  const { roll } = useDiceRoller();
  const store = useSyncedStore(createContextedSyncedStore(initStore));

  const onSubmit = (event: any) => {
    const notation = store.state.notation || "";

    if (notation !== "") {
      const result = roll(notation);
      if (result.output !== "") {
        store.state.notation = "";
      }
    }

    event.preventDefault();
    return false;
  };

  return (
    <div className="dice-container">
      <form onSubmit={onSubmit} className="dice-form">
        <label style={{ display: "flex" }}>
          <input
            type="text"
            placeholder="Dice roll e.g. 2d20"
            spellCheck={false}
            onChange={(event) => (store.state.notation = event.target.value)}
            value={store.state.notation || ""}
            className="dice-form-input"
          />
        </label>
        <input type="submit" value="🎲" className="dice-form-submit" />
      </form>
      <History />
    </div>
  );
}
