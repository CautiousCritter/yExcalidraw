import { Excalidraw, Sidebar } from "@excalidraw/excalidraw";
import {
  ExcalidrawAPIRefValue,
  Gesture
} from "@excalidraw/excalidraw/types/types";
import { useCallback, useRef } from "react";
import { useMultiplayerState } from "../hooks/useMultiplayerState";
import Dice from "../Dice/Dice";
import useDiceHistoryWatcher from "../Dice/useDiceHistoryWatcher";

export type PointerUpdate = {
  pointer: {
    x: number;
    y: number;
  };
  button: "down" | "up";
  pointersMap: Gesture["pointers"];
};

export default function Whiteboard() {
  const { onMount, onChange, onChangePresence } = useMultiplayerState();
  const excalidrawAPI = useRef<ExcalidrawAPIRefValue>();

  const renderSidebar = () => {
    return (
      <Sidebar dockable={true}>
        <Sidebar.Header>🎲 Dice roller</Sidebar.Header>
        <Dice />
      </Sidebar>
    );
  };

  const excalidrawRef = useCallback(
    (node: ExcalidrawAPIRefValue) => {
      node?.readyPromise?.then((api) => {
        onMount(api);
      });
      excalidrawAPI.current = node;
    },
    [onMount]
  );

  const renderTopRightUI = useCallback(
    () => (
      <button
        className="dice-button"
        onClick={() => excalidrawAPI.current?.toggleMenu("customSidebar")}
      >
        🎲
      </button>
    ),
    []
  );

  function onPointerUpdate(payload: PointerUpdate) {
    onChangePresence(payload);
  }

  const onRoll = useCallback((roll: any) => {
    excalidrawAPI.current.setToast({
      message: `${roll.total} : ${roll.notation}`,
      closable: true
    });
  }, []);

  useDiceHistoryWatcher(onRoll);

  /// https://www.npmjs.com/package/@excalidraw/excalidraw
  return (
    <Excalidraw
      UIOptions={{ welcomeScreen: false }}
      onChange={onChange}
      ref={excalidrawRef}
      renderSidebar={renderSidebar}
      renderTopRightUI={renderTopRightUI}
      onPointerUpdate={onPointerUpdate}
    />
  );
}
