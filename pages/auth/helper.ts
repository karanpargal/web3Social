const STORAGE_KEY = "LH_STORAGE_KEY";

export function isTokenExpired(exp: number) {
  if (!exp) return true;
  if (Date.now() >= exp * 1000) return false;
  return true;
}

export function readAccessToken() {
  if (typeof window === "undefined") return null;

  const data = localStorage.getItem(STORAGE_KEY);

  return data
    ? (JSON.parse(data) as {
        accessToken: string;
        refreshToken: string;
        exp: number;
      })
    : null;
}

export function setAccessToken(accessToken: string, refreshToken: string) {
  const { exp } = parseJwt(accessToken);

  const ls = localStorage || window.localStorage;

  if (!ls) return;

  ls.setItem(
    STORAGE_KEY,
    JSON.stringify({
      accessToken,
      refreshToken,
      exp,
    })
  );
}

export function parseJwt(token: string) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
