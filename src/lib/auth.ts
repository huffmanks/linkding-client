import { LS_LINKDING_TOKEN, LS_LINKDING_USERNAME } from "@/lib/constants";

export async function login({ token, username }: { token: string; username: string }) {
  const isValid = await validate({ token });

  if (isValid) {
    localStorage.setItem(LS_LINKDING_TOKEN, token);
    localStorage.setItem(LS_LINKDING_USERNAME, username);
    return true;
  } else {
    console.error("Failed to validate Linkding session.");
    return false;
  }
}

export function logout() {
  localStorage.removeItem(LS_LINKDING_TOKEN);
  localStorage.removeItem(LS_LINKDING_USERNAME);
}

export function getUsername() {
  const username = localStorage.getItem(LS_LINKDING_USERNAME);

  return username ? username : "Default";
}

export async function isAuthenticated(): Promise<boolean> {
  const token = localStorage.getItem(LS_LINKDING_TOKEN);
  const username = localStorage.getItem(LS_LINKDING_USERNAME);

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
