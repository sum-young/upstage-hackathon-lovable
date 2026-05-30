export interface N8nPayload {
  product_category: string;
  skin_type: string;
  age_group: string;
  design_type: string;
  highlight?: string;
  file?: File | null;
}

export async function callN8n(payload: N8nPayload) {
  const url = "http://34.82.49.126:5678/webhook-test/cosmetic-copy
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
  }

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`n8n 웹훅 요청 실패 (${response.status}): ${text}`);
  }

  return response.json();
}
