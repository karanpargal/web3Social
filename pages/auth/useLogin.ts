import { useAddress, useSDK } from "@thirdweb-dev/react";
import generateChallenge from "./genChallenge";
import { useAuthenticateMutation } from "../graphql/generated";
import { useMutation } from "@tanstack/react-query";
import { setAccessToken } from "./helper";

export default function useLogin() {
  const address = useAddress();
  const sdk = useSDK();

  const { mutateAsync: sendAuthenticate } = useAuthenticateMutation();

  async function login() {
    if (!address) throw new Error("Wallet not connected");
    const { challenge } = await generateChallenge(address);
    const signature = await sdk?.wallet.sign(challenge.text);
    const { authenticate } = await sendAuthenticate({
      request: {
        address: address,
        signature: signature,
      },
    });

    const { accessToken, refreshToken } = authenticate;

    setAccessToken(accessToken, refreshToken);

    

  }

  return useMutation(login);
}
