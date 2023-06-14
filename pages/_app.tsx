import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import type { AppProps } from "next/app";



export default function App({ Component, pageProps }: AppProps) {

  const queryClient = new QueryClient();

  const desiredChainId = ChainId.Polygon;

  return (
    <ThirdwebProvider activeChain="polygon">
    <QueryClientProvider client={new QueryClient()}>
      <Component {...pageProps} />
    </QueryClientProvider>
    </ThirdwebProvider>
  );
}
