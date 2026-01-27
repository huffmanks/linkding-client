import { useSettingsStore } from "@/lib/store";

export async function linkdingFetch<T>(
  endpoint: string,
  { params, ...options }: RequestInit & { params?: Record<string, string> } = {}
): Promise<T> {
  const baseUrl = "/api";
  const { token } = useSettingsStore.getState();

  const path = endpoint.endsWith("/") ? endpoint : `${endpoint}/`;
  let url = `${baseUrl}/${path}`;

  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}
