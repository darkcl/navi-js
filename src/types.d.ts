import { IPC } from "./ipc/base";

declare global {
  interface Window {
    ipc: IPC;
  }
}

declare var ipc: IPC;

export default ipc;
export { IPCPayload, ExtensionDomain, EventReceiver, EventSender } from "./ipc/types";
