class PageRangeSummary extends HTMLElement {
  connectedCallback() {
    this.classList.add("page-range-summary");
    if (!this.textContent.trim()) {
      this.textContent = "Trang đã chọn: -";
    }
    if (!this.classList.contains("hidden") && this.textContent.includes("Trang đã chọn: -")) {
      this.classList.add("hidden");
    }
  }
}

if (!customElements.get("page-range-summary")) {
  customElements.define("page-range-summary", PageRangeSummary);
}
