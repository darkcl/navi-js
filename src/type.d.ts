import ipc, { IPC } from "./IPC";

declare global {
  interface Window {
    ipc: IPC;
  }
}

declare var ipc: IPC;

export default ipc;
export { IPCPayload, ExtensionDomain, EventReceiver, EventSender } from "./IPC";
