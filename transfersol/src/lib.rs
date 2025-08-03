use borsh::BorshDeserialize;
use solana_program::entrypoint;
use solana_program::{
    account_info::AccountInfo, entrypoint::ProgramResult, msg, program_error::ProgramError,
    pubkey::Pubkey,
};

use crate::state::Instruction;

mod instruction;
mod state;

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!("[INFO] Invoked Transfer SOL program");

    match Instruction::try_from_slice(instruction_data).map_err(|err| {
        msg!("[ERROR] Invalid instruction data: {}", err);
        ProgramError::InvalidInstructionData
    })? {
        Instruction::CpiTransfer(amount) => instruction::transfer_sol_with_cpi(accounts, amount),
        Instruction::ProgramTransfer(amount) => {
            instruction::transfer_sol_with_program(program_id, accounts, amount)
        }
    }
}
