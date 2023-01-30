import { createContext, MutableRefObject } from "react";
import * as Y from "yjs";

export const YDocContext = createContext(
  {} as {
    yDoc: MutableRefObject<Y.Doc | undefined>;
    provider: MutableRefObject<any>;
  }
);
