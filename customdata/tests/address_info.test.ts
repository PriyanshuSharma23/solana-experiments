import * as fs from "fs";
import * as os from "os";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { deserialize, serialize } from "@dao-xyz/borsh";
import { ADDRESS_INFO_SIZE, AddressInfo } from "./address_info";

const wallet = os.homedir() + "/.config/solana/id.json";

const PROGRAM_ID = "J53JCc6CzbzYc371kv9FTdTDKdnuT5GPSCJ42qiYFfJG";

describe("Custom data test solana", () => {
  let connection: Connection;
  let payer: Keypair;
  let programID: PublicKey;

  beforeAll(async () => {
    console.log("🔧 Setting up Solana connection...");
    connection = new Connection("https://api.devnet.solana.com");
    console.log("✅ Connected to Solana devnet");

    console.log("🔑 Loading wallet from:", wallet);
    try {
      payer = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(fs.readFileSync(wallet, "utf8")))
      );
      console.log("✅ Wallet loaded successfully");
      console.log("💰 Payer public key:", payer.publicKey.toString());
    } catch (error) {
      console.error("❌ Failed to load wallet:", error);
      throw error;
    }

    programID = new PublicKey(PROGRAM_ID);
    console.log("🎯 Program ID:", programID.toString());
  });

  it("read the account with custom data", async () => {
    const accountID = new PublicKey(
      "DTBffX7rQiRxUWNFcTgNpULpx7fyEs5i4u4U7e37XRDt"
    );

    console.log("🔍 Fetching account info for:", accountID.toString());
    const account = await connection.getAccountInfo(accountID);

    if (!account) {
      console.error("❌ Account not found on chain:", accountID.toString());
      throw new Error("Account not found");
    }

    console.log("✅ Account found. Data length:", account.data.length, "bytes");
    console.log(
      "📦 Raw account data (base64):",
      account.data.toString("base64")
    );

    let addressInfoDeserialized;
    try {
      addressInfoDeserialized = deserialize(account.data, AddressInfo);
      console.log("✅ Successfully deserialized AddressInfo:");
      console.log("   Name:", addressInfoDeserialized.name);
      console.log("   House Number:", addressInfoDeserialized.houseNumber);
      console.log("   Street:", addressInfoDeserialized.street);
      console.log("   City:", addressInfoDeserialized.city);
    } catch (err) {
      console.error("❌ Failed to deserialize AddressInfo:", err);
      throw err;
    }
  });

  //   it("should store address info on the blockchain", async () => {
  //     console.log("\n🚀 Starting address info storage test...");

  //     const addressInfoAccount = Keypair.generate();
  //     console.log(
  //       "📝 Generated new account:",
  //       addressInfoAccount.publicKey.toString()
  //     );

  //     // Note: The Rust program will create the account internally
  //     console.log("📝 Account will be created by the program");

  //     const addressInfo = new AddressInfo({
  //       name: "John Doe",
  //       houseNumber: 123,
  //       street: "Main St",
  //       city: "Anytown",
  //     });

  //     console.log("📋 Address info to store:", {
  //       name: addressInfo.name,
  //       houseNumber: addressInfo.houseNumber,
  //       street: addressInfo.street,
  //       city: addressInfo.city,
  //     });

  //     console.log("🔧 Creating transaction instruction...");
  //     const serializedData = serialize(addressInfo);
  //     console.log("📦 Serialized data length:", serializedData.length, "bytes");

  //     const ix = new TransactionInstruction({
  //       keys: [
  //         {
  //           pubkey: addressInfoAccount.publicKey,
  //           isSigner: true, // Must be signer because program creates it
  //           isWritable: true,
  //         },
  //         {
  //           pubkey: payer.publicKey,
  //           isSigner: true, // Must be signer to pay for transaction
  //           isWritable: true,
  //         },
  //         {
  //           pubkey: SystemProgram.programId,
  //           isSigner: false, // System program is never a signer
  //           isWritable: false,
  //         },
  //       ],
  //       programId: programID,
  //       data: Buffer.from(serializedData),
  //     });
  //     console.log("✅ Transaction instruction created");

  //     const tx = new Transaction().add(ix);
  //     console.log("📤 Sending transaction to Solana...");

  //     try {
  //       const signature = await sendAndConfirmTransaction(connection, tx, [
  //         payer,
  //         addressInfoAccount,
  //       ]);
  //       console.log("✅ Transaction confirmed!");
  //       console.log("🔗 Transaction signature:", signature);
  //       console.log(
  //         "🔍 View on Solana Explorer: https://explorer.solana.com/tx/" +
  //           signature +
  //           "?cluster=devnet"
  //       );
  //     } catch (error) {
  //       console.error("❌ Transaction failed:", error);

  //       // Get detailed logs if it's a SendTransactionError
  //       if (error && typeof error === "object" && "getLogs" in error) {
  //         try {
  //           const logs = await (error as any).getLogs();
  //           console.error("📋 Transaction logs:", logs);
  //         } catch (logError) {
  //           console.error("❌ Failed to get logs:", logError);
  //         }
  //       }

  //       throw error;
  //     }

  //     console.log("🔍 Fetching account data from blockchain...");
  //     const accountInfo = await connection.getAccountInfo(
  //       addressInfoAccount.publicKey
  //     );

  //     expect(accountInfo).not.toBeNull();
  //     console.log("✅ Account found on blockchain");
  //     console.log("📊 Account data size:", accountInfo?.data.length, "bytes");
  //     console.log("📏 Expected size:", ADDRESS_INFO_SIZE, "bytes");

  //     expect(accountInfo?.data.length).toBe(ADDRESS_INFO_SIZE);

  //     console.log("🔄 Deserializing data from blockchain...");
  //     const addressInfoDeserialized = deserialize(
  //       accountInfo!.data!,
  //       AddressInfo
  //     );
  //     console.log("✅ Data deserialized successfully");

  //     console.log("🔍 Verifying stored data...");
  //     console.log("📋 Original data:", {
  //       name: addressInfo.name,
  //       houseNumber: addressInfo.houseNumber,
  //       street: addressInfo.street,
  //       city: addressInfo.city,
  //     });
  //     console.log("📋 Retrieved data:", {
  //       name: addressInfoDeserialized.name,
  //       houseNumber: addressInfoDeserialized.houseNumber,
  //       street: addressInfoDeserialized.street,
  //       city: addressInfoDeserialized.city,
  //     });

  //     expect(addressInfoDeserialized.name).toBe(addressInfo.name);
  //     expect(addressInfoDeserialized.houseNumber).toBe(addressInfo.houseNumber);
  //     expect(addressInfoDeserialized.street).toBe(addressInfo.street);
  //     expect(addressInfoDeserialized.city).toBe(addressInfo.city);

  //     console.log(
  //       "🎉 All assertions passed! Data stored and retrieved successfully!"
  //     );
  //   });
});
