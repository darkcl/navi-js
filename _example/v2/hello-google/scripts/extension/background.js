const init = () => {
  console.log("[Background] Init background script");

  window.ipc.setContext({
    name: "hello-google",
    domain: "background"
  })

  window.ipc.on('button_clicked', () => {
    console.log("[Background] Button Clicked");
    return {
      foo: "bazz"
    }
  });

  window.ipc.setup();

  window.messageToInjected = () => {
    setTimeout(() => {
      window.ipc.send("hello", {
        message: "hello"
      });
    }, 3000);
  }
}

window.onload = init;

