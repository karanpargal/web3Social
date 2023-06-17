import React from "react";
import { MediaRenderer } from "@thirdweb-dev/react";
import {
  useCreateFollowTypedDataMutation,
  useDoesFollowQuery,
  useBroadcastMutation,
} from "../graphql/generated";
import { useAddress } from "@thirdweb-dev/react";
import { useSDK } from "@thirdweb-dev/react";

type Props = {
  publication: any;
};

export default function Feed(props: Props) {
  const address = useAddress();
  const walletSdk = useSDK();

  const { mutateAsync: follow } = useCreateFollowTypedDataMutation();
  const { mutateAsync: broadcast } = useBroadcastMutation();

  async function broadcastLens(signature: any, id: any) {
    const result = await broadcast({
      request: {
        signature: signature,
        id: id,
      },
    });
    return result;
  }

  async function followLens() {
    const result = await follow({
      request: {
        follow: [
          {
            profile: props.publication?.profile?.id,
          },
        ],
      },
    });
    const typedData = result.createFollowTypedData?.typedData;
    const signature = await walletSdk?.wallet.signTypedData(
      typedData.domain,
      typedData.types as Record<string, any>,
      typedData.value
    );
    console.log("signature", signature)
    const broadcastResult = await broadcastLens(
      signature?.signature,
      result.createFollowTypedData?.id
    );

    console.log("broadcast result", broadcastResult);
    return broadcastResult;
  }

  const { data, isLoading, error } = useDoesFollowQuery(
    {
      request: {
        followInfos: [
          {
            followerAddress: address,
            profileId: props.publication?.profile?.id,
          },
        ],
      },
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
  console.log("Follow info", data);
  return (
    <div className="flex flex-col bg-gray-600 p-16 border-2 border-gray-800 justify-center mx-80 text-ellipsis overflow-hidden ... ">
      <div className="flex flex-row justify-between">
        <MediaRenderer
          src={props.publication?.profile?.picture?.original?.url || ""}
          alt="lens profile pic"
          className="rounded-half h-4 w-4"
        />
        <h1>
          Post by{" "}
          {props.publication.profile.name || props.publication.profile.handle}
        </h1>
        {data?.doesFollow[0]?.follows ? (
          <button
          className="bg-blue-700 text-white font-bold py-2 px-4 rounded h-10"
          disabled
        >
          Following
        </button>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-10"
            onClick={() => {
               followLens();
            }}
          >
            Follow
          </button>
        )}
      </div>
      <div>
        <h1 className="font-bold">{props.publication.metadata.content}</h1>
        {props.publication.metadata.media?.length > 0 && (
          <MediaRenderer
            src={props.publication.metadata.media[0].url}
            alt="lens media "
          />
        )}
      </div>
    </div>
  );
}