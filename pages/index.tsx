import Image from "next/image";
import { Inter } from "next/font/google";
import {
  PublicationSortCriteria,
  useExplorePublicationsQuery,
} from "./graphql/generated";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import useLogin from "./auth/useLogin";
import SignIn from "./components/SignIn";
import Feed from "./components/Feed";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data, isLoading, error } = useExplorePublicationsQuery({
    request: {
      sortCriteria: PublicationSortCriteria.TopMirrored,
    },
  },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,

    }
  );

  if (isLoading) return <div>Loading...</div>;
  else {
    console.log(data);
  }

  if(error){
    console.log(error);
    return <div>Error</div>
  }

  return (
    <div>
      <SignIn />
      {
        data?.explorePublications?.items.map((publication) => {
          return(
            <Feed publication={publication}  key={publication.id}/>
          )
        })
      }
    </div>
  );
}
