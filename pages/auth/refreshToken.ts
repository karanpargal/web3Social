import { fetcher } from "../graphql/auth-fetcher";
import {
  RefreshMutation,
  RefreshMutationVariables,
  RefreshDocument,
} from "../graphql/generated";
import { readAccessToken, setAccessToken } from "./helper";

export async function refreshToken() {
  const refreshToken = readAccessToken()?.refreshToken;

  if (!refreshToken) throw new Error("No refresh token");

  async function fetchData<TData, TVariables>(
    query: string,
    variables?: TVariables,
    options?: RequestInit["headers"]
  ): Promise<TData> {
    const res = await fetch("https://api-mumbai.lens.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
      throw new Error(message || "Error…");
    }

    return json.data;
  }

  const result = await fetchData<RefreshMutation, RefreshMutationVariables>(
    RefreshDocument,
    {
      request: {
        refreshToken: refreshToken,
      },
    }
  );

  setAccessToken(result.refresh.accessToken, result.refresh.refreshToken);

  return result.refresh.accessToken;
}
