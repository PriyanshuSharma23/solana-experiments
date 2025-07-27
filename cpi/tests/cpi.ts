import * as fs from "fs";
import * as os from "os";
import { Connection, Keypair } from "@solana/web3.js";

const DEFAULT_KEYPAIR_PATH = os.homedir() + "/.config/solana/id.json";

export function setupConnection(env: string): Connection {
  switch (env) {
    case "devnet":
      return new Connection("https://api.devnet.solana.com", "confirmed");
    case "testnet":
      return new Connection("https://api.testnet.solana.com", "confirmed");
    case "mainnet":
      return new Connection("https://api.mainnet.solana.com", "confirmed");
    default:
      throw new Error(`Invalid environment: ${env}`);
  }
}

export function loadKeypair(path: string = DEFAULT_KEYPAIR_PATH): Keypair {
  const keypair = Keypair.fromSecretKey(
    Buffer.from(JSON.parse(fs.readFileSync(path, "utf8")))
  );
  return keypair;
}
