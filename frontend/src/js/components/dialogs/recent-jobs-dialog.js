class RecentJobsDialog extends HTMLElement {
  connectedCallback() {
    if (this.dataset.hydrated === "1") {
      return;
    }
    this.dataset.hydrated = "1";
    this.innerHTML = `
      <dialog id="query-dialog" class="desktop-dialog recent-jobs-dialog">
        <form method="dialog" class="desktop-shell recent-jobs-dialog-shell">
          <div class="recent-jobs-sidebar-head">
            <div class="recent-jobs-head">
              <h2>Tác vụ gần đây</h2>
              <p>Sắp xếp theo thời gian cập nhật gần nhất, nhấp để chuyển thẳng đến tác vụ.</p>
            </div>
            <button id="query-dialog-close-btn" type="submit" class="dialog-close-btn" aria-label="Đóng">×</button>
          </div>
          <div class="recent-jobs-sidebar-body">
            <div class="recent-jobs-toolbar">
              <input id="recent-jobs-date" type="date" aria-label="Chọn ngày" />
              <button id="refresh-jobs-btn" class="secondary" type="button">Làm mới danh sách</button>
            </div>
            <div id="recent-jobs-summary" class="status-panel-note">Stage Spec 0 · Legacy CLI 0 · Unknown 0</div>
            <div id="recent-jobs-empty" class="events-empty hidden">Chưa có tác vụ gần đây</div>
            <div id="recent-jobs-list" class="recent-jobs-list hidden"></div>
            <div class="recent-jobs-more-row">
              <button id="load-more-jobs-btn" class="secondary hidden" type="button">Thêm</button>
            </div>
          </div>
        </form>
      </dialog>
    `;
  }

  summaryElement() {
    return this.querySelector("#recent-jobs-summary");
  }

  listElement() {
    return this.querySelector("#recent-jobs-list");
  }

  emptyElement() {
    return this.querySelector("#recent-jobs-empty");
  }

  loadMoreButton() {
    return this.querySelector("#load-more-jobs-btn");
  }

  renderSummary(text) {
    const summary = this.summaryElement();
    if (summary) {
      summary.textContent = text;
    }
  }

  renderLoading() {
    const list = this.listElement();
    const empty = this.emptyElement();
    const loadMoreButton = this.loadMoreButton();
    if (!list || !empty || !loadMoreButton) {
      return;
    }
    empty.classList.add("hidden");
    list.classList.remove("hidden");
    list.innerHTML = '<div class="events-empty">Đang tải tác vụ gần đây…</div>';
    loadMoreButton.classList.add("hidden");
  }

  renderEmpty(message) {
    const list = this.listElement();
    const empty = this.emptyElement();
    const loadMoreButton = this.loadMoreButton();
    if (!list || !empty || !loadMoreButton) {
      return;
    }
    list.innerHTML = "";
    list.classList.add("hidden");
    empty.textContent = message || "Chưa có tác vụ gần đây";
    empty.classList.remove("hidden");
    loadMoreButton.classList.add("hidden");
    loadMoreButton.disabled = false;
    loadMoreButton.textContent = "Thêm";
  }

  renderError(message, { reset = false } = {}) {
    const list = this.listElement();
    const empty = this.emptyElement();
    const loadMoreButton = this.loadMoreButton();
    if (!list || !empty || !loadMoreButton) {
      return;
    }
    if (reset) {
      list.innerHTML = "";
      list.classList.add("hidden");
      empty.textContent = message || "Đọc tác vụ gần đây thất bại";
      empty.classList.remove("hidden");
    } else {
      loadMoreButton.classList.add("hidden");
    }
    loadMoreButton.disabled = false;
    loadMoreButton.textContent = "Thêm";
  }

  renderList(markup, { reset = false, hasMore = false, onSelect } = {}) {
    const list = this.listElement();
    const empty = this.emptyElement();
    const loadMoreButton = this.loadMoreButton();
    if (!list || !empty || !loadMoreButton) {
      return;
    }
    list.classList.remove("hidden");
    empty.classList.add("hidden");
    list.innerHTML = reset ? markup : `${list.innerHTML}${markup}`;
    loadMoreButton.classList.toggle("hidden", !hasMore);
    loadMoreButton.disabled = false;
    loadMoreButton.textContent = "Thêm";
    list.querySelectorAll(".recent-job-item").forEach((button) => {
      button.addEventListener("click", () => {
        onSelect?.(button.dataset.jobId || "");
      });
    });
  }

  setLoadMoreLoading() {
    const loadMoreButton = this.loadMoreButton();
    if (!loadMoreButton) {
      return;
    }
    loadMoreButton.disabled = true;
    loadMoreButton.textContent = "Đang tải…";
  }
}

if (!customElements.get("recent-jobs-dialog")) {
  customElements.define("recent-jobs-dialog", RecentJobsDialog);
}
