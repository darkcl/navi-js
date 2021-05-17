export type IPCPayload<T = unknown> = {
  channel: string;
  topic: string;
  destination: ExtensionDomain | "*";
  data: T;
};

export type ExtensionDomain = "background" | "content" | "injected";
export type EventSender<T = unknown> = (payload: IPCPayload<T>) => void | Promise<void>;
export type EventReceiver<T = unknown> = (payload: IPCPayload<T>) => void | Promise<void>;
