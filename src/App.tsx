import React, { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { makeStyles } from "@mui/styles";
import getProvider from "./utils/getProvider";
import getBalance from "./utils/getBalance";

const useStyles = makeStyles({
  walletButton: {
    marginLeft: "auto",
  },
});

const App: React.FC = () => {
  const [balance, setBalance] = useState<number>(NaN);
  const [connectState, setConnectState] = useState<boolean>(false);
  const classes = useStyles();
  const provider = getProvider();
  if (provider === undefined) return;

  const connectWallet = async () => {
    try {
      const resp = await provider.connect();
      const balance = await getBalance(resp.publicKey);
      if (balance === null || balance === undefined) return;
      setConnectState(true);
      setBalance(balance);
    } catch (err) {
      console.error(err);
    }
  };

  const disconnectWallet = async () => {
    try {
      await provider.disconnect();
      setConnectState(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Solana Transfer System
          </Typography>
          <div>
            {!connectState ? (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AccountBalanceWalletIcon />}
                className={classes.walletButton}
                onClick={connectWallet}
              >
                Connect Wallet
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AccountBalanceWalletIcon />}
                className={classes.walletButton}
                onClick={disconnectWallet}
              >
                {balance} SOL
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default App;
