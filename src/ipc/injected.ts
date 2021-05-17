import IPC from "./base";

import type { IPCProps } from "./base";
import type { EventSender, IPCPayload } from "./types";

export default class InjectedIpc extends IPC {
  constructor(...props: IPCProps) {
    super(...props);
  }

  public setup() {
    globalThis.addEventListener("message", async (ev) => {
      const { channel, destination = "*", topic } = ev.data as IPCPayload;
      if (channel === this.name && (destination === "*" || destination === "background")) {
        const cb = this.eventReceiverMap.get(topic);
        if (cb) {
          await cb(ev.data);
        }
      }
    });
  }

  /**
   * injected script will always send message to the proxy in content script
   */
  protected setupSender(): EventSender {
    return async (payload) => {
      globalThis.postMessage(payload, "*");
    };
  }
}
