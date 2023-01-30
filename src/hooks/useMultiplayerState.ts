/// https://github.com/nimeshnayaju/yjs-tldraw/blob/main/src/hooks/useMultiplayerState.ts
import * as Y from "yjs";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import {
  AppState,
  BinaryFileData,
  BinaryFiles,
  Collaborator,
  ExcalidrawImperativeAPI
} from "@excalidraw/excalidraw/types/types";
import { useCallback, useEffect, useState, useContext, useRef } from "react";
import { Room } from "@y-presence/client";
import { YDocContext } from "../Context/yDocContext";
import { Transaction } from "yjs";
import type { PointerUpdate } from "../Whiteboard/Whiteboard";

const local = Symbol("local");

// this needs to be scoped correctly
const cachedElements: Map<string, ExcalidrawElement> = new Map<
  string,
  ExcalidrawElement
>();

export function useMultiplayerState() {
  const [app, setApp] = useState<ExcalidrawImperativeAPI>();
  const [loading, setLoading] = useState(true);

  const room = useRef<Room>();

  const { yDoc: doc, provider } = useContext(YDocContext);
  const yBinaryFileData: Y.Map<BinaryFileData> = doc.current!.getMap(
    "binaryFile"
  );
  const yExcalidrawElement: Y.Map<ExcalidrawElement> = doc.current!.getMap(
    "element"
  );

  const onMount = useCallback(
    (app: ExcalidrawImperativeAPI) => {
      // console.log(app);
      // app.loadRoom(roomId);
      // app.pause();
      setApp(app);
    },
    []
    // [roomId]
  );

  // throttle ?
  const onChange = useCallback(
    (
      elements: readonly ExcalidrawElement[],
      state: AppState,
      files: BinaryFiles
    ) => {
      //undoManager.stopCapturing();
      doc.current?.transact(() => {
        Object.entries(files).forEach(([key, value]) => {
          if (!yBinaryFileData.has(key)) {
            yBinaryFileData.set(key, value);
          }
        });

        elements.forEach((element, index) => {
          const oldElement = yExcalidrawElement.get(element.id);
          if (oldElement && oldElement.version >= element.version) {
            return;
          }

          const newElement = (JSON.parse(
            JSON.stringify(element)
          ) as unknown) as ExcalidrawElement;

          yExcalidrawElement.set(element.id, newElement);
          cachedElements.set(element.id, element); // make sure we don't pass a ref to the same object or the version check won't work
        });
      }, local);
    },
    []
  );

  /**
   * Callback to update user's (self) presence
   */
  const onChangePresence = useCallback((payload: PointerUpdate) => {
    room.current?.updatePresence(payload);
  }, []);

  /**
   * Update app users whenever there is a change in the room users
   */
  useEffect(() => {
    if (!app) return;

    room.current = new Room(provider.current.awareness, {
      id: doc.current?.clientID,
      username: doc.current?.clientID //doc.current?.clientID
    });

    const unsubOthers = room.current.subscribe("others", (users) => {
      const collaborators = users
        .filter((user) => user.presence)
        .filter((user) => user.id !== doc.current?.clientID)
        .map((user) => [
          "" + user.id,
          ({
            username: "" + user.presence.username,
            pointer: user.presence.pointer
          } as unknown) as Collaborator
        ]);

      if (collaborators.length === 0) {
        app.updateScene({ collaborators: new Map() });
        return;
      }

      app.updateScene({
        collaborators: new Map(collaborators as any) as Map<
          string,
          Collaborator
        >
      });
    });

    return () => {
      unsubOthers();
    };
  }, [app]);

  useEffect(() => {
    if (!app) return;

    function handleDisconnect() {
      provider.current?.disconnect();
    }

    window.addEventListener("beforeunload", handleDisconnect);

    const handler = {
      get(target: any, prop: any, receiver: any): any {
        const value = target.get(prop);
        if (value === null || value === undefined) {
          return value;
        }
        if (typeof value === "object") {
          return new Proxy(value, handler);
        }
        return value;
      }
    };

    // throttling this causes choppyness when interacting with shapes
    function updateScene() {
      app?.updateScene({ elements: Array.from(cachedElements.values()) });
    }

    function addFiles() {
      app?.addFiles(Array.from(yBinaryFileData.values()));
    }

    function handleFileChanges(
      yEvent: Y.YMapEvent<BinaryFiles>,
      transaction: Transaction
    ) {
      if (transaction?.origin !== local) {
        addFiles();
      }
    }

    function handleChanges(
      yEvent: Y.YMapEvent<ExcalidrawElement>,
      transaction: Transaction
    ) {
      // required to not freeze the element
      if (transaction?.origin !== local) {
        const keys = yEvent.keysChanged as Set<string>;
        keys?.forEach((key) => {
          const currentTarget = yEvent?.currentTarget as Y.Map<
            ExcalidrawElement
          >;
          // only update changed elements rather than going through all the elements
          cachedElements?.set(
            key,
            JSON.parse(JSON.stringify(currentTarget.get(key)))
          );
        });

        updateScene();
      }
    }

    async function setup() {
      yExcalidrawElement.observe(handleChanges);
      yBinaryFileData.observe(handleFileChanges);
      addFiles(); // is this actually needed?

      yExcalidrawElement.forEach((elm) => {
        cachedElements.set(elm.id, JSON.parse(JSON.stringify(elm)));
      });
      updateScene();
      setLoading(false);
    }

    setup();

    return () => {
      window.removeEventListener("beforeunload", handleDisconnect);
      room.current?.destroy();
      yExcalidrawElement.unobserve(handleChanges);
      yBinaryFileData.unobserve(handleFileChanges);
    };
  }, [app]);

  return {
    onMount,
    onChange,
    // onUndo,
    // onRedo,
    loading,
    onChangePresence
  };
}
