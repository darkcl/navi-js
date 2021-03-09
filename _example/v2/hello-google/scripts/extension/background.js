const init = () => {
  console.log("[Background] Init background script");

  initMessage();

  window.ipc.onInjectEvent('button_clicked', () => {
    console.log("[Background] Button Clicked");
  });


  window.ipc.setupBackground();
}

window.onload = init;