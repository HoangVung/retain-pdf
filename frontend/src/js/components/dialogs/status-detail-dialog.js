class StatusDetailDialog extends HTMLElement {
  connectedCallback() {
    if (this.dataset.hydrated === "1") {
      return;
    }
    this.dataset.hydrated = "1";
    this.innerHTML = `
      <dialog id="status-detail-dialog" class="desktop-dialog status-detail-dialog">
        <form method="dialog" class="desktop-shell">
          <div class="desktop-head">
            <div class="status-detail-headline">
              <span id="status-detail-head-icon" class="status-detail-head-icon" aria-hidden="true"></span>
              <div class="status-detail-head-copy">
                <div class="status-detail-head-top">
                  <h2>Chi tiết tác vụ</h2>
                  <p class="status-detail-job-meta">Job ID <span id="status-detail-job-id" class="status-detail-job-id mono">-</span></p>
                </div>
                <p id="status-detail-head-note" class="status-panel-note">Xem tổng quan tác vụ, nguyên nhân thất bại và luồng sự kiện</p>
              </div>
            </div>
            <button id="status-detail-close-btn" type="submit" class="dialog-close-btn" aria-label="Đóng">×</button>
          </div>
          <div class="desktop-body status-detail-body">
            <div class="detail-tabs" role="tablist" aria-label="Chi tiết tác vụ">
              <button id="detail-tab-overview" type="button" class="detail-tab is-active" data-tab="overview" role="tab" aria-selected="true">Tổng quan</button>
              <button id="detail-tab-failure" type="button" class="detail-tab" data-tab="failure" role="tab" aria-selected="false">Thất bại</button>
              <button id="detail-tab-events" type="button" class="detail-tab" data-tab="events" role="tab" aria-selected="false">Sự kiện</button>
              <button id="detail-tab-translation" type="button" class="detail-tab detail-tab-advanced" data-tab="translation" role="tab" aria-selected="false">Chẩn đoán nâng cao</button>
            </div>

            <div class="detail-tab-panels">
              <section id="detail-panel-overview" class="detail-tab-panel is-active" data-panel="overview" role="tabpanel">
                <div class="detail-download-row">
                  <a id="markdown-bundle-btn" class="button-link secondary disabled" href="#" target="_blank" rel="noopener noreferrer">Tải xuống ZIP Markdown</a>
                </div>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="label">Giai đoạn hiện tại</span>
                    <span id="runtime-current-stage" class="info-value">-</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Thời gian giai đoạn hiện tại</span>
                    <span id="runtime-stage-elapsed" class="info-value">-</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Tổng thời gian</span>
                    <span id="runtime-total-elapsed" class="info-value">-</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Số lần thử lại</span>
                    <span id="runtime-retry-count" class="info-value">0</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Chuyển đổi gần nhất</span>
                    <span id="runtime-last-transition" class="info-value">-</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Lý do kết thúc</span>
                    <span id="runtime-terminal-reason" class="info-value">-</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Giao thức đầu vào</span>
                    <span id="runtime-input-protocol" class="info-value">-</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Stage Schema</span>
                    <span id="runtime-stage-spec-version" class="info-value">-</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Chế độ công thức</span>
                    <span id="runtime-math-mode" class="info-value">-</span>
                  </div>
                </div>
                <div class="status-panel detail-stage-panel">
                  <div class="status-panel-head">
                    <h3>Dòng thời gian quá trình</h3>
                  </div>
                  <div id="overview-stage-empty" class="events-empty">Chưa có bản ghi giai đoạn</div>
                  <div id="overview-stage-list" class="stage-history-list hidden"></div>
                </div>
              </section>

              <section id="detail-panel-failure" class="detail-tab-panel" data-panel="failure" role="tabpanel" hidden>
                <div class="status-panel">
                  <div class="status-panel-head">
                    <h3>Chẩn đoán lỗi</h3>
                    <span class="status-panel-note">Tóm tắt thất bại có cấu trúc và đề xuất xử lý</span>
                  </div>
                  <div class="failure-action-row">
                    <button id="failure-rerun-btn" type="button" class="button-link secondary" disabled>Khôi phục từ điểm dừng/Chạy lại</button>
                    <span id="failure-rerun-status" class="status-panel-note">Nếu backend cho phép, có thể tạo tác vụ khôi phục từ kết quả đã có sau khi lỗi.</span>
                  </div>
                  <div class="failure-hero-card">
                    <span class="label">Thất bạiTóm tắt</span>
                    <span id="failure-summary" class="info-value">-</span>
                  </div>
                  <div class="info-list detail-info-list">
                    <div class="info-row">
                      <span class="label">Phân loại</span>
                      <span id="failure-category" class="info-value">-</span>
                    </div>
                    <div class="info-row">
                      <span class="label">Giai đoạn</span>
                      <span id="failure-stage" class="info-value">-</span>
                    </div>
                    <div class="info-row">
                      <span class="label">Nguyên nhân gốc rễ</span>
                      <span id="failure-root-cause" class="info-value">-</span>
                    </div>
                    <div class="info-row">
                      <span class="label">Đề xuất</span>
                      <span id="failure-suggestion" class="info-value">-</span>
                    </div>
                    <div class="info-row">
                      <span class="label">Nhật ký gần nhất</span>
                      <span id="failure-last-log-line" class="info-value">-</span>
                    </div>
                    <div class="info-row">
                      <span class="label">Có thể thử lại</span>
                      <span id="failure-retryable" class="info-value">-</span>
                    </div>
                  </div>
                </div>
              </section>

              <section id="detail-panel-events" class="detail-tab-panel" data-panel="events" role="tabpanel" hidden>
                <div class="status-panel">
                  <div class="status-panel-head">
                    <h3>Luồng sự kiện</h3>
                    <span id="events-status" class="status-panel-note">Tất cảSự kiện</span>
                  </div>
                  <p class="events-lead">Hiển thị sự kiện gần đây theo thứ tự thời gian giảm dần để xác định tác vụ đang kẹt ở giai đoạn nào và điều gì xảy ra trước lỗi cuối cùng.</p>
                  <div id="events-empty" class="events-empty">Chưa có sự kiện</div>
                  <div id="events-list" class="events-list hidden"></div>
                </div>
              </section>

              <section id="detail-panel-translation" class="detail-tab-panel" data-panel="translation" role="tabpanel" hidden>
                <div class="status-panel translation-debug-panel">
                  <div class="status-panel-head">
                    <h3>Gỡ lỗi dịch thuật</h3>
                    <span id="translation-debug-status" class="status-panel-note">Kiểm tra theo item tại sao không dịch, tại sao giữ nguyên gốc</span>
                  </div>
                  <div id="translation-debug-empty" class="events-empty hidden">Chưa có dữ liệu gỡ lỗi dịch thuật</div>
                  <div id="translation-debug-content" class="translation-debug-content">
                    <section class="translation-summary-shell">
                      <div class="translation-summary-grid">
                        <div class="translation-summary-card">
                          <span class="label">Đã dịch</span>
                          <span id="translation-count-translated" class="info-value">-</span>
                        </div>
                        <div class="translation-summary-card">
                          <span class="label">Giữ nguyên gốc</span>
                          <span id="translation-count-kept-origin" class="info-value">-</span>
                        </div>
                        <div class="translation-summary-card">
                          <span class="label">Đã bỏ qua</span>
                          <span id="translation-count-skipped" class="info-value">-</span>
                        </div>
                        <div class="translation-summary-card">
                          <span class="label">Provider</span>
                          <span id="translation-provider-family" class="info-value">-</span>
                        </div>
                      </div>
                      <div class="translation-summary-notes">
                        <span id="translation-summary-scope" class="status-panel-note">Phạm vi thống kê tóm tắt：-</span>
                        <span id="translation-list-filter" class="status-panel-note">Lọc danh sách hiện tại: -</span>
                      </div>
                    </section>

                    <section class="translation-filter-panel">
                      <div class="translation-filter-row">
                        <label class="translation-filter-field">
                          <span class="label">Trạng thái</span>
                          <select id="translation-filter-final-status">
                            <option value="kept_origin" selected>Giữ nguyên gốc</option>
                            <option value="translated">Đã dịch</option>
                            <option value="skipped">Đã bỏ qua</option>
                            <option value="">Tất cả</option>
                          </select>
                        </label>
                        <label class="translation-filter-field translation-filter-search">
                          <span class="label">Tìm kiếm</span>
                          <input id="translation-filter-query" type="search" placeholder="Nhập item_id, route, đoạn gốc" />
                        </label>
                        <button id="translation-filter-apply" type="button" class="button-link secondary">Làm mới</button>
                      </div>
                    </section>

                    <div class="translation-debug-layout">
                      <section class="translation-debug-column translation-debug-column-list">
                        <div class="translation-debug-subhead">
                          <h4>Danh sách item</h4>
                          <span id="translation-items-meta" class="status-panel-note">-</span>
                        </div>
                        <div class="translation-panel-body">
                          <div id="translation-items-loading" class="events-empty hidden">Đang đọc item dịch thuật...</div>
                          <div id="translation-items-empty" class="events-empty hidden">Không có item dịch thuật phù hợp</div>
                          <div id="translation-items-list" class="translation-items-list"></div>
                        </div>
                        <div class="translation-items-pagination">
                          <button id="translation-items-prev" type="button" class="button-link secondary" disabled>Trang trước</button>
                          <span id="translation-items-page" class="status-panel-note">-</span>
                          <button id="translation-items-next" type="button" class="button-link secondary" disabled>Trang sau</button>
                        </div>
                      </section>

                      <section class="translation-debug-column translation-debug-column-detail">
                        <div class="translation-debug-subhead">
                          <h4>Item Chi tiết</h4>
                          <span id="translation-item-meta" class="status-panel-note">-</span>
                        </div>
                        <div class="translation-panel-body translation-panel-body-detail">
                          <div id="translation-item-loading" class="events-empty hidden">Đang đọc chi tiết item...</div>
                          <div id="translation-item-empty" class="events-empty">Vui lòng chọn item bên trái</div>
                          <div id="translation-item-detail" class="translation-item-detail hidden"></div>
                        </div>
                        <div class="translation-replay-actions">
                          <button id="translation-item-replay" type="button" class="button-link secondary" disabled>Phát lại item hiện tại</button>
                          <span id="translation-replay-status" class="status-panel-note">-</span>
                        </div>
                        <div id="translation-replay-result" class="translation-replay-result hidden"></div>
                      </section>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </form>
      </dialog>
    `;
  }

  dialogElement() {
    return this.querySelector("#status-detail-dialog");
  }

  activateTab(name = "overview") {
    const tabs = this.querySelectorAll(".detail-tab");
    const panels = this.querySelectorAll(".detail-tab-panel");
    tabs.forEach((tab) => {
      const active = tab.dataset.tab === name;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });
    panels.forEach((panel) => {
      const active = panel.dataset.panel === name;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  }

  open(tabName = "overview") {
    this.activateTab(tabName);
    this.dialogElement()?.showModal();
  }

  close() {
    this.dialogElement()?.close();
  }

  setHeadline({ iconMarkup = "", jobId = "-", note = "Xem tổng quan tác vụ, nguyên nhân thất bại và luồng sự kiện" } = {}) {
    const icon = this.querySelector("#status-detail-head-icon");
    const jobIdEl = this.querySelector("#status-detail-job-id");
    const noteEl = this.querySelector("#status-detail-head-note");
    if (icon) {
      icon.innerHTML = iconMarkup;
    }
    if (jobIdEl) {
      jobIdEl.textContent = jobId;
    }
    if (noteEl) {
      noteEl.textContent = note;
    }
  }

  renderStageHistory({ markup = "", emptyText = "Chưa có bản ghi giai đoạn", hasItems = false } = {}) {
    const list = this.querySelector("#overview-stage-list");
    const empty = this.querySelector("#overview-stage-empty");
    if (!list || !empty) {
      return;
    }
    if (!hasItems) {
      list.innerHTML = "";
      list.classList.add("hidden");
      empty.textContent = emptyText;
      empty.classList.remove("hidden");
      return;
    }
    empty.classList.add("hidden");
    list.classList.remove("hidden");
    list.innerHTML = markup;
  }

  renderEvents({ markup = "", count = 0, emptyText = "Chưa có sự kiện", hasItems = false } = {}) {
    const list = this.querySelector("#events-list");
    const empty = this.querySelector("#events-empty");
    const status = this.querySelector("#events-status");
    if (!list || !empty || !status) {
      return;
    }
    status.textContent = hasItems ? `${count} mục gần nhất` : "Chưa có sự kiện";
    if (!hasItems) {
      list.innerHTML = "";
      list.classList.add("hidden");
      empty.textContent = emptyText;
      empty.classList.remove("hidden");
      return;
    }
    empty.classList.add("hidden");
    list.classList.remove("hidden");
    list.innerHTML = markup;
  }

  setRuntimeDetails(details = {}) {
    const entries = [
      ["runtime-current-stage", details.currentStage],
      ["runtime-stage-elapsed", details.stageElapsed],
      ["runtime-total-elapsed", details.totalElapsed],
      ["runtime-retry-count", details.retryCount],
      ["runtime-last-transition", details.lastTransition],
      ["runtime-terminal-reason", details.terminalReason],
      ["runtime-input-protocol", details.inputProtocol],
      ["runtime-stage-spec-version", details.stageSpecVersion],
      ["runtime-math-mode", details.mathMode],
    ];
    entries.forEach(([id, value]) => {
      const el = this.querySelector(`#${id}`);
      if (el) {
        el.textContent = value ?? "-";
      }
    });
  }

  setFailureDetails(details = {}) {
    const entries = [
      ["failure-summary", details.summary],
      ["failure-category", details.category],
      ["failure-stage", details.stage],
      ["failure-root-cause", details.rootCause],
      ["failure-suggestion", details.suggestion],
      ["failure-last-log-line", details.lastLogLine],
      ["failure-retryable", details.retryable],
    ];
    entries.forEach(([id, value]) => {
      const el = this.querySelector(`#${id}`);
      if (el) {
        el.textContent = value ?? "-";
      }
    });
  }

  setRerunAction({ enabled = false, status = "" } = {}) {
    const button = this.querySelector("#failure-rerun-btn");
    const statusEl = this.querySelector("#failure-rerun-status");
    if (button) {
      button.disabled = !enabled;
    }
    if (statusEl && status) {
      statusEl.textContent = status;
    }
  }

  renderSnapshot({
    headline = {},
    runtime = {},
    failure = {},
    stageHistory = {},
    events = {},
    rerun = {},
  } = {}) {
    this.setHeadline(headline);
    this.setRuntimeDetails(runtime);
    this.setFailureDetails(failure);
    this.setRerunAction(rerun);
    this.renderStageHistory(stageHistory);
    this.renderEvents(events);
  }

  renderTranslationSummary({
    counts = {},
    finalStatusCounts = {},
    providerFamily = "",
    emptyText = "",
    hidden = false,
    summaryScopeText = "-",
    filterText = "-",
  } = {}) {
    const content = this.querySelector("#translation-debug-content");
    const empty = this.querySelector("#translation-debug-empty");
    const status = this.querySelector("#translation-debug-status");
    const scope = this.querySelector("#translation-summary-scope");
    const filter = this.querySelector("#translation-list-filter");
    const normalizedCounts = Object.keys(finalStatusCounts || {}).length ? finalStatusCounts : (counts || {});
    const entries = [
      ["translation-count-translated", normalizedCounts.translated],
      ["translation-count-kept-origin", normalizedCounts.kept_origin],
      ["translation-count-skipped", normalizedCounts.skipped],
      ["translation-provider-family", providerFamily || "-"],
    ];
    entries.forEach(([id, value]) => {
      const el = this.querySelector(`#${id}`);
      if (el) {
        el.textContent = value ?? 0;
      }
    });
    if (status) {
      status.textContent = hidden ? "Chưa có dữ liệu gỡ lỗi dịch thuật" : "Xem theo item: giữ nguyên gốc, bỏ qua và kết quả phát lại";
    }
    if (scope) {
      scope.textContent = `Phạm vi thống kê tóm tắt：${summaryScopeText}`;
    }
    if (filter) {
      filter.textContent = `Bộ lọc danh sách hiện tại: ${filterText}`;
    }
    if (content) {
      content.classList.toggle("hidden", hidden);
    }
    if (empty) {
      empty.textContent = emptyText || "Chưa có dữ liệu gỡ lỗi dịch thuật";
      empty.classList.toggle("hidden", !hidden);
    }
  }

  renderTranslationItems({
    markup = "",
    hasItems = false,
    emptyText = "Không có item dịch thuật phù hợp",
    meta = "-",
    loading = false,
    pageLabel = "-",
    canPrev = false,
    canNext = false,
  } = {}) {
    const list = this.querySelector("#translation-items-list");
    const empty = this.querySelector("#translation-items-empty");
    const loadingEl = this.querySelector("#translation-items-loading");
    const metaEl = this.querySelector("#translation-items-meta");
    const pageEl = this.querySelector("#translation-items-page");
    const prevBtn = this.querySelector("#translation-items-prev");
    const nextBtn = this.querySelector("#translation-items-next");
    if (metaEl) {
      metaEl.textContent = meta;
    }
    if (pageEl) {
      pageEl.textContent = pageLabel;
    }
    if (prevBtn) {
      prevBtn.disabled = loading || !canPrev;
    }
    if (nextBtn) {
      nextBtn.disabled = loading || !canNext;
    }
    if (loadingEl) {
      loadingEl.classList.toggle("hidden", !loading);
    }
    if (!list || !empty) {
      return;
    }
    if (loading) {
      list.innerHTML = "";
      list.classList.add("hidden");
      empty.classList.add("hidden");
      return;
    }
    if (!hasItems) {
      list.innerHTML = "";
      list.classList.add("hidden");
      empty.textContent = emptyText;
      empty.classList.remove("hidden");
      return;
    }
    empty.classList.add("hidden");
    list.classList.remove("hidden");
    list.innerHTML = markup;
  }

  renderTranslationItemDetail({
    markup = "",
    meta = "-",
    hasItem = false,
    emptyText = "Vui lòng chọn item bên trái",
    loading = false,
    replayEnabled = false,
  } = {}) {
    const detail = this.querySelector("#translation-item-detail");
    const empty = this.querySelector("#translation-item-empty");
    const loadingEl = this.querySelector("#translation-item-loading");
    const metaEl = this.querySelector("#translation-item-meta");
    const replayButton = this.querySelector("#translation-item-replay");
    if (metaEl) {
      metaEl.textContent = meta;
    }
    if (loadingEl) {
      loadingEl.classList.toggle("hidden", !loading);
    }
    if (replayButton) {
      replayButton.disabled = !replayEnabled;
    }
    if (!detail || !empty) {
      return;
    }
    if (loading) {
      detail.innerHTML = "";
      detail.classList.add("hidden");
      empty.classList.add("hidden");
      return;
    }
    if (!hasItem) {
      detail.innerHTML = "";
      detail.classList.add("hidden");
      empty.textContent = emptyText;
      empty.classList.remove("hidden");
      return;
    }
    empty.classList.add("hidden");
    detail.classList.remove("hidden");
    detail.innerHTML = markup;
  }

  renderTranslationReplay({
    markup = "",
    hasResult = false,
    status = "-",
  } = {}) {
    const result = this.querySelector("#translation-replay-result");
    const statusEl = this.querySelector("#translation-replay-status");
    if (statusEl) {
      statusEl.textContent = status;
    }
    if (!result) {
      return;
    }
    if (!hasResult) {
      result.innerHTML = "";
      result.classList.add("hidden");
      return;
    }
    result.innerHTML = markup;
    result.classList.remove("hidden");
  }
}

if (!customElements.get("status-detail-dialog")) {
  customElements.define("status-detail-dialog", StatusDetailDialog);
}
