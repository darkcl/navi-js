# Navi.js

Messaging in chrome extension sucks, just like navi

This library only manage messages between `injected-script`, `content-script` and `background-script`

## Setup

### Background

```html
<script src="./scripts/extension/background.js"></script>
<script src="https://unpkg.com/navi-chrome-js@1.1.0/dist/umd/navi.js"></script>
```

```js
const init = () => {
  console.log("[Background] Init background script");

  window.ipc.setContext({
    name: "hello-google",
    domain: "background",
  });

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
const res = await import("https://unpkg.com/navi-chrome-js@1.1.0/dist/es/navi.js");
window.ipc = res.default;
window.ipc.setContext({ name: "hello-google", domain: "content" });

// Injecting into webpage
const ipcScript = document.createElement("script");
ipcScript.src = "https://unpkg.com/navi-chrome-js@1.1.0/dist/umd/navi.js";
document.documentElement.appendChild(ipcScript);

// Your injected script
const handlerScript = document.createElement("script");
handlerScript.text = `(${injected.toString()})();`;
document.documentElement.appendChild(handlerScript);
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

  waitFor("ipc", () => {
    window.ipc.setContext({ name: "hello-google", domain: "injected" });

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
