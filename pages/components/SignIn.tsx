import React from "react";
import {
  useAddress,
  useNetworkMismatch,
  useSwitchChain,
  ConnectWallet,
} from "@thirdweb-dev/react";
import useLensUser from "../auth/useLensUser";
import useLogin from "../auth/useLogin";

type Props = {};

export default function SignIn({}: Props) {
  const address = useAddress();
  const isWrongNetwork = useNetworkMismatch();
  const switchChain = useSwitchChain();
  const { tokenData, profileData} = useLensUser();
  const { mutate: requestLogin } = useLogin();

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

  if(tokenData.isLoading || profileData.isLoading){
    return <div>Loading...</div>
  }

  if(!tokenData.data){
    return <div>
      <button onClick={() => requestLogin()}>Login</button>
    </div>
  }

  if(!profileData.data?.defaultProfile){
    return <div>
      <button>You dont have a profile!</button>
    </div>
  }

  return (
    <div>
      <div>Hello {profileData.data?.defaultProfile?.handle}</div>
    </div>
  );


  
}
