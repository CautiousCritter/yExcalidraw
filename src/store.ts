/// https://github.com/nimeshnayaju/yjs-tldraw/blob/main/src/store.ts
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { BinaryFiles } from "@excalidraw/excalidraw/types/types";

const VERSION = 11;

// Create the doc
export const doc = new Y.Doc();

export const roomID = `y-excalidraw-${VERSION}`;

// Create a websocket provider
export const provider = new WebsocketProvider(
  "wss://demos.yjs.dev",
  roomID,
  doc,
  {
    connect: true
  }
);

// Export the provider's awareness API
export const awareness = provider.awareness;

export const yExcalidrawElement: Y.Map<ExcalidrawElement> = doc.getMap(
  "element"
);

export const yBinaryFileData: Y.Map<BinaryFiles> = doc.getMap("binaryFile");

// export const yExcalidrawElement: Y.Array<ExcalidrawElement> = doc.getArray(
//   "element-array"
// );

// Create an undo manager for the shapes and binding maps
export const undoManager = new Y.UndoManager([yExcalidrawElement]);
