import React, { useState } from "react";
import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js";
import styles from "./App.module.css";
import { useGlobalContext } from "./GlobalContext";

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const BalancePage: React.FC = () => {
  const [publicKeyInput, setPublicKeyInput] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const [status, setStatus] = useState<string>("");
  const { wallet, setWallet } = useGlobalContext();

  // Function to check the sender's balance
  const validateAndCheckBalance = async () => {
    try {
      if (!publicKeyInput) {
        setStatus("Please provide a valid public key.");
        return;
      }

      // Validate the public key
      const wallet = new PublicKey(publicKeyInput); // This will throw if the key is invalid
      // If validation is successful, proceed to fetch balance
      const balanceLamports = await connection.getBalance(wallet);
      setBalance(balanceLamports / LAMPORTS_PER_SOL); // Convert lamports to SOL
      setStatus("Balance fetched successfully!");
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("invalid public key")
      ) {
        setStatus(
          "Invalid public key. Please provide a valid Solana public key."
        );
      } else {
        if (error instanceof Error) {
          setStatus(`Error fetching balance: ${error.message}`);
        } else {
          setStatus("An unknown error occurred.");
        }
      }
    }
  };

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Check Balance</h1>
      <input
        type="text"
        placeholder="Enter Public Key"
        value={publicKeyInput}
        onChange={(e) => setPublicKeyInput(e.target.value)}
        className={styles.input}
      />
      <div>
        <button onClick={validateAndCheckBalance} className={styles.button}>
          Check Balance
        </button>
      </div>
      {balance >= 0 && <p className={styles.status}>Balance: {balance} SOL</p>}
      {status && <p className={styles.status}>{status}</p>}
    </div>
  );
};

export default BalancePage;
