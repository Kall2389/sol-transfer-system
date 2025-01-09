import { useWallet } from "@solana/wallet-adapter-react";

export const SelectWalletButton = () => {
  const { connected, select, wallet } = useWallet();

  const handleClick = () => {
    select(wallet?.name);
  };

  return (
    <div>
      {!connected ? (
        <button onClick={handleClick}>Connect to Wallet</button>
      ) : (
        <span>Wallet connected: {wallet?.adapter.name}</span>
      )}
    </div>
  );
};
