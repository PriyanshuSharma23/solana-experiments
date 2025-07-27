# Solana Hello World Testing

This project contains tests for a Solana Hello World program deployment.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Solana CLI (optional, for local development)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Build the project:

```bash
npm run build
```

## Testing

Run the tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests directly with ts-node:

```bash
npm run dev
```

## Project Structure

- `test.ts` - Main test file for the Solana Hello World program
- `package.json` - Project configuration and dependencies
- `tsconfig.json` - TypeScript configuration
- `.gitignore` - Git ignore patterns

## Dependencies

- `@solana/web3.js` - Solana Web3.js library for interacting with Solana blockchain
- `@coral-xyz/anchor` - Anchor framework for Solana program development
- `typescript` - TypeScript compiler
- `ts-node` - TypeScript execution engine
- `@types/node` - Node.js type definitions

## Test Details

The test file (`test.ts`) performs the following operations:

1. Creates a connection to Solana devnet
2. Generates a new keypair for testing
3. Requests an airdrop of 1 SOL to the test account
4. Sends a transaction to the Hello World program
5. Confirms the transaction and logs the signature

The program ID used in the test is: `EC82sUoMB92F1yCkT2k1EzEP2pKCmPjdXy1dNVhyehJ2`
