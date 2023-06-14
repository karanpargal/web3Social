import React from "react";
import {
  useAddress,
  useNetworkMismatch,
  useSwitchChain,
  ConnectWallet,
} from "@thirdweb-dev/react";

type Props = {};

export default function SignIn({}: Props) {
  const address = useAddress();
  const isWrongNetwork = useNetworkMismatch();
  const switchChain = useSwitchChain();

  if (!address) {
    return (
      <div>
        <ConnectWallet />
      </div>
    );
  }

  if (isWrongNetwork) {
    return (
      <div>
        <button onClick={() => switchChain(137)}>Switch to Polygon</button>
      </div>
    );
  }

  
}
