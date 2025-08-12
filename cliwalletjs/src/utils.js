import { Connection, Keypair } from "@solana/web3.js";
import pathModule from "path";
import { promises as fs } from "fs";

import { DEFAULT_RPC_URL } from "./main.js";

/**
 * This function verifies if the path is a valid file path.
 *
 * @param {string} path Path to verify
 * @returns {boolean} True if the path is a valid file path, false otherwise
 */
export async function verifyFilePath(path) {
  path = path.trim();

  if (!path) {
    return false;
  }

  if (path.startsWith("~")) {
    path = path.replace("~", process.env.HOME);
  }

  try {
    await fs.access(path);
    return true;
  } catch (error) {
    // If file doesn't exist, check if parent directory exists and is a directory
    const parentDir = pathModule.dirname(path);
    try {
      const stat = await fs.stat(parentDir);
      return stat.isDirectory();
    } catch (e) {
      return false;
    }
  }
}

export async function getKeypairFromFilePath(filePath) {
  const secretKeyJson = await fs.readFile(filePath, "utf8");
  const secretKey = Uint8Array.from(JSON.parse(secretKeyJson));
  return Keypair.fromSecretKey(secretKey);
}

export async function getConnection() {
  return new Connection(process.env.RPC_URL || DEFAULT_RPC_URL, "confirmed");
}

/**
 * @type {Connection} connection
 */
export async function confirmTransaction(connection, signature) {
  const latestBlockhash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature,
  });
}
