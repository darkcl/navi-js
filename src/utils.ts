/**
 * get current tab.
 */
export function getCurrentTab() {
  return new Promise<chrome.tabs.Tab>((resolve, reject) => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      resolve(tabs[0]);
    });
  });
}
