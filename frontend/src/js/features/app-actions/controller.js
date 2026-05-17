import { $ } from "../../dom.js";
import { buildJobsEndpoint } from "../../network.js";
import { getOcrProviderDefinition } from "../../provider-config.js";

export function mountAppActionsFeature({
  state,
  apiBase,
  apiPrefix,
  buildApiEndpoint,
  isMockMode,
  openSetupDialog,
  renderJob,
  setText,
  submitJson,
  submitJobRequest,
  saveDesktopConfig,
  setDesktopBusy,
  openDesktopOutputDirectory,
  resetUploadedFile,
  currentWorkflow,
  workflowNeedsCredentials,
  workflowNeedsUpload,
  currentRenderSourceJobId,
  collectRunPayload,
  getBrowserCredentialsFeature,
  getJobRuntimeFeature,
  onDesktopConfigSaved,
}) {
  function isMissingUploadError(error) {
    const message = `${error?.message || error || ""}`;
    return message.includes("upload not found");
  }

  function handleMissingUploadError() {
    state.uploadId = "";
    state.uploadedFileName = "";
    state.uploadedPageCount = 0;
    state.uploadedBytes = 0;
    resetUploadedFile?.();
    setText("error-box", "Tệp tải lên hiện tại không hợp lệ, vui lòng tải lại PDF rồi gửi.");
  }

  async function submitForm(event) {
    event.preventDefault();
    const workflow = currentWorkflow();
    if (isMockMode()) {
      $("submit-btn").disabled = true;
      setText("error-box", "-");
      try {
        const payload = await submitJobRequest(apiPrefix, { workflow, source: {}, mock: true });
        state.currentJobStartedAt = new Date().toISOString();
        state.currentJobFinishedAt = "";
        renderJob(payload);
        getJobRuntimeFeature()?.startPolling(payload.job_id);
      } catch (err) {
        setText("error-box", err.message);
      } finally {
        $("submit-btn").disabled = false;
      }
      return;
    }
    if (state.desktopMode && !state.desktopConfigured && workflowNeedsCredentials(workflow)) {
      openSetupDialog();
      setText("error-box", "Vui lòng hoàn tất cấu hình ban đầu.");
      return;
    }
    if (workflowNeedsUpload(workflow) && !state.uploadId) {
      setText("error-box", "Vui lòng chọn và tải lên tệp PDF trước");
      return;
    }
    const ocrProvider = `${$("ocr_provider")?.value || ""}`.trim().toLowerCase();
    if (["google", "openai"].includes(ocrProvider)) {
      setText(
        "error-box",
        `${ocrProvider === "google" ? "Google OCR" : "OpenAI OCR"} mới có phần cấu hình, backend chưa hỗ trợ chạy OCR provider này. Vui lòng dùng MinerU hoặc PaddleOCR.`,
      );
      return;
    }
    if (!workflowNeedsUpload(workflow) && !currentRenderSourceJobId()) {
      setText("error-box", "Vui lòng điền ID tác vụ nguồn để kết xuất trong Cài đặt nhà phát triển.");
      return;
    }
    if (workflowNeedsCredentials(workflow) && !(await getBrowserCredentialsFeature()?.ensureOcrCredentialsReady({
      onMissingToken: () => {
        setText("error-box", "Vui lòng điền thông tin OCR Provider hiện tại.");
        if (!state.desktopMode) {
          getBrowserCredentialsFeature()?.openBrowserCredentialsDialog();
        }
      },
      onInvalidToken: (result) => {
        setText("error-box", result.summary || "Thông tin OCR Provider chưa vượt qua kiểm tra.");
        if (!state.desktopMode) {
          getBrowserCredentialsFeature()?.openBrowserCredentialsDialog();
        }
      },
    }))) {
      return;
    }

    $("submit-btn").disabled = true;
    setText("error-box", "-");

    try {
      const runPayload = collectRunPayload();
      const payload = await submitJobRequest(apiPrefix, runPayload);
      state.currentJobStartedAt = new Date().toISOString();
      state.currentJobFinishedAt = "";
      renderJob(payload);
      getJobRuntimeFeature()?.startPolling(payload.job_id);
    } catch (err) {
      if (isMissingUploadError(err)) {
        handleMissingUploadError();
        return;
      }
      setText("error-box", err.message);
    } finally {
      $("submit-btn").disabled = false;
    }
  }

  async function checkApiConnectivity() {
    try {
      const resp = await fetch(buildApiEndpoint("", "health"));
      if (!resp.ok) {
        throw new Error(`health ${resp.status}`);
      }
      return true;
    } catch (_err) {
      const message = `Frontend hiện không thể kết nối backend. API Base: ${apiBase()}。Vui lòng xác nhận dịch vụ cục bộ đã khởi động rồi thử lại.`;
      setText("error-box", message);
      throw new Error(message);
    }
  }

  async function handleOpenOutputDir() {
    try {
      await openDesktopOutputDirectory();
    } catch (err) {
      setText("error-box", err.message || String(err));
    }
  }

  return {
    checkApiConnectivity,
    handleOpenOutputDir,
    submitForm,
  };
}
