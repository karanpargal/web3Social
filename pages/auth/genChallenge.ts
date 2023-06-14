import { fetcher } from "../graphql/auth-fetcher";
import {
  ChallengeQuery,
  ChallengeDocument,
  ChallengeQueryVariables,
} from "../graphql/generated";

export default async function generateChallenge(address: string) {
  return await fetcher<ChallengeQuery, ChallengeQueryVariables>(ChallengeDocument, {
    request: {
      address: address,
    },
  })();
}
