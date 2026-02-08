import { useSettingsStore } from "@/lib/store";
import { cleanUrl } from "@/lib/utils";

export async function linkdingFetch<T>(
  endpoint: string,
  { params, ...options }: RequestInit & { params?: Record<string, string> } = {}
): Promise<T> {
  const { token } = useSettingsStore.getState();

  const path = endpoint.endsWith("/") ? endpoint : `${endpoint}/`;
  let url = `/api/${path}`;

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
    const error = new Error(`API Error: ${response.status} ${response.statusText}`) as any;
    error.status = response.status;
    throw error;
  }

  const data = await response.json();

  return JSON.parse(JSON.stringify(data), (_key, value) => {
    if (typeof value === "string" && value.includes("/static/")) {
      return cleanUrl(value);
    }
    return value;
  });
}
