import { useState } from "react";
import { Button, TextField } from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React from "react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import * as buffer from "buffer";
import toast from "react-hot-toast";
window.Buffer = buffer.Buffer;

export const SendSOL: React.FC = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [signatureResult, setSignatureResult] = useState<string>("");

  const sendSOLTransaction = async () => {
    if (!publicKey || publicKey === null) {
      console.error("Wallet must be connected!");
      return;
    }
    try {
      const walletBalance = await connection.getBalance(publicKey);
      const amountInLamports = Number(amount) * LAMPORTS_PER_SOL;

      // Validate if the wallet has enough balance
      if (amountInLamports > walletBalance) {
        toast.error("Insufficient balance!");
        return;
      }
      const recipientKey = new PublicKey(recipient);
      const sendSOLInstruction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientKey,
          lamports: Number(amount) * LAMPORTS_PER_SOL,
        })
      );
      const signature = await sendTransaction(sendSOLInstruction, connection);
      setSignatureResult(signature);
      toast.success("Transaction Successful!");
      console.log(`Transaction signature: ${signature}`);
    } catch (error) {
      console.error("Transaction failed", error);
    }
  };

  return (
    <div style={{ width: "60%", margin: "0 auto" }}>
      {publicKey ? (
        <>
          <TextField
            label="Recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Amount (SOL)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendSOLTransaction}
          >
            Send Transaction
          </Button>
          {signatureResult && (
            <p>
              Transaction signature :
              <strong>
                <a
                  href={`https://solscan.io/tx/${signatureResult}?cluster=devnet`}
                  target="_blank"
                >
                  {" "}
                  Please check in solscan.io{" "}
                </a>
              </strong>
            </p>
          )}
        </>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <h1>Please Connect Your Wallet.</h1>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAnUXzYqfvvU5WvdNhoW503asyzfcn5qKEkg&s" alt="not connected" />
        </div>
      )}
    </div>
  );
};
