import { getCurrentTab } from "../utils";
import IPC from "./base";

import type { IPCProps } from "./base";
import type { EventSender, IPCPayload } from "./types";

export default class BackgroundIpc extends IPC {
  constructor(...props: IPCProps) {
    super(...props);
  }

  public setup() {
    chrome.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
      const { channel, destination = "*", topic } = message as IPCPayload;
      if (channel === this.name && (destination === "*" || destination === "background")) {
        const cb = this.eventReceiverMap.get(topic);
        if (cb) {
          const result = await cb(message);
          if (result !== undefined) {
            sendResponse({ result });
          }
        }
      }
    });
  }

  /**
   * background will always send message to the proxy in content script
   */
  protected setupSender(): EventSender {
    return async (payload) => {
      const tab = await getCurrentTab();
      chrome.tabs.sendMessage(tab.id!, payload);
    };
  }
}
