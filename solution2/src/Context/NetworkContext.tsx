"use client";
import { Slug } from "@/types/types";
import React, { useState } from "react";

interface INetworkContextProps {
  network: Slug;
  setNetwork: (network: Slug) => void;
}

export const NetworkContext = React.createContext<INetworkContextProps>({
  network: Object.values(Slug)[0],
  setNetwork: () => {},
});

export const NetworkContextProvider = (props: { children: JSX.Element[] }) => {
  const [network, setNetwork] = useState(Object.values(Slug)[0]);

  return (
    <NetworkContext.Provider
      value={{
        network: network,
        setNetwork: setNetwork,
      }}
    >
      {props.children}
    </NetworkContext.Provider>
  );
};
