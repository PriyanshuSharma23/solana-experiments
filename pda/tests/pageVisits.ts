import { Schema } from "borsh";

export const programID = "31mVoUYYrm4ar753GSd1TxEuNpYNn88emuyGnzqEZFpc";

export class PageVisits {
  visits: number;
  bump: number;

  constructor(fields?: Partial<PageVisits>) {
    this.visits = fields?.visits ?? 0;
    this.bump = fields?.bump ?? 0;
  }
}

export const PageVisitsSchema: Schema = {
  struct: {
    visits: "u32",
    bump: "u8",
  },
};

export class IncrementPageVisits {
  constructor(_: Partial<IncrementPageVisits> = {}) {}
}

export const IncrementPageVisitsScema: Schema = {
  struct: {},
};
