import "./History.css";
import createContextedSyncedStore from "../hooks/createContextedSyncedStore";
import { initStore } from "./store";

export default function History() {
  const { rolls } = createContextedSyncedStore(initStore);
  return (
    <ul className="dice-roll-history">
      {rolls.map((roll, index) => (
        <li title={roll.output} key={index} className="dice-roll-history-item">
          <h3>{roll.notation}</h3>
          <ul>
            {roll.rolls?.map((result, index) => (
              <li key={index}>
                <ul>
                  <li className="total" key="total">
                    {roll.total}
                  </li>
                  {result.rolls?.map((r, index) => (
                    <li
                      className={Array.from(["die", ...r.modifiers]).join(" ")}
                      key={index}
                    >
                      {r.value}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
