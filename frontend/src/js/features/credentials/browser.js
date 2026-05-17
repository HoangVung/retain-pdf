import { $ } from "../../dom.js";
import { API_PREFIX } from "../../constants.js";
import {
  getTranslationProviderDefinition,
  getOcrProviderDefinition,
  normalizeOcrProvider,
  normalizeTranslationProvider,
  TRANSLATION_PROVIDER_DEFINITION,
} from "../../provider-config.js";

export function mountBrowserCredentialsFeature({
  state,
  applyKeyInputs,
  defaultMineruToken,
  defaultPaddleToken,
  defaultAiOcrApiKey,
  defaultModelApiKey,
  defaultModelBaseUrl,
  getTaskOptions,
  saveTaskOptions,
  saveBrowserStoredConfig,
  saveDesktopConfig,
  checkApiConnectivity,
  validateOcrToken,
  validateDeepSeekToken,
  queryDeepSeekBalance,
  onCredentialStateChange,
}) {
  function credentialDialog() {
    return $("browser-credentials-dialog");
  }

  function currentCredentialDialogSetupMode() {
    return credentialDialog()?.dataset?.setupMode === "1";
  }

  function setCredentialDialogMode(setupMode = false) {
    const dialog = credentialDialog();
    if (!dialog) {
      return;
    }
    dialog.dataset.setupMode = setupMode ? "1" : "0";
    $("browser-credentials-title").textContent = setupMode ? "Cấu hình ban đầu" : "Cài đặt API";
    const subtitle = $("browser-credentials-subtitle");
    if (subtitle) {
      const text = setupMode
        ? "Điền OCR Token và DeepSeek Key, lưu sau khi kiểm tra thành công."
        : "";
      subtitle.textContent = text;
      subtitle.classList.toggle("hidden", !text);
    }
    $("browser-credentials-save-btn").textContent = setupMode ? "Lưu và khởi động" : "Lưu";
    $("browser-credentials-tabs")?.classList.toggle("hidden", setupMode);
    if (setupMode) {
      activateCredentialTab("api");
    }
  }

  function setDialogStatus(message = "", tone = "") {
    const el = $("browser-credentials-status");
    if (!el) {
      return;
    }
    const content = `${message || ""}`.trim();
    el.textContent = content;
    el.classList.toggle("hidden", !content);
    el.classList.toggle("is-valid", tone === "valid");
    el.classList.toggle("is-error", tone === "error");
  }

  function activateCredentialTab(tabName = "api") {
    const dialog = credentialDialog();
    if (!dialog) {
      return;
    }
    dialog.querySelectorAll("[data-credential-tab]").forEach((tab) => {
      const active = tab.dataset.credentialTab === tabName;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });
    dialog.querySelectorAll("[data-credential-panel]").forEach((panel) => {
      const active = panel.dataset.credentialPanel === tabName;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  }

  function currentOcrProvider() {
    return normalizeOcrProvider($("ocr_provider")?.value);
  }

  function currentTranslationProvider() {
    return normalizeTranslationProvider($("browser-translation-provider-select")?.value || getTaskOptions?.().translationProvider);
  }

  function syncOcrProviderControls(providerId = currentOcrProvider()) {
    const activeProvider = normalizeOcrProvider(providerId);
    const dialog = credentialDialog();
    if (!dialog) {
      return;
    }
    const apiSelect = $("browser-ocr-provider-select");
    if (apiSelect) {
      apiSelect.value = activeProvider;
    }
    dialog.querySelectorAll("[data-ocr-provider-panel]").forEach((panel) => {
      const active = panel.dataset.ocrProviderPanel === activeProvider;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  }

  function setOcrValidationMessage(message, tone = "", providerId = currentOcrProvider()) {
    const definition = getOcrProviderDefinition(providerId);
    const el = $(`browser-${definition.id}-validation`);
    if (!el) {
      return;
    }
    const content = `${message || ""}`.trim();
    el.textContent = content || definition.validationIdleMessage;
    el.classList.toggle("hidden", !content);
    el.classList.toggle("is-valid", tone === "valid");
    el.classList.toggle("is-error", tone === "error");
  }

  function setDeepSeekValidationMessage(message, tone = "") {
    const el = $("browser-deepseek-validation");
    if (!el) {
      return;
    }
    const content = `${message || ""}`.trim();
    el.textContent = content || TRANSLATION_PROVIDER_DEFINITION.validationIdleMessage;
    el.classList.toggle("hidden", !content);
    el.classList.toggle("is-valid", tone === "valid");
    el.classList.toggle("is-error", tone === "error");
  }

  function setDeepSeekAccountStatus(summary = "", tone = "", checkedAt = "") {
    const box = $("browser-deepseek-account-status");
    const summaryEl = $("browser-deepseek-account-summary");
    const timeEl = $("browser-deepseek-account-time");
    const content = `${summary || ""}`.trim();
    if (!box || !summaryEl || !timeEl) {
      return;
    }
    box.classList.toggle("hidden", !content);
    box.classList.toggle("is-valid", tone === "valid");
    box.classList.toggle("is-error", tone === "error");
    summaryEl.textContent = content || "Chưa kiểm tra";
    timeEl.textContent = checkedAt ? `Thời gian kiểm tra ${checkedAt}` : "-";
  }

  function currentTimeLabel() {
    return new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }

  function resetOcrValidationCache() {
    state.validatedOcrProvider = "";
    state.validatedOcrToken = "";
    state.ocrValidationStatus = "";
  }

  async function runOcrTokenValidation(providerId, token, { showResult = true } = {}) {
    const definition = getOcrProviderDefinition(providerId);
    const normalizedToken = `${token || ""}`.trim();
    if (!normalizedToken) {
      resetOcrValidationCache();
      if (showResult) {
        setOcrValidationMessage(definition.validationMissingMessage, "error", definition.id);
      }
      return { ok: false, status: "unauthorized" };
    }
    if (!definition.supportsValidation) {
      state.validatedOcrProvider = definition.id;
      state.validatedOcrToken = normalizedToken;
      state.ocrValidationStatus = "skipped";
      if (showResult) {
        setOcrValidationMessage(definition.validationUnavailableMessage, "", definition.id);
      }
      return {
        ok: true,
        status: "skipped",
        summary: definition.validationUnavailableMessage,
      };
    }
    if (showResult) {
      setOcrValidationMessage(`Đang kiểm tra ${definition.label} Token…`, "", definition.id);
    }
    try {
      const result = await validateOcrToken(API_PREFIX, definition.id, normalizedToken);
      state.validatedOcrProvider = definition.id;
      state.validatedOcrToken = normalizedToken;
      state.ocrValidationStatus = result.status || "";
      if (showResult) {
        const hint = result.operator_hint ? ` ${result.operator_hint}` : "";
        const message = result.summary || `${definition.label} Kết quả kiểm tra Token：${result.status || "unknown"}`;
        setOcrValidationMessage(`${message}${hint}`.trim(), result.ok ? "valid" : "error", definition.id);
      }
      return result;
    } catch (_err) {
      resetOcrValidationCache();
      if (showResult) {
        setOcrValidationMessage(`${definition.label} Kiểm tra Token thất bại, vui lòng thử lại sau.`, "error", definition.id);
      }
      return {
        ok: false,
        status: "network_error",
        summary: `${definition.label} Kiểm tra Token thất bại, vui lòng thử lại sau.`,
      };
    }
  }

  async function runDeepSeekConnectivityCheck(apiKey, { showResult = true } = {}) {
    const modelApiKey = `${apiKey || ""}`.trim();
    if (!modelApiKey) {
      if (showResult) {
        setDeepSeekValidationMessage(TRANSLATION_PROVIDER_DEFINITION.validationMissingMessage, "error");
      }
      return { ok: false, status: 0 };
    }
    if (showResult) {
      setDeepSeekValidationMessage("Đang kiểm tra API DeepSeek…");
    }
    try {
      const result = await validateDeepSeekToken(API_PREFIX, {
        api_key: modelApiKey,
        base_url: getTranslationProviderDefinition(currentTranslationProvider()).baseUrl || defaultModelBaseUrl(),
      });
      if (showResult) {
        setDeepSeekValidationMessage(
          result.summary || (result.ok
            ? TRANSLATION_PROVIDER_DEFINITION.validationSuccessMessage
            : TRANSLATION_PROVIDER_DEFINITION.validationNetworkMessage),
          result.ok ? "valid" : "error",
        );
      }
      return result;
    } catch (_err) {
      if (showResult) {
        setDeepSeekValidationMessage(TRANSLATION_PROVIDER_DEFINITION.validationNetworkMessage, "error");
      }
      return { ok: false, status: 0 };
    }
  }

  function summarizeDeepSeekBalance(result) {
    const infos = Array.isArray(result?.balance_infos) ? result.balance_infos : [];
    const parts = infos
      .filter((item) => item && item.currency && item.total_balance)
      .map((item) => `${item.currency} ${item.total_balance}`);
    if (parts.length > 0) {
      return `Số dư ${parts.join("，")}`;
    }
    if (result?.is_available) {
      return "Số dư khả dụng";
    }
    return "Số dư không đủ";
  }

  async function runDeepSeekBalanceCheck(apiKey) {
    if (currentTranslationProvider() !== "deepseek") {
      return { ok: false, status: "unsupported_provider" };
    }
    const modelApiKey = `${apiKey || ""}`.trim();
    if (!modelApiKey) {
      return { ok: false, status: "missing_key" };
    }
    if (!queryDeepSeekBalance) {
      return { ok: false, status: "unsupported" };
    }
    try {
      return await queryDeepSeekBalance(API_PREFIX, {
        api_key: modelApiKey,
        base_url: getTranslationProviderDefinition("deepseek").baseUrl || defaultModelBaseUrl(),
      });
    } catch (_err) {
      return { ok: false, status: "network_error" };
    }
  }

  function browserCredentialElements() {
    return {
      dialog: $("browser-credentials-dialog"),
      mineruInput: $("browser-mineru-token"),
      paddleInput: $("browser-paddle-token"),
      aiOcrInput: $(`browser-${currentOcrProvider()}-token`),
      apiKeyInput: $("browser-api-key"),
      mathModeSelect: $("browser-job-math-mode"),
      translationProviderSelect: $("browser-translation-provider-select"),
      targetLanguageSelect: $("browser-job-target-language"),
      trigger: $("credentials-btn"),
    };
  }

  function syncBrowserDialogFromHiddenInputs() {
    const {
      mineruInput,
      paddleInput,
      aiOcrInput,
      apiKeyInput,
      mathModeSelect,
      translationProviderSelect,
      targetLanguageSelect,
    } = browserCredentialElements();
    const taskOptions = getTaskOptions?.() || {};
    if (mineruInput) {
      mineruInput.value = $("mineru_token").value || "";
    }
    if (paddleInput) {
      paddleInput.value = $("paddle_token").value || "";
    }
    if (aiOcrInput) {
      aiOcrInput.value = $("ai_ocr_api_key").value || "";
    }
    if (apiKeyInput) {
      apiKeyInput.value = $("api_key").value || "";
    }
    if (translationProviderSelect) {
      translationProviderSelect.value = normalizeTranslationProvider(taskOptions.translationProvider);
    }
    syncOcrProviderControls(currentOcrProvider());
    if (mathModeSelect) {
      mathModeSelect.value = taskOptions.mathMode === "placeholder" ? "placeholder" : "direct_typst";
    }
    if (targetLanguageSelect) {
      targetLanguageSelect.value = taskOptions.targetLanguageName || "Tiếng Việt";
    }
    setOcrValidationMessage("", "", "mineru");
    setOcrValidationMessage("", "", "paddle");
    setDeepSeekValidationMessage("", "");
    setDeepSeekAccountStatus("", "");
    setDialogStatus("", "");
  }

  function persistBrowserCredentialsFromDialog() {
    const {
      mineruInput,
      paddleInput,
      aiOcrInput,
      apiKeyInput,
      mathModeSelect,
      translationProviderSelect,
      targetLanguageSelect,
    } = browserCredentialElements();
    const translationProvider = getTranslationProviderDefinition(translationProviderSelect?.value);
    const ocrDefinition = getOcrProviderDefinition(currentOcrProvider());
    const ocrToken = currentProviderInputValue().trim();
    if ($(ocrDefinition.tokenField)) {
      $(ocrDefinition.tokenField).value = ocrToken;
    }
    applyKeyInputs({
      ocrProvider: currentOcrProvider(),
      mineruToken: mineruInput?.value?.trim() || "",
      paddleToken: paddleInput?.value?.trim() || "",
      aiOcrApiKey: ocrDefinition.tokenField === "ai_ocr_api_key" ? ocrToken : aiOcrInput?.value?.trim() || "",
      modelApiKey: apiKeyInput?.value?.trim() || "",
    });
    saveTaskOptions?.({
      translationProvider: translationProvider.id,
      model: translationProvider.model,
      baseUrl: translationProvider.baseUrl,
      mathMode: mathModeSelect?.value || "direct_typst",
      targetLanguageName: targetLanguageSelect?.value || "Tiếng Việt",
      translateTitles: true,
    });
    saveBrowserStoredConfig();
  }

  async function persistDesktopCredentialsFromDialog() {
    const {
      mineruInput,
      paddleInput,
      aiOcrInput,
      apiKeyInput,
      mathModeSelect,
      translationProviderSelect,
      targetLanguageSelect,
    } = browserCredentialElements();
    const translationProvider = getTranslationProviderDefinition(translationProviderSelect?.value);
    const provider = currentOcrProvider();
    const ocrDefinition = getOcrProviderDefinition(provider);
    const ocrToken = currentProviderInputValue().trim();
    if ($(ocrDefinition.tokenField)) {
      $(ocrDefinition.tokenField).value = ocrToken;
    }
    const mineruToken = mineruInput?.value?.trim() || "";
    const paddleToken = paddleInput?.value?.trim() || "";
    const aiOcrApiKey = ocrDefinition.tokenField === "ai_ocr_api_key" ? ocrToken : aiOcrInput?.value?.trim() || "";
    const modelApiKey = apiKeyInput?.value?.trim() || "";
    await saveDesktopConfig?.(
      mineruToken,
      modelApiKey,
      async () => {
        await checkApiConnectivity?.();
      },
      {
        ocrProvider: provider,
        paddleToken,
        aiOcrApiKey,
        markConfigured: currentCredentialDialogSetupMode(),
      },
    );
    saveTaskOptions?.({
      translationProvider: translationProvider.id,
      model: translationProvider.model,
      baseUrl: translationProvider.baseUrl,
      mathMode: mathModeSelect?.value || "direct_typst",
      targetLanguageName: targetLanguageSelect?.value || "Tiếng Việt",
      translateTitles: true,
    });
  }

  function hasBrowserCredentials() {
    const definition = getOcrProviderDefinition(currentOcrProvider());
    return Boolean(($(`${definition.tokenField}`)?.value || "").trim() && ($("api_key").value || "").trim());
  }

  function openBrowserCredentialsDialog(options = {}) {
    const { dialog } = browserCredentialElements();
    if (!dialog) {
      return;
    }
    syncBrowserDialogFromHiddenInputs();
    setCredentialDialogMode(!!options.setupMode);
    activateCredentialTab("api");
    dialog.showModal();
  }

  async function ensureOcrCredentialsReady({ onMissingToken, onInvalidToken } = {}) {
    const provider = currentOcrProvider();
    const definition = getOcrProviderDefinition(provider);
    const fallbackToken = definition.id === "paddle"
      ? defaultPaddleToken()
      : definition.id === "mineru"
        ? defaultMineruToken()
        : defaultAiOcrApiKey();
    const token = ($(`${definition.tokenField}`)?.value || fallbackToken).trim();
    if (!token) {
      onMissingToken?.();
      setOcrValidationMessage(definition.validationMissingMessage, "error", definition.id);
      return false;
    }
    if (state.validatedOcrProvider === definition.id
      && state.validatedOcrToken === token
      && ["valid", "skipped"].includes(state.ocrValidationStatus)) {
      return true;
    }
    const result = await runOcrTokenValidation(definition.id, token, { showResult: !state.desktopMode });
    if (result.ok) {
      return true;
    }
    onInvalidToken?.(result);
    return false;
  }

  function updateCredentialGate({
    workflowNeedsCredentials,
    workflowNeedsUpload,
    refreshSubmitControls,
  }) {
    const trigger = $("credentials-btn");
    const gate = $("credential-gate");
    const tile = $("file")?.closest(".upload-tile");
    const fileInput = $("file");
    const uploadGlyph = $("upload-glyph");
    const fileLabel = $("file-label");
    const uploadHelp = $("upload-help");
    const uploadMeta = document.querySelector(".upload-meta");
    const uploadStatus = $("upload-status");

    if (!gate || !tile || !fileInput) {
      return;
    }
    const uploadEnabled = workflowNeedsUpload();
    if (state.desktopMode) {
      gate.classList.add("hidden");
      trigger?.classList.remove("is-nudged");
      tile.classList.toggle("is-locked", !uploadEnabled);
      fileInput.disabled = !uploadEnabled;
      uploadGlyph?.classList.toggle("hidden", !uploadEnabled);
      uploadMeta?.classList.toggle("hidden", !uploadEnabled);
      tile.classList.toggle("is-ready", uploadEnabled && !!state.uploadId);
      refreshSubmitControls();
      return;
    }
    const show = workflowNeedsCredentials() && !hasBrowserCredentials();
    gate.classList.toggle("hidden", !show);
    trigger?.classList.toggle("is-nudged", show);
    tile.classList.toggle("is-locked", show || !uploadEnabled);
    fileInput.disabled = show || !uploadEnabled;
    uploadGlyph?.classList.toggle("hidden", show || !uploadEnabled);
    fileLabel?.classList.toggle("hidden", show);
    uploadHelp?.classList.toggle("hidden", false);
    uploadMeta?.classList.toggle("hidden", show || !uploadEnabled);
    if (show) {
      uploadStatus?.classList.add("hidden");
    }
    refreshSubmitControls();
    tile.classList.toggle("is-ready", !show && uploadEnabled && !!state.uploadId);
  }

  function currentProviderInputValue() {
    const { mineruInput, paddleInput, aiOcrInput } = browserCredentialElements();
    const provider = currentOcrProvider();
    if (provider === "paddle") {
      return paddleInput?.value || "";
    }
    if (provider === "mineru") {
      return mineruInput?.value || "";
    }
    return aiOcrInput?.value || "";
  }

  async function handleBrowserOcrValidate() {
    await runOcrTokenValidation(currentOcrProvider(), currentProviderInputValue(), { showResult: true });
  }

  async function handleBrowserDeepSeekValidate() {
    const { apiKeyInput } = browserCredentialElements();
    setDeepSeekValidationMessage("Đang kiểm tra DeepSeek và số dư…");
    const result = await runDeepSeekConnectivityCheck(apiKeyInput?.value || "", { showResult: false });
    if (result.ok) {
      const balance = await runDeepSeekBalanceCheck(apiKeyInput?.value || "");
      if (balance.status === "unsupported_provider") {
        setDeepSeekValidationMessage("DeepSeek khả dụng", "valid");
        setDeepSeekAccountStatus("API khả dụng, provider hiện tại không hỗ trợ truy vấn số dư", "valid", currentTimeLabel());
        return;
      }
      if (balance.status === "network_error") {
        setDeepSeekValidationMessage("DeepSeek khả dụng, truy vấn số dư thất bại", "valid");
        setDeepSeekAccountStatus("API khả dụng, truy vấn số dư thất bại", "valid", currentTimeLabel());
        return;
      }
      const balanceSummary = summarizeDeepSeekBalance(balance);
      setDeepSeekValidationMessage(
        `DeepSeek khả dụng，${balanceSummary}`,
        balance.is_available ? "valid" : "error",
      );
      setDeepSeekAccountStatus(balanceSummary, balance.is_available ? "valid" : "error", currentTimeLabel());
      return;
    }
    setDeepSeekValidationMessage(
      result.summary || TRANSLATION_PROVIDER_DEFINITION.validationNetworkMessage,
      "error",
    );
    setDeepSeekAccountStatus(result.summary || "API không khả dụng", "error", currentTimeLabel());
  }

  async function handleBrowserCredentialSave() {
    const definition = getOcrProviderDefinition(currentOcrProvider());
    const { mineruInput, paddleInput, aiOcrInput, apiKeyInput } = browserCredentialElements();
    const ocrToken = (definition.id === "paddle"
      ? paddleInput?.value
      : definition.id === "mineru"
        ? mineruInput?.value
        : aiOcrInput?.value)?.trim() || "";
    const modelApiKey = apiKeyInput?.value?.trim() || "";
    if (!ocrToken || !modelApiKey) {
      if (!ocrToken) {
        setOcrValidationMessage(definition.validationMissingMessage, "error", definition.id);
      }
      if (!modelApiKey) {
        setDeepSeekValidationMessage(TRANSLATION_PROVIDER_DEFINITION.validationMissingMessage, "error");
      }
      return;
    }
    const validation = await runOcrTokenValidation(definition.id, ocrToken, { showResult: true });
    if (!validation.ok) {
      return;
    }
    try {
      if (state.desktopMode) {
        await persistDesktopCredentialsFromDialog();
      } else {
        persistBrowserCredentialsFromDialog();
      }
    } catch (error) {
      setDialogStatus(error?.message || String(error), "error");
      setDeepSeekValidationMessage(error?.message || String(error), "error");
      return;
    }
    onCredentialStateChange?.();
    setDialogStatus("", "");
    $("browser-credentials-dialog")?.close();
  }

  $("browser-mineru-token")?.addEventListener("input", () => {
    resetOcrValidationCache();
    setOcrValidationMessage("", "", "mineru");
  });
  $("browser-paddle-token")?.addEventListener("input", () => {
    resetOcrValidationCache();
    setOcrValidationMessage("", "", "paddle");
  });
  $("browser-openai-token")?.addEventListener("input", () => {
    resetOcrValidationCache();
    $("ai_ocr_api_key").value = $("browser-openai-token")?.value || "";
  });
  $("browser-google-token")?.addEventListener("input", () => {
    resetOcrValidationCache();
    $("ai_ocr_api_key").value = $("browser-google-token")?.value || "";
  });
  $("browser-api-key")?.addEventListener("input", () => {
    setDeepSeekValidationMessage("", "");
  });
  $("browser-mineru-validate-btn")?.addEventListener("click", handleBrowserOcrValidate);
  $("browser-paddle-validate-btn")?.addEventListener("click", handleBrowserOcrValidate);
  $("browser-deepseek-validate-btn")?.addEventListener("click", handleBrowserDeepSeekValidate);
  $("browser-credentials-save-btn")?.addEventListener("click", handleBrowserCredentialSave);
  $("credentials-btn")?.addEventListener("click", openBrowserCredentialsDialog);
  credentialDialog()?.querySelectorAll("[data-toggle-secret]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = $(button.dataset.toggleSecret || "");
      if (!input) {
        return;
      }
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      button.classList.toggle("is-revealed", !showing);
      button.setAttribute("aria-pressed", !showing ? "true" : "false");
    });
  });
  document.addEventListener("retainpdf:open-browser-credentials", (event) => {
    openBrowserCredentialsDialog(event?.detail || {});
  });
  credentialDialog()?.querySelectorAll("[data-credential-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      activateCredentialTab(tab.dataset.credentialTab || "api");
    });
  });
  $("browser-ocr-provider-select")?.addEventListener("change", (event) => {
    const provider = normalizeOcrProvider(event.currentTarget?.value);
    $("ocr_provider").value = provider;
    syncOcrProviderControls(provider);
  });

  return {
    activateCredentialTab,
    ensureOcrCredentialsReady,
    hasBrowserCredentials,
    openBrowserCredentialsDialog,
    setDialogStatus,
    updateCredentialGate,
  };
}
