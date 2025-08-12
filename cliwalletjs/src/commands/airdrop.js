import chalk from "chalk";
import {
  getConnection,
  getKeypairFromFilePath,
  verifyFilePath,
} from "../utils.js";
import { printError } from "../doc.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const airdropArgs = [
  {
    name: "file",
    type: "string",
  },
  {
    name: "amount",
    type: "number",
  },
];

/**
 * @param {Object} args
 * @param {string} args.file Path of the wallet file
 * @param {number} args.amount Amount of SOL to airdrop
 */
export async function airdrop(args) {
  if (!verifyFilePath(args.file)) {
    printError("Invalid file path");
    return;
  }

  if (args.amount <= 0) {
    printError("Amount must be greater than 0");
    return;
  }

  const keypair = await getKeypairFromFilePath(args.file);
  const connection = await getConnection();

  try {
    console.log(
      `Airdropping ${args.amount} SOL to ${keypair.publicKey.toBase58()}`,
    );

    const signature = await connection.requestAirdrop(
      keypair.publicKey,
      args.amount * LAMPORTS_PER_SOL,
    );

    const latestBlockhash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      signature,
    });

    console.log(`Airdrop transaction sent: ${signature}`);
    console.log(
      `Balance: ${
        (await connection.getBalance(keypair.publicKey)) / LAMPORTS_PER_SOL
      } SOL`,
    );
  } catch (err) {
    printError(`Failed to airdrop sol: ${chalk.red(message)}`);
  }
}
