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

    const result = await fetcher<RefreshMutation, RefreshMutationVariables>(RefreshDocument, {
        request: {
          refreshToken: refreshToken,
        },
      })();

    setAccessToken(result.refresh.accessToken, result.refresh.refreshToken);

    return result.refresh.accessToken;
}
