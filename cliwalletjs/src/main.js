import { createWallet, createWalletArgs } from "./commands/create.js";
import { importWallet, importWalletArgs } from "./commands/import.js";
import { balance, balanceArgs } from "./commands/balance.js";
import { airdrop, airdropArgs } from "./commands/airdrop.js";
import { send, sendArgs } from "./commands/send.js";
import { history, historyArgs } from "./commands/history.js";
import { printUsage, printError } from "./doc.js";

export const DEFAULT_RPC_URL = "https://api.devnet.solana.com";
export const FLAG_PREFIX = "--";

const args = process.argv.slice(2);

const command = args[0];
const commandArgs = args.slice(1);

/**
 *
 * @param {string[]} args
 * @param {Object[]} flags
 * @param {string} flags.name
 * @param {string} flags.type
 * @returns {Object}
 */
function parseArgs(args, flags) {
  const parsedArgs = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    const flag = arg.startsWith(FLAG_PREFIX)
      ? arg.slice(FLAG_PREFIX.length)
      : null;

    if (flag) {
      const flagIndex = flags.findIndex((f) => f.name === flag);

      if (flagIndex !== -1) {
        const flagType = flags[flagIndex].type;

        if (flagType === "string" && args[i + 1]) {
          parsedArgs[flag] = args[i + 1];
        } else if (flagType === "boolean") {
          parsedArgs[flag] = true;
        } else if (flagType === "number") {
          const val = Number(args[i + 1]);

          if (isNaN(val)) {
            printError(`Invalid number for flag: ${flag}`);
            process.exit(1);
          }

          parsedArgs[flag] = val;
        }
      }
    }
  }

  return parsedArgs;
}

switch (command) {
  case "create":
    createWallet(parseArgs(commandArgs, createWalletArgs));
    break;
  case "import":
    importWallet(parseArgs(commandArgs, importWalletArgs));
    break;
  case "balance":
    balance(parseArgs(commandArgs, balanceArgs));
    break;
  case "airdrop":
    airdrop(parseArgs(commandArgs, airdropArgs));
    break;
  case "send":
    send(parseArgs(commandArgs, sendArgs));
    break;
  case "history":
    history(parseArgs(commandArgs, historyArgs));
    break;
  default:
    printError(`Unknown command: ${command}`);
    printUsage();
    break;
}
