/**
 *
 * background <-> content <-> injected
 *
 */
import type { ExtensionDomain, EventReceiver, EventSender } from "./types";

type SetContextParms = { name: string; domain: ExtensionDomain };
export type IPCProps = [string, ExtensionDomain];

export default class IPC {
  protected eventReceiverMap: Map<string, EventReceiver>;
  protected sender: EventSender;

  constructor(public name: string, public domain: ExtensionDomain) {
    this.eventReceiverMap = new Map();
    this.sender = this.setupSender();

    this.setContext = this.setContext.bind(this);
    this.on = this.on.bind(this);
    this.send = this.send.bind(this);
    this.setup = this.setup.bind(this);
  }

  public setContext({ name, domain }: SetContextParms) {
    this.name = name;
    this.domain = domain;

    this.sender = this.setupSender();
  }

  /**
   * Caveat:
   * - It is a 1-to-1 relationship between topic and callback
   */
  public on(topic: string, cb: EventReceiver) {
    this.eventReceiverMap.set(topic, cb);
  }

  public send(topic: string, data: any, destination: ExtensionDomain | "*" = "*") {
    this.sender({
      topic,
      data,
      destination,
      channel: this.name,
    });
  }

  // override the method in the child classes
  public setup() {}

  // override the method in the child classes
  protected setupSender(): EventSender {
    return (_payload) => {};
  }
}
