import IPC from "./base";

import type { IPCProps } from "./base";
import type { EventSender, IPCPayload } from "./types";

export default class ContentScriptIpc extends IPC {
  constructor(...props: IPCProps) {
    super(...props);
  }

  public setup() {
    globalThis.addEventListener(
      "message",
      async (ev) => {
        const { channel, destination = "*", topic } = (ev.data as IPCPayload) ?? {};
        if (channel === this.name) {
          // send to background
          if (destination === "*" || destination === "background") {
            chrome.runtime.sendMessage(ev.data);
          }
          // trigger callbacks of content script
          if (destination === "*" || destination === "content") {
            const cb = this.eventReceiverMap.get(topic);
            if (cb) {
              await cb(ev.data);
            }
          }
        }
      },
      true
    );

    chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
      const { channel, destination = "*", topic } = msg as IPCPayload;
      if (channel === this.name) {
        // send to injected
        if (destination === "*" || destination === "injected") {
          globalThis.postMessage({ ...msg, destination: "injected" }, "*");
        }
        // trigger callbacks of content script
        if (destination === "*" || destination === "content") {
          const cb = this.eventReceiverMap.get(topic);
          if (cb) {
            await cb(msg);
          }
        }
      }
    });
  }

  protected setupSender(): EventSender {
    return (payload) => {
      switch (payload.destination) {
        case "background":
          chrome.runtime.sendMessage(payload);
          break;
        case "injected":
          globalThis.postMessage(payload, "*");
        default:
      }
    };
  }
}
