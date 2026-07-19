export interface PressEvent {
  nativeEvent?: unknown;
}

export type PressHandler = (event?: PressEvent) => void;
