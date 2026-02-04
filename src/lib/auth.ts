import { type Token, type Url, useSettingsStore } from "@/lib/store";
import { getErrorMessage } from "@/lib/utils";

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

  try {
    if (!username || !linkdingUrl || !token) throw new Error("Missing credentials.");

    const { isValid, errorMessage } = await validate({ token });

    if (!isValid && errorMessage) throw new Error(errorMessage);

    setUsername(username);
    setLinkdingUrl(linkdingUrl);
    setToken(token);
    return {
      isValid,
      errorMessage,
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    return {
      isValid: false,
      errorMessage,
    };
  }
}

export function logout() {
  const { setUsername, setLinkdingUrl, setToken } = useSettingsStore.getState();
  setUsername(null);
  setLinkdingUrl(null);
  setToken(null);
}

export async function isAuthenticated() {
  const { username, linkdingUrl, token } = useSettingsStore.getState();

  try {
    if (!username || !linkdingUrl || !token) throw new Error("Missing credentials.");

    if (!navigator.onLine) {
      return {
        isValid: true,
        errorMessage: null,
      };
    }

    const { isValid, errorMessage } = await validate({ token });

    if (!isValid && errorMessage) throw new Error(errorMessage);
    return {
      isValid,
      errorMessage: null,
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    return {
      isValid: false,
      errorMessage,
    };
  }
}

async function validate({ token }: { token: string }) {
  try {
    const res = await fetch("/api/user/profile/", {
      signal: AbortSignal.timeout(5000),
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Could not validate the API token.");
    }

    return {
      isValid: true,
      errorMessage: null,
    };
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);

    return {
      isValid: false,
      errorMessage,
    };
  }
}
