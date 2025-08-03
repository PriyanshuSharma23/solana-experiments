import {
  Connection,
  Keypair,
  SystemProgram,
  PublicKey,
  sendAndConfirmRawTransaction,
  Transaction,
  sendAndConfirmTransaction,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import fs from "fs";
import os from "os";
import { Instruction, InstructionSchema } from "./state";
import { deserialize, serialize } from "borsh";

const PROGRAM_ID = new PublicKey(
  "DHy9SsxXpyRycRx1W4AUmK7eW9tiVXDzsiVve3fXDpik",
);

function loadKeypair() {
  let path = `${os.homedir()}/.config/solana/id.json`;
  let content = fs.readFileSync(path, "utf-8");
  return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(content)));
}

const createAccountIx = async (
  connection: Connection,
  newAccount: Keypair,
  payer: Keypair,
  owner: PublicKey,
  balance: number = 0,
) => {
  const minRent = await connection.getMinimumBalanceForRentExemption(
    0,
    "confirmed",
  );

  return SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: newAccount.publicKey,
    lamports: minRent + balance,
    space: 0,
    programId: owner,
  });
};

const getBalance = async (connection: Connection, publicKey: PublicKey) => {
  return await connection.getBalance(publicKey);
};

const printBalances = async (
  connection: Connection,
  ...publicKeys: PublicKey[]
) => {
  for (let p of publicKeys) {
    let balance = await getBalance(connection, p);
    console.log(
      "Balance of account:",
      p,
      "is:",
      balance / LAMPORTS_PER_SOL,
      "SOL",
    );
  }
};

