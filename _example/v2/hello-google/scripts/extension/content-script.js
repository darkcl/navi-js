console.log("Injected Script");

(async () => {
  const NaviIPC = await import("https://unpkg.com/navi-chrome-js@1.1.0/dist/es/navi.js");
  window.ipc = NaviIPC.create("hello-google", "content");

  console.log("[Content] IPC", window.ipc);

  // Setup Proxy
  window.ipc.setup();

  const ipcScript = document.createElement("script");
  ipcScript.src = "https://unpkg.com/navi-chrome-js@1.1.0/dist/umd/navi.js";
  document.documentElement.appendChild(ipcScript);

  const handlerScript = document.createElement("script");
  handlerScript.text = `(${injected.toString()})();`;
  document.documentElement.appendChild(handlerScript);

  // intercept message, if background script send a broadcast message
  window.ipc.on("hello", (ev) => {
    console.log("[Content] intercept message");
    console.log("from content", ev.data);
  });
})();
