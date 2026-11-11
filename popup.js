const PRESETS = {
  flat:  { volume: 100, bass: 0,  treble: 0,  balance: 50 },
  music: { volume: 200, bass: 50, treble: 40, balance: 50 },
  movie: { volume: 300, bass: 60, treble: 30, balance: 50 },
  voice: { volume: 400, bass: 10, treble: 60, balance: 50 },
  game:  { volume: 250, bass: 40, treble: 35, balance: 50 }
};

const state = {
  tabId: null,
  settings: { volume: 100, bass: 0, treble: 0, balance: 50 },
  active: false,
  activePreset: null,
  theme: "light",
  lang: "en"
};

const t = (k) => (TRANSLATIONS[state.lang] || TRANSLATIONS.en)[k] || k;

const els = {
  appName: document.getElementById("appName"),
  masterToggle: document.getElementById("masterToggle"),
  masterCard: document.getElementById("masterCard"),
  volSlider: document.getElementById("volSlider"),
  volVal: document.getElementById("volVal"),
  bassSlider: document.getElementById("bassSlider"),
  bassVal: document.getElementById("bassVal"),
  trebleSlider: document.getElementById("trebleSlider"),
  trebleVal: document.getElementById("trebleVal"),
  balSlider: document.getElementById("balSlider"),
  balVal: document.getElementById("balVal"),
  resetBtn: document.getElementById("resetBtn"),
  langSelect: document.getElementById("langSelect"),
  themeToggle: document.getElementById("themeToggle"),
  authorLink: document.getElementById("authorLink"),
  chips: document.querySelectorAll(".chip"),
  tabInfo: document.getElementById("tabInfo"),
  tabFavicon: document.getElementById("tabFavicon"),
  tabTitle: document.getElementById("tabTitle")
};

function send(msg) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(msg, (resp) => {
      if (chrome.runtime.lastError) resolve({ ok: false, error: chrome.runtime.lastError.message });
      else resolve(resp || { ok: true });
    });
  });
}

function applyLanguage() {
  document.documentElement.lang = state.lang;
  document.body.setAttribute("dir", state.lang === "ar" ? "rtl" : "ltr");
  els.appName.textContent = t("appName");
  document.title = t("appName");
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  updateBalanceLabel();
}

function updateBalanceLabel() {
  const b = state.settings.balance;
  if (b === 50) els.balVal.textContent = t("center").slice(0, 1).toUpperCase();
  else if (b < 50) els.balVal.textContent = `L${100 - b}`;
  else els.balVal.textContent = `R${b}`;
}

function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
  els.themeToggle.textContent = state.theme === "dark" ? "☀" : "☾";
}

function buildLanguageSelector() {
  Object.entries(LANGUAGE_NAMES).forEach(([code, name]) => {
    const opt = document.createElement("option");
    opt.value = code;
    opt.textContent = name;
    els.langSelect.appendChild(opt);
  });
}

function setFill(slider) {
  const min = Number(slider.min), max = Number(slider.max);
  const pct = ((Number(slider.value) - min) / (max - min)) * 100;
  slider.style.setProperty("--fill", `${pct}%`);
}

function syncSliders() {
  els.volSlider.value = state.settings.volume;
  els.volVal.textContent = state.settings.volume;

  els.bassSlider.value = state.settings.bass;
  els.bassVal.textContent = state.settings.bass + "%";

  els.trebleSlider.value = state.settings.treble;
  els.trebleVal.textContent = state.settings.treble + "%";

  els.balSlider.value = state.settings.balance;
  updateBalanceLabel();

  [els.volSlider, els.bassSlider, els.trebleSlider, els.balSlider].forEach(setFill);
}

function syncMasterUI() {
  els.masterToggle.checked = state.active;
  els.masterCard.classList.toggle("on", state.active);
}

function syncPresets() {
  els.chips.forEach(c => c.classList.toggle("active", c.dataset.preset === state.activePreset));
}

async function persistTab() {
  await send({ type: "SET_SETTINGS", tabId: state.tabId, settings: state.settings });
}
async function persistGlobal() {
  await chrome.storage.local.set({ theme: state.theme, lang: state.lang });
}

function attachSlider(slider, key, valueEl) {
  slider.addEventListener("input", () => {
    state.settings[key] = Number(slider.value);
    if (key === "balance") updateBalanceLabel();
    else valueEl.textContent = (key === "volume" ? slider.value : slider.value + "%");
    setFill(slider);
    state.activePreset = null;
    syncPresets();
    persistTab();
  });
}
attachSlider(els.volSlider, "volume", els.volVal);
attachSlider(els.bassSlider, "bass", els.bassVal);
attachSlider(els.trebleSlider, "treble", els.trebleVal);
attachSlider(els.balSlider, "balance", null);

els.masterToggle.addEventListener("change", async () => {
  if (els.masterToggle.checked) {
    els.masterToggle.disabled = true;
    try {
      const streamId = await chrome.tabCapture.getMediaStreamId({ targetTabId: state.tabId });
      const res = await send({
        type: "START_CAPTURE",
        tabId: state.tabId,
        streamId,
        settings: state.settings
      });
      state.active = !!res.ok;
      if (!res.ok) els.masterToggle.checked = false;
    } catch (e) {
      els.masterToggle.checked = false;
    }
    els.masterToggle.disabled = false;
  } else {
    await send({ type: "STOP_CAPTURE", tabId: state.tabId });
    state.active = false;
  }
  syncMasterUI();
});

els.chips.forEach(chip => {
  chip.addEventListener("click", async () => {
    const key = chip.dataset.preset;
    const preset = PRESETS[key];
    if (!preset) return;
    state.settings = { ...preset };
    state.activePreset = key;
    syncSliders();
    syncPresets();
    await persistTab();
  });
});

els.resetBtn.addEventListener("click", async () => {
  if (state.active) {
    await send({ type: "STOP_CAPTURE", tabId: state.tabId });
    state.active = false;
  }
  state.settings = { volume: 100, bass: 0, treble: 0, balance: 50 };
  state.activePreset = null;
  syncSliders();
  syncMasterUI();
  syncPresets();
  await persistTab();
});

els.themeToggle.addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  applyTheme();
  persistGlobal();
});

els.langSelect.addEventListener("change", () => {
  state.lang = els.langSelect.value;
  applyLanguage();
  persistGlobal();
});

els.authorLink.addEventListener("click", (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: "https://www.dogukancengiz.com" });
});

(async function init() {
  buildLanguageSelector();

  const prefs = await chrome.storage.local.get(["theme", "lang"]);
  state.theme = prefs.theme || "light";
  state.lang = prefs.lang || "en";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  state.tabId = tab?.id ?? null;

  if (state.tabId) {
    const resp = await send({ type: "POPUP_INIT", tabId: state.tabId });
    if (resp?.settings) state.settings = resp.settings;
    if (resp?.active) state.active = !!resp.active;
  }

  if (tab?.audible && tab?.title) {
    els.tabInfo.classList.add("show");
    els.tabTitle.textContent = tab.title;
    if (tab.favIconUrl) {
      els.tabFavicon.src = tab.favIconUrl;
    } else {
      els.tabFavicon.style.display = "none";
    }
  }

  applyTheme();
  els.langSelect.value = state.lang;
  applyLanguage();
  syncSliders();
  syncMasterUI();
  syncPresets();
})();