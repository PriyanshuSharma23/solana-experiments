import {
  getConnection,
  getKeypairFromFilePath,
  verifyFilePath,
  confirmTransaction,
} from "../utils.js";
import { printError } from "../doc.js";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

export const sendArgs = [
  {
    name: "payerFile",
    type: "string",
  },
  {
    name: "recipient",
    type: "string",
  },
  {
    name: "recipientFile",
    type: "string",
  },
  {
    name: "amount",
    type: "number",
  },
];

/**
 * @param {Object} args
 * @param {string} args.payerFile Path of the payer wallet file
 * @param {string} args.recipient Address of the recipient
 * @param {string} args.recipientFile Path of the recipient wallet file
 * @param {number} args.amount Amount of SOL to send
 */
export async function send(args) {
  if (!args.recipient && !args.recipientFile) {
    printError("Either recipient or recipientFile must be provided");
  }

  if (args.recipient && args.recipientFile) {
    printError("Only one of recipient or recipientFile must be provided");
  }

  if (args.amount <= 0) {
    printError("Amount must be greater than 0");
  }

  if (!verifyFilePath(args.payerFile)) {
    printError("Invalid payer file path");
  }

  if (args.recipientFile && !verifyFilePath(args.recipientFile)) {
    printError("Invalid recipient file path");
  }

  const payer = await getKeypairFromFilePath(args.payerFile);

  /** @type {PublicKey} */
  let recipientPublicKey;

  if (args.recipient) {
    recipientPublicKey = new PublicKey(args.recipient);
  } else {
    recipientPublicKey = (await getKeypairFromFilePath(args.recipientFile)).publicKey;
  }

  const connection = await getConnection();

  const ix = SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: recipientPublicKey,
    lamports: args.amount * LAMPORTS_PER_SOL,
    programId: SystemProgram.programId,
  });

  const tx = new Transaction().add(ix);

  const signature = await sendAndConfirmTransaction(connection, tx, [payer]);

  await confirmTransaction(connection, signature);

  console.log(
    `Successfully transfered ${args.amount} SOL to ${recipientPublicKey.toBase58()}`,
  );
}
