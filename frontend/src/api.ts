export type WaterRequestPayload = {
  applicant_name: string;
  email: string;
  phone: string;
  address_noida: string;
  water_source_type: string;
};

export type ApiResult<T> = { data: T; error?: string; usingDemoData: boolean };

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

export async function fetchApi<T>(path: string, fallback: T): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${API_BASE}${path}`, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`API request failed (${response.status}).`);
    return { data: (await response.json()) as T, usingDemoData: false };
  } catch (error) {
    return {
      data: fallback,
      error: error instanceof Error ? error.message : "API is unavailable.",
      usingDemoData: true,
    };
  }
}

export async function submitWaterRequest(payload: WaterRequestPayload) {
  const response = await fetch(`${API_BASE}/water-test-requests/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok) {
    const message = Object.values(result).flat().join(" ");
    throw new Error(message || `Request failed (${response.status}).`);
  }
  return result as { ticket_id: string; status: string };
}

export async function submitEffluentReport(form: FormData) {
  const response = await fetch(`${API_BASE}/effluent-reports/`, { method: "POST", body: form });
  const result = await response.json();
  if (!response.ok) {
    const message = Object.values(result).flat().join(" ");
    throw new Error(message || `Report failed (${response.status}).`);
  }
  return result as { id: number; status: string };
}

export async function submitRsvp(payload: { name: string; email: string; drive_date: string }) {
  const response = await fetch(`${API_BASE}/drive-rsvps/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok) {
    const message = Object.values(result).flat().join(" ");
    throw new Error(message || `RSVP failed (${response.status}).`);
  }
  return result as { id: number; status: string };
}
