import { Connection, PublicKey } from '@solana/web3.js';

describe('Solana Program Tests', () => {
  let connection: Connection;

  beforeAll(() => {
    connection = new Connection('http://localhost:8899', 'confirmed');
  });

  test('example test', () => {
    expect(1 + 1).toBe(2);
  });

  test('connection test', async () => {
    const version = await connection.getVersion();
    expect(version).toBeDefined();
  });
});