import * as web3 from "@solana/web3.js";
import { describe, it } from "node:test";
import { Buffer } from "buffer";
import os from "os";
import fs from "fs";

const HOME_DIR = os.homedir();

function readFile(path: string) {
  return Buffer.from(JSON.parse(fs.readFileSync(path, "utf8")));
}

describe("Test", async () => {
  const connection = new web3.Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );
  const payer = web3.Keypair.fromSecretKey(
    readFile(HOME_DIR + "/.config/solana/id.json")
  );
  const PROGRAM_ID = new web3.PublicKey(
    "EC82sUoMB92F1yCkT2k1EzEP2pKCmPjdXy1dNVhyehJ2"
  );

  it("Hello", async () => {
    // console.log("Requesting airdrop to payer:", payer.publicKey.toBase58());
    // // Airdrop 1 SOL to the new account
    // const airdropSignature = await connection.requestAirdrop(
    //   payer.publicKey,
    //   web3.LAMPORTS_PER_SOL
    // );

    // // Wait for confirmation
    // await connection.confirmTransaction(airdropSignature, "confirmed");

    // console.log("Airdrop confirmed. Checking balance...");

    const balance = await connection.getBalance(payer.publicKey);
    console.log("Payer balance (SOL):", balance / web3.LAMPORTS_PER_SOL);

    let ix = new web3.TransactionInstruction({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: payer.publicKey, isSigner: true, isWritable: true },
        {
          pubkey: web3.SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      data: Buffer.alloc(0),
    });

    console.log("Sending transaction...");

    const txSignature = await web3.sendAndConfirmTransaction(
      connection,
      new web3.Transaction().add(ix),
      [payer]
    );

    console.log("Transaction confirmed with signature:", txSignature);
  });
});
