export type rollResult = {
  averageTotal: number;
  maxTotal: number;
  minTotal: number;
  notation: string;
  output: string;
  rolls: any[];
  total: number;
};

type state = {
  notation: string;
};

export type diceDoc = {
  rolls: rollResult[];
  state: state;
};

export const initStore = {
  rolls: [] as rollResult[],
  state: {} as state
} as diceDoc;
