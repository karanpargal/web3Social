import React, { useEffect } from "react";
import { MediaRenderer } from "@thirdweb-dev/react";
import {
  useCreateFollowTypedDataMutation,
  useDoesFollowQuery,
  useBroadcastMutation,
  useCreateUnfollowTypedDataMutation,
  useAddReactionMutation,
  useWhoReactedPublicationQuery,
  useCreateMirrorTypedDataMutation,
  usePublicationQuery,
  useCreateCollectTypedDataMutation,
  useWhoCollectedPublicationQuery,
} from "../graphql/generated";
import { useAddress } from "@thirdweb-dev/react";
import { useSDK } from "@thirdweb-dev/react";
import { ReactionTypes } from "../graphql/generated";
import useLensUser from "../auth/useLensUser";
import useLogin from "../auth/useLogin";

type Props = {
  publication: any;
};

export default function Feed(props: Props) {
  const address = useAddress();
  const walletSdk = useSDK();

  const { tokenData, profileData } = useLensUser();
  const { mutateAsync: requestLogin } = useLogin();
  const { mutateAsync: follow } = useCreateFollowTypedDataMutation();
  const { mutateAsync: broadcast } = useBroadcastMutation();
  const { mutateAsync: unfollow } = useCreateUnfollowTypedDataMutation();
  const { mutateAsync: addReaction } = useAddReactionMutation();
  const { mutateAsync: createMirror } = useCreateMirrorTypedDataMutation();
  const { mutateAsync: createCollect } = useCreateCollectTypedDataMutation();

  async function collectPost() {
    await requestLogin();
    const result = await createCollect({
      request: {
        publicationId: props.publication?.id,
      },
    });

    const typedData = result.createCollectTypedData?.typedData;
    const signature = await walletSdk?.wallet.signTypedData(
      typedData.domain,
      typedData.types as Record<string, any>,
      typedData.value
    );
    console.log("signature", signature);
    const broadcastResult = await broadcastLens(
      signature?.signature,
      result.createCollectTypedData?.id
    );

    console.log("broadcast result", broadcastResult);
    return broadcastResult;
  }

  async function mirrorPost() {
    await requestLogin();
    const result = await createMirror({
      request: {
        profileId: profileData.data?.defaultProfile?.id,
        publicationId: props.publication?.id,
        referenceModule: {
          followerOnlyReferenceModule: false,
        },
      },
    });
    const typedData = result.createMirrorTypedData?.typedData;
    const signature = await walletSdk?.wallet.signTypedData(
      typedData.domain,
      typedData.types as Record<string, any>,
      typedData.value
    );
    console.log("signature", signature);
    const broadcastResult = await broadcastLens(
      signature?.signature,
      result.createMirrorTypedData?.id
    );

    console.log("broadcast result", broadcastResult);
    return broadcastResult;
  }

  async function addReactionLens() {
    await requestLogin();
    const result = await addReaction({
      request: {
        profileId: profileData.data?.defaultProfile?.id,
        publicationId: props.publication?.id,
        reaction: ReactionTypes.Upvote,
      },
    });
    console.log("add reaction result", result);

    return result;
  }

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
    await requestLogin();
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
    console.log("signature", signature);
    const broadcastResult = await broadcastLens(
      signature?.signature,
      result.createFollowTypedData?.id
    );

    console.log("broadcast result", broadcastResult);
    return broadcastResult;
  }

  async function unfollowLens() {
    await requestLogin();
    const result = await unfollow({
      request: {
        profile: props.publication?.profile?.id,
      },
    });

    const typedData = result.createUnfollowTypedData?.typedData;
    const signature = await walletSdk?.wallet.signTypedData(
      typedData.domain,
      typedData.types as Record<string, any>,
      typedData.value
    );

    const broadcastResult = await broadcastLens(
      signature?.signature,
      result.createUnfollowTypedData?.id
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

  const reactionData = useWhoReactedPublicationQuery({
    request: {
      publicationId: props.publication?.id,
    },
  });

  const publicationData = usePublicationQuery({
    request: {
      publicationId: props.publication?.id,
    },
  });

  let mirrored = false;

  publicationData.data?.publication?.mirrors?.map((mirror: any) => {
    if (mirror.profile.id === profileData.data?.defaultProfile?.id) {
      mirrored = true;
    }
  });

  let reaction = false;

  reactionData.data?.whoReactedPublication?.items.map((item) => {
    if (item.profile.id === profileData.data?.defaultProfile?.id) {
      reaction = true;
    }
  });

  const collectedData = useWhoCollectedPublicationQuery({
    request: {
      publicationId: props.publication?.id,
    },
  });

  console.log("collected data", collectedData.data);
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
            onClick={() => {
              unfollowLens();
            }}
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
      <div className="flex justify-between">
        {reaction ? (
          <button className="bg-blue-700 text-white font-bold py-2 px-4 rounded h-10">
            Liked
          </button>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-10"
            onClick={() => {
              addReactionLens();
            }}
          >
            Like
          </button>
        )}
        {mirrored ? (
          <button className="bg-blue-700 text-white font-bold py-2 px-4 rounded h-10">
            Mirrored
          </button>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-10"
            onClick={() => {
              mirrorPost();
            }}
          >
            Mirror
          </button>
        )}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-10"
          onClick={() => {
            collectPost();
          }}
        >
          {" "}
          Collect{" "}
        </button>
      </div>
    </div>
  );
}
