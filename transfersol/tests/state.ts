import { Schema } from "borsh";

export const InstructionSchema: Schema = {
  enum: [
    {
      struct: {
        CpiTransfer: {
          struct: {
            amount: "u64",
          },
        },
      },
    },
    {
      struct: {
        ProgramTransfer: {
          struct: {
            amount: "u64",
          },
        },
      },
    },
  ],
};

export class Instruction {
  amount: number;

  constructor(amount: number) {
    this.amount = amount;
  }
}
