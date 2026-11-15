let offscreenPromise = null;

async function ensureOffscreen() {
  if (await chrome.offscreen.hasDocument()) return;
  if (offscreenPromise) return offscreenPromise;
  offscreenPromise = chrome.offscreen.createDocument({
    url: "offscreen.html",
    reasons: ["USER_MEDIA", "AUDIO_PLAYBACK"],
    justification: "Process tab audio with Web Audio API."
  });
  await offscreenPromise;
  offscreenPromise = null;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    if (msg.type === "POPUP_INIT") {
      const data = await chrome.storage.session.get([`active_${msg.tabId}`, `settings_${msg.tabId}`]);
      sendResponse({
        active: data[`active_${msg.tabId}`] === true,
        settings: data[`settings_${msg.tabId}`] || { volume: 100, bass: 0, treble: 0, balance: 50 }
      });
      return;
    }

    if (msg.type === "START_CAPTURE") {
      try {
        await ensureOffscreen();
        const res = await chrome.runtime.sendMessage({
          type: "OFFSCREEN_START",
          tabId: msg.tabId,
          streamId: msg.streamId,
          settings: msg.settings
        });
        if (res && res.ok === false) throw new Error(res.error || "Capture failed.");
        await chrome.storage.session.set({
          [`active_${msg.tabId}`]: true,
          [`settings_${msg.tabId}`]: msg.settings
        });
        sendResponse({ ok: true });
      } catch (err) {
        sendResponse({ ok: false, error: err.message });
      }
      return;
    }

    if (msg.type === "SET_SETTINGS") {
      await chrome.storage.session.set({ [`settings_${msg.tabId}`]: msg.settings });
      const data = await chrome.storage.session.get([`active_${msg.tabId}`]);
      if (data[`active_${msg.tabId}`]) {
        try {
          await chrome.runtime.sendMessage({
            type: "OFFSCREEN_SET",
            tabId: msg.tabId,
            settings: msg.settings
          });
        } catch (e) {}
      }
      sendResponse({ ok: true });
      return;
    }

    if (msg.type === "STOP_CAPTURE") {
      try {
        await chrome.runtime.sendMessage({ type: "OFFSCREEN_STOP", tabId: msg.tabId });
      } catch (e) {}
      await chrome.storage.session.remove([`active_${msg.tabId}`]);
      sendResponse({ ok: true });
      return;
    }
  })();
  return true;
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  try { await chrome.runtime.sendMessage({ type: "OFFSCREEN_STOP", tabId }); } catch (e) {}
  await chrome.storage.session.remove([`active_${tabId}`, `settings_${tabId}`]);
});