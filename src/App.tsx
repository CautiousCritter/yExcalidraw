import "./styles.css";
import { useRef, useState } from "react";
import { YDocContext } from "./Context/yDocContext";
import Whiteboard from "./Whiteboard/Whiteboard";
import * as Y from "yjs";
import Login from "./Login/Login";

export default function App() {
  const yDoc = useRef<Y.Doc>();
  const provider = useRef<any>();
  const [connected, setConnected] = useState(false);

  return (
    <div className="App">
      <YDocContext.Provider value={{ yDoc, provider }}>
        {connected ? <Whiteboard /> : <Login isConnected={setConnected} />}
      </YDocContext.Provider>
    </div>
  );
}
