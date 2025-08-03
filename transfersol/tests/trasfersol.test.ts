import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import fs from "fs";

function loadWallet(): Keypair {
  let path = "/Users/priyanshu.sharma/.config/solana/id.json";
  let content = fs.readFileSync(path, "utf-8");
  return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(content)));
}

describe("Transfer SOL Client side", () => {
  it("transfer some sol to a wallet", async () => {
    // const testWallet = Keypair.generate();
    // console.log("Created a test wallet:", testWallet.publicKey);
    // const payer = loadWallet();
    // console.log("Loaded payer wallet:", payer.publicKey);
    // let connection = new Connection("http://localhost:8899");
    // let ix = SystemProgram.transfer({
    //   fromPubkey: payer.publicKey,
    //   toPubkey: testWallet.publicKey,
    //   lamports: LAMPORTS_PER_SOL,
    // });
    // let sig = await sendAndConfirmTransaction(
    //   connection,
    //   new Transaction().add(ix),
    //   [payer]
    // );
    // console.log(
    //   `Successfully transfered 1 SOL to ${testWallet.publicKey.toString()}`
    // );
    // console.log("Trasaction signature:", sig.toString());
  }, 50000);
});
