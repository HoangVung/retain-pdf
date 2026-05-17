class DeveloperSettingsDialog extends HTMLElement {
  connectedCallback() {
    if (this.dataset.hydrated === "1") {
      return;
    }
    this.dataset.hydrated = "1";
    this.innerHTML = `
      <dialog id="developer-dialog" class="desktop-dialog">
        <form method="dialog" class="desktop-shell">
          <div class="desktop-head">
            <div class="credential-dialog-head">
              <h2>Cài đặt nhà phát triển</h2>
            </div>
            <button id="developer-close-btn" type="submit" class="dialog-close-btn" aria-label="Đóng">×</button>
          </div>
          <div class="desktop-body credential-dialog-body developer-dialog-body">
            <div class="developer-tabs" role="tablist" aria-label="Cài đặt nhà phát triển">
              <button id="developer-tab-model" type="button" class="developer-tab is-active" data-developer-tab="model" role="tab" aria-selected="true">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 7.5h16M4 12h10M4 16.5h7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                </svg>
                <span>Mô hình</span>
              </button>
              <button id="developer-tab-runtime" type="button" class="developer-tab" data-developer-tab="runtime" role="tab" aria-selected="false">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 3.5v3m0 11v3m8.5-8.5h-3m-11 0h-3M18.01 5.99l-2.12 2.12M8.11 15.89l-2.12 2.12m0-12.02 2.12 2.12m7.78 7.78 2.12 2.12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                  <circle cx="12" cy="12" r="3.2" stroke="currentColor" stroke-width="1.6"/>
                </svg>
                <span>Thực thi</span>
              </button>
            </div>

            <div class="developer-panels">
              <section id="developer-panel-model" class="developer-panel is-active" data-developer-panel="model" role="tabpanel">
                <div class="credential-card compact-card">
                  <label>
                    <span>Quy trình tác vụ</span>
                    <select id="developer-workflow">
                      <option value="book">book · OCR + Dịch + Kết xuất</option>
                      <option value="translate">translate · OCR + Dịch</option>
                      <option value="render">render · Dùng lại kết quả tác vụ đã có để kết xuất lại</option>
                    </select>
                  </label>
                  <label id="developer-render-source-wrap" class="hidden">
                    <span>ID tác vụ nguồn để kết xuất</span>
                    <input id="developer-render-source-job-id" type="text" autocomplete="off" placeholder="Điền job_id đã có" />
                  </label>
                  <p id="developer-workflow-note" class="muted">\`book\` sẽ chạy đầy đủ OCR, dịch và kết xuất PDF.</p>
                  <label>
                    <span>Mô hình Base URL</span>
                    <input id="developer-base-url" type="text" autocomplete="off" placeholder="Ví dụ https://api.deepseek.com/v1" />
                  </label>
                  <label>
                    <span>Tên mô hình</span>
                    <input id="developer-model" type="text" autocomplete="off" placeholder="Ví dụ deepseek-v4-flash" />
                  </label>
                </div>
              </section>

              <section id="developer-panel-runtime" class="developer-panel" data-developer-panel="runtime" role="tabpanel" hidden>
                <div class="credential-card compact-card">
                  <div class="grid two developer-grid">
                    <label>
                      <span class="developer-label">
                        <span>Đồng thời dịch</span>
                        <button type="button" class="developer-hint" aria-label="Giải thích đồng thời dịch" data-tooltip="Số tác vụ gửi đồng thời tới mô hình dịch. Giá trị cao thường nhanh hơn nhưng dễ bị giới hạn tốc độ hơn.">i</button>
                      </span>
                      <input id="developer-workers" type="number" min="1" step="1" inputmode="numeric" />
                    </label>
                    <label>
                      <span class="developer-label">
                        <span>Đồng thời kết xuất</span>
                        <button type="button" class="developer-hint" aria-label="Giải thích đồng thời kết xuất" data-tooltip="Số lượng cho phép khi kết xuất và biên dịch PDF cuối cùng.">i</button>
                      </span>
                      <input id="developer-compile-workers" type="number" min="1" step="1" inputmode="numeric" />
                    </label>
                    <label>
                      <span class="developer-label">
                        <span>Cỡ lô dịch</span>
                        <button type="button" class="developer-hint" aria-label="Giải thích cỡ lô dịch" data-tooltip="Kích thước lô văn bản gửi tới mô hình dịch mỗi lần. Quá lớn có thể ảnh hưởng độ ổn định.">i</button>
                      </span>
                      <input id="developer-batch-size" type="number" min="1" step="1" inputmode="numeric" />
                    </label>
                    <label>
                      <span class="developer-label">
                        <span>Cỡ lô phân loại</span>
                        <button type="button" class="developer-hint" aria-label="Giải thích cỡ lô phân loại" data-tooltip="Cỡ lô dùng khi nhận diện lĩnh vực tài liệu và phân loại chiến lược.">i</button>
                      </span>
                      <input id="developer-classify-batch-size" type="number" min="1" step="1" inputmode="numeric" />
                    </label>
                    <label class="developer-span-full">
                      <span class="developer-label">
                        <span>Số giây hết hạn</span>
                        <button type="button" class="developer-hint" aria-label="Giải thích số giây hết hạn" data-tooltip="Tổng thời gian chờ của một tác vụ. Quá thời gian này tác vụ sẽ bị backend dừng.">i</button>
                      </span>
                      <input id="developer-timeout-seconds" type="number" min="1" step="1" inputmode="numeric" />
                    </label>
                  </div>
                </div>
              </section>
            </div>
            <div class="actions credential-dialog-actions">
              <button id="developer-reset-btn" type="button" class="secondary">Khôi phục mặc định</button>
              <button id="developer-save-btn" type="button">Lưu</button>
            </div>
          </div>
        </form>
      </dialog>
    `;
  }
}

if (!customElements.get("developer-settings-dialog")) {
  customElements.define("developer-settings-dialog", DeveloperSettingsDialog);
}
