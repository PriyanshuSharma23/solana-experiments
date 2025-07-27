"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3 = __importStar(require("@solana/web3.js"));
const borsh_1 = require("@dao-xyz/borsh");
const vitest_1 = require("vitest");
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
class Counter {
    constructor(data) {
        this.count = 0;
        if (data) {
            this.count = data.count;
        }
    }
}
__decorate([
    (0, borsh_1.field)({ type: "u32" }),
    __metadata("design:type", Number)
], Counter.prototype, "count", void 0);
function readFile(path) {
    console.log(`Reading file from: ${path}`);
    const content = fs_1.default.readFileSync(path, "utf8");
    console.log(`Successfully read file, length: ${content.length} characters`);
    return content;
}
const COUNTER_SIZE = (0, borsh_1.serialize)(new Counter({ count: 0 })).length;
console.log(`Counter serialized size: ${COUNTER_SIZE} bytes`);
const idJSON = readFile(os_1.default.homedir() + "/.config/solana/id.json");
console.log(COUNTER_SIZE);
async function createCounterAccount(connection, payer) {
    console.log("=== Creating Counter Account ===");
    console.log(`Payer public key: ${payer.publicKey.toBase58()}`);
    const counterAccount = web3.Keypair.generate();
    console.log(`Generated counter account: ${counterAccount.publicKey.toBase58()}`);
    const minRent = await connection.getMinimumBalanceForRentExemption(COUNTER_SIZE);
    console.log(`Minimum rent for ${COUNTER_SIZE} bytes: ${minRent} lamports`);
    const tx = new web3.Transaction().add(web3.SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: counterAccount.publicKey,
        lamports: minRent,
        space: COUNTER_SIZE,
        programId: programID,
    }));
    console.log("Sending create account transaction...");
    const signature = await web3.sendAndConfirmTransaction(connection, tx, [
        payer,
        counterAccount,
    ]);
    console.log("✅ Counter account created successfully");
    console.log(`Transaction signature: ${signature}`);
    console.log(`Counter account address: ${counterAccount.publicKey.toBase58()}`);
    return counterAccount;
}
async function getBalance(connection, pubkey) {
    console.log(`=== Checking Balance ===`);
    console.log(`Account: ${pubkey.toBase58()}`);
    const balance = await connection.getBalance(pubkey);
    console.log(`Balance: ${balance} lamports (${balance / web3.LAMPORTS_PER_SOL} SOL)`);
    return balance;
}
async function readCounter(connection, pubkey) {
    console.log(`=== Reading Counter ===`);
    console.log(`Counter account: ${pubkey.toBase58()}`);
    const counter = await connection.getAccountInfo(pubkey);
    if (!counter) {
        console.error("❌ Counter account not found");
        throw new Error("Counter account not found");
    }
    console.log(`Account data length: ${counter.data.length} bytes`);
    console.log(`Account owner: ${counter.owner.toBase58()}`);
    console.log(`Account lamports: ${counter.lamports}`);
    const counterData = (0, borsh_1.deserialize)(counter.data, Counter);
    console.log(`Deserialized counter value: ${counterData.count}`);
    return counterData.count;
}
const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
console.log("=== Initializing Connection ===");
console.log(`Connected to: ${web3.clusterApiUrl("devnet")}`);
const programID = new web3.PublicKey("4vpSg1TzFrETdcCcjuUoisNUnXPP5LfABUGZotxVSHNC");
console.log(`Program ID: ${programID.toBase58()}`);
const payer = web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(idJSON)));
console.log("=== Loaded Payer ===");
console.log(`Payer public key: ${payer.publicKey.toBase58()}`);
// Check initial payer balance
(0, vitest_1.describe)("Test Counter", async () => {
    console.log("=== Starting Test Suite ===");
    const counterAccount = await createCounterAccount(connection, payer);
    (0, vitest_1.test)("Counter size", () => {
        console.log("=== Testing Counter Size ===");
        console.log(`Expected size: 4, Actual size: ${COUNTER_SIZE}`);
        (0, vitest_1.expect)(COUNTER_SIZE).toBe(4);
        console.log("✅ Counter size test passed");
    });
    (0, vitest_1.test)("Counter account balance", async () => {
        console.log("=== Testing Counter Account Balance ===");
        const balance = await getBalance(connection, counterAccount.publicKey);
        console.log(`✅ Counter account balance test completed: ${balance} lamports`);
    });
    (0, vitest_1.test)("Increment counter", async () => {
        console.log("=== Testing Counter Increment ===");
        // Read initial counter value
        const initialCounter = await readCounter(connection, counterAccount.publicKey);
        console.log(`Initial counter value: ${initialCounter}`);
        // Create increment instruction
        console.log("Creating increment instruction...");
        const ix = new web3.TransactionInstruction({
            keys: [
                {
                    pubkey: counterAccount.publicKey,
                    isSigner: false,
                    isWritable: true,
                },
            ],
            programId: programID,
            data: Buffer.alloc(0),
        });
        console.log("✅ Increment instruction created");
        // Send transaction
        console.log("Sending increment transaction...");
        const tx = new web3.Transaction().add(ix);
        const signature = await web3.sendAndConfirmTransaction(connection, tx, [
            payer,
        ]);
        console.log("✅ Increment transaction successful");
        console.log(`Transaction signature: ${signature}`);
        // Read updated counter value
        const updatedCounter = await readCounter(connection, counterAccount.publicKey);
        console.log(`Updated counter value: ${updatedCounter}`);
        console.log(`Counter increment: ${updatedCounter - initialCounter}`);
        // Verify increment
        (0, vitest_1.expect)(updatedCounter).toBe(initialCounter + 1);
        console.log("✅ Counter increment verification passed");
    });
});
