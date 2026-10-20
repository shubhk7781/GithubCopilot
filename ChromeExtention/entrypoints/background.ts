export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  // Open the side panel when the extension's toolbar icon is clicked.
  // `chrome.sidePanel` only exists in Chromium, so guard for Firefox.
  // (@types/chrome isn't installed in this project, so access it via a typed cast.)
  const chromeGlobal = globalThis as unknown as {
    chrome?: {
      sidePanel?: {
        setPanelBehavior: (options: { openPanelOnActionClick: boolean }) => Promise<void>;
      };
    };
  };
  chromeGlobal.chrome?.sidePanel?.setPanelBehavior({ openPanelOnActionClick: true });
});
