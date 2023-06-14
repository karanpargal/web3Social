import Image from "next/image";
import { Inter } from "next/font/google";
import {
  PublicationSortCriteria,
  useExplorePublicationsQuery,
} from "./graphql/generated";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import useLogin from "./auth/useLogin";
import SignIn from "./components/SignIn";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  // const { data, isLoading, error } = useExplorePublicationsQuery({
  //   request: {
  //     sortCriteria: PublicationSortCriteria.TopMirrored,
  //   },
  // });

  // if (isLoading) return <div>Loading...</div>;
  // else {
  //   console.log(data);
  // }

  return <SignIn />;
}
