interface IPCPayload {
  channel: string,
  topic: string,
  data: any,
}

type ExtensionDomain = "background" | "content" | "injected"
type EventSender = (payload: IPCPayload) => void;
type EventReceiver = (payload: IPCPayload) => Promise<any>;

export class IPC {
  private eventReceiver: { [key: string]: EventReceiver }
  private sender: EventSender;

  constructor(
    public name: string,
    public domain: ExtensionDomain
  ) {
    this.eventReceiver = {};
    this.sender = this.setupSender();
  }

  public setContext({
    name,
    domain
  }: {
    name: string,
    domain: ExtensionDomain
  }) {
    this.name = name;
    this.domain = domain;

    this.sender = this.setupSender();
  }

  public on(topic: string, cb: EventReceiver) {
    this.eventReceiver[topic] = cb;
  }

  public send(topic: string, data: any) {
    console.log(`[${this.domain}] send topic: ${topic}`)
    this.sender({
      topic,
      data,
      channel: this.name
    });
  }

  public setup() {
    switch (this.domain) {
      case "background": {
        this.setupBackground();
      }
        break;
      case "content": {
        this.setupProxy();
      }
        break;
      case "injected": {
        this.setupInjected();
      }
        break;
      default:
        return;
    }
  }

  private setupSender(): EventSender {
    console.log(`[IPC] setupSender`);
    switch (this.domain) {
      case "injected": {
        return (payload) => {
          console.log(`[Inject] send message: ${JSON.stringify(payload)}`)
          window.postMessage(payload, "*")
        }
      }
      case "background": {
        return (payload) => {
          chrome.tabs.query({ currentWindow: true, active: true }, async (tabs) => {
            chrome.tabs.sendMessage((tabs[0] as any).id, payload, async (res) => { });
          });
        }
      }
      default: {
        return (_payload) => { }
      }
    }
  }

  private setupInjected() {
    console.log("TO BE IMPLEMENTED");
  }


  private setupProxy() {
    window.addEventListener(
      "message",
      (ev) => {
        if (ev.data.channel === this.name) {
          console.log('[IPC.Proxy] Received: ', JSON.stringify(ev.data));

          chrome.runtime.sendMessage(ev.data, function (response) {
            console.log('[IPC.Proxy] Received Response: ', JSON.stringify(response));
          });
        }
      },
      true
    );
  }

  private setupBackground() {
    chrome.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
      console.log('[IPC.Background] Received: ', JSON.stringify(message));
      if (this.eventReceiver[message.topic]) {
        const result = await this.eventReceiver[message.topic]({
          channel: this.name,
          topic: message.topic,
          data: message.data,
        });

        if (result !== undefined) {
          sendResponse({ result });
        }
      }
    });
  }
}