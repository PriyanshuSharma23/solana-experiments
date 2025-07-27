use crate::{instructions, state::address_info::AddressInfo};
use borsh::BorshDeserialize;
use solana_program::{
    account_info::AccountInfo, entrypoint::ProgramResult, msg, program_error::ProgramError,
    pubkey::Pubkey,
};

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    match AddressInfo::try_from_slice(instruction_data) {
        Ok(address_info) => {
            return instructions::create::create_address_info(program_id, accounts, address_info);
        }
        Err(e) => {
            msg!("Error: {}", e);
            return Err(ProgramError::InvalidInstructionData);
        }
    }
}
