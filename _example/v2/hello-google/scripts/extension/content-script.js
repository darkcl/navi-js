console.log("Injected Script");
initMessage();

// Setup Proxy
window.ipc.setupProxy();

const ipcScript = document.createElement("script");
ipcScript.text = `(${initMessage.toString()})();`;
document.documentElement.appendChild(ipcScript);

const handlerScript = document.createElement("script");
handlerScript.text = `(${injected.toString()})();`;
document.documentElement.appendChild(handlerScript);