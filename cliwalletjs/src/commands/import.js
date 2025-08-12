import { getKeypairFromFilePath, verifyFilePath } from "../utils.js";

export const importWalletArgs = [
  {
    name: "file",
    type: "string",
  },
];

export async function importWallet(args) {
  if (!verifyFilePath(args.file)) {
    printError("Invalid file path");
    return;
  }

  const keypair = await getKeypairFromFilePath(args.file);

  console.log(`Wallet imported successfully!`);
  console.log(`Address: ${keypair.publicKey.toBase58()}`);
}
