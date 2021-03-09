const injected = () => {
  waitFor = (variable, callback) => {
    const interval = setInterval(function () {
      if (window[variable]) {
        console.log(`[Inject] ${variable} loaded`);
        clearInterval(interval);
        callback();
      }
    }, 200);
  }

  waitFor('ipc', () => {
    window.ipc.setContext({ name: "hello-google", domain: "injected" });
    window.greeter = () => {
      console.log("[Google] Hello Google");
    }

    const floatingContainer = document.createElement("div");
    floatingContainer.className = "navi-container";
    document.documentElement.appendChild(floatingContainer);

    const floatingButton = document.createElement("button");
    floatingButton.innerHTML = "Test";
    floatingButton.onclick = function () {
      console.log("Click the button");

      window.ipc.send("button_clicked", {
        foo: "bar"
      });
    };
    floatingContainer.appendChild(floatingButton);
  });
}