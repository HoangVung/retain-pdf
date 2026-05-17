import { $ } from "../../dom.js";
import { DEFAULT_FILE_LABEL } from "../../constants.js";
import { getOcrProviderDefinition, normalizeOcrProvider } from "../../provider-config.js";

export function mountWorkflowFeature({
  state,
  isMockMode,
  saveDeveloperStoredConfig,
  defaultModelName,
  defaultModelBaseUrl,
  defaultMineruToken,
  defaultPaddleToken,
  defaultAiOcrApiKey,
  defaultOcrProvider,
  defaultModelApiKey,
  normalizeWorkflow,
  normalizeMathMode,
  constants,
  currentPageRanges,
  renderPageRangeSummary,
  getBrowserCredentialsFeature,
}) {
  const {
    DEFAULT_WORKERS,
    DEFAULT_BATCH_SIZE,
    DEFAULT_CLASSIFY_BATCH_SIZE,
    DEFAULT_COMPILE_WORKERS,
    DEFAULT_TIMEOUT_SECONDS,
    DEFAULT_MODEL_VERSION,
    DEFAULT_LANGUAGE,
    DEFAULT_TARGET_LANGUAGE_NAME,
    DEFAULT_MODE,
    DEFAULT_RULE_PROFILE,
    DEFAULT_RENDER_MODE,
    WORKFLOW_BOOK,
    WORKFLOW_TRANSLATE,
    WORKFLOW_RENDER,
  } = constants;

  let refreshSubmitControlsRef = null;
  let applyWorkflowModeRef = null;
  const hasAppliedPageRange = () => workflowNeedsUpload() && `${state.appliedPageRange || ""}`.trim().length > 0;

  function developerConfigWithDefaults() {
    const saved = state.developerConfig || {};
    return {
      workflow: normalizeWorkflow(saved.workflow),
      renderSourceJobId: `${saved.renderSourceJobId || ""}`.trim(),
      mathMode: normalizeMathMode(saved.mathMode),
      translationProvider: `${saved.translationProvider || "deepseek"}`.trim(),
      model: saved.model || defaultModelName(),
      baseUrl: saved.baseUrl || defaultModelBaseUrl(),
      workers: Number(saved.workers || DEFAULT_WORKERS),
      batchSize: Number(saved.batchSize || DEFAULT_BATCH_SIZE),
      classifyBatchSize: Number(saved.classifyBatchSize || DEFAULT_CLASSIFY_BATCH_SIZE),
      compileWorkers: Number(saved.compileWorkers || DEFAULT_COMPILE_WORKERS),
      timeoutSeconds: Number(saved.timeoutSeconds || DEFAULT_TIMEOUT_SECONDS),
      targetLanguageName: `${saved.targetLanguageName || DEFAULT_TARGET_LANGUAGE_NAME}`.trim() || DEFAULT_TARGET_LANGUAGE_NAME,
      translateTitles: saved.translateTitles !== false,
    };
  }

  function syncDeveloperDialogFromState() {
    const config = developerConfigWithDefaults();
    $("developer-workflow").value = config.workflow;
    $("developer-render-source-job-id").value = config.renderSourceJobId;
    $("developer-model").value = config.model;
    $("developer-base-url").value = config.baseUrl;
    $("developer-workers").value = `${config.workers}`;
    $("developer-batch-size").value = `${config.batchSize}`;
    $("developer-classify-batch-size").value = `${config.classifyBatchSize}`;
    $("developer-compile-workers").value = `${config.compileWorkers}`;
    $("developer-timeout-seconds").value = `${config.timeoutSeconds}`;
    updateDeveloperWorkflowFormState();
  }

  function currentWorkflow() {
    return developerConfigWithDefaults().workflow;
  }

  function currentRenderSourceJobId() {
    return developerConfigWithDefaults().renderSourceJobId;
  }

  function workflowNeedsUpload(workflow = currentWorkflow()) {
    return workflow !== WORKFLOW_RENDER;
  }

  function workflowNeedsCredentials(workflow = currentWorkflow()) {
    return workflow !== WORKFLOW_RENDER;
  }

  function workflowUsesRenderStage(workflow = currentWorkflow()) {
    return workflow === WORKFLOW_BOOK || workflow === WORKFLOW_RENDER;
  }

  function workflowSubmitLabel(workflow = currentWorkflow()) {
    switch (workflow) {
      case WORKFLOW_RENDER:
        return "Bắt đầu kết xuất";
      case WORKFLOW_TRANSLATE:
        return "Bắt đầu dịch";
      case WORKFLOW_BOOK:
        return hasAppliedPageRange() ? "Bắt đầu dịch" : "Dịch toàn bộ";
      default:
        return hasAppliedPageRange() ? "Bắt đầu dịch" : "Dịch toàn bộ";
    }
  }

  function workflowHeadline(workflow = currentWorkflow()) {
    switch (workflow) {
      case WORKFLOW_RENDER:
        return "Quy trình hiện tại sẽ dùng lại kết quả tác vụ đã có để tạo lại PDF.";
      case WORKFLOW_TRANSLATE:
        return "Sau khi tải lên sẽ chạy OCR và dịch nội dung chính, không kết xuất PDF.";
      default:
        return "Sau khi tải lên sẽ chạy OCR, dịch và kết xuất PDF.";
    }
  }

  function updateDeveloperWorkflowFormState() {
    const workflow = normalizeWorkflow($("developer-workflow")?.value);
    const renderWrap = $("developer-render-source-wrap");
    const note = $("developer-workflow-note");
    renderWrap?.classList.toggle("hidden", workflow !== WORKFLOW_RENDER);
    if (note) {
      note.textContent = workflow === WORKFLOW_RENDER
        ? "render sẽ bỏ qua OCR và dịch, dùng lại kết quả tác vụ đã có để kết xuất lại PDF."
        : workflow === WORKFLOW_TRANSLATE
          ? "translate sẽ chạy OCR và dịch, nhưng không kết xuất PDF cuối cùng."
          : "book sẽ chạy đầy đủ OCR, dịch và kết xuất PDF.";
    }
  }

  function refreshSubmitControls() {
    const workflow = currentWorkflow();
    const showPageRangeButton = workflowNeedsUpload(workflow) && !hasAppliedPageRange();
    if (isMockMode()) {
      $("submit-btn").disabled = false;
      $("submit-btn").textContent = workflowSubmitLabel(workflow);
      $("upload-action-slot")?.classList.remove("hidden");
      $("page-range-btn")?.classList.toggle("hidden", !showPageRangeButton);
      return;
    }
    const needsUpload = workflowNeedsUpload(workflow);
    const needsCredentials = workflowNeedsCredentials(workflow);
    const credentialsMissing = !state.desktopMode
      && needsCredentials
      && !getBrowserCredentialsFeature()?.hasBrowserCredentials();
    const renderReady = Boolean(currentRenderSourceJobId());
    const uploadReady = Boolean(state.uploadId);
    const canSubmit = needsUpload ? uploadReady : renderReady;
    $("submit-btn").disabled = credentialsMissing || !canSubmit;
    $("submit-btn").textContent = workflowSubmitLabel(workflow);
    $("upload-action-slot")?.classList.toggle("hidden", credentialsMissing || (needsUpload ? !uploadReady : false));
    $("page-range-btn")?.classList.toggle("hidden", !showPageRangeButton);
  }

  function updateCredentialGate() {
    if (isMockMode()) {
      return;
    }
    getBrowserCredentialsFeature()?.updateCredentialGate({
      workflowNeedsCredentials: () => workflowNeedsCredentials(currentWorkflow()),
      workflowNeedsUpload: () => workflowNeedsUpload(currentWorkflow()),
      refreshSubmitControls,
    });
  }

  function applyWorkflowMode() {
    const workflow = currentWorkflow();
    const fileInput = $("file");
    const tile = fileInput?.closest(".upload-tile");
    const uploadGlyph = $("upload-glyph");
    const fileLabel = $("file-label");
    const uploadHelp = $("upload-help");
    const uploadMeta = document.querySelector(".upload-meta");
    const uploadStatus = $("upload-status");
    const needsUpload = workflowNeedsUpload(workflow);
    if (isMockMode()) {
      if (fileInput) {
        fileInput.disabled = true;
      }
      tile?.classList.add("is-locked");
      uploadGlyph?.classList.add("hidden");
      uploadMeta?.classList.add("hidden");
      if (fileLabel) {
        fileLabel.textContent = "Chế độ mô phỏng";
        fileLabel.title = "";
        fileLabel.classList.remove("hidden");
      }
      if (uploadHelp) {
        uploadHelp.textContent = `Hiện ở chế độ mô phỏng: ${new URLSearchParams(window.location.search).get("mock") || "running"}。Không tải tệp lên và không gọi backend thật.`;
        uploadHelp.classList.remove("hidden");
      }
      if (uploadStatus) {
        uploadStatus.textContent = "Chế độ mô phỏng đã bật, có thể bấm bắt đầu dịch ngay.";
        uploadStatus.classList.remove("hidden");
      }
      renderPageRangeSummary();
      refreshSubmitControls();
      updateCredentialGate();
      return;
    }
    if (fileInput) {
      fileInput.disabled = !needsUpload;
    }
    tile?.classList.toggle("is-locked", !needsUpload);
    uploadGlyph?.classList.toggle("hidden", !needsUpload);
    uploadMeta?.classList.toggle("hidden", !needsUpload);
    if (fileLabel && !state.uploadId) {
      fileLabel.textContent = needsUpload ? DEFAULT_FILE_LABEL : "Dùng lại kết quả tác vụ đã có";
      fileLabel.title = "";
      fileLabel.classList.remove("hidden");
    }
    if (uploadHelp) {
      uploadHelp.textContent = workflowHeadline(workflow);
      uploadHelp.classList.remove("hidden");
    }
    if (!needsUpload && uploadStatus) {
      const renderSourceJobId = currentRenderSourceJobId();
      uploadStatus.textContent = renderSourceJobId
        ? `Tác vụ dùng lại hiện tại: ${renderSourceJobId}`
        : "Vui lòng điền ID tác vụ nguồn để kết xuất trong Cài đặt nhà phát triển.";
      uploadStatus.classList.remove("hidden");
    } else if (!state.uploadId) {
      uploadStatus?.classList.add("hidden");
    }
    renderPageRangeSummary();
    refreshSubmitControls();
    updateCredentialGate();
  }

  function saveDeveloperDialog() {
    const currentConfig = developerConfigWithDefaults();
    state.developerConfig = {
      workflow: normalizeWorkflow($("developer-workflow")?.value),
      renderSourceJobId: $("developer-render-source-job-id")?.value?.trim() || "",
      mathMode: currentConfig.mathMode,
      translationProvider: currentConfig.translationProvider,
      model: $("developer-model")?.value?.trim() || defaultModelName(),
      baseUrl: $("developer-base-url")?.value?.trim() || defaultModelBaseUrl(),
      workers: Number($("developer-workers")?.value || DEFAULT_WORKERS),
      batchSize: Number($("developer-batch-size")?.value || DEFAULT_BATCH_SIZE),
      classifyBatchSize: Number($("developer-classify-batch-size")?.value || DEFAULT_CLASSIFY_BATCH_SIZE),
      compileWorkers: Number($("developer-compile-workers")?.value || DEFAULT_COMPILE_WORKERS),
      timeoutSeconds: Number($("developer-timeout-seconds")?.value || DEFAULT_TIMEOUT_SECONDS),
      targetLanguageName: currentConfig.targetLanguageName,
      translateTitles: currentConfig.translateTitles,
    };
    void saveDeveloperStoredConfig(state.developerConfig);
    applyWorkflowMode();
    $("developer-dialog")?.close();
  }

  function resetDeveloperDialog() {
    state.developerConfig = {};
    void saveDeveloperStoredConfig({});
    syncDeveloperDialogFromState();
    applyWorkflowMode();
  }

  function buildSourcePayload(workflow, developerConfig) {
    return workflowNeedsUpload(workflow)
      ? { upload_id: state.uploadId }
      : { artifact_job_id: developerConfig.renderSourceJobId };
  }

  function buildOcrPayload(pageRanges) {
    const provider = normalizeOcrProvider($("ocr_provider")?.value || defaultOcrProvider());
    const definition = getOcrProviderDefinition(provider);
    const token = definition.id === "paddle"
      ? ($("paddle_token")?.value || defaultPaddleToken())
      : definition.id === "mineru"
        ? ($("mineru_token")?.value || defaultMineruToken())
        : ($("ai_ocr_api_key")?.value || defaultAiOcrApiKey());
    const isAiOcr = definition.id === "google" || definition.id === "openai";
    const payload = {
      provider,
      [definition.tokenField]: token,
      model_version: DEFAULT_MODEL_VERSION,
      language: DEFAULT_LANGUAGE,
      page_ranges: pageRanges,
    };
    if (isAiOcr) {
      payload.ai_ocr_model = definition.id === "google" ? "gemini-2.5-flash" : "gpt-4.1-mini";
      payload.ai_ocr_base_url = definition.id === "google"
        ? "https://generativelanguage.googleapis.com/v1beta/openai"
        : "https://api.openai.com/v1";
    }
    return payload;
  }

  function buildTranslationPayload(developerConfig) {
    return {
      mode: DEFAULT_MODE,
      math_mode: developerConfig.mathMode,
      model: developerConfig.model,
      base_url: developerConfig.baseUrl,
      api_key: $("api_key").value || defaultModelApiKey(),
      workers: developerConfig.workers,
      batch_size: developerConfig.batchSize,
      classify_batch_size: developerConfig.classifyBatchSize,
      rule_profile_name: DEFAULT_RULE_PROFILE,
      target_language_name: developerConfig.targetLanguageName,
      custom_rules_text: "",
      glossary_id: "",
      glossary_entries: [],
      skip_title_translation: !developerConfig.translateTitles,
    };
  }

  function buildRenderPayload(developerConfig) {
    return {
      render_mode: DEFAULT_RENDER_MODE,
      compile_workers: developerConfig.compileWorkers,
    };
  }

  function collectRunPayload() {
    const pageRanges = currentPageRanges();
    const developerConfig = developerConfigWithDefaults();
    const workflow = developerConfig.workflow;
    const payload = {
      workflow,
      source: buildSourcePayload(workflow, developerConfig),
      runtime: {
        job_id: "",
        timeout_seconds: developerConfig.timeoutSeconds,
      },
    };
    if (workflow === WORKFLOW_BOOK || workflow === WORKFLOW_TRANSLATE) {
      payload.ocr = buildOcrPayload(pageRanges);
      payload.translation = buildTranslationPayload(developerConfig);
    }
    if (workflowUsesRenderStage(workflow)) {
      payload.render = buildRenderPayload(developerConfig);
    }
    return payload;
  }

  return {
    applyWorkflowMode,
    collectRunPayload,
    currentRenderSourceJobId,
    currentWorkflow,
    developerConfigWithDefaults,
    refreshSubmitControls,
    resetDeveloperDialog,
    saveDeveloperDialog,
    syncDeveloperDialogFromState,
    updateCredentialGate,
    updateDeveloperWorkflowFormState,
    workflowNeedsCredentials,
    workflowNeedsUpload,
  };
}
