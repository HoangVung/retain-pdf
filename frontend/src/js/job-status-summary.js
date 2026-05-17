function numberOrNull(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function firstNonEmpty(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

function stageKeyOf(payload) {
  return firstNonEmpty(payload.current_stage, payload.stage, payload.runtime?.current_stage).toLowerCase();
}

const USER_STAGE_FLOW = [
  {
    key: "ocr",
    label: "OCR Phân tích",
    detail: "Đang nhận dạng nội dung PDF",
    matches: ["ocr", "parse", "mineru", "paddle", "normaliz", "document"],
  },
  {
    key: "translate",
    label: "Dịch",
    detail: "Đang dịch nội dung chính",
    matches: ["translat"],
  },
  {
    key: "render",
    label: "Kết xuất",
    detail: "Đang tạo PDF đã dịch",
    matches: ["render", "sav"],
  },
];

const USER_STAGE_TOTAL = USER_STAGE_FLOW.length + 1;

const DETAIL_TEXT_MAP = [
  {
    matches: ["queue", "queued", "pending", "slot", "Xếp hàng"],
    detail: "Đang xếp hàng, chờ luồng xử lý khả dụng",
  },
  {
    matches: ["Khởi động OCR", "ocr job"],
    detail: "Đang khởi động tác vụ con OCR",
  },
  {
    matches: ["normaliz", "Chuẩn hóa", "standard", "document"],
    detail: "Đang sắp xếp kết quả OCR",
  },
  {
    matches: ["continuation_review", "Vượt cột", "Vượt trang", "Đoạn liên tục"],
    detail: "Đang kiểm tra đoạn liên tục vượt cột hoặc vượt trang",
  },
  {
    matches: ["page_policies", "Chiến lược trang", "Phân loại"],
    detail: "Đang xác định văn bản chính và nội dung giữ định dạng",
  },
  {
    matches: ["garbled", "Ký tự rác"],
    detail: "Đang sửa các đoạn có ký tự rác",
  },
  {
    matches: ["DịchHoàn thành", "Kết xuất", "render", "Tạo PDF"],
    detail: "Đang tạo PDF đã dịch",
  },
  {
    matches: ["ocr Hoàn thành", "Dịch", "translat"],
    detail: "Đang dịch nội dung chính",
  },
  {
    matches: ["sav", "Lưu"],
    detail: "Đang lưu tệp kết quả",
  },
];

function normalizedStageText(payload) {
  const stageKey = stageKeyOf(payload);
  const detail = firstNonEmpty(payload.stage_detail, payload.runtime?.current_stage);
  return `${stageKey} ${detail}`.toLowerCase();
}

function detailForPayload(payload, fallback) {
  const rawDetail = firstNonEmpty(payload.stage_detail, payload.runtime?.current_stage);
  const text = `${stageKeyOf(payload)} ${rawDetail}`.toLowerCase();
  const mapped = DETAIL_TEXT_MAP.find((item) => item.matches.some((keyword) => text.includes(keyword)));
  if (mapped) {
    return mapped.detail;
  }
  return rawDetail || fallback;
}

function userStageFlowIndex(text) {
  if (["render", "Kết xuất", "Tạo PDF", "sav", "Lưu"].some((keyword) => text.includes(keyword))) {
    return USER_STAGE_FLOW.findIndex((stage) => stage.key === "render");
  }
  if ([
    "translat",
    "Dịch",
    "Dịch",
    "continuation_review",
    "page_policies",
    "garbled",
    "Vượt cột",
    "Vượt trang",
    "Đoạn liên tục",
    "Chiến lược trang",
    "Phân loại",
    "Ký tự rác",
  ].some((keyword) => text.includes(keyword))) {
    return USER_STAGE_FLOW.findIndex((stage) => stage.key === "translate");
  }
  if (["ocr", "parse", "mineru", "paddle", "normaliz", "standard", "document", "Chuẩn hóa"].some((keyword) => text.includes(keyword))) {
    return USER_STAGE_FLOW.findIndex((stage) => stage.key === "ocr");
  }
  return -1;
}

function userStageFor(payload) {
  const text = normalizedStageText(payload);
  if (payload.status === "succeeded") {
    return {
      key: "done",
      label: "Hoàn thành",
      detail: "PDF đã dịch đã được tạo",
      step: USER_STAGE_TOTAL,
      total: USER_STAGE_TOTAL,
    };
  }
  if (payload.status === "failed") {
    return {
      key: "failed",
      label: "Thất bại",
      detail: "Tác vụ thất bại, vui lòng xem chi tiết",
      step: null,
      total: USER_STAGE_TOTAL,
    };
  }
  if (payload.status === "canceled") {
    return {
      key: "canceled",
      label: "Đã hủy",
      detail: "Tác vụ đã hủy",
      step: null,
      total: USER_STAGE_TOTAL,
    };
  }
  if (payload.status === "queued" || text.includes("queue") || text.includes("pending") || text.includes("Xếp hàng")) {
    return {
      key: "queued",
      label: "Đang xếp hàng",
      detail: detailForPayload(payload, "Đang chờ luồng xử lý khả dụng"),
      step: null,
      total: USER_STAGE_TOTAL,
    };
  }
  const matchIndex = userStageFlowIndex(text);
  if (matchIndex >= 0) {
    const stage = USER_STAGE_FLOW[matchIndex];
    return {
      ...stage,
      detail: detailForPayload(payload, stage.detail),
      step: matchIndex + 1,
      total: USER_STAGE_TOTAL,
    };
  }
  if (payload.status === "running") {
    return {
      key: "running",
      label: "Đang xử lý",
      detail: detailForPayload(payload, "Đang xử lý tác vụ"),
      step: null,
      total: USER_STAGE_TOTAL,
    };
  }
  return {
    key: "idle",
    label: "Đang đợi",
    detail: "Chờ tác vụ bắt đầu",
    step: null,
    total: USER_STAGE_TOTAL,
  };
}

function userStageLabel(payload) {
  const stage = userStageFor(payload);
  if (stage.step && stage.total && payload.status !== "succeeded") {
    return `Bước ${stage.step}/${stage.total} · ${stage.label}`;
  }
  return stage.label;
}

export function summarizeStageProgressText(payload) {
  const current = numberOrNull(payload.progress_current ?? payload.progress?.current);
  const total = numberOrNull(payload.progress_total ?? payload.progress?.total);
  if (current === null || total === null || total <= 0) {
    return "";
  }
  const stageKey = stageKeyOf(payload);
  const stage = userStageFor(payload);
  if (stageKey.includes("continuation") || stageKey.includes("page_policies")) {
    return `Trang ${current}/${total}`;
  }
  if (stage.key === "translate") {
    return `Lô ${current}/${total}`;
  }
  if (stage.key === "ocr") {
    return `Trang ${current}/${total}`;
  }
  if (stage.key === "render") {
    return `Trang ${current}/${total}`;
  }
  return `Tiến độ ${current}/${total}`;
}

export function summarizeStageLabel(payload) {
  return userStageLabel(payload);
}

export function summarizeStageKey(payload) {
  return userStageFor(payload).key;
}

export function summarizeStageDetail(payload) {
  const failureDetail = firstNonEmpty(payload.failure?.summary);
  if (failureDetail) {
    return failureDetail;
  }
  const stage = userStageFor(payload);
  return stage.detail || stage.label || "-";
}
