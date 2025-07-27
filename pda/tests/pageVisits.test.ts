import { deserialize, serialize } from "borsh";
import {
  IncrementPageVisits,
  PageVisits,
  programID,
  InstructionSchema,
  PageVisitsSchema,
} from "./pageVisits";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { homedir } from "os";
import { join as pathJoin } from "path";
import { readFileSync } from "fs";

const CONNECTION_ENDPOINT = "http://127.0.0.1:8899";
const LOCAL_WALLET_PATH = pathJoin(homedir(), ".config", "solana", "id.json");

function loadWalletFromFile(path = LOCAL_WALLET_PATH) {
  console.log("💳 Loading wallet from:", LOCAL_WALLET_PATH);
  const raw = readFileSync(path, "utf8");
  const keypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(raw)));
  console.log("💳 Loaded wallet, pubic key:", keypair.publicKey.toString());
  return keypair;
}

function deriveProgramPDA(pubKey: PublicKey) {
  const programAddress = new PublicKey(programID);
  const seeds = [Buffer.from("page_visits"), pubKey.toBuffer()];
  return PublicKey.findProgramAddressSync(seeds, programAddress);
}

describe("Test serialization", function () {
  const connection = new Connection(CONNECTION_ENDPOINT);
  const payer = loadWalletFromFile();
  const programAddress = new PublicKey(programID);

  it("Size of serialized increment page", () => {
    const incrementPage = new IncrementPageVisits();
    let size = serialize(InstructionSchema, {
      Increment: incrementPage,
    }).length;
    console.log("Size after serialization:", size);
    expect(size).toBe(0);
  });

  it("Initialize the page visits program", async () => {
    let connection = new Connection(CONNECTION_ENDPOINT);
    expect(connection).not.toBe(null);
  });

  it("Read the wallet from the local id.json", () => {
    let wallet = loadWalletFromFile();
    expect(wallet).not.toBe(null);
  });

  it("Should create a pda and bump for a user", async function () {
    let [pda, bump] = deriveProgramPDA(payer.publicKey);

    let ix = new TransactionInstruction({
      programId: programAddress,
      keys: [
        { pubkey: pda, isSigner: false, isWritable: true },
        { pubkey: payer.publicKey, isSigner: false, isWritable: false },
        { pubkey: payer.publicKey, isSigner: true, isWritable: true },
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      data: Buffer.from(
        serialize(InstructionSchema, {
          Initialize: new PageVisits({
            visits: 0,
            bump: bump,
          }),
        }).buffer
      ),
    });

    const tx = new Transaction().add(ix);

    await sendAndConfirmTransaction(connection, tx, [payer]);
  }, 100000);

  it("Visit the page!", async () => {
    const [pda] = deriveProgramPDA(payer.publicKey);

    const ix = new TransactionInstruction({
      programId: programAddress,
      keys: [
        {
          pubkey: pda,
          isSigner: false,
          isWritable: true,
        },
        { pubkey: payer.publicKey, isSigner: true, isWritable: true },
      ],
      data: Buffer.from(
        serialize(InstructionSchema, {
          Increment: new IncrementPageVisits({}),
        }).buffer
      ),
    });

    await sendAndConfirmTransaction(connection, new Transaction().add(ix), [
      payer,
    ]);
  }, 100000);

  it("Visit the page!", async () => {
    const [pda] = deriveProgramPDA(payer.publicKey);

    const ix = new TransactionInstruction({
      programId: programAddress,
      keys: [
        {
          pubkey: pda,
          isSigner: false,
          isWritable: true,
        },
        { pubkey: payer.publicKey, isSigner: true, isWritable: true },
      ],
      data: Buffer.from(
        serialize(InstructionSchema, {
          Increment: new IncrementPageVisits({}),
        }).buffer
      ),
    });

    await sendAndConfirmTransaction(connection, new Transaction().add(ix), [
      payer,
    ]);
  }, 100000);

  it("Reads the page visits", async () => {
    const [pda] = deriveProgramPDA(payer.publicKey);
    const accountInfo = await connection.getAccountInfo(pda);

    expect(accountInfo?.data).not.toBeNull();

    const pageVisits = deserialize(
      PageVisitsSchema,
      Uint8Array.from(accountInfo!.data)
    ) as PageVisits;

    console.log("Pagevisits =", pageVisits.visits);
  });
});
