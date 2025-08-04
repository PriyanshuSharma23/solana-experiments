import chalk from "chalk";
import { Keypair } from "@solana/web3.js";
import * as bip39 from "bip39";
import fs from "fs/promises";
import path from "path";

function printError(errorMessage: string) {
  console.log();
  console.log(chalk.bgRed.white.bold(" ERROR "), chalk.red(errorMessage));
  console.log();
  console.log(
    chalk.dim("Use ") +
      chalk.cyan("wallet --help") +
      chalk.dim(" to view available commands."),
  );
  console.log();
}

function printUsage() {
  console.log(chalk.bgRed.bold(" Welcome to CLI Wallet! "));
  console.log();
  console.log(chalk.bold("Usage:"));
  console.log();
  console.log(
    chalk.cyan("  wallet"),
    chalk.yellow("<command>"),
    chalk.gray("[options]"),
  );
  console.log();
  console.log(chalk.bold("Commands:"));
  console.log(
    `  ${chalk.green("create")}     ${chalk.gray("Generate a new wallet and save the keypair to a file")}`,
  );
  console.log(
    `  ${chalk.green("import")}     ${chalk.gray("Import a wallet from an existing private key JSON")}`,
  );
  console.log(
    `  ${chalk.green("balance")}    ${chalk.gray("Check the SOL balance of your wallet")}`,
  );
  console.log(
    `  ${chalk.green("airdrop")}    ${chalk.gray("Request SOL from the Devnet faucet")}`,
  );
  console.log(
    `  ${chalk.green("send")}       ${chalk.gray("Send SOL to another wallet address")}`,
  );
  console.log(
    `  ${chalk.green("history")}    ${chalk.gray("View recent transactions")}`,
  );
  console.log();
  console.log(chalk.bold("Examples:"));
  console.log(`  ${chalk.gray("$")} wallet create`);
  console.log(`  ${chalk.gray("$")} wallet import --file wallet.json`);
  console.log(`  ${chalk.gray("$")} wallet balance`);
  console.log(`  ${chalk.gray("$")} wallet send --to <address> --amount 0.5`);
  console.log();
}

const args = process.argv;
const cwd = process.cwd();

if (args.length < 3) {
  printError("No command provided");
}

const command = args[2];

switch (command) {
  case "--help":
    printUsage();
    break;

  case "create":
    let walletPath = cwd;
    if (args.length > 3) {
      walletPath = args[3]!;
    }

    let walletName = "id";
    if (args.length > 5) {
      if (args[4] == "--name" && args[5]!.trim() != "") {
        walletName = args[5]!;
      }
    }

    await createWallet({ walletPath: walletPath, name: walletName });
    break;

  default:
    printError(`Given command ${chalk.white(command)} not found`);
}

type CreateWalletParams = {
  name: string;
  walletPath?: string;
};

function generateMnemonic(): string {
  return bip39.generateMnemonic();
}

async function mnemonicToKeypair(mnemonic: string): Promise<Keypair> {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const kp = Keypair.fromSeed(seed.subarray(0, 32));
  return kp;
}

/**
 * Checks if it is safe to create a new file at the given path.
 * A path is considered valid for file creation if:
 * 1. The path does not already exist.
 * 2. The path's parent directory exists and is a directory.
 *
 * This function handles cases where the path is an existing file or directory,
 * or where the parent path does not exist.
 *
 * @param filePath The full path to the file to be created.
 * @returns A promise that resolves to `true` if the file can be created, otherwise `false`.
 */
export async function checkFilePathForCreation(
  filePath: string,
): Promise<boolean> {
  // First, check if the file or directory already exists at the specified path.
  try {
    const stats = await fs.stat(filePath);
    // If fs.stat succeeds, the path already exists.
    // It's not OK to create a file if a file or directory is already there.
    if (stats.isFile() || stats.isDirectory()) {
      console.log(
        `Path already exists as a ${stats.isFile() ? "file" : "directory"}: ${filePath}`,
      );
      return false;
    }
  } catch (err: any) {
    // If fs.stat throws an error, it's either because the file does not exist
    // (code 'ENOENT'), or for some other reason (e.g., permissions).
    if (err.code !== "ENOENT") {
      // If the error is not 'ENOENT', something else is wrong.
      console.error(`Error checking path: ${filePath}`, err);
      return false;
    }
    // If the error is 'ENOENT', the path does not exist, which is what we want.
    // Now, we need to check if the parent directory exists.
  }

  // Get the parent directory of the target file.
  const parentDir = path.dirname(filePath);

  // Check if the parent directory exists and is a directory.
  try {
    const parentStats = await fs.stat(parentDir);
    if (!parentStats.isDirectory()) {
      // The parent path exists but is not a directory.
      console.log(`Parent path is not a directory: ${parentDir}`);
      return false;
    }
  } catch (err: any) {
    // If the parent directory doesn't exist, we can't create the file.
    if (err.code === "ENOENT") {
      console.log(`Parent directory does not exist: ${parentDir}`);
      return false;
    }
    // If some other error occurs, it's not safe to proceed.
    console.error(`Error checking parent directory: ${parentDir}`, err);
    return false;
  }

  // If we've reached this point, the file doesn't exist and the parent directory does.
  // It is safe to proceed with file creation.
  return true;
}

async function createWallet({ walletPath = cwd, name }: CreateWalletParams) {
  const kpPath = path.join(walletPath, `${name}.json`);

  if (!checkFilePathForCreation(kpPath)) {
    return;
  }

  const mnemonic = generateMnemonic();

  console.log(
    `${chalk.white.bold("Here is the mnemonic keep it safe.")}\n\n${mnemonic}\n\n`,
  );

  const kp = await mnemonicToKeypair(mnemonic);
  const content = JSON.stringify(Array.from(kp.secretKey));

  await fs.writeFile(kpPath, content);
  console.log(
    `Successfully created file and saved secret key in ${chalk.green(kpPath)}`,
  );
}
