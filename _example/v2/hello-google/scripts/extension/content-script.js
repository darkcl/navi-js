console.log("Injected Script");
window.ipc.setContext({ name: "hello-google", domain: "content" });

console.log("[Content] IPC", window.ipc);

// Setup Proxy
window.ipc.setup();

const ipcScript = document.createElement("script");
ipcScript.src = chrome.extension.getURL("scripts/vendor/navi.min.js");
document.documentElement.appendChild(ipcScript);

const handlerScript = document.createElement("script");
handlerScript.text = `(${injected.toString()})();`;
document.documentElement.appendChild(handlerScript);