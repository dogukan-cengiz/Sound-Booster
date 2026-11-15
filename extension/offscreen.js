let sharedCtx = null;
const tabChains = new Map();

function getCtx() {
  if (!sharedCtx) sharedCtx = new AudioContext();
  return sharedCtx;
}

function updateChain(chain, s) {
  if (!chain || !s) return;
  const now = chain.ctx.currentTime;
  if (s.volume   !== undefined) chain.volume.gain.setTargetAtTime(s.volume / 100, now, 0.02);
  if (s.bass     !== undefined) chain.bass.gain.setTargetAtTime((s.bass / 100) * 15, now, 0.02);
  if (s.treble   !== undefined) chain.treble.gain.setTargetAtTime((s.treble / 100) * 15, now, 0.02);
  if (s.balance  !== undefined) chain.panner.pan.setTargetAtTime((s.balance - 50) / 50, now, 0.02);
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    if (msg.type === "OFFSCREEN_START") {
      try {
        const { tabId, streamId, settings } = msg;
        let chain = tabChains.get(tabId);

        if (!chain) {
          const ctx = getCtx();
          await ctx.resume();

          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              mandatory: { chromeMediaSource: "tab", chromeMediaSourceId: streamId }
            }
          });

          const source  = ctx.createMediaStreamSource(stream);
          const volume  = ctx.createGain();
          const bass    = ctx.createBiquadFilter(); bass.type = "lowshelf"; bass.frequency.value = 200;
          const treble  = ctx.createBiquadFilter(); treble.type = "highshelf"; treble.frequency.value = 3000;
          const panner  = ctx.createStereoPanner();
          const limiter = ctx.createDynamicsCompressor();
          limiter.threshold.value = -6; limiter.knee.value = 6; limiter.ratio.value = 20;
          limiter.attack.value = 0.002; limiter.release.value = 0.1;

          source.connect(volume); volume.connect(bass); bass.connect(treble);
          treble.connect(panner); panner.connect(limiter); limiter.connect(ctx.destination);

          chain = { ctx, stream, source, volume, bass, treble, panner, limiter };
          tabChains.set(tabId, chain);
        }

        updateChain(chain, settings);
        sendResponse({ ok: true });
      } catch (err) {
        sendResponse({ ok: false, error: err.message });
      }
      return;
    }

    if (msg.type === "OFFSCREEN_SET") {
      updateChain(tabChains.get(msg.tabId), msg.settings);
      sendResponse({ ok: true });
      return;
    }

    if (msg.type === "OFFSCREEN_STOP") {
      const chain = tabChains.get(msg.tabId);
      if (chain) {
        ["source","volume","bass","treble","panner","limiter"].forEach(k => {
          try { chain[k].disconnect(); } catch (e) {}
        });
        chain.stream.getTracks().forEach(t => t.stop());
        tabChains.delete(msg.tabId);
      }
      sendResponse({ ok: true });
      return;
    }
  })();
  return true;
});