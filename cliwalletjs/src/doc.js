import chalk from "chalk";

export function printUsage() {
  console.log(chalk.bgRed.bold(" Welcome to CLI Wallet! "));
  console.log();
  console.log(chalk.bold("Usage:"));
  console.log();
  console.log(
    chalk.cyan("  wallet"),
    chalk.yellow("<command>"),
    chalk.gray("[options]")
  );
  console.log();
  console.log(chalk.bold("Commands:"));
  console.log(
    `  ${chalk.green("create")}     ${chalk.gray(
      "Generate a new wallet and save the keypair to a file"
    )}`
  );
  console.log(
    `  ${chalk.green("import")}     ${chalk.gray(
      "Import a wallet from an existing private key JSON"
    )}`
  );
  console.log(
    `  ${chalk.green("balance")}    ${chalk.gray(
      "Check the SOL balance of your wallet"
    )}`
  );
  console.log(
    `  ${chalk.green("airdrop")}    ${chalk.gray(
      "Request SOL from the Devnet faucet"
    )}`
  );
  console.log(
    `  ${chalk.green("send")}       ${chalk.gray(
      "Send SOL to another wallet address"
    )}`
  );
  console.log(
    `  ${chalk.green("history")}    ${chalk.gray("View recent transactions")}`
  );
  console.log();
  console.log(chalk.bold("Examples:"));
  console.log(`  ${chalk.gray("$")} wallet create`);
  console.log(`  ${chalk.gray("$")} wallet import --file wallet.json`);
  console.log(`  ${chalk.gray("$")} wallet balance`);
  console.log(`  ${chalk.gray("$")} wallet send --to <address> --amount 0.5`);
  console.log();
}

export function printError(errorMessage) {
  console.log(chalk.red(errorMessage));
  console.log();
  console.log(chalk.dim("Use --help with any command to see more details."));
}
