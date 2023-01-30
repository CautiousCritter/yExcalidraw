import * as Y from "yjs";
import { useContext } from "react";
import { WebsocketProvider } from "y-websocket";
import { YDocContext } from "../Context/yDocContext";

export default function Login({
  isConnected
}: {
  isConnected: (connected: boolean) => void;
}) {
  const context = useContext(YDocContext);

  const onSubmit = (event) => {
    event.preventDefault();

    // Create the doc
    const doc = context.yDoc.current || new Y.Doc();

    const VERSION = 1;
    const roomID = `y-excalidraw-${VERSION}`;

    // Create a websocket provider
    const provider = new WebsocketProvider("wss://demos.yjs.dev", roomID, doc, {
      connect: true
      //password: undefined
    });

    context.yDoc.current = doc; // this may not be needed. As long as all the other components import the same doc it shouldn't really be needed to pass it along with the context
    context.provider.current = provider;
    isConnected(true);

    return false;
  };

  return (
    <form onSubmit={onSubmit}>
      <label>
        <input type="text" placeholder="handle" />
      </label>
      <label>
        <input type="text" placeholder="room" />
      </label>
      <label>
        <input type="text" placeholder="password" />
      </label>
      <input type="submit" />
    </form>
  );
}
