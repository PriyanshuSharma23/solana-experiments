import { Schema } from "borsh";

export const programID = "2wRXQptrQ5JnEWWpeBcymaKGWXMgvUbUmgoL2wSyXKSi";

enum InstructionType {
  Initialize,
  Increment,
}

export class PageVisits {
  visits: number;
  bump: number;

  constructor(fields?: Partial<PageVisits>) {
    this.visits = fields?.visits ?? 0;
    this.bump = fields?.bump ?? 0;
  }
}

export class IncrementPageVisits {
  constructor(_: Partial<IncrementPageVisits> = {}) {}
}

export const PageVisitsSchema: Schema = {
  struct: {
    visits: "u32",
    bump: "u8",
  },
};

export const IncrementPageVisitsScema: Schema = {
  struct: {},
};

export const InstructionSchema: Schema = {
  enum: [
    {
      struct: {
        Initialize: PageVisitsSchema,
      },
    },
    {
      struct: {
        Increment: IncrementPageVisitsScema,
      },
    },
  ],
};
