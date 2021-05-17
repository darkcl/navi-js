import { IPC } from "./IPC";

declare global {
  interface Window {
    ipc: IPC;
  }
}

export interface IPCPayload<T = unknown> {
  channel: string;
  topic: string;
  data: T;
}

export type ExtensionDomain = "background" | "content" | "injected";
export type EventSender<T = unknown> = (payload: IPCPayload<T>) => void;
export type EventReceiver<T = unknown> = (
  payload: IPCPayload<T>
) => Promise<any>;
