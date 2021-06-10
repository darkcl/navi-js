import { BackgroundIpc, InjectedIpc, ContentScriptIpc } from "./ipc/mod";
import InvalidInputError from "./errors/InvalidInputError";

import type { IPCProps } from "./ipc/base";
import type * as IPCTypes from "./ipc/types";

export type IPCPayload = IPCTypes.IPCPayload;
export type ExtensionDomain = IPCTypes.ExtensionDomain;

export function create(...[channel, domain]: IPCProps) {
  switch (domain) {
    case "background":
      return new BackgroundIpc(channel, domain);
    case "content":
      return new ContentScriptIpc(channel, domain);
    case "injected":
      return new InjectedIpc(channel, domain);
    default:
      throw new InvalidInputError(
        `incorrect "domain", only accept "background", "injected", "content"`
      );
  }
}
