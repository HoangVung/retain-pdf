export const DEFAULT_OCR_PROVIDER = "mineru";

export const OCR_PROVIDER_DEFINITIONS = [
  {
    id: "paddle",
    label: "PaddleOCR",
    description: "OCR trực tuyến.",
    tokenField: "paddle_token",
    runtimeConfigKey: "paddleToken",
    tokenLabel: "Paddle Access Token",
    tokenPlaceholder: "Paddle Access Token",
    validationButtonLabel: "Kiểm tra Paddle",
    validationIdleMessage: "Chưa kiểm tra",
    validationMissingMessage: "Vui lòng điền Paddle Access Token.",
    validationUnavailableMessage: "",
    docsUrl: "https://aistudio.baidu.com/account/accessToken",
    docsLabel: "Nhận Token",
    supportsValidation: true,
  },
  {
    id: "mineru",
    label: "MinerU",
    description: "OCR và nhận dạng bố cục.",
    tokenField: "mineru_token",
    runtimeConfigKey: "mineruToken",
    tokenLabel: "MinerU Token",
    tokenPlaceholder: "MinerU Token",
    validationButtonLabel: "Kiểm tra MinerU",
    validationIdleMessage: "Chưa kiểm tra",
    validationMissingMessage: "Vui lòng điền MinerU Token.",
    validationUnavailableMessage: "",
    docsUrl: "https://mineru.net/apiManage/docs?openApplyModal=true",
    docsLabel: "Nhận Token",
    supportsValidation: true,
  },
  {
    id: "openai",
    label: "OpenAI OCR",
    description: "OCR bằng model vision của OpenAI.",
    tokenField: "ai_ocr_api_key",
    runtimeConfigKey: "aiOcrApiKey",
    tokenLabel: "OpenAI API Key",
    tokenPlaceholder: "OpenAI API Key",
    validationButtonLabel: "Kiểm tra OpenAI",
    validationIdleMessage: "Chưa kiểm tra",
    validationMissingMessage: "Vui lòng điền OpenAI API Key.",
    validationUnavailableMessage: "Kiểm tra OCR OpenAI chưa hỗ trợ.",
    docsUrl: "https://platform.openai.com/api-keys",
    docsLabel: "Nhận Key",
    supportsValidation: false,
  },
  {
    id: "google",
    label: "Google OCR",
    description: "OCR bằng Gemini vision.",
    tokenField: "ai_ocr_api_key",
    runtimeConfigKey: "aiOcrApiKey",
    tokenLabel: "Google API Key",
    tokenPlaceholder: "Google AI Studio API Key",
    validationButtonLabel: "Kiểm tra Google",
    validationIdleMessage: "Chưa kiểm tra",
    validationMissingMessage: "Vui lòng điền Google API Key.",
    validationUnavailableMessage: "Kiểm tra OCR Google chưa hỗ trợ.",
    docsUrl: "https://aistudio.google.com/app/apikey",
    docsLabel: "Nhận Key",
    supportsValidation: false,
  },
];

export const TRANSLATION_PROVIDER_DEFINITION = {
  id: "deepseek",
  label: "DeepSeek",
  keyLabel: "DeepSeek Key",
  keyPlaceholder: "DeepSeek API Key",
  description: "Mô hình dịch.",
  docsUrl: "https://platform.deepseek.com/api_keys",
  docsLabel: "Nhận Key",
  validationButtonLabel: "Kiểm tra DeepSeek",
  validationIdleMessage: "Chưa kiểm tra",
  validationMissingMessage: "Vui lòng điền Key DeepSeek.",
  validationSuccessMessage: "Kết nối DeepSeek thành công.",
  validationNetworkMessage: "Kiểm tra DeepSeek thất bại, vui lòng kiểm tra mạng hoặc giới hạn CORS của trình duyệt.",
  validationUnauthorizedMessage: "DeepSeek Key không hợp lệ hoặc đã hết hạn.",
};

export const TRANSLATION_PROVIDER_DEFINITIONS = [
  {
    id: "deepseek",
    label: "DeepSeek",
    model: "deepseek-v4-flash",
    baseUrl: "https://api.deepseek.com/v1",
    docsUrl: "https://platform.deepseek.com/api_keys",
  },
  {
    id: "openai",
    label: "OpenAI",
    model: "gpt-4.1-mini",
    baseUrl: "https://api.openai.com/v1",
    docsUrl: "https://platform.openai.com/api-keys",
  },
  {
    id: "google",
    label: "Google Gemini",
    model: "gemini-2.5-flash",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    docsUrl: "https://aistudio.google.com/app/apikey",
  },
];

export function normalizeTranslationProvider(value) {
  const provider = `${value || ""}`.trim().toLowerCase();
  return TRANSLATION_PROVIDER_DEFINITIONS.some((item) => item.id === provider) ? provider : "deepseek";
}

export function getTranslationProviderDefinition(provider) {
  return TRANSLATION_PROVIDER_DEFINITIONS.find((item) => item.id === normalizeTranslationProvider(provider))
    || TRANSLATION_PROVIDER_DEFINITIONS[0];
}

export function normalizeOcrProvider(value) {
  const provider = `${value || ""}`.trim().toLowerCase();
  return OCR_PROVIDER_DEFINITIONS.some((item) => item.id === provider) ? provider : DEFAULT_OCR_PROVIDER;
}

export function getOcrProviderDefinition(provider) {
  return OCR_PROVIDER_DEFINITIONS.find((item) => item.id === normalizeOcrProvider(provider)) || OCR_PROVIDER_DEFINITIONS[0];
}
