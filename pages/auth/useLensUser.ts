import { useQuery } from "@tanstack/react-query";
import { useAddress } from "@thirdweb-dev/react";
import { readAccessToken } from "./helper";
import { useDefaultProfileQuery } from "../graphql/generated";

export default function useLensUser() {
  const address = useAddress();
  const localStorageQuery = useQuery(["lens-user", address], () => {
    const { accessToken, refreshToken, exp } = readAccessToken() || {};
    return { accessToken, refreshToken, exp };
  });


  const profileQuery = useDefaultProfileQuery(
    {
      request: {
        ethereumAddress: address,
      },
    },
    {
      enabled: !!address,
    }
  );

  return {
    tokenData: localStorageQuery,
    profileData: profileQuery,
  };
}
