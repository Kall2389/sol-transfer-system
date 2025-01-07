import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch,
} from "react-router-dom";
import styles from "./App.module.css";
import BalancePage from "./BalancePage";
import TransferPage from "./TransferPage";
import { Button } from "@mui/material";
import WalletIcon from "@mui/icons-material/Wallet";
import { Connection, PublicKey } from "@solana/web3.js";
import { shortenPublicKey } from "./utils";
import { useGlobalContext } from "./GlobalContext";

declare global {
  interface Window {
    solana: {
      isPhantom: {
        connect: () => Promise<{
          publicKey: { toString: () => string };
          isConnected: boolean;
        }>;
      };
      connect: () => Promise<{
        publicKey: { toString: () => string };
        isConnected: boolean;
      }>;
    };
  }
}

const App: React.FC = () => {
  const { wallet, setWallet } = useGlobalContext();

  // Check if Phantom is installed
  const checkPhantomConnection = (): boolean => {
    return !!(window.solana && window.solana.isPhantom);
  };

  const connectWallet = async (): Promise<void> => {
    if (checkPhantomConnection()) {
      try {
        // Connect the Wallet
        const response = await window.solana.connect();
        const publicKey = response.publicKey.toString();
        setWallet({
          connected: true,
          publicKey,
          balance: await getBalance(publicKey),
        });
      } catch (error) {
        console.error("Connection error:", error);
      }
    }
  };

  const disconnectWallet = (): void => {
    setWallet({ connected: false, publicKey: null, balance: null });
    console.log("Disconnected from Phantom wallet");
  };

  // Get wallet balance
  const getBalance = async (publicKey: string): Promise<number> => {
    const connection = new Connection(
      "https://api.devnet.solana.com",
      "confirmed"
    );
    const balance = await connection.getBalance(new PublicKey(publicKey));
    return balance / 1e9; // Convert from lamports to SOL
  };

  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      // Auto connect if Phantom is already connected on page load
      window.solana
        .connect()
        .then(async (response: { publicKey: { toString: () => string } }) => {
          const publicKey = response.publicKey.toString();
          const balance = await getBalance(publicKey);
          setWallet({
            connected: true,
            publicKey,
            balance,
          });
        })
        .catch(() => {
          setWallet({ connected: false, publicKey: null, balance: null });
        });
    }
  }, [setWallet]);

  return (
    <Router>
      <div className={styles.container}>
        <nav className={styles.navbar}>
          <ul className={styles.navList}>
            <li>
              <NavLink
                exact
                to="/"
                className={styles.navLink}
                activeClassName={styles.activeNavLink}
              >
                Check Balance
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/transfer"
                className={styles.navLink}
                activeClassName={styles.activeNavLink}
              >
                Send SOL
              </NavLink>
            </li>
          </ul>
          <div style={{ display: "flex", gap: "1vw" }}>
            {!wallet.connected ? (
              <Button
                variant="outlined"
                startIcon={<WalletIcon />}
                onClick={connectWallet}
              >
                Connect Wallet
              </Button>
            ) : (
              <>
                <p>
                  <strong title={wallet.publicKey ?? undefined}>
                    Public Key:{" "}
                    {wallet.publicKey
                      ? shortenPublicKey(wallet.publicKey)
                      : "N/A"}
                  </strong>
                </p>
                <p>
                  <strong>Balance: </strong>
                  {wallet.balance} SOL
                </p>
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={disconnectWallet}
                >
                  Disconnect Wallet
                </Button>
              </>
            )}
          </div>
        </nav>
        <div className={styles.content}>
          <IntroText />
          <Switch>
            <Route exact path="/" component={BalancePage} />
            <Route path="/transfer" component={TransferPage} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

const IntroText: React.FC = () => (
  <p className={styles.introText}>
    After diving deep into React, Vite, and TypeScript, I've built a SOL
    transfer system that's as smooth as butter 🧈🚀! Now you can send SOL with
    the speed of a rocket and the precision of a laser 🔥. With a sprinkle of
    error handling magic ✨, it's like sending crypto with no worries and a dash
    of excitement! 💸⚡
  </p>
);

export default App;
