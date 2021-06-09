# Navi.js

Messaging in chrome extension sucks, just like navi

This library only manage messages between `injected-script`, `content-script` and `background-script`

## API

### navi-js module

#### `create`

```
create(name, domain)
```

| parameter | description                                            |
| --------- | ------------------------------------------------------ |
| `name`    | unique name of IPC, message will be filtered by `name` |
| `domain`  | `background`, `content` or `injected`                  |

umd

```html
<script src="https://unpkg.com/navi-chrome-js@1.1.0/dist/umd/navi.js"></script>
<script>
  window.ipc = window.NaviIPC.create("hello-google", "injected");
</script>
```

es module

```js
const NaviIPC = await import("https://unpkg.com/navi-chrome-js@1.1.0/dist/es/navi.js");
window.ipc = NaviIPC.create("hello-google", "content");
```

npm

```js
import { create } from "navi-chrome-js";
window.ipc = NaviIPC.create("hello-google", "background");
```

---

### IPC object

```typescript
type ExtensionDomain = "background" | "content" | "injected";
type SetContextParms = { name: string; domain: ExtensionDomain };
type EventReceiver<T = unknown> = (payload: IPCPayload<T>) => void | Promise<void>;

class IPC {
  public name: string;
  public domain: ExtensionDomain;

  // you can change context of the ipc anytime
  public setContext({ name, domain }: SetContextParms): void;

  // message listener
  public on(topic: string, cb: EventReceiver): void;

  // send message
  public send(topic: string, data: any, destination: ExtensionDomain | "*" = "*"): void;

  // tell the ipc to get ready to receive message
  public setup(): void;
}
```

#### Caveat

- In message listener, it is a 1-to-1 relationship between topic and callback.

---

## Examples

### Background

```html
<script src="./scripts/extension/background.js"></script>
<script src="https://unpkg.com/navi-chrome-js@1.1.0/dist/umd/navi.js"></script>
```

```js
const init = () => {
  console.log("[Background] Init background script");

  window.ipc = window.NaviIPC.create("hello-google", "background");

  window.ipc.on("button_clicked", () => {
    console.log("[Background] Button Clicked");
    return {
      foo: "bazz",
    };
  });

  window.ipc.setup();

  // Example to send message to injected script
  window.messageToInjected = () => {
    setTimeout(() => {
      window.ipc.send("hello", {
        message: "hello",
      });
    }, 3000);
  };
};

window.onload = init;
```

### Content Script

```js
// This will load navi in content script
const NaviIPC = await import("https://unpkg.com/navi-chrome-js@1.1.0/dist/es/navi.js");
window.ipc = NaviIPC.create("hello-google", "content");

// Injecting into webpage
const ipcScript = document.createElement("script");
ipcScript.src = "https://unpkg.com/navi-chrome-js@1.1.0/dist/umd/navi.js";
document.documentElement.appendChild(ipcScript);

// Your injected script
const handlerScript = document.createElement("script");
handlerScript.text = `(${injected.toString()})();`;
document.documentElement.appendChild(handlerScript);

// eavesdrop message, if background script send a broadcast message
window.ipc.on("hello", (ev) => {
  console.log("[Content] eavesdrop message");
  console.log("from content", ev.data);
});
```

### Injected Script

```js
const injected = () => {
  waitFor = (variable, callback) => {
    const interval = setInterval(function () {
      if (window[variable]) {
        console.log(`[Inject] ${variable} loaded`);
        clearInterval(interval);
        callback();
      }
    }, 200);
  };

  waitFor("NaviIPC", () => {
    window.ipc = window.NaviIPC.create("hello-google", "injected");

    const floatingContainer = document.createElement("div");
    floatingContainer.className = "navi-container";
    document.documentElement.appendChild(floatingContainer);

    const floatingButton = document.createElement("button");
    floatingButton.innerHTML = "Test";
    floatingButton.onclick = function () {
      console.log("Click the button");

      window.ipc.send("button_clicked", {
        foo: "bar",
      });
    };
    floatingContainer.appendChild(floatingButton);

    // Example on background sending message
    window.ipc.on("hello", (ev) => {
      console.log("[Injected] Hello is triggered");
      console.log(ev.data);
      floatingButton.innerHTML = ev.data.message;
    });

    window.ipc.setup();
  });
};
```
