import * as web3 from "@solana/web3.js";
import { serialize, field, deserialize } from "@dao-xyz/borsh";
import { describe, expect, test } from "vitest";
import fs from "fs";
import os from "os";

class Counter {
  @field({ type: "u32" })
  count: number = 0;

  constructor(data?: Counter) {
    if (data) {
      this.count = data.count;
    }
  }
}

function readFile(path: string) {
  console.log(`Reading file from: ${path}`);
  const content = fs.readFileSync(path, "utf8");
  console.log(`Successfully read file, length: ${content.length} characters`);
  return content;
}

const COUNTER_SIZE = serialize(new Counter({ count: 0 })).length;
console.log(`Counter serialized size: ${COUNTER_SIZE} bytes`);

const idJSON = readFile(os.homedir() + "/.config/solana/id.json");

console.log(COUNTER_SIZE);

async function createCounterAccount(
  connection: web3.Connection,
  payer: web3.Keypair
): Promise<web3.Keypair> {
  console.log("=== Creating Counter Account ===");
  console.log(`Payer public key: ${payer.publicKey.toBase58()}`);

  const counterAccount = web3.Keypair.generate();
  console.log(
    `Generated counter account: ${counterAccount.publicKey.toBase58()}`
  );

  const minRent = await connection.getMinimumBalanceForRentExemption(
    COUNTER_SIZE
  );
  console.log(`Minimum rent for ${COUNTER_SIZE} bytes: ${minRent} lamports`);

  const tx = new web3.Transaction().add(
    web3.SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: counterAccount.publicKey,
      lamports: minRent,
      space: COUNTER_SIZE,
      programId: programID,
    })
  );

  console.log("Sending create account transaction...");
  const signature = await web3.sendAndConfirmTransaction(connection, tx, [
    payer,
    counterAccount,
  ]);

  console.log("✅ Counter account created successfully");
  console.log(`Transaction signature: ${signature}`);
  console.log(
    `Counter account address: ${counterAccount.publicKey.toBase58()}`
  );

  // Immediately check the account after creation
  console.log("=== Immediately checking account after creation ===");
  const accountInfo = await connection.getAccountInfo(counterAccount.publicKey);
  if (accountInfo) {
    console.log(`Account exists with ${accountInfo.lamports} lamports`);
    console.log(`Account owner: ${accountInfo.owner.toBase58()}`);
    console.log(`Account data length: ${accountInfo.data.length} bytes`);
  } else {
    console.log("❌ Account not found immediately after creation!");
  }

  return counterAccount;
}

async function getBalance(connection: web3.Connection, pubkey: web3.PublicKey) {
  console.log(`=== Checking Balance ===`);
  console.log(`Account: ${pubkey.toBase58()}`);
  const balance = await connection.getBalance(pubkey);
  console.log(
    `Balance: ${balance} lamports (${balance / web3.LAMPORTS_PER_SOL} SOL)`
  );
  return balance;
}

async function readCounter(
  connection: web3.Connection,
  pubkey: web3.PublicKey
) {
  console.log(`=== Reading Counter ===`);
  console.log(`Counter account: ${pubkey.toBase58()}`);

  const counter = await connection.getAccountInfo(pubkey);

  if (!counter) {
    console.error("❌ Counter account not found");
    throw new Error("Counter account not found");
  }

  console.log(`Account data length: ${counter.data.length} bytes`);
  console.log(`Account owner: ${counter.owner.toBase58()}`);
  console.log(`Account lamports: ${counter.lamports}`);

  const counterData = deserialize(counter.data, Counter);
  console.log(`Deserialized counter value: ${counterData.count}`);
  return counterData.count;
}

const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
console.log("=== Initializing Connection ===");
console.log(`Connected to: ${web3.clusterApiUrl("devnet")}`);

const programID = new web3.PublicKey(
  "4vpSg1TzFrETdcCcjuUoisNUnXPP5LfABUGZotxVSHNC"
);
// console.log(`Program ID: ${programID.toBase58()}`);

// const payer = web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(idJSON)));
// console.log("=== Loaded Payer ===");
// console.log(`Payer public key: ${payer.publicKey.toBase58()}`);

const counterAccount = new web3.PublicKey(
  "FYLhh2snHFjJCNQf7AJuxHdLfxTRioVQGwd1M4cM5ton"
);

// We'll create the counter account inside the describe block

// // Check initial payer balance
describe("Test Counter", async () => {
  console.log("=== Starting Test Suite ===");

  // const counterAccount = await createCounterAccount(connection, payer);

  // Add a small delay to ensure account is settled
  console.log("=== Waiting for account to settle ===");
  // await new Promise((resolve) => setTimeout(resolve, 10000));

  test(
    "Read Counter",
    async () => {
      console.log("=== Testing Read Counter ===");
      console.log(`Counter account: ${counterAccount.toBase58()}`);
      const counter = await readCounter(connection, counterAccount);
      console.log(`Counter: ${counter}`);
      expect(counter).toBe(1);
      console.log("✅ Read Counter test passed");
    },
    { timeout: 60000 }
  );
});

//   test("Counter account balance", async () => {
//     console.log("=== Testing Counter Account Balance ===");
//     console.log("Counter account: ", counterAccount.publicKey.toBase58());
//     const balance = await getBalance(connection, counterAccount.publicKey);
//     console.log(
//       `✅ Counter account balance test completed: ${balance} lamports`
//     );
//   });

//   test("Increment counter", async () => {
//     console.log("=== Testing Counter Increment ===");

//     // Read initial counter value
//     // const initialCounter = await readCounter(
//     //   connection,
//     //   counterAccount.publicKey
//     // );
//     // console.log(`Initial counter value: ${initialCounter}`);

//     // Create increment instruction
//     console.log("Creating increment instruction...");
//     const ix = new web3.TransactionInstruction({
//       keys: [
//         {
//           pubkey: counterAccount.publicKey,
//           isSigner: false,
//           isWritable: true,
//         },
//       ],
//       programId: programID,
//       data: Buffer.alloc(0),
//     });
//     console.log("✅ Increment instruction created");

//     // Send transaction
//     console.log("Sending increment transaction...");
//     const tx = new web3.Transaction().add(ix);
//     const signature = await web3.sendAndConfirmTransaction(connection, tx, [
//       payer,
//     ]);

//     console.log("✅ Increment transaction successful");
//     console.log(`Transaction signature: ${signature}`);

//     // Read updated counter value
//     // const updatedCounter = await readCounter(
//     //   connection,
//     //   counterAccount.publicKey
//     // );
//     // console.log(`Updated counter value: ${updatedCounter}`);
//     // console.log(`Counter increment: ${updatedCounter - initialCounter}`);

//     // Verify increment
//     // expect(updatedCounter).toBe(initialCounter + 1);
//     console.log("✅ Counter increment verification passed");
//   });
// });