describe("Transfer SOL using program account", () => {
  const payerAccount = loadKeypair();

  const testWallet1 = new Keypair();
  const testWallet2 = new Keypair();

  const cpiWallet = new Keypair();
  const connection = new Connection("http://localhost:8899", "confirmed");

  it.skip("Should transfer SOL using CPI instruction", async () => {
    console.log("=== TRANSFER SOL PROGRAM TEST START ===");
    console.log("Program ID:", PROGRAM_ID.toBase58());
    console.log("Connection endpoint: http://localhost:8899");
    console.log("");

    console.log("=== ACCOUNT ADDRESSES ===");
    console.log("Payer account:", payerAccount.publicKey.toBase58());
    console.log("CPI wallet (to be created):", cpiWallet.publicKey.toBase58());
    console.log("");

    // Get initial balances
    console.log("=== INITIAL BALANCES ===");
    const initialPayerBalance = await connection.getBalance(
      payerAccount.publicKey,
      "confirmed",
    );
    console.log("Payer initial balance:", initialPayerBalance, "lamports");
    console.log(
      "Payer initial balance:",
      initialPayerBalance / LAMPORTS_PER_SOL,
      "SOL",
    );
    console.log("");

    console.log("=== STEP 1: CREATING CPI WALLET ===");
    console.log("Creating account instruction for CPI wallet...");

    let ix = await createAccountIx(
      connection,
      cpiWallet,
      payerAccount,
      payerAccount.publicKey,
    );

    console.log("CreateAccount instruction prepared successfully");
    console.log("From account:", payerAccount.publicKey.toBase58());
    console.log("New account:", cpiWallet.publicKey.toBase58());
    console.log("Owner:", payerAccount.publicKey.toBase58());
    console.log("Sending transaction to create CPI wallet...");

    let sig = await sendAndConfirmTransaction(
      connection,
      new Transaction().add(ix),
      [payerAccount, cpiWallet],
    );

    console.log("✅ CPI wallet created successfully!");
    console.log("CPI wallet address:", cpiWallet.publicKey.toBase58());
    console.log("Transaction signature:", sig.toString());
    console.log("");

    // Fetch and log the balance of the new CPI wallet
    const cpiWalletBalance = await connection.getBalance(
      cpiWallet.publicKey,
      "confirmed",
    );
    console.log("=== POST-CREATION BALANCES ===");
    console.log("CPI wallet balance:", cpiWalletBalance, "lamports");
    console.log(
      "CPI wallet balance:",
      cpiWalletBalance / LAMPORTS_PER_SOL,
      "SOL",
    );

    // Fetch and log the balance of the payer account
    const payerBalanceAfterCreation = await connection.getBalance(
      payerAccount.publicKey,
      "confirmed",
    );

    console.log(
      "Payer account balance:",
      payerBalanceAfterCreation,
      "lamports",
    );
    console.log(
      "Payer account balance:",
      payerBalanceAfterCreation / LAMPORTS_PER_SOL,
      "SOL",
    );
    console.log(
      "Balance change:",
      (payerBalanceAfterCreation - initialPayerBalance) / LAMPORTS_PER_SOL,
      "SOL",
    );
    console.log("");

    console.log("=== STEP 2: PERFORMING CPI TRANSFER ===");
    console.log("Preparing CPI transfer instruction...");
    console.log("Transfer amount:", LAMPORTS_PER_SOL, "lamports (1 SOL)");
    console.log("From:", payerAccount.publicKey.toBase58());
    console.log("To:", cpiWallet.publicKey.toBase58());
    console.log("Program ID:", PROGRAM_ID.toBase58());

    const cpiTransferIx = new TransactionInstruction({
      keys: [
        { pubkey: payerAccount.publicKey, isSigner: true, isWritable: true },
        { pubkey: cpiWallet.publicKey, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: PROGRAM_ID,
      data: Buffer.from(
        serialize(InstructionSchema, {
          CpiTransfer: {
            amount: LAMPORTS_PER_SOL,
          },
        }).buffer,
      ),
    });

    console.log("CPI transfer instruction prepared successfully");
    console.log("Sending CPI transfer transaction...");

    let cpiTransferSig = await sendAndConfirmTransaction(
      connection,
      new Transaction().add(cpiTransferIx),
      [payerAccount],
    );

    console.log("✅ CPI transfer completed successfully!");
    console.log(
      "CPI transfer transaction signature:",
      cpiTransferSig.toString(),
    );
    console.log("");

    // Final balance check
    console.log("=== FINAL BALANCES ===");
    const finalCpiWalletBalance = await connection.getBalance(
      cpiWallet.publicKey,
      "confirmed",
    );
    console.log("CPI wallet final balance:", finalCpiWalletBalance, "lamports");
    console.log(
      "CPI wallet final balance:",
      finalCpiWalletBalance / LAMPORTS_PER_SOL,
      "SOL",
    );
    console.log(
      "CPI wallet balance change:",
      (finalCpiWalletBalance - cpiWalletBalance) / LAMPORTS_PER_SOL,
      "SOL",
    );

    const finalPayerBalance = await connection.getBalance(
      payerAccount.publicKey,
      "confirmed",
    );
    console.log("Payer final balance:", finalPayerBalance, "lamports");
    console.log(
      "Payer final balance:",
      finalPayerBalance / LAMPORTS_PER_SOL,
      "SOL",
    );
    console.log(
      "Payer balance change:",
      (finalPayerBalance - payerBalanceAfterCreation) / LAMPORTS_PER_SOL,
      "SOL",
    );

    console.log("");
    console.log("=== TEST SUMMARY ===");
    console.log("✅ CPI wallet creation: SUCCESS");
    console.log("✅ CPI transfer: SUCCESS");
    console.log(
      "Total SOL transferred:",
      LAMPORTS_PER_SOL / LAMPORTS_PER_SOL,
      "SOL",
    );
    console.log("=== TRANSFER SOL PROGRAM TEST COMPLETED ===");
  }, 100000);

  it("Should call the program to transfer SOL with program account", async () => {
    console.log("=== TRANSFER SOL PROGRAM TEST START ===");
    console.log("Program ID:", PROGRAM_ID.toBase58());
    console.log("Connection endpoint: http://localhost:8899");
    console.log("");

    console.log("=== ACCOUNT ADDRESSES ===");
    console.log("Payer account:", payerAccount.publicKey.toBase58());
    console.log("Test wallet 1:", testWallet1.publicKey.toBase58());
    console.log("Test wallet 2:", testWallet2.publicKey.toBase58());
    console.log("");

    console.log("=== INITIALIZE ACCOUNTS ===");
    let ix1 = await createAccountIx(
      connection,
      testWallet1,
      payerAccount,
      PROGRAM_ID,
      2 * LAMPORTS_PER_SOL,
    );
    let ix2 = await createAccountIx(
      connection,
      testWallet2,
      payerAccount,
      PROGRAM_ID,
    );

    let sig1 = await sendAndConfirmTransaction(
      connection,
      new Transaction().add(ix1).add(ix2),
      [payerAccount, testWallet1, testWallet2],
    );

    console.log("✅ Test wallets created successfully!");
    console.log("test1 wallet address:", testWallet1.publicKey.toBase58());
    console.log("test2 wallet address:", testWallet2.publicKey.toBase58());
    console.log("Transaction signature:", sig1.toString());
    console.log("");

    await printBalances(
      connection,
      testWallet1.publicKey,
      testWallet2.publicKey,
    );

    const instructionData = {
      ProgramTransfer: {
        amount: LAMPORTS_PER_SOL,
      },
    };

    const ix = new TransactionInstruction({
      keys: [
        { pubkey: payerAccount.publicKey, isSigner: true, isWritable: true },
        { pubkey: testWallet1.publicKey, isSigner: true, isWritable: true },
        { pubkey: testWallet2.publicKey, isSigner: false, isWritable: true },
      ],
      programId: PROGRAM_ID,
      data: Buffer.from(serialize(InstructionSchema, instructionData).buffer),
    });

    sendAndConfirmTransaction(connection, new Transaction().add(ix), [
      payerAccount,
      testWallet1,
    ]);

    await printBalances(
      connection,
      testWallet1.publicKey,
      testWallet2.publicKey,
    );
  }, 100000);
});
