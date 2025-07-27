import {
  Keypair,
  Connection,
  PublicKey,
  TransactionInstruction,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { setupConnection, loadKeypair } from "./cpi";

// TODO: Replace with your actual deployed program ID
const PROGRAM_ID = new PublicKey(
  "6rHjG39v1yykN24HnBSgcCBGwbW3RRZPB9s3MHpg54mY"
);

describe("CPI", () => {
  let connection: Connection;
  let payer: Keypair;

  beforeAll(async () => {
    console.log("🚀 Starting CPI test suite...");
    console.log("📡 Setting up connection to devnet...");
    connection = setupConnection("devnet");
    console.log("✅ Connection established successfully");

    console.log("🔑 Loading payer keypair...");
    payer = loadKeypair();
    console.log("💰 Payer public key:", payer.publicKey.toString());

    console.log("💳 Checking payer balance...");
    const balance = await connection.getBalance(payer.publicKey);
    console.log("💵 Payer balance:", balance, "lamports");
    console.log("💵 Payer balance:", balance / LAMPORTS_PER_SOL, "SOL");

    if (balance < LAMPORTS_PER_SOL) {
      console.error("❌ Insufficient balance for payer");
      throw new Error("Payer does not have enough SOL");
    }
    console.log("✅ Payer has sufficient balance for testing");
  });

  it("should create a new account", async () => {
    console.log("\n🔄 Starting account creation test...");

    console.log("🔐 Generating new account keypair...");
    const newAccount = Keypair.generate();
    console.log("📝 New account public key:", newAccount.publicKey.toString());
    console.log(
      "🔑 New account secret key length:",
      newAccount.secretKey.length,
      "bytes"
    );

    console.log("🏗️ Building transaction instruction...");
    console.log("🎯 Target program ID:", PROGRAM_ID.toString());

    // The Rust program expects accounts in this order: payer, new_account, system_program
    const ix = new TransactionInstruction({
      programId: PROGRAM_ID,
      data: Buffer.alloc(0), // The program doesn't use instruction data
      keys: [
        {
          pubkey: payer.publicKey,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: newAccount.publicKey,
          isSigner: true, // Must be a signer since we're creating it
          isWritable: true,
        },
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
    });
    console.log("✅ Transaction instruction created successfully");
    console.log("📋 Instruction details:");
    console.log("   - Program ID:", ix.programId.toString());
    console.log("   - Data length:", ix.data.length, "bytes");
    console.log("   - Number of accounts:", ix.keys.length);
    ix.keys.forEach((key, index) => {
      console.log(`   - Account ${index}:`, key.pubkey.toString());
      console.log(`     Signer: ${key.isSigner}, Writable: ${key.isWritable}`);
    });

    console.log("📦 Creating transaction...");
    const tx = new Transaction().add(ix);
    console.log("✅ Transaction created with instruction");

    console.log("📤 Sending transaction to network...");
    console.log("👤 Signers:", [
      payer.publicKey.toString(),
      newAccount.publicKey.toString(),
    ]);

    const startTime = Date.now();
    const sig = await sendAndConfirmTransaction(connection, tx, [
      payer,
      newAccount,
    ]);
    const endTime = Date.now();

    console.log("✅ Transaction confirmed successfully!");
    console.log("🔗 Transaction signature:", sig);
    console.log("⏱️ Transaction time:", endTime - startTime, "ms");
    console.log(
      "🔍 View transaction on Solana Explorer: https://explorer.solana.com/tx/" +
        sig +
        "?cluster=devnet"
    );

    console.log("🔍 Verifying account creation...");
    const accountInfo = await connection.getAccountInfo(newAccount.publicKey);
    console.log(
      "📊 Account info retrieved:",
      accountInfo ? "SUCCESS" : "FAILED"
    );

    if (accountInfo) {
      console.log("📈 Account details:");
      console.log("   - Lamports:", accountInfo.lamports);
      console.log("   - Owner:", accountInfo.owner.toString());
      console.log("   - Executable:", accountInfo.executable);
      console.log("   - Rent epoch:", accountInfo.rentEpoch);
      console.log("   - Data length:", accountInfo.data.length, "bytes");
    }

    expect(accountInfo).toBeDefined();
    expect(accountInfo!.lamports).toBeGreaterThan(0);
    console.log("✅ Account creation verification passed!");
  });

  it("should throw error for invalid environment", () => {
    console.log("\n🧪 Testing invalid environment handling...");
    console.log(
      "❌ Attempting to setup connection with invalid environment..."
    );

    expect(() => setupConnection("invalid")).toThrow(
      "Invalid environment: invalid"
    );
    console.log("✅ Invalid environment error handled correctly");
  });

  it("should load keypair from default path", () => {
    console.log("\n🔑 Testing keypair loading...");
    console.log("📂 Loading keypair from default path...");

    const keypair = loadKeypair();
    console.log("✅ Keypair loaded successfully");
    console.log("🔐 Keypair public key:", keypair.publicKey.toString());
    console.log(
      "📏 Keypair secret key length:",
      keypair.secretKey.length,
      "bytes"
    );

    expect(keypair).toBeInstanceOf(Object);
    expect(keypair.publicKey).toBeDefined();
    console.log("✅ Keypair validation passed!");
  });

  afterAll(async () => {
    console.log("\n🏁 Test suite completed!");
    console.log("📊 Final payer balance check...");
    const finalBalance = await connection.getBalance(payer.publicKey);
    console.log("💵 Final payer balance:", finalBalance, "lamports");
    console.log(
      "💵 Final payer balance:",
      finalBalance / LAMPORTS_PER_SOL,
      "SOL"
    );
  });
});
