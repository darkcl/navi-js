// library stuff

const initMessage = () => {
  class IPC {
    constructor(name) {
      this.name = name;
      this.backgroundEventReceiver = {};
      this.injectedEventReceiver = {};
    }

    set injectedSender(fn) {
      this.injectedSenderFn = fn;
    }

    set backgroundSender(fn) {
      this.backgroundSenderFn = fn;
    }

    injectedSend(topic, data) {
      this.injectedSenderFn({
        channel: this.name,
        topic,
        data
      });
    }

    backgroundSend(topic, data) {
      this.backgroundSenderFn({
        channel: this.name,
        topic,
        data
      });
    }

    onInjectEvent(topic, cb) {
      this.injectedEventReceiver[topic] = cb;
    }

    onBackgroundEvent(topic, cb) {
      this.backgroundEventReceiver[topic] = cb;
    }

    // Only require in content script
    setupProxy() {
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

    // Only for background script
    setupBackground() {
      chrome.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
        console.log('[IPC.Background] Received: ', JSON.stringify(message));
        if (this.injectedEventReceiver[message.topic]) {
          this.injectedEventReceiver[message.topic]();
        }

        sendResponse({ message: 'ok' });
      });
    }

    // Only for background script
    setupInjected() {
      chrome.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
        console.log('[IPC.Background] Received: ', JSON.stringify(message));
        sendResponse({ message: 'ok' });
      });
    }
  }

  // User script

  const ipc = new IPC("hello-google");

  window.ipc = ipc;
}

