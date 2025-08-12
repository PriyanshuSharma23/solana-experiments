import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  getConnection,
  getKeypairFromFilePath,
  verifyFilePath,
} from "../utils.js";

export const balanceArgs = [
  {
    name: "file",
    type: "string",
  },
];

/**
 * @param {Object} args
 * @param {string} args.file Path of the wallet file
 */
export async function balance(args) {
  if (!verifyFilePath(args.file)) {
    printError("Invalid file path");
    return;
  }

  const keypair = await getKeypairFromFilePath(args.file);
  const connection = await getConnection();

  const balance = await connection.getBalance(keypair.publicKey);

  console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
}
