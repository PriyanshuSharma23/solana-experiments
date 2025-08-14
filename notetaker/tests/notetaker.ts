import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Notetaker } from "../target/types/notetaker";
import { expect } from "chai";

async function readNote(noteAddr: anchor.web3.PublicKey) {
  const program = anchor.workspace.notetaker as Program<Notetaker>;
  const note = await program.account.noteState.fetch(noteAddr, "confirmed");
  return note;
}

describe("notetaker", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.notetaker as Program<Notetaker>;
  const note = "Chinu is a dummy";
  const updatedNote = "Chinu is a real dummy for sure for sure";

  const noteAccount = anchor.web3.Keypair.generate();

  const signerAccount = provider.wallet;
  const connection = provider.connection;

  it("Initialize note", async () => {
    // Add your test here.
    const tx = await program.methods
      .createNote(note)
      .accounts({
        noteAccount: noteAccount.publicKey,
        signer: signerAccount.publicKey,
      })
      .signers([noteAccount])
      .rpc();
    console.log("Your transaction signature", tx);

    const hash = await connection.getLatestBlockhash("confirmed");
    await connection.confirmTransaction({ ...hash, signature: tx });

    const noteState = await readNote(noteAccount.publicKey);

    expect(noteState.data).eq(note);
  });

  it("Update note", async () => {
    const tx = await program.methods
      .updateNote(updatedNote)
      .accounts({
        noteAccount: noteAccount.publicKey,
        signer: signerAccount.publicKey,
      })
      .signers([])
      .rpc();

    const hash = await connection.getLatestBlockhash();
    await connection.confirmTransaction({ ...hash, signature: tx });

    const noteState = await readNote(noteAccount.publicKey);
    expect(noteState.data).eq(updatedNote);
  });

  it("Delete note", async () => {
    const tx = await program.methods
      .deleteNote()
      .accounts({
        noteAccount: noteAccount.publicKey,
        signer: signerAccount.publicKey,
      })
      .signers([])
      .rpc();

    const hash = await connection.getLatestBlockhash();
    await connection.confirmTransaction({ ...hash, signature: tx });

    try {
      const noteState = await readNote(noteAccount.publicKey);
      console.log(noteState);
      throw new Error("Note exists when it should not!");
    } catch (err: any) {
      expect(err.toString().toLowerCase()).contains("account does not exist");
    }
  });
});
