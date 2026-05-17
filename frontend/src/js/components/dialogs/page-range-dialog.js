class PageRangeDialog extends HTMLElement {
  connectedCallback() {
    if (this.dataset.hydrated === "1") {
      return;
    }
    this.dataset.hydrated = "1";
    this.innerHTML = `
      <dialog id="page-range-dialog" class="desktop-dialog page-range-dialog">
        <form method="dialog" class="desktop-shell">
          <div class="desktop-head">
            <h2 id="page-range-title">Dịch theo trang</h2>
            <button id="page-range-close-btn" type="submit" class="dialog-close-btn" aria-label="Đóng">×</button>
          </div>
          <div class="desktop-body">
            <p id="page-range-limit-text" class="muted">Giới hạn bản dịch theo phạm vi trang, trang bắt đầu từ 1.</p>
            <div class="grid two">
              <label>
                <span>Trang bắt đầu</span>
                <input id="page-range-start" type="number" min="1" step="1" inputmode="numeric" autocomplete="off" placeholder="Ví dụ 1" />
              </label>
              <label>
                <span>Trang kết thúc</span>
                <input id="page-range-end" type="number" min="1" step="1" inputmode="numeric" autocomplete="off" placeholder="Ví dụ 15" />
              </label>
            </div>
            <div class="actions">
              <button id="page-range-clear-btn" type="button" class="secondary">Xóa</button>
              <button id="page-range-apply-btn" type="button">Áp dụng</button>
            </div>
          </div>
        </form>
      </dialog>
    `;
  }
}

if (!customElements.get("page-range-dialog")) {
  customElements.define("page-range-dialog", PageRangeDialog);
}
