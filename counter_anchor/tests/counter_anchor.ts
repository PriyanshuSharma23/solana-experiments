import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CounterAnchor } from "../target/types/counter_anchor";
import { expect } from "chai";

async function confirmAndReadCounter(
  connection: anchor.web3.Connection,
  program: anchor.Program<CounterAnchor>,
  wallet: anchor.web3.Keypair,
  sig: string
): Promise<number> {
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash("confirmed");
  await connection.confirmTransaction({
    blockhash,
    lastValidBlockHeight,
    signature: sig,
  });

  const counter = await program.account.counterState.fetch(
    wallet.publicKey,
    "confirmed"
  );

  return counter.data.toNumber();
}

describe("counter_anchor", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const connection = provider.connection;
  const payerWallet = provider.wallet;
  const counterKP = anchor.web3.Keypair.generate();

  const program = anchor.workspace.counterAnchor as Program<CounterAnchor>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
      .initialize()
      .accounts({
        counter: counterKP.publicKey,
        signer: payerWallet.publicKey,
      })
      .signers([counterKP])
      .rpc();

    console.log("Your transaction signature", tx);
    const num = await confirmAndReadCounter(connection, program, counterKP, tx);
    expect(num).eq(0);
  });

  it("Increment counter", async () => {
    const incBy = new anchor.BN(4);
    const tx = await program.methods
      .increment(incBy)
      .accounts({
        counter: counterKP.publicKey,
        signer: payerWallet.publicKey,
      })
      .rpc();

    console.log("Your transaction signature", tx);
    const num = await confirmAndReadCounter(connection, program, counterKP, tx);
    expect(num).eq(4);
  });

  it("Decrement counter", async () => {
    const decBy = new anchor.BN(2);
    const tx = await program.methods
      .decrement(decBy)
      .accounts({
        counter: counterKP.publicKey,
        signer: payerWallet.publicKey,
      })
      .rpc();

    console.log("Your transaction signature", tx);
    const num = await confirmAndReadCounter(connection, program, counterKP, tx);
    expect(num).eq(2);
  });
});
