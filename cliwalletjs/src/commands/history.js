import chalk from "chalk";
import { PublicKey } from "@solana/web3.js";
import { getConnection, getKeypairFromFilePath } from "../utils.js";
import { printError } from "../doc.js";

export const historyArgs = [
  {
    name: "address",
    type: "string",
  },
  {
    name: "addressFile",
    type: "string",
  },
];

/**
 * Get history of the transactions for the address provided
 * @param {Object} args
 * @param {string} args.address
 * @param {string} args.addressFile
 */
export async function history(args) {
  const connection = await getConnection();

  if (!args.addressFile && !args.address) {
    printError("Either public key or wallet address is required.");
    return;
  }

  if (args.address && args.addressFile) {
    printError("Only pass public key or wallet file");
    return;
  }

  /** @type {PublicKey} */
  let pubKey;
  if (args.addressFile) {
    let kp = await getKeypairFromFilePath(args.addressFile);
    pubKey = kp.publicKey;
  } else {
    pubKey = new PublicKey(args.address);
  }

  const LIMIT = 10;

  const history = await connection.getSignaturesForAddress(pubKey, {
    limit: LIMIT,
  });

  console.log(
    chalk.blue(
      `Showing last ${chalk.green(Math.min(LIMIT, 2))} transactions for the wallet "${pubKey.toBase58()}"`,
    ),
  );

  const his = [];
  for (const h of history) {
    his.push({
      timestamp: h.blockTime,
      signature: h.signature,
      confirmationStatus: h.confirmationStatus,
    });
  }
  console.table(his);
}
