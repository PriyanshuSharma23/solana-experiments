import { promises as fs } from "fs";
import { verifyFilePath } from "../utils.js";
import { Keypair } from "@solana/web3.js";

export const createWalletArgs = [
  {
    name: "file",
    type: "string",
  },
];

/**
 * @param {Object} args
 * @param {string} args.file Path of the wallet file
 */
export async function createWallet(args) {
  if (!verifyFilePath(args.file)) {
    printError("Invalid file path");
    return;
  }

  const keypair = Keypair.generate();

  const walletFileContents = Array.from(keypair.secretKey);

  await fs.writeFile(args.file, JSON.stringify(walletFileContents));

  console.log(`Wallet created successfully!`);
  console.log(`Address: ${keypair.publicKey.toBase58()}`);
}
