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

    window.ipc.on("hello", (ev) => {
      console.log("[Injected] Hello is triggered");
      console.log(ev.data);
      floatingButton.innerHTML = ev.data.message;
    });

    window.ipc.setup();
  });
};
