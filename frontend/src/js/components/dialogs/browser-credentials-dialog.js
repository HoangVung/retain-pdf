import {
  OCR_PROVIDER_DEFINITIONS,
  TRANSLATION_PROVIDER_DEFINITION,
  TRANSLATION_PROVIDER_DEFINITIONS,
} from "../../provider-config.js";

class BrowserCredentialsDialog extends HTMLElement {
  connectedCallback() {
    if (this.dataset.hydrated === "1") {
      return;
    }
    this.dataset.hydrated = "1";
    const ocrProviderOptions = OCR_PROVIDER_DEFINITIONS.map((provider) => `
      <option value="${provider.id}">${provider.label}</option>
    `).join("");
    const translationProviderOptions = TRANSLATION_PROVIDER_DEFINITIONS.map((provider) => `
      <option value="${provider.id}">${provider.label}</option>
    `).join("");
    const secretToggleIcon = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    `;
    const ocrProviderPanels = OCR_PROVIDER_DEFINITIONS.map((provider, index) => `
      <section class="credential-panel credential-provider-panel${index === 0 ? " is-active" : ""}" data-ocr-provider-panel="${provider.id}" role="tabpanel" ${index === 0 ? "" : "hidden"}>
        <div class="credential-card-head">
          <h3>${provider.tokenLabel}</h3>
          <a class="credential-card-link" href="${provider.docsUrl}" target="_blank" rel="noopener noreferrer">${provider.docsLabel}</a>
        </div>
        <label>
          <span class="credential-secret-field">
            <input id="browser-${provider.id}-token" type="password" autocomplete="off" placeholder="${provider.tokenPlaceholder}" />
            <button type="button" class="credential-secret-toggle" data-toggle-secret="browser-${provider.id}-token" aria-label="Hiện hoặc ẩn ${provider.tokenLabel}" title="Hiện hoặc ẩn">${secretToggleIcon}</button>
          </span>
        </label>
        <div class="credential-card-actions">
          ${provider.supportsValidation ? `<button id="browser-${provider.id}-validate-btn" type="button" class="secondary">${provider.validationButtonLabel}</button>` : ""}
          <span id="browser-${provider.id}-validation" class="token-inline-status hidden">${provider.validationIdleMessage}</span>
        </div>
      </section>
    `).join("");
    this.innerHTML = `
      <dialog id="browser-credentials-dialog" class="desktop-dialog">
        <form method="dialog" class="desktop-shell">
          <div class="desktop-head">
            <div class="credential-dialog-head">
              <h2 id="browser-credentials-title">Cài đặt API</h2>
              <p id="browser-credentials-subtitle" class="muted hidden"></p>
            </div>
            <button id="browser-credentials-close-btn" type="submit" class="dialog-close-btn" aria-label="Đóng">×</button>
          </div>
          <div class="desktop-body credential-dialog-body">
            <div id="browser-credentials-tabs" class="developer-tabs credential-tabs" role="tablist" aria-label="Cài đặt API">
              <button id="browser-credential-tab-api" type="button" class="developer-tab credential-tab is-active" data-credential-tab="api" role="tab" aria-selected="true">Cài đặt API</button>
              <button id="browser-credential-tab-task" type="button" class="developer-tab credential-tab" data-credential-tab="task" role="tab" aria-selected="false">Tùy chọn tác vụ</button>
            </div>
            <div class="credential-card-grid credential-panels">
              <section class="credential-panel is-active" data-credential-panel="api" role="tabpanel">
                <div class="credential-card-grid credential-card-grid-compact">
                  <section class="credential-card">
                    <div class="credential-card-head">
                      <h3>Thông tin OCR</h3>
                    </div>
                    <label>
                      <span class="developer-label">
                        <span>Dịch vụ</span>
                      </span>
                      <select id="browser-ocr-provider-select" aria-label="OCR Provider">
                        ${ocrProviderOptions}
                      </select>
                    </label>
                    <div class="credential-provider-panels">
                      ${ocrProviderPanels}
                    </div>
                  </section>

                  <section class="credential-card">
                    <div class="credential-card-head">
                      <h3>${TRANSLATION_PROVIDER_DEFINITION.label}</h3>
                      <a class="credential-card-link" href="${TRANSLATION_PROVIDER_DEFINITION.docsUrl}" target="_blank" rel="noopener noreferrer">${TRANSLATION_PROVIDER_DEFINITION.docsLabel}</a>
                    </div>
                    <label>
                      <span class="developer-label">
                        <span>Dịch vụ dịch</span>
                      </span>
                      <select id="browser-translation-provider-select" aria-label="Dịch vụ dịch">
                        ${translationProviderOptions}
                      </select>
                    </label>
                    <label>
                      <span class="developer-label">
                        <span>API Key</span>
                      </span>
                      <span class="credential-secret-field">
                        <input id="browser-api-key" type="password" autocomplete="off" placeholder="${TRANSLATION_PROVIDER_DEFINITION.keyPlaceholder}" />
                        <button type="button" class="credential-secret-toggle" data-toggle-secret="browser-api-key" aria-label="Hiện hoặc ẩn DeepSeek API Key" title="Hiện hoặc ẩn">${secretToggleIcon}</button>
                      </span>
                    </label>
                    <div class="credential-card-actions">
                      <button id="browser-deepseek-validate-btn" type="button" class="secondary">${TRANSLATION_PROVIDER_DEFINITION.validationButtonLabel}</button>
                      <span id="browser-deepseek-validation" class="token-inline-status hidden">${TRANSLATION_PROVIDER_DEFINITION.validationIdleMessage}</span>
                    </div>
                    <div id="browser-deepseek-account-status" class="credential-account-status hidden">
                      <span class="credential-account-label">Trạng thái tài khoản</span>
                      <strong id="browser-deepseek-account-summary">Chưa kiểm tra</strong>
                      <span id="browser-deepseek-account-time">-</span>
                    </div>
                  </section>
                </div>
              </section>

              <section class="credential-card credential-panel" data-credential-panel="task" role="tabpanel" hidden>
                <div class="credential-card-head">
                  <h3>Tùy chọn tác vụ</h3>
                </div>
                <label>
                  <span class="developer-label">
                    <span>Chế độ công thức</span>
                  </span>
                  <select id="browser-job-math-mode" aria-label="Chế độ công thức">
                    <option value="placeholder">Bảo vệ giữ chỗ</option>
                    <option value="direct_typst">Xuất công thức trực tiếp</option>
                  </select>
                </label>
                <label>
                  <span class="developer-label">
                    <span>Dịch sang</span>
                  </span>
                  <select id="browser-job-target-language" aria-label="Dịch sang">
                    <option value="Tiếng Việt">Tiếng Việt</option>
                    <option value="English">English</option>
                    <option value="简体中文">简体中文</option>
                  </select>
                </label>
              </section>
            </div>
            <div class="actions credential-dialog-actions">
              <span id="browser-credentials-status" class="upload-status hidden"></span>
              <button id="browser-credentials-save-btn" type="button">Lưu</button>
            </div>
          </div>
        </form>
      </dialog>
    `;
  }
}

if (!customElements.get("browser-credentials-dialog")) {
  customElements.define("browser-credentials-dialog", BrowserCredentialsDialog);
}
