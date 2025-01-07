import React, { useState } from "react";
import {
  Connection,
  PublicKey,
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import bs58 from "bs58";
import { Buffer } from "buffer";
// import { useGlobalContext } from "./GlobalContext";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).Buffer = Buffer;

import styles from "./App.module.css";

// Connection to Devnet
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const TransferPage: React.FC = () => {
  const [privateKeyInput, setPrivateKeyInput] = useState<string>(""); // Store private key input
  const [toAddress, setToAddress] = useState<string>(""); // Store recipient address
  const [transferAmount, setTransferAmount] = useState<number>(0); // Store amount in SOL
  const [status, setStatus] = useState<string>(""); // Store transfer status
  // const { wallet } = useGlobalContext();

  // Function to handle SOL transfer
  const handleTransfer = async () => {
    try {
      // Validate input
      if (!privateKeyInput || !toAddress || transferAmount <= 0) {
        setStatus("Please fill out all fields correctly.");
        return;
      }
      const uint8Array = Buffer.from(bs58.decode(privateKeyInput));
      const sender = Keypair.fromSecretKey(uint8Array);

      const recipient = new PublicKey(toAddress);
      const lamports = transferAmount * LAMPORTS_PER_SOL; // Convert SOL to lamports (1 SOL = 1 billion lamports)
      console.log(lamports);

      // Check if sender has sufficient balance
      const senderBalance = await connection.getBalance(sender.publicKey);
      if (senderBalance < lamports) {
        setStatus("Insufficient balance for the transfer.");
        return;
      }

      // Create transfer transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: sender.publicKey,
          toPubkey: recipient,
          lamports,
        })
      );

      // Send and confirm transaction
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [sender]
      );

      // Update status with successful transaction signature
      setStatus(`Transfer successful! Transaction signature: ${signature}`);
    } catch (error) {
      // Handle different errors
      if (error instanceof Error) {
        setStatus(`Error during transfer: ${(error as Error).message}`);
      } else {
        setStatus("Unknown error occurred.");
      }
    }
  };

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Send SOL</h1>
      <textarea
        placeholder="Enter Sender's Private Key (in Base58 format)"
        value={privateKeyInput}
        onChange={(e) => setPrivateKeyInput(e.target.value)}
        className={styles.input}
      />
      <input
        type="text"
        placeholder="Enter Recipient Address"
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
        className={styles.input}
      />
      <input
        type="number"
        placeholder="Amount in SOL"
        value={transferAmount === 0 ? "" : transferAmount}
        onChange={(e) => setTransferAmount(Number(e.target.value))}
        className={styles.input}
      />
      <div>
        <button onClick={handleTransfer} className={styles.button}>
          Transfer SOL
        </button>
      </div>
      {status && <p className={styles.status}>{status}</p>}
    </div>
  );
};

export default TransferPage;
