import { useSettingsStore } from "@/lib/store";
import { cleanUrl } from "@/lib/utils";

export async function linkdingFetch<T>(
  endpoint: string,
  { params, ...options }: RequestInit & { params?: Record<string, string> } = {}
): Promise<T> {
  const { token } = useSettingsStore.getState();

  const path = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const normalizedPath = path.endsWith("/") ? path : `${path}/`;
  let url = `/api/${normalizedPath}`;

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
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.detail || `API Error: ${response.status}`) as any;
    error.status = response.status;
    error.response = response;
    throw error;
  }

  if (response.status === 204) return {} as T;

  const data = await response.json();

  return JSON.parse(JSON.stringify(data), (_key, value) => {
    if (typeof value === "string" && value.includes("/static/")) {
      return cleanUrl(value);
    }
    return value;
  });
}
