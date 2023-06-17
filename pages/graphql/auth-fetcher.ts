import { readAccessToken, isTokenExpired } from "../auth/helper";
import { refreshToken } from "../auth/refreshToken";

export const fetcher = <TData, TVariables>(
  query: string,
  variables?: TVariables,
  options?: RequestInit["headers"]
): (() => Promise<TData>) => {


  async function getAccessToken() {
    const token = readAccessToken();
    if (!token) return null;
    let accessToken = token?.accessToken;

    if (isTokenExpired(token.exp)) {
      accessToken = await refreshToken();
    }
    return accessToken;
  }

  return async () => {
    const res = await fetch("https://api-mumbai.lens.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": (await getAccessToken()) || "",
        "Access-Control-Allow-Origin": "*",
        ...options,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0] || {};
      console.log(message);
      throw new Error(message || "Error…");
    }

    return json.data;
  };
};
