import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { SelectWalletButton } from "./ConnectWallet";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export const BalanceDisplay: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  useEffect(() => {
    if (publicKey === null) return;
    const updateBalance = async () => {
      if (!connection || !publicKey) {
        console.error("Wallet not connected or connection unavailable.");
      }
      try {
        connection.onAccountChange(
          publicKey,
          (updatedAccountInfo) => {
            setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
          },
          "confirmed"
        );

        const accountInfo = await connection.getAccountInfo(publicKey);

        if (accountInfo) {
          setBalance(accountInfo.lamports / LAMPORTS_PER_SOL);
        } else {
          throw new Error("Account info not found");
        }
      } catch (error) {
        console.error("Failed to retrieve account info:", error);
      }
    };
    updateBalance();
  }, [connection, publicKey]);

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <AppBar position="static">
          <Toolbar style={{ justifyContent: "space-between" }}>
            <Typography variant="h6">
              {publicKey ? `🎉 Balance: ${balance} SOL` : "⚠️ Not Connected"}
            </Typography>
            <WalletMultiButton />
            <SelectWalletButton/>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </>
  );
};
