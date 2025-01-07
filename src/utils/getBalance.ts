import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import connection from "./connection";

async function getBalance(publicKey: PublicKey) {
  try {
    // Get the balance in lamports
    const balance = await connection.getBalance(publicKey);

    // Convert lamports to SOL
    const balanceInSOL = balance / LAMPORTS_PER_SOL;

    return balanceInSOL;
  } catch (error) {
    console.error("Error getting balance:", error);
  }
}

export default getBalance;
