import { useSettingsStore } from "@/lib/store";

export async function login({ username }: { username: string }) {
  const token = import.meta.env.VITE_LINKDING_API_TOKEN;

  if (!token) return false;

  const isValid = await validate({ token });

  if (isValid) {
    const { setUsername, setToken } = useSettingsStore.getState();

    setUsername(username);
    setToken(token);
    return true;
  } else {
    console.error("Failed to validate Linkding API token.");
    return false;
  }
}

export function logout() {
  const { setUsername, setToken } = useSettingsStore.getState();
  setUsername(null);
  setToken(null);
}

export async function isAuthenticated(): Promise<boolean> {
  const { username, token } = useSettingsStore.getState();

  if (!token || !username) {
    return false;
  }

  return await validate({ token });
}

async function validate({ token }: { token: string }) {
  try {
    const res = await fetch(`/api/user/profile/`, {
      signal: AbortSignal.timeout(5000),
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });

    return res.ok;
  } catch (error) {
    return false;
  }
}
