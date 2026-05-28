export interface N8nPayload {
  product_category: string;
  skin_type: string;
  age_group: string;
  design_type: string;
  highlight?: string;
  file?: { name: string; size: number; type: string } | null;
}

export async function callN8n(payload: N8nPayload) {
  const url = import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined;

  if (!url) {
    throw new Error("VITE_N8N_WEBHOOK_URL 환경변수가 설정되지 않았습니다.");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`n8n 웹훅 요청 실패 (${response.status}): ${text}`);
  }

  return response.json();
}
