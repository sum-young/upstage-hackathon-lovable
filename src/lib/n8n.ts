export interface N8nPayload {
  product_category: string;
  skin_type: string;
  age_group: string;
  design_type: string;
  highlight?: string;
  file?: File | null;
}

export async function callN8n(payload: N8nPayload) {
  const url = "https://detail-earpiece-owl.ngrok-free.dev/webhook-test/cosmetic-copy";
  if (!url || url.includes("여기에")) {
    throw new Error("n8n 웹훅 URL이 입력되지 않았습니다. 코드를 확인해주세요.");
  }

  const formData = new FormData();

  formData.append("product_category", payload.product_category);
  formData.append("skin_type", payload.skin_type);
  formData.append("age_group", payload.age_group);
  formData.append("design_type", payload.design_type);
  if (payload.highlight) {
    formData.append("highlight", payload.highlight);
  }

  if (payload.file) {
    formData.append("file", payload.file);
    console.log(payload.file);
  }

  // n8n 워크플로우 응답이 오래 걸릴 수 있으므로 최대 5분까지 기다린다.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000);

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`n8n 웹훅 요청 실패 (${response.status}): ${text}`);
  }

  return response.json();
}
