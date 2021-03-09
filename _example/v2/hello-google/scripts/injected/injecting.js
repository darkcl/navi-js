

const injected = () => {
  window.greeter = () => {
    console.log("[Google] Hello Google");
  }

  window.ipc.injectedSender = (data) => {
    window.postMessage(
      data,
      "*"
    );
  }


  const floatingContainer = document.createElement("div");
  floatingContainer.className = "navi-container";
  document.documentElement.appendChild(floatingContainer);

  const floatingButton = document.createElement("button");
  floatingButton.innerHTML = "Test";
  floatingButton.onclick = function () {
    console.log("Click the button");

    window.ipc.injectedSend("button_clicked", {
      foo: "bar"
    });
  };
  floatingContainer.appendChild(floatingButton);
}