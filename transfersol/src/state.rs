use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub enum Instruction {
    CpiTransfer(u64),
    ProgramTransfer(u64),
}
