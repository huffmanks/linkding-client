import { type Token, type Url, useSettingsStore } from "@/lib/store";

export async function login({
  username,
  linkdingUrl,
  token,
}: {
  username: string;
  linkdingUrl: Url;
  token: Token;
}) {
  const { setUsername, setLinkdingUrl, setToken } = useSettingsStore.getState();

  if (!username || !token || !linkdingUrl) return false;

  const isValid = await validate({ token });

  if (isValid) {
    setUsername(username);
    setLinkdingUrl(linkdingUrl);
    setToken(token);
    return true;
  } else {
    console.error("Failed to validate Linkding API token.");
    return false;
  }
}

export function logout() {
  const { setUsername, setLinkdingUrl, setToken } = useSettingsStore.getState();
  setUsername(null);
  setLinkdingUrl(null);
  setToken(null);
}

export async function isAuthenticated(): Promise<boolean> {
  const { username, linkdingUrl, token } = useSettingsStore.getState();

  if (!username || !linkdingUrl || !token) {
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
