import { $ } from "../../dom.js";
import { buildApiUrl } from "../../config.js";

export function mountUploadFeature({
  state,
  apiBase,
  apiPrefix,
  frontMaxBytes,
  frontMaxPageCount,
  countPdfPages,
  defaultFileLabel,
  collectUploadFormData,
  submitUploadRequest,
  resetUploadedFile,
  resetUploadProgress,
  setUploadProgress,
  clearFileInputValue,
  setText,
  applyWorkflowMode,
  refreshSubmitControls,
  workflowNeedsUpload,
}) {
  function normalizePageRangeValue(startValue = "", endValue = "") {
    const start = startValue.trim();
    const end = endValue.trim();
    if (!start && !end) {
      return "";
    }
    if (start && end) {
      return start === end ? start : `${start}-${end}`;
    }
    return start || end;
  }

  function currentPageRanges() {
    const applied = state.appliedPageRange || "";
    if (applied) {
      return applied;
    }
    const start = $("page-range-start")?.value || "";
    const end = $("page-range-end")?.value || "";
    return normalizePageRangeValue(start, end);
  }

  function renderPageRangeSummary() {
    const summary = $("page-range-summary");
    if (!summary) {
      return;
    }
    if (!workflowNeedsUpload()) {
      summary.classList.add("hidden");
      summary.textContent = "Trang đã chọn: -";
      return;
    }
    const value = currentPageRanges();
    if (!value) {
      summary.classList.add("hidden");
      summary.textContent = "Trang đã chọn: -";
      return;
    }
    summary.classList.remove("hidden");
    summary.textContent = `Trang đã chọn: ${value}`;
  }

  function openPageRangeDialog() {
    const applied = state.appliedPageRange || "";
    const [start = "", end = ""] = applied.includes("-") ? applied.split("-", 2) : [applied, applied];
    const maxPage = frontMaxPageCount || 0;
    const limitText = $("page-range-limit-text");
    const titleEl = $("page-range-title");
    if (maxPage > 0) {
      if (limitText) {
        limitText.textContent = `Giới hạn lần dịch này theo phạm vi trang (tối đa ${maxPage} trang, số trang bắt đầu từ 1).`;
      }
      if (titleEl) {
        titleEl.textContent = `Dịch theo trang (tối đa ${maxPage} trang)`;
      }
    } else {
      if (limitText) {
        limitText.textContent = "Giới hạn bản dịch theo phạm vi trang, trang bắt đầu từ 1.";
      }
      if (titleEl) {
        titleEl.textContent = "Dịch theo trang";
      }
    }
    if (maxPage > 0) {
      if ($("page-range-start")) {
        $("page-range-start").setAttribute("max", String(maxPage));
      }
      if ($("page-range-end")) {
        $("page-range-end").setAttribute("max", String(maxPage));
      }
    }
    if ($("page-range-start")) {
      $("page-range-start").value = start || "";
    }
    if ($("page-range-end")) {
      $("page-range-end").value = end || "";
    }
    $("page-range-dialog")?.showModal();
  }

  function applyPageRanges() {
    const startInput = $("page-range-start");
    const endInput = $("page-range-end");
    const start = startInput?.value?.trim() || "";
    const end = endInput?.value?.trim() || "";
    if ((start && Number(start) < 1) || (end && Number(end) < 1)) {
      setText("error-box", "Số trang phải bắt đầu từ 1");
      return;
    }
    if ((start && frontMaxPageCount && Number(start) > frontMaxPageCount) || (end && frontMaxPageCount && Number(end) > frontMaxPageCount)) {
      setText("error-box", `Số trang không được vượt quá ${frontMaxPageCount}`);
      return;
    }
    if (start && end && Number(start) > Number(end)) {
      setText("error-box", "Trang bắt đầu không được lớn hơn trang kết thúc");
      return;
    }
    if (frontMaxPageCount && start && end && Number(end) - Number(start) + 1 > frontMaxPageCount) {
      setText("error-box", `Phạm vi trang không được vượt quá ${frontMaxPageCount} trang`);
      return;
    }
    if (startInput) {
      startInput.value = start;
    }
    if (endInput) {
      endInput.value = end;
    }
    state.appliedPageRange = normalizePageRangeValue(start, end);
    setText("error-box", "-");
    renderPageRangeSummary();
    refreshSubmitControls();
    $("page-range-dialog")?.close();
  }

  function clearPageRanges() {
    if ($("page-range-start")) {
      $("page-range-start").value = "";
    }
    if ($("page-range-end")) {
      $("page-range-end").value = "";
    }
    state.appliedPageRange = "";
    renderPageRangeSummary();
    refreshSubmitControls();
  }

  async function handleFileSelected() {
    const file = $("file").files[0];
    resetUploadedFile();
    resetUploadProgress();
    state.appliedPageRange = "";
    renderPageRangeSummary();
    applyWorkflowMode();
    setText("file-label", file ? file.name : defaultFileLabel);
    if ($("file-label")) {
      $("file-label").title = file ? file.name : "";
    }
    if (!file) {
      return;
    }
    if (file.size > frontMaxBytes) {
      setText("error-box", "Frontend hiện tại giới hạn PDF dưới 100MB");
      setText("upload-status", "Tệp vượt quá giới hạn kích thước");
      $("upload-status")?.classList.remove("hidden");
      return;
    }
    if (frontMaxPageCount && countPdfPages) {
      setText("upload-status", "Đang xác minh số trang…");
      $("upload-status")?.classList.remove("hidden");
      try {
        const localPageCount = await countPdfPages(file);
        if (!Number.isFinite(localPageCount) || localPageCount <= 0) {
          setText("error-box", "Phân tích PDF thất bại, vui lòng kiểm tra tệp có bị hỏng hoặc không thể truy cập không.");
          setText("upload-status", "Kiểm tra tệp thất bại");
          clearFileInputValue();
          return;
        }
        if (localPageCount > frontMaxPageCount) {
          setText("error-box", `PDF vượt quá giới hạn số trang: tối đa ${frontMaxPageCount} trang`);
          setText("upload-status", "Tệp vượt quá giới hạn số trang");
          clearFileInputValue();
          return;
        }
      } catch (err) {
        setText("error-box", err?.message || "Phân tích PDF thất bại, vui lòng thử lại sau.");
        setText("upload-status", "Kiểm tra tệp thất bại");
        clearFileInputValue();
        return;
      }
    }
    setText("error-box", "-");
    setText("upload-status", "Đang tải lên…");
    $("upload-status")?.classList.remove("hidden");

    try {
      const uploadUrl = buildApiUrl(apiPrefix, "uploads");
      const payload = await submitUploadRequest(
        uploadUrl,
        collectUploadFormData(file),
        setUploadProgress,
      );
      const uploadedPageCount = Number(payload.page_count || 0);
      if (frontMaxPageCount > 0 && uploadedPageCount > frontMaxPageCount) {
        setText("error-box", `PDF vượt quá giới hạn số trang: tối đa ${frontMaxPageCount} trang`);
        setText("upload-status", "Tệp vượt quá giới hạn số trang");
        clearFileInputValue();
        resetUploadedFile();
        return;
      }
      state.uploadId = payload.upload_id || "";
      state.uploadedFileName = payload.filename || file.name;
      state.uploadedPageCount = uploadedPageCount;
      state.uploadedBytes = Number(payload.bytes || file.size || 0);
      $("file")?.closest(".upload-tile")?.classList.toggle("is-ready", !!state.uploadId);
      $("file")?.closest(".upload-tile")?.classList.remove("is-uploading");
      setText("upload-status", "Tải lên hoàn tất, có thể bắt đầu tác vụ.");
      $("upload-status")?.classList.remove("hidden");
      clearFileInputValue();
      refreshSubmitControls();
    } catch (err) {
      resetUploadedFile();
      clearFileInputValue();
      setText("error-box", err.message);
      setText("upload-status", "Tải lên thất bại");
      $("upload-status")?.classList.remove("hidden");
      applyWorkflowMode();
    }
  }

  return {
    applyPageRanges,
    clearPageRanges,
    currentPageRanges,
    handleFileSelected,
    normalizePageRangeValue,
    openPageRangeDialog,
    renderPageRangeSummary,
  };
}
