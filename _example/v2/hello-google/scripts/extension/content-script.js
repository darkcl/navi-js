console.log("Injected Script");

fetch("https://unpkg.com/navi-chrome-js@1.0.0/dist/navi.min.js")
  .then((res) => {
    return res.text()
  })
  .then((script) => {
    eval(script);
    window.ipc.setContext({ name: "hello-google", domain: "content" });

    console.log("[Content] IPC", window.ipc);

    // Setup Proxy
    window.ipc.setup();

    const ipcScript = document.createElement("script");
    ipcScript.src = "https://unpkg.com/navi-chrome-js@1.0.0/dist/navi.min.js";
    document.documentElement.appendChild(ipcScript);

    const handlerScript = document.createElement("script");
    handlerScript.text = `(${injected.toString()})();`;
    document.documentElement.appendChild(handlerScript);
  });